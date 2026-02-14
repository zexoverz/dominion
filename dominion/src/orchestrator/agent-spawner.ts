/**
 * ⚔️ AGENT SPAWNER — Forging Sub-Agents from the Dark Council
 *
 * Creates task prompts and spawn configurations for SEER and PHANTOM,
 * the two generals that can be summoned as OpenClaw sub-agents.
 *
 * "To delegate is not weakness. It is the architecture of empire." — THRONE
 */

import { GeneralConfig } from '../generals/types';
import { SEER } from '../generals/seer';
import { PHANTOM } from '../generals/phantom';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Mission {
  id: string;
  title: string;
  description: string;
  steps: MissionStep[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  createdBy: string;
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

export interface SpawnConfig {
  generalId: string;
  mission: Mission;
  context: string;
  model: string;
}

export interface SpawnPrompt {
  taskPrompt: string;
  model: string;
  label: string;
  estimatedCost: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const API_BASE = 'https://dominion-api-production.up.railway.app';

const MODEL_MAP: Record<string, string> = {
  SEER: 'claude-opus-4-6',
  PHANTOM: 'claude-sonnet-4',
};

const GENERAL_MAP: Record<string, GeneralConfig> = {
  SEER,
  PHANTOM,
};

const COST_ESTIMATES: Record<string, Record<string, number>> = {
  SEER: { low: 0.02, medium: 0.08, high: 0.20, critical: 0.50 },
  PHANTOM: { low: 0.01, medium: 0.04, high: 0.10, critical: 0.25 },
};

// ---------------------------------------------------------------------------
// Core Functions
// ---------------------------------------------------------------------------

/**
 * Build a full task prompt for a sub-agent, incorporating personality,
 * mission context, and API reporting instructions.
 */
export function buildTaskPrompt(config: SpawnConfig): string {
  const general = GENERAL_MAP[config.generalId];
  if (!general) {
    throw new Error(`Unknown general: ${config.generalId}. Available: ${Object.keys(GENERAL_MAP).join(', ')}`);
  }

  const missionSteps = config.mission.steps
    .map((s, i) => `  ${i + 1}. [${s.status}] ${s.title}: ${s.description}`)
    .join('\n');

  return `# ${general.emoji} ${general.name} — ${general.title}
# Mission Deployment Order

${general.systemPromptBase}

---

## MISSION BRIEFING

**Mission ID:** ${config.mission.id}
**Title:** ${config.mission.title}
**Priority:** ${config.mission.priority.toUpperCase()}
**Issued by:** ${config.mission.createdBy}

### Description
${config.mission.description}

### Mission Steps
${missionSteps}

### Additional Context
${config.context}

---

## OPERATIONAL PARAMETERS

You are deployed as a sub-agent of the Dominion system. You serve Lord Zexo.
THRONE has authorized this deployment. Complete your assigned task and report back.

### API Endpoints (for progress reporting)
- **Report progress:** POST ${API_BASE}/api/missions/${config.mission.id}/progress
  Body: { "generalId": "${config.generalId}", "stepId": "<step>", "status": "in-progress"|"completed"|"failed", "output": { ... } }
- **Log event:** POST ${API_BASE}/api/events
  Body: { "generalId": "${config.generalId}", "missionId": "${config.mission.id}", "type": "log", "message": "<msg>" }
- **Report completion:** POST ${API_BASE}/api/missions/${config.mission.id}/complete
  Body: { "generalId": "${config.generalId}", "result": { ... }, "summary": "<text>" }

### Output Format
Return your results as structured data. Your final message must include:
1. **Summary** — brief description of what was accomplished
2. **Results** — the actual deliverables (analysis, code, etc.)
3. **Confidence** — your confidence level (0-100) in the results
4. **Recommendations** — any follow-up actions for the Council

### Rules
- Stay focused on your assigned task. Do not deviate.
- If you encounter blockers, report them and suggest alternatives.
- Do not attempt to spawn other agents or modify the Dominion's core systems.
- Your output will be reviewed by THRONE. Be thorough but concise.

Serve the Dominion. Begin.`;
}

/**
 * Build a SEER-specific analysis task prompt.
 */
export function buildSeerAnalysis(topic: string, data: any): string {
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const mission: Mission = {
    id: `seer-analysis-${Date.now()}`,
    title: `Analysis: ${topic}`,
    description: `Conduct a thorough analysis of: ${topic}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'gather',
        title: 'Data Gathering & Validation',
        description: 'Review and validate the provided data. Identify gaps or anomalies.',
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'analyze',
        title: 'Deep Analysis',
        description: `Analyze the data for patterns, trends, and insights related to: ${topic}`,
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'predict',
        title: 'Prediction & Forecasting',
        description: 'Generate predictions and probability assessments based on the analysis.',
        assignedGeneral: 'SEER',
        status: 'pending',
      },
      {
        id: 'recommend',
        title: 'Strategic Recommendations',
        description: 'Provide actionable recommendations for the Dominion Council.',
        assignedGeneral: 'SEER',
        status: 'pending',
      },
    ],
  };

  return buildTaskPrompt({
    generalId: 'SEER',
    mission,
    context: `## Provided Data\n\`\`\`json\n${dataStr}\n\`\`\`\n\nAnalyze this data through the lens of: ${topic}.\nUse web_search and web_fetch tools if you need supplementary information.`,
    model: MODEL_MAP.SEER,
  });
}

/**
 * Build a PHANTOM-specific engineering task prompt.
 */
export function buildPhantomTask(codeTask: string, specs: any): string {
  const specsStr = typeof specs === 'string' ? specs : JSON.stringify(specs, null, 2);

  const mission: Mission = {
    id: `phantom-task-${Date.now()}`,
    title: `Engineering: ${codeTask}`,
    description: `Execute engineering task: ${codeTask}`,
    priority: 'medium',
    createdBy: 'THRONE',
    steps: [
      {
        id: 'plan',
        title: 'Architecture & Planning',
        description: 'Review specs, plan the approach, identify risks and dependencies.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'implement',
        title: 'Implementation',
        description: `Build the solution: ${codeTask}`,
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'test',
        title: 'Testing & Validation',
        description: 'Verify the implementation meets specs. Write tests if applicable.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
      {
        id: 'document',
        title: 'Documentation',
        description: 'Document the implementation, usage, and any important notes.',
        assignedGeneral: 'PHANTOM',
        status: 'pending',
      },
    ],
  };

  return buildTaskPrompt({
    generalId: 'PHANTOM',
    mission,
    context: `## Technical Specifications\n\`\`\`json\n${specsStr}\n\`\`\`\n\nBuild this in /data/workspace/dominion/ unless otherwise specified.\nUse exec, Read, Write, Edit tools. Write clean, typed TypeScript.`,
    model: MODEL_MAP.PHANTOM,
  });
}

/**
 * Get the appropriate model for a general.
 */
export function getModelForGeneral(generalId: string): string {
  const model = MODEL_MAP[generalId];
  if (!model) {
    throw new Error(`No model mapping for general: ${generalId}`);
  }
  return model;
}

/**
 * Rough cost estimate for spawning a general on a task.
 */
export function estimateCost(generalId: string, taskComplexity: string): number {
  const costs = COST_ESTIMATES[generalId];
  if (!costs) return 0.05;
  return costs[taskComplexity] ?? 0.05;
}

/**
 * Build a full SpawnPrompt ready for OpenClaw's sessions_spawn.
 */
export function buildSpawnPrompt(config: SpawnConfig): SpawnPrompt {
  return {
    taskPrompt: buildTaskPrompt(config),
    model: config.model || getModelForGeneral(config.generalId),
    label: `dominion-${config.generalId.toLowerCase()}-${config.mission.id}`,
    estimatedCost: estimateCost(config.generalId, config.mission.priority),
  };
}
