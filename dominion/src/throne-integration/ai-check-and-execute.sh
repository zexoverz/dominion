#!/usr/bin/env bash
set -euo pipefail

# ai-check-and-execute.sh — Find active missions and generate AI prompts
# Replaces check-and-execute.sh with AI sub-agent approach

API="https://dominion-api-production.up.railway.app/api"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MISSIONS_DIR="/data/workspace/dominion/missions"
LOCK_FILE="/tmp/dominion-ai-executor.lock"

mkdir -p "$MISSIONS_DIR"

log() { echo "[$(date -u +%H:%M:%S)] ai-check: $*"; }

# Prevent concurrent runs
if [ -f "$LOCK_FILE" ]; then
  LOCK_AGE=$(( $(date +%s) - $(stat -c %Y "$LOCK_FILE" 2>/dev/null || echo 0) ))
  if [ "$LOCK_AGE" -lt 300 ]; then
    log "Another execution in progress (lock age: ${LOCK_AGE}s), skipping"
    exit 0
  fi
  log "Stale lock detected (${LOCK_AGE}s), removing"
  rm -f "$LOCK_FILE"
fi

trap 'rm -f "$LOCK_FILE"' EXIT
touch "$LOCK_FILE"

log "Checking for active missions..."

MISSIONS=$(curl -sf "$API/missions?status=active" 2>/dev/null || echo "[]")

MISSION_IDS=$(echo "$MISSIONS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    missions = data if isinstance(data, list) else data.get('data', data.get('missions', []))
    for m in missions:
        mid = m.get('id', '')
        if mid:
            print(mid)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
" 2>/dev/null)

if [ -z "$MISSION_IDS" ]; then
  log "No active missions found"
  exit 0
fi

COUNT=$(echo "$MISSION_IDS" | wc -l)
log "Found $COUNT active mission(s)"

PROCESSED=0
SKIPPED=0
FAILED=0

while IFS= read -r mid; do
  [ -z "$mid" ] && continue

  # Skip if prompt already exists
  if [ -f "$MISSIONS_DIR/${mid}.prompt" ]; then
    log "Skipping $mid — prompt already exists"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  log "Generating AI prompt for mission: $mid"
  if bash "$SCRIPT_DIR/ai-execute-mission.sh" "$mid"; then
    PROCESSED=$((PROCESSED + 1))
  else
    FAILED=$((FAILED + 1))
    log "Failed to process mission $mid"
  fi
done <<< "$MISSION_IDS"

log "Done. Processed: $PROCESSED, Skipped: $SKIPPED, Failed: $FAILED"
