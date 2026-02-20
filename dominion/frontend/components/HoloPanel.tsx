import { ReactNode } from 'react';

export default function HoloPanel({
  children,
  className = '',
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`holo-panel scanlines ${glow ? 'glow-cyan' : ''} ${className}`}
      style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
}
