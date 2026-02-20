export interface GeneralConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  role: string;
  sprite: string;
}

export const GENERALS: Record<string, GeneralConfig> = {
  throne: { id: 'throne', name: 'THRONE', icon: '👑', color: '#c8a832', role: 'Supreme Commander', sprite: '/sprites/throne.png' },
  grimoire: { id: 'grimoire', name: 'GRIMOIRE', icon: '📖', color: '#8b5cf6', role: 'Knowledge & Research', sprite: '/sprites/grimoire.png' },
  echo: { id: 'echo', name: 'ECHO', icon: '🔊', color: '#3465a4', role: 'Communications', sprite: '/sprites/echo.png' },
  seer: { id: 'seer', name: 'SEER', icon: '🔮', color: '#06b6d4', role: 'Analysis & Foresight', sprite: '/sprites/seer.png' },
  phantom: { id: 'phantom', name: 'PHANTOM', icon: '👻', color: '#6b7280', role: 'Covert Operations', sprite: '/sprites/phantom.png' },
  mammon: { id: 'mammon', name: 'MAMMON', icon: '💰', color: '#c8a832', role: 'Finance & Trading', sprite: '/sprites/mammon.png' },
  'wraith-eye': { id: 'wraith-eye', name: 'WRAITH-EYE', icon: '👁️', color: '#c03030', role: 'Surveillance', sprite: '/sprites/wraith-eye.png' },
};

export function getGeneralConfig(nameOrId: string): GeneralConfig {
  const key = nameOrId.toLowerCase().replace(/[^a-z-]/g, '');
  return GENERALS[key] || { id: key, name: nameOrId, icon: '⚔️', color: '#8b6914', role: 'General', sprite: '/sprites/throne.png' };
}
