import Link from 'next/link';
import GeneralSprite from './GeneralSprite';
import HPBar from './HPBar';
import StatusBadge from './StatusBadge';

export default function MissionSlot({ mission }: { mission: any }) {
  const agent = mission.agent_id || mission.assigned_to || mission.general || mission.assignedTo || '';
  const progress = mission.progress_pct ?? mission.progress ?? 0;
  const hpVal = mission.status === 'completed' ? 100 : Math.round(progress);

  return (
    <Link href={`/missions/${mission.id || mission._id}`}>
      <div className="party-slot mb-2">
        <GeneralSprite name={agent} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[9px] font-bold truncate">{mission.title || mission.name}</span>
            <StatusBadge status={mission.status || 'pending'} />
          </div>
          <HPBar value={hpVal} max={100} />
          <div className="flex justify-between mt-1">
            <span className="text-[7px] text-[#707070]">Lv.{mission.priority || 1}</span>
            <span className="text-[7px] text-[#707070]">{agent}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
