/**
 * Heartbeat System - Core orchestration engine for the Dominion
 * Handles trigger evaluation, reactions, memory promotion, learning, and recovery
 */

import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

export interface HeartbeatRun {
  id: string;
  runType: 'heartbeat' | 'trigger_evaluation' | 'memory_maintenance' | 'cost_check';
  agentId?: string;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  actionsTaken: number;
  tokensUsed: number;
  costUsd: number;
  status: 'running' | 'completed' | 'failed' | 'timeout';
  errorMessage?: string;
  details: Record<string, any>;
}

export interface TriggerEvaluation {
  triggerId: string;
  agentId: string;
  triggerName: string;
  shouldFire: boolean;
  reason: string;
  cooldownRemaining?: number;
  lastFiredAt?: Date;
}

const HEARTBEAT_BUDGET_MS = 4000; // 4-second total budget per heartbeat
const WIB_TIMEZONE = 'Asia/Jakarta'; // UTC+7

export class HeartbeatService {
  constructor(private db: Pool) {}

  /**
   * Main heartbeat cycle - runs all core operations within budget
   */
  async runHeartbeat(agentId?: string): Promise<HeartbeatRun> {
    const runId = uuid();
    const startTime = Date.now();
    
    console.log(`🫀 Starting heartbeat run ${runId}${agentId ? ` for ${agentId}` : ' (system-wide)'}`);
    
    // Initialize run record
    await this.initializeRun(runId, 'heartbeat', agentId);
    
    let actionsTaken = 0;
    let tokensUsed = 0;
    let costUsd = 0;
    let errorMessage: string | null = null;
    
    try {
      // Execute operations within time budget
      const operations = [
        { name: 'evaluateTriggers', fn: () => this.evaluateTriggers(agentId), budgetMs: 1500 },
        { name: 'processReactionQueue', fn: () => this.processReactionQueue(agentId), budgetMs: 1000 },
        { name: 'promoteInsights', fn: () => this.promoteInsights(agentId), budgetMs: 800 },
        { name: 'learnFromOutcomes', fn: () => this.learnFromOutcomes(agentId), budgetMs: 400 },
        { name: 'recoverStaleSteps', fn: () => this.recoverStaleSteps(agentId), budgetMs: 200 },
        { name: 'recoverStaleRoundtables', fn: () => this.recoverStaleRoundtables(), budgetMs: 100 }
      ];
      
      let remainingBudget = HEARTBEAT_BUDGET_MS;
      const results: Record<string, any> = {};
      
      for (const operation of operations) {
        if (remainingBudget <= 0) {
          console.log(`⏱️ Budget exhausted, skipping ${operation.name}`);
          break;
        }
        
        const opStart = Date.now();
        
        try {
          console.log(`🔄 Running ${operation.name} (budget: ${operation.budgetMs}ms)`);
          const result = await operation.fn();
          const opDuration = Date.now() - opStart;
          
          results[operation.name] = {
            success: true,
            durationMs: opDuration,
            ...result
          };
          
          actionsTaken += result.actions || 0;
          tokensUsed += result.tokens || 0;
          costUsd += result.cost || 0;
          
          remainingBudget -= opDuration;
          
          if (opDuration > operation.budgetMs * 1.5) {
            console.warn(`⚠️ ${operation.name} exceeded budget: ${opDuration}ms > ${operation.budgetMs}ms`);
          }
          
        } catch (error) {
          const opDuration = Date.now() - opStart;
          console.error(`❌ ${operation.name} failed:`, error.message);
          
          results[operation.name] = {
            success: false,
            error: error.message,
            durationMs: opDuration
          };
          
          remainingBudget -= opDuration;
        }
      }

      // Track cost for this run
      await this.trackRunCost(agentId, tokensUsed, costUsd);
      
      const totalDuration = Date.now() - startTime;
      
      await this.completeRun(runId, {
        status: 'completed',
        actionsTaken,
        tokensUsed,
        costUsd,
        durationMs: totalDuration,
        details: results
      });

      console.log(`✅ Heartbeat run ${runId} completed: ${actionsTaken} actions, ${totalDuration}ms, $${costUsd.toFixed(4)}`);
      
      return {
        id: runId,
        runType: 'heartbeat',
        agentId,
        startedAt: new Date(startTime),
        completedAt: new Date(),
        durationMs: totalDuration,
        actionsTaken,
        tokensUsed,
        costUsd,
        status: 'completed',
        details: results
      };
      
    } catch (error) {
      errorMessage = error.message;
      console.error(`💥 Heartbeat run ${runId} failed:`, error);
      
      await this.completeRun(runId, {
        status: 'failed',
        actionsTaken,
        tokensUsed,
        costUsd,
        durationMs: Date.now() - startTime,
        errorMessage,
        details: { error: error.message, stack: error.stack }
      });
      
      throw error;
    }
  }

