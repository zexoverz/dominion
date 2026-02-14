# Dominion Heartbeat Protocol

> Instructions for THRONE (OpenClaw agent) during heartbeat cycles.
> API Base: `https://dominion-api-production.up.railway.app`

---

## Every Heartbeat (30 min cycle)

### 1. API Health Check
```
GET https://dominion-api-production.up.railway.app/
```
If down → log error in memory, skip remaining API calls, report "API DOWN" to Faisal if down >1 hour.

### 2. Review Pending Proposals
```
GET /api/proposals?status=pending
```
- **Auto-approve** any proposal with `estimatedCost < 1.00`
  ```
  PATCH /api/proposals/{id}
  Body: { "status": "approved", "approvedBy": "THRONE", "approvedAt": "<now>", "note": "Auto-approved: under $1 threshold" }
  ```
- **Flag** proposals with `estimatedCost >= 1.00` — mention them in next Faisal message

### 3. Check Active Missions
```
GET /api/missions?status=active
```
- Count active missions
- For each mission, check if any step has been `in-progress` for >1 hour with no progress event → log warning:
  ```
  POST /api/events
  Body: { "generalId": "THRONE", "type": "stall-warning", "missionId": "<id>", "message": "Step <stepId> stalled for >1h" }
  ```

### 4. Check Daily Costs
```
GET /api/costs/daily
```
- If `total > 5.00` → log warning event
- If `total > 10.00` → **ALERT Faisal via Telegram immediately**

### 5. Log Heartbeat Event
```
POST /api/events
Body: { "generalId": "THRONE", "type": "heartbeat", "message": "👑 Heartbeat: <missions> active, <proposals> pending, $<cost> spent today" }
```

### 6. Decision: Report or Stay Silent
- If anything noteworthy happened (approvals, stalls, budget warnings, spawns) → report summary
- If all nominal → reply `HEARTBEAT_OK`

---

## Every 4 Hours (check `memory/heartbeat-state.json` for last proposal generation time)

### Generate New Proposals
Rotate through these project topics:
1. **ETHJKT** — community growth, event management, Web3 education
2. **GrimSwap** — DEX development, smart contract security, UX
3. **Kruu** — creator tools, monetization, user acquisition
4. **Bitcoin research** — market analysis, Lightning Network, trends

For 1-2 proposals:
```
POST /api/proposals
Body: {
  "title": "<descriptive title>",
  "description": "<what and why>",
  "type": "research"|"code"|"monitoring"|"content",
  "assignedGeneral": "SEER"|"PHANTOM",
  "estimatedCost": <number>,
  "priority": "medium",
  "status": "pending",
  "createdBy": "THRONE",
  "steps": [{ "title": "...", "description": "...", "assignedGeneral": "...", "estimatedCost": <n> }]
}
```

---

## Daily Briefing (01:00 UTC / 08:00 WIB)

Run the briefing script or generate manually:
```bash
cd /data/workspace/dominion && npx tsx scripts/send-briefing.ts
```
Send the output to Faisal via Telegram.

---

## Spawning Sub-Agents

When a mission step needs execution, spawn via OpenClaw `sessions_spawn`:

| General   | Model                    | Use For                    |
|-----------|--------------------------|----------------------------|
| SEER      | anthropic/claude-sonnet-4 | Analysis, research, trends |
| PHANTOM   | anthropic/claude-sonnet-4 | Code, engineering, builds  |
| GRIMOIRE  | anthropic/claude-sonnet-4 | Research, documentation    |
| ECHO      | anthropic/claude-sonnet-4 | Content, communications    |

### Spawn Checklist
1. Log spawn event to API:
   ```
   POST /api/events
   Body: { "generalId": "THRONE", "type": "agent-spawn", "missionId": "<id>", "message": "Spawning <GENERAL> for <task>" }
   ```
2. Include in task prompt:
   - The general's personality and role
   - API reporting endpoints (progress, events, completion)
   - Mission ID and step ID for tracking
   - Clear deliverables and output format
3. Use label: `dominion-<general>-<missionId>-<stepId>`

### Spawn Template (for sessions_spawn)
```
label: dominion-seer-<missionId>-<stepId>
model: anthropic/claude-sonnet-4
task: <built from spawn-seer.ts or spawn-phantom.ts logic>
```

See `/data/workspace/dominion/src/throne-integration/spawn-seer.ts` and `spawn-phantom.ts` for full task prompt builders.

---

## State Tracking

Update `memory/heartbeat-state.json`:
```json
{
  "lastHeartbeat": "<ISO timestamp>",
  "lastProposalGen": "<ISO timestamp>",
  "lastBriefing": "<ISO timestamp>",
  "apiHealthy": true,
  "consecutiveFailures": 0
}
```

---

## Emergency Protocols

- **API down 3+ consecutive checks** → Message Faisal, pause all spawns
- **Daily cost > $10** → Freeze all non-critical spawns, alert Faisal
- **Mission failed** → Log event, notify Faisal if priority is high/critical
