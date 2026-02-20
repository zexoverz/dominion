import { getReports } from '@/lib/api';
import ReportCard from '@/components/ReportCard';
import RPGPanel from '@/components/RPGPanel';
import SwordDivider from '@/components/SwordDivider';

export const dynamic = 'force-dynamic';

export default async function IntelPage() {
  const reports = await getReports().catch(() => []);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="font-pixel text-gold text-sm sm:text-lg">📚 INTELLIGENCE LIBRARY 📚</h1>
        <p className="text-brown-dark text-sm mt-2">{reports.length} reports gathered</p>
      </div>

      <SwordDivider label="ALL REPORTS" />

      {reports.length === 0 ? (
        <RPGPanel>
          <p className="text-brown-dark text-sm italic text-center py-4">No intelligence gathered yet. Send your generals on missions!</p>
        </RPGPanel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reports.map((r: any) => <ReportCard key={r.id || r.slug} report={r} />)}
        </div>
      )}
    </div>
  );
}