  /**
   * Evaluate trigger rules and fire appropriate triggers
   */
  async evaluateTriggers(agentId?: string): Promise<{ actions: number; tokens: number; cost: number; triggers: TriggerEvaluation[] }> {
    const client = await this.db.connect();
    let actions = 0;
    let tokens = 0;
    let cost = 0;
    const evaluations: TriggerEvaluation[] = [];
    
    try {
      // Get active trigger rules
      const query = agentId 
        ? 'SELECT * FROM ops_trigger_rules WHERE agent_id = $1 AND is_active = true ORDER BY last_fired_at ASC NULLS FIRST'
        : 'SELECT * FROM ops_trigger_rules WHERE is_active = true ORDER BY last_fired_at ASC NULLS FIRST';
      
      const params = agentId ? [agentId] : [];
      const triggerResult = await client.query(query, params);
      
      const currentTime = new Date();
      
      for (const trigger of triggerResult.rows) {
        const evaluation = await this.evaluateSingleTrigger(client, trigger, currentTime);
        evaluations.push(evaluation);
        
        if (evaluation.shouldFire) {
          try {
            await this.fireTrigger(client, trigger, currentTime);
            actions++;
            
            // Estimate cost based on trigger type
            const triggerCost = this.estimateTriggerCost(trigger);
            tokens += triggerCost.tokens;
            cost += triggerCost.cost;
            
          } catch (error) {
            console.error(`Failed to fire trigger ${trigger.name}:`, error);
            await this.emitAgentEvent(client, trigger.agent_id, 'error_occurred', 
              `Trigger firing failed: ${trigger.name}`, { error: error.message, triggerId: trigger.id });
          }
        }
      }
      
      return { actions, tokens, cost, triggers: evaluations };
      
    } finally {
      client.release();
    }
  }

  private async evaluateSingleTrigger(client: any, trigger: any, currentTime: Date): Promise<TriggerEvaluation> {
    const lastFiredAt = trigger.last_fired_at ? new Date(trigger.last_fired_at) : null;
    const cooldownMs = trigger.cooldown_minutes * 60 * 1000;
    
    // Check cooldown
    if (lastFiredAt && (currentTime.getTime() - lastFiredAt.getTime()) < cooldownMs) {
      const remainingMs = cooldownMs - (currentTime.getTime() - lastFiredAt.getTime());
      return {
        triggerId: trigger.id,
        agentId: trigger.agent_id,
        triggerName: trigger.name,
        shouldFire: false,
        reason: `Cooldown active: ${Math.ceil(remainingMs / 1000 / 60)} minutes remaining`,
        cooldownRemaining: remainingMs,
        lastFiredAt
      };
    }
    
    // Check daily fire limit
    if (trigger.max_fires_per_day) {
      const today = new Date().toISOString().split('T')[0];
      const todayFiresResult = await client.query(`
        SELECT fire_count FROM ops_trigger_rules 
        WHERE id = $1 AND DATE(last_fired_at) = $2
      `, [trigger.id, today]);
      
      const todayFires = todayFiresResult.rows.length > 0 ? todayFiresResult.rows[0].fire_count : 0;
      
      if (todayFires >= trigger.max_fires_per_day) {
        return {
          triggerId: trigger.id,
          agentId: trigger.agent_id,
          triggerName: trigger.name,
          shouldFire: false,
          reason: `Daily limit reached: ${todayFires}/${trigger.max_fires_per_day}`,
          lastFiredAt
        };
      }
    }
    
    // Evaluate trigger conditions
    const shouldFire = await this.evaluateTriggerConditions(client, trigger, currentTime);
    
    return {
      triggerId: trigger.id,
      agentId: trigger.agent_id,
      triggerName: trigger.name,
      shouldFire,
      reason: shouldFire ? 'Conditions met' : 'Conditions not met',
      lastFiredAt
    };
  }

