export interface GeneralConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  role: string;
}

export const GENERALS: Record<string, GeneralConfig> = {
  throne: { id: 'throne', name: 'THRONE', icon: '👑', color: '#c8a832', role: 'Supreme Commander' },
  grimoire: { id: 'grimoire', name: 'GRIMOIRE', icon: '📖', color: '#8b5cf6', role: 'Knowledge & Research' },
  echo: { id: 'echo', name: 'ECHO', icon: '🔊', color: '#3465a4', role: 'Communications' },
  seer: { id: 'seer', name: 'SEER', icon: '🔮', color: '#06b6d4', role: 'Analysis & Foresight' },
  phantom: { id: 'phantom', name: 'PHANTOM', icon: '👻', color: '#6b7280', role: 'Covert Operations' },
  mammon: { id: 'mammon', name: 'MAMMON', icon: '💰', color: '#c8a832', role: 'Finance & Trading' },
  'wraith-eye': { id: 'wraith-eye', name: 'WRAITH-EYE', icon: '👁️', color: '#c03030', role: 'Surveillance' },
};

export function getGeneralConfig(nameOrId: string): GeneralConfig {
  const key = nameOrId.toLowerCase().replace(/[^a-z-]/g, '');
  return GENERALS[key] || { id: key, name: nameOrId, icon: '⚔️', color: '#8b6914', role: 'General' };
}
