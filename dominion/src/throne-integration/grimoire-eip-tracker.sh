#!/usr/bin/env bash
# GRIMOIRE EIP Tracker — Track Ethereum EIPs relevant to ETHJKT
# Fetches from GitHub API, categorizes, and generates a report
set -euo pipefail

DOMINION_DIR="${DOMINION_DIR:-/data/workspace/dominion}"
DATE=$(date +%Y-%m-%d)
REPORT="$DOMINION_DIR/reports/grimoire-eip-tracker-${DATE}.md"
API_REPORT="$DOMINION_DIR/api/reports/grimoire-eip-tracker-${DATE}.md"
NOTIF_DIR="$DOMINION_DIR/api/notifications"
LOG_FILE="$DOMINION_DIR/api/logs/events.log"
TMP=$(mktemp -d)
trap "rm -rf $TMP" EXIT

mkdir -p "$DOMINION_DIR/reports" "$DOMINION_DIR/api/reports" "$NOTIF_DIR" "$(dirname "$LOG_FILE")"

echo "📜 GRIMOIRE EIP Tracker — fetching EIP data..."

# Fetch data from GitHub
curl -sf "https://api.github.com/repos/ethereum/EIPs/pulls?state=open&sort=updated&per_page=10" > "$TMP/eips_open.json" 2>/dev/null || echo "[]" > "$TMP/eips_open.json"
curl -sf "https://api.github.com/repos/ethereum/EIPs/pulls?state=closed&sort=updated&per_page=5" > "$TMP/eips_closed.json" 2>/dev/null || echo "[]" > "$TMP/eips_closed.json"
curl -sf "https://api.github.com/repos/ethereum/ERCs/pulls?state=open&sort=updated&per_page=10" > "$TMP/ercs_open.json" 2>/dev/null || echo "[]" > "$TMP/ercs_open.json"

# jq helper: extract PR info
extract_prs() {
  local file="$1" category="$2"
  jq -r --arg cat "$category" '.[] | {
    number: .number,
    title: .title,
    author: .user.login,
    state: .state,
    labels: ([.labels[].name] | join(", ")),
    updated: .updated_at,
    url: .html_url,
    category: $cat
  }' "$file" 2>/dev/null || true
}

# Categorize: check title/labels for category
categorize_pr() {
  local title="$1" labels="$2"
  local t_lower=$(echo "$title $labels" | tr '[:upper:]' '[:lower:]')
  if echo "$t_lower" | grep -qE 'erc[-_ ]?(20|721|1155|4626|2612|6900|7579|4337|6551|7702|5169)|token|nft|wallet|account.abstraction|interface|metadata|permit'; then
    echo "ERC/Standards"
  elif echo "$t_lower" | grep -qE 'core|consensus|evm|opcode|gas|fork|blob|verkle|eof|pectra|shanghai|cancun'; then
    echo "Core/Consensus"
  else
    echo "Networking/Meta"
  fi
}

# Check ETHJKT relevance
check_relevance() {
  local title="$1" labels="$2"
  local t_lower=$(echo "$title $labels" | tr '[:upper:]' '[:lower:]')
  local tags=""
  echo "$t_lower" | grep -qE 'erc[-_ ]?(20|721|1155|4626|2612)|token|nft|defi|swap|lend|vault|yield' && tags="$tags 📚curriculum"
  echo "$t_lower" | grep -qE 'account.abstraction|erc[-_ ]?(4337|6551|7702|6900|7579)|wallet|paymaster|bundler|intent' && tags="$tags 🏗️hackathon"
  echo "$t_lower" | grep -qE 'erc[-_ ]?(20|721|4337)|solidity|security|audit|standard|interface|abi' && tags="$tags 💼jobs"
  [ -z "$tags" ] && tags=" —"
  echo "$tags"
}