  private async evaluateTriggerConditions(client: any, trigger: any, currentTime: Date): Promise<boolean> {
    const conditions = trigger.conditions;
    
    switch (trigger.trigger_type) {
      case 'time_based':
        return this.evaluateTimeBasedTrigger(conditions, currentTime);
        
      case 'event_based':
        return await this.evaluateEventBasedTrigger(client, conditions, trigger.agent_id);
        
      case 'condition_based':
        return await this.evaluateConditionBasedTrigger(client, conditions, trigger.agent_id);
        
      default:
        console.warn(`Unknown trigger type: ${trigger.trigger_type}`);
        return false;
    }
  }

  private evaluateTimeBasedTrigger(conditions: any, currentTime: Date): boolean {
    if (!conditions.schedule) return false;
    
    // Parse cron-like schedule (simplified implementation)
    const schedule = conditions.schedule; // e.g., "0 9 * * 1-5"
    const [minute, hour, dayMonth, month, dayWeek] = schedule.split(' ');
    
    const wibTime = new Date(currentTime.toLocaleString('en-US', { timeZone: WIB_TIMEZONE }));
    const currentMinute = wibTime.getMinutes();
    const currentHour = wibTime.getHours();
    const currentDayWeek = wibTime.getDay(); // 0 = Sunday
    
    // Simple matching logic (extend as needed)
    const hourMatch = hour === '*' || parseInt(hour) === currentHour;
    const minuteMatch = minute === '*' || parseInt(minute) === currentMinute;
    
    let dayWeekMatch = true;
    if (dayWeek !== '*') {
      if (dayWeek.includes('-')) {
        const [start, end] = dayWeek.split('-').map(d => parseInt(d));
        dayWeekMatch = currentDayWeek >= start && currentDayWeek <= end;
      } else {
        dayWeekMatch = parseInt(dayWeek) === currentDayWeek;
      }
    }
    
    return hourMatch && minuteMatch && dayWeekMatch;
  }

  private async evaluateEventBasedTrigger(client: any, conditions: any, agentId: string): Promise<boolean> {
    if (!conditions.event_type) return false;
    
    // Look for recent events matching the criteria
    const eventQuery = `
      SELECT COUNT(*) as count FROM ops_agent_events 
      WHERE kind = $1 AND created_at > NOW() - INTERVAL '5 minutes'
      ${conditions.filters ? 'AND details @> $2' : ''}
    `;
    
    const params = conditions.filters 
      ? [conditions.event_type, JSON.stringify(conditions.filters)]
      : [conditions.event_type];
    
    const result = await client.query(eventQuery, params);
    return parseInt(result.rows[0].count) > 0;
  }

  private async evaluateConditionBasedTrigger(client: any, conditions: any, agentId: string): Promise<boolean> {
    // Evaluate complex conditions like cost spikes, error patterns, etc.
    
    if (conditions.cost_spike) {
      const threshold = conditions.cost_spike.threshold_multiplier;
      const timeWindow = conditions.cost_spike.time_window_minutes;
      
      const costResult = await client.query(`
        SELECT 
          AVG(cost_usd) as avg_cost,
          MAX(cost_usd) as max_cost
        FROM ops_action_runs 
        WHERE agent_id = $1 AND started_at > NOW() - INTERVAL '${timeWindow} minutes'
      `, [agentId]);
      
      if (costResult.rows.length > 0) {
        const { avg_cost, max_cost } = costResult.rows[0];
        if (avg_cost > 0 && max_cost > avg_cost * threshold) {
          return true;
        }
      }
    }
    
    if (conditions.error_pattern) {
      const errorCount = conditions.error_pattern.error_count.gte;
      const timeWindow = conditions.error_pattern.time_window_minutes;
      
      const errorResult = await client.query(`
        SELECT COUNT(*) as count FROM ops_agent_events
        WHERE agent_id = $1 AND kind = 'error_occurred' 
        AND created_at > NOW() - INTERVAL '${timeWindow} minutes'
      `, [agentId]);
      
      return parseInt(errorResult.rows[0].count) >= errorCount;
    }
    
    return false;
  }

