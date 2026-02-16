# ⚔️ DOMINION

### A Sovereign Multi-Agent AI Command System

> 7 autonomous AI generals. Roundtable debates. Pixel RPG dashboard.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_Opus_|_Sonnet-cc785c?style=flat-square)
![Lines](https://img.shields.io/badge/18%2C000%2B_lines-blue?style=flat-square)
![Agents](https://img.shields.io/badge/7_AI_Generals-gold?style=flat-square)

**[🏰 Live Demo](https://dominion-frontend-production.up.railway.app)** · **[📐 Architecture](dominion/docs/ARCHITECTURE.md)** · **[⚔️ The Generals](dominion/docs/GENERALS.md)** · **[🚀 Deploy Your Own](dominion/docs/SETUP.md)**

---

## 💡 The Problem

Managing multiple AI agents is chaos. Disconnected conversations, no memory between sessions, no coordination between tasks, no audit trail.

## 🏰 The Solution

Dominion is a **closed-loop multi-agent system** where 7 specialized AI generals operate autonomously under a central command structure. Each general has a distinct role, personality, and decision-making authority.

When a new operation is proposed, generals **debate it in character** at a roundtable — weighing risks, costs, and priorities — before voting to approve or reject. Approved missions execute through structured steps with real-time tracking, automated reporting, and Telegram notifications.

**This isn't a chatbot wrapper.** It's an autonomous operations layer with a pixel art RPG frontend.

---

## 🔄 How It Works

```
Proposal ──▶ Roundtable Debate ──▶ Vote ──▶ Auto-Approve ──▶ Mission Created
                                                                    │
                                                                    ▼
Telegram ◀── Report Generated ◀── Step Execution (research → analyze → code → deploy)
```

Every mission is traceable. Every decision has reasoning. Every step has a status.

---

## ⚔️ The 7 Generals

| | General | Domain | What It Does |
|---|---------|--------|-------------|
| 👑 | **THRONE** | Command | Central orchestrator. Heartbeat every 30 min. Dispatches missions. |
| 📚 | **GRIMOIRE** | Knowledge | Research synthesis, documentation, knowledge management. |
| 🔊 | **ECHO** | Communications | Community management, content strategy, social presence. |
| 🔮 | **SEER** | Intelligence | Live BTC price, Fear & Greed index, Bloomberg-mode dashboard. |
| 👻 | **PHANTOM** | Security | 13-point security audits, API health checks, SSL/CORS scans. |
| 💰 | **MAMMON** | Finance | DCA tracking, portfolio analysis, budget enforcement. |
| 👁️ | **WRAITH-EYE** | Monitoring | Continuous system monitoring, anomaly detection, uptime tracking. |

> Generals don't just execute — they think. PHANTOM flags security risks. MAMMON questions costs. SEER notes market conditions. Each votes with reasoning at the roundtable.

**[Read full general lore & capabilities →](dominion/docs/GENERALS.md)**

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
          │           REST API                  │ Sub-agents
          ▼                                     ▼
   ┌────────────────────────────────────────────────────┐
   │                 ⚙️ Dominion API                     │
   │            Express + TypeScript (Railway)           │
   │                                                    │
   │  /missions  /proposals  /events  /generals         │
   │  /roundtable  /costs  /reports  /health            │
   └────────────────────────┬───────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ 🗄️ PostgreSQL    │
                  │ Railway Managed  │
                  │                  │
                  │ missions, steps  │
                  │ proposals, votes │
                  │ events, costs    │
                  └──────────────────┘
```

**[Full architecture deep dive →](dominion/docs/ARCHITECTURE.md)**

---

## ✨ Features

**🗳️ Roundtable Debates** — Generals debate proposals in character before voting. Not simple yes/no — each provides domain-specific reasoning.

**📊 SEER Bloomberg Mode** — Live BTC price, Fear & Greed index, news headlines, war chest deployment triggers based on ATH drawdown.

**🛡️ PHANTOM Security Scans** — Automated 13-point audits: API endpoints, SSL certs, CORS policies, exposed headers, rate limiting.

**💰 MAMMON Financial Tracking** — DCA performance, portfolio analysis, budget enforcement. Auto-alerts at $5 warn / $10 critical.

**💓 Heartbeat System** — THRONE checks all systems every 30 minutes: API health, pending proposals, stalled missions, cost thresholds, queued notifications.

**🔔 Telegram Notifications** — Every mission update, security alert, budget warning, and daily briefing in real-time. Quiet hours respected.

### 🏰 Pixel Art RPG Dashboard — 9 Routes

| Route | Description |
|-------|-------------|
| `/` | Throne Room — command center with general status |
| `/missions` | Mission board — active quests with progress bars |
| `/missions/[id]` | Mission detail — expandable steps with tutorials |
| `/roundtable` | Debate viewer — generals arguing proposals |
| `/reports` | Intel page — auto-detected reports by date |
| `/reports/[slug]` | Report detail — full markdown rendering |
| `/generals/[id]` | General profile — lore, stats, history |
| `/cost` | Cost monitor — daily/weekly spend tracking |
| `/logs` | Event timeline — full system audit trail |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, pixel art components |
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
│   ├── src/routes/         # REST endpoints
│   ├── src/db.ts           # PostgreSQL connection
│   └── src/index.ts        # Server entry
├── frontend/               # Next.js 14 pixel art dashboard
│   ├── app/                # App Router (9 routes)
│   ├── components/         # RPG-themed UI components
│   └── lib/                # API client, utilities
├── database/               # SQL schema & migrations
├── src/throne-integration/ # THRONE heartbeat scripts
│   ├── auto-review.sh      # Auto-approve proposals
│   ├── dispatch-missions.sh # Spawn sub-agents
│   ├── budget-check.sh     # Cost monitoring
│   └── strategic-planner.sh # AI proposal generation
├── characters/             # General personality definitions
├── reports/                # Generated intel reports
└── docs/                   # Architecture, setup, general docs
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
| Security checkpoints | 13 |
| Mission step types | 9 |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/zexoverz/dominion.git
cd dominion

# API
cd dominion/api && npm install && npm run dev

# Frontend (separate terminal)
cd dominion/frontend && npm install && npm run dev

# Database — set DATABASE_URL in api/.env (see docs/SETUP.md)
```

**[Full deployment guide →](dominion/docs/SETUP.md)**

---

## 🗺️ Roadmap

- [ ] Dashboard screenshot gallery
- [ ] General pixel art avatar assets
- [ ] WebSocket real-time updates
- [ ] Multi-user role-based access
- [ ] Plugin system for custom generals
- [ ] Docker Compose local setup

---

## 👤 Built By

**[Zexo](https://github.com/zexoverz)** (Muhammad Faisal Firdani)

- 🏛️ Founder of **ETHJKT** — Indonesia's largest Ethereum developer community (900+ members)
- 🔒 Designed **GrimSwap** — ZK privacy DEX on Uniswap V4 (ETHGlobal HackMoney Top 10)
- ⚡ 7+ years building in blockchain
- 🧠 Built Dominion because managing AI agents manually is beneath a proper grandmaster

---

## 📄 License

MIT — use it, fork it, build your own kingdom.

---

*"The throne does not ask permission. It commands."* **👑**
