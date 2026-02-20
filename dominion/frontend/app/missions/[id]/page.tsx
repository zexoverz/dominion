import { getMission, getMissions } from '@/lib/api';
import HoloPanel from '@/components/HoloPanel';
import StatusDot from '@/components/StatusDot';
import Link from 'next/link';

export default async function MissionDetailPage({ params }: { params: { id: string } }) {
  let mission: any = null;
  try { mission = await getMission(params.id); } catch {}

  if (!mission) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <Link href="/missions" className="text-xs uppercase tracking-widest mb-4 inline-block" style={{ color: '#00f0ff' }}>← BACK TO MISSIONS</Link>
        <HoloPanel>
          <div className="text-center py-12" style={{ color: 'rgba(226,232,240,0.4)' }}>MISSION NOT FOUND</div>
        </HoloPanel>
      </div>
    );
  }

  const status = mission.status || 'pending';
  const progress = mission.progress ?? (status === 'completed' ? 100 : status === 'active' ? 50 : 0);
  const steps = mission.steps || [];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link href="/missions" className="text-xs uppercase tracking-widest mb-4 inline-block transition-colors hover:opacity-80" style={{ color: '#00f0ff', fontFamily: "'JetBrains Mono', monospace" }}>
        ← BACK TO MISSIONS
      </Link>

      <HoloPanel>
        <div className="flex items-center gap-3 mb-4">
          <StatusDot status={status} />
          <span className="badge badge-{status} text-xs uppercase tracking-wider"
            style={{ color: status === 'completed' ? '#22c55e' : status === 'active' ? '#00f0ff' : '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}>
            {status}
          </span>
          {mission.assigned_to && (
            <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(226,232,240,0.5)' }}>
              • {mission.assigned_to}
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0' }}>
          {mission.title || mission.name || 'Untitled Mission'}
        </h1>

        {mission.description && (
          <p className="text-sm mb-6" style={{ color: 'rgba(226,232,240,0.6)', lineHeight: 1.7 }}>
            {mission.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(226,232,240,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
            <span>PROGRESS</span>
            <span>{progress}%</span>
          </div>
          <div style={{ background: 'rgba(0,240,255,0.1)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
            <div className="progress-bar" style={{ width: `${progress}%`, height: '100%' }} />
          </div>
        </div>

        {/* Steps */}
        {steps.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: '#00f0ff', fontFamily: "'JetBrains Mono', monospace" }}>
              MISSION STEPS ({steps.filter((s: any) => s.status === 'done' || s.completed).length}/{steps.length})
            </h2>
            <div className="space-y-3">
              {steps.map((step: any, i: number) => {
                const done = step.status === 'done' || step.completed;
                return (
                  <div key={step.id || i} className="flex items-start gap-3 p-3"
                    style={{ background: done ? 'rgba(34,197,94,0.05)' : 'rgba(0,240,255,0.03)', borderRadius: 8, border: `1px solid ${done ? 'rgba(34,197,94,0.15)' : 'rgba(0,240,255,0.08)'}` }}>
                    <span className="mt-0.5 text-sm" style={{ color: done ? '#22c55e' : 'rgba(226,232,240,0.3)' }}>
                      {done ? '✓' : `${i + 1}`}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm" style={{ color: done ? 'rgba(226,232,240,0.5)' : '#e2e8f0', textDecoration: done ? 'line-through' : 'none' }}>
                        {step.title || step.name || step.description || `Step ${i + 1}`}
                      </div>
                      {step.description && step.title && (
                        <div className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.4)' }}>{step.description}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Events */}
        {mission.events && mission.events.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-widest mb-3" style={{ color: '#00f0ff', fontFamily: "'JetBrains Mono', monospace" }}>
              EVENT LOG
            </h2>
            <div className="space-y-2">
              {mission.events.slice(-10).map((ev: any, i: number) => (
                <div key={i} className="text-xs flex gap-2" style={{ color: 'rgba(226,232,240,0.5)' }}>
                  <span style={{ color: 'rgba(0,240,255,0.4)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
                    {ev.created_at ? new Date(ev.created_at).toLocaleString() : '—'}
                  </span>
                  <span>{ev.description || ev.type || 'Event'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </HoloPanel>
    </div>
  );
}
