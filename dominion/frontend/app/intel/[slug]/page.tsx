import { getReport } from '@/lib/api';
import RPGPanel from '@/components/RPGPanel';
import GeneralBadge from '@/components/GeneralBadge';
import SwordDivider from '@/components/SwordDivider';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function ReportPage({ params }: { params: { slug: string } }) {
  const report = await getReport(params.slug);
  const date = report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '';

  return (
    <div className="space-y-5">
      <Link href="/intel" className="nes-btn is-primary" style={{ fontSize: '8px', padding: '4px 12px' }}>
        ← Library
      </Link>

      <RPGPanel>
        <h1 className="font-pixel text-gold text-xs sm:text-sm mb-3">{report.title}</h1>
        <div className="flex items-center gap-3 text-sm text-brown-dark flex-wrap">
          {report.general && <GeneralBadge name={report.general} />}
          {date && <span className="text-xs">📅 {date}</span>}
          {report.category && (
            <span className="nes-badge">
              <span className="is-primary" style={{ fontSize: '7px' }}>{report.category}</span>
            </span>
          )}
        </div>
      </RPGPanel>

      <SwordDivider label="REPORT CONTENT" />

      <RPGPanel>
        <div className="markdown-body" style={{ fontSize: '15px', lineHeight: '1.7' }}>
          <ReactMarkdown>{report.content || report.body || 'No content available.'}</ReactMarkdown>
        </div>
      </RPGPanel>
    </div>
  );
}
