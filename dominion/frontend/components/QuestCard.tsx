"use client";

import { Mission, generals } from "../lib/mock-data";
import PixelProgress from "./PixelProgress";

const priorityColors: Record<string, string> = {
  CRITICAL: "#dc2626",
  HIGH: "#f97316",
  MEDIUM: "#fbbf24",
  LOW: "#22c55e",
};

const statusLabels: Record<string, string> = {
  PROPOSED: "📜 PROPOSED",
  IN_PROGRESS: "⚔️ IN PROGRESS",
  REVIEW: "🔍 REVIEW",
  COMPLETE: "✅ COMPLETE",
};

export default function QuestCard({ mission }: { mission: Mission }) {
  const general = generals.find((g) => g.id === mission.assignedTo);
  const pColor = priorityColors[mission.priority];

  return (
    <div className="quest-scroll p-3 md:p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[9px] md:text-[8px] px-2 py-1 md:py-0.5 font-bold"
            style={{ backgroundColor: pColor + "33", color: pColor }}
          >
            {mission.priority}
          </span>
          <span className="text-[9px] md:text-[8px]">{statusLabels[mission.status]}</span>
        </div>
        <span className="text-lg flex-shrink-0">{general?.emoji}</span>
      </div>

      {/* Title */}
      <h3 className="text-[11px] md:text-[10px] text-throne-gold mb-2">{mission.title}</h3>
      <p className="text-[9px] md:text-[8px] text-gray-400 mb-3">{mission.description}</p>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex justify-between text-[9px] md:text-[8px] text-gray-500 mb-1">
          <span>Progress</span>
          <span>{mission.progress}%</span>
        </div>
        <PixelProgress value={mission.progress} color={pColor} />
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[9px] md:text-[8px] text-gray-600 mt-3 flex-wrap gap-1">
        <span>🎁 {mission.reward}</span>
        <span>{mission.createdAt}</span>
      </div>
    </div>
  );
}
