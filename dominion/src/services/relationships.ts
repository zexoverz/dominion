/**
 * Relationship Service - Inter-general relationship tracking
 * Manages 21 pairwise relationships between 7 generals with trust, alignment, tension
 */

import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

// === TYPES & INTERFACES ===

export interface RelationshipAttributes {
  trust: number;       // 0-100: reliability and faith in the other general
  alignment: number;   // 0-100: strategic agreement and shared goals
  tension: number;     // 0-100: unresolved conflict and friction
  lastInteraction: Date;
}

export interface Relationship {
  id: string;
  generalA: string;
  generalB: string;
  trust: number;
  alignment: number;
  tension: number;
  lastInteraction: Date;
  totalInteractions: number;
  positiveInteractions: number;
  negativeInteractions: number;
  history: RelationshipEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export type RelationshipEventType =
  | 'roundtable_agreement'
  | 'roundtable_disagreement'
  | 'successful_collaboration'
  | 'conflict_resolution'
  | 'vote_alignment'
  | 'vote_opposition'
  | 'mentoring'
  | 'task_delegation'
  | 'missed_commitment'
  | 'public_praise'
  | 'public_criticism'
  | 'emergency_cooperation';

export interface RelationshipEvent {
  type: RelationshipEventType;
  description: string;
  timestamp: string;
  deltas: { trust: number; alignment: number; tension: number };
  context?: string;
}

export interface RelationshipMatrix {
  generals: string[];
  trust: number[][];
  alignment: number[][];
  tension: number[][];
}

export interface RelationshipSummary {
  partner: string;
  trust: number;
  alignment: number;
  tension: number;
  totalInteractions: number;
  overallScore: number; // weighted composite
  label: 'ally' | 'neutral' | 'rival' | 'tense_ally' | 'reluctant_partner';
}

// === EVENT IMPACT CONFIGURATION ===

const EVENT_IMPACTS: Record<RelationshipEventType, { trust: number; alignment: number; tension: number }> = {
  roundtable_agreement:      { trust: 3,   alignment: 2,   tension: -2 },
  roundtable_disagreement:   { trust: -2,  alignment: -1,  tension: 4 },
  successful_collaboration:  { trust: 5,   alignment: 4,   tension: -3 },
  conflict_resolution:       { trust: 4,   alignment: 2,   tension: -8 },
  vote_alignment:            { trust: 2,   alignment: 3,   tension: -1 },
  vote_opposition:           { trust: -1,  alignment: -3,  tension: 3 },
  mentoring:                 { trust: 4,   alignment: 3,   tension: -2 },
  task_delegation:           { trust: 2,   alignment: 1,   tension: 0 },
  missed_commitment:         { trust: -6,  alignment: -2,  tension: 5 },
  public_praise:             { trust: 3,   alignment: 2,   tension: -3 },
  public_criticism:          { trust: -4,  alignment: -3,  tension: 6 },
  emergency_cooperation:     { trust: 6,   alignment: 5,   tension: -5 },
};

const ALL_GENERALS = ['throne', 'seer', 'phantom', 'grimoire', 'echo', 'mammon', 'wraith-eye'];

const BASELINE_TRUST = 50;
const BASELINE_ALIGNMENT = 50;
const BASELINE_TENSION = 20;
const DECAY_RATE_TENSION = 0.98;      // tension decays 2% per cycle
const DECAY_RATE_TRUST_TO_BASELINE = 0.995; // trust slowly regresses to baseline
const MIN_ATTRIBUTE = 0;
const MAX_ATTRIBUTE = 100;
const MAX_HISTORY_ENTRIES = 50;

// === SERVICE CLASS ===

export class RelationshipService {
  constructor(private db: Pool) {}

