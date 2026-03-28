import { generals as mockGenerals, General } from "./mock-data";

/**
 * Merge API generals into mock generals.
 * API lacks UI fields (personality, color, bgColor, phase, costToday, status, etc.)
 * so we overlay API data on top of mock defaults, keeping mock's UI fields intact.
 * 
 * ID mapping: API uses WRAITH_EYE, frontend uses wraith_eye (lowercase).
 * Names may differ (WRAITH-EYE vs WRAITH_EYE), so we normalize for matching.
 */
function normalizeId(id: string): string {
  return (id || '').toUpperCase().replace(/-/g, '_');
}

export function mergeGenerals(apiGenerals: any[]): General[] {
  if (!Array.isArray(apiGenerals) || apiGenerals.length === 0) return mockGenerals;
  return mockGenerals.map((mock) => {
    const mockNorm = normalizeId(mock.id);
    const api = apiGenerals.find(
      (a: any) =>
        normalizeId(a.id) === mockNorm ||
        normalizeId(a.name) === mockNorm
    );
    // Only overlay safe fields from API (don't clobber UI-specific ones)
    if (!api) return mock;
    return {
      ...mock,
      title: api.title || mock.title,
      model: api.model || mock.model,
      description: api.role || mock.description,
    };
  });
}
