import { getGeneral, getMissions, getReports } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import QuestCard from '@/components/QuestCard';
import ReportCard from '@/components/ReportCard';
import { getGeneralConfig } from '@/lib/generals-config';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GeneralDetail({ params }: { params: { id: string } }) {
  const [general, missions, reports] = await Promise.all([
    getGeneral(params.id).catch(() => null),
    getMissions().catch(() => []),
    getReports().catch(() => []),
  ]);

  const name = general?.name || params.id;
  const cfg = getGeneralConfig(name);
  const myMissions = missions.filter((m: any) => (m.general || '').toLowerCase() === name.toLowerCase()).slice(0, 5);
  const myReports = reports.filter((r: any) => (r.general || '').toLowerCase() === name.toLowerCase()).slice(0, 5);

  return (
    <div className="space-y-4">
      <Link href="/generals" className="text-royal text-sm hover:underline">← Back to Barracks</Link>

      <RPGPanel>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{cfg.icon}</span>
          <div>
            <h1 className="font-pixel text-sm" style={{ color: cfg.color }}>{cfg.name}</h1>
            <div className="text-brown-dark">{cfg.role}</div>
            {general?.status && <div className="text-xs text-forest font-bold mt-1">{general.status}</div>}
          </div>
        </div>
        {general?.description && <p className="text-brown-dark mt-3">{general.description}</p>}
      </RPGPanel>

      {myMissions.length > 0 && (
        <RPGPanel title="Recent Quests">
          <div className="space-y-3">
            {myMissions.map((m: any) => <QuestCard key={m.id} mission={m} />)}
          </div>
        </RPGPanel>
      )}

      {myReports.length > 0 && (
        <RPGPanel title="Intel Reports">
          <div className="space-y-3">
            {myReports.map((r: any) => <ReportCard key={r.id || r.slug} report={r} />)}
          </div>
        </RPGPanel>
      )}
    </div>
  );
}
