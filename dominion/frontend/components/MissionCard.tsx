import Link from 'next/link';
import StatusDot from './StatusDot';

const GENERAL_COLORS: Record<string, string> = {
  THRONE: '#f59e0b', GRIMOIRE: '#8b5cf6', SEER: '#06b6d4',
  PHANTOM: '#ef4444', ECHO: '#22c55e', MAMMON: '#f59e0b', 'WRAITH-EYE': '#6366f1',
};

export default function MissionCard({ mission }: { mission: any }) {
  const general = mission.assigned_to || mission.general || '';
  const color = GENERAL_COLORS[general.toUpperCase()] || '#00f0ff';
  const status = mission.status || 'pending';
  const progress = mission.progress ?? (status === 'completed' ? 100 : status === 'active' ? 50 : 0);
  const steps = mission.steps || [];
  const doneSteps = steps.filter((s: any) => s.status === 'done' || s.completed).length;

  return (
    <Link href={`/missions/${mission.id}`} className="block transition-all duration-200 hover:scale-[1.02]">
      <div className="holo-panel scanlines p-4" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
          <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(226,232,240,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
            {general || 'UNASSIGNED'}
          </span>
          <span className="ml-auto">
            <StatusDot status={status} />
          </span>
          <span className="text-xs uppercase" style={{
            color: status === 'completed' ? '#22c55e' : status === 'active' ? '#00f0ff' : '#f59e0b',
            fontFamily: "'JetBrains Mono', monospace"
          }}>{status}</span>
        </div>
        <h3 className="text-sm font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0' }}>
          {mission.title || mission.name || 'Untitled Mission'}
        </h3>
        {mission.description && (
          <p className="text-xs mb-3" style={{ color: 'rgba(226,232,240,0.5)' }}>
            {mission.description?.slice(0, 100)}{mission.description?.length > 100 ? '...' : ''}
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1" style={{ background: 'rgba(0,240,255,0.1)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs" style={{ color: 'rgba(226,232,240,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
            {steps.length > 0 ? `${doneSteps}/${steps.length}` : `${progress}%`}
          </span>
        </div>
      </div>
    </Link>
  );
}
