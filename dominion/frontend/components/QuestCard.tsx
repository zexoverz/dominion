import Link from 'next/link';
import GeneralBadge from './GeneralBadge';
import StatusBadge from './StatusBadge';
import RPGProgress from './RPGProgress';

export default function QuestCard({ mission }: { mission: any }) {
  const steps = mission.steps || [];
  const done = steps.filter((s: any) => s.status === 'completed' || s.status === 'done').length;
  const total = steps.length || 1;

  return (
    <Link href={`/quests/${mission.id}`} className="block rpg-panel hover:border-gold transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-brown-dark truncate">{mission.title || mission.name}</h3>
          {mission.general && <GeneralBadge name={mission.general} />}
        </div>
        <StatusBadge status={mission.status || 'pending'} />
      </div>
      {mission.priority && (
        <span className="text-xs text-crimson font-bold">⚡ {mission.priority}</span>
      )}
      {steps.length > 0 && <RPGProgress value={done} max={total} label="Progress" />}
    </Link>
  );
}
