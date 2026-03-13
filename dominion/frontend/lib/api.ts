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

export async function getMission(id: string) {
  return fetchAPI<any>(`/api/missions/${id}`);
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

export async function createMission(data: Record<string, any>) {
  const res = await fetch(`${API_BASE}/api/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ═══ Portfolio API ═══

export async function getPortfolioSummary(password?: string) {
  return fetchAPI<any>(`/api/portfolio/summary${password ? `?password=${password}` : ''}`);
}

export async function getPortfolioHoldings(password?: string) {
  return fetchAPI<any[]>(`/api/portfolio/holdings${password ? `?password=${password}` : ''}`);
}

export async function getPortfolioCards(franchise?: string, password?: string) {
  const params = new URLSearchParams();
  if (franchise) params.set('franchise', franchise);
  if (password) params.set('password', password);
  const qs = params.toString();
  return fetchAPI<any[]>(`/api/portfolio/cards${qs ? `?${qs}` : ''}`);
}

export async function getPortfolioCard(id: string, password?: string) {
  return fetchAPI<any>(`/api/portfolio/cards/${id}${password ? `?password=${password}` : ''}`);
}

export async function getPortfolioCardPrices(id: string, days?: number, password?: string) {
  const params = new URLSearchParams();
  if (days) params.set('days', String(days));
  if (password) params.set('password', password);
  const qs = params.toString();
  return fetchAPI<any[]>(`/api/portfolio/cards/${id}/prices${qs ? `?${qs}` : ''}`);
}

export async function getPortfolioDcaLog(password?: string) {
  return fetchAPI<any[]>(`/api/portfolio/dca-log${password ? `?password=${password}` : ''}`);
}

export async function getPortfolioFunds(password?: string) {
  return fetchAPI<any[]>(`/api/portfolio/funds${password ? `?password=${password}` : ''}`);
}

export async function getPortfolioAnalytics(password?: string) {
  return fetchAPI<any>(`/api/portfolio/analytics${password ? `?password=${password}` : ''}`);
}

export async function getPortfolioMasterplan(password?: string) {
  return fetchAPI<any>(`/api/portfolio/masterplan${password ? `?password=${password}` : ''}`);
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
