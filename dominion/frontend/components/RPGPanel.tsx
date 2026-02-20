export default function RPGPanel({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rpg-panel ${className}`}>
      {title && (
        <div className="rpg-title mb-3 pb-2 border-b border-brown-border">
          ═══ {title} ═══
        </div>
      )}
      {children}
    </div>
  );
}
