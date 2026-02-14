#!/usr/bin/env bash
set -euo pipefail

# strategic-planner.sh — THRONE Strategic Mission Planner
# Intelligently decides what missions to create each day based on context,
# priorities, day of week, budget, and what's already been done.

API="https://dominion-api-production.up.railway.app/api"
LOG_DIR="/data/workspace/dominion/missions"
TODAY=$(date -u +%Y-%m-%d)
DAY_OF_WEEK=$(date -u +%A)
HOUR=$(date -u +%H)
LOG_FILE="$LOG_DIR/planner-log-${TODAY}.md"
DRY_RUN="${1:-}"

mkdir -p "$LOG_DIR"

log() { echo "[$(date -u +%H:%M:%S)] planner: $*"; }

# ═══════════════════════════════════════════════════════
# 1. GATHER CONTEXT
# ═══════════════════════════════════════════════════════
log "Gathering context..."

# Recent missions (last 7 days)
MISSIONS_RAW=$(curl -sf "$API/missions" 2>/dev/null || echo "[]")
# Pending proposals
PROPOSALS_RAW=$(curl -sf "$API/proposals?status=pending" 2>/dev/null || echo "[]")
# Recent events
EVENTS_RAW=$(curl -sf "$API/events?limit=20" 2>/dev/null || echo "[]")
# Daily cost
COST_RAW=$(curl -sf "$API/costs/daily" 2>/dev/null || echo '{"total":0}')

# Parse context with Python
CONTEXT=$(python3 << 'PYEOF'
import json, sys
from datetime import datetime, timedelta

def safe_load(env_var, raw):
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            return data.get('data', data.get('missions', data.get('proposals', data.get('events', [data]))))
        return data if isinstance(data, list) else []
    except:
        return []

missions_raw = '''MISSIONS_PLACEHOLDER'''
proposals_raw = '''PROPOSALS_PLACEHOLDER'''
events_raw = '''EVENTS_PLACEHOLDER'''
cost_raw = '''COST_PLACEHOLDER'''

missions = safe_load('missions', missions_raw)
proposals = safe_load('proposals', proposals_raw)
events = safe_load('events', events_raw)

try:
    cost_data = json.loads(cost_raw)
    daily_cost = float(cost_data.get('total', cost_data.get('totalCost', cost_data.get('cost', 0))))
except:
    daily_cost = 0.0

# Count active missions
active_count = sum(1 for m in missions if m.get('status') in ('active', 'in_progress', 'pending', 'running'))

# Recent mission titles (last 7 days)
now = datetime.utcnow()
week_ago = now - timedelta(days=7)
recent_titles = []
for m in missions:
    created = m.get('createdAt', m.get('created_at', ''))
    title = m.get('title', '')
    if title:
        recent_titles.append(title.lower())

# Pending proposal titles
pending_titles = [p.get('title', '').lower() for p in proposals]
pending_count = len(proposals)

# Track which generals ran recently
general_last_run = {}
for m in missions:
    agent = m.get('agentId', m.get('agent_id', m.get('assignedTo', m.get('general', ''))))
    created = m.get('createdAt', m.get('created_at', ''))
    if agent and created:
        if agent not in general_last_run or created > general_last_run[agent]:
            general_last_run[agent] = created

# Find generals idle >5 days
idle_generals = []
all_generals = ['SEER', 'PHANTOM', 'GRIMOIRE', 'ECHO', 'MAMMON', 'WRAITH-EYE']
for g in all_generals:
    last = general_last_run.get(g, general_last_run.get(g.lower(), ''))
    if not last:
        idle_generals.append(g)
    else:
        try:
            last_dt = datetime.fromisoformat(last.replace('Z', '+00:00').replace('+00:00', ''))
            if (now - last_dt).days > 5:
                idle_generals.append(g)
        except:
            pass

result = {
    'daily_cost': daily_cost,
    'active_count': active_count,
    'pending_count': pending_count,
    'recent_titles': recent_titles[:30],
    'pending_titles': pending_titles,
    'idle_generals': idle_generals,
    'total_missions': len(missions),
}
print(json.dumps(result))
PYEOF
)

