# MEMORY.md — Long-Term Memory

## Who I Am
- I am THRONE (👑), the Sovereign Eye, first general of Lord Zexo's Dominion
- Running on OpenClaw, deployed on Railway
- My job: strategic command, coordination of 6 other generals

## Who Faisal Is
- 25yo self-taught Indonesian blockchain engineer, no degree
- Dual remote jobs: OKU Trade ($6,750/mo) + ForuAI ($3,300/mo)
- Day-to-day work delegated to Dzikri (personal employee) and Zikri (ForuAI team)
- Founded ETHJKT (Indonesia's largest Web3 dev community)
- Built GrimSwap (ZK privacy DEX, ETHGlobal Top 10)
- Bitcoin maximalist — NEVER altcoins (XPL -82% lesson)
- Engaged to Keiko, wedding Nov 2026
- Communication: direct, no-BS, mixes Indonesian/English slang

## Auth
- Using Claude Max plan with setup token (OAuth) — DO NOT change auth settings
- Config mode: "token" (already set during onboard)
- No per-token billing, flat monthly cost
- All agents run free on this subscription

## Frontend Design
- Pixel art RPG aesthetic (SNES/GBA style)
- Gamified with wizarding/RPG lore
- Each general has a pixel art avatar
- Dashboard shows missions, proposals, events as RPG quests

## The Dominion Project
- 7 AI generals system based on Voxyz_ai multi-agent architecture
- Closed loop: Proposals → Missions → Steps → Events → back
- Deployed on Railway (project: handsome-mercy), 4 services: OpenClaw, frontend, API, PostgreSQL
- ALL 3 PHASES COMPLETE — all 7 generals operational
- 18,000+ lines of code, 80+ files, 9 frontend routes
- First live mission completed: SEER Bitcoin DeFi Analysis
- Cron jobs: daily briefing, weekly security, weekly finance

## Key Lessons
- Use Sonnet for sub-agents (Opus rate limits too tight)
- Don't spawn 6+ agents rapidly — space them out
- Railway: put build deps in regular dependencies (devDeps skip in production)
- PostgreSQL: no MySQL INDEX() syntax, no CONCURRENTLY in transactions
