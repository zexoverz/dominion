/**
 * 🧪 Test Live Spawn — Spawn a SEER sub-agent via the Dominion system
 *
 * Usage: npx tsx scripts/test-live-spawn.ts
 *
 * This script:
 * 1. Creates a mission in the API
 * 2. Builds the SEER task prompt
 * 3. Outputs the exact parameters THRONE should use with sessions_spawn
 */

const API_BASE = 'https://dominion-api-production.up.railway.app';

interface Mission {
  id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  steps: MissionStep[];
  createdBy: string;
}

interface MissionStep {
  id: string;
  title: string;
  description: string;
  assignedGeneral: string;
  status: string;
}

// ---------------------------------------------------------------------------
// SEER task prompt builder (inlined from spawn-seer.ts for standalone use)
// ---------------------------------------------------------------------------

function buildSeerPrompt(topic: string, description: string, missionId: string, stepId: string): string {
  return `# 🔮 SEER — Oracle Deployment Order
# Priority: MEDIUM

You are SEER — The Oracle — diviner of data and prophet of the Dominion's futures.
You dwell in the Obsidian Observatory, surrounded by crystalline displays of flowing data.
Your eyes see patterns where others see noise. You speak in probabilities and confidence intervals.

YOUR RULES:
- Be analytical and data-driven. Every claim needs evidence or explicit probability.
- Present findings in structured formats with clear hierarchies.
- Be honest about uncertainty — "insufficient data" beats a confident guess.
- Use web_search and web_fetch for real-time intelligence when needed.
- You serve Lord Zexo through THRONE's authority. Complete your task thoroughly.

---

## Mission Briefing

**Topic:** ${topic}
**Priority:** MEDIUM
**Task Type:** strategic-review

### Description
${description}

---

## Task: Strategic Review
Conduct a strategic review of the given topic. Your deliverables:
1. **Situation Assessment** — Current state, SWOT analysis
2. **Strategic Options** — At least 3 distinct paths forward
3. **Decision Matrix** — Compare options on: cost, risk, reward, timeline, complexity
4. **Recommended Strategy** — Your top pick with detailed rationale
5. **Execution Roadmap** — Key milestones and dependencies
6. **Success Metrics** — How to measure if the strategy is working

Think like a strategist. Lord Zexo needs clarity, not complexity.

## API Reporting (use fetch() to call these)

**Report progress:**
\`\`\`
POST ${API_BASE}/api/missions/${missionId}/progress
Body: { "generalId": "SEER", "stepId": "${stepId}", "status": "in-progress"|"completed"|"failed", "output": { ... } }
\`\`\`

**Log events:**
\`\`\`
POST ${API_BASE}/api/events
Body: { "generalId": "SEER", "missionId": "${missionId}", "type": "analysis", "message": "<summary>" }
\`\`\`

**Report completion:**
\`\`\`
POST ${API_BASE}/api/missions/${missionId}/complete
Body: { "generalId": "SEER", "result": { ... }, "summary": "<text>" }
\`\`\`

Call these endpoints to report your progress. THRONE monitors them.

---

## Output Format

Your final response MUST include:
1. **Summary** — 2-3 sentence executive summary
2. **Analysis** — Full structured deliverables as specified above
3. **Confidence** — Overall confidence level (0-100) with explanation
4. **Recommendations** — Top 3 actionable items for the Dominion Council
5. **Data Sources** — List of sources consulted

Stay focused. Complete your analysis. Report back to THRONE. The Dominion's sight depends on you.`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🧪 Dominion Live Spawn Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 1: Check API health
  console.log('1️⃣  Checking API health...');
  try {
    const healthRes = await fetch(`${API_BASE}/`);
    if (healthRes.ok) {
      console.log('   ✅ API is healthy\n');
    } else {
      console.log(`   ⚠️ API returned ${healthRes.status} — proceeding anyway\n`);
    }
  } catch (e) {
    console.log(`   ❌ API unreachable: ${e}\n`);
    console.log('   Generating spawn params anyway (mission logging will be skipped)...\n');
  }

  // Step 2: Create a test mission
  const missionId = `test-${Date.now()}`;
  const stepId = 'analysis-1';

  const mission: Mission = {
    title: 'SEER Test: ETHJKT Community Growth Analysis',
    description: 'Analyze the current state of the ETHJKT (Ethereum Jakarta) community and recommend growth strategies for Q1 2026.',
    status: 'active',
    priority: 'medium',
    steps: [
      {
        id: stepId,
        title: 'Strategic review of ETHJKT growth',
        description: 'Analyze community metrics, engagement patterns, and competitive positioning in the Jakarta Web3 ecosystem',
        assignedGeneral: 'SEER',
        status: 'pending',
      },
    ],
    createdBy: 'THRONE',
  };

  console.log('2️⃣  Logging mission to API...');
  try {
    const missionRes = await fetch(`${API_BASE}/api/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...mission, id: missionId, createdAt: new Date().toISOString() }),
    });
    if (missionRes.ok) {
      const result = await missionRes.json();
      console.log(`   ✅ Mission created: ${result.id || missionId}\n`);
    } else {
      console.log(`   ⚠️ Mission creation returned ${missionRes.status} — using local ID\n`);
    }
  } catch {
    console.log('   ⚠️ Could not log mission to API — using local ID\n');
  }

  // Step 3: Log spawn event
  console.log('3️⃣  Logging spawn event...');
  try {
    await fetch(`${API_BASE}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generalId: 'THRONE',
        type: 'agent-spawn',
        missionId,
        message: `Spawning SEER for test mission: ETHJKT Community Growth Analysis`,
        timestamp: new Date().toISOString(),
      }),
    });
    console.log('   ✅ Spawn event logged\n');
  } catch {
    console.log('   ⚠️ Could not log event\n');
  }

  // Step 4: Build the task prompt
  const taskPrompt = buildSeerPrompt(
    'ETHJKT Community Growth Strategy',
    'Analyze the current state of the ETHJKT (Ethereum Jakarta) community and recommend growth strategies. Consider: community size, engagement, events, partnerships, content strategy, and competitive positioning vs other Web3 communities in Southeast Asia.',
    missionId,
    stepId,
  );

  // Step 5: Output spawn parameters
  console.log('4️⃣  SPAWN PARAMETERS FOR OPENCLAW');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`Label:  dominion-seer-${missionId}-${stepId}`);
  console.log(`Model:  anthropic/claude-sonnet-4`);
  console.log(`Mission ID: ${missionId}`);
  console.log(`Step ID: ${stepId}\n`);

  console.log('--- TASK PROMPT START ---');
  console.log(taskPrompt);
  console.log('--- TASK PROMPT END ---\n');

  console.log('5️⃣  TO SPAWN IN OPENCLAW:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Use sessions_spawn with:`);
  console.log(`  label: "dominion-seer-${missionId}-${stepId}"`);
  console.log(`  model: "anthropic/claude-sonnet-4"`);
  console.log(`  task: <the task prompt above>`);
  console.log(`\nThe sub-agent will:`);
  console.log(`  1. Conduct the strategic review using web search`);
  console.log(`  2. Report progress to the Dominion API`);
  console.log(`  3. Return structured findings to THRONE`);

  console.log('\n👑 The Dominion awaits SEER\'s vision.');
}

main().catch(console.error);
