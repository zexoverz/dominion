#!/usr/bin/env bash
# Auto Proposal Generator for THRONE heartbeat
# Usage: ./generate-proposals.sh [--dry-run]

set -euo pipefail

API="https://dominion-api-production.up.railway.app/api"
DRY_RUN="${1:-}"

# Fetch pending proposals to avoid duplicates
PENDING=$(curl -sf "$API/proposals?status=pending" 2>/dev/null || echo "[]")
PENDING_TITLES=$(echo "$PENDING" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for p in data:
    print(p.get('title','').lower())
" 2>/dev/null || echo "")

# Check if a similar proposal already exists
has_similar() {
    local keyword="$1"
    echo "$PENDING_TITLES" | grep -qi "$keyword" && return 0 || return 1
}

# Post a proposal
post_proposal() {
    local agent_id="$1" title="$2" description="$3" priority="$4" cost="$5"
    shift 5
    local steps="$*"

    if [ "$DRY_RUN" = "--dry-run" ]; then
        echo "[DRY RUN] Would create: $title (assigned: $agent_id, cost: \$$cost)"
        return 0
    fi

    local body
    body=$(python3 -c "
import json
print(json.dumps({
    'agent_id': '$agent_id',
    'title': '''$title''',
    'description': '''$description''',
    'priority': $priority,
    'estimated_cost_usd': $cost,
    'proposed_steps': $steps,
    'status': 'pending',
    'metadata': {'createdBy': 'THRONE', 'source': 'auto-generator'}
}))
")

    local resp
    resp=$(curl -sf -X POST "$API/proposals" \
        -H "Content-Type: application/json" \
        -d "$body" 2>&1) && \
        echo "✅ Created: $title" || \
        echo "❌ Failed: $title — $resp"
}

# ─── Proposal Templates ───────────────────────────────────────
# Pick based on hour (UTC) to rotate through generals
HOUR=$(date -u +%H | sed 's/^0//')

created=0

# SEER proposals (morning hours 6-10)
if [ "$HOUR" -ge 6 ] && [ "$HOUR" -lt 10 ]; then
    if ! has_similar "btc.*price\|bitcoin.*analysis\|price.*analysis"; then
        post_proposal "SEER" \
            "BTC Price & Momentum Analysis — $(date -u +%b\ %d)" \
            "Analyze current BTC price action, key support/resistance levels, and short-term momentum indicators." \
            75 0.75 \
            '[{"title":"Fetch price data","description":"Gather BTC price, volume, and orderbook data from major exchanges"},{"title":"Technical analysis","description":"Identify key levels, RSI, MACD signals"},{"title":"Summary report","description":"Compile findings with actionable outlook"}]'
        created=$((created + 1))
    fi
    if ! has_similar "sentiment\|fear.*greed"; then
        post_proposal "SEER" \
            "Market Sentiment Scan — $(date -u +%b\ %d)" \
            "Scan crypto market sentiment via Fear & Greed index, social signals, and funding rates." \
            60 0.50 \
            '[{"title":"Gather sentiment data","description":"Collect Fear & Greed, funding rates, social volume"},{"title":"Analyze signals","description":"Identify divergences and notable shifts"},{"title":"Report","description":"Summarize sentiment landscape"}]'
        created=$((created + 1))
    fi
fi

# PHANTOM proposals (midday 10-14)
if [ "$HOUR" -ge 10 ] && [ "$HOUR" -lt 14 ]; then
    if ! has_similar "security.*audit\|dependency.*scan"; then
        post_proposal "PHANTOM" \
            "Dependency Security Scan — $(date -u +%b\ %d)" \
            "Audit all project dependencies for known vulnerabilities and outdated packages." \
            80 1.00 \
            '[{"title":"Scan dependencies","description":"Run audit on all project package manifests"},{"title":"Assess findings","description":"Prioritize vulnerabilities by severity"},{"title":"Report & fix plan","description":"Document findings and recommended fixes"}]'
        created=$((created + 1))
    fi
    if ! has_similar "performance.*review\|code.*review"; then
        post_proposal "PHANTOM" \
            "Code Performance Review — $(date -u +%b\ %d)" \
            "Review critical code paths for performance bottlenecks and optimization opportunities." \
            65 1.50 \
            '[{"title":"Profile hotspots","description":"Identify slow code paths and bottlenecks"},{"title":"Recommend optimizations","description":"Suggest concrete performance improvements"}]'
        created=$((created + 1))
    fi
fi

# GRIMOIRE proposals (afternoon 14-18)
if [ "$HOUR" -ge 14 ] && [ "$HOUR" -lt 18 ]; then
    if ! has_similar "ethereum.*research\|eip.*analysis"; then
        post_proposal "GRIMOIRE" \
            "Ethereum EIP Tracker — $(date -u +%b\ %d)" \
            "Review recent Ethereum Improvement Proposals and assess impact on Dominion projects." \
            70 1.25 \
            '[{"title":"Scan recent EIPs","description":"Identify new and updated EIPs from the past week"},{"title":"Impact analysis","description":"Assess relevance to GrimSwap and ETHJKT"},{"title":"Summary","description":"Compile brief with recommendations"}]'
        created=$((created + 1))
    fi
    if ! has_similar "documentation.*review"; then
        post_proposal "GRIMOIRE" \
            "Documentation Freshness Review — $(date -u +%b\ %d)" \
            "Audit project documentation for staleness, missing sections, and accuracy." \
            50 0.75 \
            '[{"title":"Scan docs","description":"Check all README and doc files for accuracy"},{"title":"Flag issues","description":"List outdated or missing documentation"},{"title":"Update plan","description":"Prioritize documentation updates"}]'
        created=$((created + 1))
    fi
fi

# ECHO proposals (evening 18-22)
if [ "$HOUR" -ge 18 ] && [ "$HOUR" -lt 22 ]; then
    if ! has_similar "content.*strategy\|community.*engagement"; then
        post_proposal "ECHO" \
            "Community Engagement Report — $(date -u +%b\ %d)" \
            "Analyze community activity across channels and recommend engagement strategies." \
            60 0.75 \
            '[{"title":"Gather metrics","description":"Collect engagement data from community channels"},{"title":"Analyze trends","description":"Identify growth patterns and drop-offs"},{"title":"Recommendations","description":"Suggest content and engagement tactics"}]'
        created=$((created + 1))
    fi
fi

# MAMMON proposals (late evening 22-2)
if [ "$HOUR" -ge 22 ] || [ "$HOUR" -lt 2 ]; then
    if ! has_similar "budget.*optimization\|cost.*trend\|cost.*analysis"; then
        post_proposal "MAMMON" \
            "Cost Trend Analysis — $(date -u +%b\ %d)" \
            "Review daily/weekly spending trends across all generals and identify optimization opportunities." \
            70 0.50 \
            '[{"title":"Gather cost data","description":"Pull spending data from API for past 7 days"},{"title":"Trend analysis","description":"Identify cost patterns and anomalies"},{"title":"Optimization report","description":"Recommend budget adjustments"}]'
        created=$((created + 1))
    fi
fi

# WRAITH-EYE proposals (early morning 2-6)
if [ "$HOUR" -ge 2 ] && [ "$HOUR" -lt 6 ]; then
    if ! has_similar "infrastructure.*monitor\|api.*health"; then
        post_proposal "WRAITH-EYE" \
            "Infrastructure Health Check — $(date -u +%b\ %d)" \
            "Comprehensive check of all API endpoints, response times, and error rates." \
            80 0.50 \
            '[{"title":"Ping all endpoints","description":"Check availability and response times for all services"},{"title":"Error analysis","description":"Review recent error logs and patterns"},{"title":"Status report","description":"Compile infrastructure health summary"}]'
        created=$((created + 1))
    fi
fi

# Fallback: if nothing was generated this hour, pick a universal one
if [ "$created" -eq 0 ]; then
    if ! has_similar "defi.*yield\|yield.*tracking"; then
        post_proposal "SEER" \
            "DeFi Yield Opportunity Scan — $(date -u +%b\ %d)" \
            "Scan top DeFi protocols for yield opportunities, comparing risk-adjusted returns." \
            65 1.00 \
            '[{"title":"Scan protocols","description":"Check top DeFi platforms for current yields"},{"title":"Risk assessment","description":"Evaluate protocol risks and sustainability"},{"title":"Opportunity report","description":"Rank opportunities by risk-adjusted return"}]'
        created=$((created + 1))
    fi
fi

echo ""
echo "📊 Proposal generation complete: $created proposal(s) created"
echo "   Pending before: $(echo "$PENDING" | python3 -c 'import sys,json; print(len(json.load(sys.stdin)))' 2>/dev/null || echo '?')"
