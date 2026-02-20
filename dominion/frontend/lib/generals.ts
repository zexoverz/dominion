export interface GeneralInfo {
  name: string;
  role: string;
  color: string;
  icon: string;
  pokemon: string;
  sprite: string;
  trainer: string;
  types: number[];
  typeNames: string[];
  type: string;
  stats: { atk: number; def: number; spd: number; spa: number; spd2: number; hp: number };
}

export const GENERALS: Record<string, GeneralInfo> = {
  THRONE: { name: 'THRONE', role: 'Strategic Command', color: '#f08030', icon: '👑', pokemon: 'Charizard', sprite: '/assets/pokemon/throne-frlg.png', trainer: '/assets/pokemon/char-lance.png', types: [10, 3], typeNames: ['FIRE', 'FLYING'], type: 'FIRE/FLYING', stats: { atk: 84, def: 78, spd: 100, spa: 109, spd2: 85, hp: 78 } },
  GRIMOIRE: { name: 'GRIMOIRE', role: 'Knowledge & Research', color: '#f85888', icon: '📖', pokemon: 'Mewtwo', sprite: '/assets/pokemon/grimoire-frlg.png', trainer: '/assets/pokemon/char-sabrina.png', types: [14], typeNames: ['PSYCHIC'], type: 'PSYCHIC', stats: { atk: 110, def: 90, spd: 130, spa: 154, spd2: 90, hp: 106 } },
  SEER: { name: 'SEER', role: 'Market Intelligence', color: '#b8a038', icon: '🔮', pokemon: 'Tyranitar', sprite: '/assets/pokemon/seer-frlg.png', trainer: '/assets/pokemon/char-brock.png', types: [6, 17], typeNames: ['ROCK', 'DARK'], type: 'ROCK/DARK', stats: { atk: 134, def: 110, spd: 61, spa: 95, spd2: 100, hp: 100 } },
  PHANTOM: { name: 'PHANTOM', role: 'Security & Stealth', color: '#705898', icon: '👻', pokemon: 'Gengar', sprite: '/assets/pokemon/phantom-frlg.png', trainer: '/assets/pokemon/char-agatha.png', types: [8, 4], typeNames: ['GHOST', 'POISON'], type: 'GHOST/POISON', stats: { atk: 65, def: 60, spd: 110, spa: 130, spd2: 75, hp: 60 } },
  ECHO: { name: 'ECHO', role: 'Communications', color: '#b8b8d0', icon: '🔊', pokemon: 'Metagross', sprite: '/assets/pokemon/echo-frlg.png', trainer: '/assets/pokemon/char-scientist.png', types: [9, 14], typeNames: ['STEEL', 'PSYCHIC'], type: 'STEEL/PSYCHIC', stats: { atk: 135, def: 130, spd: 70, spa: 95, spd2: 90, hp: 80 } },
  MAMMON: { name: 'MAMMON', role: 'Finance & Treasury', color: '#484848', icon: '💰', pokemon: 'Absol', sprite: '/assets/pokemon/mammon-frlg.png', trainer: '/assets/pokemon/char-gentleman.png', types: [17], typeNames: ['DARK'], type: 'DARK', stats: { atk: 130, def: 60, spd: 75, spa: 75, spd2: 60, hp: 65 } },
  'WRAITH-EYE': { name: 'WRAITH-EYE', role: 'Surveillance', color: '#f8d030', icon: '👁️', pokemon: 'Umbreon', sprite: '/assets/pokemon/wraith-frlg.png', trainer: '/assets/pokemon/char-giovanni.png', types: [17], typeNames: ['DARK'], type: 'DARK', stats: { atk: 65, def: 110, spd: 65, spa: 60, spd2: 130, hp: 95 } },
};

export function getGeneralInfo(name: string): GeneralInfo | undefined {
  const key = name?.toUpperCase?.() || '';
  return GENERALS[key] || Object.values(GENERALS).find(g => g.name === key);
}

export function getGeneralKeys(): string[] {
  return Object.keys(GENERALS);
}
