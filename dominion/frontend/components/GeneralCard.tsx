import StatusDot from './StatusDot';

const GENERAL_META: Record<string, { emoji: string; role: string; color: string; gradient: string }> = {
  THRONE:      { emoji: '👑', role: 'Strategic Command',          color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  GRIMOIRE:    { emoji: '📖', role: 'Knowledge & Research',       color: '#8b5cf6', gradient: 'from-purple-500 to-violet-600' },
  SEER:        { emoji: '🔮', role: 'Market Intelligence',        color: '#06b6d4', gradient: 'from-cyan-500 to-teal-600' },
  PHANTOM:     { emoji: '👻', role: 'Security & Stealth',         color: '#ef4444', gradient: 'from-red-500 to-rose-600' },
  ECHO:        { emoji: '🔊', role: 'Communications',             color: '#22c55e', gradient: 'from-green-500 to-emerald-600' },
  MAMMON:      { emoji: '💰', role: 'Finance & Treasury',         color: '#f59e0b', gradient: 'from-amber-500 to-yellow-600' },
  'WRAITH-EYE':{ emoji: '👁️', role: 'Surveillance & Monitoring',  color: '#6366f1', gradient: 'from-indigo-500 to-blue-600' },
};

export default function GeneralCard({ general }: { general: any }) {
  const name = (general.name || general.id || '').toUpperCase();
  const meta = GENERAL_META[name] || { emoji: '🤖', role: 'Agent', color: '#3b82f6', gradient: 'from-blue-500 to-indigo-600' };
  const initials = name.slice(0, 2);
  const status = general.status || 'idle';
  const lastActive = general.last_active || general.lastActive;

  return (
    <div className="glass glass-hover rounded-xl p-5 transition-all duration-300 group animate-fade-in">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{meta.emoji}</span>
            <h3 className="font-semibold text-white truncate">{name}</h3>
            <StatusDot status={status} />
          </div>
          <p className="text-sm text-white/40">{meta.role}</p>
          {lastActive && (
            <p className="text-xs text-white/25 mt-2">Last active: {new Date(lastActive).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
