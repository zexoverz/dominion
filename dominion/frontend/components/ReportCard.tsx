import Link from 'next/link';
import GeneralBadge from './GeneralBadge';

export default function ReportCard({ report }: { report: any }) {
  const date = report.created_at ? new Date(report.created_at).toLocaleDateString() : '';
  return (
    <Link href={`/intel/${report.slug || report.id}`} className="block rpg-panel hover:border-gold transition-colors">
      <h3 className="font-bold text-brown-dark mb-1 line-clamp-2">{report.title}</h3>
      <div className="flex items-center justify-between gap-2 text-xs text-brown-dark">
        {report.general && <GeneralBadge name={report.general} />}
        <span>{date}</span>
      </div>
      {report.category && (
        <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-parchment-dark border border-brown-border">
          {report.category}
        </span>
      )}
    </Link>
  );
}
