import { getReport } from '@/lib/api';
import Link from 'next/link';
import PokemonWindow from '@/components/PokemonWindow';
import ReactMarkdown from 'react-markdown';

export default async function ReportDetail({ params }: { params: { slug: string } }) {
  let report: any = null;
  try { report = await getReport(params.slug); } catch {}

  if (!report) {
    return (
      <PokemonWindow>
        <Link href="/intel" className="text-[9px] text-[#3890f8]">← BACK</Link>
        <div className="text-[9px] mt-4">Report not found.</div>
      </PokemonWindow>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/intel" className="text-[9px] text-[#3890f8]">← BACK</Link>
      <PokemonWindow>
        <div className="text-[11px] font-bold mb-2">{report.title || report.name}</div>
        <div className="text-[7px] text-[#909090] mb-3">
          {report.general || report.author || 'Unknown'} · {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ''}
        </div>
        <div className="text-[8px] leading-relaxed prose-sm">
          <ReactMarkdown>{report.content || report.body || report.markdown || ''}</ReactMarkdown>
        </div>
      </PokemonWindow>
    </div>
  );
}
