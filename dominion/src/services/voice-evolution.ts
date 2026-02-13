/**
 * Voice Evolution Service - Personality evolution for generals
 * Tracks trait changes over time based on interactions and context
 * Generates dynamic system prompts incorporating evolved traits
 */

import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

// === TYPES & INTERFACES ===

export type TraitName = 'formality' | 'humor' | 'directness' | 'verbosity' | 'confidence' | 'creativity';

export interface TraitValues {
  formality: number;   // 0-100: casual ↔ formal
  humor: number;       // 0-100: serious ↔ humorous
  directness: number;  // 0-100: diplomatic ↔ blunt
  verbosity: number;   // 0-100: terse ↔ verbose
  confidence: number;  // 0-100: cautious ↔ assertive
  creativity: number;  // 0-100: conventional ↔ creative
}

export interface VoiceProfile {
  generalId: string;
  baseTraits: TraitValues;
  currentTraits: TraitValues;
  traitDrifts: TraitValues; // accumulated drift from base
  totalEvolutions: number;
  lastEvolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvolutionContext {
  source: 'roundtable' | 'proposal' | 'mission_success' | 'mission_failure' | 'conflict' | 'collaboration' | 'feedback';
  description: string;
  relatedGenerals?: string[];
  intensity?: number; // 0.0-1.0, defaults to 0.5
  metadata?: Record<string, any>;
}

export interface EvolutionLogEntry {
  id: string;
  generalId: string;
  context: EvolutionContext;
  traitsBefore: TraitValues;
  traitsAfter: TraitValues;
  deltas: Partial<TraitValues>;
  createdAt: Date;
}

// === BASE PERSONALITY CONFIGURATIONS ===

const BASE_PERSONALITIES: Record<string, TraitValues> = {
  throne: {
    formality: 80, humor: 20, directness: 90, verbosity: 30, confidence: 95, creativity: 50,
  },
  seer: {
    formality: 70, humor: 15, directness: 60, verbosity: 65, confidence: 75, creativity: 55,
  },
  phantom: {
    formality: 30, humor: 25, directness: 95, verbosity: 15, confidence: 80, creativity: 60,
  },
  grimoire: {
    formality: 75, humor: 40, directness: 50, verbosity: 70, confidence: 70, creativity: 65,
  },
  echo: {
    formality: 25, humor: 70, directness: 75, verbosity: 55, confidence: 85, creativity: 80,
  },
  mammon: {
    formality: 85, humor: 10, directness: 80, verbosity: 40, confidence: 90, creativity: 20,
  },
  'wraith-eye': {
    formality: 90, humor: 5, directness: 85, verbosity: 10, confidence: 95, creativity: 30,
  },
};

// Maximum drift from base personality (in either direction)
const MAX_DRIFT = 15;

// How much a single evolution can shift a trait
const MAX_EVOLUTION_STEP = 3;

// Context-to-trait influence mapping
const CONTEXT_TRAIT_INFLUENCES: Record<EvolutionContext['source'], Partial<Record<TraitName, number>>> = {
  roundtable:       { formality: 0.5, directness: 0.8, verbosity: 0.3, confidence: 0.4 },
  proposal:         { formality: 0.6, confidence: 0.7, creativity: 0.5 },
  mission_success:  { confidence: 1.0, creativity: 0.3, humor: 0.2 },
  mission_failure:  { confidence: -0.5, directness: 0.3, humor: -0.3 },
  conflict:         { directness: 0.6, tension_proxy: 0.8 } as any, // tension_proxy mapped to formality decrease
  collaboration:    { humor: 0.3, verbosity: 0.2, creativity: 0.4 },
  feedback:         { formality: 0.3, directness: 0.4, confidence: 0.3 },
};

// Trait descriptors for prompt generation
const TRAIT_DESCRIPTORS: Record<TraitName, { low: string; mid: string; high: string }> = {
  formality: {
    low: 'casual and informal, uses slang and abbreviations',
    mid: 'balanced formality, professional but approachable',
    high: 'highly formal and structured in communication',
  },
  humor: {
    low: 'serious and focused, rarely uses humor',
    mid: 'occasionally uses wit to make points',
    high: 'frequently injects humor and playfulness into conversations',
  },
  directness: {
    low: 'diplomatic and tactful, wraps criticism in suggestions',
    mid: 'balanced between directness and tact',
    high: 'blunt and direct, says exactly what needs to be said',
  },
  verbosity: {
    low: 'extremely concise, uses minimal words',
    mid: 'moderately detailed in explanations',
    high: 'thorough and detailed, provides extensive context',
  },
  confidence: {
    low: 'hedges opinions, uses qualifiers like "maybe" and "perhaps"',
    mid: 'confident but open to other perspectives',
    high: 'speaks with strong conviction and authority',
  },
  creativity: {
    low: 'conventional and methodical, sticks to proven approaches',
    mid: 'occasionally proposes novel ideas alongside traditional methods',
    high: 'innovative thinker, frequently suggests unconventional approaches',
  },
};

// === SERVICE CLASS ===

export class VoiceEvolutionService {
  constructor(private db: Pool) {}

