"use client";

import Link from "next/link";
import { General } from "../lib/mock-data";
import { getGeneralSprite, SpriteState } from "./sprites";

const statusToSpriteState: Record<string, SpriteState> = {
  ACTIVE: "working",
  IDLE: "idle",
  OFFLINE: "idle",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "ACTIVE", color: "#22c55e" },
  IDLE: { label: "IDLE", color: "#fbbf24" },
  OFFLINE: { label: "SEALED", color: "#64748b" },
};

export default function GeneralCard({ general }: { general: General }) {
  const st = statusLabels[general.status] || statusLabels.OFFLINE;
  const isPhase1 = (general.phase ?? 0) >= 1;

  // Simulate HP/MP from personality stats (safe defaults)
  const p = general.personality || { loyalty: 50, wisdom: 50, creativity: 50, strategy: 50 };
  const hp = Math.round(((p.loyalty || 50) + (p.wisdom || 50)) / 2);
  const mp = Math.round(((p.creativity || 50) + (p.strategy || 50)) / 2);

  return (
    <Link href={`/generals/${general.id}`}>
      <div
        className={`rpg-panel p-0 hover:translate-y-[-2px] transition-transform cursor-pointer ${
          !isPhase1 ? "opacity-50 grayscale-[30%]" : ""
        }`}
      >
        {/* Character sprite + name bar */}
        <div
          className="px-3 py-3 border-b-2 flex items-center gap-3"
          style={{ borderColor: (general.color || '#888') + '44', background: general.bgColor || '#1a1028' }}
        >
          <div className="flex-shrink-0" style={{ opacity: general.status === 'OFFLINE' ? 0.4 : 1 }}>
            {getGeneralSprite(general.id, statusToSpriteState[general.status] || 'idle', 72) || (
              <span className="text-4xl">{general.emoji}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-pixel text-[9px] text-rpg-shadow block" style={{ color: general.color }}>
              {general.name}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-2 h-2 status-${general.status.toLowerCase()}`} />
              <span className="text-[8px] font-body" style={{ color: st.color }}>{st.label}</span>
            </div>
          </div>
        </div>

        {/* Stats area */}
        <div className="p-3">
          {/* Title */}
          <p className="text-[8px] text-rpg-border font-body mb-3 italic">{general.title}</p>

          {/* HP Bar */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-pixel text-[7px] text-rpg-hp w-6">HP</span>
            <div className="hp-bar flex-1 h-3">
              <div
                className="hp-bar-fill h-full"
                style={{ width: `${hp}%`, background: `linear-gradient(180deg, #4ade80, #16a34a)` }}
              />
            </div>
            <span className="text-[8px] font-body text-rpg-hp w-10 text-right">{hp}/99</span>
          </div>

          {/* MP Bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-pixel text-[7px] text-rpg-mp w-6">MP</span>
            <div className="hp-bar flex-1 h-3">
              <div
                className="hp-bar-fill h-full"
                style={{ width: `${mp}%`, background: `linear-gradient(180deg, #60a5fa, #2563eb)` }}
              />
            </div>
            <span className="text-[8px] font-body text-rpg-mp w-10 text-right">{mp}/99</span>
          </div>

          {/* Model + Cost — like equipment line */}
          <div className="flex items-center gap-2 mb-2 border-t border-rpg-borderDark pt-2">
            <span className="text-[8px] font-pixel text-rpg-borderMid px-2 py-0.5 bg-rpg-borderDark/30">
              {general.model}
            </span>
            <span className="text-[8px] font-body text-throne-goldDark">
              💰 {(general.costToday ?? 0).toFixed(2)}g
            </span>
          </div>

          {/* Current mission — like status condition */}
          <div className="border-t border-rpg-borderDark pt-2">
            {general.currentMission ? (
              <p className="text-[8px] font-body text-rpg-border">
                <span className="text-throne-gold">⚔️</span> {general.currentMission}
              </p>
            ) : (
              <p className="text-[8px] font-body text-rpg-borderMid italic">
                💤 Awaiting orders...
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
