"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "THRONE ROOM", icon: "👑" },
  { href: "/missions", label: "MISSIONS", icon: "⚔️" },
  { href: "/roundtable", label: "ROUNDTABLE", icon: "🏰" },
  { href: "/cost", label: "TREASURY", icon: "💰" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 bg-throne-dark border-r-4 border-throne-purple min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-3xl mb-2">⚜️</div>
        <h1 className="text-[8px] text-throne-gold text-glow-gold leading-relaxed">
          THE DOMINION
        </h1>
        <p className="text-[6px] text-gray-600 mt-1">of Lord Zexo</p>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-3 transition-colors text-[8px] ${
                  isActive
                    ? "bg-throne-purple text-throne-gold pixel-border-thin"
                    : "text-gray-500 hover:text-gray-300 hover:bg-throne-purple/30"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <span className="ml-auto text-[6px]">◄</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Phase indicator */}
      <div className="mt-auto pt-8">
        <div className="pixel-border-thin p-3">
          <p className="text-[6px] text-throne-gold mb-2">CURRENT PHASE</p>
          <p className="text-[8px] text-throne-goldLight">PHASE 1</p>
          <p className="text-[6px] text-gray-500 mt-1">THE FIRST THREE</p>
          <div className="flex gap-1 mt-2 flex-wrap">
            {["👑", "🔮", "👻"].map((e) => (
              <span key={e} className="text-sm">{e}</span>
            ))}
            {["🛡️", "📯", "⚒️", "🗝️"].map((e) => (
              <span key={e} className="text-sm opacity-30">{e}</span>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
