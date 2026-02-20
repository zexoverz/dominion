"use client";

import { useState, useEffect } from "react";
import { missions as mockMissions } from "../../lib/mock-data";
import { getMissions } from "../../lib/api";
import QuestCard from "../../components/QuestCard";

export default function MissionsPage() {
  const [missions, setMissions] = useState(mockMissions);

  useEffect(() => {
    getMissions().then(setMissions).catch(() => {});
  }, []);

  const grouped = {
    IN_PROGRESS: missions.filter((m) => m.status === "IN_PROGRESS"),
    REVIEW: missions.filter((m) => m.status === "REVIEW"),
    PROPOSED: missions.filter((m) => m.status === "PROPOSED"),
    COMPLETE: missions.filter((m) => m.status === "COMPLETE"),
  };

  return (
    <div className="max-w-full overflow-hidden">
      <div className="rpg-panel mb-6 text-center py-4">
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-2">⚔️ MISSION BOARD ⚔️</h1>
        <p className="text-[9px] font-body text-rpg-border">Active quests and campaigns of the Dominion.</p>
      </div>

      {Object.entries(grouped).map(([status, items]) => (
        items.length > 0 && (
          <div key={status} className="mb-6 md:mb-8">
            <h2 className="font-pixel text-[9px] text-rpg-border mb-4 pb-2 text-rpg-shadow"
              style={{ borderBottom: '2px solid #5a4a3a' }}>
              {status.replace("_", " ")} ({items.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              {items.map((m) => (
                <QuestCard key={m.id} mission={m} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
