#!/usr/bin/env bash
# MAMMON Portfolio Tracker — BTC Holdings, Wedding Fund, DCA Progress
# Reads from portfolio-snapshot.json (single source of truth)
# THRONE updates the snapshot; this script just reads it.

set -euo pipefail

DOMINION_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
TODAY=$(date +%Y-%m-%d)
REPORT_FILE="$DOMINION_DIR/reports/mammon-portfolio-${TODAY}.md"
API_REPORT_DIR="$DOMINION_DIR/api/reports"
API_LOG="$DOMINION_DIR/api/logs"
NOTIF_DIR="$DOMINION_DIR/api/notifications"
SNAPSHOT="$DOMINION_DIR/config/portfolio-snapshot.json"

# ── Load from snapshot (single source of truth) ──
if [ ! -f "$SNAPSHOT" ]; then
    echo "❌ portfolio-snapshot.json not found! THRONE must create it."
    exit 1
fi

echo "📂 Loading portfolio snapshot (last updated: $(python3 -c "import json; print(json.load(open('$SNAPSHOT'))['last_updated'])"))"

# Parse snapshot with python3 (reliable JSON parsing)
eval "$(python3 -c "
import json
s = json.load(open('${SNAPSHOT}'))
print(f'ACTUAL_BTC={s[\"btc\"][\"holdings\"]}')
print(f'BTC_ATH={s[\"btc\"][\"ath_usd\"]}')
print(f'BTC_TARGET={s[\"btc\"][\"target_2030\"]}')
print(f'AVG_BUY_USD={s[\"btc\"][\"avg_buy_price_usd\"]}')
print(f'ACTUAL_WEDDING_IDR={s[\"wedding\"][\"fund_idr\"]}')
print(f'WEDDING_TARGET_IDR={s[\"wedding\"][\"target_idr\"]}')
print(f'MONTHLY_WEDDING_IDR={s[\"wedding\"][\"monthly_idr\"]}')
print(f'WEDDING_DATE={s[\"wedding\"][\"date\"]}')
print(f'WAR_CHEST_IDR={s[\"war_chest\"][\"total_idr\"]}')
print(f'MONTHLY_DCA_IDR={s[\"dca\"][\"monthly_idr\"]}')
print(f'SNAPSHOT_DATE={s[\"last_updated\"]}')
")"

# ── Fetch BTC Price ──
echo "📡 Fetching BTC price from CoinGecko..."
PRICE_JSON=$(curl -sf "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,idr&include_24hr_change=true" 2>/dev/null || echo '{}')

BTC_USD=$(echo "$PRICE_JSON" | grep -o '"usd":[0-9.]*' | head -1 | cut -d: -f2 || true)
BTC_IDR=$(echo "$PRICE_JSON" | grep -o '"idr":[0-9.]*' | head -1 | cut -d: -f2 || true)
BTC_24H=$(echo "$PRICE_JSON" | grep -o '"usd_24h_change":[0-9.-]*' | head -1 | cut -d: -f2 || true)

if [ -z "$BTC_USD" ] || [ "$BTC_USD" = "" ]; then
    echo "⚠️  CoinGecko API failed, using fallback price"
    BTC_USD=97000
    BTC_IDR=1590000000
    BTC_24H="0.0"
fi

# Remove decimals for integer math where needed
BTC_USD_INT=${BTC_USD%.*}
BTC_IDR_INT=${BTC_IDR%.*}

echo "💰 BTC: \$${BTC_USD} | Rp ${BTC_IDR}"

# ── Date helpers ──
current_year=$(date +%Y); current_month=$(date +%-m)

# ── BTC Holdings (use actual snapshot) ──
TOTAL_BTC=$ACTUAL_BTC

# ── Portfolio Value ──
PORTFOLIO_USD=$(awk "BEGIN {printf \"%.0f\", $TOTAL_BTC * $BTC_USD}")
PORTFOLIO_IDR=$(awk "BEGIN {printf \"%.0f\", $TOTAL_BTC * $BTC_IDR_INT}")

