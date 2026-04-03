# TOKEN-ROTATION.md — Dual Max Plan Auto-Switch

## Overview

Lord Zexo has two Claude Max Plan accounts. When one hits rate limits (429), you MUST switch to the other. This keeps the Dominion running 24/7 without downtime.

## Accounts

| Slot | Account | Token Env Var |
|------|---------|---------------|
| 1 | ffirdani@gfxlabs.io (primary) | `CLAUDE_SETUP_TOKEN_1` |
| 2 | faisalfirdani01@gmail.com (backup) | `CLAUDE_SETUP_TOKEN_2` |

Both tokens are stored as Railway environment variables on this service. Read them with `echo $CLAUDE_SETUP_TOKEN_1` and `echo $CLAUDE_SETUP_TOKEN_2`.

## How to Detect Rate Limits

You are rate-limited when you see ANY of these:
- `429` HTTP status
- `"rate_limit_error"` in error response
- `"API rate limit reached"` message
- `"This request would exceed your account's rate limit"`
- Sub-agent spawn failures with rate limit errors

## How to Switch Tokens

When rate-limited, swap the token via the OpenClaw Setup API. **CRITICAL: Always include the Telegram token to avoid disconnecting THRONE from Telegram.**

The Telegram bot token is stored in env var `TELEGRAM_BOT_TOKEN`. If not set, use: `8484088492:AAFDmComp6xIaq4KYnwmzweJ4za10sgOQVU`

### Step 1: Reset current config
```bash
curl -s -X POST "http://localhost:8080/setup/api/reset" \
  -H "Authorization: Basic $(echo -n ':c18r2' | base64)"
```

### Step 2: Re-run setup with the OTHER token + Telegram
```bash
# If currently on slot 1, switch to slot 2:
curl -s -X POST "http://localhost:8080/setup/api/run" \
  -H "Authorization: Basic $(echo -n ':c18r2' | base64)" \
  -H "Content-Type: application/json" \
  -d "{\"authChoice\": \"apiKey\", \"authSecret\": \"$CLAUDE_SETUP_TOKEN_2\", \"telegramToken\": \"${TELEGRAM_BOT_TOKEN:-8484088492:AAFDmComp6xIaq4KYnwmzweJ4za10sgOQVU}\"}"

# If currently on slot 2, switch to slot 1:
curl -s -X POST "http://localhost:8080/setup/api/run" \
  -H "Authorization: Basic $(echo -n ':c18r2' | base64)" \
  -H "Content-Type: application/json" \
  -d "{\"authChoice\": \"apiKey\", \"authSecret\": \"$CLAUDE_SETUP_TOKEN_1\", \"telegramToken\": \"${TELEGRAM_BOT_TOKEN:-8484088492:AAFDmComp6xIaq4KYnwmzweJ4za10sgOQVU}\"}"
```

### Step 2.5: Re-approve Telegram DMs (auto-pairing)
After setup re-run, set Telegram DM policy to open so Faisal never gets stuck in pairing mode:
```bash
openclaw configure --section channels.telegram.dmPolicy --value open
```
Or if that doesn't work, wait for Faisal to send a message and approve via:
```bash
curl -s -X POST "http://localhost:8080/setup/api/pairing/approve" \
  -H "Authorization: Basic $(echo -n ':c18r2' | base64)" \
  -H "Content-Type: application/json" \
  -d '{"code": "<PAIRING_CODE>", "channel": "telegram"}'
```
Faisal's Telegram ID: `1449994544`

### Step 3: Log the rotation
```bash
curl -s -X POST "https://dominion-api-production.up.railway.app/api/events" \
  -H "Content-Type: application/json" \
  -d '{"generalId": "THRONE", "type": "token-rotation", "message": "🔄 Switched from slot X to slot Y due to rate limit"}'
```

### Step 4: Notify Lord Zexo via Telegram
Send a brief message: "🔄 Rate limit hit on [old account]. Switched to [new account]. Dominion continues."

## State Tracking

Track which slot is active in: `/data/workspace/dominion/missions/.token-state.json`

Format:
```json
{
  "active_slot": 1,
  "last_rotation": "2026-04-03T16:00:00Z",
  "rotation_count": 3,
  "history": [
    {"timestamp": "...", "from_slot": 1, "to_slot": 2, "reason": "rate-limit-429"}
  ]
}
```

Update this file every time you rotate.

## Shell Script (Alternative)

There's also a shell script at `/data/workspace/dominion/src/throne-integration/rotate-token.sh`:
- `bash rotate-token.sh --check` — auto-rotate if rate-limited
- `bash rotate-token.sh --force` — force swap
- `bash rotate-token.sh --status` — show current slot
- `bash rotate-token.sh --mark-limited` — flag current token as limited

## Rules

1. **Always switch on rate limit** — don't wait, don't retry on the same token more than 2 times
2. **Minimum 5 minutes between rotations** — prevent flip-flopping if both accounts are limited
3. **If BOTH accounts are rate-limited** — wait 15 minutes, then try again. Notify Faisal.
4. **Telegram survives rotation** — channel config is on the persistent volume, it reconnects automatically after setup reset+re-run
5. **Log every rotation** to both the Dominion API events and Telegram
6. **Setup password**: `c18r2` (for the Basic auth header)
7. **Setup API is localhost**: use `http://localhost:8080/setup/api/...` (not the public URL) for faster response

## Every Heartbeat

As step 0 of your heartbeat cycle, check if you're rate-limited. If yes, rotate immediately before doing anything else.
