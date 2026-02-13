# HEARTBEAT.md

## Active: Phase 1 Overnight Build (Feb 13-14)
Faisal is sleeping (~03:00-10:00 WIB). Continue Phase 1 autonomously.

### Checklist
- [ ] Check if sub-agents finished (mobile-responsive, character-designs, realtime-animations)
- [ ] If done: merge, fix build errors, redeploy frontend to Railway
- [ ] Set up PostgreSQL service on Railway (railway add --database postgres)
- [ ] Run schema.sql + seed.sql against the DB
- [ ] Build backend API service (src/api/) — Express + pg, REST endpoints for generals/missions/proposals/roundtables/costs
- [ ] Deploy backend API to Railway as new service
- [ ] Wire frontend to backend API (update mock-data.ts → real fetch calls)
- [ ] Final pixel art restyle if needed
- [ ] Redeploy everything
- [ ] Send Telegram checkpoint to Faisal when done
- [ ] Git commit + push all changes

### Rules
- Don't message Faisal until he wakes up (~10:00 WIB / 03:00 UTC)
- If something blocks, note it in memory and move to next task
- Commit progress incrementally to git
