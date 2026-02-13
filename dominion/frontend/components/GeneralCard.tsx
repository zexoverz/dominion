"use client";

import Link from "next/link";
import { General } from "../lib/mock-data";

export default function GeneralCard({ general }: { general: General }) {
  const statusClass = general.status === "ACTIVE" ? "status-active" : general.status === "IDLE" ? "status-idle" : "status-offline";
  const isPhase1 = general.phase === 1;

  return (
    <Link href={`/generals/${general.id}`}>
      <div
        className={`pixel-border-thin p-4 hover:translate-y-[-2px] transition-transform cursor-pointer min-h-[44px] ${
          isPhase1 ? "bg-throne-dark" : "bg-throne-black opacity-60"
        }`}
      >
        {/* Avatar + Status */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: general.bgColor, boxShadow: `0 0 8px ${general.color}44` }}
          >
            {general.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 ${statusClass}`} />
              <span className="text-[9px] md:text-[8px] uppercase" style={{ color: general.color }}>
                {general.status}
              </span>
            </div>
            <h3 className="text-[11px] md:text-[10px] truncate" style={{ color: general.color }}>
              {general.name}
            </h3>
            <p className="text-[9px] md:text-[8px] text-gray-500 truncate">{general.title}</p>
          </div>
        </div>

        {/* Model badge */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[9px] md:text-[8px] px-2 py-1 md:py-0.5 bg-throne-purple text-throne-goldLight">
            {general.model}
          </span>
          <span className="text-[9px] md:text-[8px] text-gray-600">
            ${general.costToday.toFixed(2)} today
          </span>
        </div>

        {/* Current mission */}
        {general.currentMission ? (
          <p className="text-[9px] md:text-[8px] text-gray-400 truncate">
            ⚔️ {general.currentMission}
          </p>
        ) : (
          <p className="text-[9px] md:text-[8px] text-gray-600">💤 Awaiting orders...</p>
        )}
      </div>
    </Link>
  );
}
