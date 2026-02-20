'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'DASHBOARD', href: '/', icon: '🏠' },
  { label: 'MISSIONS', href: '/missions', icon: '⚔️' },
  { label: 'INTEL', href: '/intel', icon: '📋' },
  { label: 'GENERALS', href: '/generals', icon: '🎖️' },
  { label: 'COMMAND', href: '/command', icon: '💻' },
];

export default function PokemonNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:block fixed left-4 top-4 w-48 z-40">
        <div className="pkmn-menu">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`pkmn-menu-item ${isActive(item.href) ? 'active' : ''}`}>
                <span className="text-[10px]">{isActive(item.href) ? '►' : '\u00A0\u00A0'}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden mobile-nav">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`pkmn-btn ${isActive(item.href) ? 'pkmn-btn-blue' : ''} text-center text-[7px] py-2`}>
              <div>{item.icon}</div>
              <div className="mt-1">{item.label}</div>
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
}
