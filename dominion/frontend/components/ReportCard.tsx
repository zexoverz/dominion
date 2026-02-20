import Link from 'next/link';
import GeneralBadge from './GeneralBadge';

export default function ReportCard({ report }: { report: any }) {
  const date = report.created_at ? new Date(report.created_at).toLocaleDateString() : '';
  return (
    <Link href={`/intel/${report.slug || report.id}`} className="block">
      <div className="nes-container" style={{ cursor: 'pointer' }}>
        <h3 className="font-bold text-brown-dark mb-1 line-clamp-2">{report.title}</h3>
        <div className="flex items-center justify-between gap-2 text-xs text-brown-dark">
          {report.general && <GeneralBadge name={report.general} />}
          <span>{date}</span>
        </div>
        {report.category && (
          <span className="nes-badge is-primary" style={{ marginTop: '8px' }}>
            <span className="is-primary" style={{ fontSize: '8px' }}>{report.category}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
