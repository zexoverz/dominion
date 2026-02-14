/**
 * THRONE Auto Proposal Generator
 * 
 * Generates research/analysis proposals for Dominion generals.
 * Run directly: npx tsx proposal-generator.ts [--dry-run]
 * Or import: import { generateProposals } from './proposal-generator'
 */

const API = 'https://dominion-api-production.up.railway.app/api';

interface ProposalStep {
  title: string;
  description: string;
}

interface ProposalTemplate {
  agent_id: string;
  title: string;
  description: string;
  priority: number;
  estimated_cost_usd: number;
  steps: ProposalStep[];
  keywords: string[]; // for duplicate detection
}

const TEMPLATES: ProposalTemplate[] = [
  // SEER
  {
    agent_id: 'SEER',
    title: 'BTC Price & Momentum Analysis',
    description: 'Analyze current BTC price action, key support/resistance levels, and short-term momentum indicators.',
    priority: 75, estimated_cost_usd: 0.75,
    keywords: ['btc', 'price', 'momentum'],
    steps: [
      { title: 'Fetch price data', description: 'Gather BTC price, volume, and orderbook data' },
      { title: 'Technical analysis', description: 'Identify key levels, RSI, MACD signals' },
      { title: 'Summary report', description: 'Compile findings with actionable outlook' },
    ],
  },
  {
    agent_id: 'SEER',
    title: 'Market Sentiment Scan',
    description: 'Scan crypto market sentiment via Fear & Greed index, social signals, and funding rates.',
    priority: 60, estimated_cost_usd: 0.50,
    keywords: ['sentiment', 'fear', 'greed'],
    steps: [
      { title: 'Gather sentiment data', description: 'Collect Fear & Greed, funding rates, social volume' },
      { title: 'Analyze signals', description: 'Identify divergences and notable shifts' },
      { title: 'Report', description: 'Summarize sentiment landscape' },
    ],
  },
  {
    agent_id: 'SEER',
    title: 'DeFi Yield Opportunity Scan',
    description: 'Scan top DeFi protocols for yield opportunities, comparing risk-adjusted returns.',
    priority: 65, estimated_cost_usd: 1.00,
    keywords: ['defi', 'yield'],
    steps: [
      { title: 'Scan protocols', description: 'Check top DeFi platforms for current yields' },
      { title: 'Risk assessment', description: 'Evaluate protocol risks and sustainability' },
      { title: 'Opportunity report', description: 'Rank opportunities by risk-adjusted return' },
    ],
  },
  // PHANTOM
  {
    agent_id: 'PHANTOM',
    title: 'Dependency Security Scan',
    description: 'Audit all project dependencies for known vulnerabilities and outdated packages.',
    priority: 80, estimated_cost_usd: 1.00,
    keywords: ['security', 'dependency', 'audit'],
    steps: [
      { title: 'Scan dependencies', description: 'Run audit on all project package manifests' },
      { title: 'Assess findings', description: 'Prioritize vulnerabilities by severity' },
      { title: 'Report & fix plan', description: 'Document findings and recommended fixes' },
    ],
  },
  {
    agent_id: 'PHANTOM',
    title: 'Code Performance Review',
    description: 'Review critical code paths for performance bottlenecks and optimization opportunities.',
    priority: 65, estimated_cost_usd: 1.50,
    keywords: ['performance', 'code review'],
    steps: [
      { title: 'Profile hotspots', description: 'Identify slow code paths and bottlenecks' },
      { title: 'Recommend optimizations', description: 'Suggest concrete performance improvements' },
    ],
  },
  // GRIMOIRE
  {
    agent_id: 'GRIMOIRE',
    title: 'Ethereum EIP Tracker',
    description: 'Review recent Ethereum Improvement Proposals and assess impact on Dominion projects.',
    priority: 70, estimated_cost_usd: 1.25,
    keywords: ['eip', 'ethereum'],
    steps: [
      { title: 'Scan recent EIPs', description: 'Identify new and updated EIPs' },
      { title: 'Impact analysis', description: 'Assess relevance to GrimSwap and ETHJKT' },
      { title: 'Summary', description: 'Compile brief with recommendations' },
    ],
  },
  {
    agent_id: 'GRIMOIRE',
    title: 'Documentation Freshness Review',
    description: 'Audit project documentation for staleness, missing sections, and accuracy.',
    priority: 50, estimated_cost_usd: 0.75,
    keywords: ['documentation', 'review'],
    steps: [
      { title: 'Scan docs', description: 'Check all README and doc files for accuracy' },
      { title: 'Flag issues', description: 'List outdated or missing documentation' },
      { title: 'Update plan', description: 'Prioritize documentation updates' },
    ],
  },
  // ECHO
  {
    agent_id: 'ECHO',
    title: 'Community Engagement Report',
    description: 'Analyze community activity across channels and recommend engagement strategies.',
    priority: 60, estimated_cost_usd: 0.75,
    keywords: ['community', 'engagement', 'content'],
    steps: [
      { title: 'Gather metrics', description: 'Collect engagement data from community channels' },
      { title: 'Analyze trends', description: 'Identify growth patterns and drop-offs' },
      { title: 'Recommendations', description: 'Suggest content and engagement tactics' },
    ],
  },
  // MAMMON
  {
    agent_id: 'MAMMON',
    title: 'Cost Trend Analysis',
    description: 'Review daily/weekly spending trends across all generals and identify optimization opportunities.',
    priority: 70, estimated_cost_usd: 0.50,
    keywords: ['cost', 'budget', 'optimization'],
    steps: [
      { title: 'Gather cost data', description: 'Pull spending data for past 7 days' },
      { title: 'Trend analysis', description: 'Identify cost patterns and anomalies' },
      { title: 'Optimization report', description: 'Recommend budget adjustments' },
    ],
  },
  // WRAITH-EYE
  {
    agent_id: 'WRAITH-EYE',
    title: 'Infrastructure Health Check',
    description: 'Comprehensive check of all API endpoints, response times, and error rates.',
    priority: 80, estimated_cost_usd: 0.50,
    keywords: ['infrastructure', 'health', 'api'],
    steps: [
      { title: 'Ping all endpoints', description: 'Check availability and response times' },
      { title: 'Error analysis', description: 'Review recent error logs and patterns' },
      { title: 'Status report', description: 'Compile infrastructure health summary' },
    ],
  },
];

