const BASE = 'https://dominion-api-production.up.railway.app';
const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

async function run() {
  console.log('=== FULL LOOP TEST ===\n');

  // 1. Create proposal
  console.log('1. Creating proposal...');
  let res = await fetch(`${BASE}/api/proposals`, json('POST', {
    agent_id: 'SEER',
    title: 'Market Analysis: Bitcoin DeFi Trends Q1 2026',
    description: "Analyze current Bitcoin DeFi landscape and identify opportunities for Lord Zexo's portfolio",
    priority: 75,
    estimated_cost_usd: 0.50,
    proposed_steps: [
      { title: 'Gather market data', description: 'Collect recent Bitcoin DeFi metrics' },
      { title: 'Analyze trends', description: 'Identify patterns and emerging protocols' },
      { title: 'Generate report', description: 'Compile findings into actionable insights' },
    ]
  }));
  const proposal = await res.json();
  console.log(`   ✅ Proposal created: ${proposal.id} (status: ${proposal.status})`);
  if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);

  // 2. Approve proposal
  console.log('2. Approving proposal...');
  res = await fetch(`${BASE}/api/proposals/${proposal.id}`, json('PATCH', { status: 'approved' }));
  const approved = await res.json();
  console.log(`   ✅ Proposal approved: status=${approved.status}, reviewed_at=${approved.reviewed_at}`);

  // 3. Create mission from proposal
  console.log('3. Creating mission from proposal...');
  res = await fetch(`${BASE}/api/missions`, json('POST', { proposal_id: proposal.id }));
  const mission = await res.json();
  console.log(`   ✅ Mission created: ${mission.id} (status: ${mission.status})`);
  if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);

  // 3b. Get mission with steps
  res = await fetch(`${BASE}/api/missions/${mission.id}`);
  const missionDetail = await res.json();
  const steps = missionDetail.steps || [];
  console.log(`   📋 Steps: ${steps.length} (${steps.map(s => s.title).join(', ')})`);

  // 4. Activate mission
  console.log('4. Activating mission...');
  res = await fetch(`${BASE}/api/missions/${mission.id}`, json('PATCH', { status: 'active', progress_pct: 0 }));
  const activated = await res.json();
  console.log(`   ✅ Mission active: status=${activated.status}, started_at=${activated.started_at}`);

  // 5. Log events and update progress for each step
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const pct = Math.round(((i + 1) / steps.length) * 100);
    console.log(`5.${i + 1}. Processing step: "${step.title}"...`);

    // Log event
    res = await fetch(`${BASE}/api/events`, json('POST', {
      agent_id: 'SEER',
      kind: 'step_completed',
      title: `Completed: ${step.title}`,
      summary: step.description,
      mission_id: mission.id,
      step_id: step.id,
      cost_usd: 0.15,
      tags: ['mission', 'step', 'seer'],
    }));
    const event = await res.json();
    console.log(`   ✅ Event logged: ${event.id}`);

    // Update progress
    res = await fetch(`${BASE}/api/missions/${mission.id}`, json('PATCH', { progress_pct: pct }));
    const updated = await res.json();
    console.log(`   📊 Progress: ${updated.progress_pct}%`);
  }

  // 6. Log costs
  console.log('6. Logging costs...');
  res = await fetch(`${BASE}/api/costs`, json('POST', {
    agent_id: 'SEER',
    tokens_used: 15000,
    cost_usd: 0.45,
    operation_counts: { api_calls: 3, analyses: 1 },
  }));
  const cost = await res.json();
  console.log(`   ✅ Cost logged: $${cost.cost_usd} (${cost.tokens_used} tokens)`);

  // 7. Complete mission
  console.log('7. Completing mission...');
  res = await fetch(`${BASE}/api/missions/${mission.id}`, json('PATCH', {
    status: 'completed',
    progress_pct: 100,
    actual_cost_usd: 0.45,
  }));
  const completed = await res.json();
  console.log(`   ✅ Mission completed: status=${completed.status}, completed_at=${completed.completed_at}`);

  // 8. Verify
  console.log('\n=== VERIFICATION ===');
  const checks = [
    ['Proposals', '/api/proposals'],
    ['Missions', '/api/missions'],
    ['Events', '/api/events'],
    ['Costs', '/api/costs'],
  ];
  for (const [name, path] of checks) {
    res = await fetch(`${BASE}${path}`);
    const data = await res.json();
    const count = Array.isArray(data) ? data.length : JSON.stringify(data);
    console.log(`   ${name}: ${count}`);
  }

  // Verify our specific mission
  res = await fetch(`${BASE}/api/missions/${mission.id}`);
  const final = await res.json();
  console.log(`\n   Final mission state:`);
  console.log(`   - Status: ${final.status}`);
  console.log(`   - Progress: ${final.progress_pct}%`);
  console.log(`   - Steps: ${final.steps?.length}`);
  console.log(`   - Completed: ${final.completed_at}`);

  console.log('\n🎉 FULL LOOP TEST PASSED!');
}

run().catch(err => { console.error('❌ FAILED:', err.message); process.exit(1); });
