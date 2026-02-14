/**
 * 📜 Send Briefing — Generate and output the daily Dominion briefing
 *
 * Usage: npx tsx scripts/send-briefing.ts
 *
 * Fetches live data from the Dominion API and formats an RPG-style
 * briefing ready to send to Faisal via Telegram.
 */

const API_BASE = 'https://dominion-api-production.up.railway.app';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MissionSummary {
  id: string;
  title: string;
  status: string;
  steps?: { status: string }[];
  createdBy: string;
  priority?: string;
}

interface CostData {
  total: number;
  budget: number;
  remaining?: number;
  weekTotal?: number;
  breakdown?: Record<string, number>;
}

interface EventData {
  type: string;
  message: string;
  timestamp: string;
  generalId?: string;
}

interface ProposalData {
  id: string;
  title: string;
  estimatedCost: number;
  type: string;
  status: string;
}

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
// Formatters
// ---------------------------------------------------------------------------

function costBar(spent: number, budget: number): string {
  const ratio = Math.min(spent / budget, 1);
  const filled = Math.round(ratio * 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

function budgetStatus(spent: number, budget: number): string {
  const ratio = spent / budget;
  if (ratio >= 0.9) return '🔴 CRITICAL';
  if (ratio >= 0.75) return '🟡 WARNING';
  return '🟢 OK';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const today = now.toISOString().split('T')[0];

  // Fetch all data in parallel
  const [missions, costs, events, proposals] = await Promise.all([
    apiGet<MissionSummary[]>('/api/missions?status=active'),
    apiGet<CostData>('/api/costs/daily'),
    apiGet<EventData[]>(`/api/events?limit=20`),
    apiGet<ProposalData[]>('/api/proposals?status=pending'),
  ]);

  // Build briefing
  const lines: string[] = [
    `👑 **THE DOMINION — DAILY BRIEFING**`,
    `📅 ${dateStr}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    '',
  ];

  // Missions
  lines.push(`⚔️ **CAMPAIGNS**`);
  if (!missions || missions.length === 0) {
    lines.push(`  No active missions. The battlefield is quiet.`);
  } else {
    for (const m of missions) {
      const steps = m.steps || [];
      const completed = steps.filter((s) => s.status === 'completed').length;
      const total = steps.length;
      const icon = m.status === 'completed' ? '✅' : m.status === 'failed' ? '❌' : '🔄';
      const priority = m.priority ? ` [${m.priority.toUpperCase()}]` : '';
      lines.push(`  ${icon} ${m.title} — ${completed}/${total} steps${priority}`);
    }
  }
  lines.push('');

  // Treasury
  const c = costs || { total: 0, budget: 10, weekTotal: 0 };
  const budget = c.budget || 10;
  lines.push(`💰 **TREASURY**`);
  lines.push(`  Today: $${c.total.toFixed(2)} / $${budget.toFixed(2)} [${costBar(c.total, budget)}] ${budgetStatus(c.total, budget)}`);
  if (c.weekTotal !== undefined) {
    lines.push(`  This week: $${c.weekTotal.toFixed(2)}`);
  }
  if (c.breakdown) {
    const topSpender = Object.entries(c.breakdown).sort(([, a], [, b]) => b - a)[0];
    if (topSpender) {
      lines.push(`  Top spender: ${topSpender[0]} ($${topSpender[1].toFixed(2)})`);
    }
  }
  lines.push('');

  // Key Events
  if (events && events.length > 0) {
    lines.push(`📡 **KEY EVENTS** (last 24h)`);
    const recent = events
      .filter((e) => e.type !== 'heartbeat') // skip routine heartbeats
      .slice(0, 7);
    if (recent.length === 0) {
      lines.push(`  No significant events.`);
    } else {
      for (const e of recent) {
        const time = new Date(e.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const general = e.generalId ? `[${e.generalId}] ` : '';
        lines.push(`  ${time} — ${general}${e.message}`);
      }
    }
    lines.push('');
  }

  // Pending Proposals
  if (proposals && proposals.length > 0) {
    lines.push(`📋 **AWAITING YOUR DECREE** (${proposals.length})`);
    for (const p of proposals) {
      lines.push(`  • ${p.title} — $${p.estimatedCost.toFixed(2)} (${p.type})`);
    }
    lines.push('');
  }

  // Footer
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🏰 The Dominion endures. Command wisely, Lord Zexo.`);

  const briefing = lines.join('\n');

  // Output
  console.log(briefing);

  // Also log briefing event to API
  try {
    await fetch(`${API_BASE}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generalId: 'THRONE',
        type: 'daily-briefing',
        message: `Daily briefing generated for ${today}`,
        timestamp: now.toISOString(),
      }),
    });
  } catch {
    // silent — briefing still outputs to stdout
  }
}

main().catch(console.error);
