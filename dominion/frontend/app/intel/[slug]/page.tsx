import { getReport } from '@/lib/api';
import HoloPanel from '@/components/HoloPanel';
import { getGeneralColor, getGeneralIcon } from '@/lib/generals';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default async function ReportPage({ params }: { params: { slug: string } }) {
  let report: any = null;
  try { report = await getReport(params.slug); } catch {}

  if (!report) {
    return (
      <div className="p-8 text-center">
        <h1 className="label">REPORT NOT FOUND</h1>
        <Link href="/intel" className="text-xs" style={{ color: '#00f0ff' }}>← Back to Intel</Link>
      </div>
    );
  }

  const color = getGeneralColor(report.general || report.author || '');

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link href="/intel" className="label mb-4 inline-block" style={{ color: '#00f0ff' }}>
        ← INTELLIGENCE HUB
      </Link>

      <HoloPanel glow>
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color }}>{getGeneralIcon(report.general || report.author || '')}</span>
          <span className="label">{report.general || report.author || 'UNKNOWN'}</span>
          {report.created_at && (
            <span className="ml-auto text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>
              {new Date(report.created_at).toLocaleDateString()}
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {report.title}
        </h1>

        <div className="prose prose-invert prose-sm max-w-none" style={{ color: 'rgba(226,232,240,0.8)' }}>
          <ReactMarkdown>{report.content || report.body || ''}</ReactMarkdown>
        </div>
      </HoloPanel>
    </div>
  );
}
