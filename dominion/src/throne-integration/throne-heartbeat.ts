/**
 * 👑 THRONE HEARTBEAT — The Pulse of the Dominion
 *
 * Runs periodically to check on the Dominion's state, auto-approve
 * low-cost proposals, spawn generals for mission steps, and report status.
 *
 * "The Dominion does not sleep. Neither does its sovereign."
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  steps?: ProposalStep[];
  createdAt: string;
  createdBy: string;
  assignedGeneral?: string;
  metadata?: Record<string, unknown>;
}

export interface ProposalStep {
  id: string;
  title: string;
  description: string;
  assignedGeneral: string;
  estimatedCost: number;
  status: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  priority: 'critical' | 'high' | 'medium' | 'low';
  steps: MissionStep[];
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface MissionStep {
  id: string;
  title: string;
  description: string;
  assignedGeneral: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  dependsOn?: string[];
}

export interface DailyCosts {
  total: number;
  budget: number;
  remaining: number;
  breakdown: Record<string, number>;
}

export interface DominionEvent {
  generalId: string;
  type: string;
  message: string;
  missionId?: string;
  data?: Record<string, unknown>;
  timestamp?: string;
}

export interface HeartbeatReport {
  timestamp: string;
  proposalsReviewed: number;
  proposalsAutoApproved: number;
  activeMissions: number;
  agentsSpawned: string[];
  dailyCosts: DailyCosts | null;
  budgetStatus: 'ok' | 'warning' | 'critical';
  errors: string[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = 'https://dominion-api-production.up.railway.app';
const AUTO_APPROVE_THRESHOLD = 1.0; // $1
const DAILY_BUDGET = 10.0; // $10 daily budget
const BUDGET_WARNING_THRESHOLD = 0.75; // warn at 75%
const BUDGET_CRITICAL_THRESHOLD = 0.90; // critical at 90%

// ---------------------------------------------------------------------------
// API Helpers
// ---------------------------------------------------------------------------

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function apiPatch<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function logEvent(event: DominionEvent): Promise<void> {
  await apiPost('/api/events', {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Core Heartbeat Functions
// ---------------------------------------------------------------------------

/**
 * Check pending proposals and auto-approve those under cost threshold.
 */
async function reviewProposals(): Promise<{ reviewed: number; approved: number; errors: string[] }> {
  const errors: string[] = [];
  let reviewed = 0;
  let approved = 0;

  const proposals = await apiGet<Proposal[]>('/api/proposals?status=pending');
  if (!proposals || !Array.isArray(proposals)) {
    return { reviewed: 0, approved: 0, errors: ['Failed to fetch pending proposals'] };
  }

  for (const proposal of proposals) {
    reviewed++;

    if (proposal.estimatedCost <= AUTO_APPROVE_THRESHOLD) {
      const result = await apiPatch(`/api/proposals/${proposal.id}`, {
        status: 'approved',
        approvedBy: 'THRONE',
        approvedAt: new Date().toISOString(),
        note: `Auto-approved: cost $${proposal.estimatedCost.toFixed(2)} under threshold $${AUTO_APPROVE_THRESHOLD}`,
      });

      if (result) {
        approved++;
        await logEvent({
          generalId: 'THRONE',
          type: 'proposal-auto-approved',
          message: `Auto-approved proposal "${proposal.title}" ($${proposal.estimatedCost.toFixed(2)})`,
          data: { proposalId: proposal.id, cost: proposal.estimatedCost },
        });
      } else {
        errors.push(`Failed to auto-approve proposal ${proposal.id}`);
      }
    } else {
      await logEvent({
        generalId: 'THRONE',
        type: 'proposal-needs-review',
        message: `Proposal "${proposal.title}" ($${proposal.estimatedCost.toFixed(2)}) requires Lord Zexo's approval`,
        data: { proposalId: proposal.id, cost: proposal.estimatedCost },
      });
    }
  }

  return { reviewed, approved, errors };
}

/**
 * Check active missions and identify steps that need agent spawning.
 */
async function checkMissions(): Promise<{ active: number; spawned: string[]; errors: string[] }> {
  const errors: string[] = [];
  const spawned: string[] = [];

  const missions = await apiGet<Mission[]>('/api/missions?status=active');
  if (!missions || !Array.isArray(missions)) {
    return { active: 0, spawned: [], errors: ['Failed to fetch active missions'] };
  }

  for (const mission of missions) {
    // Find pending steps whose dependencies are met
    const completedStepIds = new Set(
      mission.steps.filter((s) => s.status === 'completed').map((s) => s.id)
    );

    for (const step of mission.steps) {
      if (step.status !== 'pending') continue;

      // Check dependencies
      const depsOk = !step.dependsOn || step.dependsOn.every((d) => completedStepIds.has(d));
      if (!depsOk) continue;

      // This step is ready to be spawned
      const generalId = step.assignedGeneral;
      if (generalId === 'SEER' || generalId === 'PHANTOM') {
        // Import spawn functions dynamically to avoid circular deps
        const { buildSeerSpawnTask } = await import('./spawn-seer');
        const { buildPhantomSpawnTask } = await import('./spawn-phantom');

        let taskPrompt: string;
        if (generalId === 'SEER') {
          taskPrompt = buildSeerSpawnTask({
            taskType: 'strategic-review',
            topic: step.title,
            description: step.description,
            missionId: mission.id,
            stepId: step.id,
            context: mission.description,
            data: step.input,
          });
        } else {
          taskPrompt = buildPhantomSpawnTask({
            taskType: 'code-gen',
            title: step.title,
            description: step.description,
            missionId: mission.id,
            stepId: step.id,
            specs: step.input,
          });
        }

        // Mark step as in-progress
        await apiPost(`/api/missions/${mission.id}/progress`, {
          generalId,
          stepId: step.id,
          status: 'in-progress',
        });

        await logEvent({
          generalId: 'THRONE',
          type: 'agent-spawn-ready',
          missionId: mission.id,
          message: `Prepared ${generalId} spawn for step "${step.title}"`,
          data: {
            stepId: step.id,
            taskPromptLength: taskPrompt.length,
            label: `dominion-${generalId.toLowerCase()}-${mission.id}-${step.id}`,
          },
        });

        spawned.push(`${generalId}:${step.id}`);
      }
    }
  }

  return { active: missions.length, spawned, errors };
}

