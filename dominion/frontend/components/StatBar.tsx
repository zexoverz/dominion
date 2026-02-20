export default function StatBar({ label, value, max = 160 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="text-[7px] w-12 text-right uppercase">{label}</span>
      <span className="text-[7px] w-8 text-right">{value}</span>
      <div className="stat-bar-bg flex-1">
        <div className="stat-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
