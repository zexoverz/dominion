<![CDATA[# Setup Guide

> Deploy your own Dominion instance.

---

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- [OpenClaw](https://openclaw.ai) account with Claude access
- [Railway](https://railway.app) account (or any PostgreSQL + hosting provider)
- PostgreSQL 15+
- Telegram Bot (via [@BotFather](https://t.me/BotFather))

---

## Environment Variables

Create a `.env` file or set these in your Railway service:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dominion

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# OpenClaw
OPENCLAW_API_KEY=your-openclaw-key

# App
NEXT_PUBLIC_APP_URL=https://your-domain.up.railway.app
NODE_ENV=production

# Budget (optional)
DAILY_COST_ALERT_USD=5.00
WEEKLY_COST_ALERT_USD=25.00

# SEER Market APIs (optional)
COINGECKO_API_KEY=your-key
FEAR_GREED_API_URL=https://api.alternative.me/fng/
```

---

## Database Setup

### Option A: Railway (Recommended)

1. Create a new project on Railway
2. Add a PostgreSQL plugin
3. Railway auto-provisions and provides `DATABASE_URL`

### Option B: Manual PostgreSQL

```bash
createdb dominion
```

### Run Migrations

```bash
# From the project root
npx prisma migrate deploy
# or if using raw SQL:
psql $DATABASE_URL < sql/schema.sql
```

Core tables created:
- `missions` — Mission records
- `mission_steps` — Individual execution steps
- `proposals` — Roundtable proposals
- `events` — System event log
- `costs` — API cost tracking
- `general_states` — General health/status

---

## Deployment

### Railway Deployment

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

Railway auto-detects Next.js and configures the build. Set your environment variables in the Railway dashboard.

### Manual Deployment

```bash
# Install dependencies
npm install

# Build
npm run build

# Start
npm start
```

---

## OpenClaw Configuration

### 1. Set Up THRONE Agent

Configure your OpenClaw agent as THRONE — the central orchestrator. THRONE needs:
- Access to the Dominion API (read/write missions, events, costs)
- A heartbeat cron job (every 30 minutes)
- Telegram notification capability

### 2. Heartbeat Cron

Set up a cron in OpenClaw that fires every 30 minutes:

```
*/30 * * * *
```

The heartbeat should:
1. Check general health via `GET /api/generals`
2. Process pending proposals via `GET /api/proposals?status=pending`
3. Check cost thresholds via `GET /api/costs/summary`
4. Run daily briefing at 08:00 UTC

### 3. General Sub-Agents

Each general can run as a sub-agent spawned by THRONE, or as independent OpenClaw sessions. The key is that each general:
- Has a defined personality and system prompt
- Can read/write to the Dominion API
- Participates in roundtable votes when called

---

## Telegram Bot Setup

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create a new bot: `/newbot`
3. Copy the bot token → `TELEGRAM_BOT_TOKEN`
4. Start a chat with your bot
5. Get your chat ID (send a message, then check `https://api.telegram.org/bot<TOKEN>/getUpdates`)
6. Set `TELEGRAM_CHAT_ID`

---

## Configuration

### General Personalities

Each general's personality is defined in their system prompt. You can customize these in your OpenClaw agent configuration. See [GENERALS.md](GENERALS.md) for the default personalities.

### Budget Thresholds

Adjust cost alerts in environment variables:
- `DAILY_COST_ALERT_USD` — Alert when daily spend exceeds this
- `WEEKLY_COST_ALERT_USD` — Alert when weekly spend exceeds this

MAMMON monitors these automatically during heartbeat cycles.

### Heartbeat Frequency

Default: every 30 minutes. Adjust the cron schedule if you want more or less frequent checks. More frequent = more responsive but higher cost.

### Mission Auto-Approval

By default, proposals need roundtable votes. For trusted recurring missions (daily briefings, scheduled scans), you can set auto-approval rules in THRONE's configuration.

---

## Verify Installation

After deploying:

1. **Check API health:** `curl https://your-domain/api/health`
2. **Check frontend:** Visit your domain in a browser
3. **Test Telegram:** `curl -X POST https://your-domain/api/notify -d '{"message":"Dominion online."}'`
4. **Trigger heartbeat:** Run THRONE's heartbeat manually and verify generals respond

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| DB connection fails | Check `DATABASE_URL` format and Railway networking |
| Telegram not sending | Verify bot token and chat ID. Ensure bot is started |
| Frontend blank | Check build logs. Ensure `NEXT_PUBLIC_APP_URL` is set |
| Generals not responding | Verify OpenClaw agent sessions are running |
| High costs | Check MAMMON's cost report. Consider switching Opus → Sonnet for routine tasks |
]]>