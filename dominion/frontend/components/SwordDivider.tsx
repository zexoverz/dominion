export default function SwordDivider({ label }: { label?: string }) {
  return (
    <div className="sword-divider">
      {label ? <span className="font-pixel" style={{ fontSize: '8px', color: '#c8a832' }}>⚔ {label} ⚔</span> : <span>⚔</span>}
    </div>
  );
}
