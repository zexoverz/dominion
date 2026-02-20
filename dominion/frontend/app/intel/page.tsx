import { getReports } from '@/lib/api';
import PokemonWindow from '@/components/PokemonWindow';
import PokedexEntry from '@/components/PokedexEntry';

export default async function IntelPage() {
  let reports: any[] = [];
  try { reports = await getReports(); } catch {}

  return (
    <div className="space-y-4 bg-intel min-h-screen">
      <PokemonWindow title="POKEDEX — INTEL REPORTS">
        {reports.length === 0 && <div className="text-[9px] text-[#909090]">No reports found...</div>}
        {reports.map((r: any, i: number) => (
          <PokedexEntry key={r.slug || r.id || r._id || i} report={r} index={i} />
        ))}
      </PokemonWindow>
    </div>
  );
}