# ── Progress toward 5 BTC ──
BTC_PROGRESS_PCT=$(awk "BEGIN {pct=$TOTAL_BTC/$BTC_TARGET*100; if(pct>100)pct=100; printf \"%.1f\", pct}")
BTC_PROGRESS_INT=${BTC_PROGRESS_PCT%.*}

# ── Wedding Fund (use actual snapshot) ──
WEDDING_FUND=$ACTUAL_WEDDING_IDR
[ $WEDDING_FUND -gt $WEDDING_TARGET_IDR ] && WEDDING_FUND=$WEDDING_TARGET_IDR
WEDDING_PCT=$(awk "BEGIN {pct=$WEDDING_FUND/$WEDDING_TARGET_IDR*100; if(pct>100)pct=100; printf \"%.1f\", pct}")
WEDDING_PCT_INT=${WEDDING_PCT%.*}

# Months to wedding
wed_year=2026; wed_month=11
MONTHS_TO_WEDDING=$(( (wed_year - current_year) * 12 + wed_month - current_month ))
[ $MONTHS_TO_WEDDING -lt 0 ] && MONTHS_TO_WEDDING=0

# ── Drawdown from ATH ──
DRAWDOWN_PCT=$(awk "BEGIN {printf \"%.1f\", (1 - $BTC_USD_INT/$BTC_ATH) * 100}")
DRAWDOWN_NEG=$(awk "BEGIN {printf \"%.1f\", ($BTC_USD_INT/$BTC_ATH - 1) * 100}")

# War chest triggers
WAR_30=$(awk "BEGIN {printf \"%.0f\", $BTC_ATH * 0.70}")
WAR_40=$(awk "BEGIN {printf \"%.0f\", $BTC_ATH * 0.60}")
WAR_50=$(awk "BEGIN {printf \"%.0f\", $BTC_ATH * 0.50}")

trigger_status() {
    if [ $BTC_USD_INT -le $1 ]; then echo "🔴 TRIGGERED"; else echo "⚪ Waiting"; fi
}
T30=$(trigger_status $WAR_30)
T40=$(trigger_status $WAR_40)
T50=$(trigger_status $WAR_50)

# ── Projection: When do we hit 5 BTC? ──
BTC_REMAINING=$(awk "BEGIN {printf \"%.6f\", $BTC_TARGET - $TOTAL_BTC}")
# Monthly BTC at current price
MONTHLY_BTC_AT_CURRENT=$(awk "BEGIN {printf \"%.6f\", $MONTHLY_DCA_IDR / $BTC_IDR_INT}")
MONTHS_TO_5BTC=$(awk "BEGIN {
    rem=$BTC_TARGET - $TOTAL_BTC;
    if(rem <= 0) {print 0; exit}
    monthly=$MONTHLY_DCA_IDR / $BTC_IDR_INT;
    if(monthly <= 0) {print 999; exit}
    printf \"%.0f\", rem / monthly
}")
PROJ_YEAR=$(( current_year + MONTHS_TO_5BTC / 12 ))
PROJ_MONTH=$(( current_month + MONTHS_TO_5BTC % 12 ))
if [ $PROJ_MONTH -gt 12 ]; then PROJ_YEAR=$(( PROJ_YEAR + 1 )); PROJ_MONTH=$(( PROJ_MONTH - 12 )); fi

# Years to 2030
YEARS_TO_2030=$(( 2030 - current_year ))

# ── Progress Bar Generator ──
progress_bar() {
    local pct=$1
    local width=20
    local filled=$(( pct * width / 100 ))
    local empty=$(( width - filled ))
    local bar=""
    for ((i=0; i<filled; i++)); do bar+="█"; done
    for ((i=0; i<empty; i++)); do bar+="░"; done
    echo "[$bar] ${pct}%"
}

