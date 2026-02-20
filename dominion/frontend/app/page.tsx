import { getMissions, getReports, getGenerals, getEvents } from '@/lib/api';
import PokemonWindow from '@/components/PokemonWindow';
import TextBox from '@/components/TextBox';

export default async function Dashboard() {
  let missions: any[] = [], reports: any[] = [], generals: any[] = [], events: any[] = [];
  try { missions = await getMissions(); } catch {}
  try { reports = await getReports(); } catch {}
  try { generals = await getGenerals(); } catch {}
  try { events = await getEvents(); } catch {}

  const active = missions.filter((m: any) => m.status === 'active' || m.status === 'in_progress').length;

  return (
    <div className="space-y-4">
      {/* Trainer Card */}
      <PokemonWindow title="TRAINER CARD">
        <div className="text-[12px] font-bold mb-3">LORD ZEXO</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <img src="/assets/pokemon/pokeball.png" alt="" width={16} height={16} className="pixel" />
            <span className="text-[9px]">Active Missions: {active}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/pokemon/rare-candy.png" alt="" width={16} height={16} className="pixel" />
            <span className="text-[9px]">Reports: {reports.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/pokemon/masterball.png" alt="" width={16} height={16} className="pixel" />
            <span className="text-[9px]">Generals: {generals.length}/7</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#48d048]" />
            <span className="text-[9px]">System: ONLINE</span>
          </div>
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

      {/* Quick Stats */}
      <PokemonWindow cream title="MISSION SUMMARY">
        <div className="text-[8px] space-y-1">
          <div>Total Missions: {missions.length}</div>
          <div>Active: {active}</div>
          <div>Completed: {missions.filter((m: any) => m.status === 'complete' || m.status === 'completed').length}</div>
        </div>
      </PokemonWindow>
    </div>
  );
}
