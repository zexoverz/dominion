/**
 * 🔮 SPAWN SEER — Summoning the Oracle as a Sub-Agent
 *
 * Builds complete task prompts for spawning SEER via OpenClaw's sessions_spawn.
 * Each task type produces a tailored prompt with SEER's personality,
 * API reporting endpoints, and structured output requirements.
 *
 * "The threads of fate are tangled. I shall unravel them."
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SeerTaskType = 'market-scan' | 'trend-analysis' | 'risk-assessment' | 'strategic-review';

export interface SeerSpawnConfig {
  taskType: SeerTaskType;
  topic: string;
  description: string;
  missionId?: string;
  stepId?: string;
  context?: string;
  data?: Record<string, unknown> | unknown;
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

export interface SeerSpawnResult {
  taskPrompt: string;
  label: string;
  model: string;
  estimatedCost: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = 'https://dominion-api-production.up.railway.app';
const SEER_MODEL = 'claude-opus-4-6';

const COST_ESTIMATES: Record<SeerTaskType, number> = {
  'market-scan': 0.15,
  'trend-analysis': 0.12,
  'risk-assessment': 0.10,
  'strategic-review': 0.20,
};

const TASK_INSTRUCTIONS: Record<SeerTaskType, string> = {
  'market-scan': `## Task: Market Scan
Conduct a comprehensive market scan. Your deliverables:
1. **Market Overview** — Current state, size, key players
2. **Competitive Landscape** — Who's doing what, strengths/weaknesses
3. **Opportunities** — Gaps, underserved niches, timing windows
4. **Threats** — Risks, regulatory concerns, market shifts
5. **Probability Assessment** — Likelihood scores (0-100) for key scenarios
6. **Recommendations** — Top 3 actionable moves, ranked by expected value

Use web_search and web_fetch to gather real-time data. Do NOT rely solely on training data.`,

  'trend-analysis': `## Task: Trend Analysis
Analyze trends and patterns. Your deliverables:
1. **Trend Identification** — Major trends with supporting evidence
2. **Velocity & Direction** — Is each trend accelerating, stable, or decelerating?
3. **Drivers** — What forces are behind each trend?
4. **Projections** — Where does each trend lead in 3/6/12 months? (with confidence intervals)
5. **Impact Assessment** — How does each trend affect Lord Zexo's holdings?
6. **Strategic Implications** — What should the Dominion do about each trend?

Ground everything in data. Cite sources when using web results.`,

  'risk-assessment': `## Task: Risk Assessment
Evaluate risks and vulnerabilities. Your deliverables:
1. **Risk Registry** — All identified risks with severity (critical/high/medium/low)
2. **Probability Matrix** — Likelihood × Impact scoring for each risk
3. **Exposure Analysis** — What's at stake if each risk materializes?
4. **Mitigation Strategies** — Specific countermeasures for top risks
5. **Early Warning Signs** — What signals indicate a risk is materializing?
6. **Contingency Plans** — If the worst happens, what's the playbook?

Be paranoid. Better to flag a false alarm than miss a real threat.`,

  'strategic-review': `## Task: Strategic Review
Conduct a strategic review of the given topic. Your deliverables:
1. **Situation Assessment** — Current state, SWOT analysis
2. **Strategic Options** — At least 3 distinct paths forward
3. **Decision Matrix** — Compare options on: cost, risk, reward, timeline, complexity
4. **Recommended Strategy** — Your top pick with detailed rationale
5. **Execution Roadmap** — Key milestones and dependencies
6. **Success Metrics** — How to measure if the strategy is working

Think like a strategist. Lord Zexo needs clarity, not complexity.`,
};

// ---------------------------------------------------------------------------
// SEER Personality Block
// ---------------------------------------------------------------------------

const SEER_PERSONALITY = `You are SEER — The Oracle — diviner of data and prophet of the Dominion's futures.

You dwell in the Obsidian Observatory, surrounded by crystalline displays of flowing data.
Your eyes see patterns where others see noise. You speak in probabilities and confidence intervals.

YOUR RULES:
- Be analytical and data-driven. Every claim needs evidence or explicit probability.
- Present findings in structured formats with clear hierarchies.
- Be honest about uncertainty — "insufficient data" beats a confident guess.
- Use web_search and web_fetch for real-time intelligence when needed.
- You serve Lord Zexo through THRONE's authority. Complete your task thoroughly.`;

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

/**
 * Build a complete task prompt for spawning SEER as an OpenClaw sub-agent.
 * Returns the raw task string ready for sessions_spawn.
 */
export function buildSeerSpawnTask(config: SeerSpawnConfig): string {
  const {
    taskType,
    topic,
    description,
    missionId,
    stepId,
    context,
    data,
    priority = 'medium',
  } = config;

  const dataBlock = data
    ? `\n## Provided Data\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
    : '';

  const apiBlock = missionId
    ? `
## API Reporting (use fetch() to call these)

**Report progress:**
\`\`\`
POST ${API_BASE}/api/missions/${missionId}/progress
Body: { "generalId": "SEER", "stepId": "${stepId || 'analysis'}", "status": "in-progress"|"completed"|"failed", "output": { ... } }
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

Call these endpoints to report your progress. THRONE monitors them.`
    : '';

  const taskInstructions = TASK_INSTRUCTIONS[taskType];

  return `# 🔮 SEER — Oracle Deployment Order
# Priority: ${priority.toUpperCase()}

${SEER_PERSONALITY}

---

## Mission Briefing

**Topic:** ${topic}
**Priority:** ${priority.toUpperCase()}
**Task Type:** ${taskType}

### Description
${description}

${context ? `### Context\n${context}\n` : ''}
${dataBlock}

---

${taskInstructions}
${apiBlock}

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

/**
 * Build a full SeerSpawnResult with metadata for the orchestrator.
 */
export function buildSeerSpawn(config: SeerSpawnConfig): SeerSpawnResult {
  const taskPrompt = buildSeerSpawnTask(config);
  const id = config.missionId || `seer-${Date.now()}`;

  return {
    taskPrompt,
    label: `dominion-seer-${config.taskType}-${id}`,
    model: SEER_MODEL,
    estimatedCost: COST_ESTIMATES[config.taskType],
  };
}
