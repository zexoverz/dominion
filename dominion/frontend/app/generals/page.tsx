import { getGenerals } from '@/lib/api';
import { GENERALS } from '@/lib/generals';
import Link from 'next/link';
import PokemonWindow from '@/components/PokemonWindow';
import StatBar from '@/components/StatBar';
import TypeBadges from '@/components/TypeBadges';

export default async function GeneralsPage() {
  let apiGenerals: any[] = [];
  try { apiGenerals = await getGenerals(); } catch {}

  const allGenerals = Object.values(GENERALS).map(g => {
    const api = apiGenerals.find((a: any) => (a.name || '').toUpperCase() === g.name);
    return { ...g, ...api, pokemonData: g };
  });

  return (
    <div className="space-y-4 bg-terrain-building min-h-screen">
      <PokemonWindow title="BILL&apos;S PC — GENERALS">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allGenerals.map((g) => (
            <Link key={g.name} href={`/generals/${(g.id || g._id || g.name).toString().toLowerCase()}`}>
              <div className="pkmn-window-cream cursor-pointer hover:brightness-95 transition">
                <div className="flex items-start gap-3">
                  {/* Overworld trainer sprite */}
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={g.pokemonData.trainer}
                      alt=""
                      className="pixel"
                      style={{ imageRendering: 'pixelated', width: 32, height: 32, objectFit: 'none', objectPosition: '0 0' }}
                    />
                    <img
                      src={g.pokemonData.sprite}
                      alt={g.pokemonData.pokemon}
                      className="pixel"
                      style={{ imageRendering: 'pixelated', width: 56, height: 56 }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold">{g.name}</div>
                    <div className="text-[7px] text-[#707070]">{g.pokemonData.role}</div>
                    <div className="text-[7px] text-[#909090] mb-1">{g.pokemonData.pokemon}</div>
                    <TypeBadges types={g.pokemonData.types} />
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
