"use client";

import { useState, useEffect } from "react";
import { generals as mockGenerals } from "../lib/mock-data";
import { getGenerals } from "../lib/api";
import GeneralCard from "../components/GeneralCard";
import StatsBar from "../components/StatsBar";
import AgentActivityFeed from "../components/realtime/AgentActivityFeed";
import SystemPulse from "../components/realtime/SystemPulse";
import CostTicker from "../components/realtime/CostTicker";
import NetworkGraph from "../components/realtime/NetworkGraph";
import MissionProgressLive from "../components/realtime/MissionProgressLive";

export default function Dashboard() {
  const [generals, setGenerals] = useState(mockGenerals);

  useEffect(() => {
    getGenerals().then(setGenerals).catch(() => {});
  }, []);

  const costToday = generals.reduce((sum, g) => sum + g.costToday, 0);

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-[12px] md:text-[14px] text-throne-gold text-glow-gold mb-2">
            👑 THE DOMINION OF LORD ZEXO
          </h1>
          <p className="text-[9px] md:text-[8px] text-gray-500">
            Command your generals. Conquer the unknown.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SystemPulse />
          <CostTicker initialCost={costToday} />
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Phase Banner */}
      <div className="pixel-border-gold bg-throne-purple/30 p-3 md:p-4 mb-6 text-center overflow-x-auto">
        <p className="text-[9px] md:text-[8px] text-throne-goldLight mb-2">⚔️ PHASE 1: THE FIRST THREE ⚔️</p>
        <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
          {generals.slice(0, 3).map((g) => (
            <div key={g.id} className="text-center">
              <span className="text-2xl">{g.emoji}</span>
              <p className="text-[8px] mt-1" style={{ color: g.color }}>{g.name}</p>
            </div>
          ))}
          <div className="hidden md:block border-l-2 border-throne-purple" />
          {generals.slice(3).map((g) => (
            <div key={g.id} className="text-center opacity-30">
              <span className="text-2xl">{g.emoji}</span>
              <p className="text-[8px] mt-1 text-gray-600">{g.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Generals Grid - 2 cols */}
        <div className="lg:col-span-2">
          <h2 className="text-[11px] md:text-[10px] text-gray-400 mb-4">📋 THE GENERALS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {generals.map((g) => (
              <GeneralCard key={g.id} general={g} />
            ))}
          </div>
        </div>

        {/* Activity Feed sidebar */}
        <div className="lg:col-span-1">
          <h2 className="text-[11px] md:text-[10px] text-gray-400 mb-4">⚡ COMMAND CENTER</h2>
          <AgentActivityFeed className="mb-4 h-[320px]" />
          <MissionProgressLive
            missionName="Deploy the Watchtower"
            initialProgress={65}
            color="#fbbf24"
            className="mb-4"
          />
          <MissionProgressLive
            missionName="Shadow Protocol Alpha"
            initialProgress={90}
            color="#94a3b8"
          />
        </div>
      </div>

      {/* Network Graph */}
      <div className="mb-6">
        <h2 className="text-[11px] md:text-[10px] text-gray-400 mb-4">🌐 GENERAL NETWORK</h2>
        <NetworkGraph className="max-w-2xl" />
      </div>
    </div>
  );
}
