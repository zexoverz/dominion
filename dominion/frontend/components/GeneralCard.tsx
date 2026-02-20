import { GENERALS } from '@/lib/generals';
import StatusDot from './StatusDot';

export default function GeneralCard({ general }: { general: any }) {
  const key = (general.name || general.id || '').toUpperCase();
  const meta = GENERALS[key] || { name: key, role: 'Unknown', color: '#00f0ff', icon: '⬡' };

  return (
    <div
      className="holo-panel scanlines p-5 transition-all duration-300 hover:scale-[1.02]"
      style={{
        position: 'relative',
        overflow: 'hidden',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderColor: meta.color,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${meta.color}40, inset 0 0 20px ${meta.color}10`;
        (e.currentTarget as HTMLElement).style.borderColor = meta.color;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.borderColor = '';
      }}
    >
      <div
        className="flex items-center justify-center mb-2"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: `2px solid ${meta.color}`,
          boxShadow: `0 0 12px ${meta.color}60`,
          fontSize: 22,
        }}
      >
        {meta.icon}
      </div>
      <h3 className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {meta.name}
      </h3>
      <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{meta.role}</p>
      <div className="flex items-center gap-1 mt-2">
        <StatusDot status={general.status || 'online'} />
        <span className="text-xs">{general.status || 'online'}</span>
      </div>
      {general.mission_count !== undefined && (
        <span className="label mt-1">{general.mission_count} missions</span>
      )}
    </div>
  );
}
