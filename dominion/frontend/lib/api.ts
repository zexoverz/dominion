const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dominion-api-production.up.railway.app';

async function fetchAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getGenerals() {
  return fetchAPI<any[]>('/generals');
}

export async function getGeneral(id: string) {
  return fetchAPI<any>(`/generals/${id}`);
}

export async function getMissions() {
  return fetchAPI<any[]>('/missions');
}

export async function getProposals() {
  return fetchAPI<any[]>('/proposals');
}

export async function getRoundtables() {
  return fetchAPI<any[]>('/roundtables');
}

export async function getCosts() {
  return fetchAPI<any[]>('/costs');
}

export async function getEvents() {
  return fetchAPI<any[]>('/events');
}

export async function getRelationships() {
  return fetchAPI<any[]>('/relationships');
}
