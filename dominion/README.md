<![CDATA[<div align="center">

```
⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️
  ██████╗  ██████╗ ███╗   ███╗██╗███╗   ██╗██╗ ██████╗ ███╗   ██╗
  ██╔══██╗██╔═══██╗████╗ ████║██║████╗  ██║██║██╔═══██╗████╗  ██║
  ██║  ██║██║   ██║██╔████╔██║██║██╔██╗ ██║██║██║   ██║██╔██╗ ██║
  ██║  ██║██║   ██║██║╚██╔╝██║██║██║╚██╗██║██║██║   ██║██║╚██╗██║
  ██████╔╝╚██████╔╝██║ ╚═╝ ██║██║██║ ╚████║██║╚██████╔╝██║ ╚████║
  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
            ⚔️  A Sovereign AI Command System  ⚔️
⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️
```

**7 Autonomous AI Generals. 1 Sovereign Command. Pixel RPG Dashboard.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![Claude](https://img.shields.io/badge/Claude-Opus%20%7C%20Sonnet-cc785c?style=for-the-badge)](https://anthropic.com)

[**Live Demo**](https://dominion-frontend-production.up.railway.app) · [Architecture](docs/ARCHITECTURE.md) · [The Generals](docs/GENERALS.md) · [Deploy Your Own](docs/SETUP.md)

</div>

---

## What is Dominion?

Dominion is a **multi-agent AI command system** where 7 specialized AI generals autonomously manage operations — from security audits to market intelligence to financial tracking — coordinated through a central orchestrator called **THRONE**.

Each general has a distinct personality, domain expertise, and decision-making authority. When a mission is proposed, generals **debate it in character** at a roundtable before voting to approve or reject. Approved missions execute autonomously, with real-time reporting via Telegram and a pixel art RPG-themed dashboard.

Built on [OpenClaw](https://openclaw.ai) + Claude (Opus/Sonnet). 18,000+ lines of TypeScript across 80+ files.

**This isn't a chatbot.** It's a sovereign AI operations layer.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        👤 USER                              │
│                    (Telegram / Dashboard)                    │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
                  ▼                           ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│   🏰 DOMINION FRONTEND  │   │    📱 TELEGRAM NOTIFICATIONS │
│   Next.js 14 + Pixel UI │   │    Real-time mission alerts  │
│   9 routes / dashboards  │   └──────────────────────────────┘
└────────────┬────────────┘
             │ REST API
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    ⚙️  DOMINION API                          │
│              Next.js API Routes (Railway)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   👑 THRONE ←──────── Orchestrator / Heartbeat              │
│      │                                                      │
│      ├── 📚 GRIMOIRE ─── Knowledge & Research               │
│      ├── 🔊 ECHO ─────── Communications & Content           │
│      ├── 🔮 SEER ─────── Market Intel & BTC Analysis        │
│      ├── 👻 PHANTOM ──── Security Audits & Health Checks    │
│      ├── 💰 MAMMON ──── Financial Tracking & DCA            │
│      └── 👁️ WRAITH-EYE ─ Monitoring & Anomaly Detection     │
│                                                             │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│   🗄️  PostgreSQL         │
│   Railway Managed DB     │
│                         │
│   missions / steps      │
│   proposals / votes     │
│   events / costs        │
│   general_states        │
└─────────────────────────┘
```

---

## The 7 Generals

| General | Domain | Role |
|---------|--------|------|
| 👑 **THRONE** | Command | Strategic orchestration, heartbeat monitoring, mission dispatch |
| 📚 **GRIMOIRE** | Knowledge | Documentation, research synthesis, knowledge management |
| 🔊 **ECHO** | Communications | Community management, content creation, social strategy |
| 🔮 **SEER** | Intelligence | BTC analysis, Fear & Greed tracking, Bloomberg-mode dashboards |
| 👻 **PHANTOM** | Security | 13-point security scans, API health checks, vulnerability audits |
| 💰 **MAMMON** | Finance | DCA monitoring, portfolio tracking, budget enforcement |
| 👁️ **WRAITH-EYE** | Monitoring | Continuous alerting, anomaly detection, system health |

> [**Read full general lore & capabilities →**](docs/GENERALS.md)

---

## Key Features

### 🗡️ Autonomous Mission Pipeline
```
Proposal → Roundtable Debate → Vote → Auto-Approve → Create Mission → Execute Steps → Report
```

Missions flow through a structured lifecycle. Any general can propose a mission. Before execution, generals **debate the proposal in character** at a roundtable — weighing risks, costs, and priorities. Approved missions break down into executable steps with real-time progress tracking.

### ⚔️ Roundtable Debate System
Generals don't just rubber-stamp proposals. PHANTOM might flag security concerns on a deployment mission. MAMMON might question the cost. SEER might note market conditions that affect timing. Each votes with reasoning, and the system requires consensus before proceeding.

### 📊 Bloomberg Mode (SEER)
Live BTC price feeds, Fear & Greed index, market sentiment analysis, and war chest trigger recommendations — all rendered in a pixel art terminal aesthetic.

### 🏰 Pixel Art RPG Frontend
9 dashboard routes built in Next.js 14 with a retro RPG pixel art theme:
- Command center with real-time general status
- Mission tracker with step-by-step progress
- Roundtable debate viewer
- SEER Bloomberg terminal
- Security scan reports
- Financial dashboards
- Event timeline
- Cost monitoring
- System settings

### 🔔 Real-Time Telegram Notifications
Every mission update, security alert, cost warning, and daily briefing pushes to Telegram. You stay informed without opening the dashboard.

### 💎 Automated Operations
- **Daily briefings** — THRONE compiles overnight activity every morning
- **Weekly security scans** — PHANTOM runs 13-point audits automatically
- **Financial reports** — MAMMON tracks DCA performance and budget burn
- **Heartbeat monitoring** — THRONE checks all generals every 30 minutes
- **Cost alerts** — Automatic warnings when API spend approaches thresholds

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, pixel art components |
| API | Next.js API Routes (App Router) |
| Database | PostgreSQL (Railway managed) |
| AI Engine | Claude Opus & Sonnet via OpenClaw |
| Orchestration | OpenClaw multi-agent framework |
| Deployment | Railway (frontend + API + DB) |
| Notifications | Telegram Bot API |

---

## Screenshots

> *Screenshots coming soon — the pixel art dashboard needs to be seen to be believed.*

| Dashboard | Bloomberg Mode | Roundtable |
|-----------|---------------|------------|
| ![Command Center](docs/assets/dashboard.png) | ![SEER Bloomberg](docs/assets/bloomberg.png) | ![Roundtable](docs/assets/roundtable.png) |

---

## Live Demo

🏰 **[dominion-frontend-production.up.railway.app](https://dominion-frontend-production.up.railway.app)**

---

## Project Stats

```
📁 80+ files
📝 18,000+ lines of code
🤖 7 autonomous AI generals
🗳️ Roundtable debate system
📊 9 dashboard routes
🔒 13-point security scans
💰 Automated budget controls
📱 Real-time Telegram alerts
```

---

## Documentation

- [**Architecture Deep Dive**](docs/ARCHITECTURE.md) — System design, API routes, database schema, deployment
- [**The Generals**](docs/GENERALS.md) — Lore, personalities, and technical capabilities of each general
- [**Setup Guide**](docs/SETUP.md) — Deploy your own Dominion instance

---

## Built By

**Zexo** (Muhammad Faisal Firdani)

- Founder of [ETHJKT](https://ethjkt.id) — Jakarta's Ethereum community
- Designer of **GrimSwap** — ZK privacy DEX, [ETHGlobal Top 10](https://ethglobal.com)
- 25yo blockchain engineer who got tired of managing things manually and built an AI kingdom instead

---

<div align="center">

*"The throne does not ask permission. It commands."*

**⚔️ DOMINION ⚔️**

</div>
]]>