  /**
   * Update relationship between two generals based on an event
   */
  async updateRelationship(
    generalA: string,
    generalB: string,
    event: RelationshipEventType,
    description: string = '',
    context?: string
  ): Promise<Relationship> {
    const [sortedA, sortedB] = this.sortPair(generalA, generalB);
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Get or create relationship
      let relationship = await this.getRelationshipRow(client, sortedA, sortedB);

      if (!relationship) {
        relationship = await this.createRelationship(client, sortedA, sortedB);
      }

      // Calculate deltas
      const impact = EVENT_IMPACTS[event];
      if (!impact) {
        throw new Error(`Unknown relationship event type: ${event}`);
      }

      // Apply deltas with some randomness (±20%)
      const jitter = () => 0.8 + Math.random() * 0.4;
      const trustDelta = Math.round(impact.trust * jitter());
      const alignmentDelta = Math.round(impact.alignment * jitter());
      const tensionDelta = Math.round(impact.tension * jitter());

      const newTrust = this.clamp(relationship.trust + trustDelta);
      const newAlignment = this.clamp(relationship.alignment + alignmentDelta);
      const newTension = this.clamp(relationship.tension + tensionDelta);

      // Build history event
      const historyEvent: RelationshipEvent = {
        type: event,
        description: description || `${event} between ${generalA} and ${generalB}`,
        timestamp: new Date().toISOString(),
        deltas: { trust: trustDelta, alignment: alignmentDelta, tension: tensionDelta },
        context,
      };

      const history: RelationshipEvent[] = relationship.history || [];
      history.push(historyEvent);
      const trimmedHistory = history.slice(-MAX_HISTORY_ENTRIES);

      // Update counters
      const isPositive = trustDelta > 0 || alignmentDelta > 0;
      const isNegative = trustDelta < 0 || tensionDelta > 0;

      await client.query(`
        UPDATE general_relationships SET
          trust = $1, alignment = $2, tension = $3,
          last_interaction = NOW(), total_interactions = total_interactions + 1,
          positive_interactions = positive_interactions + $4,
          negative_interactions = negative_interactions + $5,
          history = $6, updated_at = NOW()
        WHERE general_a = $7 AND general_b = $8
      `, [
        newTrust, newAlignment, newTension,
        isPositive ? 1 : 0,
        isNegative ? 1 : 0,
        JSON.stringify(trimmedHistory),
        sortedA, sortedB,
      ]);

      await client.query('COMMIT');

      const updated = await this.getRelationshipRow(client, sortedA, sortedB);

      console.log(`🤝 Relationship updated: ${sortedA}↔${sortedB} [${event}] T:${newTrust} A:${newAlignment} X:${newTension}`);

      return updated!;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Failed to update relationship ${generalA}↔${generalB}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get the full 7×7 relationship matrix
   */
  async getRelationshipMatrix(): Promise<RelationshipMatrix> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        'SELECT * FROM general_relationships ORDER BY general_a, general_b'
      );

      const n = ALL_GENERALS.length;
      const trust: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
      const alignment: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
      const tension: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

      // Diagonal = self (100 trust, 100 alignment, 0 tension)
      for (let i = 0; i < n; i++) {
        trust[i][i] = 100;
        alignment[i][i] = 100;
        tension[i][i] = 0;
      }

      for (const row of result.rows) {
        const iA = ALL_GENERALS.indexOf(row.general_a);
        const iB = ALL_GENERALS.indexOf(row.general_b);

        if (iA === -1 || iB === -1) continue;

        const t = parseFloat(row.trust);
        const a = parseFloat(row.alignment);
        const x = parseFloat(row.tension);

        // Symmetric
        trust[iA][iB] = t;
        trust[iB][iA] = t;
        alignment[iA][iB] = a;
        alignment[iB][iA] = a;
        tension[iA][iB] = x;
        tension[iB][iA] = x;
      }

