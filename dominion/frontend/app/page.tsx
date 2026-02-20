import { getMissions, getReports, getGenerals, getDailyCosts, getEvents } from '@/lib/api';
import StatCard from '@/components/StatCard';
import ActivityFeed from '@/components/ActivityFeed';
import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });

export default async function DashboardPage() {
  let missions: any[] = [], reports: any[] = [], generals: any[] = [], costs: any[] = [], events: any[] = [];
  try { [missions, reports, generals, costs, events] = await Promise.all([getMissions(), getReports(), getGenerals(), getDailyCosts(), getEvents()]); } catch {}

  const activeMissions = Array.isArray(missions) ? missions.filter((m: any) => m.status === 'active').length : 0;
  const onlineGenerals = Array.isArray(generals) ? generals.filter((g: any) => g.status === 'active' || g.status === 'online').length : 0;
  const todayCost = Array.isArray(costs) && costs.length > 0 ? `$${(costs[costs.length - 1]?.total_cost || 0).toFixed(2)}` : '$0.00';

  return (
    <>
      <ThreeBackground />
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-white/30">AI operations overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Missions" value={activeMissions} icon="🎯" />
          <StatCard label="Intel Reports" value={Array.isArray(reports) ? reports.length : 0} icon="📄" />
          <StatCard label="Generals Online" value={onlineGenerals} icon="⚡" />
          <StatCard label="Daily Cost" value={todayCost} icon="💰" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Recent Activity</h2>
            <ActivityFeed events={Array.isArray(events) ? events : []} />
          </div>
          <div className="glass rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <a href="/missions" className="glass glass-hover rounded-lg p-4 text-center transition-all hover:scale-[1.02]">
                <span className="text-2xl block mb-2">🎯</span>
                <span className="text-xs text-white/50">New Mission</span>
              </a>
              <a href="/intel" className="glass glass-hover rounded-lg p-4 text-center transition-all hover:scale-[1.02]">
                <span className="text-2xl block mb-2">📄</span>
                <span className="text-xs text-white/50">View Intel</span>
              </a>
              <a href="/command" className="glass glass-hover rounded-lg p-4 text-center transition-all hover:scale-[1.02]">
                <span className="text-2xl block mb-2">📋</span>
                <span className="text-xs text-white/50">Proposals</span>
              </a>
              <a href="/generals" className="glass glass-hover rounded-lg p-4 text-center transition-all hover:scale-[1.02]">
                <span className="text-2xl block mb-2">⚡</span>
                <span className="text-xs text-white/50">Generals</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
