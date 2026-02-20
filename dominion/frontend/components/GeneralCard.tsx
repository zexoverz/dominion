import Link from 'next/link';
import StatusDot from './StatusDot';

const GENERALS: Record<string, { name: string; role: string; color: string; icon: string }> = {
  THRONE: { name: 'THRONE', role: 'Strategic Command', color: '#f59e0b', icon: '👑' },
  GRIMOIRE: { name: 'GRIMOIRE', role: 'Knowledge & Research', color: '#8b5cf6', icon: '📖' },
  SEER: { name: 'SEER', role: 'Market Intelligence', color: '#06b6d4', icon: '🔮' },
  PHANTOM: { name: 'PHANTOM', role: 'Security & Stealth', color: '#ef4444', icon: '👻' },
  ECHO: { name: 'ECHO', role: 'Communications', color: '#22c55e', icon: '🔊' },
  MAMMON: { name: 'MAMMON', role: 'Finance & Treasury', color: '#f59e0b', icon: '💰' },
  'WRAITH-EYE': { name: 'WRAITH-EYE', role: 'Surveillance', color: '#6366f1', icon: '👁️' },
};

export default function GeneralCard({ general }: { general: any }) {
  const key = (general.name || general.id || '').toUpperCase();
  const meta = GENERALS[key] || { name: key, role: 'Unknown', color: '#00f0ff', icon: '⬡' };
  const id = general.id || key.toLowerCase();

  return (
    <Link href={`/generals/${id}`} className="block">
      <div className="holo-panel p-5 transition-all duration-200 hover:scale-[1.02]"
        style={{ overflow: 'hidden', borderLeft: `3px solid ${meta.color}`, cursor: 'pointer' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center shrink-0"
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: `${meta.color}15`,
              border: `2px solid ${meta.color}40`,
              fontSize: 22,
            }}>
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0' }}>
              {meta.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.5)' }}>{meta.role}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusDot status={general.status || 'online'} />
            <span className="text-xs uppercase" style={{ color: 'rgba(226,232,240,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
              {general.status || 'online'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
