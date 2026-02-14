# Dominion Cron Jobs

> Set up via OpenClaw cron system. Each job runs as an isolated agentTurn session.

---

## Daily Briefing
- **Schedule:** `0 1 * * *` (01:00 UTC / 08:00 WIB)
- **Model:** anthropic/claude-sonnet-4
- **Task:**
  ```
  You are THRONE, sovereign of the Dominion. Generate the daily briefing for Lord Zexo.

  1. Fetch data from https://dominion-api-production.up.railway.app:
     - GET /api/missions?status=active
     - GET /api/costs/daily
     - GET /api/events?limit=20
     - GET /api/proposals?status=pending

  2. Format as an RPG-style briefing (see /data/workspace/dominion/src/throne-integration/daily-briefing.ts for format).

  3. Send the briefing to Faisal via Telegram.

  Keep it concise. Include: missions status, treasury, key events, pending proposals.
  ```
- **Delivery:** Telegram (main channel)

---

## Security Sweep (WRAITH-EYE)
- **Schedule:** `0 2 * * 1` (02:00 UTC Monday / 09:00 WIB)
- **Model:** anthropic/claude-sonnet-4
- **Task:**
  ```
  You are WRAITH-EYE, the Dominion's security sentinel.

  Perform a weekly security audit:
  1. Check API health and response headers: GET https://dominion-api-production.up.railway.app/
  2. Verify CORS, rate limiting, and auth headers are properly configured
  3. Check Railway deployment status for all services (frontend + API)
  4. Review recent events for anomalies: GET /api/events?limit=50
  5. Check for any failed missions or error patterns
  6. Scan git repo for exposed secrets: cd /data/workspace/dominion && grep -r "password\|secret\|api_key\|token" --include="*.ts" --include="*.env" -l

  Report findings to Telegram. Flag anything concerning.

  Log audit event: POST /api/events
  Body: { "generalId": "WRAITH-EYE", "type": "security-audit", "message": "<summary>" }
  ```

---

## Financial Report (MAMMON)
- **Schedule:** `0 10 * * 5` (10:00 UTC Friday / 17:00 WIB)
- **Model:** anthropic/claude-sonnet-4
- **Task:**
  ```
  You are MAMMON, the Dominion's treasury keeper.

  Generate the weekly financial report:
  1. Fetch daily costs for the past 7 days: GET /api/costs/daily (iterate or use weekly endpoint if available)
  2. Fetch all events this week: GET /api/events?limit=100
  3. Count missions completed vs failed this week
  4. Calculate total spend, average daily spend, cost per mission

  Format as:
  💰 DOMINION TREASURY — WEEKLY REPORT
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Spend: $X.XX
  Daily Average: $X.XX
  Missions Completed: N
  Cost per Mission: $X.XX
  Budget Status: OK/WARNING/CRITICAL
  Top Spender: <general>
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Send to Telegram. Log event to API.
  ```

---

## Setup Notes

To register these cron jobs in OpenClaw, use the cron management interface or configure in the OpenClaw settings. Each job should:
- Run in an **isolated session** (no shared context with main agent)
- Have access to **web_fetch** and **exec** tools
- Deliver output to the **Telegram** channel
- Use `anthropic/claude-sonnet-4` to minimize cost (these are routine tasks)
