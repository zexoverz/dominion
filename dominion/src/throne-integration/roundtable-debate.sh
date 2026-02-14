#!/usr/bin/env bash
# Roundtable Debate — Generals discuss a proposal in character before voting
set -euo pipefail

API="https://dominion-api-production.up.railway.app/api"
PROPOSAL_ID="${1:?Usage: roundtable-debate.sh <proposal-id>}"

# ── Fetch proposal ──────────────────────────────────────────────
# Try direct endpoint first, fall back to filtering from list
PROPOSAL=$(curl -sf "$API/proposals/$PROPOSAL_ID" 2>/dev/null | jq -e '.id' >/dev/null 2>&1 && curl -sf "$API/proposals/$PROPOSAL_ID") || \
PROPOSAL=$(curl -sf "$API/proposals" | jq -e --arg id "$PROPOSAL_ID" '.[] | select(.id == $id)') || \
{ echo "❌ Failed to fetch proposal $PROPOSAL_ID"; exit 1; }

TITLE=$(echo "$PROPOSAL" | jq -r '.title')
DESC=$(echo "$PROPOSAL" | jq -r '.description')
AGENT=$(echo "$PROPOSAL" | jq -r '.agent_id')
COST=$(echo "$PROPOSAL" | jq -r '.estimated_cost_usd // "0"')
PRIORITY=$(echo "$PROPOSAL" | jq -r '.priority // 50')
STATUS=$(echo "$PROPOSAL" | jq -r '.status')

echo "═══════════════════════════════════════════════════"
echo "  🏛️  ROUNDTABLE DEBATE"
echo "  📋 Proposal: $TITLE"
echo "  💲 Cost: \$$COST | Priority: $PRIORITY | Status: $STATUS"
echo "═══════════════════════════════════════════════════"
echo ""

# ── Categorize proposal ────────────────────────────────────────
categorize() {
  local t=$(echo "$TITLE $DESC" | tr '[:upper:]' '[:lower:]')
  if echo "$t" | grep -qE 'market|price|sentiment|btc|eth|crypto|trading|momentum'; then echo "market"
  elif echo "$t" | grep -qE 'security|audit|vulnerab|threat|attack|phish|breach'; then echo "security"
  elif echo "$t" | grep -qE 'research|paper|study|analysis|technical|algorithm'; then echo "research"
  elif echo "$t" | grep -qE 'content|brand|community|social|tweet|blog|newsletter'; then echo "content"
  elif echo "$t" | grep -qE 'budget|cost|financ|treasury|fund|revenue|profit'; then echo "finance"
  elif echo "$t" | grep -qE 'infra|server|deploy|monitor|uptime|database|api|pipeline'; then echo "infrastructure"
  else echo "general"; fi
}

CATEGORY=$(categorize)
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
TURN=0
CONVERSATION_LOG="[]"
PARTICIPANTS="[]"
VOTES="[]"

# ── Helper: add a turn ─────────────────────────────────────────
add_turn() {
  local speaker="$1" msg="$2"
  TURN=$((TURN + 1))
  local ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  local icon=""
  case "$speaker" in
    THRONE) icon="👑";; SEER) icon="🔮";; PHANTOM) icon="👻";;
    GRIMOIRE) icon="📖";; ECHO) icon="🔊";; MAMMON) icon="💰";; WRAITH-EYE) icon="👁️";;
  esac
  echo "  $icon $speaker: $msg"
  CONVERSATION_LOG=$(echo "$CONVERSATION_LOG" | jq --arg t "$TURN" --arg s "$speaker" --arg m "$msg" --arg ts "$ts" \
    '. + [{"turn": ($t|tonumber), "speaker": $s, "message": $m, "timestamp": $ts}]')
  PARTICIPANTS=$(echo "$PARTICIPANTS" | jq --arg s "$speaker" 'if index($s) then . else . + [$s] end')
}

add_vote() {
  local speaker="$1" vote="$2"
  VOTES=$(echo "$VOTES" | jq --arg s "$speaker" --arg v "$vote" '. + [{"general": $s, "vote": $v}]')
}

# ── Generate debate based on category ──────────────────────────

