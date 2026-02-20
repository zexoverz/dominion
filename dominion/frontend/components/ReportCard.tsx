import Link from 'next/link';
import PixelAvatar from './PixelAvatar';
import { getGeneralConfig } from '@/lib/generals-config';

export default function ReportCard({ report }: { report: any }) {
  const date = report.created_at ? new Date(report.created_at).toLocaleDateString() : '';
  const cfg = report.general ? getGeneralConfig(report.general) : null;

  return (
    <Link href={`/intel/${report.slug || report.id}`} className="block">
      <div className="nes-container" style={{ cursor: 'pointer', transition: 'transform 0.1s ease' }}>
        <div className="flex items-start gap-3">
          {cfg && (
            <div className="flex-shrink-0">
              <PixelAvatar generalId={cfg.id} size="sm" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-brown-dark text-sm mb-1 line-clamp-2">{report.title}</h3>
            <div className="flex items-center gap-2 text-xs text-brown-dark flex-wrap">
              {cfg && <span style={{ color: cfg.color, fontWeight: 'bold' }}>{cfg.name}</span>}
              {date && <span>📅 {date}</span>}
            </div>
            {report.category && (
              <div className="mt-2">
                <span className="nes-badge">
                  <span className="is-primary" style={{ fontSize: '7px' }}>{report.category}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
