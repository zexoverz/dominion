/**
 * Cost Tracking & Alerting Service
 * Monitors token usage, enforces spending limits, and alerts Lord Zexo
 */

import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

export interface CostAlert {
  id: string;
  agentId: string;
  date: string;
  alertLevel: 'warning' | 'slowdown' | 'emergency';
  currentCostUsd: number;
  threshold: number;
  message: string;
  sentAt: Date;
  acknowledged: boolean;
}

export interface DailyCostSummary {
  agentId: string;
  date: string;
  tokensUsed: number;
  costUsd: number;
  operationCounts: Record<string, number>;
  alertLevel: 'normal' | 'warning' | 'slowdown' | 'emergency';
  alertSentAt?: Date;
  projectedDailyCost: number;
}

export interface CostThresholds {
  warningUsd: number;
  slowdownUsd: number;
  emergencyUsd: number;
  slowdownEffects: {
    conversationFrequencyMultiplier: number;
    skipLowPriorityTriggers: boolean;
    requireApprovalForAll: boolean;
  };
}

const DEFAULT_COST_THRESHOLDS: CostThresholds = {
  warningUsd: 5.0,
  slowdownUsd: 10.0,
  emergencyUsd: 15.0,
  slowdownEffects: {
    conversationFrequencyMultiplier: 0.5,
    skipLowPriorityTriggers: true,
    requireApprovalForAll: true
  }
};

export class CostTracker {
  private costThresholds: CostThresholds = DEFAULT_COST_THRESHOLDS;
  
  constructor(private db: Pool) {
    this.loadCostThresholds();
  }

  private async loadCostThresholds(): Promise<void> {
    const client = await this.db.connect();
    
    try {
      const result = await client.query(
        'SELECT value FROM ops_policy WHERE key = $1',
        ['cost_thresholds']
      );
      
      if (result.rows.length > 0) {
        this.costThresholds = {
          ...DEFAULT_COST_THRESHOLDS,
          ...result.rows[0].value
        };
      }
    } catch (error) {
      console.warn('Failed to load cost thresholds, using defaults:', error.message);
    } finally {
      client.release();
    }
  }

  /**
   * Track token usage and cost for an agent operation
   */
  async trackUsage(
    agentId: string, 
    operation: string, 
    tokensUsed: number, 
    costUsd: number, 
    metadata?: Record<string, any>
  ): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert or update daily tracking record
      await client.query(`
        INSERT INTO ops_cost_tracking (
          agent_id, date, tokens_used, cost_usd, operation_counts, updated_at
        ) VALUES ($1, CURRENT_DATE, $2, $3, $4, NOW())
        ON CONFLICT (agent_id, date) 
        DO UPDATE SET 
          tokens_used = ops_cost_tracking.tokens_used + EXCLUDED.tokens_used,
          cost_usd = ops_cost_tracking.cost_usd + EXCLUDED.cost_usd,
          operation_counts = jsonb_set(
            ops_cost_tracking.operation_counts,
            ARRAY[$5],
            (COALESCE(ops_cost_tracking.operation_counts->$5, '0')::int + 1)::text::jsonb
          ),
          updated_at = NOW()
      `, [
        agentId,
        tokensUsed,
        costUsd,
        JSON.stringify({[operation]: 1}),
        operation
      ]);
      
      // Get updated totals for alert checking
      const updatedResult = await client.query(
        'SELECT * FROM ops_cost_tracking WHERE agent_id = $1 AND date = CURRENT_DATE',
        [agentId]
      );
      
      if (updatedResult.rows.length > 0) {
        const record = updatedResult.rows[0];
        const currentCost = parseFloat(record.cost_usd);
        
        // Check for alert conditions
        const alertLevel = this.determineAlertLevel(currentCost);
        
        if (alertLevel !== 'normal' && alertLevel !== record.alert_level) {
          await this.handleCostAlert(client, agentId, currentCost, alertLevel);
        }
      }
      
      await client.query('COMMIT');
      
