#!/usr/bin/env bash
set -euo pipefail

# auto-review.sh — Auto-approve cheap proposals, create missions, execute
# Called by THRONE heartbeat

API="https://dominion-api-production.up.railway.app/api"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

log() { echo "[$(date -u +%H:%M:%S)] auto-review: $*"; }

APPROVED=0
SKIPPED=0
MISSIONS_CREATED=0
ERRORS=0

# --- Step 1: Fetch pending proposals and auto-approve cheap ones ---
log "Fetching pending proposals..."
PENDING=$(curl -sf "$API/proposals?status=pending" 2>/dev/null || echo "[]")

eval "$(echo "$PENDING" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    proposals = data if isinstance(data, list) else data.get('data', data.get('proposals', []))
    approved_ids = []
    skipped = []
    for p in proposals:
        pid = p.get('id', '')
        cost = p.get('estimatedCost', p.get('estimated_cost', p.get('cost', 0)))
        try:
            cost = float(cost) if cost else 0
        except (ValueError, TypeError):
            cost = 0
        title = p.get('title', 'untitled').replace(\"'\", \"\")
        if cost < 1.0:
            approved_ids.append(pid)
        else:
            skipped.append(f'{pid}|{cost}|{title}')
    print(f'APPROVE_IDS=\"{chr(10).join(approved_ids)}\"')
    print(f'SKIP_INFO=\"{chr(10).join(skipped)}\"')
except Exception as e:
    print(f'APPROVE_IDS=\"\"', file=sys.stdout)
    print(f'SKIP_INFO=\"\"', file=sys.stdout)
    print(f'ERROR: {e}', file=sys.stderr)
" 2>/dev/null)"

# Run roundtable debate for each proposal before approving
if [ -n "$APPROVE_IDS" ]; then
  while IFS= read -r pid; do
    [ -z "$pid" ] && continue
    log "Running roundtable debate for proposal $pid"
    bash "$SCRIPT_DIR/roundtable-debate.sh" "$pid" 2>&1 | tail -3 || log "WARNING: Debate failed for $pid"
  done <<< "$APPROVE_IDS"
fi

# Auto-approve cheap proposals
if [ -n "$APPROVE_IDS" ]; then
  while IFS= read -r pid; do
    [ -z "$pid" ] && continue
    log "Auto-approving proposal $pid (cost < \$1)"
    RESULT=$(curl -sf -X PATCH "$API/proposals/$pid" \
      -H "Content-Type: application/json" \
      -d '{"status":"approved"}' 2>/dev/null || echo "FAIL")
    if [ "$RESULT" = "FAIL" ]; then
      log "ERROR: Failed to approve proposal $pid"
      ERRORS=$((ERRORS + 1))
    else
      APPROVED=$((APPROVED + 1))
    fi
  done <<< "$APPROVE_IDS"
fi

# Log skipped proposals
if [ -n "$SKIP_INFO" ]; then
  while IFS= read -r info; do
    [ -z "$info" ] && continue
    SKIPPED=$((SKIPPED + 1))
    log "Skipped (needs human): $info"
  done <<< "$SKIP_INFO"
fi

# --- Step 2: Create missions from approved proposals without missions ---
log "Checking for approved proposals needing missions..."
APPROVED_PROPS=$(curl -sf "$API/proposals?status=approved" 2>/dev/null || echo "[]")
EXISTING_MISSIONS=$(curl -sf "$API/missions" 2>/dev/null || echo "[]")

NEW_MISSIONS=$(python3 -c "
import sys, json

try:
    approved = json.loads('''$(echo "$APPROVED_PROPS")''')
    missions = json.loads('''$(echo "$EXISTING_MISSIONS")''')
    
    approved = approved if isinstance(approved, list) else approved.get('data', approved.get('proposals', []))
    missions = missions if isinstance(missions, list) else missions.get('data', missions.get('missions', []))
    
    # Get proposal IDs that already have missions
    mission_prop_ids = set()
    for m in missions:
        pid = m.get('proposal_id', m.get('proposalId', ''))
        if pid:
            mission_prop_ids.add(str(pid))
    
    # Find approved proposals without missions
    for p in approved:
        pid = str(p.get('id', ''))
        if pid and pid not in mission_prop_ids:
            title = p.get('title', 'Untitled').replace('\"', '\\\\\"')
            desc = p.get('description', '').replace('\"', '\\\\\"')[:200]
            agent = p.get('agent_id', p.get('agentId', 'throne'))
            print(f'{pid}|{agent}|{title}|{desc}')
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
" 2>/dev/null)

if [ -n "$NEW_MISSIONS" ]; then
  while IFS='|' read -r prop_id agent_id title desc; do
    [ -z "$prop_id" ] && continue
    [[ "$prop_id" == ERROR* ]] && continue
    log "Creating mission for proposal $prop_id: $title"
    RESULT=$(curl -sf -X POST "$API/missions" \
      -H "Content-Type: application/json" \
      -d "{\"proposal_id\":\"$prop_id\",\"agent_id\":\"$agent_id\",\"title\":\"$title\",\"description\":\"$desc\",\"status\":\"active\"}" 2>/dev/null || echo "FAIL")
    if [ "$RESULT" = "FAIL" ]; then
      log "ERROR: Failed to create mission for proposal $prop_id"
      ERRORS=$((ERRORS + 1))
    else
      MISSIONS_CREATED=$((MISSIONS_CREATED + 1))
    fi
  done <<< "$NEW_MISSIONS"
fi

# --- Step 3: Execute missions ---
if [ "$MISSIONS_CREATED" -gt 0 ] || [ "$APPROVED" -gt 0 ]; then
  log "Triggering mission execution..."
  bash "$SCRIPT_DIR/check-and-execute.sh" 2>&1 | while read -r line; do log "  $line"; done || true
fi

# --- Step 4: Log summary event ---
SUMMARY="Auto-review: approved=$APPROVED, skipped=$SKIPPED, missions_created=$MISSIONS_CREATED, errors=$ERRORS"
log "$SUMMARY"

curl -sf -X POST "$API/events" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"auto_review\",\"source\":\"throne\",\"data\":{\"approved\":$APPROVED,\"skipped\":$SKIPPED,\"missions_created\":$MISSIONS_CREATED,\"errors\":$ERRORS},\"message\":\"$SUMMARY\"}" >/dev/null 2>&1 || log "WARNING: Failed to log event"

# --- Step 5: Send notifications for significant events ---
if [ "$APPROVED" -gt 0 ] || [ "$MISSIONS_CREATED" -gt 0 ] || [ "$SKIPPED" -gt 0 ]; then
  NOTIF_MSG="Approved: $APPROVED proposals | Created: $MISSIONS_CREATED missions | Skipped (needs human): $SKIPPED | Errors: $ERRORS"
  bash "$SCRIPT_DIR/notify.sh" --type auto-review-summary --message "$NOTIF_MSG" || log "WARNING: Failed to queue notification"
fi

if [ "$SKIPPED" -gt 0 ]; then
  bash "$SCRIPT_DIR/notify.sh" --type proposal-needs-approval --priority high \
    --message "$SKIPPED proposal(s) need manual approval (cost ≥ \$1). Check the dashboard." || true
fi

log "Done."
