import { getMissions, getReports, getEvents, getGenerals } from '@/lib/api';
import StatCard from '@/components/StatCard';
import HoloPanel from '@/components/HoloPanel';
import ActivityFeed from '@/components/ActivityFeed';
import MissionCard from '@/components/MissionCard';

export default async function DashboardPage() {
  let missions: any[] = [];
  let reports: any[] = [];
  let events: any[] = [];
  let generals: any[] = [];

  try { missions = await getMissions(); } catch {}
  try { reports = await getReports(); } catch {}
  try { events = await getEvents(); } catch {}
  try { generals = await getGenerals(); } catch {}

  const activeMissions = missions.filter((m: any) => m.status === 'active' || m.status === 'in_progress');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-lg mb-6" style={{ color: '#00f0ff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Command Overview
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Active Missions" value={activeMissions.length} icon="⚔" />
        <StatCard label="Total Reports" value={reports.length} icon="📡" />
        <StatCard label="Generals Online" value={generals.length} icon="👥" />
        <StatCard label="System Status" value="NOMINAL" icon="◈" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <HoloPanel>
          <h2 className="label mb-3">Recent Activity</h2>
          <ActivityFeed events={events} />
        </HoloPanel>

        <div className="space-y-3">
          <h2 className="label">Active Missions</h2>
          {activeMissions.length === 0 && (
            <div className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>No active missions</div>
          )}
          {activeMissions.slice(0, 5).map((m: any) => (
            <MissionCard key={m.id} mission={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
