/**
 * 📋 PROPOSAL GENERATOR — THRONE's Strategic Initiative Engine
 *
 * Analyzes Lord Zexo's projects and generates structured proposals
 * for tasks that SEER or PHANTOM could execute as sub-agents.
 *
 * "Opportunity does not knock. It is identified, quantified, and seized."
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProposalType = 'research' | 'code' | 'monitoring' | 'content';

export interface ProjectProfile {
  name: string;
  slug: string;
  description: string;
  techStack: string[];
  domains: string[];
  priorities: string[];
}

export interface GeneratedProposal {
  title: string;
  description: string;
  type: ProposalType;
  assignedGeneral: string;
  estimatedCost: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  steps: ProposalStep[];
  rationale: string;
  expectedOutcome: string;
  project: string;
}

export interface ProposalStep {
  title: string;
  description: string;
  assignedGeneral: string;
  estimatedCost: number;
}

// ---------------------------------------------------------------------------
// Project Profiles
// ---------------------------------------------------------------------------

const PROJECTS: ProjectProfile[] = [
  {
    name: 'ETHJKT',
    slug: 'ethjkt',
    description: 'Ethereum Jakarta — local Web3 community and events platform for the Jakarta crypto ecosystem',
    techStack: ['Next.js', 'TypeScript', 'Solidity', 'Tailwind'],
    domains: ['web3', 'community', 'events', 'education'],
    priorities: ['community growth', 'event management', 'content creation', 'partnerships'],
  },
  {
    name: 'GrimSwap',
    slug: 'grimswap',
    description: 'Dark-themed DEX aggregator with unique UX and gamification elements',
    techStack: ['React', 'TypeScript', 'Solidity', 'Ethers.js', 'Tailwind'],
    domains: ['defi', 'dex', 'smart-contracts', 'trading'],
    priorities: ['smart contract security', 'UX optimization', 'liquidity analysis', 'gas optimization'],
  },
  {
    name: 'Kruu',
    slug: 'kruu',
    description: 'Creator economy platform — tools for content creators to monetize and grow',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    domains: ['creator-economy', 'saas', 'payments', 'content'],
    priorities: ['user acquisition', 'feature development', 'market positioning', 'monetization'],
  },
];

// ---------------------------------------------------------------------------
// Proposal Templates
// ---------------------------------------------------------------------------

interface ProposalTemplate {
  type: ProposalType;
  general: string;
  titlePattern: string;
  descriptionPattern: string;
  stepsPattern: (project: ProjectProfile) => ProposalStep[];
  costRange: [number, number];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const TEMPLATES: ProposalTemplate[] = [
  // Research templates (SEER)
  {
    type: 'research',
    general: 'SEER',
    titlePattern: '🔮 Market Analysis: {project} competitive landscape',
    descriptionPattern: 'SEER analyzes the competitive landscape for {project}, identifying key players, market gaps, and strategic opportunities in the {domain} space.',
    stepsPattern: (p) => [
      { title: 'Market scan', description: `Scan the ${p.domains[0]} market for competitors and trends`, assignedGeneral: 'SEER', estimatedCost: 0.10 },
      { title: 'Competitive analysis', description: 'Deep dive on top 5 competitors', assignedGeneral: 'SEER', estimatedCost: 0.08 },
      { title: 'Strategic report', description: 'Compile findings into actionable recommendations', assignedGeneral: 'SEER', estimatedCost: 0.05 },
    ],
    costRange: [0.15, 0.30],
    priority: 'medium',
  },
  {
    type: 'research',
    general: 'SEER',
    titlePattern: '🔮 Trend Report: {domain} industry outlook',
    descriptionPattern: 'SEER produces a trend analysis report for the {domain} industry, forecasting developments relevant to {project}.',
    stepsPattern: (p) => [
      { title: 'Data gathering', description: `Research latest ${p.domains[0]} trends and data`, assignedGeneral: 'SEER', estimatedCost: 0.12 },
      { title: 'Trend analysis', description: 'Identify and rank emerging trends', assignedGeneral: 'SEER', estimatedCost: 0.08 },
      { title: 'Forecast report', description: 'Generate 3/6/12 month projections', assignedGeneral: 'SEER', estimatedCost: 0.05 },
    ],
    costRange: [0.18, 0.30],
    priority: 'medium',
  },
  // Code templates (PHANTOM)
  {
    type: 'code',
    general: 'PHANTOM',
    titlePattern: '👻 Code Review: {project} codebase audit',
    descriptionPattern: 'PHANTOM reviews the {project} codebase for bugs, security issues, and optimization opportunities.',
    stepsPattern: (p) => [
      { title: 'Code scan', description: `Review ${p.techStack.join(', ')} codebase structure`, assignedGeneral: 'PHANTOM', estimatedCost: 0.04 },
      { title: 'Issue identification', description: 'Identify bugs, security holes, and tech debt', assignedGeneral: 'PHANTOM', estimatedCost: 0.04 },
      { title: 'Recommendations', description: 'Prioritized fix list with code suggestions', assignedGeneral: 'PHANTOM', estimatedCost: 0.03 },
    ],
    costRange: [0.08, 0.15],
    priority: 'high',
  },
  {
    type: 'code',
    general: 'PHANTOM',
    titlePattern: '👻 Feature: {project} — {priority} implementation',
    descriptionPattern: 'PHANTOM builds a key feature for {project} focused on {priority}.',
    stepsPattern: (p) => [
      { title: 'Architecture', description: `Design the feature architecture using ${p.techStack.join(', ')}`, assignedGeneral: 'PHANTOM', estimatedCost: 0.03 },
      { title: 'Implementation', description: 'Build the feature with clean, typed code', assignedGeneral: 'PHANTOM', estimatedCost: 0.06 },
      { title: 'Testing', description: 'Verify the implementation works correctly', assignedGeneral: 'PHANTOM', estimatedCost: 0.02 },
    ],
    costRange: [0.08, 0.15],
    priority: 'medium',
  },
  // Monitoring templates (SEER)
  {
    type: 'monitoring',
    general: 'SEER',
    titlePattern: '🔮 Risk Assessment: {project} vulnerabilities',
    descriptionPattern: 'SEER evaluates risks and vulnerabilities facing {project} across technical, market, and operational dimensions.',
    stepsPattern: (p) => [
      { title: 'Risk scan', description: `Identify risks across ${p.domains.join(', ')} domains`, assignedGeneral: 'SEER', estimatedCost: 0.08 },
      { title: 'Impact analysis', description: 'Score each risk by probability × impact', assignedGeneral: 'SEER', estimatedCost: 0.06 },
      { title: 'Mitigation plan', description: 'Recommend countermeasures for top risks', assignedGeneral: 'SEER', estimatedCost: 0.04 },
    ],
    costRange: [0.12, 0.25],
    priority: 'high',
  },
  // Content templates (SEER + PHANTOM combo)
  {
    type: 'content',
    general: 'SEER',
    titlePattern: '📝 Content Strategy: {project} growth plan',
    descriptionPattern: 'Research-backed content strategy for {project} to drive {priority}.',
    stepsPattern: (p) => [
      { title: 'Audience analysis', description: `Analyze target audience for ${p.name}`, assignedGeneral: 'SEER', estimatedCost: 0.08 },
      { title: 'Content plan', description: 'Create a content calendar with topics and formats', assignedGeneral: 'SEER', estimatedCost: 0.06 },
    ],
    costRange: [0.10, 0.20],
    priority: 'low',
  },
];

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

function fillTemplate(pattern: string, project: ProjectProfile): string {
  return pattern
    .replace(/{project}/g, project.name)
    .replace(/{domain}/g, project.domains[0])
    .replace(/{priority}/g, project.priorities[0]);
}

/**
 * Generate proposals for a specific project.
 */
