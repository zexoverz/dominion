/**
 * Proposal Service - Single entry point for mission proposals
 * Handles validation, cap gates, daily limits, and auto-approval
 */

import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

export interface MissionProposal {
  id?: string;
  agentId: string;
  title: string;
  description: string;
  priority: number; // 1-100
  estimatedCostUsd?: number;
  proposedSteps: MissionStep[];
  metadata?: Record<string, any>;
}

export interface MissionStep {
  kind: StepKind;
  title: string;
  description?: string;
  inputData?: Record<string, any>;
  maxRetries?: number;
}

export type StepKind = 
  | 'draft_tweet' | 'crawl' | 'analyze' | 'write_content' | 'scan_eip'
  | 'code_review' | 'research' | 'monitor' | 'notify' | 'execute_command'
  | 'generate_image' | 'process_data' | 'validate' | 'deploy' | 'test';

export interface ProposalResult {
  proposalId: string;
  status: 'pending' | 'auto_approved' | 'rejected';
  missionId?: string; // Set if auto-approved
  rejectionReason?: string;
  estimatedCostUsd: number;
}

// Step kind cost estimates and risk levels
const STEP_CONFIG: Record<StepKind, { baseCostUsd: number; riskLevel: number; capPerDay: number }> = {
  draft_tweet: { baseCostUsd: 0.15, riskLevel: 1, capPerDay: 20 },
  crawl: { baseCostUsd: 0.25, riskLevel: 1, capPerDay: 50 },
  analyze: { baseCostUsd: 0.35, riskLevel: 1, capPerDay: 30 },
  write_content: { baseCostUsd: 0.45, riskLevel: 2, capPerDay: 15 },
  scan_eip: { baseCostUsd: 0.30, riskLevel: 1, capPerDay: 25 },
  code_review: { baseCostUsd: 0.80, riskLevel: 4, capPerDay: 8 },
  research: { baseCostUsd: 0.50, riskLevel: 2, capPerDay: 20 },
  monitor: { baseCostUsd: 0.20, riskLevel: 1, capPerDay: 40 },
  notify: { baseCostUsd: 0.10, riskLevel: 3, capPerDay: 12 },
  execute_command: { baseCostUsd: 0.05, riskLevel: 5, capPerDay: 5 },
  generate_image: { baseCostUsd: 0.75, riskLevel: 2, capPerDay: 10 },
  process_data: { baseCostUsd: 0.40, riskLevel: 2, capPerDay: 25 },
  validate: { baseCostUsd: 0.30, riskLevel: 2, capPerDay: 20 },
  deploy: { baseCostUsd: 1.50, riskLevel: 5, capPerDay: 3 },
  test: { baseCostUsd: 0.60, riskLevel: 3, capPerDay: 15 }
};

export class ProposalService {
  constructor(private db: Pool) {}

