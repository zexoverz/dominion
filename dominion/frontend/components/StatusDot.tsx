export default function StatusDot({ status, size = 8 }: { status: string; size?: number }) {
  const colors: Record<string, string> = {
    active: '#22c55e',
    completed: '#00f0ff',
    pending: '#f59e0b',
    failed: '#ef4444',
    online: '#22c55e',
    offline: '#555',
  };
  const c = colors[status?.toLowerCase()] || '#555';
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: c,
        boxShadow: `0 0 6px ${c}`,
      }}
    />
  );
}
