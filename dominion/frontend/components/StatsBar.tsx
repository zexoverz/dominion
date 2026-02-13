"use client";

import { generals, missions } from "../lib/mock-data";

export default function StatsBar() {
  const totalMissions = missions.length;
  const activeProposals = missions.filter((m) => m.status === "PROPOSED").length;
  const costToday = generals.reduce((sum, g) => sum + g.costToday, 0);
  const activeGenerals = generals.filter((g) => g.status === "ACTIVE").length;

  const stats = [
    { label: "MISSIONS", value: totalMissions.toString(), icon: "⚔️" },
    { label: "PROPOSALS", value: activeProposals.toString(), icon: "📜" },
    { label: "COST TODAY", value: `$${costToday.toFixed(2)}`, icon: "💰" },
    { label: "ACTIVE", value: `${activeGenerals}/7`, icon: "🟢" },
  ];

  return (
    <div className="flex gap-3 md:gap-4 mb-6 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
      {stats.map((s) => (
        <div key={s.label} className="pixel-border-thin bg-throne-dark px-3 md:px-4 py-3 flex items-center gap-3 min-w-[140px] md:min-w-0 flex-shrink-0 md:flex-shrink">
          <span className="text-lg">{s.icon}</span>
          <div>
            <p className="text-[8px] md:text-[9px] text-gray-500">{s.label}</p>
            <p className="text-[11px] md:text-[12px] text-throne-goldLight">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
