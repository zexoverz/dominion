import { getReports } from '@/lib/api';
import ReportCard from '@/components/ReportCard';

export default async function IntelPage() {
  let reports: any[] = [];
  try { reports = await getReports(); } catch {}

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-lg mb-6" style={{ color: '#00f0ff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Intelligence Hub
      </h1>

      {reports.length === 0 ? (
        <div className="text-center py-8 text-sm" style={{ color: 'rgba(226,232,240,0.4)' }}>
          NO INTELLIGENCE REPORTS
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r: any) => (
            <ReportCard key={r.id || r.slug} report={r} />
          ))}
        </div>
      )}
    </div>
  );
}