// Map hour ranges to preferred generals
const HOUR_SCHEDULE: Record<string, [number, number]> = {
  SEER: [6, 10],
  PHANTOM: [10, 14],
  GRIMOIRE: [14, 18],
  ECHO: [18, 22],
  MAMMON: [22, 2],
  'WRAITH-EYE': [2, 6],
};

function getActiveGenerals(hour: number): string[] {
  const active: string[] = [];
  for (const [general, [start, end]] of Object.entries(HOUR_SCHEDULE)) {
    if (start < end) {
      if (hour >= start && hour < end) active.push(general);
    } else {
      if (hour >= start || hour < end) active.push(general);
    }
  }
  return active.length > 0 ? active : ['SEER']; // fallback
}

function isDuplicate(template: ProposalTemplate, pendingTitles: string[]): boolean {
  const titleLower = template.title.toLowerCase();
  return pendingTitles.some(t =>
    template.keywords.some(kw => t.includes(kw)) ||
    t.includes(titleLower.split(' — ')[0].toLowerCase())
  );
}

export async function generateProposals(dryRun = false): Promise<string[]> {
  // Fetch pending
  let pendingTitles: string[] = [];
  try {
    const res = await fetch(`${API}/proposals?status=pending`);
    const pending = await res.json() as any[];
    pendingTitles = pending.map((p: any) => (p.title || '').toLowerCase());
  } catch { /* continue with empty */ }

  const hour = new Date().getUTCHours();
  const activeGenerals = getActiveGenerals(hour);
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  
  const candidates = TEMPLATES.filter(t => activeGenerals.includes(t.agent_id));
  const available = candidates.filter(t => !isDuplicate(t, pendingTitles));
  const toCreate = available.slice(0, 2); // max 2

  const results: string[] = [];

  for (const template of toCreate) {
    const proposal = {
      agent_id: template.agent_id,
      title: `${template.title} — ${dateStr}`,
      description: template.description,
      priority: template.priority,
      estimated_cost_usd: template.estimated_cost_usd,
      proposed_steps: template.steps,
      status: 'pending',
      metadata: { createdBy: 'THRONE', source: 'auto-generator' },
    };

    if (dryRun) {
      results.push(`[DRY RUN] ${proposal.title} (${template.agent_id}, $${template.estimated_cost_usd})`);
      continue;
    }

    try {
      const res = await fetch(`${API}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal),
      });
      if (res.ok) {
        results.push(`✅ Created: ${proposal.title}`);
      } else {
        results.push(`❌ Failed: ${proposal.title} — ${res.status}`);
      }
    } catch (e: any) {
      results.push(`❌ Error: ${proposal.title} — ${e.message}`);
    }
  }

  if (results.length === 0) {
    results.push('No new proposals needed — all slots filled or duplicates exist');
  }

  return results;
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('proposal-generator.ts')) {
  const dryRun = process.argv.includes('--dry-run');
  generateProposals(dryRun).then(results => {
    console.log('📊 Proposal Generation Results:');
    results.forEach(r => console.log(`   ${r}`));
  });
}
