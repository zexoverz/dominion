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
      {/* ═══ TITLE SCREEN ═══ */}
      <div className="rpg-panel mb-6 text-center py-6">
        <p className="font-pixel text-[8px] text-rpg-borderMid mb-2 tracking-widest">— WELCOME TO —</p>
        <h1 className="font-pixel text-[16px] md:text-[20px] text-throne-gold text-glow-gold mb-3 chapter-title">
          👑 THE DOMINION
        </h1>
        <p className="font-pixel text-[8px] text-rpg-border tracking-wider">
          of LORD ZEXO
        </p>
        <p className="text-[9px] font-body text-rpg-borderMid mt-3">
          Command your generals. Conquer the unknown.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <SystemPulse />
          <CostTicker initialCost={costToday} />
        </div>
      </div>

      {/* ═══ HUD STATS BAR ═══ */}
      <StatsBar />

      {/* ═══ CHAPTER TITLE: PHASE 1 ═══ */}
      <div className="mb-6 text-center py-4" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.08) 20%, rgba(251,191,36,0.12) 50%, rgba(251,191,36,0.08) 80%, transparent 100%)',
        borderTop: '2px solid #5a4a3a',
        borderBottom: '2px solid #5a4a3a',
      }}>
        <p className="font-pixel text-[7px] text-rpg-borderMid mb-1 tracking-[6px]">CHAPTER</p>
        <h2 className="font-pixel text-[14px] text-throne-gold text-glow-gold chapter-title">
          ⚔️ PHASE 1 ⚔️
        </h2>
        <p className="font-pixel text-[8px] text-throne-goldDark mt-1 tracking-wider">THE FIRST THREE</p>
        <div className="flex justify-center gap-6 mt-4">
          {generals.slice(0, 3).map((g) => (
            <div key={g.id} className="text-center">
              <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.3))' }}>{g.emoji}</span>
              <p className="font-pixel text-[7px] mt-1 text-rpg-shadow" style={{ color: g.color }}>{g.name}</p>
            </div>
          ))}
          <div className="border-l-2 border-rpg-borderDark hidden md:block" />
          {generals.slice(3).map((g) => (
            <div key={g.id} className="text-center opacity-25 grayscale hidden md:block">
              <span className="text-2xl">{g.emoji}</span>
              <p className="font-pixel text-[7px] mt-1 text-rpg-borderMid">{g.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Generals Grid */}
        <div className="lg:col-span-2">
          <h2 className="font-pixel text-[10px] text-rpg-border mb-4 text-rpg-shadow">📋 THE GENERALS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {generals.map((g) => (
              <GeneralCard key={g.id} general={g} />
            ))}
          </div>
        </div>

        {/* Command Center sidebar */}
        <div className="lg:col-span-1">
          <h2 className="font-pixel text-[10px] text-rpg-border mb-4 text-rpg-shadow">⚡ COMMAND CENTER</h2>
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

      {/* ═══ NETWORK GRAPH ═══ */}
      <div className="mb-6">
        <h2 className="font-pixel text-[10px] text-rpg-border mb-4 text-rpg-shadow">🌐 GENERAL NETWORK</h2>
        <NetworkGraph className="max-w-2xl" />
      </div>
    </div>
  );
}
