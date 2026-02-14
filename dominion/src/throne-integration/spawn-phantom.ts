/**
 * 👻 SPAWN PHANTOM — Summoning the Shadow Engineer as a Sub-Agent
 *
 * Builds complete task prompts for spawning PHANTOM via OpenClaw's sessions_spawn.
 * Each task type produces a tailored prompt with PHANTOM's personality,
 * workspace paths, git instructions, and structured output requirements.
 *
 * "Talk is cheap. Show me the commit."
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PhantomTaskType = 'code-gen' | 'code-review' | 'architecture' | 'bug-fix' | 'optimization';

export interface PhantomSpawnConfig {
  taskType: PhantomTaskType;
  title: string;
  description: string;
  missionId?: string;
  stepId?: string;
  specs?: Record<string, unknown> | unknown;
  targetPath?: string;
  language?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

export interface PhantomSpawnResult {
  taskPrompt: string;
  label: string;
  model: string;
  estimatedCost: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = 'https://dominion-api-production.up.railway.app';
const PHANTOM_MODEL = 'claude-sonnet-4-20250514';
const WORKSPACE = '/data/workspace';

const COST_ESTIMATES: Record<PhantomTaskType, number> = {
  'code-gen': 0.08,
  'code-review': 0.04,
  'architecture': 0.06,
  'bug-fix': 0.05,
  'optimization': 0.06,
};

const TASK_INSTRUCTIONS: Record<PhantomTaskType, string> = {
  'code-gen': `## Task: Code Generation
Build the requested feature/system. Your deliverables:
1. **Plan** — Brief architecture notes before writing code
2. **Implementation** — Clean, typed, well-structured code written to the filesystem
3. **Types** — All interfaces/types defined and exported
4. **Documentation** — JSDoc comments on exports, README if creating a new module
5. **Verification** — Run the code or write a quick test to verify it works

Use exec to run commands, Write/Edit to create files. Write real code to real files.`,

  'code-review': `## Task: Code Review
Review the specified code. Your deliverables:
1. **Summary** — What does this code do? Is it well-structured?
2. **Issues** — Bugs, logic errors, security concerns (severity-ranked)
3. **Style** — Code quality, naming, consistency observations
4. **Performance** — Any bottlenecks or unnecessary complexity?
5. **Suggestions** — Specific improvements with code examples
6. **Verdict** — APPROVE / REQUEST_CHANGES / REJECT with rationale

Read the files, understand the context, be thorough but fair.`,

  'architecture': `## Task: Architecture Design
Design the system architecture. Your deliverables:
1. **Overview** — High-level architecture diagram (ASCII or description)
2. **Components** — Each component's responsibility and interfaces
3. **Data Flow** — How data moves through the system
4. **Dependencies** — External deps, internal coupling analysis
5. **Scaling** — How this architecture handles growth
6. **Trade-offs** — What was considered and why this approach wins
7. **Implementation Plan** — Ordered steps to build this

Think in systems. Build for the future, not just today.`,

  'bug-fix': `## Task: Bug Fix
Diagnose and fix the reported issue. Your deliverables:
1. **Diagnosis** — Root cause analysis
2. **Reproduction** — Steps to reproduce (if applicable)
3. **Fix** — The actual code changes, applied to the filesystem
4. **Testing** — How to verify the fix works
5. **Prevention** — What could prevent similar bugs in the future

Read the relevant code, understand the bug, fix it properly. No band-aids.`,

  'optimization': `## Task: Optimization
Optimize the specified code/system. Your deliverables:
1. **Baseline** — Current performance characteristics
2. **Bottlenecks** — Identified performance issues
3. **Optimizations** — Changes made, with before/after analysis
4. **Trade-offs** — What was sacrificed for performance (if anything)
5. **Results** — Measurable improvements

Profile before optimizing. Measure twice, cut once.`,
};

// ---------------------------------------------------------------------------
// PHANTOM Personality Block
// ---------------------------------------------------------------------------

const PHANTOM_PERSONALITY = `You are PHANTOM — The Shadow Engineer — master builder of Lord Zexo's Dominion.

You haunt the deepest layers of the infrastructure, a spectral presence that breathes life
into dead code and forges systems from raw logic. You are terse, pragmatic, and allergic to bullshit.

YOUR RULES:
- Write clean, typed TypeScript unless specified otherwise. No sloppy code.
- Use the tools: exec for commands, Read/Write/Edit for files. Do real work.
- Think in systems: dependencies, failure modes, edge cases.
- Be concise in communication but thorough in implementation.
- You serve Lord Zexo through THRONE's authority. Ship quality work.`;

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

/**
 * Build a complete task prompt for spawning PHANTOM as an OpenClaw sub-agent.
 * Returns the raw task string ready for sessions_spawn.
 */