# Cost threshold reactions
COST_REACTION="within acceptable parameters"
if (( $(echo "$COST > 5" | bc -l) )); then COST_REACTION="significant — needs justification"; fi
if (( $(echo "$COST > 20" | bc -l) )); then COST_REACTION="expensive — I want to see clear ROI"; fi

case "$CATEGORY" in
  market)
    add_turn "THRONE" "This is a priority-$PRIORITY market intel task — '$TITLE'. $AGENT proposed it. Market awareness is foundational to every decision we make."
    add_turn "SEER" "I can confirm the data sources are solid. Current volatility warrants frequent scans — we're seeing divergences that could signal a move within 48h."
    add_turn "PHANTOM" "Market data endpoints are external dependencies. I want to ensure we're not leaking query patterns that reveal our positions or strategies."
    add_turn "MAMMON" "At \$$COST this is low-cost intelligence gathering. The ROI on catching a single trend shift early pays for months of these scans."
    add_turn "ECHO" "Sharing sanitized market insights with the community builds credibility. This positions us as informed operators, not just speculators."
    ;;
  security)
    add_turn "THRONE" "'$TITLE' — security is non-negotiable. $AGENT, walk us through the threat model."
    add_turn "PHANTOM" "This aligns with my standing threat assessment. Every day we delay a security audit increases exposure surface. I strongly support this."
    add_turn "GRIMOIRE" "Research shows that proactive security reviews reduce incident costs by 60-80%. The technical approach outlined here follows best practices."
    add_turn "MAMMON" "Cost is \$$COST — $COST_REACTION. But a single breach costs orders of magnitude more. This is insurance, not expense."
    add_turn "WRAITH-EYE" "I'll need to set up monitoring hooks for whatever this audit touches. Any findings should feed directly into my alerting pipeline."
    ;;
  research)
    add_turn "THRONE" "'$TITLE' is a knowledge-building initiative at priority $PRIORITY. GRIMOIRE, is the methodology sound?"
    add_turn "GRIMOIRE" "The research scope is well-defined. This builds on existing work and fills a genuine knowledge gap in our operations."
    add_turn "SEER" "I can cross-reference findings with market data to validate conclusions. Data-backed research compounds over time."
    add_turn "PHANTOM" "Research outputs should be classified appropriately. Not everything we learn should be public. Recommending internal-only distribution initially."
    add_turn "MAMMON" "At \$$COST, this is $COST_REACTION. Research investments are harder to quantify but essential for long-term edge."
    ;;
  content)
    add_turn "THRONE" "'$TITLE' — content shapes perception and perception shapes opportunity. ECHO, take point."
    add_turn "ECHO" "This is exactly the kind of content that builds our brand presence. The topic is timely and the angle differentiates us from noise."
    add_turn "GRIMOIRE" "I can provide factual backing and technical depth to ensure the content is substantive, not just surface-level engagement bait."
    add_turn "PHANTOM" "Content is an attack surface. We need to vet anything published for information leakage — no operational details, no infrastructure hints."
    add_turn "MAMMON" "\$$COST for content production is $COST_REACTION. Good content has compounding returns through audience growth."
    ;;
  finance)
    add_turn "THRONE" "'$TITLE' touches treasury and budget — MAMMON, this is your domain. What's the assessment?"
    add_turn "MAMMON" "I've reviewed the numbers. At \$$COST with priority $PRIORITY, this is $COST_REACTION. The financial modeling here is sound."
    add_turn "SEER" "Market conditions support the timing of this financial action. Current trends suggest favorable conditions for the next 2-4 weeks."
    add_turn "WRAITH-EYE" "Any financial operations need full audit logging. I'll ensure every transaction is traceable and monitored in real-time."
    add_turn "PHANTOM" "Financial operations are high-value targets. I want multi-sig or equivalent approval gates on any fund movements."
    ;;
  infrastructure)
    add_turn "THRONE" "'$TITLE' — infrastructure is the backbone. WRAITH-EYE, what's the current state?"
    add_turn "WRAITH-EYE" "Current infrastructure metrics support this upgrade. I'm seeing capacity concerns that this proposal directly addresses."
    add_turn "GRIMOIRE" "The technical approach is solid. I'd recommend adding rollback procedures and canary deployments to minimize risk."
    add_turn "PHANTOM" "Infrastructure changes expand attack surface. I need a security review of any new services or exposed endpoints before deployment."
    add_turn "MAMMON" "\$$COST for infrastructure is $COST_REACTION. Downtime costs more than prevention — I support proactive investment here."
    ;;
  *)
    add_turn "THRONE" "'$TITLE' — priority $PRIORITY, proposed by $AGENT. Let's evaluate this quickly."
    add_turn "SEER" "The data suggests this aligns with current operational needs. Timing seems appropriate given our current trajectory."
    add_turn "PHANTOM" "I see no immediate red flags, but I'd like a risk assessment before execution. Standard due diligence."
    add_turn "MAMMON" "Cost of \$$COST is $COST_REACTION. If the expected outcome materializes, it's a reasonable allocation."
    add_turn "GRIMOIRE" "The technical details check out. The proposal is well-structured and the steps are actionable."
    ;;
