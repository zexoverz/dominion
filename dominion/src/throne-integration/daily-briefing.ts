/**
 * 📜 DAILY BRIEFING — The Sovereign's Morning Report
 *
 * Generates an RPG-styled daily briefing for Lord Zexo via Telegram.
 * Summarizes missions, costs, events, and pending decisions.
 *
 * "The Dominion awakens. Here is the state of your realm, my Lord."
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BriefingData {
  missions: MissionSummary[];
  costs: CostSummary;
  events: EventSummary[];
  pendingProposals: ProposalSummary[];
  upcomingTasks: TaskSummary[];
}

export interface MissionSummary {
  id: string;
  title: string;
  status: string;
  stepsCompleted: number;
  stepsTotal: number;
  general: string;
}

export interface CostSummary {
  today: number;
  budget: number;
  weekTotal: number;
  topSpender: string;
  topSpenderAmount: number;
}

export interface EventSummary {
  type: string;
  message: string;
  timestamp: string;
}

export interface ProposalSummary {
  id: string;
  title: string;
  cost: number;
  type: string;
}

export interface TaskSummary {
  title: string;
  scheduledFor: string;
  general: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = 'https://dominion-api-production.up.railway.app';

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

// ---------------------------------------------------------------------------
// Data Gathering
// ---------------------------------------------------------------------------

async function gatherBriefingData(): Promise<BriefingData> {
  const today = new Date().toISOString().split('T')[0];

  const [missions, costs, events, proposals] = await Promise.all([
    apiGet<MissionSummary[]>(`/api/missions?completedAfter=${today}`),
    apiGet<CostSummary>('/api/costs/daily'),
    apiGet<EventSummary[]>(`/api/events?after=${today}&limit=20`),
    apiGet<ProposalSummary[]>('/api/proposals?status=pending'),
  ]);

  return {
    missions: missions || [],
    costs: costs || { today: 0, budget: 10, weekTotal: 0, topSpender: 'none', topSpenderAmount: 0 },
    events: events || [],
    pendingProposals: proposals || [],
    upcomingTasks: [], // TODO: fetch from scheduler when available
  };
}

// ---------------------------------------------------------------------------
// Briefing Formatter
// ---------------------------------------------------------------------------

function costBar(spent: number, budget: number): string {
  const ratio = Math.min(spent / budget, 1);
  const filled = Math.round(ratio * 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Generate the daily briefing message in RPG style.
 */
export function formatBriefing(data: BriefingData): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const lines: string[] = [
    `👑 **THE DOMINION — DAILY BRIEFING**`,
    `📅 ${dateStr}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    '',
  ];

  // Missions
  lines.push(`⚔️ **CAMPAIGNS**`);
  if (data.missions.length === 0) {
    lines.push(`  No missions completed today. The battlefield is quiet.`);
  } else {
    for (const m of data.missions) {
      const icon = m.status === 'completed' ? '✅' : m.status === 'failed' ? '❌' : '🔄';
      lines.push(`  ${icon} ${m.title} — ${m.stepsCompleted}/${m.stepsTotal} steps (${m.general})`);
    }
  }
  lines.push('');

  // Treasury
  const c = data.costs;
  lines.push(`💰 **TREASURY**`);
  lines.push(`  Today: $${c.today.toFixed(2)} / $${c.budget.toFixed(2)} [${costBar(c.today, c.budget)}]`);
  lines.push(`  This week: $${c.weekTotal.toFixed(2)}`);
  if (c.topSpender !== 'none') {
    lines.push(`  Top spender: ${c.topSpender} ($${c.topSpenderAmount.toFixed(2)})`);
  }
  lines.push('');

  // Key Events
  if (data.events.length > 0) {
    lines.push(`📡 **KEY EVENTS**`);
    const topEvents = data.events.slice(0, 5);
    for (const e of topEvents) {
      const time = new Date(e.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      lines.push(`  ${time} — ${e.message}`);
    }
    lines.push('');
  }

  // Pending Proposals
  if (data.pendingProposals.length > 0) {
    lines.push(`📋 **AWAITING YOUR DECREE** (${data.pendingProposals.length})`);
    for (const p of data.pendingProposals) {
      lines.push(`  • ${p.title} — $${p.cost.toFixed(2)} (${p.type})`);
    }
    lines.push('');
  }

  // Upcoming
  if (data.upcomingTasks.length > 0) {
    lines.push(`🗓️ **UPCOMING**`);
    for (const t of data.upcomingTasks) {
      lines.push(`  • ${t.title} — ${t.scheduledFor} (${t.general})`);
    }
    lines.push('');
  }

  // Footer
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🏰 The Dominion endures. Command wisely, Lord Zexo.`);

  return lines.join('\n');
}

/**
 * Generate a complete daily briefing by fetching data and formatting it.
 */
export async function generateDailyBriefing(): Promise<string> {
  const data = await gatherBriefingData();
  return formatBriefing(data);
}
