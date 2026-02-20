import { getMissions, getReports, getDailyCosts } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import QuestCard from '@/components/QuestCard';
import ReportCard from '@/components/ReportCard';
import BtcTicker from '@/components/BtcTicker';
import SwordDivider from '@/components/SwordDivider';
import ErrorState from '@/components/ErrorState';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let missions: any[] = [];
  let reports: any[] = [];
  let costs: any[] = [];
  let error = false;

  try {
    [missions, reports, costs] = await Promise.all([
      getMissions().catch(() => []),
      getReports().catch(() => []),
      getDailyCosts().catch(() => []),
    ]);
  } catch {
    error = true;
  }

  if (error) return <ErrorState message="Failed to load dashboard data." />;

  const active = missions.filter((m: any) => m.status === 'active' || m.status === 'running').slice(0, 3);
  const completed = missions.filter((m: any) => m.status === 'completed' || m.status === 'done').length;
  const recentReports = reports.slice(0, 3);
  const todayCost = costs.length > 0 ? costs[0] : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="nes-container is-dark" style={{ textAlign: 'center', padding: '16px', background: '#2a1a0a' }}>
        <div className="font-pixel" style={{ color: '#c8a832', fontSize: '14px', letterSpacing: '2px' }}>
          👑 THE DOMINION 👑
        </div>
        <div className="text-xs mt-2" style={{ color: '#8b7a5a' }}>Command Center of Lord Zexo</div>
        <div className="mt-2"><BtcTicker /></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <RPGPanel>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>⚔ {active.length}</div>
            <div className="font-pixel mt-1" style={{ fontSize: '7px', color: '#5a3e1b' }}>Active</div>
          </div>
        </RPGPanel>
        <RPGPanel>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#3465a4' }}>🏆 {completed}</div>
            <div className="font-pixel mt-1" style={{ fontSize: '7px', color: '#5a3e1b' }}>Complete</div>
          </div>
        </RPGPanel>
        <RPGPanel>
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">💰 {todayCost?.total_cost ? `$${Number(todayCost.total_cost).toFixed(0)}` : '$0'}</div>
            <div className="font-pixel mt-1" style={{ fontSize: '7px', color: '#5a3e1b' }}>Treasury</div>
          </div>
        </RPGPanel>
      </div>

      <SwordDivider label="ACTIVE QUESTS" />

      {/* Active Quests */}
      {active.length === 0 ? (
        <RPGPanel>
          <p className="text-brown-dark text-sm italic text-center py-4">No active quests. The realm is at peace... for now. ⚔</p>
        </RPGPanel>
      ) : (
        <div className="space-y-3">
          {active.map((m: any) => <QuestCard key={m.id} mission={m} />)}
        </div>
      )}

      <SwordDivider label="RECENT INTEL" />

      {/* Recent Intel */}
      {recentReports.length === 0 ? (
        <RPGPanel>
          <p className="text-brown-dark text-sm italic text-center py-4">No intelligence gathered yet. 📜</p>
        </RPGPanel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recentReports.map((r: any) => <ReportCard key={r.id || r.slug} report={r} />)}
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <span className="font-pixel" style={{ fontSize: '7px', color: '#8b6914' }}>⚔ Lord Zexo&apos;s Command Center ⚔</span>
      </div>
    </div>
  );
}
