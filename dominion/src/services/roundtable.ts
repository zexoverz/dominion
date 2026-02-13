/**
 * Roundtable Service - Generals discussion and voting system
 * Handles structured roundtable sessions: proposal reviews, strategy, emergency, daily briefings
 */

import { Pool, PoolClient } from 'pg';
import { v4 as uuid } from 'uuid';

// === TYPES & INTERFACES ===

export type RoundtableType = 'PROPOSAL_REVIEW' | 'STRATEGY' | 'EMERGENCY' | 'DAILY_BRIEFING';

export type VoteChoice = 'APPROVE' | 'REJECT' | 'ABSTAIN';

export type ConsensusResult = 'unanimous' | 'majority' | 'deadlock' | 'pending';

export type RoundtableStatus = 'pending' | 'active' | 'voting' | 'completed' | 'cancelled' | 'timeout';

export interface RoundtableOptions {
  type: RoundtableType;
  maxRounds?: number;
  timeLimitPerRoundMs?: number;
  requireVoting?: boolean;
  quorum?: number; // minimum participants needed to proceed
  autoTriggerProposalId?: string; // if triggered by a proposal
  metadata?: Record<string, any>;
}

export interface RoundtableSession {
  id: string;
  topic: string;
  type: RoundtableType;
  status: RoundtableStatus;
  participantIds: string[];
  currentRound: number;
  maxRounds: number;
  timeLimitPerRoundMs: number;
  requireVoting: boolean;
  quorum: number;
  proposalId?: string;
  consensusResult?: ConsensusResult;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export interface RoundtableMessage {
  id: string;
  roundtableId: string;
  generalId: string;
  round: number;
  content: string;
  messageType: 'statement' | 'response' | 'rebuttal' | 'summary' | 'vote_rationale';
  referencedMessageId?: string;
  createdAt: Date;
}

export interface RoundtableVote {
  id: string;
  roundtableId: string;
  generalId: string;
  choice: VoteChoice;
  rationale: string;
  round: number;
  createdAt: Date;
}

export interface VoteTally {
  approve: number;
  reject: number;
  abstain: number;
  total: number;
  consensus: ConsensusResult;
  votes: RoundtableVote[];
}

export interface GeneralSpeakingContext {
  generalId: string;
  topic: string;
  roundtableType: RoundtableType;
  currentRound: number;
  maxRounds: number;
  previousMessages: RoundtableMessage[];
  speakingOrder: number;
  totalParticipants: number;
}

export interface RoundtableTranscript {
  session: RoundtableSession;
  messages: RoundtableMessage[];
  votes: RoundtableVote[];
  voteTally?: VoteTally;
}

// === CONFIGURATION ===

const DEFAULT_OPTIONS: Record<RoundtableType, Partial<RoundtableOptions>> = {
  PROPOSAL_REVIEW: {
    maxRounds: 3,
    timeLimitPerRoundMs: 60000,
    requireVoting: true,
    quorum: 3,
  },
  STRATEGY: {
    maxRounds: 5,
    timeLimitPerRoundMs: 90000,
    requireVoting: false,
    quorum: 4,
  },
  EMERGENCY: {
    maxRounds: 2,
    timeLimitPerRoundMs: 30000,
    requireVoting: true,
    quorum: 2,
  },
  DAILY_BRIEFING: {
    maxRounds: 1,
    timeLimitPerRoundMs: 120000,
    requireVoting: false,
    quorum: 3,
  },
};

const GENERAL_ROLE_PRIORITIES: Record<string, Record<RoundtableType, number>> = {
  throne:      { PROPOSAL_REVIEW: 1, STRATEGY: 1, EMERGENCY: 1, DAILY_BRIEFING: 1 },
  seer:        { PROPOSAL_REVIEW: 3, STRATEGY: 2, EMERGENCY: 3, DAILY_BRIEFING: 4 },
  phantom:     { PROPOSAL_REVIEW: 4, STRATEGY: 4, EMERGENCY: 2, DAILY_BRIEFING: 5 },
  grimoire:    { PROPOSAL_REVIEW: 5, STRATEGY: 5, EMERGENCY: 6, DAILY_BRIEFING: 2 },
  echo:        { PROPOSAL_REVIEW: 6, STRATEGY: 6, EMERGENCY: 7, DAILY_BRIEFING: 3 },
  mammon:      { PROPOSAL_REVIEW: 2, STRATEGY: 3, EMERGENCY: 4, DAILY_BRIEFING: 6 },
  'wraith-eye': { PROPOSAL_REVIEW: 7, STRATEGY: 7, EMERGENCY: 5, DAILY_BRIEFING: 7 },
};

const SPEAKING_STYLE_HINTS: Record<RoundtableType, string> = {
  PROPOSAL_REVIEW: 'Evaluate the proposal critically. Consider costs, risks, alignment with strategy, and feasibility.',
  STRATEGY: 'Think long-term. Consider how this connects to the 24-month EIP ascension and Lord Zexo\'s flywheel.',
  EMERGENCY: 'Be concise and action-oriented. Focus on immediate mitigation and root cause.',
  DAILY_BRIEFING: 'Report on your domain briefly. Surface blockers, wins, and what needs attention today.',
};

// === SERVICE CLASS ===

export class RoundtableService {
  constructor(private db: Pool) {}

