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
    id: "grimoire",
    name: "GRIMOIRE",
    title: "The Living Codex",
    emoji: "📜",
    color: "#60a5fa",
    bgColor: "#172554",
    status: "ACTIVE",
    model: "Sonnet",
    currentMission: "Research & knowledge synthesis",
    personality: { strategy: 70, creativity: 80, loyalty: 85, aggression: 15, wisdom: 95, stealth: 30 },
    relationships: { throne: 80, seer: 85, phantom: 55, echo: 70, mammon: 50, wraith_eye: 60 },
    phase: 1,
    costToday: 0.42,
    totalMissions: 8,
    description: "The Keeper of Knowledge. GRIMOIRE devours documentation, researches protocols, and synthesizes wisdom from chaos. Every EIP, every codebase, every curriculum passes through GRIMOIRE's pages.",
  },
  {
    id: "echo",
    name: "ECHO",
    title: "The Voice of Many",
    emoji: "🔊",
    color: "#f97316",
    bgColor: "#431407",
    status: "ACTIVE",
    model: "Sonnet",
    currentMission: "Content strategy & community engagement",
    personality: { strategy: 50, creativity: 95, loyalty: 70, aggression: 25, wisdom: 60, stealth: 5 },
    relationships: { throne: 75, seer: 65, phantom: 30, grimoire: 70, mammon: 45, wraith_eye: 35 },
    phase: 1,
    costToday: 0.15,
    totalMissions: 5,
    description: "The Voice of the Dominion. ECHO shapes how the world perceives Lord Zexo's empire. Content strategy, brand positioning, community engagement — ECHO ensures the message resonates.",
  },
  {
    id: "mammon",
    name: "MAMMON",
    title: "The Golden Scale",
    emoji: "💰",
    color: "#eab308",
    bgColor: "#422006",
    status: "ACTIVE",
    model: "Haiku",
    currentMission: "Treasury management & DCA tracking",
    personality: { strategy: 85, creativity: 40, loyalty: 90, aggression: 60, wisdom: 80, stealth: 50 },
    relationships: { throne: 85, seer: 90, phantom: 45, grimoire: 50, echo: 40, wraith_eye: 70 },
    phase: 1,
    costToday: 0,
    totalMissions: 3,
    description: "The Golden Arbiter. MAMMON guards the treasury with mathematical precision. Every satoshi is tracked, every DCA scheduled, every war chest trigger calculated. Wealth is a weapon, and MAMMON keeps it sharp.",
  },
  {
    id: "wraith_eye",
    name: "WRAITH-EYE",
    title: "The Silent Watcher",
    emoji: "👁️",
    color: "#22d3ee",
    bgColor: "#083344",
    status: "ACTIVE",
    model: "Haiku",
    currentMission: "System monitoring & security scans",
    personality: { strategy: 75, creativity: 30, loyalty: 80, aggression: 35, wisdom: 70, stealth: 99 },
    relationships: { throne: 70, seer: 65, phantom: 90, grimoire: 55, echo: 30, mammon: 70 },
    phase: 1,
    costToday: 0,
    totalMissions: 2,
    description: "The Eternal Watcher. WRAITH-EYE monitors every heartbeat of every service. Uptime, latency, SSL certs, response times — nothing escapes WRAITH-EYE's gaze.",
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
