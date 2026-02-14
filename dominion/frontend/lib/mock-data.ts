export type GeneralStatus = "ACTIVE" | "IDLE" | "OFFLINE";
export type MissionStatus = "PROPOSED" | "IN_PROGRESS" | "REVIEW" | "COMPLETE" | "active" | "completed" | "pending" | "review";
export type MissionPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type Vote = "APPROVE" | "REJECT" | "ABSTAIN" | null;

export interface General {
  id: string;
  name: string;
  title: string;
  emoji: string;
  color: string;
  bgColor: string;
  status: GeneralStatus;
  model: string;
  currentMission: string | null;
  personality: {
    strategy: number;
    creativity: number;
    loyalty: number;
    aggression: number;
    wisdom: number;
    stealth: number;
  };
  relationships: Record<string, number>;
  phase: number;
  costToday: number;
  totalMissions: number;
  description: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  priority: MissionPriority;
  status: MissionStatus;
  assignedTo: string;
  progress: number;
  createdAt: string;
  reward: string;
}

export interface RoundtableMessage {
  id: string;
  generalId: string;
  message: string;
  timestamp: string;
  vote?: Vote;
}

export interface CostEntry {
  date: string;
  generalId: string;
  amount: number;
}

export const generals: General[] = [
  {
    id: "throne",
    name: "THRONE",
    title: "The Sovereign Mind",
    emoji: "👑",
    color: "#fbbf24",
    bgColor: "#422006",
    status: "ACTIVE",
    model: "Opus",
    currentMission: "Orchestrating Phase 1 deployment",
    personality: { strategy: 95, creativity: 70, loyalty: 100, aggression: 40, wisdom: 90, stealth: 20 },
    relationships: { seer: 85, phantom: 70, warden: 60, herald: 75, forge: 65, cipher: 50 },
    phase: 1,
    costToday: 4.52,
    totalMissions: 23,
    description: "The central orchestrator. THRONE commands the Dominion with absolute authority, delegating missions and resolving conflicts between generals.",
  },
  {
    id: "seer",
    name: "SEER",
    title: "The Oracle of Data",
    emoji: "🔮",
    color: "#a78bfa",
    bgColor: "#1e1b4b",
    status: "ACTIVE",
    model: "Opus",
    currentMission: "Analyzing market sentiment patterns",
    personality: { strategy: 80, creativity: 85, loyalty: 75, aggression: 15, wisdom: 95, stealth: 60 },
    relationships: { throne: 85, phantom: 65, warden: 55, herald: 70, forge: 80, cipher: 75 },
    phase: 1,
    costToday: 3.18,
    totalMissions: 19,
    description: "The intelligence gatherer. SEER processes vast amounts of data, identifies patterns, and delivers prophetic insights to guide the Dominion's strategy.",
  },
  {
    id: "phantom",
    name: "PHANTOM",
    title: "The Shadow Executor",
    emoji: "👻",
    color: "#94a3b8",
    bgColor: "#0f172a",
    status: "ACTIVE",
    model: "Sonnet",
    currentMission: "Stealth code deployment",
    personality: { strategy: 75, creativity: 60, loyalty: 80, aggression: 70, wisdom: 50, stealth: 99 },
    relationships: { throne: 70, seer: 65, warden: 45, herald: 30, forge: 55, cipher: 85 },
    phase: 1,
    costToday: 1.87,
    totalMissions: 31,
    description: "The silent operator. PHANTOM executes tasks in the shadows — deploying code, running scripts, and handling operations that require precision and discretion.",
  },
  {
    id: "warden",
    name: "WARDEN",
    title: "The Shield of Order",
    emoji: "🛡️",
    color: "#60a5fa",
    bgColor: "#172554",
    status: "IDLE",
    model: "Sonnet",
    currentMission: null,
    personality: { strategy: 70, creativity: 30, loyalty: 95, aggression: 55, wisdom: 80, stealth: 10 },
    relationships: { throne: 60, seer: 55, phantom: 45, herald: 65, forge: 70, cipher: 40 },
    phase: 2,
    costToday: 0.42,
    totalMissions: 8,
    description: "The guardian. WARDEN monitors system health, enforces safety protocols, and ensures no general exceeds their authority or budget.",
  },
  {
    id: "herald",
    name: "HERALD",
    title: "The Voice of the Realm",
    emoji: "📯",
    color: "#f97316",
    bgColor: "#431407",
    status: "IDLE",
    model: "Sonnet",
    currentMission: null,
    personality: { strategy: 50, creativity: 90, loyalty: 70, aggression: 25, wisdom: 65, stealth: 5 },
    relationships: { throne: 75, seer: 70, phantom: 30, warden: 65, forge: 60, cipher: 35 },
    phase: 2,
    costToday: 0.15,
    totalMissions: 5,
    description: "The communicator. HERALD crafts messages, generates reports, and serves as the public face of the Dominion's operations.",
  },
  {
    id: "forge",
    name: "FORGE",
    title: "The Architect of Tools",
    emoji: "⚒️",
    color: "#ef4444",
    bgColor: "#450a0a",
    status: "OFFLINE",
    model: "Haiku",
    currentMission: null,
    personality: { strategy: 60, creativity: 95, loyalty: 65, aggression: 45, wisdom: 70, stealth: 15 },
    relationships: { throne: 65, seer: 80, phantom: 55, warden: 70, herald: 60, cipher: 90 },
    phase: 3,
    costToday: 0,
    totalMissions: 0,
    description: "The builder. FORGE creates tools, scripts, and infrastructure that empower the other generals to execute their missions more effectively.",
  },
  {
    id: "cipher",
    name: "CIPHER",
    title: "The Keeper of Secrets",
    emoji: "🗝️",
    color: "#22d3ee",
    bgColor: "#083344",
    status: "OFFLINE",
    model: "Haiku",
    currentMission: null,
    personality: { strategy: 85, creativity: 75, loyalty: 60, aggression: 30, wisdom: 85, stealth: 95 },
    relationships: { throne: 50, seer: 75, phantom: 85, warden: 40, herald: 35, forge: 90 },
    phase: 3,
    costToday: 0,
    totalMissions: 0,
    description: "The cryptographer. CIPHER handles encryption, security analysis, and protects the Dominion's most sensitive information.",
  },
];

