#!/usr/bin/env bash
set -euo pipefail

# collaboration-chains.sh — Cross-general collaboration chains
# When a mission completes, check if it should trigger follow-up missions for other generals.

API="https://dominion-api-production.up.railway.app/api"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPORTS_DIR="/data/workspace/dominion/reports"
STATE_FILE="/data/workspace/dominion/missions/chain-state.json"

log() { echo "[$(date -u +%H:%M:%S)] collab-chains: $*"; }

# Initialize state file if missing
if [ ! -f "$STATE_FILE" ]; then
  echo '{"processed_missions":[],"last_run":""}' > "$STATE_FILE"
fi

# --- Fetch recently completed missions ---
log "Fetching completed missions..."
COMPLETED=$(curl -sf "$API/missions?status=completed" 2>/dev/null || echo "[]")

# --- Analyze and produce chain actions ---
CHAIN_ACTIONS=$(export COMPLETED_JSON="$COMPLETED" STATE_FILE="$STATE_FILE" REPORTS_DIR="$REPORTS_DIR"; python3 << 'PYEOF'
import json, os, glob, re
from datetime import datetime, timezone

data_raw = os.environ.get("COMPLETED_JSON", "[]")
STATE_PATH = os.environ["STATE_FILE"]
REPORTS = os.environ["REPORTS_DIR"]

try:
    data = json.loads(data_raw)
    missions = data if isinstance(data, list) else data.get("data", data.get("missions", []))
except:
    missions = []

try:
    with open(STATE_PATH) as f:
        state = json.load(f)
except:
    state = {"processed_missions": [], "last_run": ""}

processed = set(state.get("processed_missions", []))
actions = []

def find_report(m):
    mid = m.get("id", "")
    agent = (m.get("agent_id", m.get("agentId", "")) or "").lower()
    today = datetime.now().strftime("%Y-%m-%d")
    for f in glob.glob(os.path.join(REPORTS, "*.md")):
        bn = os.path.basename(f).lower()
        if mid and mid[:8] in bn:
            return f
    for f in glob.glob(os.path.join(REPORTS, "*.md")):
        bn = os.path.basename(f).lower()
        if agent and agent in bn and today in bn:
            return f
    return None

def read_report(path):
    if not path: return ""
    try:
        with open(path) as f: return f.read()[:5000]
    except: return ""

for m in missions:
    mid = str(m.get("id", ""))
    if not mid or mid in processed:
        continue
    
    agent = (m.get("agent_id", m.get("agentId", "")) or "").upper()
    title = m.get("title", "")
    desc = m.get("description", "")
    report = read_report(find_report(m))
    combined = (title + " " + desc + " " + report).lower()

    # Rule 1: SEER BTC sentiment → MAMMON
    if agent == "SEER" and ("btc" in combined or "bitcoin" in combined):
        if "bullish" in combined or "bear" in combined:
            s = "bullish" if "bullish" in combined else "bearish"
            actions.append({"type":"proposal","agent":"mammon","title":f"Portfolio impact — BTC {s} signal from SEER","description":f"SEER [{mid[:8]}] detected {s} BTC signal. Assess portfolio exposure. Original: {title[:100]}","chain_rule":"seer-btc-sentiment→mammon","source_mission":mid})

    # Rule 2: SEER BTC >5% → ECHO
    if agent == "SEER" and ("btc" in combined or "bitcoin" in combined):
        pcts = re.findall(r'(\d+(?:\.\d+)?)\s*%', combined)
        if any(float(p) >= 5 for p in pcts) if pcts else False:
            actions.append({"type":"proposal","agent":"echo","title":"Draft BTC market summary for ETHJKT community","description":f"SEER detected BTC >5% move. Draft community summary. Source: [{mid[:8]}]","chain_rule":"seer-btc-move→echo","source_mission":mid})

    # Rule 3: GRIMOIRE research → ECHO content
    if agent == "GRIMOIRE" and ("eip" in combined or "ethereum improvement" in combined or "research" in combined):
        actions.append({"type":"proposal","agent":"echo","title":"Create content about GRIMOIRE research findings","description":f"GRIMOIRE completed [{mid[:8]}]: {title[:120]}. Draft thread explaining key findings.","chain_rule":"grimoire-research→echo","source_mission":mid})

    # Rule 4: PHANTOM security → WRAITH-EYE
    if agent == "PHANTOM" and ("fail" in combined or "vulnerability" in combined or "critical" in combined):
        actions.append({"type":"proposal","agent":"wraith-eye","title":"Deep monitoring — security issue from PHANTOM","description":f"PHANTOM [{mid[:8]}] found security concerns. Initiate deep monitoring. Original: {title[:100]}","chain_rule":"phantom-security→wraith-eye","source_mission":mid})

    # Rule 5: MAMMON budget warning → pause all
    if agent == "MAMMON" and ("budget warning" in combined or "overspend" in combined or "cost alert" in combined):
        actions.append({"type":"pause","agent":"all","title":"Budget warning — reduce activity","description":f"MAMMON [{mid[:8]}] raised budget warning. Pause non-essential proposals.","chain_rule":"mammon-budget→pause-all","source_mission":mid})

    processed.add(mid)

state["processed_missions"] = list(processed)[-500:]
state["last_run"] = datetime.now(timezone.utc).isoformat()
with open(STATE_PATH, "w") as f:
    json.dump(state, f, indent=2)

print(json.dumps(actions))
PYEOF
)

