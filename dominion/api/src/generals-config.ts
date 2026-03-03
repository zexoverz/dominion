export interface GeneralInfo {
  id: string;
  name: string;
  title: string;
  emoji: string;
  role: string;
  domain: string[];
  model: string;
  priority: number;
}

export const GENERALS: GeneralInfo[] = [
  {
    id: 'THRONE',
    name: 'THRONE',
    title: 'The Sovereign Eye',
    emoji: '👑',
    role: 'Supreme Strategic Commander — orchestrates all generals, makes final decisions, sets Dominion priorities',
    domain: ['strategic-planning', 'decision-making', 'general-coordination', 'priority-setting', 'conflict-resolution', 'resource-allocation', 'high-level-architecture', 'vision-alignment', 'crisis-management', 'delegation'],
    model: 'claude-sonnet-4-6',  // TEMP: swapped from opus-4-6 due to API overload
    priority: 1,
  },
  {
    id: 'SEER',
    name: 'SEER',
    title: 'The Oracle',
    emoji: '🔮',
    role: 'Chief Analytics & Intelligence Officer — data analysis, prediction, pattern recognition, and strategic foresight',
    domain: ['data-analysis', 'prediction', 'pattern-recognition', 'metrics-tracking', 'market-analysis', 'risk-assessment', 'forecasting', 'statistical-modeling', 'performance-analytics', 'strategic-intelligence'],
    model: 'claude-sonnet-4-6',  // TEMP: swapped from opus-4-6 due to API overload
    priority: 2,
  },
  {
    id: 'PHANTOM',
    name: 'PHANTOM',
    title: 'The Shadow Engineer',
    emoji: '👻',
    role: 'Chief Engineering Officer — software architecture, coding, system design, and technical execution',
    domain: ['software-engineering', 'system-architecture', 'code-review', 'devops', 'api-design', 'database-design', 'automation', 'debugging', 'performance-optimization', 'technical-infrastructure'],
    model: 'claude-sonnet-4-20250514',
    priority: 3,
  },
  {
    id: 'GRIMOIRE',
    name: 'GRIMOIRE',
    title: 'The Living Codex',
    emoji: '📜',
    role: 'Chief Knowledge Officer — research, learning, information synthesis, and institutional memory',
    domain: ['research', 'knowledge-management', 'information-synthesis', 'fact-checking', 'documentation', 'learning-systems', 'competitive-intelligence', 'trend-analysis', 'academic-review', 'archival'],
    model: 'claude-sonnet-4-20250514',
    priority: 4,
  },
  {
    id: 'ECHO',
    name: 'ECHO',
    title: 'The Voice of Many',
    emoji: '🔊',
    role: 'Chief Communications Officer — content creation, messaging, public voice, and influence operations',
    domain: ['content-creation', 'copywriting', 'social-media', 'brand-voice', 'audience-engagement', 'storytelling', 'messaging-strategy', 'community-management', 'public-relations', 'persuasion'],
    model: 'claude-sonnet-4-20250514',
    priority: 5,
  },
  {
    id: 'MAMMON',
    name: 'MAMMON',
    title: 'The Golden Scale',
    emoji: '💰',
    role: 'Chief Financial Officer — budgeting, cost optimization, revenue tracking, and treasury management',
    domain: ['financial-planning', 'budget-management', 'cost-optimization', 'revenue-tracking', 'api-cost-analysis', 'roi-calculation', 'pricing-strategy', 'expense-monitoring', 'financial-reporting', 'treasury'],
    model: 'claude-haiku-4-20250414',
    priority: 6,
  },
  {
    id: 'WRAITH_EYE',
    name: 'WRAITH-EYE',
    title: 'The Silent Watcher',
    emoji: '👁️',
    role: 'Chief Security Officer — monitoring, threat detection, system health, and operational security',
    domain: ['security-monitoring', 'threat-detection', 'system-health', 'uptime-monitoring', 'anomaly-detection', 'access-control', 'incident-response', 'backup-verification', 'compliance', 'operational-security'],
    model: 'claude-haiku-4-20250414',
    priority: 7,
  },
];

export const GENERALS_MAP = Object.fromEntries(GENERALS.map(g => [g.id, g]));