  private async fireTrigger(client: any, trigger: any, currentTime: Date): Promise<void> {
    // Update trigger fire count and timestamp
    await client.query(`
      UPDATE ops_trigger_rules 
      SET last_fired_at = $1, fire_count = fire_count + 1
      WHERE id = $2
    `, [currentTime, trigger.id]);
    
    // Execute the trigger action
    const actionConfig = trigger.action_config;
    
    switch (actionConfig.action) {
      case 'create_proposal':
        await this.executeCreateProposal(client, trigger.agent_id, actionConfig);
        break;
        
      case 'initiate_roundtable':
        await this.executeInitiateRoundtable(client, trigger.agent_id, actionConfig);
        break;
        
      case 'send_notification':
        await this.executeSendNotification(client, trigger.agent_id, actionConfig);
        break;
        
      default:
        console.warn(`Unknown trigger action: ${actionConfig.action}`);
    }
    
    // Log the trigger fire
    await this.emitAgentEvent(client, trigger.agent_id, 'trigger_fired', 
      `Triggered: ${trigger.name}`, { 
        triggerId: trigger.id, 
        action: actionConfig.action,
        triggerType: trigger.trigger_type 
      });
  }

  private estimateTriggerCost(trigger: any): { tokens: number; cost: number } {
    // Simple cost estimation based on trigger action type
    const actionType = trigger.action_config.action;
    
    const costMap: Record<string, { tokens: number; costUsd: number }> = {
      'create_proposal': { tokens: 500, costUsd: 0.02 },
      'initiate_roundtable': { tokens: 300, costUsd: 0.015 },
      'send_notification': { tokens: 100, costUsd: 0.005 }
    };
    
    return costMap[actionType] || { tokens: 200, costUsd: 0.01 };
  }

  /**
   * Process agent-to-agent reaction queue
   */
  async processReactionQueue(agentId?: string): Promise<{ actions: number; tokens: number; cost: number }> {
    const client = await this.db.connect();
    let actions = 0;
    let tokens = 0;
    let cost = 0;
    
    try {
      const query = agentId
        ? 'SELECT * FROM ops_agent_reactions WHERE to_agent_id = $1 AND status = $2 ORDER BY created_at ASC LIMIT 10'
        : 'SELECT * FROM ops_agent_reactions WHERE status = $1 ORDER BY created_at ASC LIMIT 20';
      
      const params = agentId ? [agentId, 'pending'] : ['pending'];
      const reactionResult = await client.query(query, params);
      
      for (const reaction of reactionResult.rows) {
        try {
          await this.processReaction(client, reaction);
          actions++;
          tokens += 150; // Estimated tokens per reaction
          cost += 0.008; // Estimated cost per reaction
        } catch (error) {
          console.error(`Failed to process reaction ${reaction.id}:`, error);
        }
      }
      
      return { actions, tokens, cost };
      
    } finally {
      client.release();
    }
  }

  private async processReaction(client: any, reaction: any): Promise<void> {
    // Process the reaction - this could trigger further actions
    // For now, just mark as processed and log
    
    await client.query(
      'UPDATE ops_agent_reactions SET status = $1, processed_at = NOW() WHERE id = $2',
      ['processed', reaction.id]
    );
    
    // Create an event for the receiving agent
    await this.emitAgentEvent(client, reaction.to_agent_id, 'reaction_received',
      `Reaction from ${reaction.from_agent_id}: ${reaction.reaction_type}`,
      {
        fromAgent: reaction.from_agent_id,
        reactionType: reaction.reaction_type,
        message: reaction.message,
        context: reaction.context
      }
    );
  }

