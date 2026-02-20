import HoloPanel from './HoloPanel';

export default function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: string;
}) {
  return (
    <HoloPanel glow className="animate-float">
      <div className="label mb-1">{label}</div>
      <div className="flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-2xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00f0ff' }}>
          {value}
        </span>
      </div>
    </HoloPanel>
  );
}