export function generateProjectProposals(projectSlug: string): GeneratedProposal[] {
  const project = PROJECTS.find((p) => p.slug === projectSlug);
  if (!project) return [];

  return TEMPLATES.map((template) => {
    const steps = template.stepsPattern(project);
    const totalCost = steps.reduce((sum, s) => sum + s.estimatedCost, 0);

    return {
      title: fillTemplate(template.titlePattern, project),
      description: fillTemplate(template.descriptionPattern, project),
      type: template.type,
      assignedGeneral: template.general,
      estimatedCost: totalCost,
      priority: template.priority,
      steps,
      rationale: `Supports ${project.name}'s priority: ${project.priorities[0]}`,
      expectedOutcome: `Actionable ${template.type} deliverables for ${project.name}`,
      project: project.slug,
    };
  });
}

/**
 * Generate proposals across all projects. Returns top N by priority.
 */
export function generateAllProposals(limit: number = 10): GeneratedProposal[] {
  const all: GeneratedProposal[] = [];
  for (const project of PROJECTS) {
    all.push(...generateProjectProposals(project.slug));
  }

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  all.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return all.slice(0, limit);
}

/**
 * Submit a generated proposal to the Dominion API.
 */
export async function submitProposal(proposal: GeneratedProposal): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...proposal,
        status: 'pending',
        createdBy: 'THRONE',
        createdAt: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Get all project profiles.
 */
export function getProjects(): ProjectProfile[] {
  return [...PROJECTS];
}