  /**
   * Promote high-confidence memories
   */
  async promoteInsights(agentId?: string): Promise<{ actions: number; tokens: number; cost: number }> {
    const client = await this.db.connect();
    let actions = 0;
    let tokens = 0;
    let cost = 0;
    
    try {
      // Find memories that should be promoted based on confidence and access patterns
      const query = agentId
        ? `SELECT * FROM ops_agent_memory 
           WHERE agent_id = $1 AND confidence >= 0.85 AND access_count >= 3
           AND superseded_by IS NULL AND last_accessed_at > NOW() - INTERVAL '7 days'
           ORDER BY confidence DESC, access_count DESC LIMIT 5`
        : `SELECT * FROM ops_agent_memory 
           WHERE confidence >= 0.85 AND access_count >= 3
           AND superseded_by IS NULL AND last_accessed_at > NOW() - INTERVAL '7 days'
           ORDER BY confidence DESC, access_count DESC LIMIT 10`;
      
      const params = agentId ? [agentId] : [];
      const memoryResult = await client.query(query, params);
      
      for (const memory of memoryResult.rows) {
        // Promote memory by creating an insight event
        await this.emitAgentEvent(client, memory.agent_id, 'memory_promoted',
          `High-confidence ${memory.memory_type}: ${memory.title}`,
          {
            memoryId: memory.id,
            memoryType: memory.memory_type,
            confidence: memory.confidence,
            accessCount: memory.access_count
          }
        );
        
        actions++;
        tokens += 50;
        cost += 0.002;
      }
      
      return { actions, tokens, cost };
      
    } finally {
      client.release();
    }
  }

  /**
   * Learn from completed mission outcomes
   */
  async learnFromOutcomes(agentId?: string): Promise<{ actions: number; tokens: number; cost: number }> {
    const client = await this.db.connect();
    let actions = 0;
    let tokens = 0;
    let cost = 0;
    
    try {
      // Find recently completed missions with interesting outcomes
      const query = agentId
        ? `SELECT * FROM ops_missions 
           WHERE agent_id = $1 AND status IN ('completed', 'failed')
           AND completed_at > NOW() - INTERVAL '24 hours'
           ORDER BY completed_at DESC LIMIT 5`
        : `SELECT * FROM ops_missions 
           WHERE status IN ('completed', 'failed')
           AND completed_at > NOW() - INTERVAL '24 hours'
           ORDER BY completed_at DESC LIMIT 10`;
      
      const params = agentId ? [agentId] : [];
      const missionResult = await client.query(query, params);
      
      for (const mission of missionResult.rows) {
        // Analyze mission for learning opportunities
        const learningInsights = await this.analyzeMissionForLearning(client, mission);
        
        for (const insight of learningInsights) {
          // Create memory from learning
          await client.query(`
            INSERT INTO ops_agent_memory (
              id, agent_id, memory_type, title, content, confidence, tags, 
              source_context, source_trace_id, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
          `, [
            uuid(),
            mission.agent_id,
            'lesson',
            insight.title,
            insight.content,
            insight.confidence,
            insight.tags,
            `mission_${mission.id}`,
            `mission_learning_${mission.id}_${Date.now()}`,
          ]);
          
          actions++;
          tokens += 200;
          cost += 0.01;
        }
      }
      
      return { actions, tokens, cost };
      
    } finally {
      client.release();
    }
  }

  private async analyzeMissionForLearning(client: any, mission: any): Promise<Array<{
    title: string;
    content: string;
    confidence: number;
    tags: string[];
  }>> {
    const insights = [];
    
    // Analyze mission performance
    const stepsResult = await client.query(
      'SELECT * FROM ops_mission_steps WHERE mission_id = $1 ORDER BY step_order',
      [mission.id]
    );
    
    const steps = stepsResult.rows;
    const failedSteps = steps.filter(s => s.status === 'failed');
    const totalSteps = steps.length;
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    
    // Learn from failures
    if (failedSteps.length > 0) {
      insights.push({
        title: `Step failure pattern in ${mission.title}`,
        content: `Mission had ${failedSteps.length}/${totalSteps} failed steps. Common failure types: ${failedSteps.map(s => s.kind).join(', ')}. Consider additional validation or different approach.`,
        confidence: 0.75,
        tags: ['failure_analysis', 'step_optimization', mission.agent_id]
      });
    }
    
    // Learn from success patterns
    if (mission.status === 'completed' && completedSteps === totalSteps) {
      const avgCostPerStep = mission.actual_cost_usd / totalSteps;
      
      if (avgCostPerStep < 0.5) {
        insights.push({
          title: `Efficient mission execution: ${mission.title}`,
          content: `Successfully completed mission with low average cost per step ($${avgCostPerStep.toFixed(3)}). Step pattern: ${steps.map(s => s.kind).join(' → ')} worked well for this mission type.`,
          confidence: 0.80,
          tags: ['efficiency', 'success_pattern', mission.agent_id]
        });
      }
    }
    
    return insights;
  }

