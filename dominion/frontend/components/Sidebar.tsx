"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "THRONE ROOM", shortLabel: "THRONE", icon: "👑" },
  { href: "/missions", label: "MISSIONS", shortLabel: "MISSIONS", icon: "⚔️" },
  { href: "/roundtable", label: "ROUNDTABLE", shortLabel: "ROUND", icon: "🏰" },
  { href: "/cost", label: "TREASURY", shortLabel: "GOLD", icon: "💰" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex w-56 bg-throne-dark border-r-4 border-throne-purple min-h-screen p-4 flex-col flex-shrink-0">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="text-3xl mb-2">⚜️</div>
          <h1 className="text-[10px] text-throne-gold text-glow-gold leading-relaxed">
            THE DOMINION
          </h1>
          <p className="text-[8px] text-gray-600 mt-1">of Lord Zexo</p>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-3 min-h-[44px] transition-colors text-[10px] ${
                    isActive
                      ? "bg-throne-purple text-throne-gold pixel-border-thin"
                      : "text-gray-500 hover:text-gray-300 hover:bg-throne-purple/30"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto text-[8px]">◄</span>}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Phase indicator */}
        <div className="mt-auto pt-8">
          <div className="pixel-border-thin p-3">
            <p className="text-[8px] text-throne-gold mb-2">CURRENT PHASE</p>
            <p className="text-[10px] text-throne-goldLight">PHASE 1</p>
            <p className="text-[8px] text-gray-500 mt-1">THE FIRST THREE</p>
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

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-throne-dark border-t-4 border-throne-purple flex justify-around items-center px-1 py-1 safe-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div
                className={`flex flex-col items-center justify-center min-h-[56px] py-2 px-1 transition-colors ${
                  isActive
                    ? "text-throne-gold bg-throne-purple/50"
                    : "text-gray-500"
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-[8px] leading-tight">{item.shortLabel}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