esac

# ── Final turn: THRONE summarizes ──────────────────────────────
add_turn "THRONE" "The council has weighed in. Let's vote."

echo ""
echo "  ─── VOTE ───"

# ── Voting logic ───────────────────────────────────────────────
# Generals vote based on category alignment and cost
vote_general() {
  local gen="$1"
  local vote="APPROVE"
  # High cost = some abstentions from non-relevant generals
  if (( $(echo "$COST > 50" | bc -l) )); then
    case "$gen" in
      PHANTOM) vote="REJECT";;
      MAMMON) vote="REJECT";;
    esac
  fi
  echo "$vote"
}

ALL_GENERALS=("THRONE" "SEER" "PHANTOM" "GRIMOIRE" "ECHO" "MAMMON" "WRAITH-EYE")
# Pick participants from conversation + vote
for g in "${ALL_GENERALS[@]}"; do
  if echo "$CONVERSATION_LOG" | jq -e --arg s "$g" 'map(.speaker) | index($s)' >/dev/null 2>&1; then
    v=$(vote_general "$g")
    add_vote "$g" "$v"
    case "$v" in
      APPROVE) echo "    ✅ $g: APPROVE";;
      REJECT) echo "    ❌ $g: REJECT";;
      ABSTAIN) echo "    ⬜ $g: ABSTAIN";;
    esac
  fi
done

APPROVALS=$(echo "$VOTES" | jq '[.[] | select(.vote=="APPROVE")] | length')
TOTAL=$(echo "$VOTES" | jq 'length')
echo ""
echo "  📊 Result: $APPROVALS/$TOTAL APPROVE"
echo "═══════════════════════════════════════════════════"

# ── POST roundtable to API ─────────────────────────────────────
ROUNDTABLE_PAYLOAD=$(jq -n \
  --arg fmt "debate" \
  --arg topic "$TITLE" \
  --argjson participants "$PARTICIPANTS" \
  --argjson log "$CONVERSATION_LOG" \
  --argjson votes "$VOTES" \
  --arg status "completed" \
  --arg proposal_id "$PROPOSAL_ID" \
  --arg category "$CATEGORY" \
  '{
    format: $fmt,
    topic: $topic,
    participants: $participants,
    conversation_log: $log,
    votes: $votes,
    status: $status,
    proposal_id: $proposal_id,
    category: $category
  }')

ROUNDTABLE_RESP=$(curl -sf -X POST "$API/roundtables" \
  -H "Content-Type: application/json" \
  -d "$ROUNDTABLE_PAYLOAD" 2>&1) && {
  RT_ID=$(echo "$ROUNDTABLE_RESP" | jq -r '.id // "unknown"')
  echo "✅ Roundtable saved: $RT_ID"
} || {
  echo "⚠️  Failed to save roundtable (API may not have /roundtables endpoint yet)"
  echo "   Payload prepared for: POST $API/roundtables"
}

# ── Log event ──────────────────────────────────────────────────
curl -sf -X POST "$API/events" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg type "roundtable_debate" \
    --arg agent "THRONE" \
    --arg msg "Roundtable debate completed for proposal: $TITLE ($APPROVALS/$TOTAL approved)" \
    --arg proposal_id "$PROPOSAL_ID" \
    --arg category "$CATEGORY" \
    '{type: $type, agent_id: $agent, message: $msg, metadata: {proposal_id: $proposal_id, category: $category}}')" \
  >/dev/null 2>&1 && echo "📝 Event logged" || echo "⚠️  Event logging failed"
