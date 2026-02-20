export default function StatusDot({ status }: { status: string }) {
  const color = status === 'active' || status === 'online' ? 'bg-green-500' :
    status === 'idle' || status === 'paused' ? 'bg-amber-500' : 'bg-red-500';
  const glow = status === 'active' || status === 'online' ? 'shadow-green-500/50' :
    status === 'idle' || status === 'paused' ? 'shadow-amber-500/50' : 'shadow-red-500/50';
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75 animate-ping`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color} shadow-lg ${glow}`} />
    </span>
  );
}