  /**
   * Recover stale mission steps (running > 30 minutes)
   */
  async recoverStaleSteps(agentId?: string): Promise<{ actions: number; tokens: number; cost: number }> {
    const client = await this.db.connect();
    let actions = 0;
    
    try {
      const query = agentId
        ? `UPDATE ops_mission_steps 
           SET status = 'failed', error_message = 'Recovered from stale state - exceeded 30 minute timeout'
           WHERE agent_id = $1 AND status = 'running' 
           AND (last_heartbeat_at < NOW() - INTERVAL '30 minutes' OR last_heartbeat_at IS NULL)
           RETURNING id, mission_id, title`
        : `UPDATE ops_mission_steps 
           SET status = 'failed', error_message = 'Recovered from stale state - exceeded 30 minute timeout'
           WHERE status = 'running' 
           AND (last_heartbeat_at < NOW() - INTERVAL '30 minutes' OR last_heartbeat_at IS NULL)
           RETURNING id, mission_id, title`;
      
      const params = agentId ? [agentId] : [];
      const result = await client.query(query, params);
      
      actions = result.rows.length;
      
      // Log recovery actions
      for (const step of result.rows) {
        await this.emitAgentEvent(client, agentId || 'system', 'recovery_action',
          `Recovered stale step: ${step.title}`,
          { stepId: step.id, missionId: step.mission_id, reason: 'timeout' }
        );
      }
      
      return { actions, tokens: 0, cost: 0 };
      
    } finally {
      client.release();
    }
  }

  /**
   * Recover stale roundtable conversations
   */
  async recoverStaleRoundtables(): Promise<{ actions: number; tokens: number; cost: number }> {
    const client = await this.db.connect();
    let actions = 0;
    
    try {
      const result = await client.query(`
        UPDATE ops_roundtable_queue 
        SET status = 'stalled'
        WHERE status = 'active' 
        AND last_activity_at < NOW() - INTERVAL '1 hour'
        RETURNING id, topic, participants
      `);
      
      actions = result.rows.length;
      
      // Log recovery actions
      for (const conversation of result.rows) {
        console.log(`Recovered stalled roundtable: ${conversation.topic}`);
      }
      
      return { actions, tokens: 0, cost: 0 };
      
    } finally {
      client.release();
    }
  }

  private async trackRunCost(agentId: string | undefined, tokens: number, cost: number): Promise<void> {
    if (!agentId || tokens === 0) return;
    
    const client = await this.db.connect();
    
    try {
      await client.query(`
        INSERT INTO ops_cost_tracking (agent_id, date, tokens_used, cost_usd, updated_at)
        VALUES ($1, CURRENT_DATE, $2, $3, NOW())
        ON CONFLICT (agent_id, date) 
        DO UPDATE SET 
          tokens_used = ops_cost_tracking.tokens_used + EXCLUDED.tokens_used,
          cost_usd = ops_cost_tracking.cost_usd + EXCLUDED.cost_usd,
          updated_at = NOW()
      `, [agentId, tokens, cost]);
    } finally {
      client.release();
    }
  }

