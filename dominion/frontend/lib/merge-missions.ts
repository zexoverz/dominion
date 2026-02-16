import { missions as mockMissions, Mission } from "./mock-data";

/**
 * Normalize API missions into the frontend Mission shape.
 * API fields: id, proposal_id, agent_id, title, description, status, steps, created_at
 * Frontend expects: id, title, description, priority, status, assignedTo, progress, createdAt, reward
 */
export function normalizeMission(api: any): Mission {
  return {
    id: api.id || "",
    title: api.title || "Untitled Mission",
    description: api.description || "",
    priority: api.priority || "MEDIUM",
    status: api.status || "pending",
    assignedTo: api.assignedTo || api.agent_id?.toLowerCase() || "throne",
    progress: api.progress_pct ?? api.progress ?? (api.status === "completed" ? 100 : api.status === "active" ? 0 : 0),
    createdAt: api.created_at
      ? new Date(api.created_at).toLocaleDateString()
      : api.createdAt || "",
    reward: api.reward || "Experience & Intel",
  };
}

export function mergeMissions(apiMissions: any[]): Mission[] {
  if (!Array.isArray(apiMissions) || apiMissions.length === 0) return mockMissions;
  // Return normalized API missions + any mock missions not in API
  const normalized = apiMissions.map(normalizeMission);
  const apiIds = new Set(normalized.map((m) => m.id));
  const extras = mockMissions.filter((m) => !apiIds.has(m.id));
  return [...normalized, ...extras];
}
