import { getGenerals } from '@/lib/api';
import { getGeneralInfo, GENERALS } from '@/lib/generals';
import Link from 'next/link';
import PokemonWindow from '@/components/PokemonWindow';
import GeneralSprite from '@/components/GeneralSprite';
import StatBar from '@/components/StatBar';

export default async function GeneralsPage() {
  let apiGenerals: any[] = [];
  try { apiGenerals = await getGenerals(); } catch {}

  // Merge API data with local pokemon data
  const allGenerals = Object.values(GENERALS).map(g => {
    const api = apiGenerals.find((a: any) => (a.name || '').toUpperCase() === g.name);
    return { ...g, ...api, pokemonData: g };
  });

  return (
    <div className="space-y-4">
      <PokemonWindow title="BILL&apos;S PC — GENERALS">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allGenerals.map((g) => (
            <Link key={g.name} href={`/generals/${(g.id || g._id || g.name).toString().toLowerCase()}`}>
              <div className="pkmn-window-cream cursor-pointer hover:brightness-95 transition">
                <div className="flex items-start gap-3">
                  <GeneralSprite name={g.name} size={64} />
                  <div className="flex-1">
                    <div className="text-[10px] font-bold">{g.name}</div>
                    <div className="text-[7px] text-[#707070]">{g.pokemonData.role}</div>
                    <div className="text-[7px] mt-1" style={{ color: g.pokemonData.color }}>TYPE: {g.pokemonData.type}</div>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <StatBar label="ATK" value={g.pokemonData.stats.atk} />
                  <StatBar label="DEF" value={g.pokemonData.stats.def} />
                  <StatBar label="SPD" value={g.pokemonData.stats.spd} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PokemonWindow>
    </div>
  );
}
