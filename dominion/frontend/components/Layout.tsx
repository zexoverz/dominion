'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '◆' },
  { href: '/missions', label: 'Missions', icon: '⬡' },
  { href: '/intel', label: 'Intel', icon: '◈' },
  { href: '/generals', label: 'Generals', icon: '◎' },
  { href: '/command', label: 'Command', icon: '⌘' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-white/5 bg-surface-secondary/50 backdrop-blur-xl fixed h-full z-30">
        <div className="p-6">
          <h1 className="text-lg font-bold gradient-text tracking-tight">DOMINION</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 mt-1">Command Center</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <p className="text-[10px] text-white/20">v4.0 — AI Ops Platform</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-56 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-white/5">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.map(item => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex flex-col items-center gap-1 text-[10px] transition-colors ${
                  active ? 'text-blue-400' : 'text-white/30'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
