import { getMissions } from '@/lib/api';
import MissionCard from '@/components/MissionCard';
import HoloPanel from '@/components/HoloPanel';

export default async function MissionsPage() {
  let missions: any[] = [];
  try { missions = await getMissions(); } catch {}

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-lg mb-6" style={{ color: '#00f0ff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Mission Control
      </h1>

      <HoloPanel>
        {missions.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: 'rgba(226,232,240,0.4)' }}>
            NO MISSIONS IN QUEUE
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {missions.map((m: any) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>
        )}
      </HoloPanel>
    </div>
  );
}
