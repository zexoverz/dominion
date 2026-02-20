import { getMissions } from '@/lib/api';
import QuestCard from '@/components/QuestCard';
import SwordDivider from '@/components/SwordDivider';
import RPGPanel from '@/components/RPGPanel';

export const dynamic = 'force-dynamic';

export default async function QuestsPage() {
  const missions = await getMissions().catch(() => []);
  const active = missions.filter((m: any) => m.status === 'active' || m.status === 'running');
  const completed = missions.filter((m: any) => m.status === 'completed' || m.status === 'done');

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="font-pixel text-gold text-sm sm:text-lg">📜 QUEST BOARD 📜</h1>
        <p className="text-brown-dark text-sm mt-2">{active.length} active · {completed.length} completed</p>
      </div>

      <SwordDivider label="ACTIVE QUESTS" />

      {active.length === 0 ? (
        <RPGPanel>
          <p className="text-brown-dark text-sm italic text-center py-4">No active quests. The realm awaits your command.</p>
        </RPGPanel>
      ) : (
        <div className="space-y-3">
          {active.map((m: any) => <QuestCard key={m.id} mission={m} />)}
        </div>
      )}

      {completed.length > 0 && (
        <>
          <SwordDivider label="COMPLETED" />
          <div className="space-y-3">
            {completed.map((m: any) => <QuestCard key={m.id} mission={m} />)}
          </div>
        </>
      )}
    </div>
  );
}
