/**
 * 👑 THRONE INTEGRATION — The Bridge Between Will and Action
 *
 * Connects the OpenClaw agent (THRONE) to the Dominion backend system.
 * This module is the nervous system of the empire.
 *
 * "The system is no longer a simulation. It breathes."
 */

// Heartbeat — the periodic pulse
export {
  runHeartbeat,
  formatHeartbeatReport,
  type HeartbeatReport,
  type Proposal,
  type Mission,
  type MissionStep,
  type DailyCosts,
  type DominionEvent,
} from './throne-heartbeat';

// SEER spawning
export {
  buildSeerSpawnTask,
  buildSeerSpawn,
  type SeerTaskType,
  type SeerSpawnConfig,
  type SeerSpawnResult,
} from './spawn-seer';

// PHANTOM spawning
export {
  buildPhantomSpawnTask,
  buildPhantomSpawn,
  type PhantomTaskType,
  type PhantomSpawnConfig,
  type PhantomSpawnResult,
} from './spawn-phantom';

// Daily briefing
export {
  generateDailyBriefing,
  formatBriefing,
  type BriefingData,
} from './daily-briefing';

// Proposal generation
export {
  generateAllProposals,
  generateProjectProposals,
  submitProposal,
  getProjects,
  type GeneratedProposal,
  type ProposalType,
  type ProjectProfile,
} from './proposal-generator';