  /**
   * Evolve a general's voice based on context
   * Returns the updated voice profile
   */
  async evolveVoice(generalId: string, context: EvolutionContext): Promise<VoiceProfile> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // Get or create profile
      let profile = await this.getVoiceProfileRow(client, generalId);
      if (!profile) {
        profile = await this.createProfile(client, generalId);
      }

      const traitsBefore = { ...profile.currentTraits };
      const intensity = context.intensity ?? 0.5;

      // Calculate trait deltas based on context
      const influences = CONTEXT_TRAIT_INFLUENCES[context.source] || {};
      const deltas: Partial<TraitValues> = {};

      for (const [trait, influence] of Object.entries(influences) as Array<[TraitName, number]>) {
        if (trait === 'tension_proxy') continue; // special handling

        const baseValue = profile.baseTraits[trait];
        const currentValue = profile.currentTraits[trait];
        if (baseValue === undefined || currentValue === undefined) continue;

        // Direction: positive influence → increase trait, negative → decrease
        const direction = influence > 0 ? 1 : -1;
        const magnitude = Math.abs(influence) * intensity * MAX_EVOLUTION_STEP;

        // Add randomness (±30%)
        const jitter = 0.7 + Math.random() * 0.6;
        let delta = Math.round(direction * magnitude * jitter);

        // Enforce drift boundary
        const currentDrift = currentValue - baseValue;
        if (Math.abs(currentDrift + delta) > MAX_DRIFT) {
          delta = (MAX_DRIFT * Math.sign(currentDrift + delta)) - currentDrift;
        }

        if (delta !== 0) {
          deltas[trait] = delta;
        }
      }

      // Handle conflict → decrease formality
      if (context.source === 'conflict' && (influences as any).tension_proxy) {
        const formalityDelta = -Math.round(intensity * 2);
        const currentDrift = profile.currentTraits.formality - profile.baseTraits.formality;
        if (Math.abs(currentDrift + formalityDelta) <= MAX_DRIFT) {
          deltas.formality = (deltas.formality || 0) + formalityDelta;
        }
      }

      // Apply deltas
      const traitsAfter: TraitValues = { ...traitsBefore };
      for (const [trait, delta] of Object.entries(deltas) as Array<[TraitName, number]>) {
        traitsAfter[trait] = this.clampTrait(traitsAfter[trait] + delta);
      }

      // Compute new drift values
      const traitDrifts: TraitValues = {
        formality: traitsAfter.formality - profile.baseTraits.formality,
        humor: traitsAfter.humor - profile.baseTraits.humor,
        directness: traitsAfter.directness - profile.baseTraits.directness,
        verbosity: traitsAfter.verbosity - profile.baseTraits.verbosity,
        confidence: traitsAfter.confidence - profile.baseTraits.confidence,
        creativity: traitsAfter.creativity - profile.baseTraits.creativity,
      };

      // Update profile in DB
      await client.query(`
        UPDATE voice_evolution SET
          current_traits = $1, trait_drifts = $2,
          total_evolutions = total_evolutions + 1,
          last_evolved_at = NOW(), updated_at = NOW()
        WHERE general_id = $3
      `, [JSON.stringify(traitsAfter), JSON.stringify(traitDrifts), generalId]);