  /**
   * Start a new roundtable session
   */
  async startRoundtable(
    topic: string,
    participantIds: string[],
    options: RoundtableOptions
  ): Promise<RoundtableSession> {
    const startTime = Date.now();

    try {
      // Merge defaults
      const defaults = DEFAULT_OPTIONS[options.type] || {};
      const maxRounds = options.maxRounds ?? defaults.maxRounds ?? 3;
      const timeLimitPerRoundMs = options.timeLimitPerRoundMs ?? defaults.timeLimitPerRoundMs ?? 60000;
      const requireVoting = options.requireVoting ?? defaults.requireVoting ?? false;
      const quorum = options.quorum ?? defaults.quorum ?? 2;

      // Validate
      if (participantIds.length < quorum) {
        throw new Error(`Insufficient participants: ${participantIds.length} < quorum ${quorum}`);
      }

      if (participantIds.length < 2) {
        throw new Error('Roundtable requires at least 2 participants');
      }

      if (!topic || topic.length < 5) {
        throw new Error('Topic must be at least 5 characters');
      }

      // Sort participants by role priority for this roundtable type
      const sortedParticipants = this.sortParticipantsByPriority(participantIds, options.type);

      const sessionId = uuid();
      const session: RoundtableSession = {
        id: sessionId,
        topic,
        type: options.type,
        status: 'active',
        participantIds: sortedParticipants,
        currentRound: 1,
        maxRounds,
        timeLimitPerRoundMs,
        requireVoting,
        quorum,
        proposalId: options.autoTriggerProposalId,
        createdAt: new Date(),
        startedAt: new Date(),
        metadata: options.metadata || {},
      };

      // Store in DB
      await this.insertSession(session);

      // Emit event
      await this.emitRoundtableEvent(sessionId, 'roundtable_started', topic, {
        type: options.type,
        participants: sortedParticipants,
        maxRounds,
        proposalId: options.autoTriggerProposalId,
      });

      console.log(`🏛️ Roundtable started: ${topic} [${options.type}] with ${sortedParticipants.length} generals (${Date.now() - startTime}ms)`);

      return session;

    } catch (error) {
      console.error('Failed to start roundtable:', error);
      throw new Error(`Failed to start roundtable: ${error.message}`);
    }
  }

