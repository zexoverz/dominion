'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Town', icon: '🏰' },
  { href: '/quests', label: 'Quests', icon: '📜' },
  { href: '/intel', label: 'Intel', icon: '📚' },
  { href: '/generals', label: 'Army', icon: '⚔️' },
  { href: '/command', label: 'War', icon: '🗡️' },
];

export default function RPGNav() {
  const path = usePathname();
  const isActive = (href: string) => href === '/' ? path === '/' : path.startsWith(href);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-48 flex-col z-50"
        style={{ backgroundColor: '#3a2a1a', borderRight: '4px solid #8b6914' }}>
        <div className="p-4">
          <div className="nes-container is-dark" style={{ padding: '8px', textAlign: 'center', background: '#2a1a0a' }}>
            <div className="font-pixel" style={{ color: '#c8a832', fontSize: '8px', lineHeight: '1.4' }}>
              👑
              <br />
              DOMINION
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2 mt-2">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className="flex items-center gap-3 px-3 py-3 transition-all"
              style={{
                color: isActive(n.href) ? '#c8a832' : '#c8b88a',
                backgroundColor: isActive(n.href) ? 'rgba(200,168,50,0.12)' : 'transparent',
                borderLeft: isActive(n.href) ? '3px solid #c8a832' : '3px solid transparent',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '9px',
                borderRadius: '2px',
              }}>
              <span className="text-base">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto p-4">
          <div style={{ borderTop: '2px solid #5a3e1b', paddingTop: '12px', textAlign: 'center' }}>
            <div style={{ color: '#6b5530', fontSize: '7px', fontFamily: '"Press Start 2P", monospace' }}>
              Lord Zexo&apos;s
              <br />
              Command Center
            </div>
            <div style={{ color: '#5a3e1b', fontSize: '7px', fontFamily: '"Press Start 2P", monospace', marginTop: '4px' }}>v3.0</div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 z-50"
        style={{ backgroundColor: '#3a2a1a', borderTop: '3px solid #8b6914' }}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href}
            className="flex flex-col items-center gap-1 px-2 py-1 transition-all"
            style={{
              color: isActive(n.href) ? '#c8a832' : '#8b7a5a',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '6px',
            }}>
            <span className="text-xl">{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
