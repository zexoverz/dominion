#!/usr/bin/env bash
# DOMINION Daily Morning Briefing
# Generates a concise summary and queues it as a Telegram notification
set -euo pipefail

API_BASE="https://dominion-api-production.up.railway.app/api"
NOTIF_DIR="/data/workspace/dominion/notifications"
mkdir -p "$NOTIF_DIR"

TODAY=$(date -u +"%b %d, %Y")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
NOTIF_FILE="$NOTIF_DIR/briefing-$(date -u +%Y-%m-%d).json"

# --- 1. BTC Price + 24h change from CoinGecko ---
BTC_DATA=$(curl -sf "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true" 2>/dev/null || echo '{}')
BTC_PRICE=$(echo "$BTC_DATA" | jq -r '.bitcoin.usd // "N/A"')
BTC_CHANGE=$(echo "$BTC_DATA" | jq -r '.bitcoin.usd_24h_change // "0"')

if [ "$BTC_PRICE" != "N/A" ] && [ "$BTC_PRICE" != "null" ]; then
  BTC_PRICE_FMT=$(printf "%'.0f" "$BTC_PRICE" 2>/dev/null || echo "$BTC_PRICE")
  BTC_CHANGE_FMT=$(printf "%+.2f" "$BTC_CHANGE" 2>/dev/null || echo "$BTC_CHANGE")
  
  # ATH and drawdown calc
  ATH=109000
  DRAWDOWN=$(echo "scale=1; ($BTC_PRICE - $ATH) / $ATH * 100" | bc 2>/dev/null || echo "N/A")
  ATH_FMT=$(printf "%'.0f" "$ATH")
  
  BTC_LINE="📊 BTC: \$${BTC_PRICE_FMT} (${BTC_CHANGE_FMT}%)"
  
  if [ "$DRAWDOWN" != "N/A" ]; then
    DRAWDOWN_LINE="🎯 Drawdown: ${DRAWDOWN}% from ATH (\$${ATH_FMT})"
    # War chest trigger check
    DRAWDOWN_ABS=$(echo "$DRAWDOWN" | tr -d '-')
    WAR_CHEST=""
    if (( $(echo "$DRAWDOWN_ABS >= 40" | bc -l 2>/dev/null || echo 0) )); then
      WAR_CHEST=$'\n⚠️ WAR CHEST: -40% trigger active'
    fi
  else
    DRAWDOWN_LINE=""
    WAR_CHEST=""
  fi
else
  BTC_LINE="📊 BTC: unavailable"
  DRAWDOWN_LINE=""
  WAR_CHEST=""
fi

# --- 2. Fear & Greed Index ---
FNG_DATA=$(curl -sf "https://api.alternative.me/fng/?limit=1" 2>/dev/null || echo '{}')
FNG_VALUE=$(echo "$FNG_DATA" | jq -r '.data[0].value // "N/A"')
FNG_CLASS=$(echo "$FNG_DATA" | jq -r '.data[0].value_classification // "N/A"')

if [ "$FNG_VALUE" != "N/A" ] && [ "$FNG_VALUE" != "null" ]; then
  BTC_LINE="${BTC_LINE} | F&G: ${FNG_VALUE} (${FNG_CLASS})"
fi

# --- 3. Pending proposals ---
PROPOSALS_DATA=$(curl -sf "${API_BASE}/proposals?status=pending" 2>/dev/null || echo '[]')
PROPOSALS_COUNT=$(echo "$PROPOSALS_DATA" | jq 'if type == "array" then length elif .data? then (.data | length) elif .count? then .count else 0 end' 2>/dev/null || echo "0")

# --- 4. Active missions ---
MISSIONS_DATA=$(curl -sf "${API_BASE}/missions?status=active" 2>/dev/null || echo '[]')
ACTIVE_MISSIONS=$(echo "$MISSIONS_DATA" | jq 'if type == "array" then length elif .data? then (.data | length) elif .count? then .count else 0 end' 2>/dev/null || echo "0")

COMPLETED_DATA=$(curl -sf "${API_BASE}/missions?status=completed" 2>/dev/null || echo '[]')
COMPLETED_MISSIONS=$(echo "$COMPLETED_DATA" | jq 'if type == "array" then length elif .data? then (.data | length) elif .count? then .count else 0 end' 2>/dev/null || echo "0")

# --- 5. Today's cost ---
COST_DATA=$(curl -sf "${API_BASE}/costs/daily" 2>/dev/null || echo '{}')
DAILY_COST=$(echo "$COST_DATA" | jq -r '.total // .cost // .amount // "0.00"' 2>/dev/null || echo "0.00")

# --- 6. Recent events ---
EVENTS_DATA=$(curl -sf "${API_BASE}/events" 2>/dev/null || echo '[]')
EVENTS_COUNT=$(echo "$EVENTS_DATA" | jq 'if type == "array" then length elif .data? then (.data | length) elif .count? then .count else 0 end' 2>/dev/null || echo "0")

# --- 7. System health ---
HEALTH_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "${API_BASE}/../" 2>/dev/null || echo "000")
if [ "$HEALTH_STATUS" = "200" ] || [ "$HEALTH_STATUS" = "301" ] || [ "$HEALTH_STATUS" = "302" ]; then
  SYSTEM_STATUS="ALL HEALTHY"
else
  SYSTEM_STATUS="DEGRADED (HTTP ${HEALTH_STATUS})"
fi

# --- 8. Days until wedding (Nov 2026) ---
WEDDING_DATE="2026-11-01"
TODAY_EPOCH=$(date -u +%s)
WEDDING_EPOCH=$(date -u -d "$WEDDING_DATE" +%s 2>/dev/null || echo "0")
if [ "$WEDDING_EPOCH" != "0" ]; then
  DAYS_UNTIL=$(( (WEDDING_EPOCH - TODAY_EPOCH) / 86400 ))
  WEDDING_LINE="💒 Wedding: ${DAYS_UNTIL} days away"
else
  WEDDING_LINE="💒 Wedding: Nov 2026"
fi

# --- Build message ---
MSG="👑 DOMINION DAILY BRIEFING — ${TODAY}

${BTC_LINE}
${DRAWDOWN_LINE}${WAR_CHEST}

⚔️ Missions: ${ACTIVE_MISSIONS} active | ${COMPLETED_MISSIONS} completed
📋 Proposals: ${PROPOSALS_COUNT} pending review
💰 Today's cost: \$${DAILY_COST}
⚡ Events: ${EVENTS_COUNT} logged

🏗️ System: ${SYSTEM_STATUS}
${WEDDING_LINE}

Have a productive day, Lord Zexo 👑"

# Clean up empty lines from missing sections
MSG=$(echo "$MSG" | sed '/^$/N;/^\n$/d')

echo "$MSG"

# --- 9. Queue notification ---
cat > "$NOTIF_FILE" <<EOF
{
  "type": "daily-briefing",
  "channel": "telegram",
  "recipient": "faisal",
  "timestamp": "${TIMESTAMP}",
  "message": $(echo "$MSG" | jq -Rs .)
}
EOF

echo ""
echo "✅ Notification queued: $NOTIF_FILE"

# --- 10. Log event to API ---
curl -sf -X POST "${API_BASE}/events" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"daily-briefing\",\"source\":\"throne\",\"timestamp\":\"${TIMESTAMP}\",\"data\":{\"btc_price\":\"${BTC_PRICE}\"}}" \
  >/dev/null 2>&1 || true

echo "✅ Event logged to API"
