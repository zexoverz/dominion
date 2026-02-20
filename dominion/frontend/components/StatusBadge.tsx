const COLORS: Record<string, string> = {
  active: 'bg-forest text-white',
  running: 'bg-forest text-white',
  completed: 'bg-royal text-white',
  done: 'bg-royal text-white',
  pending: 'bg-gold text-brown-dark',
  failed: 'bg-crimson text-white',
  rejected: 'bg-crimson text-white',
  approved: 'bg-forest text-white',
  idle: 'bg-parchment-dark text-brown-text',
};

export default function StatusBadge({ status }: { status: string }) {
  const s = (status || 'unknown').toLowerCase();
  const cls = COLORS[s] || 'bg-parchment-dark text-brown-text';
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase ${cls}`}>
      {status}
    </span>
  );
}
