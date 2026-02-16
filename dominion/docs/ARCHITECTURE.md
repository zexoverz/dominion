<![CDATA[# Architecture

> Deep technical documentation for the Dominion system.

---

## System Overview

Dominion follows a **hub-and-spoke architecture** where THRONE acts as the central orchestrator dispatching work to 6 specialized generals. All state persists in PostgreSQL. The frontend reads from the same database via API routes.

```
                    ┌──────────────┐
                    │   OpenClaw   │
                    │  (Claude AI) │
                    └──────┬───────┘
                           │ Agent sessions
                           ▼
┌──────────────────────────────────────────────┐
│              THRONE (Orchestrator)            │
│                                              │
│  • Heartbeat loop (every 30 min)             │
│  • Mission dispatch & step execution         │
│  • Roundtable coordination                   │
│  • Daily briefing generation                 │
│  • Cost monitoring & budget enforcement      │
└──────┬───────┬───────┬───────┬───────┬───────┘
       │       │       │       │       │
       ▼       ▼       ▼       ▼       ▼
   GRIMOIRE  ECHO   SEER  PHANTOM  MAMMON  WRAITH-EYE
       │       │       │       │       │       │
       └───────┴───────┴───────┴───────┴───────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Dominion API   │
              │  (Next.js App)  │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
      ┌──────────────┐  ┌──────────────┐
      │  PostgreSQL   │  │   Telegram   │
      │  (Railway)    │  │   Bot API    │
      └──────────────┘  └──────────────┘
```

---

## Data Flow

1. **THRONE heartbeat** fires every 30 minutes via OpenClaw cron
2. THRONE checks general health, pending proposals, active missions
3. If a proposal exists → initiate **roundtable debate**
4. Each general submits a vote with reasoning (in character)
5. On approval → mission created with auto-generated steps
6. Steps execute sequentially, each general handling its domain
7. Progress events written to DB → pushed to Telegram
8. Frontend polls API for live updates

---

## API Endpoints

All routes live under the Next.js App Router at `/api/`.

### Missions
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/missions` | List all missions (with filters) |
| `GET` | `/api/missions/[id]` | Get mission detail + steps |
| `POST` | `/api/missions` | Create a new mission |
| `PATCH` | `/api/missions/[id]` | Update mission status |
| `GET` | `/api/missions/[id]/steps` | List steps for a mission |
| `POST` | `/api/missions/[id]/steps` | Add step to mission |
| `PATCH` | `/api/missions/[id]/steps/[stepId]` | Update step status/output |

### Proposals & Roundtable
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/proposals` | List proposals |
| `POST` | `/api/proposals` | Submit a new proposal |
| `GET` | `/api/proposals/[id]` | Get proposal + votes |
| `POST` | `/api/proposals/[id]/vote` | Submit general vote |
| `POST` | `/api/proposals/[id]/approve` | Force-approve proposal |

### Events & Timeline
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/events` | List system events (paginated) |
| `POST` | `/api/events` | Log a new event |
| `GET` | `/api/events/timeline` | Aggregated timeline view |

### Generals
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/generals` | List all generals + status |
| `GET` | `/api/generals/[name]` | Get general detail |
| `PATCH` | `/api/generals/[name]` | Update general state |
| `GET` | `/api/generals/[name]/missions` | Missions assigned to general |

### Costs & Budget
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/costs` | Cost breakdown (by general, by day) |
| `GET` | `/api/costs/summary` | Total spend summary |
| `POST` | `/api/costs` | Log a cost event |

### SEER / Market
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/seer/btc` | Current BTC price + analysis |
| `GET` | `/api/seer/fear-greed` | Fear & Greed index |
| `GET` | `/api/seer/bloomberg` | Bloomberg mode data composite |

### System
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health` | API health check |
| `GET` | `/api/heartbeat` | THRONE heartbeat status |
| `POST` | `/api/notify` | Send Telegram notification |

---

## Database Schema

### `missions`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `title` | `text` | Mission title |
| `description` | `text` | Full description |
| `status` | `enum` | `proposed` / `approved` / `active` / `completed` / `failed` / `cancelled` |
| `priority` | `enum` | `low` / `medium` / `high` / `critical` |
| `assigned_general` | `text` | Primary general responsible |
| `proposal_id` | `uuid` | FK → proposals |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last update |
| `completed_at` | `timestamptz` | Completion timestamp |
| `metadata` | `jsonb` | Flexible mission data |

### `mission_steps`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `mission_id` | `uuid` | FK → missions |
| `step_number` | `int` | Execution order |
| `title` | `text` | Step title |
| `description` | `text` | What this step does |
| `status` | `enum` | `pending` / `running` / `completed` / `failed` / `skipped` |
| `assigned_general` | `text` | General executing this step |
| `output` | `text` | Step result/output |
| `started_at` | `timestamptz` | Start time |
| `completed_at` | `timestamptz` | End time |

### `proposals`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `title` | `text` | Proposal title |
| `description` | `text` | What's being proposed |
| `proposed_by` | `text` | General who proposed it |
| `status` | `enum` | `pending` / `approved` / `rejected` / `expired` |
| `votes` | `jsonb` | Array of general votes |
| `debate_log` | `jsonb` | Full roundtable transcript |
| `created_at` | `timestamptz` | Timestamp |

### `events`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `type` | `text` | Event type (mission_created, step_completed, alert, etc.) |
| `source` | `text` | Which general generated it |
| `title` | `text` | Short description |
| `details` | `jsonb` | Event payload |
| `created_at` | `timestamptz` | Timestamp |

### `costs`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `general` | `text` | Which general incurred the cost |
| `model` | `text` | Claude model used |
| `input_tokens` | `int` | Tokens in |
| `output_tokens` | `int` | Tokens out |
| `cost_usd` | `decimal` | Estimated cost |
| `mission_id` | `uuid` | FK → missions (nullable) |
| `created_at` | `timestamptz` | Timestamp |

### `general_states`
| Column | Type | Description |
|--------|------|-------------|
| `name` | `text` | Primary key (general name) |
| `status` | `enum` | `online` / `busy` / `offline` / `error` |
| `last_heartbeat` | `timestamptz` | Last check-in |
| `current_mission` | `uuid` | FK → missions (nullable) |
| `metadata` | `jsonb` | General-specific state |

---

## Heartbeat System

THRONE runs a heartbeat cycle every **30 minutes** via OpenClaw's cron system:

1. **Health Check** — Ping each general's status, update `general_states`
2. **Mission Scan** — Check for stalled missions (no progress in >2h)
3. **Proposal Check** — Process any pending proposals through roundtable
4. **Cost Check** — Calculate daily/weekly spend, alert if thresholds exceeded
5. **Briefing** — At 08:00 UTC, compile overnight activity into daily briefing
6. **Notify** — Push any alerts or updates to Telegram

If a general hasn't checked in within 2 heartbeat cycles (1 hour), THRONE flags it and notifies via Telegram.

---

## Mission Lifecycle

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│ PROPOSAL │────▶│ ROUNDTABLE│────▶│ APPROVED │────▶│  MISSION │
│ Created  │     │  DEBATE   │     │  (vote)  │     │ Created  │
└──────────┘     └───────────┘     └──────────┘     └─────┬────┘
                                                          │
                 ┌──────────┐     ┌──────────┐           │
                 │ COMPLETED│◀────│ EXECUTING│◀──────────┘
                 │ + Report │     │  Steps   │
                 └──────────┘     └──────────┘
```

1. **Proposal** — Any general (or THRONE) creates a proposal with title, description, priority
2. **Roundtable** — Each general receives the proposal and submits a vote (`approve`/`reject`/`abstain`) with in-character reasoning
3. **Approval** — If majority approves (or THRONE overrides), proposal converts to mission
4. **Step Generation** — THRONE breaks the mission into ordered steps, assigns each to a general
5. **Execution** — Steps run sequentially. Each general processes its step and writes output
6. **Completion** — When all steps finish, mission marked complete. Summary pushed to Telegram
7. **Failure Handling** — Failed steps can retry (up to 3x) or escalate to THRONE

---

## Notification Pipeline

```
Event occurs (mission update, alert, scan result)
    │
    ▼
Event logged to PostgreSQL `events` table
    │
    ▼
Notification formatter (per event type)
    │
    ▼
Telegram Bot API → User's chat
```

Notification types:
- 🗡️ **Mission updates** — Created, step completed, mission done/failed
- 🛡️ **Security alerts** — PHANTOM scan results, vulnerabilities found
- 💰 **Cost alerts** — Budget thresholds crossed
- 📊 **Daily briefings** — Morning summary of all activity
- ⚠️ **System alerts** — General offline, heartbeat failures

---

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Command center — general status grid, recent activity, system health |
| `/missions` | Mission list with filters (status, general, priority) |
| `/missions/[id]` | Mission detail — steps, progress, timeline |
| `/roundtable` | Active and past debates with vote breakdowns |
| `/seer` | Bloomberg mode — BTC price, Fear & Greed, market analysis |
| `/phantom` | Security scan reports and API health history |
| `/costs` | Cost dashboard — spend by general, by day, budget tracking |
| `/events` | Full event timeline with search and filters |
| `/settings` | System configuration, general management |

All routes use the pixel art RPG theme with custom components: health bars for progress, pixel borders, retro typography, dark theme with accent colors per general.

---

## Deployment Architecture (Railway)

```
Railway Project: dominion
├── Service: dominion-frontend
│   ├── Next.js 14 (App Router)
│   ├── Build: next build
│   ├── Port: 3000
│   └── Domain: dominion-frontend-production.up.railway.app
│
├── Service: dominion-api (same Next.js app, API routes)
│   └── Shares DB connection
│
└── Database: PostgreSQL
    ├── Railway managed
    ├── Auto-backups
    └── Internal networking (no public exposure)
```

OpenClaw runs separately, connecting to the Dominion API via HTTPS to read/write missions, events, and costs. THRONE's heartbeat cron triggers the orchestration loop.
]]>