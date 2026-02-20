"use client";

import { Mission, generals } from "../lib/mock-data";
import PixelProgress from "./PixelProgress";

const priorityStars: Record<string, number> = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
};

const priorityColors: Record<string, string> = {
  CRITICAL: "#dc2626",
  HIGH: "#f97316",
  MEDIUM: "#fbbf24",
  LOW: "#22c55e",
};

const statusLabels: Record<string, string> = {
  PROPOSED: "📜 PROPOSED",
  IN_PROGRESS: "⚔️ ACTIVE",
  REVIEW: "🔍 REVIEW",
  COMPLETE: "✅ COMPLETE",
};

export default function QuestCard({ mission }: { mission: Mission }) {
  const general = generals.find((g) => g.id === mission.assignedTo);
  const pColor = priorityColors[mission.priority];
  const stars = priorityStars[mission.priority] || 1;

  return (
    <div className="quest-scroll p-4 mb-4">
      {/* Quest Header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Difficulty Stars */}
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-[10px] ${i < stars ? 'star-filled' : 'star-empty'}`}>★</span>
            ))}
          </div>
          <span
            className="text-[8px] font-pixel px-2 py-0.5"
            style={{ backgroundColor: pColor + '22', color: pColor, border: `1px solid ${pColor}44` }}
          >
            {mission.priority}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-body text-rpg-border">{statusLabels[mission.status]}</span>
          <span className="text-lg flex-shrink-0">{general?.emoji}</span>
        </div>
      </div>

      {/* Quest Title */}
      <h3 className="font-pixel text-[10px] text-throne-gold text-rpg-shadow mb-2">{mission.title}</h3>
      <p className="text-[9px] font-body text-rpg-border mb-3 leading-relaxed">{mission.description}</p>

      {/* Progress Bar — EXP style */}
      <div className="mb-3 border border-rpg-borderDark p-2 bg-rpg-bg/50">
        <div className="flex justify-between text-[8px] font-pixel text-rpg-borderMid mb-1">
          <span>PROGRESS</span>
          <span className="text-throne-goldLight">{mission.progress}%</span>
        </div>
        <PixelProgress value={mission.progress} color={pColor} />
      </div>

      {/* Reward Section */}
      <div className="flex justify-between items-center border-t-2 border-rpg-borderDark pt-2 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-pixel text-throne-gold">🎁 REWARD:</span>
          <span className="text-[9px] font-body text-throne-goldLight">{mission.reward}</span>
        </div>
        <span className="text-[8px] font-body text-rpg-borderMid">{mission.createdAt}</span>
      </div>
    </div>
  );
}
