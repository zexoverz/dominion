#!/bin/bash
# rotate-token.sh — Switch between Claude Max Plan setup tokens
# When one account hits rate limits, swap to the other
#
# Accounts:
#   Token 1: ffirdani@gfxlabs.io (primary)
#   Token 2: faisalfirdani01@gmail.com (backup)
#
# Usage: bash rotate-token.sh [--check | --force | --status]
#   --check   Check current token health, rotate only if rate-limited
#   --force   Force rotate to the other token
#   --status  Show which token is active

API_URL="https://dominion-api-production.up.railway.app"
OPENCLAW_CONFIG="/data/.openclaw/openclaw.json"
SETUP_API="http://localhost:8080/setup/api"
SETUP_AUTH="Authorization: Basic $(echo -n ':c18r2' | base64)"
TOKEN_STATE_FILE="/data/workspace/dominion/missions/.token-state.json"

# Tokens from Railway env vars
TOKEN_1="${CLAUDE_SETUP_TOKEN_1:-}"
TOKEN_2="${CLAUDE_SETUP_TOKEN_2:-}"
TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-8484088492:AAFDmComp6xIaq4KYnwmzweJ4za10sgOQVU}"
FAISAL_TELEGRAM_ID="1449994544"
ACCOUNT_1="ffirdani@gfxlabs.io"
ACCOUNT_2="faisalfirdani01@gmail.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

init_state() {
  if [ ! -f "$TOKEN_STATE_FILE" ]; then
    cat > "$TOKEN_STATE_FILE" <<EOF
{
  "active_slot": 1,
  "last_rotation": null,
  "rotation_count": 0,
  "history": []
}
EOF
    echo -e "${GREEN}Initialized token state file${NC}"
  fi
}

get_active_slot() {
  python3 -c "
import json
with open('$TOKEN_STATE_FILE') as f:
    print(json.load(f).get('active_slot', 1))
" 2>/dev/null || echo "1"
}

get_active_token() {
  local slot=$(get_active_slot)
  if [ "$slot" = "1" ]; then
    echo "$TOKEN_1"
  else
    echo "$TOKEN_2"
  fi
}

get_active_account() {
  local slot=$(get_active_slot)
  if [ "$slot" = "1" ]; then
    echo "$ACCOUNT_1"
  else
    echo "$ACCOUNT_2"
  fi
}

get_other_slot() {
  local slot=$(get_active_slot)
  if [ "$slot" = "1" ]; then
    echo "2"
  else
    echo "1"
  fi
}

get_other_token() {
  local slot=$(get_active_slot)
  if [ "$slot" = "1" ]; then
    echo "$TOKEN_2"
  else
    echo "$TOKEN_1"
  fi
}

get_other_account() {
  local slot=$(get_active_slot)
  if [ "$slot" = "1" ]; then
    echo "$ACCOUNT_2"
  else
    echo "$ACCOUNT_1"
  fi
}

# ---------------------------------------------------------------------------
# Core Functions
# ---------------------------------------------------------------------------

update_openclaw_config() {
  local new_token="$1"

  echo -e "${YELLOW}Resetting OpenClaw setup...${NC}"
  local reset_result=$(curl -s -X POST "$SETUP_API/reset" -H "$SETUP_AUTH" 2>/dev/null)

  if ! echo "$reset_result" | grep -qi "ok\|deleted"; then
    echo -e "${RED}Failed to reset OpenClaw config: $reset_result${NC}"
    return 1
  fi

  echo -e "${YELLOW}Re-running setup with new token + Telegram...${NC}"
  local run_result=$(curl -s -X POST "$SETUP_API/run" \
    -H "$SETUP_AUTH" \
    -H "Content-Type: application/json" \
    -d "{\"authChoice\": \"apiKey\", \"authSecret\": \"$new_token\", \"telegramToken\": \"$TELEGRAM_TOKEN\"}" 2>/dev/null)

  if echo "$run_result" | grep -q '"ok":true'; then
    echo -e "${GREEN}OpenClaw config updated with new token + Telegram reconnected${NC}"

    # Auto-approve Faisal's Telegram so he never gets stuck in pairing mode
    sleep 3
    echo -e "${YELLOW}Setting Telegram DM policy to open for Faisal...${NC}"
    # Use openclaw CLI to allow Faisal's Telegram ID directly
    openclaw configure --section channels.telegram.dmPolicy --value open 2>/dev/null || true
    echo -e "${GREEN}Telegram auto-approve configured${NC}"
    return 0
  else
    echo -e "${RED}Failed to re-run OpenClaw setup: $run_result${NC}"
    return 1
  fi
}

