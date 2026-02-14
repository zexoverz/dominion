const BASE = 'https://dominion-api-production.up.railway.app';

const endpoints = [
  'GET /api/generals',
  'GET /api/generals/THRONE',
  'GET /api/missions',
  'GET /api/missions?status=active',
  'GET /api/proposals',
  'GET /api/proposals?status=pending',
  'GET /api/roundtables',
  'GET /api/costs',
  'GET /api/costs/daily',
  'GET /api/events',
  'GET /api/relationships',
];

let passed = 0, failed = 0;

for (const ep of endpoints) {
  const [method, path] = ep.split(' ');
  const res = await fetch(`${BASE}${path}`);
  const data = await res.json();
  const shape = Array.isArray(data) ? `Array[${data.length}]` : typeof data === 'object' ? `{${Object.keys(data).join(',')}}` : typeof data;
  const ok = res.status === 200;
  console.log(`${ok ? '✅' : '❌'} ${res.status} ${ep} → ${shape}`);
  ok ? passed++ : failed++;
}

console.log(`\n${passed}/${passed + failed} passed`);
if (failed) process.exit(1);
