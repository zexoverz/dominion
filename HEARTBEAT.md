# HEARTBEAT.md — Dominion Heartbeat

## Instructions
Read `/data/workspace/dominion/src/throne-integration/heartbeat-runner.md` for full protocol.

## Quick Cycle (every heartbeat)
1. `GET https://dominion-api-production.up.railway.app/` — if down, log & report
2. Run `bash /data/workspace/dominion/src/throne-integration/auto-review.sh` — auto-approve cheap proposals, create missions, execute
3. Run `bash /data/workspace/dominion/src/throne-integration/dispatch-missions.sh` — read output JSON lines. For each, spawn a sub-agent with `sessions_spawn` using the prompt from the prompt_file. Use model `anthropic/claude-sonnet-4` and the label from output.
4. `GET /api/missions?status=active` — check for stalls (>1h no progress)
4. `GET /api/costs/daily` — warn >$5, alert Faisal >$10
5. Check `/data/workspace/dominion/notifications/` — send any queued notifications to Faisal via Telegram (use `message` tool), then delete the file
6. Run `bash /data/workspace/dominion/src/throne-integration/budget-check.sh` — auto-checks cost thresholds
7. `POST /api/events` — log heartbeat with summary stats
8. Check `memory/heartbeat-state.json` — if >4h since last proposal gen, generate 1-2 new proposals
9. If 01:00 UTC and no briefing today → run daily briefing, send to Faisal via Telegram

## Rules
- Minimize token burn: only fetch what's needed, keep responses short
- If all nominal → `HEARTBEAT_OK`
- If noteworthy → brief summary of actions taken
- Don't message Faisal between 23:00-07:00 WIB unless critical (budget >$10 or API down >1h)
