"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const AdminPage = dynamic(() => import("../admin/page"), { ssr: false });
const MissionsPage = dynamic(() => import("../missions/page"), { ssr: false });
const RoundtablePage = dynamic(() => import("../roundtable/page"), { ssr: false });
const ReportsPage = dynamic(() => import("../reports/page"), { ssr: false });

const TABS = [
  { id: "command", label: "⚔️ COMMAND", desc: "Issue orders" },
  { id: "missions", label: "🗡️ MISSIONS", desc: "Active quests" },
  { id: "roundtable", label: "🏰 ROUNDTABLE", desc: "General debates" },
  { id: "intel", label: "📜 INTEL", desc: "Reports feed" },
];

export default function CommandPage() {
  const [tab, setTab] = useState("command");

  return (
    <div className="max-w-full overflow-hidden">
      {/* Tab Bar */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rpg-panel px-3 py-2 font-pixel text-[8px] whitespace-nowrap transition-none min-h-[40px] ${
              tab === t.id
                ? "text-throne-gold border-throne-gold bg-throne-gold/10"
                : "text-rpg-borderMid hover:text-rpg-border"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "command" && <AdminPage />}
      {tab === "missions" && <MissionsPage />}
      {tab === "roundtable" && <RoundtablePage />}
      {tab === "intel" && <ReportsPage />}
    </div>
  );
}
