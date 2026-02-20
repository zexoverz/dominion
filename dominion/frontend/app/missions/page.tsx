import { getMissions } from '@/lib/api';
import PokemonWindow from '@/components/PokemonWindow';
import MissionSlot from '@/components/MissionSlot';

export default async function MissionsPage() {
  let missions: any[] = [];
  try { missions = await getMissions(); } catch {}

  return (
    <div className="space-y-4 bg-party min-h-screen">
      <PokemonWindow title="POKEMON PARTY — MISSIONS">
        {missions.length === 0 && <div className="text-[9px] text-[#909090]">No missions found...</div>}
        {missions.map((m: any, i: number) => (
          <MissionSlot key={m.id || m._id || i} mission={m} />
        ))}
      </PokemonWindow>
    </div>
  );
}