      // Log the evolution
      const logId = uuid();
      await client.query(`
        INSERT INTO voice_evolution_log (
          id, general_id, context, traits_before, traits_after, deltas, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [
        logId, generalId,
        JSON.stringify(context),
        JSON.stringify(traitsBefore),
        JSON.stringify(traitsAfter),
        JSON.stringify(deltas),
      ]);

      await client.query('COMMIT');

      const deltaStr = Object.entries(deltas).map(([k, v]) => `${k}:${v > 0 ? '+' : ''}${v}`).join(' ');
      console.log(`🎭 Voice evolved for ${generalId}: ${deltaStr || 'no change'} [${context.source}]`);

      return {
        generalId,
        baseTraits: profile.baseTraits,
        currentTraits: traitsAfter,
        traitDrifts,
        totalEvolutions: profile.totalEvolutions + 1,
        lastEvolvedAt: new Date(),
        createdAt: profile.createdAt,
        updatedAt: new Date(),
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Failed to evolve voice for ${generalId}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get current voice profile for a general
   */
  async getVoiceProfile(generalId: string): Promise<VoiceProfile> {
    const client = await this.db.connect();

    try {
      let profile = await this.getVoiceProfileRow(client, generalId);
      if (!profile) {
        profile = await this.createProfile(client, generalId);
      }
      return profile;
    } finally {
      client.release();
    }
  }

  /**
   * Generate a dynamic system prompt incorporating evolved traits
   */
  async generateSystemPrompt(generalId: string, baseDirective?: string): Promise<string> {
    const profile = await this.getVoiceProfile(generalId);

    let prompt = baseDirective || '';

    // Add personality trait descriptions
    const traitDescriptions: string[] = [];

    for (const [trait, value] of Object.entries(profile.currentTraits) as Array<[TraitName, number]>) {
      const descriptors = TRAIT_DESCRIPTORS[trait];
      if (!descriptors) continue;

      let desc: string;
      if (value <= 33) desc = descriptors.low;
      else if (value <= 66) desc = descriptors.mid;
      else desc = descriptors.high;

      // Only include traits that have drifted significantly from base
      const drift = Math.abs(profile.traitDrifts[trait]);
      if (drift >= 5) {
        traitDescriptions.push(desc);
      }
    }

    if (traitDescriptions.length > 0) {
      prompt += '\n\nPersonality evolution (from accumulated experiences):';
      for (const desc of traitDescriptions) {
        prompt += `\n- ${desc}`;
      }
    }

    // Add trait-specific behavioral hints
    const hints = this.generateBehavioralHints(profile.currentTraits);
    if (hints.length > 0) {
      prompt += '\n\nBehavioral notes:';
      for (const hint of hints) {
        prompt += `\n- ${hint}`;
      }
    }

    return prompt;
  }

  /**
   * Get evolution history for a general
   */
  async getEvolutionHistory(generalId: string, limit: number = 20): Promise<EvolutionLogEntry[]> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        'SELECT * FROM voice_evolution_log WHERE general_id = $1 ORDER BY created_at DESC LIMIT $2',
        [generalId, limit]
      );

      return result.rows.map(row => ({
        id: row.id,
        generalId: row.general_id,
        context: typeof row.context === 'string' ? JSON.parse(row.context) : row.context,
        traitsBefore: typeof row.traits_before === 'string' ? JSON.parse(row.traits_before) : row.traits_before,
        traitsAfter: typeof row.traits_after === 'string' ? JSON.parse(row.traits_after) : row.traits_after,
        deltas: typeof row.deltas === 'string' ? JSON.parse(row.deltas) : row.deltas,
        createdAt: new Date(row.created_at),
      }));

    } finally {
      client.release();
    }
  }

  /**
   * Reset a general's traits back to base
   */
  async resetToBase(generalId: string): Promise<VoiceProfile> {
    const client = await this.db.connect();

    try {
      const base = BASE_PERSONALITIES[generalId];
      if (!base) throw new Error(`Unknown general: ${generalId}`);

      const zeroDrifts: TraitValues = {
        formality: 0, humor: 0, directness: 0, verbosity: 0, confidence: 0, creativity: 0,
      };

      await client.query(`
        UPDATE voice_evolution SET
          current_traits = $1, trait_drifts = $2, updated_at = NOW()
        WHERE general_id = $3
      `, [JSON.stringify(base), JSON.stringify(zeroDrifts), generalId]);

      console.log(`🎭 Voice reset to base for ${generalId}`);

      return await this.getVoiceProfile(generalId);

    } finally {
      client.release();
    }
  }

  /**
   * Initialize voice evolution profiles for all generals (idempotent)
   */
  async initializeProfiles(): Promise<number> {
    const client = await this.db.connect();
    let created = 0;

    try {
      for (const [generalId, baseTraits] of Object.entries(BASE_PERSONALITIES)) {
        const exists = await client.query(
          'SELECT general_id FROM voice_evolution WHERE general_id = $1',
          [generalId]
        );

        if (exists.rows.length === 0) {
          const zeroDrifts: TraitValues = {
            formality: 0, humor: 0, directness: 0, verbosity: 0, confidence: 0, creativity: 0,
          };

          await client.query(`
            INSERT INTO voice_evolution (
              general_id, base_traits, current_traits, trait_drifts,
              total_evolutions, last_evolved_at, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, 0, NULL, NOW(), NOW())
          `, [generalId, JSON.stringify(baseTraits), JSON.stringify(baseTraits), JSON.stringify(zeroDrifts)]);

          created++;
        }
      }

      if (created > 0) {
        console.log(`🎭 Initialized ${created} voice evolution profiles`);
      }

      return created;

    } finally {
      client.release();
    }
  }

  /**
   * Get all profiles for dashboard display
   */
  async getAllProfiles(): Promise<VoiceProfile[]> {
    const client = await this.db.connect();

    try {
      const result = await client.query('SELECT * FROM voice_evolution ORDER BY general_id');
      return result.rows.map(row => this.rowToProfile(row));
    } finally {
      client.release();
    }
  }

  // === PRIVATE METHODS ===

  private clampTrait(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  private generateBehavioralHints(traits: TraitValues): string[] {
    const hints: string[] = [];

    if (traits.confidence >= 85) {
      hints.push('Speak with authority. Avoid hedging unless genuinely uncertain.');
    } else if (traits.confidence <= 30) {
      hints.push('Express uncertainty openly. Use phrases like "I think" or "it seems".');
    }

    if (traits.directness >= 80 && traits.humor <= 25) {
      hints.push('Be sharp and to the point. No fluff.');
    }

    if (traits.humor >= 60 && traits.formality <= 40) {
      hints.push('Feel free to be playful. Drop in wit when it fits.');
    }

    if (traits.verbosity <= 20) {
      hints.push('Keep responses extremely short. Under 2 sentences when possible.');
    } else if (traits.verbosity >= 80) {
      hints.push('Provide thorough explanations with context and reasoning.');
    }

    if (traits.creativity >= 75) {
      hints.push('Think outside the box. Propose unconventional solutions.');
    }

    // Max 3 hints
    return hints.slice(0, 3);
  }

  private async getVoiceProfileRow(client: any, generalId: string): Promise<VoiceProfile | null> {
    const result = await client.query(
      'SELECT * FROM voice_evolution WHERE general_id = $1',
      [generalId]
    );

    if (result.rows.length === 0) return null;
    return this.rowToProfile(result.rows[0]);
  }

  private async createProfile(client: any, generalId: string): Promise<VoiceProfile> {
    const base = BASE_PERSONALITIES[generalId];
    if (!base) throw new Error(`Unknown general: ${generalId}. Known: ${Object.keys(BASE_PERSONALITIES).join(', ')}`);

    const zeroDrifts: TraitValues = {
      formality: 0, humor: 0, directness: 0, verbosity: 0, confidence: 0, creativity: 0,
    };

    await client.query(`
      INSERT INTO voice_evolution (
        general_id, base_traits, current_traits, trait_drifts,
        total_evolutions, last_evolved_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, 0, NULL, NOW(), NOW())
      ON CONFLICT (general_id) DO NOTHING
    `, [generalId, JSON.stringify(base), JSON.stringify(base), JSON.stringify(zeroDrifts)]);

    return {
      generalId,
      baseTraits: { ...base },
      currentTraits: { ...base },
      traitDrifts: { ...zeroDrifts },
      totalEvolutions: 0,
      lastEvolvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private rowToProfile(row: any): VoiceProfile {
    const parse = (val: any) => typeof val === 'string' ? JSON.parse(val) : val;

    return {
      generalId: row.general_id,
      baseTraits: parse(row.base_traits),
      currentTraits: parse(row.current_traits),
      traitDrifts: parse(row.trait_drifts),
      totalEvolutions: row.total_evolutions,
      lastEvolvedAt: row.last_evolved_at ? new Date(row.last_evolved_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

export default VoiceEvolutionService;
