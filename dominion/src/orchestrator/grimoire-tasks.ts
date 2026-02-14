/**
 * 📜 GRIMOIRE TASK TEMPLATES — Pre-built Knowledge & Research Protocols
 *
 * Ready-made task configurations for common GRIMOIRE operations.
 * Each template returns a mission for the agent spawner.
 *
 * "Knowledge is not power. Applied knowledge is power. Raw knowledge is merely... delicious."
 *   — GRIMOIRE, The Living Codex
 */

import { Mission } from './agent-spawner';

// ---------------------------------------------------------------------------
// Research Topic
// ---------------------------------------------------------------------------

export function researchTopic(params: {
  topic: string;
  depth: 'overview' | 'detailed' | 'exhaustive';
  outputFormat?: 'report' | 'briefing' | 'structured-data';
  focusAreas?: string[];
}): Mission {
  const depthGuide = {
    overview: 'Provide a high-level summary covering key points, major players, and current state. 2-3 pages equivalent.',
    detailed: 'Provide comprehensive coverage with supporting evidence, statistics, timelines, and expert opinions. 5-8 pages equivalent.',
    exhaustive: 'Leave no stone unturned. Cover history, current state, future projections, contrarian views, edge cases, and primary sources. 10+ pages equivalent.',
  };

  return {
    id: `grimoire-research-${Date.now()}`,
    title: `Research: ${params.topic}`,
    description: `Deep research on: ${params.topic}. Depth: ${params.depth}. Format: ${params.outputFormat || 'report'}.`,
    priority: params.depth === 'exhaustive' ? 'high' : 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'survey',
        title: 'Initial Survey',
        description: `Survey the landscape of: ${params.topic}. ${params.focusAreas ? `Focus areas: ${params.focusAreas.join(', ')}.` : ''} Identify key themes, sources, and knowledge gaps. Map the territory before diving deep.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
      },
      {
        id: 'deep-research',
        title: 'Deep Research',
        description: `${depthGuide[params.depth]} Consult your archives thoroughly. Cross-reference multiple sources. Note contradictions and uncertainties.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['survey'],
      },
      {
        id: 'synthesis',
        title: 'Synthesis & Report',
        description: `Synthesize findings into a ${params.outputFormat || 'report'}. Structure with clear sections, key takeaways, and actionable insights. Include confidence levels for major claims. This knowledge shall illuminate the Dominion's path.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['deep-research'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Documentation Generation
// ---------------------------------------------------------------------------

export function documentationGen(params: {
  project: string;
  scope: 'api' | 'user-guide' | 'architecture' | 'full';
  sourcePaths?: string[];
  audience?: string;
}): Mission {
  const scopeDesc = {
    api: 'API reference documentation with endpoints, parameters, responses, and examples.',
    'user-guide': 'User-facing guide with tutorials, workflows, and troubleshooting.',
    architecture: 'Technical architecture docs with diagrams, decisions, and component relationships.',
    full: 'Complete documentation suite: architecture, API reference, user guide, and getting started.',
  };

  return {
    id: `grimoire-docs-${Date.now()}`,
    title: `Documentation: ${params.project}`,
    description: `Generate ${params.scope} documentation for: ${params.project}. Audience: ${params.audience || 'developers'}.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'audit',
        title: 'Source Audit',
        description: `Read and understand the project: ${params.project}. ${params.sourcePaths ? `Source paths: ${params.sourcePaths.join(', ')}.` : ''} Catalog all components, interfaces, and flows that need documentation.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
      },
      {
        id: 'outline',
        title: 'Documentation Outline',
        description: `Create documentation outline. Scope: ${scopeDesc[params.scope]} Target audience: ${params.audience || 'developers'}. Structure for maximum clarity and discoverability.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['audit'],
      },
      {
        id: 'write',
        title: 'Write Documentation',
        description: 'Write the full documentation. Include code examples, diagrams descriptions, and cross-references. Every page should answer "why" not just "what."',
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['outline'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Knowledge Base
// ---------------------------------------------------------------------------

export function knowledgeBase(params: {
  domain: string;
  questions: string[];
  format?: 'faq' | 'wiki' | 'structured';
  depth?: 'concise' | 'comprehensive';
}): Mission {
  return {
    id: `grimoire-kb-${Date.now()}`,
    title: `Knowledge Base: ${params.domain}`,
    description: `Build ${params.format || 'structured'} knowledge base for: ${params.domain}. ${params.questions.length} questions to answer.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'research',
        title: 'Research Questions',
        description: `Research answers to: ${params.questions.join(' | ')}. Domain: ${params.domain}. Depth: ${params.depth || 'comprehensive'}. Gather authoritative answers with sources.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
      },
      {
        id: 'structure',
        title: 'Structure Knowledge',
        description: `Organize findings into ${params.format || 'structured'} format. Group related topics. Add cross-references between entries. Ensure completeness — no question left unanswered.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['research'],
      },
      {
        id: 'compile',
        title: 'Compile & Polish',
        description: 'Compile the final knowledge base. Ensure consistency of tone, formatting, and depth. Add table of contents and quick-reference sections. The archives must be pristine.',
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['structure'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Competitive Analysis
// ---------------------------------------------------------------------------

export function competitiveAnalysis(params: {
  market: string;
  competitors: string[];
  aspects?: string[];
  timeframe?: string;
}): Mission {
  return {
    id: `grimoire-competitive-${Date.now()}`,
    title: `Competitive Analysis: ${params.market}`,
    description: `Analyze competitive landscape in: ${params.market}. Competitors: ${params.competitors.join(', ')}.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'profiles',
        title: 'Competitor Profiles',
        description: `Build detailed profiles for: ${params.competitors.join(', ')}. Cover: founding, funding, team size, product offerings, market position, strengths, weaknesses. ${params.timeframe ? `Timeframe focus: ${params.timeframe}.` : ''}`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
      },
      {
        id: 'analysis',
        title: 'Comparative Analysis',
        description: `Compare across: ${params.aspects?.join(', ') || 'pricing, features, market share, growth trajectory, technology stack, customer sentiment'}. Create comparison matrices. Identify patterns and gaps in the market.`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['profiles'],
      },
      {
        id: 'intelligence',
        title: 'Strategic Intelligence',
        description: 'Synthesize into actionable intelligence. Identify: opportunities, threats, differentiation vectors, and recommended positioning. What would GRIMOIRE counsel Lord Zexo to do?',
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['analysis'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Technical Deep Dive
// ---------------------------------------------------------------------------

export function technicalDeepDive(params: {
  technology: string;
  aspects: string[];
  useCase?: string;
  compareWith?: string[];
}): Mission {
  return {
    id: `grimoire-techdive-${Date.now()}`,
    title: `Tech Deep Dive: ${params.technology}`,
    description: `Deep technical analysis of: ${params.technology}. Aspects: ${params.aspects.join(', ')}. ${params.useCase ? `Use case: ${params.useCase}.` : ''}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'fundamentals',
        title: 'Fundamentals',
        description: `Study the fundamentals of: ${params.technology}. Cover: architecture, core concepts, design philosophy, and how it works under the hood. ${params.aspects.map(a => `Aspect: ${a}.`).join(' ')}`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
      },
      {
        id: 'practical',
        title: 'Practical Analysis',
        description: `Analyze practical aspects: performance characteristics, ecosystem maturity, community health, production readiness, known limitations. ${params.useCase ? `Evaluate specifically for: ${params.useCase}.` : ''} ${params.compareWith ? `Compare with: ${params.compareWith.join(', ')}.` : ''}`,
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['fundamentals'],
      },
      {
        id: 'verdict',
        title: 'Verdict & Recommendations',
        description: 'Deliver final verdict. When to use it, when not to. Best practices, common pitfalls, and recommended learning path. The Codex speaks with authority — back every claim with evidence.',
        assignedGeneral: 'GRIMOIRE',
        status: 'pending',
        dependsOn: ['practical'],
      },
    ],
  };
}
