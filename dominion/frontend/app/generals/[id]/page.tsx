import { getGeneral, getMissions, getReports } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import QuestCard from '@/components/QuestCard';
import ReportCard from '@/components/ReportCard';
import { getGeneralConfig } from '@/lib/generals-config';
import PixelAvatar from '@/components/PixelAvatar';
import SwordDivider from '@/components/SwordDivider';
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
      <Link href="/generals" className="nes-text is-primary" style={{ fontSize: '10px', fontFamily: '"Press Start 2P", monospace' }}>
        ← Back to Barracks
      </Link>

      <RPGPanel>
        <div className="flex items-center gap-4">
          <PixelAvatar generalId={cfg.id} size="lg" />
          <div>
            <h1 className="font-pixel text-sm" style={{ color: cfg.color }}>{cfg.name}</h1>
            <div className="text-brown-dark">{cfg.role}</div>
            {general?.status && (
              <span className="nes-text is-success" style={{ fontSize: '10px' }}>{general.status}</span>
            )}
          </div>
        </div>
        {general?.description && <p className="text-brown-dark mt-3">{general.description}</p>}
      </RPGPanel>

      {myMissions.length > 0 && (
        <>
          <SwordDivider label="QUESTS" />
          <RPGPanel title="Recent Quests">
            <div className="space-y-3">
              {myMissions.map((m: any) => <QuestCard key={m.id} mission={m} />)}
            </div>
          </RPGPanel>
        </>
      )}

      {myReports.length > 0 && (
        <>
          <SwordDivider label="INTEL" />
          <RPGPanel title="Intel Reports">
            <div className="space-y-3">
              {myReports.map((r: any) => <ReportCard key={r.id || r.slug} report={r} />)}
            </div>
          </RPGPanel>
        </>
      )}
    </div>
  );
}
