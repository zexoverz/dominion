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
    <div className="space-y-4 bg-terrain-cave min-h-screen">
      <Link href="/missions" className="text-[9px] text-[#78a8e8]">← BACK</Link>

      {/* Summary Screen Style Header */}
      <div className="bg-summary rounded-lg p-4" style={{ minHeight: 200 }}>
        <div className="flex items-start gap-4 pt-4">
          <GeneralSprite name={mission.assignedTo || mission.general || ''} size={96} />
          <div>
            <div className="text-[11px] font-bold mb-1 text-white" style={{ textShadow: '1px 1px 0 #000' }}>{mission.title || mission.name}</div>
            <StatusBadge status={mission.status || 'pending'} />
            <div className="text-[8px] text-white mt-1" style={{ textShadow: '1px 1px 0 #000' }}>
              OT: {mission.assignedTo || mission.general || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* HP Bar with real sprite aesthetic */}
      <PokemonWindow title="HP / PROGRESS">
        <div className="flex items-center gap-2">
          <img src="/assets/pokemon/summary_screen-hp_bar.png" alt="" className="pixel" style={{ imageRendering: 'pixelated', height: 10 }} />
          <div className="flex-1">
            <HPBar value={progress} max={100} />
          </div>
        </div>
        <div className="text-[7px] text-center mt-1">{progress}% — {doneSteps}/{steps.length} steps</div>
      </PokemonWindow>

      {/* EXP Bar */}
      <PokemonWindow title="EXP">
        <div className="flex items-center gap-2">
          <img src="/assets/pokemon/summary_screen-exp_bar.png" alt="" className="pixel" style={{ imageRendering: 'pixelated', height: 10 }} />
          <div className="flex-1">
            <div className="hp-bar-outer">
              <div className="hp-bar-inner" style={{ width: `${progress}%`, background: '#3890f8' }} />
            </div>
          </div>
        </div>
      </PokemonWindow>

      {mission.description && (
        <PokemonWindow cream title="TRAINER MEMO">
          <div className="text-[8px]">{mission.description}</div>
        </PokemonWindow>
      )}

      {steps.length > 0 && (
        <PokemonWindow title="MOVES">
          {steps.map((step: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#d0d0d0] last:border-0">
              <div>
                <div className="text-[9px] font-bold">{step.title || step.name || `Move ${i + 1}`}</div>
                {step.description && <div className="text-[7px] text-[#909090] mt-1">{step.description}</div>}
              </div>
              <div className="text-[8px]">
                <span className={step.status === 'complete' || step.status === 'done' ? 'text-[#48d048]' : 'text-[#909090]'}>
                  {step.status === 'complete' || step.status === 'done' ? '✓ HIT' : '— PP'}
                </span>
              </div>
            </div>
          ))}
        </PokemonWindow>
      )}

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
