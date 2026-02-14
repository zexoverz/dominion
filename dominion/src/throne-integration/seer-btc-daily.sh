#!/bin/bash
# SEER Daily BTC Intelligence Report
# Fetches live price, Fear & Greed, and major BTC news
# Outputs a markdown report to dominion/reports/ and updates the API

API_URL="https://dominion-api-production.up.railway.app"
REPORTS_DIR="$(dirname "$0")/../../reports"
API_REPORTS_DIR="$(dirname "$0")/../../api/reports"

echo "🔮 SEER: Gathering BTC intelligence..."

# 1. Fetch BTC price from CoinGecko (free, no key)
BTC_DATA=$(curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true" 2>/dev/null)
BTC_PRICE=$(echo "$BTC_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{d[\"bitcoin\"][\"usd\"]:,.0f}')" 2>/dev/null || echo "N/A")
BTC_CHANGE=$(echo "$BTC_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{d[\"bitcoin\"][\"usd_24h_change\"]:.2f}')" 2>/dev/null || echo "N/A")
BTC_MCAP=$(echo "$BTC_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{d[\"bitcoin\"][\"usd_market_cap\"]/1e12:.2f}T')" 2>/dev/null || echo "N/A")
BTC_VOL=$(echo "$BTC_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{d[\"bitcoin\"][\"usd_24h_vol\"]/1e9:.1f}B')" 2>/dev/null || echo "N/A")

echo "  BTC Price: \$$BTC_PRICE (${BTC_CHANGE}%)"

# 2. Fetch Fear & Greed Index
FG_DATA=$(curl -s "https://api.alternative.me/fng/?limit=1" 2>/dev/null)
FG_VALUE=$(echo "$FG_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data'][0]['value'])" 2>/dev/null || echo "N/A")
FG_LABEL=$(echo "$FG_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data'][0]['value_classification'])" 2>/dev/null || echo "N/A")

echo "  Fear & Greed: $FG_VALUE ($FG_LABEL)"

# 3. Fetch BTC ATH and calculate drawdown
BTC_ATH_DATA=$(curl -s "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false" 2>/dev/null)
BTC_ATH=$(echo "$BTC_ATH_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'{d[\"market_data\"][\"ath\"][\"usd\"]:,.0f}')" 2>/dev/null || echo "126,000")
BTC_ATH_RAW=$(echo "$BTC_ATH_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['market_data']['ath']['usd'])" 2>/dev/null || echo "126000")
BTC_PRICE_RAW=$(echo "$BTC_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['bitcoin']['usd'])" 2>/dev/null || echo "0")
DRAWDOWN=$(python3 -c "ath=$BTC_ATH_RAW; price=$BTC_PRICE_RAW; print(f'{((price-ath)/ath)*100:.1f}')" 2>/dev/null || echo "N/A")

echo "  ATH: \$$BTC_ATH | Drawdown: ${DRAWDOWN}%"

# 4. Fetch latest Bitcoin news headlines (CryptoPanic free API)
echo "  Fetching BTC news..."
NEWS_DATA=$(curl -s "https://cryptopanic.com/api/free/v1/posts/?auth_token=free&currencies=BTC&kind=news&filter=important" 2>/dev/null)

# Also try Brave search for institutional BTC news
BRAVE_NEWS=""
if [ -n "$BRAVE_API_KEY" ]; then
  BRAVE_NEWS=$(curl -s "https://api.search.brave.com/res/v1/news/search?q=bitcoin+institutional+buying+OR+blackrock+OR+country+bitcoin&count=5" \
    -H "Accept: application/json" \
    -H "X-Subscription-Token: $BRAVE_API_KEY" 2>/dev/null)
fi

# 5. Build news section using web search
NEWS_ITEMS=""

# Parse CryptoPanic
CP_NEWS=$(echo "$NEWS_DATA" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    for r in d.get('results', [])[:8]:
        title = r.get('title', '')
        source = r.get('source', {}).get('title', '')
        url = r.get('url', '')
        kind = r.get('kind', '')
        # Flag bullish institutional news
        bullish_keywords = ['blackrock', 'etf', 'buy', 'bought', 'purchase', 'accumulate', 'country', 'nation', 'reserve', 'adopt', 'approval', 'inflow', 'billion', 'institutional', 'microstrategy', 'strategy', 'sovereign', 'treasury']
        is_bullish = any(kw in title.lower() for kw in bullish_keywords)
        flag = '🐂 BULLISH' if is_bullish else ''
        print(f'{title}|{source}|{flag}')
except:
    pass
" 2>/dev/null)

# 6. War chest status based on investment plan v2.0
WAR_CHEST_STATUS=$(python3 -c "
price = $BTC_PRICE_RAW
ath = $BTC_ATH_RAW
drawdown_pct = abs((price - ath) / ath * 100)
triggers = []
if drawdown_pct >= 50:
    triggers.append('🔴 -50% TRIGGER HIT → Deploy 100% war chest')
elif drawdown_pct >= 40:
    triggers.append('🟠 -40% TRIGGER HIT → Deploy 50% war chest')
elif drawdown_pct >= 30:
    triggers.append('🟡 -30% TRIGGER HIT → Deploy 25% war chest')
else:
    triggers.append('⚪ No war chest trigger yet')

if drawdown_pct >= 30:
    triggers.append('💎 DIAMOND HANDS MODE — This is what you trained for')
    triggers.append('📊 Historically, buying at these levels = generational wealth')

for t in triggers:
    print(t)
" 2>/dev/null)

# 7. Generate the report
DATE=$(date -u +"%Y-%m-%d")
DATE_DISPLAY=$(date -u +"%B %d, %Y")
TIMESTAMP=$(date -u +"%H:%M UTC")

REPORT_FILE="seer-btc-daily-${DATE}"

cat > "$REPORTS_DIR/${REPORT_FILE}.md" << REPORT
# 🔮 SEER Daily BTC Intelligence — ${DATE_DISPLAY}

*Generated at ${TIMESTAMP} by SEER Intelligence Engine*

---

## 📊 Market Snapshot

| Metric | Value |
|--------|-------|
| **BTC Price** | \$${BTC_PRICE} |
| **24h Change** | ${BTC_CHANGE}% |
| **Market Cap** | \$${BTC_MCAP} |
| **24h Volume** | \$${BTC_VOL} |
| **All-Time High** | \$${BTC_ATH} |
| **Drawdown from ATH** | ${DRAWDOWN}% |
| **Fear & Greed Index** | ${FG_VALUE}/100 — ${FG_LABEL} |

---

## 🎯 War Chest Protocol (v2.0)

${WAR_CHEST_STATUS}

**Your Rules (from Investment Master Plan v2.0):**
- -30% from ATH → Deploy 25% war chest
- -40% from ATH → Deploy 50% war chest  
- -50% from ATH → Deploy 100% war chest
- Monthly DCA: Rp 50M into BTC regardless of price
- ForuAI tokens → sell immediately → BTC
- NO ALTCOINS. EVER.

---

## 📰 Major BTC Headlines

REPORT

# Append news items
if [ -n "$CP_NEWS" ]; then
  echo "$CP_NEWS" | while IFS='|' read -r title source flag; do
    if [ -n "$flag" ]; then
      echo "- **${flag}** — ${title} *(${source})*" >> "$REPORTS_DIR/${REPORT_FILE}.md"
    else
      echo "- ${title} *(${source})*" >> "$REPORTS_DIR/${REPORT_FILE}.md"
    fi
  done
else
  echo "- *No major headlines available at this time*" >> "$REPORTS_DIR/${REPORT_FILE}.md"
fi

cat >> "$REPORTS_DIR/${REPORT_FILE}.md" << 'REPORT2'

---

## 💎 DIAMOND HANDS REMINDER

> "Everyone is a genius in a bull market. The real wealth is built during the bear."

**Why you HODL through the fear:**
- BlackRock, Fidelity, and sovereign funds are accumulating at these levels
- Bitcoin ETF inflows show institutional conviction hasn't wavered
- Every previous -40%+ drawdown was followed by new ATH within 12-24 months
- You're 25 with a 5-12 BTC target by 2030 — time is your greatest asset
- The fire sale theory: AI destroys middle class → you buy their assets cheap

**What NOT to do:**
- ❌ Panic sell at the bottom
- ❌ Chase altcoin pumps ("this time is different")
- ❌ Skip your monthly DCA because "it might go lower"
- ❌ Listen to CT doomers

**What TO do:**
- ✅ Execute your DCA on schedule (Rp 50M/mo)
- ✅ Deploy war chest at trigger levels
- ✅ Convert ForuAI tokens → BTC immediately
- ✅ Stack sats. Stay humble.

---

*🔮 SEER watches the markets so you don't have to. Stay disciplined, Lord Zexo.*
REPORT2

echo "📄 Report saved: ${REPORT_FILE}.md"

# 8. Copy to API reports dir
cp "$REPORTS_DIR/${REPORT_FILE}.md" "$API_REPORTS_DIR/${REPORT_FILE}.md" 2>/dev/null

# 9. Also update the main seer-btc-sentiment file as "latest"
cp "$REPORTS_DIR/${REPORT_FILE}.md" "$REPORTS_DIR/seer-btc-sentiment-latest.md"
cp "$REPORTS_DIR/${REPORT_FILE}.md" "$API_REPORTS_DIR/seer-btc-sentiment-latest.md" 2>/dev/null

# 10. Log event to API
curl -s -X POST "$API_URL/api/events" \
  -H "Content-Type: application/json" \
  -d "{
    \"agent_id\": \"SEER\",
    \"kind\": \"report\",
    \"title\": \"Daily BTC Intelligence — \$$BTC_PRICE (${BTC_CHANGE}%)\",
    \"summary\": \"BTC \$$BTC_PRICE | F&G ${FG_VALUE} (${FG_LABEL}) | Drawdown ${DRAWDOWN}% from ATH\",
    \"cost_usd\": 0
  }" > /dev/null 2>&1

echo "✅ SEER Daily BTC Intelligence complete"
echo "   Price: \$$BTC_PRICE | Change: ${BTC_CHANGE}% | F&G: ${FG_VALUE} | Drawdown: ${DRAWDOWN}%"
