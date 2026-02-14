"use client";

import { generals, missions } from "../lib/mock-data";

export default function StatsBar() {
  const totalMissions = missions.length;
  const activeProposals = missions.filter((m) => m.status === "PROPOSED").length;
  const costToday = generals.reduce((sum, g) => sum + g.costToday, 0);
  const activeGenerals = generals.filter((g) => g.status === "ACTIVE").length;

  const stats = [
    { label: "MISSIONS", value: totalMissions.toString(), icon: "⚔️", barColor: "#fbbf24", barPct: (totalMissions / 20) * 100 },
    { label: "PROPOSALS", value: activeProposals.toString(), icon: "📜", barColor: "#a78bfa", barPct: (activeProposals / 10) * 100 },
    { label: "GOLD TODAY", value: `${costToday.toFixed(2)}g`, icon: "💰", barColor: "#f97316", barPct: (costToday / 25) * 100 },
    { label: "GENERALS", value: `${activeGenerals}/7`, icon: "🟢", barColor: "#22c55e", barPct: (activeGenerals / 7) * 100 },
  ];

  return (
    <div className="flex gap-3 md:gap-4 mb-6 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
      {stats.map((s) => (
        <div key={s.label} className="rpg-panel px-3 md:px-4 py-3 min-w-[150px] md:min-w-0 flex-shrink-0 md:flex-shrink">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">{s.icon}</span>
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">{s.label}</p>
              <p className="text-[12px] font-pixel text-throne-goldLight text-rpg-shadow">{s.value}</p>
            </div>
          </div>
          {/* Mini HP-style bar */}
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
