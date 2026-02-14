# HEARTBEAT.md — Dominion Heartbeat

## Instructions
Read `/data/workspace/dominion/src/throne-integration/heartbeat-runner.md` for full protocol.

## Quick Cycle (every heartbeat)
1. `GET https://dominion-api-production.up.railway.app/` — if down, log & report
2. Run `bash /data/workspace/dominion/src/throne-integration/auto-review.sh` — auto-approve cheap proposals, create missions, execute
3. `GET /api/missions?status=active` — check for stalls (>1h no progress)
4. `GET /api/costs/daily` — warn >$5, alert Faisal >$10
5. `POST /api/events` — log heartbeat with summary stats
6. Check `memory/heartbeat-state.json` — if >4h since last proposal gen, generate 1-2 new proposals
7. If 01:00 UTC and no briefing today → run daily briefing, send to Faisal via Telegram

## Rules
- Minimize token burn: only fetch what's needed, keep responses short
- If all nominal → `HEARTBEAT_OK`
- If noteworthy → brief summary of actions taken
- Don't message Faisal between 23:00-07:00 WIB unless critical (budget >$10 or API down >1h)
