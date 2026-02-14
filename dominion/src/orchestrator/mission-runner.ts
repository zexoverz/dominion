/**
 * ⚔️ MISSION RUNNER — Orchestrating the Dark Council's Campaigns
 *
 * Executes missions by spawning generals as sub-agents,
 * collecting results, and reporting to the Dominion API.
 *
 * "A plan without execution is merely a wish." — THRONE
 */

import {
  Mission,
  MissionStep,
  SpawnConfig,
  buildTaskPrompt,
  buildSpawnPrompt,
  getModelForGeneral,
  estimateCost,
} from './agent-spawner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MissionResult {
  missionId: string;
  status: 'completed' | 'partial' | 'failed';
  steps: StepResult[];
  summary: string;
  totalCost: number;
  startedAt: Date;
  completedAt: Date;
}

export interface StepResult {
  stepId: string;
  generalId: string;
  status: 'completed' | 'failed' | 'skipped';
  output: any;
  error?: string;
  retries: number;
  durationMs: number;
}

export interface RunnerConfig {
  maxRetries: number;
  retryDelayMs: number;
  fallbackGenerals: Record<string, string>;
  dryRun: boolean;
  onStepComplete?: (stepResult: StepResult) => void;
  onLog?: (message: string) => void;
}

interface APIEvent {
  generalId: string;
  missionId: string;
  type: 'spawn' | 'progress' | 'completion' | 'failure' | 'log';
  message: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const API_BASE = 'https://dominion-api-production.up.railway.app';

const DEFAULT_CONFIG: RunnerConfig = {
  maxRetries: 2,
  retryDelayMs: 5000,
  fallbackGenerals: {
    SEER: 'PHANTOM',   // If SEER fails analysis, PHANTOM can attempt a data-driven approach
    PHANTOM: 'SEER',   // If PHANTOM fails code task, SEER can analyze what went wrong
  },
  dryRun: false,
};

// ---------------------------------------------------------------------------
// Logging & API Communication
// ---------------------------------------------------------------------------

const eventLog: APIEvent[] = [];

function logEvent(event: APIEvent, config: RunnerConfig): void {
  eventLog.push(event);
  config.onLog?.(`[${event.type}] ${event.generalId}: ${event.message}`);
}

async function reportToAPI(endpoint: string, body: any, config: RunnerConfig): Promise<any> {
  if (config.dryRun) {
    logEvent({
      generalId: 'RUNNER',
      missionId: body.missionId || 'unknown',
      type: 'log',
      message: `[DRY RUN] Would POST to ${endpoint}: ${JSON.stringify(body).slice(0, 200)}`,
      timestamp: new Date(),
    }, config);
    return { ok: true, dryRun: true };
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err: any) {
    logEvent({
      generalId: 'RUNNER',
      missionId: body.missionId || 'unknown',
      type: 'failure',
      message: `API call failed: ${err.message}`,
      timestamp: new Date(),
    }, config);
    return { ok: false, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// Step Execution
// ---------------------------------------------------------------------------

/**
 * Determine which general should handle a step.
 * Uses the step's assignedGeneral, falling back if needed.
 */
function resolveGeneral(step: MissionStep, fallbacks: Record<string, string>, attempt: number): string {
  if (attempt === 0) return step.assignedGeneral;
  return fallbacks[step.assignedGeneral] || step.assignedGeneral;
}

/**
 * Check if a step's dependencies are all completed.
 */
function areDependenciesMet(step: MissionStep, completedSteps: Set<string>): boolean {
  if (!step.dependsOn || step.dependsOn.length === 0) return true;
  return step.dependsOn.every((dep) => completedSteps.has(dep));
}

/**
 * Simulate spawning a general as a sub-agent.
 * In production, this would call OpenClaw's sessions_spawn API.
 * Currently builds the prompt and returns it for orchestration.
 */
async function spawnGeneral(
  generalId: string,
  mission: Mission,
  step: MissionStep,
  context: string,
  config: RunnerConfig,
): Promise<StepResult> {
  const startTime = Date.now();

  const spawnConfig: SpawnConfig = {
    generalId,
    mission,
    context: `## Current Step: ${step.title}\n${step.description}\n\n${context}`,
    model: getModelForGeneral(generalId),
  };

  const prompt = buildSpawnPrompt(spawnConfig);

  logEvent({
    generalId,
    missionId: mission.id,
    type: 'spawn',
    message: `Spawning ${generalId} for step "${step.title}" (model: ${prompt.model}, est. cost: $${prompt.estimatedCost})`,
    timestamp: new Date(),
  }, config);

  // Report progress to API
  await reportToAPI(`/api/missions/${mission.id}/progress`, {
    generalId,
    stepId: step.id,
    status: 'in-progress',
    missionId: mission.id,
  }, config);

  if (config.dryRun) {
    // In dry run, simulate success
    return {
      stepId: step.id,
      generalId,
      status: 'completed',
      output: {
        prompt: prompt.taskPrompt.slice(0, 500) + '...',
        model: prompt.model,
        label: prompt.label,
      },
      retries: 0,
      durationMs: Date.now() - startTime,
    };
  }

  // In production: call OpenClaw sessions_spawn API here
  // const result = await openclawSpawn(prompt);
  // For now, return the built prompt as output
  return {
    stepId: step.id,
    generalId,
    status: 'completed',
    output: {
      taskPrompt: prompt.taskPrompt,
      model: prompt.model,
      label: prompt.label,
      note: 'Production would call OpenClaw sessions_spawn here',
    },
    retries: 0,
    durationMs: Date.now() - startTime,
  };
}

/**
 * Execute a single step with retry logic.
 */
async function executeStep(
  step: MissionStep,
  mission: Mission,
  context: string,
  config: RunnerConfig,
): Promise<StepResult> {
  let lastResult: StepResult | null = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    const generalId = resolveGeneral(step, config.fallbackGenerals, attempt);

    if (attempt > 0) {
      logEvent({
        generalId,
        missionId: mission.id,
        type: 'log',
        message: `Retry #${attempt} for step "${step.title}" — switching to ${generalId}`,
        timestamp: new Date(),
      }, config);
      await sleep(config.retryDelayMs);
    }

    try {
      const result = await spawnGeneral(generalId, mission, step, context, config);
      if (result.status === 'completed') {
        await reportToAPI(`/api/missions/${mission.id}/progress`, {
          generalId,
          stepId: step.id,
          status: 'completed',
          output: result.output,
          missionId: mission.id,
        }, config);
        config.onStepComplete?.(result);
        return result;
      }
      lastResult = result;
    } catch (err: any) {
      lastResult = {
        stepId: step.id,
        generalId,
        status: 'failed',
        output: null,
        error: err.message,
        retries: attempt,
        durationMs: 0,
      };
    }
  }

  // All retries exhausted
  const failResult: StepResult = lastResult || {
    stepId: step.id,
    generalId: step.assignedGeneral,
    status: 'failed',
    output: null,
    error: 'All retries exhausted',
    retries: config.maxRetries,
    durationMs: 0,
  };
  failResult.status = 'failed';

  await reportToAPI(`/api/missions/${mission.id}/progress`, {
    generalId: step.assignedGeneral,
    stepId: step.id,
    status: 'failed',
    error: failResult.error,
    missionId: mission.id,
  }, config);

  return failResult;
}

// ---------------------------------------------------------------------------
// Mission Execution
// ---------------------------------------------------------------------------

/**
 * Run a full mission, executing steps in dependency order.
 */
export async function runMission(
  mission: Mission,
  configOverrides: Partial<RunnerConfig> = {},
): Promise<MissionResult> {
  const config: RunnerConfig = { ...DEFAULT_CONFIG, ...configOverrides };
  const startedAt = new Date();
  const stepResults: StepResult[] = [];
  const completedSteps = new Set<string>();
  let totalCost = 0;

  logEvent({
    generalId: 'RUNNER',
    missionId: mission.id,
    type: 'log',
    message: `Mission "${mission.title}" initiated — ${mission.steps.length} steps, priority: ${mission.priority}`,
    timestamp: new Date(),
  }, config);

  // Sort steps: those without dependencies first
  const pendingSteps = [...mission.steps];

  while (pendingSteps.length > 0) {
    // Find all steps whose dependencies are met
    const ready = pendingSteps.filter((s) => areDependenciesMet(s, completedSteps));

    if (ready.length === 0 && pendingSteps.length > 0) {
      logEvent({
        generalId: 'RUNNER',
        missionId: mission.id,
        type: 'failure',
        message: `Deadlock: ${pendingSteps.length} steps remaining but none have met dependencies`,
        timestamp: new Date(),
      }, config);
      // Mark remaining as skipped
      for (const s of pendingSteps) {
        stepResults.push({
          stepId: s.id,
          generalId: s.assignedGeneral,
          status: 'skipped',
          output: null,
          error: 'Dependencies not met (deadlock)',
          retries: 0,
          durationMs: 0,
        });
      }
      break;
    }

    // Execute ready steps (could parallelize in production)
    for (const step of ready) {
      const context = buildStepContext(step, stepResults);
      const result = await executeStep(step, mission, context, config);
      stepResults.push(result);
      totalCost += estimateCost(result.generalId, mission.priority);

      if (result.status === 'completed') {
        completedSteps.add(step.id);
      }

      // Remove from pending
      const idx = pendingSteps.findIndex((s) => s.id === step.id);
      if (idx !== -1) pendingSteps.splice(idx, 1);
    }
  }

  const completedAt = new Date();
  const allCompleted = stepResults.every((r) => r.status === 'completed');
  const anyCompleted = stepResults.some((r) => r.status === 'completed');
  const status = allCompleted ? 'completed' : anyCompleted ? 'partial' : 'failed';

  const summary = `Mission "${mission.title}" ${status}. ` +
    `${stepResults.filter((r) => r.status === 'completed').length}/${stepResults.length} steps completed. ` +
    `Est. cost: $${totalCost.toFixed(2)}. ` +
    `Duration: ${completedAt.getTime() - startedAt.getTime()}ms.`;

  // Report final status
  await reportToAPI(`/api/missions/${mission.id}/complete`, {
    generalId: 'RUNNER',
    missionId: mission.id,
    status,
    summary,
    results: stepResults,
  }, config);

  logEvent({
    generalId: 'RUNNER',
    missionId: mission.id,
    type: 'completion',
    message: summary,
    timestamp: completedAt,
  }, config);

  return {
    missionId: mission.id,
    status,
    steps: stepResults,
    summary,
    totalCost,
    startedAt,
    completedAt,
  };
}

/**
 * Build context for a step based on previous step results.
 */
function buildStepContext(step: MissionStep, previousResults: StepResult[]): string {
  if (previousResults.length === 0) return 'This is the first step in the mission.';

  const priorOutputs = previousResults
    .filter((r) => r.status === 'completed')
    .map((r) => `### Step "${r.stepId}" (${r.generalId}) — Completed\nOutput: ${JSON.stringify(r.output).slice(0, 500)}`)
    .join('\n\n');

  return `## Prior Step Results\n${priorOutputs}`;
}

/**
 * Get the event log for debugging.
 */
export function getEventLog(): APIEvent[] {
  return [...eventLog];
}

/**
 * Clear the event log.
 */
export function clearEventLog(): void {
  eventLog.length = 0;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
