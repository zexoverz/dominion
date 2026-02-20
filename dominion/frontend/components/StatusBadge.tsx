export default function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toUpperCase();
  let cls = 'badge-pending';
  if (s === 'ACTIVE' || s === 'IN_PROGRESS' || s === 'RUNNING') cls = 'badge-active';
  else if (s === 'COMPLETE' || s === 'COMPLETED' || s === 'DONE') cls = 'badge-complete';
  else if (s === 'FAILED' || s === 'ERROR') cls = 'badge-failed';
  return <span className={`status-badge ${cls}`}>{s}</span>;
}
