export default function RPGProgress({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full">
      {label && <div className="text-xs text-brown-dark mb-1">{label} {value}/{max}</div>}
      <div className="h-4 border-2 border-brown-dark bg-parchment-dark relative overflow-hidden">
        <div
          className="h-full bg-rpg-hp transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-brown-text">
          {pct}%
        </div>
      </div>
    </div>
  );
}
