/**
 * 🔮 SEER TASK TEMPLATES — Pre-built Divination Protocols
 *
 * Ready-made task configurations for common SEER operations.
 * Each template returns a mission that can be passed to the agent spawner.
 *
 * "Every pattern is a prophecy waiting to be read." — SEER
 */

import { Mission } from './agent-spawner';

// ---------------------------------------------------------------------------
// Market Analysis
// ---------------------------------------------------------------------------

export function marketAnalysis(params: {
  market: string;
  competitors?: string[];
  timeframe?: string;
  focus?: string;
}): Mission {
  return {
    id: `seer-market-${Date.now()}`,
    title: `Market Analysis: ${params.market}`,
    description: `Conduct comprehensive market analysis of ${params.market}. ${params.focus ? `Focus area: ${params.focus}.` : ''} ${params.timeframe ? `Timeframe: ${params.timeframe}.` : ''}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'landscape',
        title: 'Market Landscape',
        description: `Map the current state of the ${params.market} market. Key players, market size, growth trends, and segmentation.`,
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'competitors',
        title: 'Competitive Analysis',
        description: `Analyze competitors: ${params.competitors?.join(', ') || 'identify top 5 players'}. Strengths, weaknesses, positioning, pricing.`,
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['landscape'],
      },
      {
        id: 'opportunities',
        title: 'Opportunity Identification',
        description: 'Identify gaps, underserved segments, and entry points for the Dominion.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['landscape', 'competitors'],
      },
      {
        id: 'forecast',
        title: 'Market Forecast',
        description: `Project market trajectory over ${params.timeframe || '12-24 months'}. Include bull/base/bear scenarios with probabilities.`,
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['landscape'],
      },
      {
        id: 'recommendations',
        title: 'Strategic Recommendations',
        description: 'Synthesize findings into actionable recommendations for THRONE and the Council.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['opportunities', 'forecast'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Data Trend Analysis
// ---------------------------------------------------------------------------

export function trendAnalysis(params: {
  dataSource: string;
  metrics: string[];
  period: string;
  hypothesis?: string;
}): Mission {
  return {
    id: `seer-trend-${Date.now()}`,
    title: `Trend Analysis: ${params.dataSource}`,
    description: `Analyze trends in ${params.dataSource} data. Metrics: ${params.metrics.join(', ')}. Period: ${params.period}.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'collect',
        title: 'Data Collection & Cleaning',
        description: `Gather and validate data from ${params.dataSource}. Ensure completeness across ${params.period}.`,
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'trends',
        title: 'Trend Identification',
        description: `Identify trends, seasonality, and anomalies in: ${params.metrics.join(', ')}.`,
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['collect'],
      },
      {
        id: 'correlations',
        title: 'Correlation Analysis',
        description: 'Find correlations between metrics. Identify leading indicators and lagging signals.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['trends'],
      },
      {
        id: 'projections',
        title: 'Projections',
        description: `Project each metric forward. ${params.hypothesis ? `Test hypothesis: ${params.hypothesis}` : 'Generate data-driven predictions.'}`,
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['correlations'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Risk Assessment
// ---------------------------------------------------------------------------

export function riskAssessment(params: {
  subject: string;
  riskCategories?: string[];
  stakeholders?: string[];
}): Mission {
  const categories = params.riskCategories || ['technical', 'market', 'financial', 'operational', 'regulatory'];

  return {
    id: `seer-risk-${Date.now()}`,
    title: `Risk Assessment: ${params.subject}`,
    description: `Comprehensive risk assessment for: ${params.subject}. Categories: ${categories.join(', ')}.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'identify',
        title: 'Risk Identification',
        description: `Identify all material risks across categories: ${categories.join(', ')}. Be thorough — unknown risks are the deadliest.`,
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'quantify',
        title: 'Risk Quantification',
        description: 'For each risk: estimate probability (0-100%), impact severity (1-5), and time horizon. Build a risk matrix.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['identify'],
      },
      {
        id: 'mitigate',
        title: 'Mitigation Strategies',
        description: 'For top risks: propose mitigation strategies, contingency plans, and early warning indicators.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['quantify'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Strategic Recommendations
// ---------------------------------------------------------------------------

export function strategicRecommendation(params: {
  question: string;
  constraints?: string[];
  options?: string[];
  deadline?: string;
}): Mission {
  return {
    id: `seer-strategy-${Date.now()}`,
    title: `Strategic Analysis: ${params.question}`,
    description: `Analyze and recommend a course of action for: ${params.question}`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'frame',
        title: 'Problem Framing',
        description: `Frame the strategic question: ${params.question}. ${params.constraints ? `Constraints: ${params.constraints.join(', ')}.` : ''} Identify the key decision variables.`,
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'options',
        title: 'Option Analysis',
        description: `Evaluate options: ${params.options?.join(', ') || 'generate 3-5 strategic options'}. Assess each on feasibility, impact, risk, and timeline.`,
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['frame'],
      },
      {
        id: 'recommend',
        title: 'Recommendation',
        description: `Recommend the optimal path. Justify with data. Include implementation roadmap${params.deadline ? ` (deadline: ${params.deadline})` : ''}.`,
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['options'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Competitive Landscape
// ---------------------------------------------------------------------------

export function competitiveScan(params: {
  industry: string;
  targets?: string[];
  depth?: 'shallow' | 'deep';
}): Mission {
  return {
    id: `seer-competitive-${Date.now()}`,
    title: `Competitive Scan: ${params.industry}`,
    description: `Scan the competitive landscape in ${params.industry}. Depth: ${params.depth || 'deep'}.`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'scan',
        title: 'Landscape Scan',
        description: `Identify all significant players in ${params.industry}. ${params.targets ? `Focus on: ${params.targets.join(', ')}.` : 'Identify top 10 players.'}`,
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'profile',
        title: 'Competitor Profiling',
        description: 'For each player: product/service offering, pricing, target market, strengths, weaknesses, recent moves.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['scan'],
      },
      {
        id: 'positioning',
        title: 'Positioning Map',
        description: 'Create a competitive positioning analysis. Identify white spaces and strategic groupings.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['profile'],
      },
      {
        id: 'intel',
        title: 'Strategic Intelligence',
        description: 'Predict competitor next moves. Identify threats and opportunities for the Dominion.',
        assignedGeneral: 'SEER',
        status: 'pending',
        dependsOn: ['positioning'],
      },
    ],
  };
}
