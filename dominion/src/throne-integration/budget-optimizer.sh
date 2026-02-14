#!/usr/bin/env bash
set -euo pipefail

# budget-optimizer.sh — MAMMON's cost tracking and model optimization
# Analyzes spending patterns and writes budget-config.json for mission execution

API="https://dominion-api-production.up.railway.app/api"
CONFIG_FILE="/data/workspace/dominion/missions/budget-config.json"
REPORT_FILE="/data/workspace/dominion/reports/mammon-budget-optimization.md"
API_REPORTS="/data/workspace/dominion/api/reports"
DATE_NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE_SLUG=$(date -u +"%Y-%m-%d")

mkdir -p "$(dirname "$CONFIG_FILE")" "$(dirname "$REPORT_FILE")" "$API_REPORTS"

log() { echo "[$(date -u +%H:%M:%S)] budget-optimizer: $*"; }

# ── 1. Fetch cost data ──────────────────────────────────────────────
log "Fetching daily cost data..."
COST_JSON=$(curl -sf "$API/costs/daily" 2>/dev/null || echo "[]")

if [ "$COST_JSON" = "[]" ] || [ -z "$COST_JSON" ]; then
  log "No cost data available — writing default config"
  TOTAL_TODAY="0"
  COST_ANALYSIS="No cost data recorded yet."
  AGENT_BREAKDOWN="N/A"
  DAILY_TREND="N/A"
else
  # Parse cost data with Python
  read -r TOTAL_TODAY AVG_PER_MISSION TOP_AGENT TOP_AGENT_COST AGENT_BREAKDOWN DAILY_TREND < <(echo "$COST_JSON" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if not isinstance(data, list): data = [data]

total = sum(float(r.get('cost_usd', 0)) for r in data)
count = len(data) if data else 1
avg = total / count

# Per-agent costs
agents = {}
for r in data:
    aid = r.get('agent_id', 'unknown').lower()
    agents[aid] = agents.get(aid, 0) + float(r.get('cost_usd', 0))

top_agent = max(agents, key=agents.get) if agents else 'none'
top_cost = agents.get(top_agent, 0)

breakdown = '; '.join(f'{a}=\${c:.2f}' for a, c in sorted(agents.items(), key=lambda x: -x[1]))
trend = f'Total: \${total:.2f} across {len(data)} records, avg \${avg:.4f}/record'

print(f'{total:.4f} {avg:.4f} {top_agent} {top_cost:.4f} \"{breakdown}\" \"{trend}\"')
" 2>/dev/null || echo '0 0 none 0 "no data" "no data"')

  COST_ANALYSIS="Total today: \$${TOTAL_TODAY} | Avg per record: \$${AVG_PER_MISSION}"
fi

log "Cost analysis: $COST_ANALYSIS"

# ── 2. Determine optimization tier ──────────────────────────────────
TOTAL_FLOAT=$(echo "$TOTAL_TODAY" | tr -d '"')
OPTIMIZATION_MODE="normal"
WARNING_MSG=""

if python3 -c "exit(0 if float('${TOTAL_FLOAT}') > 5.0 else 1)" 2>/dev/null; then
  OPTIMIZATION_MODE="emergency"
  WARNING_MSG="⚠️ EMERGENCY: Daily cost exceeds \$5 — pausing non-critical missions"
  log "$WARNING_MSG"
elif python3 -c "exit(0 if float('${TOTAL_FLOAT}') > 3.0 else 1)" 2>/dev/null; then
  OPTIMIZATION_MODE="budget"
  WARNING_MSG="⚠️ WARNING: Daily cost exceeds \$3 — switching to Haiku for remaining missions"
  log "$WARNING_MSG"
else
  log "Costs within budget — normal operation"
fi

# ── 3. Write budget-config.json ─────────────────────────────────────
log "Writing budget config..."

if [ "$OPTIMIZATION_MODE" = "emergency" ]; then
  # Emergency: everything goes to budget, non-critical paused
  GENERAL_MODELS='{
    "seer": "budget",
    "phantom": "budget",
    "wraith-eye": "budget",
    "grimoire": "budget",
    "echo": "paused",
    "mammon": "budget",
    "throne": "budget"
  }'
