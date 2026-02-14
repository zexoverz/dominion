/**
 * ⚔️ DOMINION ORCHESTRATOR
 *
 * Sub-agent spawning and mission execution for the Dark Council.
 */

export {
  buildTaskPrompt,
  buildSeerAnalysis,
  buildPhantomTask,
  buildSpawnPrompt,
  getModelForGeneral,
  estimateCost,
  type Mission,
  type MissionStep,
  type SpawnConfig,
  type SpawnPrompt,
} from './agent-spawner';

export {
  runMission,
  getEventLog,
  clearEventLog,
  type MissionResult,
  type StepResult,
  type RunnerConfig,
} from './mission-runner';

export * as seerTasks from './seer-tasks';
export * as phantomTasks from './phantom-tasks';
export * as grimoireTasks from './grimoire-tasks';
export * as echoTasks from './echo-tasks';
export * as mammonTasks from './mammon-tasks';
export * as wraithEyeTasks from './wraith-eye-tasks';
export * as missionTemplates from './mission-templates';
