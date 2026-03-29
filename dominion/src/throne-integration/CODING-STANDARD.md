# Dominion Coding Standard — Sub-Agent Development

## Principle
THRONE orchestrates. Sub-agents code. Never hand-write features directly.

## How It Works

### For Development Tasks (features, refactors, bug fixes):
```
sessions_spawn:
  runtime: "subagent"
  mode: "run"
  task: "<detailed spec with file paths, expected output, constraints>"
  cwd: "/data/workspace"
  model: (omit for default, or set per-agent override)
  label: "phantom-security-scan" / "grimoire-feature-xyz"
```

### For PHANTOM (Security) — Always Opus:
PHANTOM handles security scans, API audits, vulnerability analysis.
All PHANTOM coding/analysis missions use Opus-tier model via session_status override.

### Task Spec Template:
```
You are {GENERAL_NAME}, a Dominion general.

## Mission
{mission_title}

## Context
- Workspace: /data/workspace/dominion
- Relevant files: {list files}
- API base: https://dominion-api-production.up.railway.app

## Requirements
{detailed requirements}

## Constraints
- DO NOT modify files outside /data/workspace/dominion/
- Commit changes with descriptive message: "feat(general): description"
- Test your changes before completing
- Write output/report to: /data/workspace/dominion/reports/{filename}

## Completion
When done, summarize what you built/changed.
```

## Agent → General Mapping

| General | Role | Model | Task Types |
|---------|------|-------|------------|
| PHANTOM | Security & Infrastructure | opus | Security scans, API audits, infra hardening, code review |
| GRIMOIRE | Knowledge & Code | default | Feature development, documentation, code generation |
| SEER | Intelligence & Analysis | default | Market analysis, data processing, research |
| ECHO | Communication & Content | default | Content creation, summaries, social drafts |
| MAMMON | Finance & Treasury | default | Financial reports, DCA tracking, budget analysis |
| WRAITH-EYE | Monitoring & Surveillance | default | Uptime checks, alert systems, monitoring |

## Rules
1. THRONE never writes code directly for features — always delegate
2. Spec must include: file paths, expected output, constraints
3. Each sub-agent gets its own isolated session
4. PHANTOM always gets Opus for security-critical work
5. Report results back to Faisal via Telegram if noteworthy
6. Max concurrent sub-agents: 4 (don't overwhelm)
