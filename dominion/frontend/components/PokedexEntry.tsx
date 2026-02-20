import Link from 'next/link';
import GeneralSprite from './GeneralSprite';

export default function PokedexEntry({ report, index }: { report: any; index: number }) {
  const num = String(index + 1).padStart(3, '0');
  return (
    <Link href={`/intel/${report.slug || report.id || report._id}`}>
      <div className="pokedex-entry">
        <span className="text-[9px] text-[#707070]">#{num}</span>
        <GeneralSprite name={report.general || report.author || ''} size={24} />
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-bold truncate">{report.title || report.name}</div>
          <div className="text-[7px] text-[#909090]">{report.general || report.author || 'Unknown'} · {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ''}</div>
        </div>
        <span className="text-[7px]">●</span>
      </div>
    </Link>
  );
}