  /**
   * Generate a response for a general in the context of a roundtable
   */
  async generateResponse(
    generalId: string,
    topic: string,
    previousMessages: RoundtableMessage[],
    context?: Partial<GeneralSpeakingContext>
  ): Promise<string> {
    try {
      // Build the speaking context
      const speakingContext: GeneralSpeakingContext = {
        generalId,
        topic,
        roundtableType: context?.roundtableType || 'STRATEGY',
        currentRound: context?.currentRound || 1,
        maxRounds: context?.maxRounds || 3,
        previousMessages,
        speakingOrder: context?.speakingOrder || 0,
        totalParticipants: context?.totalParticipants || previousMessages.length + 1,
      };

      // Build prompt components
      const prompt = this.buildResponsePrompt(speakingContext);

      // In production, this would call the LLM. For now, return the prompt structure
      // so the caller can use their own LLM integration
      return prompt;

    } catch (error) {
      console.error(`Failed to generate response for ${generalId}:`, error);
      throw new Error(`Response generation failed: ${error.message}`);
    }
  }

  /**
   * Record a message in a roundtable session
   */
  async recordMessage(
    roundtableId: string,
    generalId: string,
    content: string,
    messageType: RoundtableMessage['messageType'] = 'statement',
    referencedMessageId?: string
  ): Promise<RoundtableMessage> {
    const client = await this.db.connect();

    try {
      // Get current session state
      const session = await this.getSession(roundtableId);
      if (!session) {
        throw new Error(`Roundtable session not found: ${roundtableId}`);
      }

      if (session.status !== 'active') {
        throw new Error(`Roundtable is not active (status: ${session.status})`);
      }

      if (!session.participantIds.includes(generalId)) {
        throw new Error(`General ${generalId} is not a participant in this roundtable`);
      }

      const message: RoundtableMessage = {
        id: uuid(),
        roundtableId,
        generalId,
        round: session.currentRound,
        content,
        messageType,
        referencedMessageId,
        createdAt: new Date(),
      };

      await client.query(`
        INSERT INTO roundtable_messages (
          id, roundtable_id, general_id, round, content, message_type,
          referenced_message_id, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        message.id,
        message.roundtableId,
        message.generalId,
        message.round,
        message.content,
        message.messageType,
        message.referencedMessageId || null,
        message.createdAt,
      ]);

      // Update session last activity
      await client.query(
        'UPDATE roundtables SET last_activity_at = NOW() WHERE id = $1',
        [roundtableId]
      );

      return message;

    } finally {
      client.release();
    }
  }

  /**
   * Advance to the next round
   */
  async advanceRound(roundtableId: string): Promise<{ newRound: number; isComplete: boolean }> {
    const client = await this.db.connect();

    try {
      const session = await this.getSession(roundtableId);
      if (!session) throw new Error(`Session not found: ${roundtableId}`);

      const newRound = session.currentRound + 1;

      if (newRound > session.maxRounds) {
        // Roundtable is complete — move to voting if required, else finish
        if (session.requireVoting) {
          await client.query(
            'UPDATE roundtables SET status = $1, current_round = $2 WHERE id = $3',
            ['voting', session.currentRound, roundtableId]
          );
          return { newRound: session.currentRound, isComplete: false };
        } else {
          await this.completeRoundtable(roundtableId, client);
          return { newRound: session.currentRound, isComplete: true };
        }
      }

      await client.query(
        'UPDATE roundtables SET current_round = $1 WHERE id = $2',
        [newRound, roundtableId]
      );

      console.log(`🏛️ Roundtable ${roundtableId} advanced to round ${newRound}/${session.maxRounds}`);
      return { newRound, isComplete: false };

    } finally {
      client.release();
    }
  }

  /**
   * Cast a vote in a roundtable
   */
  async castVote(
    roundtableId: string,
    generalId: string,
    choice: VoteChoice,
    rationale: string
  ): Promise<RoundtableVote> {
    const client = await this.db.connect();

    try {
      const session = await this.getSession(roundtableId);
      if (!session) throw new Error(`Session not found: ${roundtableId}`);

      if (session.status !== 'voting' && session.status !== 'active') {
        throw new Error(`Cannot vote: roundtable status is ${session.status}`);
      }

      if (!session.participantIds.includes(generalId)) {
        throw new Error(`General ${generalId} is not a participant`);
      }

      // Check for duplicate vote
      const existing = await client.query(
        'SELECT id FROM roundtable_votes WHERE roundtable_id = $1 AND general_id = $2',
        [roundtableId, generalId]
      );

      if (existing.rows.length > 0) {
        throw new Error(`General ${generalId} has already voted in this roundtable`);
      }

      const vote: RoundtableVote = {
        id: uuid(),
        roundtableId,
        generalId,
        choice,
        rationale,
        round: session.currentRound,
        createdAt: new Date(),
      };

      await client.query(`
        INSERT INTO roundtable_votes (
          id, roundtable_id, general_id, choice, rationale, round, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [vote.id, vote.roundtableId, vote.generalId, vote.choice, vote.rationale, vote.round, vote.createdAt]);

      // Also record vote rationale as a message
      await this.recordMessage(roundtableId, generalId, rationale, 'vote_rationale');

      // Check if all participants have voted
      const voteCount = await client.query(
        'SELECT COUNT(*) as count FROM roundtable_votes WHERE roundtable_id = $1',
        [roundtableId]
      );

      const totalVotes = parseInt(voteCount.rows[0].count);
      if (totalVotes >= session.participantIds.length) {
        // All votes are in — determine consensus
        await this.finalizeVoting(roundtableId, client);
      }

      console.log(`🗳️ ${generalId} voted ${choice} in roundtable ${roundtableId} (${totalVotes}/${session.participantIds.length})`);

      return vote;

    } finally {
      client.release();
    }
  }

  /**
   * Get the vote tally for a roundtable
   */
  async getVoteTally(roundtableId: string): Promise<VoteTally> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        'SELECT * FROM roundtable_votes WHERE roundtable_id = $1 ORDER BY created_at ASC',
        [roundtableId]
      );

