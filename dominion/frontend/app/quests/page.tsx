import { getMissions } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import QuestCard from '@/components/QuestCard';

export const dynamic = 'force-dynamic';

export default async function QuestsPage() {
  const missions = await getMissions().catch(() => []);
  const active = missions.filter((m: any) => m.status === 'active' || m.status === 'running');
  const completed = missions.filter((m: any) => m.status === 'completed' || m.status === 'done');

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-gold text-sm sm:text-lg">📜 Quest Board</h1>

      <RPGPanel title={`Active Quests (${active.length})`}>
        {active.length === 0 ? (
          <p className="text-brown-dark text-sm italic">No active quests.</p>
        ) : (
          <div className="space-y-3">
            {active.map((m: any) => <QuestCard key={m.id} mission={m} />)}
          </div>
        )}
      </RPGPanel>

      <RPGPanel title={`Completed (${completed.length})`}>
        {completed.length === 0 ? (
          <p className="text-brown-dark text-sm italic">No completed quests yet.</p>
        ) : (
          <div className="space-y-3">
            {completed.map((m: any) => <QuestCard key={m.id} mission={m} />)}
          </div>
        )}
      </RPGPanel>
    </div>
  );
}
