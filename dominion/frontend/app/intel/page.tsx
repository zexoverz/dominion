import { getReports } from '@/lib/api';
import ReportCard from '@/components/ReportCard';

export default async function IntelPage() {
  let reports: any[] = [];
  try { reports = await getReports(); } catch {}
  if (!Array.isArray(reports)) reports = [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Intel</h1>
        <p className="text-sm text-white/30">Intelligence reports from the field</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.length === 0 ? (
          <p className="text-white/30">No reports available</p>
        ) : (
          reports.map((r: any) => <ReportCard key={r.slug || r.id} report={r} />)
        )}
      </div>
    </div>
  );
}
