#!/usr/bin/env bash
# MAMMON Weekly Financial Tracker
# Reads from portfolio-snapshot.json (single source of truth)
# THRONE updates the snapshot; this script just reads it.
set -euo pipefail

DOMINION_DIR="/data/workspace/dominion"
TODAY=$(date -u +%Y-%m-%d)
REPORT_FILE="$DOMINION_DIR/reports/mammon-weekly-${TODAY}.md"
API_REPORT_DIR="$DOMINION_DIR/api/reports"
NOTIF_DIR="$DOMINION_DIR/notifications"
API_URL="https://dominion-api-production.up.railway.app/api/events"
SNAPSHOT="$DOMINION_DIR/config/portfolio-snapshot.json"

# ── Load from snapshot ──
if [ ! -f "$SNAPSHOT" ]; then
    echo "❌ portfolio-snapshot.json not found! THRONE must create it."
    exit 1
fi

echo "📂 Loading portfolio snapshot..."

# Parse snapshot safely (write to temp file to avoid eval issues with special chars)
SNAP_VARS=$(python3 -c "
import json, shlex
s = json.load(open('${SNAPSHOT}'))
dca_key = '$(date +%B_%Y | tr A-Z a-z)'
dca_st = s['dca'].get(dca_key, s['dca'].get('march_2026', 'unknown'))
pairs = [
    ('ACTUAL_BTC', s['btc']['holdings']),
    ('BTC_ATH', s['btc']['ath_usd']),
    ('BTC_TARGET', s['btc']['target_2030']),
    ('WEDDING_FUND', s['wedding']['fund_idr']),
    ('WEDDING_TARGET', s['wedding']['target_idr']),
    ('MONTHLY_WEDDING', s['wedding']['monthly_idr']),
    ('WAR_CHEST', s['war_chest']['total_idr']),
    ('WAR_DEPLOYED', s['war_chest']['deployed_idr']),
    ('WAR_REMAINING', s['war_chest']['remaining_idr']),
    ('MONTHLY_DCA', s['dca']['monthly_idr']),
    ('DCA_STATUS', dca_st),
    ('SNAPSHOT_DATE', s['last_updated']),
    ('GOLD_NOTE', s['notes']['gold']),
    ('LEBARAN_NOTE', s['notes']['lebaran']),
]
for k, v in pairs:
    print(f'{k}={shlex.quote(str(v))}')
")
eval "$SNAP_VARS"

echo "  BTC: ${ACTUAL_BTC} | Wedding: Rp ${WEDDING_FUND} | War Chest: Rp ${WAR_CHEST}"

# --- 1. Fetch BTC price ---
echo "⚡ Fetching BTC price..."
BTC_JSON=$(curl -sf "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,idr&include_24hr_change=true" 2>/dev/null || echo '{}')
BTC_USD=$(echo "$BTC_JSON" | grep -o '"usd":[0-9.]*' | head -1 | cut -d: -f2 || true)
BTC_IDR=$(echo "$BTC_JSON" | grep -o '"idr":[0-9.]*' | head -1 | cut -d: -f2 || true)
BTC_24H=$(echo "$BTC_JSON" | grep -o '"usd_24h_change":[0-9.-]*' | head -1 | cut -d: -f2 || true)

if [ -z "$BTC_USD" ]; then
  BTC_USD=68000
  BTC_IDR=1115000000
  BTC_24H="0.0"
  PRICE_NOTE="(fallback — API unavailable)"
else
  PRICE_NOTE=""
fi

BTC_USD_INT=${BTC_USD%.*}
BTC_IDR_INT=${BTC_IDR%.*}

# --- 2. Drawdown from ATH ---
DRAWDOWN=$(awk "BEGIN { printf \"%.1f\", (1 - $BTC_USD / $BTC_ATH) * 100 }")
DRAWDOWN_NEG="-${DRAWDOWN}%"
if awk "BEGIN { exit ($DRAWDOWN < 0) ? 0 : 1 }"; then
  DRAWDOWN_NEG="NEW ATH TERRITORY"
  DRAWDOWN="0"
fi

# --- 3. War chest triggers ---
TRIGGER_30=$(awk "BEGIN { printf \"%.0f\", $BTC_ATH * 0.70 }")
TRIGGER_40=$(awk "BEGIN { printf \"%.0f\", $BTC_ATH * 0.60 }")
TRIGGER_50=$(awk "BEGIN { printf \"%.0f\", $BTC_ATH * 0.50 }")

WAR_STATUS="🟢 HOLD — No deployment needed"
DEPLOY_PCT=0
if awk "BEGIN { exit ($BTC_USD <= $TRIGGER_50) ? 0 : 1 }"; then
  WAR_STATUS="🔴 FULL DEPLOY (100%) — BTC below -50% from ATH!"
  DEPLOY_PCT=100
elif awk "BEGIN { exit ($BTC_USD <= $TRIGGER_40) ? 0 : 1 }"; then
  WAR_STATUS="🟠 DEPLOY 50% — BTC below -40% from ATH"
  DEPLOY_PCT=50
elif awk "BEGIN { exit ($BTC_USD <= $TRIGGER_30) ? 0 : 1 }"; then
  WAR_STATUS="🟡 DEPLOY 25% — BTC below -30% from ATH"
  DEPLOY_PCT=25
fi

# --- 4. Portfolio value ---
PORTFOLIO_USD=$(awk "BEGIN { printf \"%.0f\", $ACTUAL_BTC * $BTC_USD }")
PORTFOLIO_IDR=$(awk "BEGIN { printf \"%.0f\", $ACTUAL_BTC * $BTC_IDR_INT }")
BTC_PROGRESS=$(awk "BEGIN { printf \"%.1f\", ($ACTUAL_BTC / $BTC_TARGET) * 100 }")

# --- 5. Wedding fund progress ---
WEDDING_PCT=$(awk "BEGIN { printf \"%.0f\", ($WEDDING_FUND / $WEDDING_TARGET) * 100 }")
WEDDING_REMAINING_AMT=$(( WEDDING_TARGET - WEDDING_FUND ))
WEDDING_DATE="2026-11-01"
WEDDING_EPOCH=$(date -d "$WEDDING_DATE" +%s 2>/dev/null || date -u -d "$WEDDING_DATE" +%s)
NOW_EPOCH=$(date -u +%s)
WEEKS_LEFT=$(( (WEDDING_EPOCH - NOW_EPOCH) / 604800 ))
MONTHS_LEFT=$(( (WEDDING_EPOCH - NOW_EPOCH) / 2592000 ))

# Progress bars (20 chars)
make_bar() {
  local pct=$1
  local filled=$(( pct / 5 ))
  [ "$filled" -gt 20 ] && filled=20
  local empty=$(( 20 - filled ))
  printf '█%.0s' $(seq 1 $filled 2>/dev/null || echo)
  printf '░%.0s' $(seq 1 $empty 2>/dev/null || echo)
}
WEDDING_BAR=$(make_bar $WEDDING_PCT)
BTC_BAR=$(make_bar ${BTC_PROGRESS%.*})

# Stack growth
STACK_GROWTH=$(awk "BEGIN { printf \"%.0f\", (($ACTUAL_BTC - 0.07) / 0.07) * 100 }")

# Format numbers
fmt_idr() {
  echo "$1" | rev | sed 's/.\{3\}/&./g' | rev | sed 's/^\.//'
}
fmt_usd() {
  printf "%'d" "$1" 2>/dev/null || echo "$1"
}

WEDDING_FUND_FMT=$(fmt_idr $WEDDING_FUND)
WEDDING_REM_FMT=$(fmt_idr $WEDDING_REMAINING_AMT)
WAR_CHEST_FMT=$(fmt_idr $WAR_CHEST)
PORTFOLIO_USD_FMT=$(fmt_usd $PORTFOLIO_USD)
BTC_USD_FMT=$(fmt_usd $BTC_USD_INT)

# DCA status for current month
CURRENT_MONTH=$(date +%B | tr A-Z a-z)
DCA_STATUS_LINE="📊 March DCA: ${DCA_STATUS}"

# --- 6. Generate report ---
cat > "$REPORT_FILE" << REPORT
# 👑 MAMMON Weekly Finance Report — ${TODAY}

₿ **BTC: \$${BTC_USD_FMT}** (24h: ${BTC_24H}% | ${DRAWDOWN_NEG} from ATH) ${PRICE_NOTE}

---

## 📊 Stack Status

| Metric | Value |
|--------|-------|
| **Total BTC** | **${ACTUAL_BTC} BTC** |
| Portfolio (USD) | \$${PORTFOLIO_USD_FMT} |
| Stack Growth (from 0.07) | +${STACK_GROWTH}% |
| 5 BTC Target | ${BTC_PROGRESS}% |
| Data as of | ${SNAPSHOT_DATE} |

\`\`\`
[${BTC_BAR}] ${BTC_PROGRESS}% to 5 BTC
\`\`\`

${DCA_STATUS_LINE}

---

## 💒 Wedding Fund

| Metric | Value |
|--------|-------|
| Current | Rp ${WEDDING_FUND_FMT} |
| Target | Rp 350.000.000 |
| Remaining | Rp ${WEDDING_REM_FMT} |
| Progress | ${WEDDING_PCT}% |
| Weeks Left | ${WEEKS_LEFT} |

\`\`\`
[${WEDDING_BAR}] ${WEDDING_PCT}%
\`\`\`

$(if [ "$MONTHS_LEFT" -gt 0 ]; then
  MONTHLY_NEEDED=$(awk "BEGIN { printf \"%.0f\", $WEDDING_REMAINING_AMT / $MONTHS_LEFT }")
  MONTHLY_NEEDED_FMT=$(fmt_idr $MONTHLY_NEEDED)
  echo "Need Rp ${MONTHLY_NEEDED_FMT}/mo to hit target. Currently doing Rp 30M/mo — $([ "$MONTHLY_NEEDED" -le 30000000 ] && echo '✅ ON TRACK' || echo '⚠️ NEED TO INCREASE')"
fi)

---

## ⚔️ War Chest

| Metric | Value |
|--------|-------|
| Total | Rp ${WAR_CHEST_FMT} |
| Note | ${LEBARAN_NOTE} |

**Triggers (based on \$${BTC_ATH} ATH):**
| Level | Price | Status |
|-------|-------|--------|
| -30% | \$${TRIGGER_30} | $([ "$DEPLOY_PCT" -ge 25 ] && echo "🟡 TRIGGERED" || echo "⬜ Waiting") |
| -40% | \$${TRIGGER_40} | $([ "$DEPLOY_PCT" -ge 50 ] && echo "🟠 TRIGGERED" || echo "⬜ Waiting") |
| -50% | \$${TRIGGER_50} | $([ "$DEPLOY_PCT" -ge 100 ] && echo "🔴 TRIGGERED" || echo "⬜ Waiting") |

**${WAR_STATUS}**

---

## 🔥 Reminders

- 🪙 Gold: ${GOLD_NOTE}
- 🤲 Lebaran: ${LEBARAN_NOTE}
- 💎 No altcoins. Ever. Stack sats.
- 🔥 Fire Sale Theory: be the buyer when AI kills the middle class

---

*MAMMON 💰 — Data from portfolio-snapshot.json (${SNAPSHOT_DATE})*
REPORT

echo "📄 Report saved: $REPORT_FILE"

# --- 7. Copy to API reports ---
mkdir -p "$API_REPORT_DIR"
cp "$REPORT_FILE" "$API_REPORT_DIR/"
echo "📋 Copied to API reports"

# --- 8. Log event ---
EVENT_JSON=$(cat <<EOF
{
  "type": "mammon_weekly_report",
  "source": "mammon",
  "data": {
    "date": "${TODAY}",
    "btc_usd": ${BTC_USD_INT},
    "btc_holdings": ${ACTUAL_BTC},
    "portfolio_usd": ${PORTFOLIO_USD},
    "drawdown_pct": ${DRAWDOWN},
    "war_chest_deploy_pct": ${DEPLOY_PCT},
    "wedding_fund_pct": ${WEDDING_PCT},
    "weeks_to_wedding": ${WEEKS_LEFT},
    "snapshot_date": "${SNAPSHOT_DATE}"
  }
}
EOF
)

curl -sf -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$EVENT_JSON" > /dev/null 2>&1 && echo "📡 Event logged" || echo "⚠️ API logging failed"

# --- 9. Queue notification ---
mkdir -p "$NOTIF_DIR"
cat > "$NOTIF_DIR/mammon-weekly-${TODAY}.json" << EOF
{
  "type": "mammon_weekly_report",
  "priority": "normal",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "title": "👑 MAMMON Weekly Report — ${TODAY}",
  "summary": "₿ ${ACTUAL_BTC} BTC (\$${PORTFOLIO_USD_FMT}) | BTC: \$${BTC_USD_FMT} (${DRAWDOWN_NEG}) | Wedding: ${WEDDING_PCT}% | ${WAR_STATUS}",
  "report_path": "${REPORT_FILE}",
  "channel": "telegram"
}
EOF
echo "🔔 Notification queued"

echo ""
echo "✅ MAMMON weekly report complete."
