'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const ITEMS = [
  { label: 'Overview', path: '/' },
  { label: 'Missions', path: '/missions' },
  { label: 'Intel', path: '/intel' },
  { label: 'Generals', path: '/generals' },
  { label: 'Command', path: '/command' },
];

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop: top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block"
        style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,240,255,0.1)' }}>
        <div className="max-w-6xl mx-auto flex items-center h-14 px-6">
          <Link href="/" className="flex items-center gap-2 mr-8">
            <span style={{ color: '#00f0ff', fontSize: 20 }}>◈</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00f0ff', letterSpacing: '0.15em', fontSize: 13, fontWeight: 700 }}>DOMINION</span>
          </Link>
          <div className="flex items-center gap-1">
            {ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path}
                  className="px-4 py-2 text-xs uppercase tracking-widest transition-all duration-200"
                  style={{
                    color: active ? '#00f0ff' : 'rgba(226,232,240,0.5)',
                    background: active ? 'rgba(0,240,255,0.08)' : 'transparent',
                    borderRadius: 6,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: active ? 600 : 400,
                  }}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile: bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,240,255,0.1)' }}>
        <div className="flex items-center justify-around h-14">
          {ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} href={item.path}
                className="flex flex-col items-center justify-center py-1 px-2 min-w-[56px]"
                style={{ color: active ? '#00f0ff' : 'rgba(226,232,240,0.4)' }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', fontWeight: active ? 600 : 400 }}>
                  {item.label.toUpperCase()}
                </span>
                {active && <span style={{ width: 16, height: 2, background: '#00f0ff', borderRadius: 1, marginTop: 3, boxShadow: '0 0 6px rgba(0,240,255,0.5)' }} />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
