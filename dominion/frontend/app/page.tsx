import { getMissions, getReports, getDailyCosts } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import QuestCard from '@/components/QuestCard';
import ReportCard from '@/components/ReportCard';
import BtcTicker from '@/components/BtcTicker';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [missions, reports, costs] = await Promise.all([
    getMissions().catch(() => []),
    getReports().catch(() => []),
    getDailyCosts().catch(() => []),
  ]);

  const active = missions.filter((m: any) => m.status === 'active' || m.status === 'running').slice(0, 3);
  const completed = missions.filter((m: any) => m.status === 'completed' || m.status === 'done').length;
  const recentReports = reports.slice(0, 3);
  const todayCost = costs.length > 0 ? costs[0] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-gold text-sm sm:text-lg">🏠 Town Square</h1>
        <BtcTicker />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <RPGPanel className="text-center">
          <div className="text-2xl font-bold text-forest">{active.length}</div>
          <div className="text-xs text-brown-dark">Active</div>
        </RPGPanel>
        <RPGPanel className="text-center">
          <div className="text-2xl font-bold text-royal">{completed}</div>
          <div className="text-xs text-brown-dark">Completed</div>
        </RPGPanel>
        <RPGPanel className="text-center">
          <div className="text-2xl font-bold text-gold">{todayCost?.total_cost ? `$${Number(todayCost.total_cost).toFixed(2)}` : '$0'}</div>
          <div className="text-xs text-brown-dark">Today&apos;s Cost</div>
        </RPGPanel>
      </div>

      {/* Active Quests */}
      <RPGPanel title="Active Quests">
        {active.length === 0 ? (
          <p className="text-brown-dark text-sm italic">No active quests. The realm is quiet...</p>
        ) : (
          <div className="space-y-3">
            {active.map((m: any) => <QuestCard key={m.id} mission={m} />)}
          </div>
        )}
      </RPGPanel>

      {/* Recent Intel */}
      <RPGPanel title="Recent Intel">
        {recentReports.length === 0 ? (
          <p className="text-brown-dark text-sm italic">No intel reports yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentReports.map((r: any) => <ReportCard key={r.id || r.slug} report={r} />)}
          </div>
        )}
      </RPGPanel>
    </div>
  );
}