# Inject actual data into the Python script
CONTEXT=$(echo "$MISSIONS_RAW" | python3 -c "
import json, sys
from datetime import datetime, timedelta

def safe_load(raw):
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            for k in ('data','missions','proposals','events'):
                if k in data:
                    return data[k]
            return [data]
        return data if isinstance(data, list) else []
    except:
        return []

missions = safe_load(sys.stdin.read())
" 2>/dev/null || echo '{}')

# Simpler approach: parse each piece individually
DAILY_COST=$(echo "$COST_RAW" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    print(d.get('total',d.get('totalCost',d.get('cost',0))))
except: print(0)
" 2>/dev/null || echo "0")

ACTIVE_COUNT=$(echo "$MISSIONS_RAW" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    m=d if isinstance(d,list) else d.get('data',d.get('missions',[]))
    print(sum(1 for x in m if x.get('status') in ('active','in_progress','pending','running')))
except: print(0)
" 2>/dev/null || echo "0")

RECENT_TITLES=$(echo "$MISSIONS_RAW" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    m=d if isinstance(d,list) else d.get('data',d.get('missions',[]))
    for x in m: print(x.get('title','').lower())
except: pass
" 2>/dev/null || echo "")

PENDING_TITLES=$(echo "$PROPOSALS_RAW" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    m=d if isinstance(d,list) else d.get('data',d.get('proposals',[]))
    for x in m: print(x.get('title','').lower())
except: pass
" 2>/dev/null || echo "")

PENDING_COUNT=$(echo "$PROPOSALS_RAW" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    m=d if isinstance(d,list) else d.get('data',d.get('proposals',[]))
    print(len(m))
except: print(0)
" 2>/dev/null || echo "0")

IDLE_GENERALS=$(echo "$MISSIONS_RAW" | python3 -c "
import json,sys
from datetime import datetime,timedelta
try:
    d=json.load(sys.stdin)
    m=d if isinstance(d,list) else d.get('data',d.get('missions',[]))
    now=datetime.utcnow()
    last_run={}
    for x in m:
        a=x.get('agentId',x.get('agent_id',x.get('assignedTo',x.get('general',''))))
        c=x.get('createdAt',x.get('created_at',''))
        if a and c:
            if a not in last_run or c>last_run[a]: last_run[a]=c
    generals=['SEER','PHANTOM','GRIMOIRE','ECHO','MAMMON','WRAITH-EYE']
    idle=[]
    for g in generals:
        found=last_run.get(g,last_run.get(g.lower(),''))
        if not found: idle.append(g); continue
        try:
            dt=datetime.fromisoformat(found.replace('Z','').split('+')[0])
            if (now-dt).days>5: idle.append(g)
        except: pass
    print(','.join(idle))
except: print('SEER,PHANTOM,GRIMOIRE,ECHO,MAMMON,WRAITH-EYE')
" 2>/dev/null || echo "")

log "Context gathered: cost=\$$DAILY_COST active=$ACTIVE_COUNT pending=$PENDING_COUNT day=$DAY_OF_WEEK"
log "Idle generals: ${IDLE_GENERALS:-none}"

# ═══════════════════════════════════════════════════════
# 2. DECISION LOGIC
# ═══════════════════════════════════════════════════════
log "Running decision logic..."

DECISIONS=$(python3 << PYEOF
import json

day = "$DAY_OF_WEEK"
daily_cost = float("$DAILY_COST")
active_count = int("$ACTIVE_COUNT")
pending_count = int("$PENDING_COUNT")
idle_generals = [g for g in "$IDLE_GENERALS".split(',') if g]
recent_titles = """$RECENT_TITLES""".strip().split('\n') if """$RECENT_TITLES""".strip() else []
pending_titles = """$PENDING_TITLES""".strip().split('\n') if """$PENDING_TITLES""".strip() else []
all_titles = recent_titles + pending_titles

proposals = []
reasons = []
skip_reason = None

# Override: budget exceeded
if daily_cost > 5.0:
    skip_reason = f"Daily cost \${daily_cost:.2f} exceeds \$5 budget — skipping new missions, alerting Faisal"

# Override: queue full
elif active_count > 3:
    skip_reason = f"{active_count} active missions — queue full, waiting for completions"

else:
    def is_duplicate(title):
        t = title.lower()
        return any(t in existing or existing in t for existing in all_titles if existing.strip())

    # Day-based mission selection
    day_missions = {
        "Monday": [
            {"general": "PHANTOM", "title": "PHANTOM security audit — dependency vulnerabilities and exposed secrets scan",
             "description": "Run comprehensive security scan: check npm/pip dependencies for CVEs, scan repos for exposed API keys or secrets, review Dominion API endpoint security, report findings with severity levels.",
             "cost": 0.50},
            {"general": "WRAITH-EYE", "title": "WRAITH-EYE network monitoring — anomaly detection and uptime check",
             "description": "Monitor all Dominion services for uptime, check Railway deployment health, scan for unusual API traffic patterns, verify SSL certificates and DNS records.",
             "cost": 0.40},
        ],
        "Tuesday": [
            {"general": "SEER", "title": f"SEER BTC deep analysis — institutional flows, whale movements, and macro signals",
             "description": "Go beyond price: analyze institutional news (ETF flows, corporate treasury moves), whale wallet movements (>100 BTC transfers), macro indicators (DXY, bonds, Fed signals), on-chain metrics (exchange reserves, MVRV). Provide actionable thesis, not just numbers.",
             "cost": 0.60},
        ],
        "Wednesday": [
            {"general": "GRIMOIRE", "title": "GRIMOIRE research — EIP tracker update and tech trend analysis",
             "description": "Check latest EIP proposals and status changes, review Ethereum roadmap updates, scan for relevant tech trends (L2s, AA, ZK), identify ETHJKT curriculum improvement opportunities based on ecosystem changes.",
             "cost": 0.50},
        ],
        "Thursday": [
            {"general": "ECHO", "title": "ECHO content strategy — community engagement and social content plan",
             "description": "Analyze recent crypto/web3 social trends, propose 3-5 tweet ideas or thread topics, suggest community engagement tactics for ETHJKT, identify trending topics Faisal could comment on for visibility.",
             "cost": 0.40},
        ],
        "Friday": [
            {"general": "MAMMON", "title": "MAMMON weekly finance review — DCA status, portfolio update, wedding fund",
             "description": "Check weekly DCA execution status, calculate current portfolio allocation vs targets, update wedding fund progress, review any rebalancing needs, flag if any position >20% deviation from target.",
             "cost": 0.50},
        ],
        "Saturday": [
            {"general": "GRIMOIRE", "title": "GRIMOIRE open source scan — curate good-first-issues for ETHJKT students",
             "description": "Scan popular Ethereum/web3 repos (ethers, hardhat, foundry, wagmi, viem, OpenZeppelin) for good-first-issues and help-wanted labels. Filter for beginner-friendly issues with clear scope. Compile list with repo, issue link, difficulty estimate, and skills needed.",
             "cost": 0.60},
        ],
        "Sunday": [
            {"general": "SEER", "title": "SEER Sunday BTC brief — weekly recap and week-ahead outlook",
             "description": "Light weekly BTC summary: price action recap, key events of the week, sentiment snapshot, brief week-ahead outlook. Keep it concise — Sunday is a light day.",
             "cost": 0.30},
        ],
    }

    scheduled = day_missions.get(day, [])

    # Override: idle generals get priority
    for g in idle_generals:
        if g == "SEER" and day not in ("Tuesday", "Sunday"):
            scheduled.insert(0, {"general": "SEER", "title": f"SEER catch-up analysis — BTC and macro update (idle >5 days)",
                "description": "SEER has been idle >5 days. Run standard BTC analysis with price, sentiment, and key news.", "cost": 0.40})
        elif g == "PHANTOM" and day != "Monday":
            scheduled.insert(0, {"general": "PHANTOM", "title": f"PHANTOM catch-up — quick security health check (idle >5 days)",
                "description": "PHANTOM idle >5 days. Run lightweight security check on critical services.", "cost": 0.35})
        elif g == "GRIMOIRE" and day not in ("Wednesday", "Saturday"):
            scheduled.insert(0, {"general": "GRIMOIRE", "title": f"GRIMOIRE catch-up — quick research pulse (idle >5 days)",
                "description": "GRIMOIRE idle >5 days. Quick scan of EIP updates and notable ecosystem news.", "cost": 0.35})
        elif g == "ECHO" and day != "Thursday":
            scheduled.insert(0, {"general": "ECHO", "title": f"ECHO catch-up — trending topics scan (idle >5 days)",
                "description": "ECHO idle >5 days. Quick scan of trending crypto/web3 topics for content opportunities.", "cost": 0.30})
        elif g == "MAMMON" and day != "Friday":
            scheduled.insert(0, {"general": "MAMMON", "title": f"MAMMON catch-up — quick portfolio check (idle >5 days)",
                "description": "MAMMON idle >5 days. Quick portfolio health check and any alerts.", "cost": 0.30})

    # Pick top 1-2, skip duplicates
    for mission in scheduled[:3]:
        if len(proposals) >= 2:
            break
        if is_duplicate(mission["title"]):
            reasons.append(f"SKIP: '{mission['title'][:50]}...' — duplicate found in recent missions")
            continue
        proposals.append(mission)
        reasons.append(f"SELECT: {mission['general']} — {mission['title'][:60]}")

    if not proposals:
        reasons.append("No new proposals needed — all candidates were duplicates or queue is full")

result = {
    "proposals": proposals,
    "reasons": reasons,
    "skip_reason": skip_reason,
}
print(json.dumps(result))
PYEOF
)

log "Decision made."

# ═══════════════════════════════════════════════════════
# 3. CREATE PROPOSALS
# ═══════════════════════════════════════════════════════

SKIP_REASON=$(echo "$DECISIONS" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('skip_reason','') or '')")

if [ -n "$SKIP_REASON" ]; then
    log "⚠️  SKIPPING: $SKIP_REASON"
else
    PROPOSAL_COUNT=$(echo "$DECISIONS" | python3 -c "import json,sys; print(len(json.load(sys.stdin)['proposals']))")
    log "Creating $PROPOSAL_COUNT proposals..."

    if [ "$DRY_RUN" != "--dry-run" ]; then
        echo "$DECISIONS" | python3 -c "
import json, sys, subprocess

decisions = json.load(sys.stdin)
for p in decisions['proposals']:
    payload = json.dumps({
        'title': p['title'],
        'description': p['description'],
        'agent_id': p['general'],
        'estimated_cost_usd': str(p['cost']),
        'metadata': {'source': 'strategic-planner'}
    })
    result = subprocess.run(
        ['curl', '-sf', '-X', 'POST',
         'https://dominion-api-production.up.railway.app/api/proposals',
         '-H', 'Content-Type: application/json',
         '-d', payload],
        capture_output=True, text=True
    )
    status = 'OK' if result.returncode == 0 else f'FAIL ({result.returncode})'
    print(f'  → {p[\"general\"]}: {status} — {p[\"title\"][:60]}')
"
    else
        log "[DRY RUN] Would create proposals — skipping API calls"
    fi
fi

# ═══════════════════════════════════════════════════════
# 4. WRITE DECISION LOG
# ═══════════════════════════════════════════════════════

echo "$DECISIONS" | python3 -c "
import json, sys
from datetime import datetime

d = json.load(sys.stdin)
day = '$DAY_OF_WEEK'
today = '$TODAY'
hour = '$HOUR'
cost = '$DAILY_COST'
active = '$ACTIVE_COUNT'
pending = '$PENDING_COUNT'
idle = '$IDLE_GENERALS'

lines = []
lines.append(f'# THRONE Strategic Planner — {today}')
lines.append(f'')
lines.append(f'**Day:** {day} | **Time:** {hour}:00 UTC | **Daily Cost:** \${cost}')
lines.append(f'**Active Missions:** {active} | **Pending Proposals:** {pending}')
lines.append(f'**Idle Generals (>5d):** {idle if idle else \"none\"}')
lines.append(f'')
lines.append(f'## Decision')
lines.append(f'')

if d.get('skip_reason'):
    lines.append(f'⚠️ **SKIPPED:** {d[\"skip_reason\"]}')
else:
    for r in d.get('reasons', []):
        lines.append(f'- {r}')

lines.append(f'')
lines.append(f'## Proposals Created')
lines.append(f'')

if d['proposals']:
    for p in d['proposals']:
        lines.append(f'### {p[\"general\"]}')
        lines.append(f'- **Title:** {p[\"title\"]}')
        lines.append(f'- **Cost:** \${p[\"cost\"]:.2f}')
        lines.append(f'- **Description:** {p[\"description\"]}')
        lines.append(f'')
else:
    lines.append('_No proposals created this run._')

lines.append(f'')
lines.append(f'---')
lines.append(f'_Generated by strategic-planner.sh at {datetime.utcnow().strftime(\"%H:%M:%S\")} UTC_')

print('\n'.join(lines))
" > "$LOG_FILE"

log "Decision log written to $LOG_FILE"

# ═══════════════════════════════════════════════════════
# 5. LOG EVENT TO API
# ═══════════════════════════════════════════════════════

PROPOSAL_TITLES=$(echo "$DECISIONS" | python3 -c "
import json,sys
d=json.load(sys.stdin)
if d.get('skip_reason'):
    print(f'SKIPPED: {d[\"skip_reason\"][:100]}')
else:
    print(', '.join(p['general'] for p in d['proposals']) or 'none')
" 2>/dev/null || echo "unknown")

if [ "$DRY_RUN" != "--dry-run" ]; then
    curl -sf -X POST "$API/events" \
        -H "Content-Type: application/json" \
        -d "$(python3 -c "
import json
print(json.dumps({
    'type': 'strategic-planner',
    'source': 'THRONE',
    'message': 'Strategic planner run: $PROPOSAL_TITLES',
    'metadata': {'day': '$DAY_OF_WEEK', 'cost': '$DAILY_COST', 'proposals': '$PROPOSAL_TITLES'}
}))
")" > /dev/null 2>&1 || true
fi

log "✅ Strategic planner complete. Proposals: $PROPOSAL_TITLES"