export const missions: Mission[] = [
  {
    id: "m1",
    title: "Deploy the Watchtower",
    description: "Set up monitoring infrastructure for all agent communications and system health metrics.",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    assignedTo: "throne",
    progress: 65,
    createdAt: "2026-02-13",
    reward: "Core Infrastructure Online",
  },
  {
    id: "m2",
    title: "The Oracle's First Vision",
    description: "Complete initial data pipeline setup and deliver first market analysis report.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignedTo: "seer",
    progress: 40,
    createdAt: "2026-02-12",
    reward: "Intelligence Network Active",
  },
  {
    id: "m3",
    title: "Shadow Protocol Alpha",
    description: "Execute first automated deployment pipeline with zero-downtime strategy.",
    priority: "HIGH",
    status: "REVIEW",
    assignedTo: "phantom",
    progress: 90,
    createdAt: "2026-02-11",
    reward: "Stealth Deployment Capability",
  },
  {
    id: "m4",
    title: "Fortify the Gates",
    description: "Implement rate limiting, cost guards, and safety circuits for all generals.",
    priority: "MEDIUM",
    status: "PROPOSED",
    assignedTo: "warden",
    progress: 0,
    createdAt: "2026-02-13",
    reward: "Defense Systems Online",
  },
  {
    id: "m5",
    title: "Craft the Herald's Horn",
    description: "Build notification and reporting system for cross-general communication.",
    priority: "MEDIUM",
    status: "PROPOSED",
    assignedTo: "herald",
    progress: 0,
    createdAt: "2026-02-13",
    reward: "Communication Network",
  },
  {
    id: "m6",
    title: "Decode the Ancient Scrolls",
    description: "Reverse-engineer competitor API patterns and document findings.",
    priority: "LOW",
    status: "COMPLETE",
    assignedTo: "phantom",
    progress: 100,
    createdAt: "2026-02-10",
    reward: "Knowledge +50 XP",
  },
  {
    id: "m7",
    title: "The Throne Room UI",
    description: "Build the command dashboard frontend for Lord Zexo's dominion management.",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    assignedTo: "throne",
    progress: 80,
    createdAt: "2026-02-13",
    reward: "Visual Command Interface",
  },
];

