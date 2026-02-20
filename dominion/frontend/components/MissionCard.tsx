'use client';
import { useState } from 'react';
import StatusDot from './StatusDot';

export default function MissionCard({ mission }: { mission: any }) {
  const [expanded, setExpanded] = useState(false);
  const steps = mission.steps || [];
  const completedSteps = steps.filter((s: any) => s.status === 'done' || s.completed).length;
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;
  const status = mission.status || 'active';

  return (
    <div
      className="glass glass-hover rounded-xl p-5 transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <StatusDot status={status} />
          <h3 className="font-semibold text-white">{mission.title || mission.name}</h3>
        </div>
        <span className="text-xs text-white/30 uppercase tracking-wider">{status}</span>
      </div>
      {mission.description && (
        <p className="text-sm text-white/40 mb-3 line-clamp-2">{mission.description}</p>
      )}
      {steps.length > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-white/30 mb-1">
            <span>{completedSteps}/{steps.length} steps</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {expanded && steps.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
          {steps.map((step: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={step.status === 'done' || step.completed ? 'text-green-400' : 'text-white/20'}>
                {step.status === 'done' || step.completed ? '✓' : '○'}
              </span>
              <span className={step.status === 'done' || step.completed ? 'text-white/60' : 'text-white/40'}>
                {step.title || step.description || step.name || `Step ${i + 1}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
