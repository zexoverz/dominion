// Dominion API client — v2 (fixed /api/ prefix Feb 14 2026)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dominion-api-production.up.railway.app';

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getGenerals() {
  return fetchAPI<any[]>('/api/generals');
}

export async function getGeneral(id: string) {
  return fetchAPI<any>(`/api/generals/${id}`);
}

export async function getMissions() {
  return fetchAPI<any[]>('/api/missions');
}

export async function getProposals() {
  return fetchAPI<any[]>('/api/proposals');
}

export async function getRoundtables() {
  return fetchAPI<any[]>('/api/roundtables');
}

export async function getCosts() {
  return fetchAPI<any[]>('/api/costs');
}

export async function getDailyCosts() {
  return fetchAPI<any[]>('/api/costs/daily');
}

export async function getEvents() {
  return fetchAPI<any[]>('/api/events');
}

export async function getRelationships() {
  return fetchAPI<any[]>('/api/relationships');
}

export async function patchProposal(id: string, data: Record<string, any>) {
  const res = await fetch(`${API_BASE}/api/proposals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function patchMission(id: string, data: Record<string, any>) {
  const res = await fetch(`${API_BASE}/api/missions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getReports() {
  return fetchAPI<any[]>('/api/reports');
}

export async function getReport(slug: string) {
  return fetchAPI<any>(`/api/reports/${slug}`);
}

export async function createProposal(data: Record<string, any>) {
  const res = await fetch(`${API_BASE}/api/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
