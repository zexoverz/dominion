"use client";

import Link from "next/link";
import { General } from "../lib/mock-data";
import { getGeneralSprite } from "./sprites";

const statusGlow: Record<string, string> = {
  ACTIVE: "0 0 8px rgba(34,197,94,0.5), 0 0 16px rgba(34,197,94,0.2)",
  IDLE: "0 0 6px rgba(251,191,36,0.3)",
  OFFLINE: "none",
};

export default function GeneralsMiniGrid({ generals }: { generals: General[] }) {
  return (
    <div className="mb-6">
      <h2 className="font-pixel text-[10px] text-rpg-border mb-3 text-rpg-shadow">⚔️ GENERALS</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {generals.map((g) => {
          const isActive = g.status === "ACTIVE";
          const isOffline = g.status === "OFFLINE";
          return (
            <Link key={g.id} href={`/generals/${g.id}`}>
              <div
                className={`rpg-panel p-2 md:p-3 text-center cursor-pointer hover:translate-y-[-2px] transition-all ${
                  isOffline ? "opacity-40 grayscale-[40%]" : ""
                }`}
                style={{
                  boxShadow: statusGlow[g.status] || "none",
                  borderColor: isActive ? (g.color || "#888") + "66" : undefined,
                }}
              >
                <div className="flex justify-center mb-1.5">
                  {getGeneralSprite(g.id, isActive ? "working" : "idle", 44) || (
                    <span className="text-2xl">{g.emoji}</span>
                  )}
                </div>
                <p className="font-pixel text-[8px] text-rpg-shadow truncate" style={{ color: g.color }}>
                  {g.name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? "#22c55e" : isOffline ? "#64748b" : "#fbbf24",
                      boxShadow: isActive ? "0 0 4px #22c55e" : "none",
                    }}
                  />
                  <span className="font-pixel text-[6px] text-rpg-borderMid">
                    {isActive ? "ACTIVE" : isOffline ? "SEALED" : "IDLE"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
