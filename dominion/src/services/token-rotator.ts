/**
 * Token Rotation Service
 * Manages automatic switching between Claude Max Plan setup tokens
 * when one account hits rate limits.
 *
 * Accounts:
 *   Slot 1: ffirdani@gfxlabs.io (primary)
 *   Slot 2: faisalfirdani01@gmail.com (backup)
 *
 * The setup tokens are stored as Railway env vars:
 *   CLAUDE_SETUP_TOKEN_1, CLAUDE_SETUP_TOKEN_2
 *
 * Token state is persisted at:
 *   /data/workspace/dominion/missions/.token-state.json
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TokenSlot {
  slot: 1 | 2;
  account: string;
  hasToken: boolean;
}

export interface RotationEvent {
  timestamp: string;
  from_slot: number;
  to_slot: number;
  reason: string;
}

export interface TokenState {
  active_slot: 1 | 2;
  last_rotation: string | null;
  rotation_count: number;
  history: RotationEvent[];
}

export interface TokenStatus {
  activeSlot: TokenSlot;
  otherSlot: TokenSlot;
  lastRotation: string | null;
  rotationCount: number;
  recentHistory: RotationEvent[];
  isHealthy: boolean;
  rateLimitedSince: string | null;
}

export type RotationReason =
  | 'rate-limit-detected'
  | 'rate-limit-429'
  | 'rate-limit-overloaded'
  | 'manual-force'
  | 'heartbeat-check'
  | 'spawn-failure';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ACCOUNTS: Record<1 | 2, string> = {
  1: 'ffirdani@gfxlabs.io',
  2: 'faisalfirdani01@gmail.com',
};

const STATE_FILE = '/data/workspace/dominion/missions/.token-state.json';
const RATE_LIMIT_MARKER = '/data/workspace/dominion/missions/.rate-limited';
const OPENCLAW_CONFIG = '/data/.openclaw/openclaw.json';
const API_BASE = 'https://dominion-api-production.up.railway.app';

// Minimum time between rotations (5 minutes) to prevent flip-flopping
const MIN_ROTATION_INTERVAL_MS = 5 * 60 * 1000;

// Rate limit marker max age (30 minutes)
const RATE_LIMIT_MARKER_MAX_AGE_MS = 30 * 60 * 1000;

// ---------------------------------------------------------------------------
// State Management
// ---------------------------------------------------------------------------

function loadState(): TokenState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch {
    // Fall through to default
  }

  const defaultState: TokenState = {
    active_slot: 1,
    last_rotation: null,
    rotation_count: 0,
    history: [],
  };

  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState, null, 2));
  return defaultState;
}

function saveState(state: TokenState): void {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ---------------------------------------------------------------------------
// Token Helpers
// ---------------------------------------------------------------------------

function getTokenForSlot(slot: 1 | 2): string | undefined {
  return slot === 1
    ? process.env.CLAUDE_SETUP_TOKEN_1
    : process.env.CLAUDE_SETUP_TOKEN_2;
}

function getSlotInfo(slot: 1 | 2): TokenSlot {
  return {
    slot,
    account: ACCOUNTS[slot],
    hasToken: !!getTokenForSlot(slot),
  };
}

function getOtherSlot(current: 1 | 2): 1 | 2 {
  return current === 1 ? 2 : 1;
}

// ---------------------------------------------------------------------------
// OpenClaw Config Update
// ---------------------------------------------------------------------------

function updateOpenClawConfig(newToken: string): boolean {
  try {
    if (!fs.existsSync(OPENCLAW_CONFIG)) {
      console.error(`[TokenRotator] OpenClaw config not found: ${OPENCLAW_CONFIG}`);
      return false;
    }

    // Backup
    const configRaw = fs.readFileSync(OPENCLAW_CONFIG, 'utf-8');
    fs.writeFileSync(`${OPENCLAW_CONFIG}.bak`, configRaw);

    const config = JSON.parse(configRaw);

    // Try multiple possible config structures
    let updated = false;

    // Structure 1: auth.profiles.*.token
    if (config.auth?.profiles) {
      for (const [, profile] of Object.entries(config.auth.profiles)) {
        const p = profile as Record<string, unknown>;
        if (p.mode === 'token' || p.mode === 'oauth') {
          p.token = newToken;
          updated = true;
          break;
        }
      }
    }

    // Structure 2: setupToken at root
    if (!updated && 'setupToken' in config) {
      config.setupToken = newToken;
      updated = true;
    }

    // Structure 3: auth.token
    if (!updated && config.auth?.token) {
      config.auth.token = newToken;
      updated = true;
    }

    // Structure 4: auth.setupToken
    if (!updated && config.auth) {
      config.auth.setupToken = newToken;
      updated = true;
    }

    if (!updated) {
      console.error('[TokenRotator] Could not find token field in OpenClaw config');
      // Restore backup
      fs.writeFileSync(OPENCLAW_CONFIG, configRaw);
      return false;
    }

    fs.writeFileSync(OPENCLAW_CONFIG, JSON.stringify(config, null, 2));
    console.log('[TokenRotator] OpenClaw config updated successfully');
    return true;
  } catch (err) {
    console.error('[TokenRotator] Failed to update OpenClaw config:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Rate Limit Detection
// ---------------------------------------------------------------------------

export function markRateLimited(): void {
  const state = loadState();
  const marker = {
    timestamp: new Date().toISOString(),
    slot: state.active_slot,
  };
  fs.mkdirSync(path.dirname(RATE_LIMIT_MARKER), { recursive: true });
  fs.writeFileSync(RATE_LIMIT_MARKER, JSON.stringify(marker));
  console.log(`[TokenRotator] Rate limit marker set for slot ${state.active_slot}`);
}

export function isRateLimited(): boolean {
  try {
    if (!fs.existsSync(RATE_LIMIT_MARKER)) return false;

    const stat = fs.statSync(RATE_LIMIT_MARKER);
    const age = Date.now() - stat.mtimeMs;

    if (age > RATE_LIMIT_MARKER_MAX_AGE_MS) {
      // Stale marker, remove it
      fs.unlinkSync(RATE_LIMIT_MARKER);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function clearRateLimitMarker(): void {
  try {
    if (fs.existsSync(RATE_LIMIT_MARKER)) {
      fs.unlinkSync(RATE_LIMIT_MARKER);
    }
  } catch {
    // Ignore
  }
}

// ---------------------------------------------------------------------------
// Core Rotation Logic
// ---------------------------------------------------------------------------

/**
 * Detect if an error response indicates rate limiting.
 * Call this from agent spawn error handlers.
 */
