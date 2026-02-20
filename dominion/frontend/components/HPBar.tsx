export default function HPBar({ value, max, showLabel = true }: { value: number; max: number; showLabel?: boolean }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const color = pct > 50 ? 'hp-green' : pct > 20 ? 'hp-yellow' : 'hp-red';
  return (
    <div className="flex items-center gap-2 w-full">
      {showLabel && <span className="text-[7px] bg-[#f8d030] text-[#383838] px-1 font-bold">HP</span>}
      <div className="hp-bar-outer flex-1">
        <div className={`hp-bar-inner ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[7px] whitespace-nowrap">{value}/{max}</span>
    </div>
  );
}
