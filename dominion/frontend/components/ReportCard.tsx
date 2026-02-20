import Link from 'next/link';
import { getGeneralColor, getGeneralIcon } from '@/lib/generals';

export default function ReportCard({ report }: { report: any }) {
  const color = getGeneralColor(report.general || report.author || '');
  const slug = report.slug || report.id;
  const title = report.title || 'Untitled Report';
  const preview = report.summary || report.content?.slice(0, 150) || '';
  const date = report.created_at ? new Date(report.created_at).toLocaleDateString() : '';

  return (
    <Link href={`/intel/${slug}`} className="block no-underline">
      <div
        className="holo-panel scanlines p-4 transition-all duration-300 hover:scale-[1.01]"
        style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${color}30`;
          (e.currentTarget as HTMLElement).style.borderColor = color;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '';
          (e.currentTarget as HTMLElement).style.borderColor = '';
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color }}>{getGeneralIcon(report.general || report.author || '')}</span>
          <span className="label">{report.general || report.author || 'UNKNOWN'}</span>
          {date && <span className="ml-auto text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>{date}</span>}
        </div>
        <h3 className="text-sm font-bold mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0' }}>
          {title}
        </h3>
        {preview && (
          <p className="text-xs" style={{ color: 'rgba(226,232,240,0.5)', lineHeight: 1.5 }}>
            {preview.slice(0, 150)}{preview.length > 150 ? '…' : ''}
          </p>
        )}
      </div>
    </Link>
  );
}
