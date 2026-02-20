import { getReports } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import ReportCard from '@/components/ReportCard';

export const dynamic = 'force-dynamic';

export default async function IntelPage() {
  const reports = await getReports().catch(() => []);

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-gold text-sm sm:text-lg">
        <i className="nes-icon coin is-small"></i> Library
      </h1>

      <RPGPanel title={`Intel Reports (${reports.length})`}>
        {reports.length === 0 ? (
          <p className="text-brown-dark text-sm italic">No intelligence gathered yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reports.map((r: any) => <ReportCard key={r.id || r.slug} report={r} />)}
          </div>
        )}
      </RPGPanel>
    </div>
  );
}
