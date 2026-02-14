"use client";

import { useState, useEffect } from "react";
import { generals as mockGenerals, missions as mockMissions } from "../../../lib/mock-data";
import { getGenerals, getGeneral, getMissions } from "../../../lib/api";
import PixelProgress from "../../../components/PixelProgress";
import Link from "next/link";

export default function GeneralDetail({ params }: { params: { id: string } }) {
  const [generals, setGenerals] = useState(mockGenerals);
  const [missions, setMissions] = useState(mockMissions);
  const [generalData, setGeneralData] = useState(() => mockGenerals.find((g) => g.id === params.id));

  useEffect(() => {
    getGeneral(params.id).then(setGeneralData).catch(() => {});
    getGenerals().then(setGenerals).catch(() => {});
    getMissions().then(setMissions).catch(() => {});
  }, [params.id]);

  const general = generalData || generals.find((g) => g.id === params.id);
  if (!general) {
    return <div className="font-pixel text-[10px] text-throne-red">⚠️ GENERAL NOT FOUND</div>;
  }

  const generalMissions = missions.filter((m) => m.assignedTo === general.id);
  const personality = Object.entries(general.personality);
  const relationships = Object.entries(general.relationships);

  return (
    <div className="max-w-full overflow-hidden">
      <Link href="/" className="font-pixel text-[9px] text-rpg-borderMid hover:text-throne-gold mb-4 inline-flex items-center min-h-[44px] gap-2">
        <span className="rpg-cursor">▶</span> BACK TO THRONE ROOM
      </Link>

      {/* Character Header — RPG status screen style */}
      <div className="rpg-panel p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
          <div
            className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-4xl md:text-5xl flex-shrink-0"
            style={{
              backgroundColor: general.bgColor,
              border: `3px solid ${general.color}`,
              boxShadow: `0 0 16px ${general.color}44`,
            }}
          >
            {general.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-pixel text-[14px] md:text-[16px] mb-1 text-rpg-shadow break-words" style={{ color: general.color }}>
              {general.emoji} {general.name}
            </h1>
            <p className="font-body text-[10px] text-rpg-border italic mb-3">{general.title}</p>
            <div className="flex gap-2 md:gap-3 items-center flex-wrap mb-3">
              <span className={`w-3 h-3 status-${general.status.toLowerCase()}`} />
              <span className="font-pixel text-[8px] text-rpg-border">{general.status}</span>
              <span className="font-pixel text-[8px] px-2 py-0.5 bg-rpg-borderDark/30 text-throne-goldLight border border-rpg-borderDark">{general.model}</span>
              <span className="font-pixel text-[8px] text-rpg-borderMid">Phase {general.phase}</span>
            </div>
            <p className="font-body text-[9px] text-rpg-border max-w-lg break-words leading-relaxed">{general.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Personality — stat bars */}
        <div className="rpg-panel p-3 md:p-4">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">🧠 STATS</h2>
          <div className="flex flex-col gap-3">
            {personality.map(([trait, value]) => (
              <div key={trait}>
                <div className="flex justify-between text-[8px] font-pixel text-rpg-borderMid mb-1">
                  <span className="uppercase">{trait}</span>
                  <span className="text-throne-goldLight">{value}</span>
                </div>
                <PixelProgress value={value as number} color={general.color} height={12} segments={20} />
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="rpg-panel p-3 md:p-4">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">🤝 BONDS</h2>
          <div className="flex flex-col gap-3">
            {relationships.map(([id, score]) => {
              const other = generals.find((g) => g.id === id);
              if (!other) return null;
              const s = score as number;
              return (
                <div key={id} className="flex items-center gap-2 md:gap-3">
                  <span className="text-lg flex-shrink-0">{other.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[8px] font-pixel text-rpg-borderMid mb-1">
                      <span className="text-rpg-shadow" style={{ color: other.color }}>{other.name}</span>
                      <span>{s}/100</span>
                    </div>
                    <PixelProgress value={s} color={s > 70 ? "#22c55e" : s > 40 ? "#fbbf24" : "#dc2626"} height={8} segments={10} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission History */}
        <div className="rpg-panel p-3 md:p-4 lg:col-span-2">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📜 QUEST LOG</h2>
          {generalMissions.length === 0 ? (
            <p className="font-body text-[9px] text-rpg-borderMid italic">No quests yet. Awaiting activation...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {generalMissions.map((m) => (
                <div key={m.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 p-2 md:p-3"
                  style={{ borderLeft: '3px solid #5a4a3a', background: 'rgba(16,16,42,0.5)' }}>
                  <span className="font-body text-[8px] text-rpg-borderMid sm:w-20 flex-shrink-0">{m.createdAt}</span>
                  <span className="font-pixel text-[8px] text-throne-goldLight flex-1 break-words">{m.title}</span>
                  <div className="flex gap-2 items-center">
                    <span className="font-pixel text-[7px] px-2 py-0.5" style={{
                      color: m.status === "COMPLETE" ? "#22c55e" : m.status === "IN_PROGRESS" ? "#fbbf24" : "#94a3b8",
                      backgroundColor: m.status === "COMPLETE" ? "#22c55e11" : m.status === "IN_PROGRESS" ? "#fbbf2411" : "#94a3b811",
                      border: `1px solid ${m.status === "COMPLETE" ? "#22c55e33" : m.status === "IN_PROGRESS" ? "#fbbf2433" : "#94a3b833"}`,
                    }}>
                      {m.status}
                    </span>
                    <span className="font-body text-[8px] text-rpg-borderMid">{m.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vital Signs */}
        <div className="rpg-panel p-3 md:p-4 lg:col-span-2">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📊 VITAL SIGNS</h2>
          <div className="flex flex-wrap gap-6 md:gap-8">
            {[
              { label: "TOTAL QUESTS", value: general.totalMissions.toString() },
              { label: "GOLD TODAY", value: `${general.costToday.toFixed(2)}g` },
              { label: "MODEL", value: general.model },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-pixel text-[7px] text-rpg-borderMid">{s.label}</p>
                <p className="font-pixel text-[14px] text-throne-goldLight text-rpg-shadow">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
