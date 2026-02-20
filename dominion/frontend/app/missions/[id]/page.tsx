import { getMission } from '@/lib/api';
import Link from 'next/link';
import PokemonWindow from '@/components/PokemonWindow';
import GeneralSprite from '@/components/GeneralSprite';
import HPBar from '@/components/HPBar';
import StatusBadge from '@/components/StatusBadge';
import TextBox from '@/components/TextBox';

export default async function MissionDetail({ params }: { params: { id: string } }) {
  let mission: any = null;
  try { mission = await getMission(params.id); } catch {}

  if (!mission) {
    return (
      <PokemonWindow>
        <Link href="/missions" className="text-[9px] text-[#3890f8]">← BACK</Link>
        <div className="text-[9px] mt-4">Mission not found.</div>
      </PokemonWindow>
    );
  }

  const steps = mission.steps || [];
  const doneSteps = steps.filter((s: any) => s.status === 'complete' || s.status === 'done').length;
  const progress = Math.round((mission.progress || 0) * 100);

  return (
    <div className="space-y-4">
      <Link href="/missions" className="text-[9px] text-[#3890f8]">← BACK</Link>

      <PokemonWindow>
        <div className="flex items-start gap-4">
          <GeneralSprite name={mission.assignedTo || mission.general || ''} size={64} />
          <div>
            <div className="text-[11px] font-bold mb-1">{mission.title || mission.name}</div>
            <StatusBadge status={mission.status || 'pending'} />
            <div className="text-[8px] text-[#707070] mt-1">Assigned: {mission.assignedTo || mission.general || 'N/A'}</div>
          </div>
        </div>
      </PokemonWindow>

      {mission.description && (
        <PokemonWindow cream title="MISSION INFO">
          <div className="text-[8px]">{mission.description}</div>
        </PokemonWindow>
      )}

      {steps.length > 0 && (
        <PokemonWindow title="MOVES">
          {steps.map((step: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#d0d0d0] last:border-0">
              <div>
                <div className="text-[9px] font-bold">{step.title || step.name || `Step ${i + 1}`}</div>
                {step.description && <div className="text-[7px] text-[#909090] mt-1">{step.description}</div>}
              </div>
              <div className="text-[8px]">
                <span className={step.status === 'complete' || step.status === 'done' ? 'text-[#48d048]' : 'text-[#909090]'}>
                  {step.status === 'complete' || step.status === 'done' ? '✓' : '—'}
                </span>
              </div>
            </div>
          ))}
        </PokemonWindow>
      )}

      <PokemonWindow title="EXP">
        <HPBar value={progress} max={100} showLabel={false} />
        <div className="text-[7px] text-center mt-1">{progress}% COMPLETE — {doneSteps}/{steps.length} steps</div>
      </PokemonWindow>

      {mission.events && mission.events.length > 0 && (
        <PokemonWindow title="BATTLE LOG">
          <TextBox>
            {mission.events.slice(-5).map((e: any, i: number) => (
              <div key={i} className="text-[7px] mb-1">{e.description || e.message || JSON.stringify(e)}</div>
            ))}
          </TextBox>
        </PokemonWindow>
      )}
    </div>
  );
}