  /**
   * Main entry point for creating proposals with automatic approval logic
   */
  async createProposalAndMaybeAutoApprove(proposal: MissionProposal): Promise<ProposalResult> {
    const startTime = Date.now();
    
    try {
      // Generate ID if not provided
      proposal.id = proposal.id || uuid();
      
      // Validate proposal structure
      const validationError = this.validateProposal(proposal);
      if (validationError) {
        return {
          proposalId: proposal.id,
          status: 'rejected',
          rejectionReason: validationError,
          estimatedCostUsd: 0
        };
      }

      // Calculate estimated cost
      const estimatedCost = this.calculateEstimatedCost(proposal.proposedSteps);
      proposal.estimatedCostUsd = estimatedCost;

      // Check daily limits and caps
      const limitCheck = await this.checkDailyLimits(proposal);
      if (!limitCheck.allowed) {
        return {
          proposalId: proposal.id,
          status: 'rejected',
          rejectionReason: limitCheck.reason,
          estimatedCostUsd: estimatedCost
        };
      }

      // Check step kind caps
      const capCheck = await this.checkStepCaps(proposal);
      if (!capCheck.allowed) {
        return {
          proposalId: proposal.id,
          status: 'rejected',
          rejectionReason: capCheck.reason,
          estimatedCostUsd: estimatedCost
        };
      }

      // Insert proposal
      await this.insertProposal(proposal);

      // Check auto-approval eligibility
      const autoApprovalDecision = await this.evaluateAutoApproval(proposal);
      
      if (autoApprovalDecision.approved) {
        // Auto-approve: create mission directly
        const missionId = await this.autoApproveMission(proposal);
        
        // Emit events
        await this.emitProposalEvent(proposal.agentId, 'proposal_created', proposal.title, {
          proposalId: proposal.id,
          autoApproved: true,
          missionId,
          cost: estimatedCost
        });

        return {
          proposalId: proposal.id,
          status: 'auto_approved',
          missionId,
          estimatedCostUsd: estimatedCost
        };
      } else {
        // Requires manual approval
        await this.emitProposalEvent(proposal.agentId, 'proposal_created', proposal.title, {
          proposalId: proposal.id,
          autoApproved: false,
          requiresApproval: true,
          cost: estimatedCost
        });

        return {
          proposalId: proposal.id,
          status: 'pending',
          estimatedCostUsd: estimatedCost
        };
      }

    } catch (error) {
      console.error('ProposalService error:', error);
      await this.emitProposalEvent(proposal.agentId, 'error_occurred', 'Proposal creation failed', {
        error: error.message,
        proposalId: proposal.id
      });
      
      throw new Error(`Failed to create proposal: ${error.message}`);
    } finally {
      const duration = Date.now() - startTime;
      console.log(`Proposal processing completed in ${duration}ms for agent ${proposal.agentId}`);
    }
  }

  private validateProposal(proposal: MissionProposal): string | null {
    if (!proposal.agentId || typeof proposal.agentId !== 'string') {
      return 'Invalid agent ID';
    }
    
    if (!proposal.title || proposal.title.length < 5 || proposal.title.length > 200) {
      return 'Title must be 5-200 characters';
    }
    
    if (!proposal.description || proposal.description.length < 10 || proposal.description.length > 1000) {
      return 'Description must be 10-1000 characters';
    }
    
    if (!proposal.priority || proposal.priority < 1 || proposal.priority > 100) {
      return 'Priority must be between 1-100';
    }
    
    if (!proposal.proposedSteps || proposal.proposedSteps.length === 0) {
      return 'At least one step is required';
    }
    
    if (proposal.proposedSteps.length > 20) {
      return 'Maximum 20 steps allowed per proposal';
    }

    // Validate each step
    for (const step of proposal.proposedSteps) {
      if (!step.kind || !Object.keys(STEP_CONFIG).includes(step.kind)) {
        return `Invalid step kind: ${step.kind}`;
      }
      
      if (!step.title || step.title.length < 3 || step.title.length > 200) {
        return `Step title must be 3-200 characters: ${step.title}`;
      }
    }

    return null;
  }

  private calculateEstimatedCost(steps: MissionStep[]): number {
    return steps.reduce((total, step) => {
      const config = STEP_CONFIG[step.kind];
      return total + config.baseCostUsd;
    }, 0);
  }

  private async checkDailyLimits(proposal: MissionProposal): Promise<{ allowed: boolean; reason?: string }> {
    const client = await this.db.connect();
    
    try {
      // Get daily quotas from policy
      const quotaResult = await client.query(
        'SELECT value FROM ops_policy WHERE key = $1',
        ['daily_quotas']
      );
      
      if (quotaResult.rows.length === 0) {
        return { allowed: false, reason: 'Daily quotas policy not found' };
      }
      
      const quotas = quotaResult.rows[0].value[proposal.agentId];
      if (!quotas) {
        return { allowed: false, reason: `No quotas configured for agent ${proposal.agentId}` };
      }

      // Check today's usage
      const today = new Date().toISOString().split('T')[0];
      const usageResult = await client.query(`
        SELECT 
          COUNT(*) as proposal_count,
          COALESCE(SUM(estimated_cost_usd), 0) as total_cost
        FROM ops_mission_proposals 
        WHERE agent_id = $1 AND DATE(created_at) = $2
      `, [proposal.agentId, today]);

      const usage = usageResult.rows[0];
      const currentProposals = parseInt(usage.proposal_count);
      const currentCost = parseFloat(usage.total_cost);

      // Check proposal count limit
      if (currentProposals >= quotas.max_proposals) {
        return { 
          allowed: false, 
          reason: `Daily proposal limit exceeded: ${currentProposals}/${quotas.max_proposals}` 
        };
      }

      // Check cost limit
      if (currentCost + proposal.estimatedCostUsd > quotas.max_cost) {
        return { 
          allowed: false, 
          reason: `Daily cost limit exceeded: $${(currentCost + proposal.estimatedCostUsd).toFixed(2)}/$${quotas.max_cost}` 
        };
      }

      return { allowed: true };
      
    } finally {
      client.release();
    }
  }

