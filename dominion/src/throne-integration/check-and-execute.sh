#!/usr/bin/env bash
set -euo pipefail

# check-and-execute.sh — Find active missions and execute them
# Called by heartbeat/cron

API="https://dominion-api-production.up.railway.app/api"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOCK_FILE="/tmp/dominion-executor.lock"

log() { echo "[$(date -u +%H:%M:%S)] $*"; }

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

# Parse mission IDs
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

EXECUTED=0
FAILED=0

while IFS= read -r mid; do
  [ -z "$mid" ] && continue
  log "Executing mission: $mid"
  if bash "$SCRIPT_DIR/execute-mission.sh" "$mid"; then
    EXECUTED=$((EXECUTED + 1))
  else
    FAILED=$((FAILED + 1))
    log "Mission $mid failed"
  fi
done <<< "$MISSION_IDS"

log "Done. Executed: $EXECUTED, Failed: $FAILED"
