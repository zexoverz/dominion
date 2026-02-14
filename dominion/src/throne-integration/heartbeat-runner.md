# THRONE Heartbeat Protocol

The THRONE heartbeat is the autonomous cycle that runs periodically (every ~30min via cron or OpenClaw heartbeat) to keep the Dominion system alive and progressing.

## Heartbeat Sequence

Each heartbeat executes these steps in order:

### 1. Health Check
- Ping `GET /api/health` to verify Dominion API is reachable
- If API is down, log error event and alert Faisal — skip remaining steps
- Script: `curl -sf $API/health`

### 2. Strategic Planner
- Run `strategic-planner.sh` to decide what missions to create today
- Gathers full context: recent missions, pending proposals, costs, idle generals
- Uses day-of-week rotation + override rules (budget, queue, idle generals)
- Creates 0-2 proposals with specific, actionable descriptions
- Writes decision log to `missions/planner-log-YYYY-MM-DD.md`
- Script: `./strategic-planner.sh`

### 3. Auto-Review (Approve + Debate)
- Fetch all pending proposals via `GET /api/proposals?status=pending`
- Auto-approve proposals with cost < $1.00 (low risk)
- For proposals > $1.00, run roundtable debate (generals weigh in)
- Create missions from approved proposals via `POST /api/missions`
- Script: `./auto-review.sh`

### 4. Dispatch Missions (Spawn Sub-Agents)
- Fetch active/approved missions via `GET /api/missions?status=active`
- For each unstarted mission, spawn a sub-agent to execute it
- Sub-agents are isolated — they do their task and report back
- Results are posted to the mission via `PATCH /api/missions/:id`
- Script: `./dispatch-missions.sh` or `./ai-check-and-execute.sh`

### 5. Check Notifications
- Check for any alerts, completed missions, or failed executions
- Notify Faisal of important events (mission results, budget warnings)
- Script: `./notify.sh`

### 6. Budget Check
- Fetch daily cost via `GET /api/costs/daily`
- If cost > $5 → pause all new missions, alert Faisal
- If cost > $3 → log warning, reduce mission priority
- Track cumulative weekly/monthly spend trends
- Script: `./budget-check.sh`

### 7. Log Heartbeat
- POST event to `POST /api/events` with heartbeat summary
- Include: proposals created, missions dispatched, budget status, errors
- This creates an audit trail of all THRONE activity

## Execution Order Matters

The sequence is intentional:
1. **Health first** — don't run anything if API is down
2. **Plan before review** — create new proposals before processing the queue
3. **Review before dispatch** — approve proposals before trying to execute
4. **Dispatch after approval** — only execute approved missions
5. **Notify after actions** — report what happened
6. **Budget last** — final gate to catch overspend

## Override Conditions

| Condition | Action |
|-----------|--------|
| API down | Stop, alert, log error |
| Daily cost > $5 | Skip planner + dispatch, alert Faisal |
| > 3 active missions | Skip planner (queue full) |
| BTC moved > 5% | Force SEER urgent analysis |
| General idle > 5 days | Prioritize their mission |
| Late night (23-08 UTC) | Skip notifications (quiet hours) |

## Cron Schedule

```
# Every 30 minutes during active hours (08:00-23:00 UTC)
*/30 8-22 * * * /data/workspace/dominion/src/throne-integration/heartbeat-runner.sh
# Once at night for overnight catch-up
0 6 * * * /data/workspace/dominion/src/throne-integration/heartbeat-runner.sh
```

## Full Heartbeat Script

The heartbeat runner script chains all steps:

```bash
#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Health check
curl -sf "$API/health" || { echo "API DOWN"; exit 1; }

# 2. Strategic planner
"$DIR/strategic-planner.sh"

# 3. Auto-review
"$DIR/auto-review.sh"

# 4. Dispatch
"$DIR/dispatch-missions.sh" || "$DIR/ai-check-and-execute.sh"

# 5. Notifications
"$DIR/notify.sh" 2>/dev/null || true

# 6. Budget check
"$DIR/budget-check.sh"

# 7. Log heartbeat event
curl -sf -X POST "$API/events" -H "Content-Type: application/json" \
  -d '{"type":"heartbeat","source":"THRONE","message":"Heartbeat complete"}'
```

---
_Part of the THRONE autonomous mission planning system._