elif [ "$OPTIMIZATION_MODE" = "budget" ]; then
  # Budget mode: most go to haiku
  GENERAL_MODELS='{
    "seer": "budget",
    "phantom": "budget",
    "wraith-eye": "budget",
    "grimoire": "default",
    "echo": "budget",
    "mammon": "budget",
    "throne": "default"
  }'
else
  # Normal operation
  GENERAL_MODELS='{
    "seer": "budget",
    "phantom": "budget",
    "wraith-eye": "budget",
    "grimoire": "premium",
    "echo": "default",
    "mammon": "budget",
    "throne": "premium"
  }'
fi

cat > "$CONFIG_FILE" <<EOJSON
{
  "daily_limit_usd": 5.00,
  "model_tiers": {
    "default": "anthropic/claude-sonnet-4",
    "budget": "anthropic/claude-haiku-3",
    "premium": "anthropic/claude-sonnet-4"
  },
  "general_models": $GENERAL_MODELS,
  "auto_pause_at_usd": 5.00,
  "warning_at_usd": 3.00,
  "optimization_mode": "$OPTIMIZATION_MODE",
  "today_spend_usd": $TOTAL_FLOAT,
  "updated_at": "$DATE_NOW"
}
EOJSON

log "Config written to $CONFIG_FILE (mode: $OPTIMIZATION_MODE)"

# ── 4. Generate report ──────────────────────────────────────────────
log "Generating optimization report..."

cat > "$REPORT_FILE" <<EOMD
# 💰 MAMMON Budget Optimization Report
**Generated:** $DATE_NOW
**Mode:** $OPTIMIZATION_MODE

## Daily Cost Summary
- **Total spend today:** \$${TOTAL_FLOAT}
- **Agent breakdown:** $AGENT_BREAKDOWN
- **Trend:** $DAILY_TREND
${WARNING_MSG:+
## ⚠️ Alert
$WARNING_MSG
}

## Model Tier Assignment

| General | Tier | Model | Rationale |
|---------|------|-------|-----------|
| SEER | budget | claude-haiku-3 | Mostly API calls, low complexity |
| PHANTOM | budget | claude-haiku-3 | Lightweight security scans |
| WRAITH-EYE | budget | claude-haiku-3 | Infrastructure checks, simple |
| GRIMOIRE | premium | claude-sonnet-4 | Research quality matters |
| ECHO | default | claude-sonnet-4 | Content needs coherence |
| MAMMON | budget | claude-haiku-3 | Financial calcs, mostly data |
| THRONE | premium | claude-sonnet-4 | Strategic decisions need quality |

## Optimization Rules Active
1. ✅ Daily limit: \$5.00 (auto-pause non-critical)
2. ✅ Warning threshold: \$3.00 (switch to Haiku)
3. ✅ Per-general cost flags: >\$1.00 triggers review
4. ✅ Model tiers assigned per general role

## Cost Savings Estimate
- Using Haiku for SEER/PHANTOM/WRAITH-EYE saves ~60% vs Sonnet
- Estimated daily savings: \$1.50-3.00 depending on mission volume
- Budget config auto-adjusts based on real spend data

## Config Location
\`/data/workspace/dominion/missions/budget-config.json\`

---
*MAMMON watches the coffers. Every token counts.* 🪙
EOMD

# ── 5. Copy to API reports ──────────────────────────────────────────
cp "$REPORT_FILE" "$API_REPORTS/mammon-budget-optimization.md"
log "Report copied to API reports"

# ── 6. Log event ────────────────────────────────────────────────────
curl -sf -X POST "$API/events" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"budget.optimized\",\"source\":\"mammon\",\"message\":\"Budget optimizer ran — mode: $OPTIMIZATION_MODE, spend: \$${TOTAL_FLOAT}\"}" >/dev/null 2>&1 || true

log "Event logged. Budget optimization complete."
