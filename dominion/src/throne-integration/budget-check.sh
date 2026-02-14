#!/usr/bin/env bash
set -euo pipefail

# budget-check.sh — Check daily costs and alert if thresholds exceeded

API="https://dominion-api-production.up.railway.app/api"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

log() { echo "[$(date -u +%H:%M:%S)] budget-check: $*"; }

log "Fetching daily costs..."
COSTS_RAW=$(curl -sf "$API/costs/daily" 2>/dev/null || echo "null")

TOTAL=$(python3 -c "
import json, sys
try:
    data = json.loads('''$COSTS_RAW''')
    if data is None or data == 'null':
        print('0')
        sys.exit()
    if isinstance(data, list):
        total = sum(float(e.get('cost', e.get('cost_usd', e.get('total', 0))) or 0) for e in data)
    elif isinstance(data, dict):
        items = data.get('data', data.get('costs', data.get('agents', [])))
        if isinstance(items, list):
            total = sum(float(e.get('cost', e.get('cost_usd', e.get('total', 0))) or 0) for e in items)
        elif isinstance(items, (int, float)):
            total = float(items)
        else:
            total = float(data.get('total', data.get('cost', 0)) or 0)
    else:
        total = 0
    print(f'{total:.4f}')
except Exception as e:
    print('0', file=sys.stdout)
    print(f'Error: {e}', file=sys.stderr)
" 2>/dev/null || echo "0")

log "Daily total cost: \$$TOTAL"

# Determine alert level
ALERT_LEVEL=$(python3 -c "
t = float('$TOTAL')
if t > 10: print('CRITICAL')
elif t > 5: print('WARNING')
else: print('OK')
")

if [ "$ALERT_LEVEL" = "CRITICAL" ]; then
  log "🚨 CRITICAL: Daily costs exceed \$10!"
  bash "$SCRIPT_DIR/notify.sh" \
    --type budget-warning \
    --priority high \
    --message "🚨 CRITICAL: Daily costs at \$$TOTAL (threshold: \$10). Immediate review needed!"
elif [ "$ALERT_LEVEL" = "WARNING" ]; then
  log "⚠️ WARNING: Daily costs exceed \$5"
  bash "$SCRIPT_DIR/notify.sh" \
    --type budget-warning \
    --priority normal \
    --message "⚠️ Daily costs at \$$TOTAL (threshold: \$5). Monitor spending."
else
  log "✅ Costs within budget"
fi

# Log event
curl -sf -X POST "$API/events" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"budget_check\",\"source\":\"throne\",\"data\":{\"daily_total\":$TOTAL,\"alert_level\":\"$ALERT_LEVEL\"},\"message\":\"Budget check: \$$TOTAL/day — $ALERT_LEVEL\"}" >/dev/null 2>&1 || log "WARNING: Failed to log event"

log "Done."
