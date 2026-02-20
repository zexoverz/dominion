const VARIANTS: Record<string, string> = {
  active: 'is-success',
  running: 'is-success',
  completed: 'is-primary',
  done: 'is-primary',
  pending: 'is-warning',
  failed: 'is-error',
  rejected: 'is-error',
  approved: 'is-success',
  idle: '',
};

export default function StatusBadge({ status }: { status: string }) {
  const s = (status || 'unknown').toLowerCase();
  const variant = VARIANTS[s] || '';
  return (
    <span className={`nes-badge ${variant}`} style={{ whiteSpace: 'nowrap' }}>
      <span className={variant || 'is-dark'} style={{ fontSize: '8px', fontFamily: '"Press Start 2P", monospace' }}>{status}</span>
    </span>
  );
}
