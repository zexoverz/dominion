import { getReport } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import GeneralBadge from '@/components/GeneralBadge';
import SwordDivider from '@/components/SwordDivider';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function ReportPage({ params }: { params: { slug: string } }) {
  const report = await getReport(params.slug);
  const date = report.created_at ? new Date(report.created_at).toLocaleDateString() : '';

  return (
    <div className="space-y-4">
      <Link href="/intel" className="nes-text is-primary" style={{ fontSize: '10px', fontFamily: '"Press Start 2P", monospace' }}>
        ← Back to Library
      </Link>

      <RPGPanel>
        <h1 className="font-pixel text-gold text-xs sm:text-sm mb-2">{report.title}</h1>
        <div className="flex items-center gap-3 text-sm text-brown-dark mb-4">
          {report.general && <GeneralBadge name={report.general} />}
          {date && <span>{date}</span>}
          {report.category && (
            <span className="nes-badge is-primary">
              <span className="is-primary" style={{ fontSize: '8px' }}>{report.category}</span>
            </span>
          )}
        </div>
      </RPGPanel>

      <SwordDivider label="REPORT" />

      <RPGPanel>
        <div className="markdown-body">
          <ReactMarkdown>{report.content || report.body || 'No content available.'}</ReactMarkdown>
        </div>
      </RPGPanel>
    </div>
  );
}