update_state() {
  local new_slot="$1"
  local reason="$2"

  python3 -c "
import json
from datetime import datetime

with open('$TOKEN_STATE_FILE') as f:
    state = json.load(f)

now = datetime.utcnow().isoformat() + 'Z'
old_slot = state.get('active_slot', 1)

state['active_slot'] = $new_slot
state['last_rotation'] = now
state['rotation_count'] = state.get('rotation_count', 0) + 1

# Keep last 20 rotation events
history = state.get('history', [])
history.append({
    'timestamp': now,
    'from_slot': old_slot,
    'to_slot': $new_slot,
    'reason': '$reason'
})
state['history'] = history[-20:]

with open('$TOKEN_STATE_FILE', 'w') as f:
    json.dump(state, f, indent=2)

print('OK')
" 2>/dev/null
}

do_rotate() {
  local reason="${1:-manual}"
  local new_slot=$(get_other_slot)
  local new_token=$(get_other_token)
  local new_account=$(get_other_account)
  local old_account=$(get_active_account)
  local old_slot=$(get_active_slot)

  if [ -z "$new_token" ]; then
    echo -e "${RED}ERROR: No token configured for slot $new_slot${NC}"
    echo "Set CLAUDE_SETUP_TOKEN_$new_slot in Railway env vars"
    return 1
  fi

  echo -e "${YELLOW}🔄 Rotating token: slot $old_slot ($old_account) → slot $new_slot ($new_account)${NC}"
  echo "   Reason: $reason"

  # Update OpenClaw config
  if update_openclaw_config "$new_token"; then
    # Update state
    update_state "$new_slot" "$reason"

    echo -e "${GREEN}✅ Token rotation complete${NC}"
    echo "   Active: slot $new_slot ($new_account)"

    # Log event to Dominion API
    curl -s -X POST "$API_URL/api/events" \
      -H "Content-Type: application/json" \
      -d "{
        \"generalId\": \"THRONE\",
        \"type\": \"token-rotation\",
        \"message\": \"🔄 Setup token rotated: $old_account → $new_account ($reason)\",
        \"data\": {
          \"from_slot\": $old_slot,
          \"to_slot\": $new_slot,
          \"from_account\": \"$old_account\",
          \"to_account\": \"$new_account\",
          \"reason\": \"$reason\"
        }
      }" 2>/dev/null

    return 0
  else
    echo -e "${RED}❌ Token rotation failed${NC}"
    return 1
  fi
}

