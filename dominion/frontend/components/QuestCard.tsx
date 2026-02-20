import Link from 'next/link';
import PixelAvatar from './PixelAvatar';
import StatusBadge from './StatusBadge';
import RPGProgress from './RPGProgress';
import { getGeneralConfig } from '@/lib/generals-config';

export default function QuestCard({ mission }: { mission: any }) {
  const steps = mission.steps || [];
  const done = steps.filter((s: any) => s.status === 'completed' || s.status === 'done').length;
  const total = steps.length || 1;
  const isActive = mission.status === 'active' || mission.status === 'running';

  return (
    <Link href={`/quests/${mission.id}`} className="block">
      <div
        className={`nes-container ${isActive ? 'is-rounded' : ''}`}
        style={{
          cursor: 'pointer',
          transition: 'transform 0.1s ease',
        }}
      >
        <div className="flex items-start gap-3">
          {mission.general && (
            <div className="flex-shrink-0 mt-1">
              <PixelAvatar generalId={getGeneralConfig(mission.general).id} size="sm" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-brown-dark text-sm truncate">{mission.title || mission.name}</h3>
              <StatusBadge status={mission.status || 'pending'} />
            </div>
            {mission.general && (
              <div className="text-xs mb-1" style={{ color: getGeneralConfig(mission.general).color }}>
                {getGeneralConfig(mission.general).name}
              </div>
            )}
            {mission.priority && (
              <div className="mb-1">
                <span className="nes-text is-error" style={{ fontSize: '10px' }}>
                  {'★'.repeat(Math.min(mission.priority === 'high' ? 3 : mission.priority === 'medium' ? 2 : 1, 3))}
                </span>
              </div>
            )}
            {steps.length > 0 && <RPGProgress value={done} max={total} label="HP" variant={isActive ? 'success' : 'primary'} />}
          </div>
        </div>
      </div>
    </Link>
  );
}
