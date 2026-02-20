import { getGeneral, getMissions } from '@/lib/api';
import { getGeneralInfo, GENERALS } from '@/lib/generals';
import Link from 'next/link';
import PokemonWindow from '@/components/PokemonWindow';
import GeneralSprite from '@/components/GeneralSprite';
import StatBar from '@/components/StatBar';
import StatusBadge from '@/components/StatusBadge';

export default async function GeneralDetail({ params }: { params: { id: string } }) {
  let general: any = null;
  let missions: any[] = [];
  try { general = await getGeneral(params.id); } catch {}
  try { missions = await getMissions(); } catch {}

  // Try to find pokemon info from name or id
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
    (m.assignedTo || m.general || '').toUpperCase() === displayName.toUpperCase()
  );

  return (
    <div className="space-y-4">
      <Link href="/generals" className="text-[9px] text-[#3890f8]">← BACK</Link>

      <PokemonWindow>
        <div className="flex items-start gap-4">
          <GeneralSprite name={displayName} size={128} />
          <div>
            <div className="text-[12px] font-bold mb-1">{displayName}</div>
            {info && (
              <>
                <div className="text-[8px] text-[#707070] mb-1">{info.pokemon} — {info.role}</div>
                <div className="text-[8px]" style={{ color: info.color }}>TYPE: {info.type}</div>
              </>
            )}
            {general?.status && <div className="mt-2"><StatusBadge status={general.status} /></div>}
          </div>
        </div>
      </PokemonWindow>

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
        </PokemonWindow>
      )}

      {general?.description && (
        <PokemonWindow title="INFO">
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