      const votes: RoundtableVote[] = result.rows.map(row => ({
        id: row.id,
        roundtableId: row.roundtable_id,
        generalId: row.general_id,
        choice: row.choice,
        rationale: row.rationale,
        round: row.round,
        createdAt: new Date(row.created_at),
      }));

      const approve = votes.filter(v => v.choice === 'APPROVE').length;
      const reject = votes.filter(v => v.choice === 'REJECT').length;
      const abstain = votes.filter(v => v.choice === 'ABSTAIN').length;
      const total = votes.length;

      return {
        approve,
        reject,
        abstain,
        total,
        consensus: this.determineConsensus(approve, reject, abstain, total),
        votes,
      };

    } finally {
      client.release();
    }
  }

  /**
   * Determine consensus from vote counts
   */
  determineConsensus(approve: number, reject: number, abstain: number, total: number): ConsensusResult {
    if (total === 0) return 'pending';

    const votingMembers = total - abstain;
    if (votingMembers === 0) return 'deadlock';

    // Unanimous: all non-abstaining voters agree
    if (approve === votingMembers) return 'unanimous';
    if (reject === votingMembers) return 'unanimous';

    // Majority: >50% of non-abstaining voters agree
    if (approve > votingMembers / 2) return 'majority';
    if (reject > votingMembers / 2) return 'majority';

    // Deadlock: no clear majority
    return 'deadlock';
  }

  /**
   * Get a roundtable session by ID
   */
  async getSession(roundtableId: string): Promise<RoundtableSession | null> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        'SELECT * FROM roundtables WHERE id = $1',
        [roundtableId]
      );

      if (result.rows.length === 0) return null;

      return this.rowToSession(result.rows[0]);

    } finally {
      client.release();
    }
  }

  /**
   * Get all messages for a roundtable
   */
  async getMessages(roundtableId: string, round?: number): Promise<RoundtableMessage[]> {
    const client = await this.db.connect();

    try {
      const query = round
        ? 'SELECT * FROM roundtable_messages WHERE roundtable_id = $1 AND round = $2 ORDER BY created_at ASC'
        : 'SELECT * FROM roundtable_messages WHERE roundtable_id = $1 ORDER BY created_at ASC';

      const params = round ? [roundtableId, round] : [roundtableId];
      const result = await client.query(query, params);

      return result.rows.map(row => this.rowToMessage(row));

    } finally {
      client.release();
    }
  }

  /**
   * Get the full transcript for a roundtable
   */
  async getTranscript(roundtableId: string): Promise<RoundtableTranscript | null> {
    const session = await this.getSession(roundtableId);
    if (!session) return null;

    const messages = await this.getMessages(roundtableId);
    const voteTally = session.requireVoting ? await this.getVoteTally(roundtableId) : undefined;

    return {
      session,
      messages,
      votes: voteTally?.votes || [],
      voteTally,
    };
  }

  /**
   * Get active roundtables
   */
  async getActiveRoundtables(): Promise<RoundtableSession[]> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        "SELECT * FROM roundtables WHERE status IN ('active', 'voting', 'pending') ORDER BY created_at DESC"
      );

      return result.rows.map(row => this.rowToSession(row));

    } finally {
      client.release();
    }
  }

  /**
   * Get recent completed roundtables
   */
  async getRecentRoundtables(limit: number = 20): Promise<RoundtableSession[]> {
    const client = await this.db.connect();

    try {
      const result = await client.query(
        'SELECT * FROM roundtables ORDER BY created_at DESC LIMIT $1',
        [limit]
      );

      return result.rows.map(row => this.rowToSession(row));

    } finally {
      client.release();
    }
  }

  /**
   * Cancel a roundtable
   */
  async cancelRoundtable(roundtableId: string, reason?: string): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query(
        'UPDATE roundtables SET status = $1, completed_at = NOW(), metadata = metadata || $2 WHERE id = $3',
        ['cancelled', JSON.stringify({ cancellationReason: reason || 'Manual cancellation' }), roundtableId]
      );

      await this.emitRoundtableEvent(roundtableId, 'roundtable_cancelled', reason || 'Cancelled', {
        roundtableId,
        reason,
      });

      console.log(`🏛️ Roundtable ${roundtableId} cancelled: ${reason}`);

    } finally {
      client.release();
    }
  }

  /**
   * Hook: auto-trigger roundtable when a new proposal is created
   */
  async onNewProposal(proposalId: string, proposalTitle: string, agentId: string): Promise<RoundtableSession | null> {
    try {
      // Get default review participants (exclude the proposing agent from voting, but include in discussion)
      const defaultReviewers = ['throne', 'mammon', 'wraith-eye', 'seer'];
      const participants = defaultReviewers.includes(agentId)
        ? defaultReviewers
        : [...defaultReviewers, agentId];

      const session = await this.startRoundtable(
        `Proposal Review: ${proposalTitle}`,
        participants,
        {
          type: 'PROPOSAL_REVIEW',
          autoTriggerProposalId: proposalId,
          metadata: { proposalId, proposingAgent: agentId },
        }
      );

      console.log(`🏛️ Auto-triggered proposal review roundtable: ${session.id} for proposal ${proposalId}`);
      return session;

    } catch (error) {
      console.error(`Failed to auto-trigger roundtable for proposal ${proposalId}:`, error);
      return null;
    }
  }

  /**
   * Hook: check for timed-out roundtables and recover them
   */
  async recoverTimedOutSessions(timeoutMs: number = 3600000): Promise<number> {
    const client = await this.db.connect();

    try {
      const result = await client.query(`
        UPDATE roundtables
        SET status = 'timeout', completed_at = NOW(),
            metadata = metadata || '{"timeoutReason": "Session exceeded time limit"}'::jsonb
        WHERE status IN ('active', 'voting')
        AND last_activity_at < NOW() - INTERVAL '${Math.floor(timeoutMs / 1000)} seconds'
        RETURNING id, topic
      `);

      for (const row of result.rows) {
        console.log(`⏱️ Roundtable timed out: ${row.topic} (${row.id})`);
        await this.emitRoundtableEvent(row.id, 'roundtable_timeout', row.topic, {
          roundtableId: row.id,
        });
      }

      return result.rows.length;

    } finally {
      client.release();
    }
  }

  /**
   * Get participation stats for a general
   */
  async getGeneralStats(generalId: string): Promise<{
    totalRoundtables: number;
    totalMessages: number;
    votesApprove: number;
    votesReject: number;
    votesAbstain: number;
    avgMessagesPerRoundtable: number;
  }> {
    const client = await this.db.connect();

    try {
      const roundtableCount = await client.query(
        "SELECT COUNT(DISTINCT roundtable_id) as count FROM roundtable_messages WHERE general_id = $1",
        [generalId]
      );

      const messageCount = await client.query(
        'SELECT COUNT(*) as count FROM roundtable_messages WHERE general_id = $1',
        [generalId]
      );

      const voteStats = await client.query(`
        SELECT
          COUNT(*) FILTER (WHERE choice = 'APPROVE') as approve,
          COUNT(*) FILTER (WHERE choice = 'REJECT') as reject,
          COUNT(*) FILTER (WHERE choice = 'ABSTAIN') as abstain
        FROM roundtable_votes WHERE general_id = $1
      `, [generalId]);

      const totalRoundtables = parseInt(roundtableCount.rows[0].count) || 0;
      const totalMessages = parseInt(messageCount.rows[0].count) || 0;

      return {
        totalRoundtables,
        totalMessages,
        votesApprove: parseInt(voteStats.rows[0].approve) || 0,
        votesReject: parseInt(voteStats.rows[0].reject) || 0,
        votesAbstain: parseInt(voteStats.rows[0].abstain) || 0,
        avgMessagesPerRoundtable: totalRoundtables > 0 ? totalMessages / totalRoundtables : 0,
      };

    } finally {
      client.release();
    }
  }

  // === PRIVATE METHODS ===

  private sortParticipantsByPriority(participantIds: string[], type: RoundtableType): string[] {
    return [...participantIds].sort((a, b) => {
      const priorityA = GENERAL_ROLE_PRIORITIES[a]?.[type] ?? 99;
      const priorityB = GENERAL_ROLE_PRIORITIES[b]?.[type] ?? 99;
      return priorityA - priorityB;
    });
  }

  private buildResponsePrompt(ctx: GeneralSpeakingContext): string {
    const styleHint = SPEAKING_STYLE_HINTS[ctx.roundtableType] || '';
    const isOpening = ctx.previousMessages.length === 0;
    const isClosing = ctx.currentRound >= ctx.maxRounds;

    let prompt = `ROUNDTABLE: ${ctx.roundtableType}\n`;
    prompt += `TOPIC: ${ctx.topic}\n`;
    prompt += `ROUND: ${ctx.currentRound}/${ctx.maxRounds}\n`;
    prompt += `SPEAKING ORDER: ${ctx.speakingOrder + 1} of ${ctx.totalParticipants}\n\n`;

    prompt += `STYLE GUIDANCE: ${styleHint}\n\n`;

    if (isOpening) {
      prompt += 'You are opening this roundtable. Set the context and frame the discussion.\n';
    } else if (isClosing) {
      prompt += 'This is the final round. Summarize your position and any action items.\n';
    }

    if (ctx.previousMessages.length > 0) {
      prompt += 'CONVERSATION SO FAR:\n';
      const recentMessages = ctx.previousMessages.slice(-8);
      for (const msg of recentMessages) {
        prompt += `[${msg.generalId}] (${msg.messageType}): ${msg.content}\n`;
      }
      prompt += '\nRespond to what has been said. Be concise (under 150 chars).\n';
    }

    return prompt;
  }

  private async finalizeVoting(roundtableId: string, client: PoolClient): Promise<void> {
    const tally = await this.getVoteTally(roundtableId);

    await client.query(
      'UPDATE roundtables SET consensus_result = $1 WHERE id = $2',
      [tally.consensus, roundtableId]
    );

    await this.completeRoundtable(roundtableId, client);

    await this.emitRoundtableEvent(roundtableId, 'roundtable_voted', `Consensus: ${tally.consensus}`, {
      approve: tally.approve,
      reject: tally.reject,
      abstain: tally.abstain,
      consensus: tally.consensus,
    });

    // If this was a proposal review, update the proposal status
    const session = await this.getSession(roundtableId);
    if (session?.proposalId && tally.consensus !== 'pending') {
      await this.updateProposalFromVote(session.proposalId, tally, client);
    }

    console.log(`🗳️ Voting finalized for ${roundtableId}: ${tally.consensus} (A:${tally.approve} R:${tally.reject} X:${tally.abstain})`);
  }

  private async completeRoundtable(roundtableId: string, client: PoolClient): Promise<void> {
    await client.query(
      'UPDATE roundtables SET status = $1, completed_at = NOW() WHERE id = $2',
      ['completed', roundtableId]
    );

    await this.emitRoundtableEvent(roundtableId, 'roundtable_completed', 'Roundtable completed', {
      roundtableId,
    });
  }

  private async updateProposalFromVote(proposalId: string, tally: VoteTally, client: PoolClient): Promise<void> {
    try {
      const newStatus = tally.consensus === 'unanimous' || tally.consensus === 'majority'
        ? (tally.approve > tally.reject ? 'approved' : 'rejected')
        : 'pending'; // deadlock keeps it pending for human review

      if (newStatus !== 'pending') {
        await client.query(
          'UPDATE ops_mission_proposals SET status = $1, reviewed_at = NOW() WHERE id = $2',
          [newStatus, proposalId]
        );

        console.log(`📋 Proposal ${proposalId} updated to ${newStatus} based on roundtable vote`);
      }
    } catch (error) {
      console.error(`Failed to update proposal from vote:`, error);
    }
  }

  private async insertSession(session: RoundtableSession): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query(`
        INSERT INTO roundtables (
          id, topic, type, status, participant_ids, current_round, max_rounds,
          time_limit_per_round_ms, require_voting, quorum, proposal_id,
          created_at, started_at, last_activity_at, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        session.id,
        session.topic,
        session.type,
        session.status,
        JSON.stringify(session.participantIds),
        session.currentRound,
        session.maxRounds,
        session.timeLimitPerRoundMs,
        session.requireVoting,
        session.quorum,
        session.proposalId || null,
        session.createdAt,
        session.startedAt || null,
        new Date(),
        JSON.stringify(session.metadata),
      ]);
    } finally {
      client.release();
    }
  }

  private async emitRoundtableEvent(
    roundtableId: string,
    kind: string,
    title: string,
    details: Record<string, any>
  ): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query(`
        INSERT INTO ops_agent_events (
          id, agent_id, kind, title, details, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `, [uuid(), 'system', kind, title, JSON.stringify({ ...details, roundtableId })]);
    } catch (error) {
      console.error('Failed to emit roundtable event:', error);
    } finally {
      client.release();
    }
  }

  private rowToSession(row: any): RoundtableSession {
    return {
      id: row.id,
      topic: row.topic,
      type: row.type,
      status: row.status,
      participantIds: typeof row.participant_ids === 'string' ? JSON.parse(row.participant_ids) : row.participant_ids,
      currentRound: row.current_round,
      maxRounds: row.max_rounds,
      timeLimitPerRoundMs: row.time_limit_per_round_ms,
      requireVoting: row.require_voting,
      quorum: row.quorum,
      proposalId: row.proposal_id,
      consensusResult: row.consensus_result,
      createdAt: new Date(row.created_at),
      startedAt: row.started_at ? new Date(row.started_at) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      metadata: row.metadata || {},
    };
  }

  private rowToMessage(row: any): RoundtableMessage {
    return {
      id: row.id,
      roundtableId: row.roundtable_id,
      generalId: row.general_id,
      round: row.round,
      content: row.content,
      messageType: row.message_type,
      referencedMessageId: row.referenced_message_id,
      createdAt: new Date(row.created_at),
    };
  }
}

export default RoundtableService;
