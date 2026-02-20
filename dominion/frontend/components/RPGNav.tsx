'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Town', icon: '🏠' },
  { href: '/quests', label: 'Quests', icon: '📜' },
  { href: '/intel', label: 'Intel', icon: '📚' },
  { href: '/generals', label: 'Army', icon: '⚔️' },
  { href: '/command', label: 'War', icon: '🏰' },
];

export default function RPGNav() {
  const path = usePathname();
  const isActive = (href: string) => href === '/' ? path === '/' : path.startsWith(href);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-48 flex-col z-50"
        style={{ backgroundColor: '#5a3e1b', borderRight: '4px solid #8b6914' }}>
        <div className="p-4">
          <div className="nes-container is-dark" style={{ padding: '8px', textAlign: 'center' }}>
            <span className="font-pixel" style={{ color: '#c8a832', fontSize: '8px' }}>⚔ DOMINION ⚔</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                isActive(n.href)
                  ? 'font-bold'
                  : 'hover:opacity-80'
              }`}
              style={{
                color: isActive(n.href) ? '#c8a832' : '#faf3e0',
                backgroundColor: isActive(n.href) ? 'rgba(200,168,50,0.15)' : 'transparent',
                borderLeft: isActive(n.href) ? '3px solid #c8a832' : '3px solid transparent',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '9px',
              }}>
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-4">
          <div style={{ borderTop: '2px solid #8b6914', paddingTop: '8px', textAlign: 'center' }}>
            <span style={{ color: '#8b6914', fontSize: '8px', fontFamily: '"Press Start 2P", monospace' }}>v2.0 RPG</span>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center h-14 z-50"
        style={{ backgroundColor: '#5a3e1b', borderTop: '4px solid #8b6914' }}>
        {NAV.map(n => (
          <Link key={n.href} href={n.href}
            className="flex flex-col items-center gap-0.5 px-2 py-1"
            style={{
              color: isActive(n.href) ? '#c8a832' : '#faf3e0',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '7px',
            }}>
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