export const roundtableMessages: RoundtableMessage[] = [
  { id: "r1", generalId: "throne", message: "Generals, Phase 1 is nearly complete. Report your status.", timestamp: "19:00", vote: null },
  { id: "r2", generalId: "seer", message: "My data pipelines are 40% operational. I foresee completion within 48 hours.", timestamp: "19:01", vote: "APPROVE" },
  { id: "r3", generalId: "phantom", message: "Shadow Protocol Alpha awaits review. Deployment ready on your command.", timestamp: "19:02", vote: "APPROVE" },
  { id: "r4", generalId: "warden", message: "I request activation. The gates stand unguarded.", timestamp: "19:03", vote: "ABSTAIN" },
  { id: "r5", generalId: "throne", message: "WARDEN, your time approaches. Phase 2 begins when SEER completes the Oracle's Vision.", timestamp: "19:04", vote: null },
  { id: "r6", generalId: "herald", message: "I stand ready to carry the word. Shall I draft the Phase 1 completion report?", timestamp: "19:05", vote: "APPROVE" },
  { id: "r7", generalId: "seer", message: "I sense... opportunity. The data speaks of an untapped resource in sector 7.", timestamp: "19:07", vote: null },
  { id: "r8", generalId: "phantom", message: "I can investigate sector 7 quietly. No one will know we were there.", timestamp: "19:08", vote: "APPROVE" },
];

export const costData: CostEntry[] = [
  { date: "2026-02-07", generalId: "throne", amount: 2.10 },
  { date: "2026-02-07", generalId: "seer", amount: 1.50 },
  { date: "2026-02-07", generalId: "phantom", amount: 0.80 },
  { date: "2026-02-08", generalId: "throne", amount: 3.20 },
  { date: "2026-02-08", generalId: "seer", amount: 2.40 },
  { date: "2026-02-08", generalId: "phantom", amount: 1.10 },
  { date: "2026-02-09", generalId: "throne", amount: 4.00 },
  { date: "2026-02-09", generalId: "seer", amount: 2.80 },
  { date: "2026-02-09", generalId: "phantom", amount: 1.50 },
  { date: "2026-02-10", generalId: "throne", amount: 3.50 },
  { date: "2026-02-10", generalId: "seer", amount: 3.10 },
  { date: "2026-02-10", generalId: "phantom", amount: 2.00 },
  { date: "2026-02-11", generalId: "throne", amount: 4.20 },
  { date: "2026-02-11", generalId: "seer", amount: 2.90 },
  { date: "2026-02-11", generalId: "phantom", amount: 1.70 },
  { date: "2026-02-12", generalId: "throne", amount: 3.80 },
  { date: "2026-02-12", generalId: "seer", amount: 3.50 },
  { date: "2026-02-12", generalId: "phantom", amount: 2.10 },
  { date: "2026-02-13", generalId: "throne", amount: 4.52 },
  { date: "2026-02-13", generalId: "seer", amount: 3.18 },
  { date: "2026-02-13", generalId: "phantom", amount: 1.87 },
  { date: "2026-02-13", generalId: "warden", amount: 0.42 },
  { date: "2026-02-13", generalId: "herald", amount: 0.15 },
];

export const dailyBudget = 25;
export const weeklyBudget = 150;
export const monthlyBudget = 500;