  private async initializeRun(runId: string, runType: string, agentId?: string): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query(`
        INSERT INTO ops_action_runs (
          id, run_type, agent_id, started_at, status
        ) VALUES ($1, $2, $3, NOW(), 'running')
      `, [runId, runType, agentId]);
    } finally {
      client.release();
    }
  }

  private async completeRun(runId: string, updates: {
    status: string;
    actionsTaken: number;
    tokensUsed: number;
    costUsd: number;
    durationMs: number;
    errorMessage?: string;
    details: Record<string, any>;
  }): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query(`
        UPDATE ops_action_runs SET
          completed_at = NOW(),
          duration_ms = $2,
          actions_taken = $3,
          tokens_used = $4,
          cost_usd = $5,
          status = $6,
          error_message = $7,
          details = $8
        WHERE id = $1
      `, [
        runId,
        updates.durationMs,
        updates.actionsTaken,
        updates.tokensUsed,
        updates.costUsd,
        updates.status,
        updates.errorMessage,
        JSON.stringify(updates.details)
      ]);
    } finally {
      client.release();
    }
  }

  private async emitAgentEvent(
    client: any,
    agentId: string,
    kind: string,
    title: string,
    details: Record<string, any>
  ): Promise<void> {
    await client.query(`
      INSERT INTO ops_agent_events (
        id, agent_id, kind, title, details, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())
    `, [uuid(), agentId, kind, title, JSON.stringify(details)]);
  }

  // Trigger action executors
  private async executeCreateProposal(client: any, agentId: string, actionConfig: any): Promise<void> {
    // This would integrate with ProposalService to create a proposal
    console.log(`Creating proposal for ${agentId}:`, actionConfig.title);
    // Implementation would call ProposalService.createProposalAndMaybeAutoApprove()
  }

  private async executeInitiateRoundtable(client: any, agentId: string, actionConfig: any): Promise<void> {
    // This would integrate with RoundtableService to start a conversation
    console.log(`Initiating roundtable for ${agentId}:`, actionConfig.topic);
    // Implementation would call RoundtableService.initiateConversation()
  }

  private async executeSendNotification(client: any, agentId: string, actionConfig: any): Promise<void> {
    // This would send notifications (email, Discord, etc.)
    console.log(`Sending notification for ${agentId}:`, actionConfig.message);
    // Implementation would use notification service
  }

  /**
   * Utility methods for external access
   */
  
  async getRecentRuns(agentId?: string, limit: number = 20): Promise<HeartbeatRun[]> {
    const client = await this.db.connect();
    
    try {
      const query = agentId
        ? 'SELECT * FROM ops_action_runs WHERE agent_id = $1 ORDER BY started_at DESC LIMIT $2'
        : 'SELECT * FROM ops_action_runs ORDER BY started_at DESC LIMIT $1';
      
      const params = agentId ? [agentId, limit] : [limit];
      const result = await client.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        runType: row.run_type,
        agentId: row.agent_id,
        startedAt: new Date(row.started_at),
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        durationMs: row.duration_ms,
        actionsTaken: row.actions_taken,
        tokensUsed: row.tokens_used,
        costUsd: parseFloat(row.cost_usd),
        status: row.status,
        errorMessage: row.error_message,
        details: row.details
      }));
    } finally {
      client.release();
    }
  }

  async getSystemHealth(): Promise<{
    activeRuns: number;
    recentFailures: number;
    avgDurationMs: number;
    totalCostToday: number;
  }> {
    const client = await this.db.connect();
    
    try {
      const result = await client.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'running') as active_runs,
          COUNT(*) FILTER (WHERE status = 'failed' AND started_at > NOW() - INTERVAL '1 hour') as recent_failures,
          AVG(duration_ms) FILTER (WHERE status = 'completed' AND started_at > NOW() - INTERVAL '24 hours') as avg_duration,
          SUM(cost_usd) FILTER (WHERE DATE(started_at) = CURRENT_DATE) as total_cost_today
        FROM ops_action_runs
      `);
      
      const row = result.rows[0];
      return {
        activeRuns: parseInt(row.active_runs) || 0,
        recentFailures: parseInt(row.recent_failures) || 0,
        avgDurationMs: parseFloat(row.avg_duration) || 0,
        totalCostToday: parseFloat(row.total_cost_today) || 0
      };
    } finally {
      client.release();
    }
  }
}

export default HeartbeatService;