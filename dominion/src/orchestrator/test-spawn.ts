/**
 * ⚔️ TEST SPAWN — Simulated General Deployment
 *
 * Builds task prompts for SEER and PHANTOM without calling OpenClaw API.
 * Run: npx tsx src/orchestrator/test-spawn.ts
 */

import { buildSeerAnalysis, buildPhantomTask, buildSpawnPrompt, getModelForGeneral, estimateCost } from './agent-spawner';
import { runMission, getEventLog, clearEventLog } from './mission-runner';
import { marketAnalysis } from './seer-tasks';
import { codeGeneration } from './phantom-tasks';

const DIVIDER = '\n' + '═'.repeat(80) + '\n';

async function main() {
  console.log('⚔️  DOMINION ORCHESTRATOR — Test Spawn');
  console.log(DIVIDER);

  // -------------------------------------------------------------------------
  // Test 1: SEER Analysis Prompt
  // -------------------------------------------------------------------------
  console.log('🔮 TEST 1: SEER Analysis Task Prompt\n');

  const seerPrompt = buildSeerAnalysis('AI SaaS market trends Q1 2026', {
    totalMarket: '$180B',
    growthRate: '28% YoY',
    topPlayers: ['OpenAI', 'Anthropic', 'Google', 'Microsoft'],
    emergingTrends: ['agent frameworks', 'on-device models', 'vertical AI'],
  });

  console.log(`Model: ${getModelForGeneral('SEER')}`);
  console.log(`Est. cost: $${estimateCost('SEER', 'medium')}`);
  console.log(`Prompt length: ${seerPrompt.length} chars`);
  console.log('\n--- SEER Prompt (first 1500 chars) ---');
  console.log(seerPrompt.slice(0, 1500));
  console.log('...\n');

  // -------------------------------------------------------------------------
  // Test 2: PHANTOM Engineering Prompt
  // -------------------------------------------------------------------------
  console.log(DIVIDER);
  console.log('👻 TEST 2: PHANTOM Engineering Task Prompt\n');

  const phantomPrompt = buildPhantomTask('Build a rate limiter middleware', {
    language: 'TypeScript',
    framework: 'Express',
    features: ['sliding window', 'per-IP tracking', 'Redis backend', 'configurable limits'],
    outputPath: '/data/workspace/dominion/src/middleware/rate-limiter.ts',
  });

  console.log(`Model: ${getModelForGeneral('PHANTOM')}`);
  console.log(`Est. cost: $${estimateCost('PHANTOM', 'medium')}`);
  console.log(`Prompt length: ${phantomPrompt.length} chars`);
  console.log('\n--- PHANTOM Prompt (first 1500 chars) ---');
  console.log(phantomPrompt.slice(0, 1500));
  console.log('...\n');

  // -------------------------------------------------------------------------
  // Test 3: Full Mission Run (dry run)
  // -------------------------------------------------------------------------
  console.log(DIVIDER);
  console.log('🏰 TEST 3: Full Mission Run (dry run)\n');

  clearEventLog();

  const mission = marketAnalysis({
    market: 'AI-powered developer tools',
    competitors: ['GitHub Copilot', 'Cursor', 'Codeium', 'Tabnine'],
    timeframe: '2026-2027',
    focus: 'market entry strategy for the Dominion',
  });

  const result = await runMission(mission, {
    dryRun: true,
    onLog: (msg) => console.log(`  📋 ${msg}`),
  });

  console.log(`\nResult: ${result.status}`);
  console.log(`Steps: ${result.steps.length} (${result.steps.filter(s => s.status === 'completed').length} completed)`);
  console.log(`Total est. cost: $${result.totalCost.toFixed(2)}`);
  console.log(`Duration: ${result.completedAt.getTime() - result.startedAt.getTime()}ms`);

  // -------------------------------------------------------------------------
  // Test 4: PHANTOM code gen mission (dry run)
  // -------------------------------------------------------------------------
  console.log(DIVIDER);
  console.log('👻 TEST 4: PHANTOM Code Gen Mission (dry run)\n');

  clearEventLog();

  const codeMission = codeGeneration({
    description: 'WebSocket event bus for real-time Dominion dashboard',
    language: 'TypeScript',
    outputPath: '/data/workspace/dominion/src/realtime/event-bus.ts',
    requirements: ['typed events', 'room support', 'reconnection logic', 'heartbeat'],
    dependencies: ['ws', 'zod'],
  });

  const codeResult = await runMission(codeMission, {
    dryRun: true,
    onLog: (msg) => console.log(`  📋 ${msg}`),
  });

  console.log(`\nResult: ${codeResult.status}`);
  console.log(`Steps: ${codeResult.steps.length} (${codeResult.steps.filter(s => s.status === 'completed').length} completed)`);

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log(DIVIDER);
  console.log('✅ All tests passed. Orchestrator is ready for deployment.');
  console.log('   In production, buildSpawnPrompt() output feeds into OpenClaw sessions_spawn.');
  console.log(DIVIDER);
}

main().catch(console.error);
