import { generals as mockGenerals, General } from "./mock-data";

/**
 * Merge API generals into mock generals.
 * API lacks UI fields (personality, color, bgColor, phase, costToday, status, etc.)
 * so we overlay API data on top of mock defaults, keeping mock's UI fields intact.
 */
export function mergeGenerals(apiGenerals: any[]): General[] {
  if (!Array.isArray(apiGenerals) || apiGenerals.length === 0) return mockGenerals;
  return mockGenerals.map((mock) => {
    const api = apiGenerals.find(
      (a: any) =>
        a.id?.toUpperCase() === mock.id?.toUpperCase() ||
        a.name?.toUpperCase() === mock.name?.toUpperCase()
    );
    // Only overlay safe fields from API (don't clobber UI-specific ones)
    if (!api) return mock;
    return {
      ...mock,
      title: api.title || mock.title,
      model: api.model || mock.model,
    };
  });
}
