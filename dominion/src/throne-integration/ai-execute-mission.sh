#!/usr/bin/env bash
set -euo pipefail

# ai-execute-mission.sh — Generate AI sub-agent prompt for a mission
# Usage: ./ai-execute-mission.sh <mission_id>

API="https://dominion-api-production.up.railway.app/api"
MISSION_ID="${1:?Usage: ai-execute-mission.sh <mission_id>}"
MISSIONS_DIR="/data/workspace/dominion/missions"
REPORTS_DIR="/data/workspace/dominion/reports"
TRIGGERS_DIR="/data/workspace/dominion/missions/triggers"
DATE_SLUG=$(date -u +"%Y-%m-%d")

mkdir -p "$MISSIONS_DIR" "$REPORTS_DIR" "$TRIGGERS_DIR"

log() { echo "[$(date -u +%H:%M:%S)] ai-execute: $*"; }

# Fetch mission details
log "Fetching mission $MISSION_ID..."
MISSION_JSON=$(curl -sf "$API/missions/$MISSION_ID" 2>/dev/null || echo "")
if [ -z "$MISSION_JSON" ]; then
  log "ERROR: Failed to fetch mission $MISSION_ID"
  exit 1
fi

# Parse mission fields
eval "$(echo "$MISSION_JSON" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    m = data.get('data', data) if isinstance(data, dict) else data
    if isinstance(m, list): m = m[0] if m else {}
    title = m.get('title', 'Untitled').replace(\"'\", \"'\\\\''\")
    desc = m.get('description', '').replace(\"'\", \"'\\\\''\")
    agent = m.get('agent_id', m.get('agentId', 'throne')).lower()
    print(f\"TITLE='{title}'\")
    print(f\"DESC='{desc}'\")
    print(f\"AGENT_ID='{agent}'\")
except Exception as e:
    print(f\"TITLE='Unknown'\")
    print(f\"DESC=''\")
    print(f\"AGENT_ID='throne'\")
    print(f'# Parse error: {e}', file=sys.stderr)
")"

log "Mission: $TITLE (agent: $AGENT_ID)"

# Log mission started event
curl -sf -X POST "$API/events" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"mission.ai_started\",\"source\":\"throne\",\"agent_id\":\"$AGENT_ID\",\"mission_id\":\"$MISSION_ID\",\"message\":\"AI execution started: $TITLE\"}" >/dev/null 2>&1 || true

# Build prompt based on agent
REPORT_FILE="$REPORTS_DIR/${AGENT_ID}-mission-${DATE_SLUG}.md"
PROMPT_FILE="$MISSIONS_DIR/${MISSION_ID}.prompt"

case "$AGENT_ID" in
  seer)
    PROMPT="You are SEER, the intelligence general of the Dominion. Your mission: $TITLE
Description: $DESC

Use web_search to find latest BTC/crypto news and data. Use exec with curl to fetch live prices from CoinGecko API (https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true). Analyze trends, institutional movements (BlackRock, ETFs, sovereign funds), and market sentiment. Flag any bullish or bearish signals.

Save your report to $REPORT_FILE
Be specific with data, prices, and sources. This is Bloomberg-quality intelligence.

After saving the report, use exec to run:
curl -sf -X POST '$API/events' -H 'Content-Type: application/json' -d '{\"type\":\"mission.completed\",\"source\":\"seer\",\"mission_id\":\"$MISSION_ID\",\"message\":\"SEER mission complete\"}'
curl -sf -X PATCH '$API/missions/$MISSION_ID' -H 'Content-Type: application/json' -d '{\"status\":\"completed\"}'
"
    ;;
  phantom)
    PROMPT="You are PHANTOM, the security general of the Dominion. Your mission: $TITLE
Description: $DESC

Run real security checks: check SSL certs (echo | openssl s_client), test API endpoints for proper responses and headers, review dependency versions, scan for common vulnerabilities. Use exec to run curl commands and check responses. Test the Dominion API at $API and any other relevant endpoints.

Save your report to $REPORT_FILE

After saving the report, use exec to run:
curl -sf -X POST '$API/events' -H 'Content-Type: application/json' -d '{\"type\":\"mission.completed\",\"source\":\"phantom\",\"mission_id\":\"$MISSION_ID\",\"message\":\"PHANTOM mission complete\"}'
curl -sf -X PATCH '$API/missions/$MISSION_ID' -H 'Content-Type: application/json' -d '{\"status\":\"completed\"}'
"
    ;;
  grimoire)
    PROMPT="You are GRIMOIRE, the knowledge general of the Dominion. Your mission: $TITLE
Description: $DESC

Use web_search and web_fetch to research deeply. Read GitHub repos, documentation, EIPs, technical specs. Synthesize findings into actionable insights with citations.

Save your report to $REPORT_FILE

After saving the report, use exec to run:
curl -sf -X POST '$API/events' -H 'Content-Type: application/json' -d '{\"type\":\"mission.completed\",\"source\":\"grimoire\",\"mission_id\":\"$MISSION_ID\",\"message\":\"GRIMOIRE mission complete\"}'
curl -sf -X PATCH '$API/missions/$MISSION_ID' -H 'Content-Type: application/json' -d '{\"status\":\"completed\"}'
"
    ;;
  echo)
    PROMPT="You are ECHO, the communications general of the Dominion. Your mission: $TITLE
Description: $DESC

Use web_search to analyze current trends, competitor content, community sentiment. Draft content strategies, social posts, or community engagement plans. Be creative and strategic.

Save your report to $REPORT_FILE

After saving the report, use exec to run:
curl -sf -X POST '$API/events' -H 'Content-Type: application/json' -d '{\"type\":\"mission.completed\",\"source\":\"echo\",\"mission_id\":\"$MISSION_ID\",\"message\":\"ECHO mission complete\"}'
curl -sf -X PATCH '$API/missions/$MISSION_ID' -H 'Content-Type: application/json' -d '{\"status\":\"completed\"}'
"
    ;;
  mammon)
    PROMPT="You are MAMMON, the financial general of the Dominion. Your mission: $TITLE
Description: $DESC

Use exec with curl to fetch BTC prices from CoinGecko, calculate portfolio metrics. Reference the Investment Master Plan v2.0 at /data/workspace/dominion/reports/investment-masterplan-v2.md if it exists (read it with the Read tool). Provide concrete numbers and actionable financial analysis.

Save your report to $REPORT_FILE

After saving the report, use exec to run:
curl -sf -X POST '$API/events' -H 'Content-Type: application/json' -d '{\"type\":\"mission.completed\",\"source\":\"mammon\",\"mission_id\":\"$MISSION_ID\",\"message\":\"MAMMON mission complete\"}'
curl -sf -X PATCH '$API/missions/$MISSION_ID' -H 'Content-Type: application/json' -d '{\"status\":\"completed\"}'
"
    ;;
  wraith-eye|wraith_eye|wraithEye)
    PROMPT="You are WRAITH-EYE, the infrastructure general of the Dominion. Your mission: $TITLE
Description: $DESC

Use exec to check API health, response times, SSL status, disk usage. Monitor all Dominion services. Test $API endpoints. Check response codes, latency, and uptime indicators.

Save your report to $REPORT_FILE

After saving the report, use exec to run:
curl -sf -X POST '$API/events' -H 'Content-Type: application/json' -d '{\"type\":\"mission.completed\",\"source\":\"wraith-eye\",\"mission_id\":\"$MISSION_ID\",\"message\":\"WRAITH-EYE mission complete\"}'
curl -sf -X PATCH '$API/missions/$MISSION_ID' -H 'Content-Type: application/json' -d '{\"status\":\"completed\"}'
"
    ;;
  *)
    PROMPT="You are a Dominion agent ($AGENT_ID). Your mission: $TITLE
Description: $DESC

Complete this mission using available tools (web_search, web_fetch, exec). Be thorough and produce a quality report.

Save your report to $REPORT_FILE

After saving the report, use exec to run:
curl -sf -X POST '$API/events' -H 'Content-Type: application/json' -d '{\"type\":\"mission.completed\",\"source\":\"$AGENT_ID\",\"mission_id\":\"$MISSION_ID\",\"message\":\"Mission complete\"}'
curl -sf -X PATCH '$API/missions/$MISSION_ID' -H 'Content-Type: application/json' -d '{\"status\":\"completed\"}'
"
    ;;
esac

# Write prompt file
echo "$PROMPT" > "$PROMPT_FILE"
log "Prompt written to $PROMPT_FILE"

# Create trigger file for THRONE heartbeat to pick up
cat > "$TRIGGERS_DIR/${MISSION_ID}.trigger" <<EOF
MISSION_ID=$MISSION_ID
AGENT_ID=$AGENT_ID
TITLE=$TITLE
PROMPT_FILE=$PROMPT_FILE
CREATED=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

log "Trigger created: $TRIGGERS_DIR/${MISSION_ID}.trigger"
log "Done — awaiting sub-agent spawn via THRONE heartbeat"
