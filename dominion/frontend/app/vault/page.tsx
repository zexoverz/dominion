"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PortfolioOverview = dynamic(() => import("../portfolio/page"), { ssr: false });
const Collectibles = dynamic(() => import("../portfolio/collectibles/page"), { ssr: false });
const Ledger = dynamic(() => import("../portfolio/ledger/page"), { ssr: false });
const Masterplan = dynamic(() => import("../portfolio/masterplan/page"), { ssr: false });

const TABS = [
  { id: "overview", label: "📊 OVERVIEW", icon: "📊" },
  { id: "collectibles", label: "🃏 CARDS", icon: "🃏" },
  { id: "ledger", label: "📒 LEDGER", icon: "📒" },
  { id: "masterplan", label: "📜 MASTERPLAN", icon: "📜" },
];

export default function VaultPage() {
  const [tab, setTab] = useState("overview");

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

      {/* Tab Content */}
      {tab === "overview" && <PortfolioOverview />}
      {tab === "collectibles" && <Collectibles />}
      {tab === "ledger" && <Ledger />}
      {tab === "masterplan" && <Masterplan />}
    </div>
  );
}