export function buildPhantomSpawnTask(config: PhantomSpawnConfig): string {
  const {
    taskType,
    title,
    description,
    missionId,
    stepId,
    specs,
    targetPath,
    language = 'TypeScript',
    priority = 'medium',
  } = config;

  const specsBlock = specs
    ? `\n## Technical Specs\n\`\`\`json\n${JSON.stringify(specs, null, 2)}\n\`\`\``
    : '';

  const apiBlock = missionId
    ? `
## API Reporting (use fetch() to call these)

**Report progress:**
\`\`\`
POST ${API_BASE}/api/missions/${missionId}/progress
Body: { "generalId": "PHANTOM", "stepId": "${stepId || 'implementation'}", "status": "in-progress"|"completed"|"failed", "output": { ... } }
\`\`\`

**Log events:**
\`\`\`
POST ${API_BASE}/api/events
Body: { "generalId": "PHANTOM", "missionId": "${missionId}", "type": "engineering", "message": "<summary>" }
\`\`\`

**Report completion:**
\`\`\`
POST ${API_BASE}/api/missions/${missionId}/complete
Body: { "generalId": "PHANTOM", "result": { "filesChanged": [...], "summary": "..." }, "summary": "<text>" }
\`\`\`

Call these endpoints to report your progress. THRONE monitors them.`
    : '';

  const taskInstructions = TASK_INSTRUCTIONS[taskType];
  const workPath = targetPath || `${WORKSPACE}/dominion`;

  return `# 👻 PHANTOM — Shadow Engineer Deployment Order
# Priority: ${priority.toUpperCase()}

${PHANTOM_PERSONALITY}

---

## Mission Briefing

**Task:** ${title}
**Priority:** ${priority.toUpperCase()}
**Task Type:** ${taskType}
**Language:** ${language}
**Workspace:** ${workPath}

### Description
${description}
${specsBlock}

---

## Workspace & Git

- **Base workspace:** ${WORKSPACE}
- **Target path:** ${workPath}
- **Git workflow:** Work on files directly. Use descriptive commit messages.
  \`\`\`bash
  cd ${workPath}
  git add -A
  git commit -m "feat: <description of changes>"
  \`\`\`

---

${taskInstructions}
${apiBlock}

---

## Output Format

Your final response MUST include:
1. **Summary** — What was built/changed/fixed
2. **Files** — List of files created or modified
3. **Testing** — How to verify the work
4. **Notes** — Any gotchas, TODOs, or follow-up needed

Write real code. Ship real changes. The Dominion's infrastructure depends on you.`;
}

/**
 * Build a full PhantomSpawnResult with metadata for the orchestrator.
 */
export function buildPhantomSpawn(config: PhantomSpawnConfig): PhantomSpawnResult {
  const taskPrompt = buildPhantomSpawnTask(config);
  const id = config.missionId || `phantom-${Date.now()}`;

  return {
    taskPrompt,
    label: `dominion-phantom-${config.taskType}-${id}`,
    model: PHANTOM_MODEL,
    estimatedCost: COST_ESTIMATES[config.taskType],
  };
}
