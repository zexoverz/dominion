<![CDATA[<div align="center">

# ⚔️ DOMINION

### A Sovereign Multi-Agent AI Command System

**7 autonomous AI generals. Roundtable debates. Pixel RPG dashboard.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app)
[![Claude](https://img.shields.io/badge/Claude_Opus_%7C_Sonnet-cc785c?style=flat-square)](https://anthropic.com)
[![Lines](https://img.shields.io/badge/18%2C000%2B_lines-blue?style=flat-square)]()
[![Agents](https://img.shields.io/badge/7_AI_Generals-gold?style=flat-square)]()

[**🏰 Live Demo**](https://dominion-frontend-production.up.railway.app) · [**📐 Architecture**](docs/ARCHITECTURE.md) · [**⚔️ The Generals**](docs/GENERALS.md) · [**🚀 Deploy Your Own**](docs/SETUP.md)

</div>

---

## 💡 The Problem

Managing multiple AI agents is chaos. You end up with:
- Disconnected conversations across tools
- No memory between sessions  
- No coordination between specialized tasks
- No audit trail of what happened and why

## 🏰 The Solution

Dominion is a **closed-loop multi-agent system** where 7 specialized AI generals operate autonomously under a central command structure. Each general has a distinct role, personality, and decision-making authority.

When a new operation is proposed, generals **debate it in character** at a roundtable — weighing risks, costs, and priorities — before voting to approve or reject. Approved missions execute through structured steps with real-time tracking, automated reporting, and Telegram notifications.

**This isn't a chatbot wrapper.** It's an autonomous operations layer with a pixel art RPG frontend.

---

## 🔄 How It Works

```
 ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌───────────┐
 │ PROPOSAL │────▶│  ROUNDTABLE  │────▶│ AUTO-APPROVE │────▶│  MISSION  │
 │          │     │   DEBATE     │     │   (if pass)  │     │  CREATED  │
 └──────────┘     └──────────────┘     └──────────────┘     └─────┬─────┘
                   Generals argue                                  │
                   in character,                                   ▼
                   vote with reasoning              ┌──────────────────────┐
                                                    │   STEP EXECUTION     │
 ┌──────────┐     ┌──────────────┐                  │                      │
 │  NOTIFY  │◀────│   REPORT     │◀─────────────────│  research → analyze  │
 │ Telegram │     │  GENERATED   │                  │  → code → test →     │
 └──────────┘     └──────────────┘                  │    deploy → verify   │
                                                    └──────────────────────┘
```

**Every mission is traceable.** Every decision has reasoning. Every step has a status.

---

## ⚔️ The 7 Generals

Each general is a specialized AI agent with its own personality and domain expertise.

| | General | Domain | What It Does |
|---|---------|--------|-------------|
| 👑 | **THRONE** | Command | Central orchestrator. Runs heartbeat every 30 min. Dispatches missions. Coordinates all generals. |
| 📚 | **GRIMOIRE** | Knowledge | Research synthesis, documentation, knowledge graphs. The institutional memory. |
| 🔊 | **ECHO** | Communications | Community management, content strategy, social presence. The public voice. |
| 🔮 | **SEER** | Intelligence | Live BTC price, Fear & Greed index, market analysis. Bloomberg terminal in pixel art. |
| 👻 | **PHANTOM** | Security | 13-point security audits, API health checks, SSL/CORS scans. The paranoid one. |
| 💰 | **MAMMON** | Finance | DCA tracking, portfolio analysis, budget enforcement, cost alerts. Counts every satoshi. |
| 👁️ | **WRAITH-EYE** | Monitoring | Continuous system monitoring, anomaly detection, uptime tracking. Never sleeps. |

> **Generals don't just execute — they think.** PHANTOM might flag security risks on a deployment. MAMMON might question the cost. SEER might note market conditions that affect timing. Each votes with reasoning at the roundtable.

[**Read full general lore & capabilities →**](docs/GENERALS.md)

---

## 🏗️ Architecture

```
                    ┌─────────────────────┐
                    │     👤 USER          │
                    │  Telegram / Web UI   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                 ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │ 🏰 Frontend  │  │ 📱 Telegram  │  │ 👑 OpenClaw  │
   │  Next.js 14  │  │ Notifications│  │  THRONE AI   │
   │  Pixel RPG   │  │  Real-time   │  │ Orchestrator │
   └──────┬───────┘  └──────────────┘  └──────┬───────┘
          │                                     │
          │           REST API                  │ Sub-agents
          ▼                                     ▼
   ┌────────────────────────────────────────────────────┐
   │                 ⚙️ Dominion API                     │
   │            Express + TypeScript (Railway)           │
   │                                                    │
   │  /api/missions    /api/proposals    /api/events    │
   │  /api/generals    /api/roundtable   /api/costs     │
   │  /api/reports     /api/steps        /api/health    │
   └────────────────────────┬───────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ 🗄️ PostgreSQL    │
                  │ Railway Managed  │
                  │                  │
                  │ • missions       │
                  │ • mission_steps  │
                  │ • proposals      │
                  │ • events         │
                  │ • costs          │
                  │ • general_states │
                  └──────────────────┘
```

[**Read full architecture deep dive →**](docs/ARCHITECTURE.md)

---

## ✨ Features

### 🗳️ Roundtable Debates
Generals debate proposals in character before voting. Not a simple yes/no — each general provides reasoning based on their domain expertise. Consensus required before mission execution.

### 📊 SEER Bloomberg Mode  
Real-time market intelligence dashboard with live BTC price, Fear & Greed index, news headlines, and automated war chest deployment triggers based on ATH drawdown thresholds.

### 🛡️ PHANTOM Security Scans
Automated 13-point security audits covering API endpoints, SSL certificates, CORS policies, exposed headers, rate limiting, and more. Weekly scheduled scans with Telegram alerts on findings.

### 💰 MAMMON Financial Tracking
DCA performance monitoring, wedding fund tracking, war chest management, and automated budget enforcement. Cost alerts at configurable thresholds ($5 warn, $10 critical).

### 🏰 Pixel Art RPG Dashboard
**9 routes**, all wired to live API data:

| Route | Description |
|-------|-------------|
| `/` | Throne Room — command center with general status bubbles |
| `/missions` | Mission board — active quests with progress bars |
| `/missions/[id]` | Mission detail — expandable steps with tutorial instructions |
| `/roundtable` | Debate viewer — generals arguing proposals |
| `/reports` | Intel page — auto-detected reports by date |
| `/reports/[slug]` | Report detail — full markdown rendering |
| `/generals/[id]` | General profile — lore, stats, mission history |
| `/cost` | Cost monitor — daily/weekly spend tracking |
| `/logs` | Event timeline — full system audit trail |

### 🔔 Telegram Notifications
Every mission update, security alert, budget warning, and daily briefing delivered in real-time. Configurable quiet hours (no alerts 11PM-7AM unless critical).

### 💓 Heartbeat System
THRONE runs a health check every 30 minutes:
1. API health ping
2. Auto-review pending proposals  
3. Dispatch ready missions to sub-agents
4. Check for stalled missions (>1h no progress)
5. Verify daily cost thresholds
6. Send queued notifications
7. Log heartbeat event with summary stats

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, custom pixel art components |
| **API** | Express.js, TypeScript, RESTful routes |
| **Database** | PostgreSQL 15 (Railway managed) |
| **AI Agents** | Claude Opus 4 & Sonnet 4 via [OpenClaw](https://openclaw.ai) |
| **Orchestration** | OpenClaw multi-agent framework with sub-agent spawning |
| **Deployment** | Railway (4 services: frontend, API, DB, OpenClaw) |
| **Notifications** | Telegram Bot API |
| **CI/CD** | Git push → Railway auto-deploy |

---

## 📁 Project Structure

```
dominion/
├── api/                    # Express API server
│   ├── src/
│   │   ├── routes/         # REST endpoints (missions, proposals, events, etc.)
│   │   ├── db.ts           # PostgreSQL connection
│   │   └── index.ts        # Server entry
│   └── package.json
├── frontend/               # Next.js 14 pixel art dashboard
│   ├── app/                # App Router pages (9 routes)
│   ├── components/         # RPG-themed UI components
│   ├── lib/                # API client, utilities
│   └── package.json
├── database/               # SQL schema & migrations
├── src/
│   └── throne-integration/ # THRONE heartbeat scripts
│       ├── auto-review.sh       # Auto-approve cheap proposals
│       ├── dispatch-missions.sh # Spawn sub-agents for missions
│       ├── budget-check.sh      # Cost threshold monitoring
│       └── strategic-planner.sh # AI-powered proposal generation
├── characters/             # General personality definitions
├── reports/                # Generated intel reports
├── docs/                   # Architecture, setup, general docs
└── README.md
```

---

## 📊 Stats

| Metric | Value |
|--------|-------|
| Lines of code | 18,000+ |
| Files | 80+ |
| AI Generals | 7 |
| Dashboard routes | 9 |
| API endpoints | 15+ |
| Database tables | 6 |
| Security check points | 13 |
| Mission step types | 9 |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/zexoverz/dominion.git
cd dominion

# API
cd api && npm install && npm run dev

# Frontend (separate terminal)
cd frontend && npm install && npm run dev

# Database
# Set DATABASE_URL in api/.env (see docs/SETUP.md)
```

[**Full deployment guide →**](docs/SETUP.md)

---

## 🗺️ Roadmap

- [ ] Screenshot gallery of the pixel art dashboard
- [ ] General avatar pixel art assets  
- [ ] WebSocket real-time updates (replace polling)
- [ ] Multi-user support with role-based access
- [ ] Plugin system for custom generals
- [ ] Mobile-optimized responsive layouts
- [ ] Docker Compose for one-command local setup

---

## 📄 Documentation

| Doc | Description |
|-----|-------------|
| [**Architecture**](docs/ARCHITECTURE.md) | System design, data flow, API routes, DB schema |
| [**The Generals**](docs/GENERALS.md) | Lore, personalities, capabilities, debate behavior |
| [**Setup Guide**](docs/SETUP.md) | Deploy your own Dominion on Railway |

---

## 👤 Built By

**[Zexo](https://github.com/zexoverz)** (Muhammad Faisal Firdani)

- 🏛️ Founder of **[ETHJKT](https://ethjkt.id)** — Indonesia's largest Ethereum developer community (900+ members)
- 🔒 Designed **GrimSwap** — ZK privacy DEX on Uniswap V4 ([ETHGlobal HackMoney Top 10](https://ethglobal.com))
- ⚡ 7+ years building in blockchain — from Solidity to protocol-level engineering
- 🧠 Built Dominion because managing AI agents manually is beneath a proper grandmaster

---

## 📜 License

MIT — use it, fork it, build your own kingdom.

---

<div align="center">

*"The throne does not ask permission. It commands."*

**👑 DOMINION 👑**

</div>
]]>