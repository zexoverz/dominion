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
    <div className="space-y-5">
      <Link href="/generals" className="nes-btn is-primary" style={{ fontSize: '8px', padding: '4px 12px' }}>
        ← Barracks
      </Link>

      {/* Character card */}
      <RPGPanel>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <PixelAvatar generalId={cfg.id} size="xl" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-pixel text-lg mb-1" style={{ color: cfg.color }}>{cfg.name}</h1>
            <div className="text-brown-dark text-sm mb-2">{cfg.role}</div>
            {general?.status && (
              <span className="nes-badge">
                <span className={general.status === 'active' ? 'is-success' : 'is-dark'} style={{ fontSize: '8px' }}>
                  {general.status.toUpperCase()}
                </span>
              </span>
            )}
            {general?.description && <p className="text-brown-dark mt-3 text-sm">{general.description}</p>}
          </div>
        </div>
      </RPGPanel>

      {myMissions.length > 0 && (
        <>
          <SwordDivider label="QUESTS" />
          <div className="space-y-3">
            {myMissions.map((m: any) => <QuestCard key={m.id} mission={m} />)}
          </div>
        </>
      )}

      {myReports.length > 0 && (
        <>
          <SwordDivider label="INTEL REPORTS" />
          <div className="space-y-3">
            {myReports.map((r: any) => <ReportCard key={r.id || r.slug} report={r} />)}
          </div>
        </>
      )}

      {myMissions.length === 0 && myReports.length === 0 && (
        <RPGPanel>
          <p className="text-brown-dark text-sm italic text-center py-4">This general has no recorded activity yet.</p>
        </RPGPanel>
      )}
    </div>
  );
}
