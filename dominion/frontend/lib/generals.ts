export const GENERALS: Record<string, { name: string; role: string; color: string; icon: string }> = {
  THRONE: { name: 'THRONE', role: 'Strategic Command', color: '#f59e0b', icon: '👑' },
  GRIMOIRE: { name: 'GRIMOIRE', role: 'Knowledge & Research', color: '#8b5cf6', icon: '📖' },
  SEER: { name: 'SEER', role: 'Market Intelligence', color: '#06b6d4', icon: '🔮' },
  PHANTOM: { name: 'PHANTOM', role: 'Security & Stealth', color: '#ef4444', icon: '👻' },
  ECHO: { name: 'ECHO', role: 'Communications', color: '#22c55e', icon: '🔊' },
  MAMMON: { name: 'MAMMON', role: 'Finance & Treasury', color: '#f59e0b', icon: '💰' },
  'WRAITH-EYE': { name: 'WRAITH-EYE', role: 'Surveillance', color: '#6366f1', icon: '👁️' },
};

export function getGeneralColor(name: string): string {
  const key = name?.toUpperCase() || '';
  return GENERALS[key]?.color || '#00f0ff';
}

export function getGeneralIcon(name: string): string {
  const key = name?.toUpperCase() || '';
  return GENERALS[key]?.icon || '⬡';
}
