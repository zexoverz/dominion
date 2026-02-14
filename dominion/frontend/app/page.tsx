"use client";

import { useState, useEffect } from "react";
import { generals as mockGenerals } from "../lib/mock-data";
import { getGenerals } from "../lib/api";
import { mergeGenerals } from "../lib/merge-generals";
import GeneralCard from "../components/GeneralCard";
import StatsBar from "../components/StatsBar";
import SpriteStage from "../components/sprites/SpriteStage";
import { getGeneralSprite } from "../components/sprites";
import AgentActivityFeed from "../components/realtime/AgentActivityFeed";
import SystemPulse from "../components/realtime/SystemPulse";
import CostTicker from "../components/realtime/CostTicker";
import NetworkGraph from "../components/realtime/NetworkGraph";
import MissionProgressLive from "../components/realtime/MissionProgressLive";
import { useActivity } from "../lib/use-activity";

export default function Dashboard() {
  const [generals, setGenerals] = useState(mockGenerals);
  const activity = useActivity();

  useEffect(() => {
    getGenerals()
      .then((data) => setGenerals(mergeGenerals(data)))
      .catch(() => {});
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
        {(activity.eventCount > 0 || activity.missionCount > 0) && (
          <div className="flex items-center justify-center gap-6 mt-3">
            <span className="font-pixel text-[8px] text-seer-blue">
              📡 {activity.eventCount} events
            </span>
            <span className="font-pixel text-[8px] text-throne-gold">
              ⚔️ {activity.missionCount} missions
            </span>
            {activity.lastUpdate && (
              <span className="font-pixel text-[7px] text-rpg-borderMid">
                Updated {Math.round((Date.now() - activity.lastUpdate) / 1000)}s ago
              </span>
            )}
          </div>
        )}
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
        <div className="flex justify-center gap-6 mt-4 items-end">
          {generals.slice(0, 3).map((g) => (
            <div key={g.id} className="text-center">
              {getGeneralSprite(g.id, g.status === 'ACTIVE' ? 'working' : 'idle', 56) || (
                <span className="text-2xl">{g.emoji}</span>
              )}
              <p className="font-pixel text-[7px] mt-1 text-rpg-shadow" style={{ color: g.color }}>{g.name}</p>
            </div>
          ))}
          <div className="border-l-2 border-rpg-borderDark hidden md:block" />
          {generals.slice(3).map((g) => (
            <div key={g.id} className="text-center opacity-25 grayscale hidden md:block">
              {getGeneralSprite(g.id, 'idle', 48) || (
                <span className="text-2xl">{g.emoji}</span>
              )}
              <p className="font-pixel text-[7px] mt-1 text-rpg-borderMid">{g.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FEATURED GENERAL ═══ */}
      <div className="rpg-panel p-4 mb-6 flex flex-col items-center">
        <p className="font-pixel text-[8px] text-rpg-borderMid mb-3 tracking-widest">— SUPREME COMMANDER —</p>
        <SpriteStage
          generalId="throne"
          name="THRONE"
          state="working"
          actionText="Orchestrating Phase 1 deployment"
          status="online"
          size={128}
        />
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

      {/* ═══ LIVE INTEL ═══ */}
      {activity.events.length > 0 && (
        <div className="rpg-panel p-4 mb-6">
          <h2 className="font-pixel text-[10px] text-rpg-border mb-3 text-rpg-shadow">📡 LIVE INTEL FEED</h2>
          <div className="space-y-2">
            {activity.events.slice(0, 3).map((evt, i) => (
              <div key={evt.id || i} className="flex items-start gap-2 text-[10px] font-body">
                <span>{evt.emoji || '⚡'}</span>
                <span className="text-rpg-text flex-1">{evt.message}</span>
                <span className="text-rpg-borderMid text-[8px] whitespace-nowrap">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ NETWORK GRAPH ═══ */}
      <div className="mb-6">
        <h2 className="font-pixel text-[10px] text-rpg-border mb-4 text-rpg-shadow">🌐 GENERAL NETWORK</h2>
        <NetworkGraph className="max-w-2xl" />
      </div>
    </div>
  );
}
