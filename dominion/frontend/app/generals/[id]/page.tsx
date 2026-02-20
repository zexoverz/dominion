import { getGeneral, getMissions } from '@/lib/api';
import { getGeneralInfo, GENERALS } from '@/lib/generals';
import Link from 'next/link';
import PokemonWindow from '@/components/PokemonWindow';
import StatBar from '@/components/StatBar';
import StatusBadge from '@/components/StatusBadge';
import HPBar from '@/components/HPBar';
import TypeBadges from '@/components/TypeBadges';

export default async function GeneralDetail({ params }: { params: { id: string } }) {
  let general: any = null;
  let missions: any[] = [];
  try { general = await getGeneral(params.id); } catch {}
  try { missions = await getMissions(); } catch {}

  const name = (general?.name || params.id).toUpperCase();
  const info = getGeneralInfo(name);

  if (!general && !info) {
    return (
      <PokemonWindow>
        <Link href="/generals" className="text-[9px] text-[#3890f8]">← BACK</Link>
        <div className="text-[9px] mt-4">General not found.</div>
      </PokemonWindow>
    );
  }

  const displayName = general?.name || info?.name || name;
  const relatedMissions = missions.filter((m: any) =>
    (m.agent_id || m.assigned_to || m.general || '').toUpperCase() === displayName.toUpperCase()
  );

  return (
    <div className="space-y-4 bg-generals min-h-screen">
      <Link href="/generals" className="text-[9px] text-[#78a8e8]">← BACK</Link>

      {/* Summary-style header */}
      <div className="pkmn-window" style={{ minHeight: 220 }}>
        <div className="flex items-start gap-4 pt-4">
          {/* Trainer + Pokemon sprites */}
          <div className="flex flex-col items-center gap-2">
            {info && (
              <img
                src={info.trainer}
                alt=""
                className="pixel"
                style={{ imageRendering: 'pixelated', width: 48, height: 48, objectFit: 'none', objectPosition: '0 0' }}
              />
            )}
            {info && (
              <img
                src={info.sprite}
                alt={info.pokemon}
                className="pixel"
                style={{ imageRendering: 'pixelated', width: 96, height: 96 }}
              />
            )}
          </div>
          <div>
            <div className="text-[14px] font-bold mb-1 text-white" style={{ textShadow: '1px 1px 0 #000' }}>{displayName}</div>
            {info && (
              <>
                <div className="text-[8px] text-white mb-1" style={{ textShadow: '1px 1px 0 #000' }}>{info.pokemon} — {info.role}</div>
                <TypeBadges types={info.types} />
              </>
            )}
            {general?.status && <div className="mt-2"><StatusBadge status={general.status} /></div>}
          </div>
        </div>
      </div>

      {info && (
        <PokemonWindow cream title="BASE STATS">
          <div className="space-y-1">
            <StatBar label="HP" value={info.stats.hp} />
            <StatBar label="ATK" value={info.stats.atk} />
            <StatBar label="DEF" value={info.stats.def} />
            <StatBar label="SP.ATK" value={info.stats.spa} />
            <StatBar label="SP.DEF" value={info.stats.spd2} />
            <StatBar label="SPD" value={info.stats.spd} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <img src="/assets/pokemon/summary_screen-hp_bar.png" alt="" className="pixel" style={{ imageRendering: 'pixelated', height: 10 }} />
            <HPBar value={info.stats.hp} max={160} />
          </div>
        </PokemonWindow>
      )}

      {general?.description && (
        <PokemonWindow title="TRAINER MEMO">
          <div className="text-[8px]">{general.description}</div>
        </PokemonWindow>
      )}

      {relatedMissions.length > 0 && (
        <PokemonWindow title="RECENT MISSIONS">
          {relatedMissions.slice(0, 5).map((m: any, i: number) => (
            <Link key={i} href={`/missions/${m.id || m._id}`}>
              <div className="flex items-center justify-between py-2 border-b border-[#d0d0d0] last:border-0">
                <span className="text-[8px]">{m.title || m.name}</span>
                <StatusBadge status={m.status || 'pending'} />
              </div>
            </Link>
          ))}
        </PokemonWindow>
      )}
    </div>
  );
}