/**
 * Check daily costs against budget.
 */
async function checkBudget(): Promise<{ costs: DailyCosts | null; status: 'ok' | 'warning' | 'critical' }> {
  const costs = await apiGet<DailyCosts>('/api/costs/daily');
  if (!costs) {
    return { costs: null, status: 'ok' };
  }

  const ratio = costs.total / (costs.budget || DAILY_BUDGET);
  let status: 'ok' | 'warning' | 'critical' = 'ok';

  if (ratio >= BUDGET_CRITICAL_THRESHOLD) {
    status = 'critical';
    await logEvent({
      generalId: 'THRONE',
      type: 'budget-critical',
      message: `⚠️ CRITICAL: Daily spend $${costs.total.toFixed(2)} at ${(ratio * 100).toFixed(0)}% of budget`,
      data: { total: costs.total, budget: costs.budget, ratio },
    });
  } else if (ratio >= BUDGET_WARNING_THRESHOLD) {
    status = 'warning';
    await logEvent({
      generalId: 'THRONE',
      type: 'budget-warning',
      message: `⚡ WARNING: Daily spend $${costs.total.toFixed(2)} at ${(ratio * 100).toFixed(0)}% of budget`,
      data: { total: costs.total, budget: costs.budget, ratio },
    });
  }

  return { costs, status };
}

// ---------------------------------------------------------------------------
// Main Heartbeat
// ---------------------------------------------------------------------------

/**
 * Execute a full heartbeat cycle.
 * Returns a structured report suitable for logging or messaging.
 */
export async function runHeartbeat(): Promise<HeartbeatReport> {
  const timestamp = new Date().toISOString();
  const errors: string[] = [];

  await logEvent({
    generalId: 'THRONE',
    type: 'heartbeat-start',
    message: '👑 THRONE heartbeat initiated',
    timestamp,
  });

  // 1. Review proposals
  const proposalResult = await reviewProposals();
  errors.push(...proposalResult.errors);

  // 2. Check missions
  const missionResult = await checkMissions();
  errors.push(...missionResult.errors);

  // 3. Check budget
  const budgetResult = await checkBudget();

  // 4. Build summary
  const parts: string[] = [];
  if (proposalResult.approved > 0) {
    parts.push(`Auto-approved ${proposalResult.approved} proposals`);
  }
  if (proposalResult.reviewed - proposalResult.approved > 0) {
    parts.push(`${proposalResult.reviewed - proposalResult.approved} proposals need review`);
  }
  if (missionResult.active > 0) {
    parts.push(`${missionResult.active} active missions`);
  }
  if (missionResult.spawned.length > 0) {
    parts.push(`Spawned: ${missionResult.spawned.join(', ')}`);
  }
  if (budgetResult.status !== 'ok') {
    parts.push(`Budget: ${budgetResult.status.toUpperCase()}`);
  }
  if (errors.length > 0) {
    parts.push(`${errors.length} errors`);
  }

  const summary = parts.length > 0
    ? `👑 Heartbeat: ${parts.join(' | ')}`
    : '👑 Heartbeat: All systems nominal. The Dominion endures.';

  const report: HeartbeatReport = {
    timestamp,
    proposalsReviewed: proposalResult.reviewed,
    proposalsAutoApproved: proposalResult.approved,
    activeMissions: missionResult.active,
    agentsSpawned: missionResult.spawned,
    dailyCosts: budgetResult.costs,
    budgetStatus: budgetResult.status,
    errors,
    summary,
  };

  await logEvent({
    generalId: 'THRONE',
    type: 'heartbeat-complete',
    message: summary,
    data: report as unknown as Record<string, unknown>,
  });

  return report;
}

/**
 * Format a heartbeat report as a human-readable string.
 */
export function formatHeartbeatReport(report: HeartbeatReport): string {
  const lines: string[] = [
    `👑 **THRONE Heartbeat Report**`,
    `⏰ ${report.timestamp}`,
    '',
    `📋 Proposals: ${report.proposalsReviewed} reviewed, ${report.proposalsAutoApproved} auto-approved`,
    `⚔️ Active Missions: ${report.activeMissions}`,
  ];

  if (report.agentsSpawned.length > 0) {
    lines.push(`🚀 Agents Spawned: ${report.agentsSpawned.join(', ')}`);
  }

  if (report.dailyCosts) {
    const c = report.dailyCosts;
    lines.push(`💰 Costs: $${c.total.toFixed(2)} / $${(c.budget || DAILY_BUDGET).toFixed(2)} (${report.budgetStatus})`);
  }

  if (report.errors.length > 0) {
    lines.push('', `⚠️ Errors:`);
    report.errors.forEach((e) => lines.push(`  - ${e}`));
  }

  lines.push('', report.summary);
  return lines.join('\n');
}