# Build report
{
  cat << 'HEADER'
# 📜 GRIMOIRE EIP Tracker Report

> Ethereum Improvement Proposals relevant to ETHJKT curriculum & hackathons

HEADER
  echo "**Generated:** $DATE"
  echo ""

  # === OPEN EIPs ===
  echo "## 🔥 Top Active EIPs (Open PRs)"
  echo ""
  echo "| # | Title | Author | Category | Relevance | Updated |"
  echo "|---|-------|--------|----------|-----------|---------|"

  jq -r '.[] | [.number, .title, .user.login, ([.labels[].name] | join(",")), .updated_at, .html_url] | @tsv' "$TMP/eips_open.json" 2>/dev/null | head -10 | while IFS=$'\t' read -r num title author labels updated url; do
    cat=$(categorize_pr "$title" "$labels")
    rel=$(check_relevance "$title" "$labels")
    short_date="${updated%%T*}"
    echo "| [#${num}](${url}) | ${title:0:60} | ${author} | ${cat} | ${rel} | ${short_date} |"
  done

  echo ""

  # === OPEN ERCs ===
  echo "## 📋 Active ERCs (Most Relevant for ETHJKT)"
  echo ""
  echo "| # | Title | Author | Relevance | Updated |"
  echo "|---|-------|--------|-----------|---------|"

  jq -r '.[] | [.number, .title, .user.login, ([.labels[].name] | join(",")), .updated_at, .html_url] | @tsv' "$TMP/ercs_open.json" 2>/dev/null | head -10 | while IFS=$'\t' read -r num title author labels updated url; do
    rel=$(check_relevance "$title" "$labels")
    short_date="${updated%%T*}"
    echo "| [#${num}](${url}) | ${title:0:60} | ${author} | ${rel} | ${short_date} |"
  done

  echo ""

  # === RECENTLY MERGED ===
  echo "## ✅ Recently Merged EIPs"
  echo ""
  echo "| # | Title | Author | Category | Merged |"
  echo "|---|-------|--------|----------|--------|"

  jq -r '.[] | select(.merged_at != null) | [.number, .title, .user.login, ([.labels[].name] | join(",")), .merged_at, .html_url] | @tsv' "$TMP/eips_closed.json" 2>/dev/null | head -5 | while IFS=$'\t' read -r num title author labels merged url; do
    cat=$(categorize_pr "$title" "$labels")
    short_date="${merged%%T*}"
    echo "| [#${num}](${url}) | ${title:0:60} | ${author} | ${cat} | ${short_date} |"
  done

  echo ""

  # === ETHJKT Phase 3 Relevance ===
  cat << 'PHASE3'
## 🎓 ETHJKT Phase 3 Recommendations

### For Curriculum
- Watch any ERC tagged 📚curriculum above — these directly relate to token standards and DeFi patterns students need to know
- ERC-20/721/1155 remain foundational; newer ERCs build on these

### For Hackathons
- Items tagged 🏗️hackathon are new standards perfect for building innovative projects
- Account abstraction (ERC-4337, ERC-7702) and modular accounts (ERC-6900/7579) are hot topics

### Good First EIP Contributions
- Look for PRs with labels like "editorial", "typo", "clarification"
- ERCs repo is more beginner-friendly than core EIPs
- Start by reviewing open PRs and leaving constructive comments
- Fix broken links or improve examples in existing EIPs

## 🗺️ 24-Month EIP Contribution Roadmap (Faisal)

| Phase | Timeline | Focus |
|-------|----------|-------|
| Observer | Months 1-3 | Read 5 EIPs/week, comment on open PRs |
| Contributor | Months 4-8 | Submit editorial fixes, co-author an ERC |
| Author | Months 9-14 | Draft own ERC based on ETHJKT needs |
| Champion | Months 15-24 | Shepherd ERC through review, present at PEEPanEIP |

PHASE3
} > "$REPORT"

# Copy to API
cp "$REPORT" "$API_REPORT"

# Log event
echo "[$(date -Iseconds)] GRIMOIRE_EIP_TRACKER report=$REPORT" >> "$LOG_FILE"

# Extract top 3 highlights for notification
TOP3=$(jq -r '.[0:3][] | "• #\(.number): \(.title)"' "$TMP/ercs_open.json" 2>/dev/null || echo "• Check report for details")

cat > "$NOTIF_DIR/grimoire-eip-$(date +%s).json" << EOF
{
  "source": "grimoire-eip-tracker",
  "timestamp": "$(date -Iseconds)",
  "priority": "normal",
  "title": "📜 GRIMOIRE EIP Tracker — $DATE",
  "body": "New EIP report generated.\n\nTop highlights:\n${TOP3}\n\nFull report: reports/grimoire-eip-tracker-${DATE}.md"
}
EOF

echo "✅ Report generated: $REPORT"
echo "📋 Copied to: $API_REPORT"
echo "🔔 Notification queued"
