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
- Cron jobs: daily briefing, weekly security, weekly finance, daily BTC intelligence (08:00 WIB)
- Full autonomous pipeline: Proposal → Roundtable Debate → Auto-Approve → Mission → Execute → Report → Notify
- SEER Bloomberg mode: live BTC price, F&G index, news headlines, war chest triggers
- MAMMON weekly financial tracker: DCA, wedding fund, war chest, fire sale theory
- PHANTOM security scans: 13-point API/SSL/CORS health checks
- Roundtable debates: generals discuss proposals in character before voting
- Notification system: queued JSON files, dispatched by heartbeat via Telegram
- 13+ reports in Intel page (auto-detected by date pattern)
- All frontend pages wired to real API data (no more mock-only)
- Phase A (Smart): AI-powered mission execution + roundtable debates via Claude sub-agents
- Phase B (Useful): daily briefing, WRAITH-EYE monitoring, EIP tracker, portfolio tracker
- Phase C (Beautiful): throne room speech bubbles, general lore profiles, BTC ticker, treasury charts
- ETHJKT curriculum: Phase 2 gaps identified (Week 4-5), Phase 3 designed (hackathon-ready)
- "Logic Nolep" → "Arcane Quest" rebrand pushed to 7 live ETHJKT repos
- 33 checkpoints shipped in single async session (Feb 14, 2026)
- ETHJKT Phase 2 Week 3-5 FULLY REVAMPED (Feb 16, 2026): 63 files, 3 attempts to get quality right
- Week 6 = Group Capstone (separate week), demos on Discord "Magic Temple" voice channel
- Dominion repo made PUBLIC with proper README + docs
- All 3 missions (EIP/OSS/Bootcamp) have expandable instructions on dashboard
- OZ #6305 = best first PR target (30 min, EIP-2200 comment fix)
- ethereum/tests #1498 BLOCKED (upstream not merged)

## Investment Master Plan (v2.0 — source of truth)
- Repo: zexoverz/Investment-masterplan-zexo-2030 (private)
- Local copy: dominion/reports/investment-masterplan-v2.md
- Pure BTC maxi — everything → Bitcoin, no alts, no collectibles, no gold
- Monthly: Rp 50M BTC DCA, Rp 30M wedding, Rp 15M war chest, Rp 5M gold
- War chest: Rp 40M total, 20M deployed, 20M remaining
- War chest deployment: 25% at -30%, 50% at -40%, 100% at -50%
- BTC ATH ~$126K; as of Feb 2026 BTC at ~$67K
- Current BTC holdings: 0.133 BTC
- XPL: 3278 tokens (write-off, -82% lesson, just forget)
- Wedding fund: Rp 120M (target Rp 350M by Oct 2026)
- Feb 2026 DCA executed (salary came Feb 1)
- ForuAI tokens: sell 100% immediately → BTC, no hodling
- Fire Sale Theory: AI destroys Indonesian middle class by 2030, be the buyer
- 2030 target: 5-12 BTC, Rp 26B-192B net worth
- Wedding fund target: Rp 350M by Oct 2026
- Over-kredit house plan: sell to Dzikri → deploy equity → BTC
- v1→v2 shift: removed Pokemon/One Piece/Gold diversification

## Zexo's Quest System (Feb 16, 2026)
- 3 active personal missions: EIP Quest (20 steps), OSS Quest (7 steps), Protocol Bootcamp (14 steps)
- EIP-7708 magicians draft ready at dominion/reports/eip-7708-magicians-draft.md
- Protocol bootcamp guide at dominion/reports/protocol-bootcamp-guide.md (14-day curriculum)
- GrimSwap was AI-coded (Opus 4.6) — Faisal did ideation/orchestration/privacy design
- His gap: never touched EVM internals or client code — bootcamp closes this
- Amsterdam hard fork = where the action is (EIP-7708, EIP-7928)
- Target repos: ethereum/tests #1498, ethereum/execution-specs, OpenZeppelin #6305/#6289, Foundry #5429
- Mission detail page built with expandable step instructions

## Key Lessons
- Cron jobs: do NOT set model field — "sonnet" alias doesn't resolve. Omit model entirely to use default.
- Use Sonnet for sub-agents (Opus rate limits too tight)
- Don't spawn 6+ agents rapidly — space them out
- Railway: put build deps in regular dependencies (devDeps skip in production)
- PostgreSQL: no MySQL INDEX() syntax, no CONCURRENTLY in transactions
- **ALWAYS test frontend API calls against actual deployed build before shipping** — missing /api/ prefix bug (Feb 14, 2026)
- Railway `railway up` builds can take 5-10 min; verify buildId changes before declaring success
- Frontend lib/api.ts needs /api/ prefix on all paths
- Mission status values: API returns "active"/"completed"/"pending", not "IN_PROGRESS"/"COMPLETE"
- DB ops_mission_steps has CHECK constraint on `kind` — only specific values allowed, not arbitrary strings
- Steps created from proposals via proposed_steps, not from mission creation body
- Frontend priority mapping needed: API numeric (100/90/70) → frontend strings (CRITICAL/HIGH/MEDIUM)
