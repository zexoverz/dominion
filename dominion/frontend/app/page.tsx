import { getMissions, getReports, getGenerals, getEvents } from '@/lib/api';
import { GENERALS } from '@/lib/generals';
import PokemonWindow from '@/components/PokemonWindow';
import TextBox from '@/components/TextBox';
import HPBar from '@/components/HPBar';
import TypeBadges from '@/components/TypeBadges';

export default async function Dashboard() {
  let missions: any[] = [], reports: any[] = [], generals: any[] = [], events: any[] = [];
  try { missions = await getMissions(); } catch {}
  try { reports = await getReports(); } catch {}
  try { generals = await getGenerals(); } catch {}
  try { events = await getEvents(); } catch {}

  const active = missions.filter((m: any) => m.status === 'active' || m.status === 'in_progress').length;
  const completed = missions.filter((m: any) => m.status === 'complete' || m.status === 'completed').length;

  return (
    <div className="space-y-4 bg-dashboard min-h-screen">
      {/* Trainer Card */}
      <PokemonWindow title="TRAINER CARD">
        <div className="text-[12px] font-bold mb-3">LORD ZEXO</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <img src="/assets/pokemon/pokeball.png" alt="" width={20} height={20} className="pixel" style={{ imageRendering: 'pixelated' }} />
            <span className="text-[9px]">Active: {active}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/pokemon/rare-candy.png" alt="" width={20} height={20} className="pixel" style={{ imageRendering: 'pixelated' }} />
            <span className="text-[9px]">Reports: {reports.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/pokemon/masterball.png" alt="" width={20} height={20} className="pixel" style={{ imageRendering: 'pixelated' }} />
            <span className="text-[9px]">Generals: {generals.length}/7</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/pokemon/fire-stone.png" alt="" width={20} height={20} className="pixel" style={{ imageRendering: 'pixelated' }} />
            <span className="text-[9px]">System: ONLINE</span>
          </div>
        </div>
      </PokemonWindow>

      {/* Gym Badges */}
      <PokemonWindow cream title="GYM BADGES">
        <div className="flex justify-center mb-2">
          <img src="/assets/pokemon/badges.png" alt="Badges" className="pixel" style={{ height: 40, imageRendering: 'pixelated' }} />
        </div>
        <div className="text-[8px] text-center text-[#707070]">
          {completed} / {missions.length} missions completed
        </div>
      </PokemonWindow>

      {/* Party — All 7 Generals */}
      <PokemonWindow title="PARTY">
        <div className="space-y-2">
          {Object.values(GENERALS).map((g) => {
            const totalStats = g.stats.hp + g.stats.atk + g.stats.def + g.stats.spa + g.stats.spd2 + g.stats.spd;
            return (
              <div key={g.name} className="party-slot">
                <img src={g.sprite} alt={g.pokemon} width={40} height={40} className="pixel" style={{ imageRendering: 'pixelated' }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-bold">{g.name}</span>
                    <TypeBadges types={g.types} />
                  </div>
                  <HPBar value={g.stats.hp} max={160} />
                  <div className="text-[7px] text-[#707070] mt-1">Lv.50 · {g.pokemon} · BST {totalStats}</div>
                </div>
              </div>
            );
          })}
        </div>
      </PokemonWindow>

      {/* Kanto Region Map */}
      <PokemonWindow title="DOMINION MAP">
        <div className="flex justify-center">
          <img src="/assets/pokemon/region-map.png" alt="Kanto Region" className="pixel" style={{ width: '100%', maxWidth: 480, imageRendering: 'pixelated' }} />
        </div>
        <div className="text-[8px] text-center text-[#707070] mt-2">
          Current location: DOMINION HQ — Pallet Town
        </div>
      </PokemonWindow>

      {/* Recent Activity */}
      <PokemonWindow title="RECENT ACTIVITY">
        <TextBox>
          {events.length === 0 && <div className="text-[9px] text-[#909090]">No recent activity...</div>}
          {events.slice(0, 8).map((e: any, i: number) => (
            <div key={i} className="text-[8px] mb-2">
              {e.general || e.source || 'SYSTEM'} used {e.type || e.action || 'ACTION'}!
              {e.description && <span className="text-[#707070]"> {e.description}</span>}
            </div>
          ))}
        </TextBox>
      </PokemonWindow>
    </div>
  );
}