      // Log the tracking
      console.log(`💰 Cost tracked for ${agentId}: ${operation} - ${tokensUsed} tokens, $${costUsd.toFixed(4)}`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to track cost usage:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if an agent is in slowdown mode due to cost limits
   */
  async isInSlowdownMode(agentId: string): Promise<boolean> {
    const client = await this.db.connect();
    
    try {
      const result = await client.query(
        'SELECT alert_level FROM ops_cost_tracking WHERE agent_id = $1 AND date = CURRENT_DATE',
        [agentId]
      );
      
      if (result.rows.length === 0) return false;
      
      const alertLevel = result.rows[0].alert_level;
      return alertLevel === 'slowdown' || alertLevel === 'emergency';
      
    } finally {
      client.release();
    }
  }

  /**
   * Get slowdown effects for an agent
   */
  async getSlowdownEffects(agentId: string): Promise<CostThresholds['slowdownEffects'] | null> {
    const isSlowdown = await this.isInSlowdownMode(agentId);
    return isSlowdown ? this.costThresholds.slowdownEffects : null;
  }

  /**
   * Check if an operation should be blocked due to cost limits
   */
  async shouldBlockOperation(
    agentId: string, 
    operationType: 'proposal' | 'conversation' | 'trigger', 
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<{ blocked: boolean; reason?: string }> {
    const client = await this.db.connect();
    
    try {
      const result = await client.query(
        'SELECT cost_usd, alert_level FROM ops_cost_tracking WHERE agent_id = $1 AND date = CURRENT_DATE',
        [agentId]
      );
      
      if (result.rows.length === 0) {
        return { blocked: false }; // No usage yet today
      }
      
      const { cost_usd, alert_level } = result.rows[0];
      const currentCost = parseFloat(cost_usd);
      
      // Emergency mode - block everything except high priority
      if (alert_level === 'emergency' && priority !== 'high') {
        return {
          blocked: true,
          reason: `Emergency cost limit exceeded ($${currentCost.toFixed(2)} >= $${this.costThresholds.emergencyUsd})`
        };
      }
      
      // Slowdown mode - apply restrictions
      if (alert_level === 'slowdown') {
        if (operationType === 'trigger' && priority === 'low') {
          return {
            blocked: true,
            reason: 'Low-priority triggers blocked in slowdown mode'
          };
        }
        
        if (operationType === 'conversation') {
          // Reduce conversation frequency (handled by caller using conversationFrequencyMultiplier)
          return { blocked: false };
        }
        
        if (operationType === 'proposal') {
          // All proposals require approval in slowdown mode
          return { blocked: false }; // But will require manual approval
        }
      }
      
      return { blocked: false };
      
    } finally {
      client.release();
    }
  }

  /**
   * Get daily cost summary for an agent
   */
  async getDailySummary(agentId: string, date?: string): Promise<DailyCostSummary | null> {
    const client = await this.db.connect();
    
    try {
      const queryDate = date || new Date().toISOString().split('T')[0];
      
      const result = await client.query(
        'SELECT * FROM ops_cost_tracking WHERE agent_id = $1 AND date = $2',
        [agentId, queryDate]
      );
      
      if (result.rows.length === 0) return null;
      
      const record = result.rows[0];
      const currentCost = parseFloat(record.cost_usd);
      
      // Calculate projected daily cost based on current hour
      const currentHour = new Date().getHours();
      const projectedDailyCost = currentHour > 0 ? (currentCost / currentHour) * 24 : currentCost;
      
      return {
        agentId: record.agent_id,
        date: record.date,
        tokensUsed: record.tokens_used,
        costUsd: currentCost,
        operationCounts: record.operation_counts,
        alertLevel: record.alert_level || 'normal',
        alertSentAt: record.alert_sent_at ? new Date(record.alert_sent_at) : undefined,
        projectedDailyCost
      };
      
    } finally {
      client.release();
    }
  }

  /**
   * Get cost summaries for all agents
   */
  async getAllDailySummaries(date?: string): Promise<DailyCostSummary[]> {
    const client = await this.db.connect();
    
    try {
      const queryDate = date || new Date().toISOString().split('T')[0];
      
      const result = await client.query(
        'SELECT * FROM ops_cost_tracking WHERE date = $1 ORDER BY cost_usd DESC',
        [queryDate]
      );
      
      return result.rows.map(record => {
        const currentCost = parseFloat(record.cost_usd);
        const currentHour = new Date().getHours();
        const projectedDailyCost = currentHour > 0 ? (currentCost / currentHour) * 24 : currentCost;
        
        return {
          agentId: record.agent_id,
          date: record.date,
          tokensUsed: record.tokens_used,
          costUsd: currentCost,
          operationCounts: record.operation_counts,
          alertLevel: record.alert_level || 'normal',
          alertSentAt: record.alert_sent_at ? new Date(record.alert_sent_at) : undefined,
          projectedDailyCost
        };
      });
      
    } finally {
      client.release();
    }
  }

  /**
   * Get historical cost data for charts
   */
  async getHistoricalData(
    agentId: string, 
    days: number = 30
  ): Promise<Array<{
    date: string;
    tokensUsed: number;
    costUsd: number;
    operationCounts: Record<string, number>;
  }>> {
    const client = await this.db.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM ops_cost_tracking 
        WHERE agent_id = $1 AND date > CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY date ASC
      `, [agentId]);
      
      return result.rows.map(record => ({
        date: record.date,
        tokensUsed: record.tokens_used,
        costUsd: parseFloat(record.cost_usd),
        operationCounts: record.operation_counts
      }));
      
    } finally {
      client.release();
    }
  }

  /**
   * Get system-wide cost statistics
   */
  async getSystemStats(days: number = 7): Promise<{
    totalCostUsd: number;
    totalTokens: number;
    averageDailyCost: number;
    agentCostBreakdown: Array<{ agentId: string; costUsd: number; percentage: number }>;
    costTrend: 'increasing' | 'decreasing' | 'stable';
  }> {
    const client = await this.db.connect();
    
    try {
      // Get totals for the period
      const totalResult = await client.query(`
        SELECT 
          SUM(cost_usd) as total_cost,
          SUM(tokens_used) as total_tokens,
          COUNT(DISTINCT date) as active_days
        FROM ops_cost_tracking 
        WHERE date > CURRENT_DATE - INTERVAL '${days} days'
      `);
      
      const { total_cost, total_tokens, active_days } = totalResult.rows[0];
      const totalCost = parseFloat(total_cost) || 0;
      const avgDailyCost = active_days > 0 ? totalCost / active_days : 0;
      
      // Get agent breakdown
      const agentResult = await client.query(`
        SELECT 
          agent_id,
          SUM(cost_usd) as agent_cost
        FROM ops_cost_tracking 
        WHERE date > CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY agent_id
        ORDER BY agent_cost DESC
      `);
      
      const agentBreakdown = agentResult.rows.map(row => ({
        agentId: row.agent_id,
        costUsd: parseFloat(row.agent_cost),
        percentage: totalCost > 0 ? (parseFloat(row.agent_cost) / totalCost) * 100 : 0
      }));
      
      // Calculate trend (compare first half vs second half of period)
      const halfDays = Math.floor(days / 2);
      const trendResult = await client.query(`
        SELECT 
          SUM(cost_usd) FILTER (WHERE date > CURRENT_DATE - INTERVAL '${halfDays} days') as recent_cost,
          SUM(cost_usd) FILTER (WHERE date <= CURRENT_DATE - INTERVAL '${halfDays} days' 
                                 AND date > CURRENT_DATE - INTERVAL '${days} days') as older_cost
        FROM ops_cost_tracking
        WHERE date > CURRENT_DATE - INTERVAL '${days} days'
      `);
      
      const { recent_cost, older_cost } = trendResult.rows[0];
      const recentCost = parseFloat(recent_cost) || 0;
      const olderCost = parseFloat(older_cost) || 0;
      
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (olderCost > 0) {
        const changePercent = ((recentCost - olderCost) / olderCost) * 100;
        if (changePercent > 10) trend = 'increasing';
        else if (changePercent < -10) trend = 'decreasing';
      }
      
      return {
        totalCostUsd: totalCost,
        totalTokens: parseInt(total_tokens) || 0,
        averageDailyCost: avgDailyCost,
        agentCostBreakdown: agentBreakdown,
        costTrend: trend
      };
      
    } finally {
      client.release();
    }
  }

  /**
   * Send cost alert to Lord Zexo
   */
  private async handleCostAlert(
    client: any, 
    agentId: string, 
    currentCost: number, 
    alertLevel: 'warning' | 'slowdown' | 'emergency'
  ): Promise<void> {
    try {
      // Update the tracking record with alert info
      await client.query(
        'UPDATE ops_cost_tracking SET alert_level = $1, alert_sent_at = NOW() WHERE agent_id = $2 AND date = CURRENT_DATE',
        [alertLevel, agentId]
      );
      
      // Create alert record
      const alertId = uuid();
      const threshold = this.getThresholdForLevel(alertLevel);
      const message = this.generateAlertMessage(agentId, currentCost, alertLevel, threshold);
      
      // Log the alert
      console.warn(`🚨 COST ALERT [${alertLevel.toUpperCase()}] for ${agentId}: $${currentCost.toFixed(2)} >= $${threshold}`);
      
      // Create agent event
      await client.query(`
        INSERT INTO ops_agent_events (
          id, agent_id, kind, title, summary, details, cost_usd, created_at
        ) VALUES ($1, $2, 'cost_alert', $3, $4, $5, $6, NOW())
      `, [
        uuid(),
        agentId,
        `Cost Alert: ${alertLevel.toUpperCase()}`,
        message,
        JSON.stringify({
          alertLevel,
          currentCost,
          threshold,
          alertId
        }),
        0
      ]);
      
      // Send notification to Lord Zexo (implementation depends on notification service)
      await this.sendAlertNotification(agentId, message, alertLevel);
      
    } catch (error) {
      console.error('Failed to handle cost alert:', error);
    }
  }

  private determineAlertLevel(currentCost: number): 'normal' | 'warning' | 'slowdown' | 'emergency' {
    if (currentCost >= this.costThresholds.emergencyUsd) return 'emergency';
    if (currentCost >= this.costThresholds.slowdownUsd) return 'slowdown';
    if (currentCost >= this.costThresholds.warningUsd) return 'warning';
    return 'normal';
  }

  private getThresholdForLevel(alertLevel: 'warning' | 'slowdown' | 'emergency'): number {
    switch (alertLevel) {
      case 'warning': return this.costThresholds.warningUsd;
      case 'slowdown': return this.costThresholds.slowdownUsd;
      case 'emergency': return this.costThresholds.emergencyUsd;
      default: return 0;
    }
  }

  private generateAlertMessage(
    agentId: string, 
    currentCost: number, 
    alertLevel: string, 
    threshold: number
  ): string {
    const messages = {
      warning: `⚠️ ${agentId} has reached the WARNING threshold: $${currentCost.toFixed(2)} >= $${threshold}. Monitor usage closely.`,
      slowdown: `🐌 ${agentId} has entered SLOWDOWN mode: $${currentCost.toFixed(2)} >= $${threshold}. Reducing operation frequency and requiring approvals.`,
      emergency: `🚨 ${agentId} has hit EMERGENCY limits: $${currentCost.toFixed(2)} >= $${threshold}. Only high-priority operations allowed!`
    };
    
    return messages[alertLevel] || `Cost alert for ${agentId}: $${currentCost.toFixed(2)}`;
  }

  private async sendAlertNotification(
    agentId: string, 
    message: string, 
    alertLevel: string
  ): Promise<void> {
    // This would integrate with your notification service
    // For now, just log it prominently
    console.log(`📧 NOTIFICATION TO LORD ZEXO: ${message}`);
    
    // TODO: Integrate with email/Discord/Slack notification service
    // await notificationService.send({
    //   recipient: 'lord-zexo',
    //   subject: `Dominion Cost Alert: ${agentId} - ${alertLevel.toUpperCase()}`,
    //   message,
    //   priority: alertLevel === 'emergency' ? 'high' : 'normal'
    // });
  }

  /**
   * Utility methods
   */
  
  async resetDailyTracking(agentId: string): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query(
        'DELETE FROM ops_cost_tracking WHERE agent_id = $1 AND date = CURRENT_DATE',
        [agentId]
      );
      
      console.log(`Reset daily cost tracking for ${agentId}`);
    } finally {
      client.release();
    }
  }

  async acknowledgeAlert(agentId: string, date: string): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query(
        'UPDATE ops_cost_tracking SET alert_level = $1 WHERE agent_id = $2 AND date = $3',
        ['normal', agentId, date]
      );
      
      console.log(`Alert acknowledged for ${agentId} on ${date}`);
    } finally {
      client.release();
    }
  }

  async updateThresholds(newThresholds: Partial<CostThresholds>): Promise<void> {
    const client = await this.db.connect();
    
    try {
      const updatedThresholds = { ...this.costThresholds, ...newThresholds };
      
      await client.query(
        'UPDATE ops_policy SET value = $1, updated_at = NOW() WHERE key = $2',
        [JSON.stringify(updatedThresholds), 'cost_thresholds']
      );
      
      this.costThresholds = updatedThresholds;
      console.log('Cost thresholds updated:', updatedThresholds);
    } finally {
      client.release();
    }
  }
}

export default CostTracker;