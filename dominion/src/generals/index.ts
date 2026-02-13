/**
 * ⚔️ THE DOMINION — General Registry
 * 
 * Central export point for all generals of the Dark Council.
 * "Seven minds, one purpose. The Dominion endures."
 */

export * from './types';

// Individual general configs
export { THRONE } from './throne';
export { GRIMOIRE } from './grimoire';
export { ECHO } from './echo';
export { SEER } from './seer';
export { PHANTOM } from './phantom';
export { MAMMON } from './mammon';
export { WRAITH_EYE } from './wraith-eye';

import { GeneralConfig, GeneralId } from './types';
import { THRONE } from './throne';
import { GRIMOIRE } from './grimoire';
import { ECHO } from './echo';
import { SEER } from './seer';
import { PHANTOM } from './phantom';
import { MAMMON } from './mammon';
import { WRAITH_EYE } from './wraith-eye';

/** Complete registry of all generals, keyed by GeneralId */
const GENERALS: Record<GeneralId, GeneralConfig> = {
  THRONE,
  GRIMOIRE,
  ECHO,
  SEER,
  PHANTOM,
  MAMMON,
  WRAITH_EYE,
};

/**
 * Retrieve a single general's configuration by ID.
 * Throws if the ID is not recognized.
 */
export function getGeneral(id: GeneralId): GeneralConfig {
  const general = GENERALS[id];
  if (!general) {
    throw new Error(`Unknown general: ${id}. The Dark Council does not recognize this name.`);
  }
  return general;
}

/**
 * Retrieve all generals, sorted by priority (speaking order).
 */
export function getAllGenerals(): GeneralConfig[] {
  return Object.values(GENERALS).sort((a, b) => a.priority - b.priority);
}

/**
 * Retrieve Phase 1 generals: THRONE, SEER, PHANTOM.
 * The initial triumvirate — command, intelligence, and engineering.
 */
export function getPhase1Generals(): GeneralConfig[] {
  const phase1Ids: GeneralId[] = ['THRONE', 'SEER', 'PHANTOM'];
  return phase1Ids.map((id) => GENERALS[id]).sort((a, b) => a.priority - b.priority);
}

/**
 * Get generals filtered by model type.
 */
export function getGeneralsByModel(model: string): GeneralConfig[] {
  return getAllGenerals().filter((g) => g.model === model);
}

/**
 * Get a general by domain expertise match.
 * Returns generals whose domain array includes the given keyword.
 */
export function getGeneralsByDomain(domain: string): GeneralConfig[] {
  return getAllGenerals().filter((g) =>
    g.domain.some((d) => d.includes(domain) || domain.includes(d))
  );
}

export default GENERALS;
