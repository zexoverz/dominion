import Link from 'next/link';
import GeneralBadge from './GeneralBadge';
import StatusBadge from './StatusBadge';
import RPGProgress from './RPGProgress';

export default function QuestCard({ mission }: { mission: any }) {
  const steps = mission.steps || [];
  const done = steps.filter((s: any) => s.status === 'completed' || s.status === 'done').length;
  const total = steps.length || 1;
  const isActive = mission.status === 'active' || mission.status === 'running';

  return (
    <Link href={`/quests/${mission.id}`} className="block">
      <div className={`nes-container ${isActive ? 'is-rounded' : ''}`} style={{ cursor: 'pointer' }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-brown-dark truncate">{mission.title || mission.name}</h3>
            {mission.general && <GeneralBadge name={mission.general} />}
          </div>
          <StatusBadge status={mission.status || 'pending'} />
        </div>
        {mission.priority && (
          <span className="nes-text is-error" style={{ fontSize: '10px' }}>
            <i className="nes-icon is-small star"></i> {mission.priority}
          </span>
        )}
        {steps.length > 0 && <RPGProgress value={done} max={total} label="Progress" />}
      </div>
    </Link>
  );
}
