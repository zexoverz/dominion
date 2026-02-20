'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Town', icon: '🏠' },
  { href: '/quests', label: 'Quests', icon: '📜' },
  { href: '/intel', label: 'Intel', icon: '📚' },
  { href: '/generals', label: 'Generals', icon: '⚔️' },
  { href: '/command', label: 'Command', icon: '🏰' },
];

export default function RPGNav() {
  const path = usePathname();
  const isActive = (href: string) => href === '/' ? path === '/' : path.startsWith(href);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-48 bg-brown-dark flex-col p-4 gap-2 z-50">
        <div className="font-pixel text-gold text-xs mb-4 text-center">⚔️ DOMINION</div>
        {NAV.map(n => (
          <Link key={n.href} href={n.href}
            className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
              isActive(n.href) ? 'bg-gold text-brown-dark font-bold' : 'text-parchment hover:bg-brown-border'
            }`}>
            <span>{n.icon}</span> {n.label}
          </Link>
        ))}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brown-dark flex justify-around items-center h-14 z-50 border-t-2 border-brown-border">
        {NAV.map(n => (
          <Link key={n.href} href={n.href}
            className={`flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 ${
              isActive(n.href) ? 'text-gold font-bold' : 'text-parchment'
            }`}>
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
