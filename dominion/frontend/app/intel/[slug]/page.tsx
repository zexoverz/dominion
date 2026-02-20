import { getReport } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default async function ReportDetailPage({ params }: { params: { slug: string } }) {
  let report: any = null;
  try { report = await getReport(params.slug); } catch {}

  if (!report) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <p className="text-white/40">Report not found</p>
        <Link href="/intel" className="text-blue-400 text-sm mt-4 inline-block">← Back to Intel</Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <Link href="/intel" className="text-white/30 hover:text-white/50 text-sm transition-colors">← Back to Intel</Link>
      <div className="glass rounded-xl p-6 md:p-8">
        <div className="mb-6">
          <span className="text-xs text-white/30 uppercase tracking-wider">{report.general || report.author || 'Intelligence'}</span>
          <h1 className="text-2xl font-bold text-white mt-1">{report.title}</h1>
          {report.created_at && <p className="text-xs text-white/20 mt-2">{new Date(report.created_at).toLocaleString()}</p>}
        </div>
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white/90 prose-p:text-white/60 prose-a:text-blue-400 prose-strong:text-white/80 prose-code:text-purple-400 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/5">
          <ReactMarkdown>{report.content || report.body || report.summary || ''}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