export function isRateLimitError(error: unknown): boolean {
  const msg = String(error).toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('rate limit') ||
    msg.includes('rate_limit') ||
    msg.includes('overloaded') ||
    msg.includes('too many requests') ||
    msg.includes('resource_exhausted')
  );
}

/**
 * Rotate to the other token slot.
 * Returns true if rotation succeeded.
 */
export async function rotate(reason: RotationReason): Promise<boolean> {
  const state = loadState();
  const currentSlot = state.active_slot;
  const newSlot = getOtherSlot(currentSlot);
  const newToken = getTokenForSlot(newSlot);

  if (!newToken) {
    console.error(
      `[TokenRotator] No token for slot ${newSlot} (${ACCOUNTS[newSlot]}). ` +
        `Set CLAUDE_SETUP_TOKEN_${newSlot} in Railway env vars.`
    );
    return false;
  }

  // Prevent flip-flopping
  if (state.last_rotation) {
    const elapsed = Date.now() - new Date(state.last_rotation).getTime();
    if (elapsed < MIN_ROTATION_INTERVAL_MS) {
      console.warn(
        `[TokenRotator] Skipping rotation — last rotation was ${Math.round(elapsed / 1000)}s ago ` +
          `(min interval: ${MIN_ROTATION_INTERVAL_MS / 1000}s)`
      );
      return false;
    }
  }

  console.log(
    `[TokenRotator] Rotating: slot ${currentSlot} (${ACCOUNTS[currentSlot]}) → ` +
      `slot ${newSlot} (${ACCOUNTS[newSlot]}) | Reason: ${reason}`
  );

  // Update OpenClaw config
  if (!updateOpenClawConfig(newToken)) {
    return false;
  }

  // Update state
  const now = new Date().toISOString();
  state.active_slot = newSlot;
  state.last_rotation = now;
  state.rotation_count++;
  state.history.push({
    timestamp: now,
    from_slot: currentSlot,
    to_slot: newSlot,
    reason,
  });
  // Keep last 50 events
  if (state.history.length > 50) {
    state.history = state.history.slice(-50);
  }
  saveState(state);

  // Clear rate limit marker
  clearRateLimitMarker();

  // Log to Dominion API
  try {
    await fetch(`${API_BASE}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generalId: 'THRONE',
        type: 'token-rotation',
        message: `🔄 Setup token rotated: ${ACCOUNTS[currentSlot]} → ${ACCOUNTS[newSlot]} (${reason})`,
        data: {
          from_slot: currentSlot,
          to_slot: newSlot,
          from_account: ACCOUNTS[currentSlot],
          to_account: ACCOUNTS[newSlot],
          reason,
          rotation_count: state.rotation_count,
        },
      }),
    });
  } catch {
    // Non-critical, just log
    console.warn('[TokenRotator] Failed to log rotation event to API');
  }

  return true;
}

/**
 * Check token health and auto-rotate if rate-limited.
 * Call this from the heartbeat.
 */
export async function checkAndRotate(): Promise<{
  rotated: boolean;
  reason?: string;
  activeSlot: number;
  activeAccount: string;
}> {
  const state = loadState();

  if (isRateLimited()) {
    const rotated = await rotate('rate-limit-detected');
    const newState = loadState();
    return {
      rotated,
      reason: rotated ? 'Rate limit detected, rotated to backup token' : 'Rate limited but rotation failed',
      activeSlot: newState.active_slot,
      activeAccount: ACCOUNTS[newState.active_slot],
    };
  }

  return {
    rotated: false,
    activeSlot: state.active_slot,
    activeAccount: ACCOUNTS[state.active_slot],
  };
}

/**
 * Handle a rate limit error from an agent operation.
 * Marks the current token as limited and triggers rotation.
 */
export async function handleRateLimitError(error: unknown): Promise<boolean> {
  if (!isRateLimitError(error)) return false;

  console.warn(`[TokenRotator] Rate limit error detected: ${String(error).slice(0, 200)}`);
  markRateLimited();
  return await rotate('rate-limit-429');
}

/**
 * Get current token rotation status.
 */
export function getStatus(): TokenStatus {
  const state = loadState();
  const activeSlot = state.active_slot;
  const otherSlot = getOtherSlot(activeSlot);

  let rateLimitedSince: string | null = null;
  try {
    if (fs.existsSync(RATE_LIMIT_MARKER)) {
      const marker = JSON.parse(fs.readFileSync(RATE_LIMIT_MARKER, 'utf-8'));
      rateLimitedSince = marker.timestamp;
    }
  } catch {
    // Ignore
  }

  return {
    activeSlot: getSlotInfo(activeSlot),
    otherSlot: getSlotInfo(otherSlot),
    lastRotation: state.last_rotation,
    rotationCount: state.rotation_count,
    recentHistory: state.history.slice(-10),
    isHealthy: !isRateLimited(),
    rateLimitedSince,
  };
}

/**
 * Format status as human-readable string (for heartbeat reports / Telegram).
 */
export function formatStatus(): string {
  const status = getStatus();
  const lines = [
    `🔑 **Token Rotation Status**`,
    `Active: Slot ${status.activeSlot.slot} (${status.activeSlot.account})`,
    `Backup: Slot ${status.otherSlot.slot} (${status.otherSlot.account}) — ${status.otherSlot.hasToken ? '✅ ready' : '❌ NOT SET'}`,
    `Health: ${status.isHealthy ? '✅ healthy' : '⚠️ rate-limited'}`,
    `Rotations: ${status.rotationCount} total`,
  ];

  if (status.lastRotation) {
    lines.push(`Last Rotation: ${status.lastRotation}`);
  }

  return lines.join('\n');
}

export default {
  rotate,
  checkAndRotate,
  handleRateLimitError,
  markRateLimited,
  isRateLimited,
  isRateLimitError,
  getStatus,
  formatStatus,
};
