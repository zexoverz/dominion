import Link from 'next/link';

export default function ReportCard({ report }: { report: any }) {
  const slug = report.slug || report.id;
  return (
    <Link href={`/intel/${slug}`}>
      <div className="glass glass-hover rounded-xl p-5 transition-all duration-300 animate-fade-in group cursor-pointer h-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">📄</span>
          <span className="text-xs text-white/30 uppercase tracking-wider">
            {report.general || report.author || 'Intelligence'}
          </span>
        </div>
        <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
          {report.title || report.name}
        </h3>
        {report.summary && (
          <p className="text-sm text-white/40 line-clamp-3">{report.summary}</p>
        )}
        <p className="text-xs text-white/20 mt-3">
          {report.created_at ? new Date(report.created_at).toLocaleDateString() : ''}
        </p>
      </div>
    </Link>
  );
}