log "Chain analysis: $CHAIN_ACTIONS"

# --- Process chain actions ---
ACTION_COUNT=$(echo "$CHAIN_ACTIONS" | python3 -c "import sys,json; print(len(json.loads(sys.stdin.read())))" 2>/dev/null || echo 0)

if [ "$ACTION_COUNT" -gt 0 ]; then
  log "Processing $ACTION_COUNT chain triggers..."
  TRIGGERED=0
  
  echo "$CHAIN_ACTIONS" | python3 -c "
import sys, json
for a in json.loads(sys.stdin.read()):
    print(a['type']+'|'+a['agent']+'|'+a['title']+'|'+a['description']+'|'+a['chain_rule']+'|'+a['source_mission'])
" | while IFS='|' read -r type agent title desc chain_rule source_mid; do
    [ -z "$type" ] && continue
    
    if [ "$type" = "proposal" ]; then
      log "CHAIN: $chain_rule → proposal for $agent"
      # Escape quotes for JSON
      title_esc=$(echo "$title" | sed 's/"/\\"/g')
      desc_esc=$(echo "$desc" | sed 's/"/\\"/g')
      curl -sf -X POST "$API/proposals" \
        -H "Content-Type: application/json" \
        -d "{\"agent_id\":\"$agent\",\"title\":\"$title_esc\",\"description\":\"$desc_esc\",\"estimatedCost\":0.5,\"source\":\"collaboration-chain\",\"chain_rule\":\"$chain_rule\",\"source_mission\":\"$source_mid\"}" >/dev/null 2>&1 && log "  Created." || log "  ERROR: Failed to create proposal"
    elif [ "$type" = "pause" ]; then
      log "CHAIN: $chain_rule → PAUSE ALL GENERALS"
      curl -sf -X POST "$API/events" \
        -H "Content-Type: application/json" \
        -d "{\"type\":\"budget_pause\",\"source\":\"collaboration-chain\",\"data\":{\"chain_rule\":\"$chain_rule\",\"source_mission\":\"$source_mid\"},\"message\":\"Budget warning: all generals reduce activity\"}" >/dev/null 2>&1 || true
    fi
  done
  
  # Log summary event
  curl -sf -X POST "$API/events" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"collaboration_chain\",\"source\":\"throne\",\"data\":{\"triggers\":$ACTION_COUNT},\"message\":\"Collaboration chains: $ACTION_COUNT follow-up triggers\"}" >/dev/null 2>&1 || true
else
  log "No chain triggers found."
fi

log "Done."
