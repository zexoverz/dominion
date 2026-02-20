export default function RPGPanel({ title, children, className = '', dark = false }: { title?: string; children: React.ReactNode; className?: string; dark?: boolean }) {
  const containerClass = dark ? 'nes-container is-dark' : 'nes-container';
  const titleClass = title ? 'with-title' : '';

  return (
    <div className={`${containerClass} ${titleClass} ${className}`}>
      {title && <p className="title">{title}</p>}
      {children}
    </div>
  );
}
