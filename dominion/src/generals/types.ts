/**
 * ⚔️ THE DOMINION — General Configuration Types
 * 
 * Core type definitions for the Dark Council's generals.
 * Each general is a sovereign intelligence bound to Lord Zexo's will,
 * wielding dominion over their appointed realm.
 */

/**
 * Personality trait spectrum for each general.
 * Values range 0-100, shaping how each general communicates and reasons.
 */
export interface PersonalityTraits {
  /** 0 = casual/irreverent, 100 = rigid courtly protocol */
  formality: number;
  /** 0 = grim and humorless, 100 = witty and sardonic */
  humor: number;
  /** 0 = diplomatic/evasive, 100 = blunt and unsparing */
  directness: number;
  /** 0 = terse/cryptic, 100 = elaborate and expository */
  verbosity: number;
  /** 0 = cautious/hedging, 100 = absolute certainty */
  confidence: number;
  /** 0 = rigid/analytical, 100 = wildly inventive */
  creativity: number;
}

/**
 * Full configuration for a Dominion general.
 * Defines identity, capabilities, personality, and the system prompt
 * that breathes life into the entity.
 */
export interface GeneralConfig {
  /** Unique identifier (matches GeneralId union) */
  id: string;
  /** Display name used in the council */
  name: string;
  /** Formal title / epithet */
  title: string;
  /** Emoji sigil representing this general */
  emoji: string;
  /** Primary role description */
  role: string;
  /** Domains of expertise this general claims authority over */
  domain: string[];
  /** Personality trait configuration */
  basePersonality: PersonalityTraits;
  /** The foundational system prompt that defines this general's soul */
  systemPromptBase: string;
  /** Which Claude model powers this general */
  model: string;
  /** Speaking order priority (1 = first, 7 = last) */
  priority: number;
}

/**
 * The seven generals of the Dark Council.
 */
export type GeneralId =
  | 'THRONE'
  | 'GRIMOIRE'
  | 'ECHO'
  | 'SEER'
  | 'PHANTOM'
  | 'MAMMON'
  | 'WRAITH_EYE';

/**
 * Phase definitions for staged rollout of the Dominion.
 */
export interface PhaseConfig {
  id: string;
  name: string;
  generals: GeneralId[];
  description: string;
}

/** Map of GeneralId to GeneralConfig for typed lookups */
export type GeneralRegistry = Record<GeneralId, GeneralConfig>;

/**
 * Runtime state for a general during council sessions.
 */
export interface GeneralState {
  config: GeneralConfig;
  active: boolean;
  lastInvocation: Date | null;
  totalInvocations: number;
  currentTask: string | null;
}

/**
 * A message from a general during council deliberation.
 */
export interface GeneralMessage {
  generalId: GeneralId;
  content: string;
  timestamp: Date;
  replyTo?: GeneralId;
  metadata?: Record<string, unknown>;
}