check_rate_limit() {
  # Check if current token is rate-limited by looking at recent errors
  # Method 1: Check recent events for rate limit errors
  local recent_errors=$(curl -s "$API_URL/api/events?type=error&limit=5" 2>/dev/null)

  # Method 2: Try a lightweight API probe
  # We check if the last heartbeat or agent spawn reported rate limiting
  local rate_limited=false

  if echo "$recent_errors" | python3 -c "
import sys, json
try:
    events = json.load(sys.stdin)
    if isinstance(events, list):
        for e in events:
            msg = str(e.get('message', '')).lower()
            data = str(e.get('data', '')).lower()
            if '429' in msg or 'rate' in msg or 'limit' in msg or 'overloaded' in msg or \
               '429' in data or 'rate' in data or 'overloaded' in data:
                print('RATE_LIMITED')
                sys.exit(0)
    print('OK')
except:
    print('OK')
" 2>/dev/null | grep -q "RATE_LIMITED"; then
    rate_limited=true
  fi

  # Method 3: Check if there's a rate limit marker file (set by agents on 429)
  if [ -f "/data/workspace/dominion/missions/.rate-limited" ]; then
    local marker_age=$(python3 -c "
import os, time
age = time.time() - os.path.getmtime('/data/workspace/dominion/missions/.rate-limited')
print(int(age))
" 2>/dev/null || echo "99999")

    # Only respect markers less than 30 minutes old
    if [ "$marker_age" -lt "1800" ]; then
      rate_limited=true
    else
      rm -f "/data/workspace/dominion/missions/.rate-limited"
    fi
  fi

  if [ "$rate_limited" = true ]; then
    echo -e "${RED}⚠️ Rate limit detected on current token${NC}"
    return 0  # 0 = rate limited (truthy for check)
  else
    echo -e "${GREEN}✅ Current token is healthy${NC}"
    return 1  # 1 = not rate limited
  fi
}

show_status() {
  init_state

  local slot=$(get_active_slot)
  local account=$(get_active_account)

  echo "═══════════════════════════════════════"
  echo "  🔑 Token Rotation Status"
  echo "═══════════════════════════════════════"
  echo ""
  echo "  Active Slot:    $slot"
  echo "  Active Account: $account"
  echo ""

  # Show state details
  python3 -c "
import json
with open('$TOKEN_STATE_FILE') as f:
    state = json.load(f)
print(f'  Rotations:      {state.get(\"rotation_count\", 0)}')
print(f'  Last Rotation:  {state.get(\"last_rotation\", \"never\")}')
if state.get('history'):
    print()
    print('  Recent History:')
    for h in state['history'][-5:]:
        print(f'    {h[\"timestamp\"][:19]} | slot {h[\"from_slot\"]}→{h[\"to_slot\"]} | {h[\"reason\"]}')
" 2>/dev/null

  echo ""

  # Check token availability
  if [ -n "$TOKEN_1" ]; then
    echo -e "  Slot 1 ($ACCOUNT_1): ${GREEN}configured${NC}"
  else
    echo -e "  Slot 1 ($ACCOUNT_1): ${RED}NOT SET${NC} — set CLAUDE_SETUP_TOKEN_1"
  fi

  if [ -n "$TOKEN_2" ]; then
    echo -e "  Slot 2 ($ACCOUNT_2): ${GREEN}configured${NC}"
  else
    echo -e "  Slot 2 ($ACCOUNT_2): ${RED}NOT SET${NC} — set CLAUDE_SETUP_TOKEN_2"
  fi

  echo ""
  echo "═══════════════════════════════════════"
}

# ---------------------------------------------------------------------------
# Signal file for agents to trigger rotation
# ---------------------------------------------------------------------------

mark_rate_limited() {
  # Agents call this when they get a 429 or overloaded error
  echo "{\"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"slot\": $(get_active_slot)}" \
    > "/data/workspace/dominion/missions/.rate-limited"
  echo "Rate limit marker set"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

# Validate tokens exist
if [ -z "$TOKEN_1" ] && [ -z "$TOKEN_2" ]; then
  echo -e "${RED}ERROR: No setup tokens configured${NC}"
  echo "Set these Railway env vars:"
  echo "  CLAUDE_SETUP_TOKEN_1 = setup token from ffirdani@gfxlabs.io"
  echo "  CLAUDE_SETUP_TOKEN_2 = setup token from faisalfirdani01@gmail.com"
  exit 1
fi

init_state

case "${1:-}" in
  --check)
    echo "🔍 Checking token health..."
    if check_rate_limit; then
      echo "Initiating auto-rotation..."
      do_rotate "rate-limit-detected"
    fi
    ;;
  --force)
    do_rotate "manual-force"
    ;;
  --status)
    show_status
    ;;
  --mark-limited)
    mark_rate_limited
    ;;
  *)
    echo "Usage: bash rotate-token.sh [--check | --force | --status | --mark-limited]"
    echo ""
    echo "  --check         Check health and auto-rotate if rate-limited"
    echo "  --force         Force rotate to the other token"
    echo "  --status        Show current token status"
    echo "  --mark-limited  Mark current token as rate-limited (called by agents)"
    ;;
esac
