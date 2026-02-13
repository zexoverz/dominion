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
    <div className="flex gap-4 mb-6 flex-wrap">
      {stats.map((s) => (
        <div key={s.label} className="pixel-border-thin bg-throne-dark px-4 py-3 flex items-center gap-3">
          <span className="text-lg">{s.icon}</span>
          <div>
            <p className="text-[7px] text-gray-500">{s.label}</p>
            <p className="text-[11px] text-throne-goldLight">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
