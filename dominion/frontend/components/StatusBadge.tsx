export default function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toUpperCase();
  let cls = 'badge-pending';
  let icon = 'SLP';
  if (s === 'ACTIVE' || s === 'IN_PROGRESS' || s === 'RUNNING') { cls = 'badge-active'; icon = 'BRN'; }
  else if (s === 'COMPLETE' || s === 'COMPLETED' || s === 'DONE') { cls = 'badge-complete'; icon = 'PSN'; }
  else if (s === 'FAILED' || s === 'ERROR') { cls = 'badge-failed'; icon = 'FNT'; }

  return (
    <span className={`status-badge ${cls}`}>
      <img
        src="/assets/pokemon/ui-status_icons.png"
        alt=""
        className="pixel"
        style={{
          imageRendering: 'pixelated',
          height: 10,
          objectFit: 'none',
          objectPosition: icon === 'BRN' ? '-80px 0' : icon === 'PSN' ? '0 0' : icon === 'FNT' ? '-96px 0' : '-32px 0',
          width: 16,
          overflow: 'hidden',
        }}
      />
      {s}
    </span>
  );
}
