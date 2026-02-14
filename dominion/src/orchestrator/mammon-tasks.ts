/**
 * 💰 MAMMON TASK TEMPLATES — Pre-built Financial & Treasury Protocols
 *
 * Ready-made task configurations for common MAMMON operations.
 * Each template returns a mission for the agent spawner.
 *
 * "Profit is not greed. Profit is oxygen. Stop breathing and see what happens."
 *   — MAMMON, The Golden Scale
 */

import { Mission } from './agent-spawner';

// ---------------------------------------------------------------------------
// Cost Analysis
// ---------------------------------------------------------------------------

export function costAnalysis(params: {
  period: string;
  scope: 'all' | 'api' | 'infrastructure' | 'subscriptions' | 'personnel' | string;
  threshold?: number;
  compareWith?: string;
}): Mission {
  return {
    id: `mammon-cost-${Date.now()}`,
    title: `Cost Analysis: ${params.scope} (${params.period})`,
    description: `Analyze spending across ${params.scope === 'all' ? 'all Dominion operations' : params.scope} for ${params.period}. Identify waste and recommend optimizations.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'gather',
        title: 'Expense Gathering',
        description: `Gather all expenditure data for: ${params.period}. Scope: ${params.scope}. Categorize by general, service, and type. Leave no transaction unaccounted.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'breakdown',
        title: 'Cost Breakdown',
        description: `Break down costs by category, general, and service. ${params.compareWith ? `Compare against: ${params.compareWith}.` : 'Compare against previous period.'} Identify top cost drivers and trends. ${params.threshold ? `Flag anything exceeding ${params.threshold} threshold.` : ''}`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['gather'],
      },
      {
        id: 'waste',
        title: 'Waste Identification',
        description: 'Identify waste, redundancy, and inefficiency. Unused subscriptions, over-provisioned resources, excessive API calls, duplicate services. Every gold piece bleeding out must be found.',
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['breakdown'],
      },
      {
        id: 'recommend',
        title: 'Optimization Recommendations',
        description: 'Deliver prioritized recommendations for cost reduction. Include estimated savings, implementation effort, and risk for each. The war chest must grow, not shrink.',
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['waste'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Budget Forecast
// ---------------------------------------------------------------------------

export function budgetForecast(params: {
  timeframe: string;
  projects: string[];
  includeContingency?: boolean;
  scenario?: 'conservative' | 'moderate' | 'aggressive';
}): Mission {
  return {
    id: `mammon-forecast-${Date.now()}`,
    title: `Budget Forecast: ${params.timeframe}`,
    description: `Project costs for ${params.timeframe}. Projects: ${params.projects.join(', ')}. Scenario: ${params.scenario || 'moderate'}.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'baseline',
        title: 'Baseline Assessment',
        description: `Establish current burn rate and fixed costs. Map existing commitments and recurring expenses. This is the floor — we build forecasts upward from solid ground.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'project-costs',
        title: 'Project Cost Projections',
        description: `Estimate costs for each project: ${params.projects.join(', ')}. Include: API costs, infrastructure, tooling, and any external services. Model ${params.scenario || 'moderate'} scenario with upper/lower bounds.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['baseline'],
      },
      {
        id: 'risks',
        title: 'Financial Risk Flags',
        description: `Identify cost risks: scope creep, API price changes, scaling surprises, hidden dependencies. ${params.includeContingency ? 'Include contingency buffer recommendations (10-25% based on risk).' : ''} Flag any project that could bleed the war chest dry.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['project-costs'],
      },
      {
        id: 'forecast',
        title: 'Consolidated Forecast',
        description: `Deliver consolidated budget forecast for ${params.timeframe}. Include: monthly projections, total burn, runway impact, and go/no-go recommendations per project. Numbers don't lie — the Scale speaks.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['risks'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Invoice Tracking
// ---------------------------------------------------------------------------

export function invoiceTracking(params: {
  clients: string[];
  period: string;
  includeOutstanding?: boolean;
}): Mission {
  return {
    id: `mammon-invoice-${Date.now()}`,
    title: `Invoice Tracking: ${params.period}`,
    description: `Track income from: ${params.clients.join(', ')}. Period: ${params.period}. ${params.includeOutstanding ? 'Include outstanding/overdue.' : ''}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'ledger',
        title: 'Income Ledger',
        description: `Compile all invoices and payments from: ${params.clients.join(', ')}. Period: ${params.period}. Status: paid, pending, overdue. Every gold piece entering the vault must be recorded.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'reconcile',
        title: 'Reconciliation',
        description: `Reconcile expected vs received payments. ${params.includeOutstanding ? 'Flag all outstanding and overdue invoices with aging analysis.' : ''} Identify discrepancies. The ledger must balance to the last cent.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['ledger'],
      },
      {
        id: 'report',
        title: 'Revenue Report',
        description: 'Generate revenue report: total income by client, payment trends, collection rate, and cash flow timeline. Include recommendations for improving collection efficiency.',
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['reconcile'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Treasury Report
// ---------------------------------------------------------------------------

export function treasuryReport(params: {
  period: string;
  includeProjections?: boolean;
  depth?: 'summary' | 'detailed';
}): Mission {
  return {
    id: `mammon-treasury-${Date.now()}`,
    title: `Treasury Report: ${params.period}`,
    description: `Comprehensive financial health report for: ${params.period}. Depth: ${params.depth || 'detailed'}.`,
    priority: 'high',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'income',
        title: 'Revenue Summary',
        description: `Compile all income streams for ${params.period}. Break down by source (OKU Trade, ForuAI, Kruu, other). Track growth rates and reliability of each stream.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'expenses',
        title: 'Expense Summary',
        description: `Compile all expenses for ${params.period}. Categorize: infrastructure, API costs, subscriptions, tooling, one-time costs. Calculate burn rate and cost trends.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'health',
        title: 'Financial Health Assessment',
        description: `Calculate key metrics: net profit/loss, margins, runway, cost-to-revenue ratio, per-general cost efficiency. ${params.includeProjections ? 'Include 3-month and 6-month projections.' : ''} The health of the treasury IS the health of the Dominion.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['income', 'expenses'],
      },
      {
        id: 'brief',
        title: 'Treasury Brief',
        description: `Deliver the treasury brief for Lord Zexo. ${params.depth === 'summary' ? 'Keep it concise: key numbers, trends, and action items only.' : 'Full detail: every metric, every trend, every recommendation.'} The Golden Scale weighs all and reports true.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['health'],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Savings Opportunity
// ---------------------------------------------------------------------------

export function savingsOpportunity(params: {
  area: string;
  targetSavings?: string;
  constraints?: string[];
}): Mission {
  return {
    id: `mammon-savings-${Date.now()}`,
    title: `Savings Opportunity: ${params.area}`,
    description: `Find cost reduction opportunities in: ${params.area}. ${params.targetSavings ? `Target: ${params.targetSavings} savings.` : ''}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'audit',
        title: 'Current Spend Audit',
        description: `Audit current spending in: ${params.area}. Map every cost line item, its purpose, and its necessity. Separate the essential from the excessive.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
      },
      {
        id: 'opportunities',
        title: 'Identify Savings',
        description: `Find savings opportunities: model downgrades (Opus→Sonnet→Haiku where quality permits), batch processing, caching, cheaper alternatives, consolidation, elimination of unused services. ${params.constraints ? `Constraints: ${params.constraints.join(', ')}.` : ''} Think like a merchant — every copper counts.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['audit'],
      },
      {
        id: 'plan',
        title: 'Savings Plan',
        description: `Deliver prioritized savings plan. For each opportunity: estimated savings, implementation effort, risk to quality/performance, and recommended timeline. ${params.targetSavings ? `Target: ${params.targetSavings}.` : ''} Cut the fat, keep the muscle.`,
        assignedGeneral: 'MAMMON',
        status: 'pending',
        dependsOn: ['opportunities'],
      },
    ],
  };
}
