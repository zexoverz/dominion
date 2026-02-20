import { getMissions } from '@/lib/api';
import MissionCard from '@/components/MissionCard';

export default async function MissionsPage() {
  let missions: any[] = [];
  try { missions = await getMissions(); } catch {}
  if (!Array.isArray(missions)) missions = [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Missions</h1>
        <p className="text-sm text-white/30">Track active operations and objectives</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {missions.length === 0 ? (
          <p className="text-white/30 col-span-2">No missions found</p>
        ) : (
          missions.map((m: any) => <MissionCard key={m.id} mission={m} />)
        )}
      </div>
    </div>
  );
}
