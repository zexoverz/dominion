import { getGeneralColor } from '@/lib/generals';
import StatusDot from './StatusDot';

export default function MissionCard({ mission }: { mission: any }) {
  const color = getGeneralColor(mission.assigned_to || mission.general || '');
  const status = mission.status || 'pending';
  const progress = mission.progress ?? (status === 'completed' ? 100 : status === 'active' ? 50 : 0);

  return (
    <div className="holo-panel scanlines p-4" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
        <span className="label">{mission.assigned_to || mission.general || 'UNASSIGNED'}</span>
        <span className="ml-auto">
          <span className={`badge badge-${status}`}>{status}</span>
        </span>
      </div>
      <h3 className="text-sm font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {mission.title || mission.name || 'Untitled Mission'}
      </h3>
      {mission.description && (
        <p className="text-xs mb-2" style={{ color: 'rgba(226,232,240,0.6)' }}>
          {mission.description?.slice(0, 120)}
        </p>
      )}
      <div style={{ background: 'rgba(0,240,255,0.1)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      {mission.steps && mission.steps.length > 0 && (
        <div className="mt-3 pl-3" style={{ borderLeft: '2px solid rgba(0,240,255,0.2)' }}>
          {mission.steps.map((step: any, i: number) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <span style={{ color: step.completed ? '#22c55e' : 'rgba(226,232,240,0.3)' }}>
                {step.completed ? '✓' : '○'}
              </span>
              <span className="text-xs">{step.title || step.name || step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
