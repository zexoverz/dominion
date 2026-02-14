/**
 * ⚔️ MISSION TEMPLATES — Pre-built Multi-General Operations
 *
 * Ready-made mission templates that THRONE can quickly deploy.
 * Each template orchestrates multiple generals working in concert.
 *
 * "A single general is a weapon. The Council in concert is an army."
 *   — THRONE
 */

import { Mission } from './agent-spawner';

// ---------------------------------------------------------------------------
// Daily Research Brief
// ---------------------------------------------------------------------------

export function dailyResearchBrief(params?: {
  markets?: string[];
  topics?: string[];
  date?: string;
}): Mission {
  const date = params?.date || new Date().toISOString().split('T')[0];

  return {
    id: `mission-daily-brief-${Date.now()}`,
    title: `Daily Research Brief: ${date}`,
    description: `SEER + GRIMOIRE produce a comprehensive daily intelligence briefing. Markets, trends, and knowledge updates.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'market-scan',
        title: 'Market & Trend Scan',
        description: `SEER: Scan markets and trends for ${date}. ${params?.markets ? `Focus markets: ${params.markets.join(', ')}.` : 'Cover crypto, AI/ML, and relevant tech sectors.'} Identify significant movements, emerging patterns, and anomalies. The Oracle reads the signs.`,
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'knowledge-scan',
        title: 'Knowledge & News Scan',
        description: `GRIMOIRE: Research latest developments. ${params?.topics ? `Focus topics: ${params.topics.join(', ')}.` : 'Cover AI developments, crypto ecosystem, and Dominion-relevant news.'} Gather key findings, notable publications, and emerging knowledge. The Codex absorbs all.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
      },
      {
        id: 'synthesis',
        title: 'Brief Synthesis',
        description: 'SEER: Synthesize market data and knowledge findings into a unified daily brief. Key highlights, actionable insights, risk alerts, and opportunity flags. Deliver as a concise intelligence report for Lord Zexo.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['market-scan', 'knowledge-scan'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Code Review Sprint
// ---------------------------------------------------------------------------

export function codeReviewSprint(params: {
  repo: string;
  branch?: string;
  focusAreas?: string[];
}): Mission {
  return {
    id: `mission-code-review-${Date.now()}`,
    title: `Code Review Sprint: ${params.repo}`,
    description: `PHANTOM reviews code quality while WRAITH-EYE audits security. Branch: ${params.branch || 'main'}.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'code-review',
        title: 'Code Quality Review',
        description: `PHANTOM: Review code in ${params.repo} (branch: ${params.branch || 'main'}). ${params.focusAreas ? `Focus: ${params.focusAreas.join(', ')}.` : 'Cover: architecture, bugs, performance, readability, maintainability.'} Categorize findings by severity. Ship quality or don't ship at all.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'security-review',
        title: 'Security Review',
        description: `WRAITH-EYE: Audit ${params.repo} (branch: ${params.branch || 'main'}) for security vulnerabilities. Check: dependencies, secrets exposure, injection vectors, authentication, authorization, input validation. The code must be secure before it is clever.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
      },
      {
        id: 'consolidated-report',
        title: 'Consolidated Review Report',
        description: 'PHANTOM: Merge code quality and security findings into a single prioritized report. Critical security issues first, then major bugs, then improvements. Deliver actionable fix list with effort estimates.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
        dependsOn: ['code-review', 'security-review'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Content Pipeline
// ---------------------------------------------------------------------------

export function contentPipeline(params: {
  topic: string;
  platform?: string;
  audience?: string;
  style?: string;
}): Mission {
  return {
    id: `mission-content-${Date.now()}`,
    title: `Content Pipeline: ${params.topic}`,
    description: `GRIMOIRE researches, ECHO crafts content. Topic: ${params.topic}. Platform: ${params.platform || 'multi-platform'}.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'research',
        title: 'Topic Research',
        description: `GRIMOIRE: Deep research on: ${params.topic}. Gather key facts, interesting angles, expert opinions, statistics, and contrarian takes. ${params.audience ? `Target audience: ${params.audience}.` : ''} Provide raw knowledge fuel for content creation. The Codex feeds the Voice.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
      },
      {
        id: 'content-creation',
        title: 'Content Creation',
        description: `ECHO: Using GRIMOIRE's research, create compelling content about ${params.topic}. Platform: ${params.platform || 'multi-platform'}. ${params.style ? `Style: ${params.style}.` : 'Style: engaging and authoritative.'} ${params.audience ? `Audience: ${params.audience}.` : ''} Transform knowledge into words that move minds.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['research'],
      },
      {
        id: 'polish',
        title: 'Final Polish & Variants',
        description: 'ECHO: Polish the content. Create platform-specific variants if needed. Add posting recommendations, hashtags, and engagement hooks. The enchantment must be ready to cast.',
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['content-creation'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Financial Health Check
// ---------------------------------------------------------------------------

export function financialHealthCheck(params?: {
  period?: string;
  includeProjections?: boolean;
  alertThreshold?: number;
}): Mission {
  const period = params?.period || 'current month';

  return {
    id: `mission-financial-${Date.now()}`,
    title: `Financial Health Check: ${period}`,
    description: `MAMMON conducts comprehensive financial analysis and generates treasury report.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'cost-audit',
        title: 'Cost Audit',
        description: `MAMMON: Audit all Dominion expenses for ${period}. Break down by: general (API costs per agent), infrastructure (Railway, databases, storage), subscriptions, and one-time costs. ${params?.alertThreshold ? `Flag any single item exceeding $${params.alertThreshold}.` : ''} Account for every gold piece leaving the vault.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'revenue-check',
        title: 'Revenue Check',
        description: `MAMMON: Compile revenue for ${period}. Track income from all sources: OKU Trade, ForuAI, Kruu, and any other streams. Compare against projections and previous periods. Is the gold flowing in faster than it flows out?`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'health-report',
        title: 'Financial Health Report',
        description: `MAMMON: Deliver comprehensive financial health report. Include: profit/loss, burn rate, runway, per-general cost efficiency, revenue trends, and top optimization opportunities. ${params?.includeProjections ? 'Include 3-month forward projections with risk scenarios.' : ''} The Golden Scale weighs the Dominion's fortune.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['cost-audit', 'revenue-check'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Security Sweep
// ---------------------------------------------------------------------------

export function securitySweep(params?: {
  targets?: string[];
  depth?: 'quick' | 'standard' | 'deep';
  includeAccessReview?: boolean;
}): Mission {
  const depth = params?.depth || 'standard';

  return {
    id: `mission-security-${Date.now()}`,
    title: `Security Sweep (${depth})`,
    description: `WRAITH-EYE audits all Dominion systems. Depth: ${depth}. ${params?.includeAccessReview ? 'Includes access review.' : ''}`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'system-scan',
        title: 'System Scan',
        description: `WRAITH-EYE: Sweep ${params?.targets ? params.targets.join(', ') : 'all Dominion systems'}. Check: service health, exposed ports, SSL certificates, error rates, resource utilization. Depth: ${depth}. Sweep the perimeter first.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
      },
      {
        id: 'vulnerability-audit',
        title: 'Vulnerability Audit',
        description: `WRAITH-EYE: Audit for vulnerabilities. Check: outdated dependencies, known CVEs, insecure configurations, exposed secrets in repos, weak authentication. ${depth === 'deep' ? 'Include dependency tree analysis and configuration drift detection.' : ''} Every shadow hides a potential threat.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: ['system-scan'],
      },
      ...(params?.includeAccessReview ? [{
        id: 'access-audit',
        title: 'Access Audit',
        description: 'WRAITH-EYE: Review all access controls. API keys (age, scope, rotation status), OAuth grants, service accounts, environment variables with secrets. Principle of least privilege — enforce it.',
        assignedGeneral: 'WRAITH-EYE' as const,
        status: 'pending' as const,
        dependsOn: ['system-scan'],
      }] : []),
      {
        id: 'sweep-report',
        title: 'Security Sweep Report',
        description: `WRAITH-EYE: Deliver security sweep report. Threat level assessment (NOMINAL/ELEVATED/CRITICAL), all findings ranked by severity, remediation priorities, and recommended immediate actions. The Silent Watcher reports.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
        dependsOn: params?.includeAccessReview
          ? ['vulnerability-audit', 'access-audit']
          : ['vulnerability-audit'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Community Engagement
// ---------------------------------------------------------------------------

export function communityEngagement(params: {
  platform: string;
  community?: string;
  goals?: string[];
}): Mission {
  return {
    id: `mission-community-${Date.now()}`,
    title: `Community Engagement: ${params.platform}`,
    description: `ECHO analyzes community and creates engagement content for ${params.platform}.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'community-analysis',
        title: 'Community Analysis',
        description: `ECHO: Analyze the ${params.community || params.platform} community. Understand: sentiment, active topics, key voices, pain points, and engagement patterns. ${params.goals ? `Goals: ${params.goals.join(', ')}.` : ''} Know the audience before you speak to them.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
      },
      {
        id: 'strategy',
        title: 'Engagement Strategy',
        description: `ECHO: Develop engagement strategy for ${params.platform}. Define: content themes, posting cadence, conversation starters, community rituals, and growth tactics. Every interaction builds loyalty — or destroys it.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['community-analysis'],
      },
      {
        id: 'content-pack',
        title: 'Content Pack',
        description: 'ECHO: Create a ready-to-deploy content pack. Include: 5-10 posts/messages, discussion prompts, response templates for common scenarios, and a 2-week content calendar. Arm the Dominion with words that build community.',
        assignedGeneral: 'ECHO',
        status: 'pending',
        dependsOn: ['strategy'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Full Dominion Briefing
// ---------------------------------------------------------------------------

export function fullDominionBriefing(params?: {
  period?: string;
  urgency?: 'routine' | 'urgent';
  focusAreas?: string[];
}): Mission {
  const period = params?.period || 'current week';

  return {
    id: `mission-full-briefing-${Date.now()}`,
    title: `Full Dominion Briefing: ${period}`,
    description: `ALL generals contribute to a comprehensive Dominion state report. Every domain covered.`,
    priority: params?.urgency === 'urgent' ? 'critical' : 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'seer-intel',
        title: 'Strategic Intelligence',
        description: `SEER: Provide strategic intelligence briefing for ${period}. Market conditions, competitive landscape, emerging trends, and risk outlook. ${params?.focusAreas ? `Focus areas: ${params.focusAreas.join(', ')}.` : ''} The Oracle speaks first — context shapes all that follows.`,
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'phantom-status',
        title: 'Engineering Status',
        description: `PHANTOM: Report on engineering status for ${period}. Active projects, code health, technical debt, deployment status, and blockers. What shipped, what's stuck, what's next.`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'grimoire-knowledge',
        title: 'Knowledge Update',
        description: `GRIMOIRE: Provide knowledge and research update for ${period}. Key findings, research completed, documentation state, and knowledge gaps identified. What the Codex has learned.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
      },
      {
        id: 'echo-comms',
        title: 'Communications Report',
        description: `ECHO: Report on communications and community for ${period}. Content published, engagement metrics, community sentiment, and brand health. How the Dominion's voice carries.`,
        assignedGeneral: 'ECHO',
        status: 'pending',
      },
      {
        id: 'mammon-treasury',
        title: 'Treasury Report',
        description: `MAMMON: Provide financial status for ${period}. Revenue, expenses, burn rate, budget adherence, and financial risks. The state of the war chest.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'wraith-security',
        title: 'Security Status',
        description: `WRAITH-EYE: Provide security and operations status for ${period}. System health, threat landscape, incidents, and security posture. The state of the perimeter.`,
        assignedGeneral: 'WRAITH-EYE',
        status: 'pending',
      },
      {
        id: 'throne-synthesis',
        title: 'Dominion Synthesis',
        description: 'SEER: Synthesize all general reports into a unified Dominion briefing for Lord Zexo. Executive summary, cross-domain insights, key decisions needed, and recommended priorities. The full picture — nothing omitted, nothing wasted.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: [
          'seer-intel',
          'phantom-status',
          'grimoire-knowledge',
          'echo-comms',
          'mammon-treasury',
          'wraith-security',
        ],
      },
    ],
  };
}
