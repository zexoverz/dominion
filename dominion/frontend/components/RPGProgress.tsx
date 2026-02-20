export default function RPGProgress({ value, max, label, variant = 'success' }: { value: number; max: number; label?: string; variant?: 'success' | 'primary' | 'warning' | 'error' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full">
      {label && <div className="text-xs text-brown-dark mb-1 font-pixel" style={{ fontSize: '8px' }}>{label} {value}/{max}</div>}
      <progress className={`nes-progress is-${variant}`} value={pct} max="100" />
    </div>
  );
}