  private async checkStepCaps(proposal: MissionProposal): Promise<{ allowed: boolean; reason?: string }> {
    const client = await this.db.connect();
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Count steps by kind for today
      const stepCounts = await client.query(`
        SELECT 
          ms.kind,
          COUNT(*) as count
        FROM ops_mission_steps ms
        JOIN ops_missions m ON ms.mission_id = m.id
        WHERE m.agent_id = $1 AND DATE(m.created_at) = $2
        GROUP BY ms.kind
      `, [proposal.agentId, today]);

      const currentCounts: Record<string, number> = {};
      stepCounts.rows.forEach(row => {
        currentCounts[row.kind] = parseInt(row.count);
      });

      // Check each proposed step against its cap
      for (const step of proposal.proposedSteps) {
        const config = STEP_CONFIG[step.kind];
        const currentCount = currentCounts[step.kind] || 0;
        
        if (currentCount >= config.capPerDay) {
          return {
            allowed: false,
            reason: `Daily cap exceeded for ${step.kind}: ${currentCount}/${config.capPerDay}`
          };
        }
      }

      return { allowed: true };
      
    } finally {
      client.release();
    }
  }

  private async evaluateAutoApproval(proposal: MissionProposal): Promise<{ approved: boolean; reason?: string }> {
    const client = await this.db.connect();
    
    try {
      // Get auto-approval policy
      const policyResult = await client.query(
        'SELECT value FROM ops_policy WHERE key = $1',
        ['auto_approve']
      );
      
      if (policyResult.rows.length === 0) {
        return { approved: false, reason: 'Auto-approval policy not found' };
      }
      
      const policy = policyResult.rows[0].value;
      
      if (!policy.enabled) {
        return { approved: false, reason: 'Auto-approval disabled' };
      }

      // Check cost threshold
      if (proposal.estimatedCostUsd > policy.max_auto_approve_cost) {
        return { 
          approved: false, 
          reason: `Cost exceeds auto-approval threshold: $${proposal.estimatedCostUsd} > $${policy.max_auto_approve_cost}` 
        };
      }

      // Check step kinds
      const hasHighRiskSteps = proposal.proposedSteps.some(step => {
        return policy.require_approval_kinds.includes(step.kind);
      });
      
      if (hasHighRiskSteps) {
        return { approved: false, reason: 'Contains high-risk step kinds requiring approval' };
      }

      // Calculate overall risk score
      const avgRiskLevel = proposal.proposedSteps.reduce((sum, step) => {
        return sum + STEP_CONFIG[step.kind].riskLevel;
      }, 0) / proposal.proposedSteps.length;
      
      if (avgRiskLevel > policy.low_risk_threshold) {
        return { approved: false, reason: `Risk level too high: ${avgRiskLevel.toFixed(1)} > ${policy.low_risk_threshold}` };
      }

      return { approved: true };
      
    } finally {
      client.release();
    }
  }

  private async insertProposal(proposal: MissionProposal): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query(`
        INSERT INTO ops_mission_proposals (
          id, agent_id, title, description, priority, estimated_cost_usd, 
          proposed_steps, metadata, created_at, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW() + INTERVAL '24 hours')
      `, [
        proposal.id,
        proposal.agentId,
        proposal.title,
        proposal.description,
        proposal.priority,
        proposal.estimatedCostUsd,
        JSON.stringify(proposal.proposedSteps),
        JSON.stringify(proposal.metadata || {})
      ]);
    } finally {
      client.release();
    }
  }

  private async autoApproveMission(proposal: MissionProposal): Promise<string> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update proposal status
      await client.query(
        'UPDATE ops_mission_proposals SET status = $1, auto_approved = true, reviewed_at = NOW() WHERE id = $2',
        ['approved', proposal.id]
      );

      // Create mission
      const missionId = uuid();
      await client.query(`
        INSERT INTO ops_missions (
          id, proposal_id, agent_id, title, description, priority, 
          estimated_cost_usd, status, created_at, started_at, last_activity_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW(), NOW(), NOW())
      `, [
        missionId,
        proposal.id,
        proposal.agentId,
        proposal.title,
        proposal.description,
        proposal.priority,
        proposal.estimatedCostUsd
      ]);

      // Create mission steps
      for (let i = 0; i < proposal.proposedSteps.length; i++) {
        const step = proposal.proposedSteps[i];
        await client.query(`
          INSERT INTO ops_mission_steps (
            id, mission_id, agent_id, step_order, kind, title, description,
            input_data, max_retries, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `, [
          uuid(),
          missionId,
          proposal.agentId,
          i + 1,
          step.kind,
          step.title,
          step.description || '',
          JSON.stringify(step.inputData || {}),
          step.maxRetries || 3
        ]);
      }

      await client.query('COMMIT');
      return missionId;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async emitProposalEvent(
    agentId: string, 
    kind: string, 
    title: string, 
    details: Record<string, any>
  ): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query(`
        INSERT INTO ops_agent_events (
          id, agent_id, kind, title, details, cost_usd, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [
        uuid(),
        agentId,
        kind,
        title,
        JSON.stringify(details),
        details.cost || 0
      ]);
    } finally {
      client.release();
    }
  }

  /**
   * Utility methods for external services
   */
  
  async getProposal(proposalId: string): Promise<MissionProposal | null> {
    const client = await this.db.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM ops_mission_proposals WHERE id = $1',
        [proposalId]
      );
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        id: row.id,
        agentId: row.agent_id,
        title: row.title,
        description: row.description,
        priority: row.priority,
        estimatedCostUsd: parseFloat(row.estimated_cost_usd),
        proposedSteps: row.proposed_steps,
        metadata: row.metadata
      };
    } finally {
      client.release();
    }
  }

  async getPendingProposals(limit: number = 50): Promise<MissionProposal[]> {
    const client = await this.db.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM ops_mission_proposals 
        WHERE status = 'pending' AND expires_at > NOW()
        ORDER BY priority DESC, created_at ASC
        LIMIT $1
      `, [limit]);
      
      return result.rows.map(row => ({
        id: row.id,
        agentId: row.agent_id,
        title: row.title,
        description: row.description,
        priority: row.priority,
        estimatedCostUsd: parseFloat(row.estimated_cost_usd),
        proposedSteps: row.proposed_steps,
        metadata: row.metadata
      }));
    } finally {
      client.release();
    }
  }

  async getAgentStats(agentId: string, days: number = 7): Promise<{
    proposalsSubmitted: number;
    proposalsApproved: number;
    autoApprovalRate: number;
    totalCostUsd: number;
    avgPriority: number;
  }> {
    const client = await this.db.connect();
    
    try {
      const result = await client.query(`
        SELECT 
          COUNT(*) as total_proposals,
          COUNT(*) FILTER (WHERE status = 'approved') as approved_proposals,
          COUNT(*) FILTER (WHERE auto_approved = true) as auto_approved,
          COALESCE(AVG(estimated_cost_usd), 0) as avg_cost,
          COALESCE(SUM(estimated_cost_usd), 0) as total_cost,
          COALESCE(AVG(priority), 0) as avg_priority
        FROM ops_mission_proposals
        WHERE agent_id = $1 AND created_at > NOW() - INTERVAL '$2 days'
      `, [agentId, days]);

      const row = result.rows[0];
      const totalProposals = parseInt(row.total_proposals);
      const autoApproved = parseInt(row.auto_approved);
      
      return {
        proposalsSubmitted: totalProposals,
        proposalsApproved: parseInt(row.approved_proposals),
        autoApprovalRate: totalProposals > 0 ? (autoApproved / totalProposals) * 100 : 0,
        totalCostUsd: parseFloat(row.total_cost),
        avgPriority: parseFloat(row.avg_priority)
      };
    } finally {
      client.release();
    }
  }
}

export default ProposalService;