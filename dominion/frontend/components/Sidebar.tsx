"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/throne-room", label: "CASTLE VIEW", shortLabel: "CASTLE", icon: "🏰" },
  { href: "/", label: "THRONE ROOM", shortLabel: "THRONE", icon: "👑" },
  { href: "/missions", label: "MISSIONS", shortLabel: "QUEST", icon: "⚔️" },
  { href: "/roundtable", label: "ROUNDTABLE", shortLabel: "ROUND", icon: "🏰" },
  { href: "/cost", label: "TREASURY", shortLabel: "GOLD", icon: "💰" },
  { href: "/admin", label: "COMMAND", shortLabel: "CMD", icon: "⚔️" },
  { href: "/logs", label: "LOG", shortLabel: "LOG", icon: "📜" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [flash, setFlash] = useState<string | null>(null);

  const handleClick = (href: string) => {
    setFlash(href);
    setTimeout(() => setFlash(null), 150);
  };

  return (
    <>
      {/* Desktop sidebar — FF-style menu */}
      <nav className="hidden md:flex w-56 min-h-screen flex-col flex-shrink-0 rpg-panel">
        {/* Logo / Title */}
        <div className="mb-6 text-center border-b-2 border-rpg-borderMid pb-4">
          <div className="text-3xl mb-2 animate-float">⚜️</div>
          <h1 className="font-pixel text-[10px] text-throne-gold text-glow-gold leading-relaxed tracking-wider">
            THE DOMINION
          </h1>
          <p className="text-[9px] text-rpg-borderMid mt-1 font-body">of Lord Zexo</p>
        </div>

        {/* Command Menu */}
        <div className="mb-2 px-2">
          <p className="text-[8px] font-pixel text-rpg-border mb-3 text-rpg-shadow">COMMAND</p>
        </div>
        <div className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isFlashing = flash === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => handleClick(item.href)}>
                <div
                  className={`rpg-menu-item flex items-center gap-3 px-3 py-3 min-h-[44px] font-pixel text-[9px] transition-none ${
                    isFlashing
                      ? "bg-throne-gold/30 text-white"
                      : isActive
                      ? "bg-rpg-borderDark/50 text-throne-gold"
                      : "text-rpg-border hover:text-throne-goldLight"
                  }`}
                >
                  {/* Blinking cursor for active */}
                  <span className={`text-[10px] w-4 font-pixel ${isActive ? "rpg-cursor text-throne-gold" : "opacity-0"}`}>
                    ▶
                  </span>
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className="my-4 mx-2 border-t-2 border-rpg-borderMid" />

        {/* Phase indicator — like FF status window */}
        <div className="mt-auto px-2 pb-4">
          <div className="rpg-panel p-3">
            <p className="text-[8px] font-pixel text-throne-gold mb-2 text-rpg-shadow">PHASE</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-pixel text-[14px] text-throne-goldLight text-glow-gold">01</span>
              <div className="flex-1">
                <p className="font-pixel text-[8px] text-rpg-border">THE FIRST</p>
                <p className="font-pixel text-[7px] text-rpg-borderMid">THREE</p>
              </div>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {["👑", "🔮", "👻"].map((e) => (
                <span key={e} className="text-sm" style={{ filter: 'drop-shadow(0 0 2px rgba(251,191,36,0.3))' }}>{e}</span>
              ))}
              <span className="text-[8px] text-rpg-borderMid mx-1">│</span>
              {["🛡️", "📯", "⚒️", "🗝️"].map((e) => (
                <span key={e} className="text-sm opacity-25 grayscale">{e}</span>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav — RPG command bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-rpg-panel border-t-3 border-rpg-border flex justify-around items-center px-1 py-0 safe-bottom"
        style={{ borderTop: '3px solid #8b7355' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1" onClick={() => handleClick(item.href)}>
              <div
                className={`flex flex-col items-center justify-center min-h-[56px] py-2 px-1 ${
                  isActive
                    ? "text-throne-gold bg-rpg-borderDark/30"
                    : "text-rpg-borderMid"
                }`}
              >
                {isActive && <span className="text-[6px] font-pixel rpg-cursor mb-0.5">▶</span>}
                <span className="text-xl mb-0.5">{item.icon}</span>
                <span className="text-[7px] font-pixel leading-tight">{item.shortLabel}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