      return { generals: [...ALL_GENERALS], trust, alignment, tension };

    } finally {
      client.release();
    }
  }

  /**
   * Get strongest allies for a general
   */
  async getStrongestAllies(generalId: string, limit: number = 3): Promise<RelationshipSummary[]> {
    const summaries = await this.getRelationshipSummaries(generalId);
    return summaries
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);
  }

  /**
   * Get rivals for a general
   */
  async getRivals(generalId: string, limit: number = 3): Promise<RelationshipSummary[]> {
    const summaries = await this.getRelationshipSummaries(generalId);
    return summaries
      .sort((a, b) => a.overallScore - b.overallScore)
      .slice(0, limit);
  }

  /**
   * Get all relationship summaries for a general
   */
  async getRelationshipSummaries(generalId: string): Promise<RelationshipSummary[]> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        'SELECT * FROM general_relationships WHERE general_a = $1 OR general_b = $1',
        [generalId]
      );

      return result.rows.map(row => {
        const partner = row.general_a === generalId ? row.general_b : row.general_a;
        const trust = parseFloat(row.trust);
        const alignment = parseFloat(row.alignment);
        const tension = parseFloat(row.tension);
        const overallScore = this.computeOverallScore(trust, alignment, tension);

        return {
          partner,
          trust,
          alignment,
          tension,
          totalInteractions: row.total_interactions,
          overallScore,
          label: this.classifyRelationship(trust, alignment, tension),
        };
      });

    } finally {
      client.release();
    }
  }

  /**
   * Apply time-based decay to all relationships
   * - Tension decreases over time
   * - Trust slowly regresses toward baseline
   */
  async applyDecay(): Promise<number> {
    const client = await this.db.connect();

    try {
      const result = await client.query('SELECT * FROM general_relationships');
      let updated = 0;

      for (const row of result.rows) {
        const currentTrust = parseFloat(row.trust);
        const currentTension = parseFloat(row.tension);

        // Decay tension
        const newTension = Math.max(MIN_ATTRIBUTE, Math.round(currentTension * DECAY_RATE_TENSION));

        // Regress trust toward baseline
        const trustDiff = currentTrust - BASELINE_TRUST;
        const newTrust = this.clamp(Math.round(BASELINE_TRUST + trustDiff * DECAY_RATE_TRUST_TO_BASELINE));

        if (newTension !== Math.round(currentTension) || newTrust !== Math.round(currentTrust)) {
          await client.query(
            'UPDATE general_relationships SET trust = $1, tension = $2, updated_at = NOW() WHERE general_a = $3 AND general_b = $4',
            [newTrust, newTension, row.general_a, row.general_b]
          );
          updated++;
        }
      }

      if (updated > 0) {
        console.log(`⏳ Relationship decay applied to ${updated} pairs`);
      }

      return updated;

    } finally {
      client.release();
    }
  }

  /**
   * Initialize all 21 pairwise relationships (idempotent)
   */
  async initializeRelationships(): Promise<number> {
    const client = await this.db.connect();
    let created = 0;

    try {
      for (let i = 0; i < ALL_GENERALS.length; i++) {
        for (let j = i + 1; j < ALL_GENERALS.length; j++) {
          const [a, b] = this.sortPair(ALL_GENERALS[i], ALL_GENERALS[j]);

          const exists = await client.query(
            'SELECT id FROM general_relationships WHERE general_a = $1 AND general_b = $2',
            [a, b]
          );

          if (exists.rows.length === 0) {
            await client.query(`
              INSERT INTO general_relationships (
                id, general_a, general_b, trust, alignment, tension,
                last_interaction, total_interactions, positive_interactions,
                negative_interactions, history, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), 0, 0, 0, '[]', NOW(), NOW())
            `, [uuid(), a, b, BASELINE_TRUST, BASELINE_ALIGNMENT, BASELINE_TENSION]);
            created++;
          }
        }
      }

      if (created > 0) {
        console.log(`🤝 Initialized ${created} new pairwise relationships`);
      }

      return created;

    } finally {
      client.release();
    }
  }

  /**
   * Get relationship between two specific generals
   */
  async getRelationship(generalA: string, generalB: string): Promise<Relationship | null> {
    const [a, b] = this.sortPair(generalA, generalB);
    const client = await this.db.connect();

    try {
      return await this.getRelationshipRow(client, a, b);
    } finally {
      client.release();
    }
  }

  /**
   * Get pairs with high tension (for conflict resolution scheduling)
   */
  async getHighTensionPairs(threshold: number = 60): Promise<Array<{ generalA: string; generalB: string; tension: number }>> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        'SELECT general_a, general_b, tension FROM general_relationships WHERE tension >= $1 ORDER BY tension DESC',
        [threshold]
      );

      return result.rows.map(r => ({
        generalA: r.general_a,
        generalB: r.general_b,
        tension: parseFloat(r.tension),
      }));

    } finally {
      client.release();
    }
  }

  /**
   * Get pairs with high trust (for collaboration scheduling)
   */
  async getHighTrustPairs(threshold: number = 75): Promise<Array<{ generalA: string; generalB: string; trust: number }>> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        'SELECT general_a, general_b, trust FROM general_relationships WHERE trust >= $1 ORDER BY trust DESC',
        [threshold]
      );

      return result.rows.map(r => ({
        generalA: r.general_a,
        generalB: r.general_b,
        trust: parseFloat(r.trust),
      }));

    } finally {
      client.release();
    }
  }

  /**
   * Bulk update from roundtable results
   */
  async updateFromRoundtable(
    roundtableId: string,
    agreements: Array<{ generalA: string; generalB: string }>,
    disagreements: Array<{ generalA: string; generalB: string }>,
    voteAlignments: Array<{ generalA: string; generalB: string }>,
    voteOppositions: Array<{ generalA: string; generalB: string }>
  ): Promise<void> {
    const context = `roundtable:${roundtableId}`;

    for (const { generalA, generalB } of agreements) {
      await this.updateRelationship(generalA, generalB, 'roundtable_agreement', '', context);
    }

    for (const { generalA, generalB } of disagreements) {
      await this.updateRelationship(generalA, generalB, 'roundtable_disagreement', '', context);
    }

    for (const { generalA, generalB } of voteAlignments) {
      await this.updateRelationship(generalA, generalB, 'vote_alignment', '', context);
    }

    for (const { generalA, generalB } of voteOppositions) {
      await this.updateRelationship(generalA, generalB, 'vote_opposition', '', context);
    }

    console.log(`🤝 Bulk relationship update from roundtable ${roundtableId}: ${agreements.length} agreements, ${disagreements.length} disagreements`);
  }

  /**
   * Get system-wide relationship health metrics
   */
  async getSystemHealth(): Promise<{
    avgTrust: number;
    avgAlignment: number;
    avgTension: number;
    highTensionCount: number;
    strongAllianceCount: number;
    totalInteractions: number;
  }> {
    const client = await this.db.connect();

    try {
      const result = await client.query(`
        SELECT
          AVG(trust) as avg_trust,
          AVG(alignment) as avg_alignment,
          AVG(tension) as avg_tension,
          COUNT(*) FILTER (WHERE tension >= 60) as high_tension,
          COUNT(*) FILTER (WHERE trust >= 75 AND alignment >= 70) as strong_alliances,
          SUM(total_interactions) as total_interactions
        FROM general_relationships
      `);

      const row = result.rows[0];
      return {
        avgTrust: parseFloat(row.avg_trust) || BASELINE_TRUST,
        avgAlignment: parseFloat(row.avg_alignment) || BASELINE_ALIGNMENT,
        avgTension: parseFloat(row.avg_tension) || BASELINE_TENSION,
        highTensionCount: parseInt(row.high_tension) || 0,
        strongAllianceCount: parseInt(row.strong_alliances) || 0,
        totalInteractions: parseInt(row.total_interactions) || 0,
      };

    } finally {
      client.release();
    }
  }

  // === PRIVATE METHODS ===

  private sortPair(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
  }

  private clamp(value: number): number {
    return Math.max(MIN_ATTRIBUTE, Math.min(MAX_ATTRIBUTE, value));
  }

  private computeOverallScore(trust: number, alignment: number, tension: number): number {
    // Weighted composite: trust 40%, alignment 35%, inverse tension 25%
    return (trust * 0.4) + (alignment * 0.35) + ((100 - tension) * 0.25);
  }

  private classifyRelationship(trust: number, alignment: number, tension: number): RelationshipSummary['label'] {
    const score = this.computeOverallScore(trust, alignment, tension);

    if (score >= 70 && tension < 30) return 'ally';
    if (score >= 60 && tension >= 30) return 'tense_ally';
    if (score <= 35) return 'rival';
    if (score <= 50 && tension >= 40) return 'reluctant_partner';
    return 'neutral';
  }

  private async getRelationshipRow(client: any, generalA: string, generalB: string): Promise<Relationship | null> {
    const result = await client.query(
      'SELECT * FROM general_relationships WHERE general_a = $1 AND general_b = $2',
      [generalA, generalB]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      generalA: row.general_a,
      generalB: row.general_b,
      trust: parseFloat(row.trust),
      alignment: parseFloat(row.alignment),
      tension: parseFloat(row.tension),
      lastInteraction: new Date(row.last_interaction),
      totalInteractions: row.total_interactions,
      positiveInteractions: row.positive_interactions,
      negativeInteractions: row.negative_interactions,
      history: typeof row.history === 'string' ? JSON.parse(row.history) : (row.history || []),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private async createRelationship(client: any, generalA: string, generalB: string): Promise<Relationship> {
    const id = uuid();
    const now = new Date();

    await client.query(`
      INSERT INTO general_relationships (
        id, general_a, general_b, trust, alignment, tension,
        last_interaction, total_interactions, positive_interactions,
        negative_interactions, history, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, 0, '[]', $7, $7)
    `, [id, generalA, generalB, BASELINE_TRUST, BASELINE_ALIGNMENT, BASELINE_TENSION, now]);

    return {
      id,
      generalA,
      generalB,
      trust: BASELINE_TRUST,
      alignment: BASELINE_ALIGNMENT,
      tension: BASELINE_TENSION,
      lastInteraction: now,
      totalInteractions: 0,
      positiveInteractions: 0,
      negativeInteractions: 0,
      history: [],
      createdAt: now,
      updatedAt: now,
    };
  }
}

export default RelationshipService;