BTC_BAR=$(progress_bar $BTC_PROGRESS_INT)
WEDDING_BAR=$(progress_bar $WEDDING_PCT_INT)

# ── Format numbers ──
fmt_idr() { echo "$1" | awk '{printf "%'\''d", $1}' 2>/dev/null || echo "$1"; }
fmt_usd() { echo "$1" | awk '{printf "%'\''d", $1}' 2>/dev/null || echo "$1"; }

PORTFOLIO_USD_FMT=$(fmt_usd "$PORTFOLIO_USD")
PORTFOLIO_IDR_FMT=$(fmt_idr "$PORTFOLIO_IDR")

WEDDING_FUND_FMT=$(fmt_idr "$WEDDING_FUND")
BTC_USD_FMT=$(fmt_usd "$BTC_USD_INT")
BTC_IDR_FMT=$(fmt_idr "$BTC_IDR_INT")

# ── Generate Report ──
cat > "$REPORT_FILE" << REPORT
# 💰 MAMMON Portfolio Dashboard
**Date:** ${TODAY}
**Agent:** MAMMON — Financial General of the Dominion

---

## 📊 BTC Market Status

| Metric | Value |
|--------|-------|
| BTC/USD | \$${BTC_USD_FMT} |
| BTC/IDR | Rp ${BTC_IDR_FMT} |
| 24h Change | ${BTC_24H}% |
| ATH | \$${BTC_ATH} |
| Drawdown from ATH | -${DRAWDOWN_PCT}% |

---

## 🏦 BTC Holdings

| Metric | Value |
|--------|-------|
| Initial Stack (Dec 2025) | 0.07 BTC |
| Avg Buy Price | ~\$${AVG_BUY_USD} |
| **Total BTC** | **${TOTAL_BTC} BTC** |
| Snapshot Date | ${SNAPSHOT_DATE} |
| Portfolio (USD) | \$${PORTFOLIO_USD_FMT} |
| Portfolio (IDR) | Rp ${PORTFOLIO_IDR_FMT} |

### Progress to 5 BTC Target
\`\`\`
${BTC_BAR}
${TOTAL_BTC} / ${BTC_TARGET} BTC
\`\`\`

BTC remaining: ${BTC_REMAINING} BTC

---

## 💒 Wedding Fund Progress

| Metric | Value |
|--------|-------|
| Current Fund | Rp ${WEDDING_FUND_FMT} |
| Target | Rp 350,000,000 |
| Monthly Contribution | Rp 30,000,000 |
| Months to Wedding | ${MONTHS_TO_WEDDING} months |

\`\`\`
${WEDDING_BAR}
Rp ${WEDDING_FUND_FMT} / Rp 350,000,000
\`\`\`

---

## ⚔️ War Chest Status

| Drawdown | Trigger Price | Status |
|----------|--------------|--------|
| -30% from ATH | \$${WAR_30} | ${T30} |
| -40% from ATH | \$${WAR_40} | ${T40} |
| -50% from ATH | \$${WAR_50} | ${T50} |

War Chest Size: Rp 40,000,000 (USDT)

---

## 📅 Monthly DCA Schedule

| Item | Amount | Frequency |
|------|--------|-----------|
| Bitcoin DCA | Rp 50,000,000 | Monthly (29th/30th) |
| Wedding Fund | Rp 30,000,000 | Monthly |
| War Chest | Rp 15,000,000 | Monthly |
| Gold | Rp 5,000,000 | Monthly |
| Surplus → BTC | ~Rp 12,000,000 | Monthly |
| **Total** | **Rp 112,000,000** | **68% savings rate** |

---

## 🔮 Projection

| Metric | Value |
|--------|-------|
| Monthly BTC at current price | ${MONTHLY_BTC_AT_CURRENT} BTC |
| Months to reach 5 BTC (at current price) | ~${MONTHS_TO_5BTC} months |
| Projected 5 BTC date | ~${PROJ_MONTH}/${PROJ_YEAR} |
| Years to 2030 | ${YEARS_TO_2030} |

> ⚠️ Bear market = cheaper BTC = faster accumulation. The plan accounts for this.

---

## 🔥 Fire Sale Theory Reminder

> *"In 2030, they came selling their houses, their cars, their dreams — just to survive. I bought it all at 50 cents on the dollar. While they were finding bitches, I was finding Bitcoin."*

### The Play:
1. 🐻 2026-2027: Bear market — **MAX ACCUMULATION**
2. 🔨 2028: Post-halving buildup
3. 🚀 2029: Bull run — sell ~0.6 BTC for dream life
4. 🛒 2030: AI unemployment crisis — **BE THE BUYER**

---

## 💎 Diamond Hands Reminder

\`\`\`
    💎🙌 STACK SATS. NO SPECULATION.

    Harvard holds.     BlackRock holds.
    US Government holds.   Abu Dhabi holds.

    You hold too.

    "Boring = Winning"

    See you at Rp 50 Billion.
\`\`\`

---

*Generated by MAMMON — Financial General of the Dominion*
*Investment Master Plan v2.1 | Data from portfolio-snapshot.json*
REPORT

echo "📄 Report generated: $REPORT_FILE"

# ── Copy to API ──
mkdir -p "$API_REPORT_DIR"
cp "$REPORT_FILE" "$API_REPORT_DIR/"
echo "📋 Copied to API reports"

# ── Log event ──
mkdir -p "$API_LOG"
cat >> "$API_LOG/events.jsonl" << EOF
{"timestamp":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","agent":"MAMMON","event":"portfolio_report","btc_price_usd":${BTC_USD},"total_btc":"${TOTAL_BTC}","portfolio_usd":${PORTFOLIO_USD},"wedding_fund":${WEDDING_FUND},"drawdown_pct":"${DRAWDOWN_PCT}"}
EOF
echo "📝 Event logged"

# ── Queue notification ──
mkdir -p "$NOTIF_DIR"
cat > "$NOTIF_DIR/mammon-portfolio-${TODAY}.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "agent": "MAMMON",
  "type": "portfolio_update",
  "priority": "normal",
  "summary": "💰 Portfolio: ${TOTAL_BTC} BTC (\$${PORTFOLIO_USD_FMT}) | BTC: \$${BTC_USD_FMT} | Drawdown: -${DRAWDOWN_PCT}% | Wedding: ${WEDDING_PCT}% | Target: ${BTC_PROGRESS_PCT}% to 5 BTC",
  "data": {
    "btc_price_usd": ${BTC_USD},
    "total_btc": "${TOTAL_BTC}",
    "portfolio_usd": ${PORTFOLIO_USD},
    "portfolio_idr": ${PORTFOLIO_IDR},
    "wedding_progress_pct": "${WEDDING_PCT}",
    "btc_target_pct": "${BTC_PROGRESS_PCT}",
    "drawdown_pct": "${DRAWDOWN_PCT}"
  }
}
EOF
echo "🔔 Notification queued"

echo ""
echo "═══════════════════════════════════════════"
echo "  💰 MAMMON Portfolio Summary"
echo "═══════════════════════════════════════════"
echo "  BTC Price:      \$${BTC_USD_FMT}"
echo "  Holdings:       ${TOTAL_BTC} BTC"
echo "  Value:          \$${PORTFOLIO_USD_FMT}"
echo "  5 BTC Progress: ${BTC_BAR}"
echo "  Wedding Fund:   ${WEDDING_BAR}"
echo "  Drawdown:       -${DRAWDOWN_PCT}%"
echo "═══════════════════════════════════════════"
echo "  💎 Stack sats. No speculation."
echo "═══════════════════════════════════════════"
