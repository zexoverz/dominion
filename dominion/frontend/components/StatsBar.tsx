"use client";

import { useState, useEffect } from "react";
import { generals as mockGenerals, missions as mockMissions } from "../lib/mock-data";
import { getGenerals, getMissions, getProposals, getDailyCosts, getEvents } from "../lib/api";

export default function StatsBar() {
  const [stats, setStats] = useState(() => {
    const activeGenerals = mockGenerals.filter((g) => g.status === "ACTIVE").length;
    const costToday = mockGenerals.reduce((sum, g) => sum + g.costToday, 0);
    return {
      generals: activeGenerals,
      totalGenerals: mockGenerals.length,
      missions: mockMissions.length,
      activeMissions: 0,
      completedMissions: 0,
      proposals: mockMissions.filter((m) => m.status === "PROPOSED").length,
      costToday,
      events: 0,
    };
  });

  useEffect(() => {
    Promise.allSettled([
      getGenerals(),
      getMissions(),
      getProposals(),
      getDailyCosts(),
      getEvents(),
    ]).then(([genR, misR, proR, costR, evtR]) => {
      const gens = genR.status === "fulfilled" ? genR.value : [];
      const missions = misR.status === "fulfilled" ? misR.value : [];
      const proposals = proR.status === "fulfilled" ? proR.value : [];
      const dailyCosts = costR.status === "fulfilled" ? costR.value : [];
      const events = evtR.status === "fulfilled" ? evtR.value : [];

      const pending = proposals.filter((p: any) => p.status === "pending");
      const active = missions.filter((m: any) => m.status === "active");
      const completed = missions.filter((m: any) => m.status === "completed");
      const totalCost = dailyCosts.reduce((s: number, c: any) => s + parseFloat(c.cost_usd || "0"), 0);

      setStats({
        generals: gens.length,
        totalGenerals: Math.max(gens.length, 7),
        missions: missions.length,
        activeMissions: active.length,
        completedMissions: completed.length,
        proposals: pending.length,
        costToday: totalCost,
        events: events.length,
      });
    });
  }, []);

  const items = [
    { label: "GENERALS", value: `${stats.generals}/${stats.totalGenerals}`, icon: "🟢", barColor: "#22c55e", barPct: (stats.generals / stats.totalGenerals) * 100 },
    { label: "MISSIONS", value: `${stats.activeMissions}⚔ ${stats.completedMissions}✓`, icon: "⚔️", barColor: "#fbbf24", barPct: (stats.missions / 20) * 100 },
    { label: "PROPOSALS", value: stats.proposals.toString(), icon: "📜", barColor: "#a78bfa", barPct: (stats.proposals / 10) * 100 },
    { label: "GOLD TODAY", value: `${stats.costToday.toFixed(2)}g`, icon: "💰", barColor: "#f97316", barPct: (stats.costToday / 25) * 100 },
    { label: "EVENTS", value: stats.events.toString(), icon: "📡", barColor: "#38bdf8", barPct: (stats.events / 50) * 100 },
  ];

  return (
    <div className="flex gap-3 md:gap-4 mb-6 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
      {items.map((s) => (
        <div key={s.label} className="rpg-panel px-3 md:px-4 py-3 min-w-[150px] md:min-w-0 flex-shrink-0 md:flex-shrink">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">{s.icon}</span>
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">{s.label}</p>
              <p className="text-[12px] font-pixel text-throne-goldLight text-rpg-shadow">{s.value}</p>
            </div>
          </div>
          <div className="hp-bar h-2">
            <div
              className="hp-bar-fill h-full"
              style={{ width: `${Math.min(s.barPct, 100)}%`, backgroundColor: s.barColor }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
