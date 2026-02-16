"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMission } from "../../../lib/api";

interface Step {
  id: string;
  title: string;
  kind: string;
  status: string;
  step_order: number;
  description?: string;
  output_data?: { instructions?: string };
  input_data?: { instructions?: string };
}

interface MissionDetail {
  id: string;
  title: string;
  description: string;
  agent_id: string;
  status: string;
  priority: number;
  progress_pct: number;
  created_at: string;
  steps: Step[];
}

interface ExpandedSteps {
  [key: string]: boolean;
}

const statusIcon: Record<string, string> = {
  pending: "⬜",
  running: "🔶",
  completed: "✅",
  failed: "❌",
  skipped: "⏭️",
};

const kindIcon: Record<string, string> = {
  research: "📖",
  write_content: "✍️",
  code_review: "💻",
  execute_command: "⚡",
  deploy: "🚀",
  test: "🧪",
  analyze: "🔍",
  notify: "📢",
  monitor: "👁️",
};

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<ExpandedSteps>({});

  useEffect(() => {
    if (params.id) {
      getMission(params.id as string)
        .then((d) => setMission(d))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="font-pixel text-[10px] text-rpg-border animate-pulse">Loading quest data...</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="font-pixel text-[10px] text-rpg-border">Quest not found.</p>
        <button onClick={() => router.push("/missions")} className="rpg-btn text-[9px]">← Back to Board</button>
      </div>
    );
  }

  const completedSteps = mission.steps.filter((s) => s.status === "completed").length;
  const totalSteps = mission.steps.length;
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : mission.progress_pct;

  return (
    <div className="max-w-2xl mx-auto px-2">
      {/* Back button */}
      <button
        onClick={() => router.push("/missions")}
        className="font-pixel text-[9px] text-throne-gold mb-4 hover:text-throne-goldLight active:scale-95 transition-transform"
      >
        ← MISSION BOARD
      </button>

      {/* Mission Header */}
      <div className="rpg-panel p-4 mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="text-[8px] font-pixel px-2 py-0.5 bg-throne-gold/20 text-throne-gold border border-throne-gold/40">
            {mission.agent_id}
          </span>
          <span className={`text-[8px] font-pixel px-2 py-0.5 ${
            mission.status === "active" ? "bg-green-900/30 text-green-400 border border-green-700/40" :
            mission.status === "completed" ? "bg-blue-900/30 text-blue-400 border border-blue-700/40" :
            "bg-yellow-900/30 text-yellow-400 border border-yellow-700/40"
          }`}>
            {mission.status === "active" ? "⚔️ ACTIVE" : mission.status === "completed" ? "✅ COMPLETE" : "📜 " + mission.status.toUpperCase()}
          </span>
        </div>
        <h1 className="font-pixel text-[12px] text-throne-gold text-glow-gold mb-2 leading-snug">{mission.title}</h1>
        <p className="text-[9px] font-body text-rpg-border leading-relaxed">{mission.description}</p>

        {/* Progress */}
        <div className="mt-4 border border-rpg-borderDark p-2 bg-rpg-bg/50">
          <div className="flex justify-between text-[8px] font-pixel text-rpg-borderMid mb-1">
            <span>QUEST PROGRESS</span>
            <span className="text-throne-goldLight">{completedSteps}/{totalSteps} steps — {progressPct}%</span>
          </div>
          <div className="w-full h-3 bg-rpg-borderDark border border-rpg-borderDark">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: progressPct === 100
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : "linear-gradient(90deg, #d4a842, #b8942e)",
                imageRendering: "pixelated",
              }}
            />
          </div>
        </div>

        <div className="mt-2 text-[8px] font-body text-rpg-borderMid">
          Created: {new Date(mission.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Steps */}
      <div className="rpg-panel p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4">📋 QUEST STEPS</h2>
        <div className="space-y-1">
          {mission.steps
            .sort((a, b) => a.step_order - b.step_order)
            .map((step, i) => (
              <div
                key={step.id}
                className={`border transition-colors ${
                  step.status === "completed"
                    ? "border-green-800/40 bg-green-950/20"
                    : step.status === "running"
                    ? "border-yellow-800/40 bg-yellow-950/20"
                    : "border-rpg-borderDark/60 bg-rpg-bg/30"
                }`}
              >
                <div
                  className="flex items-start gap-3 p-3 cursor-pointer active:bg-rpg-borderDark/20"
                  onClick={() => {
                    const instr = step.output_data?.instructions || step.input_data?.instructions;
                    if (instr) setExpanded((prev) => ({ ...prev, [step.id]: !prev[step.id] }));
                  }}
                >
                  <span className="text-[14px] flex-shrink-0 mt-0.5">{statusIcon[step.status] || "⬜"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[8px] font-pixel text-rpg-borderMid">#{i + 1}</span>
                      <span className="text-[7px] font-pixel px-1.5 py-0.5 bg-rpg-borderDark/30 text-rpg-borderMid border border-rpg-borderDark/50">
                        {kindIcon[step.kind] || "📌"} {step.kind.replace("_", " ").toUpperCase()}
                      </span>
                      {(step.output_data?.instructions || step.input_data?.instructions) && (
                        <span className="text-[7px] font-pixel text-throne-gold">
                          {expanded[step.id] ? "▼ HIDE" : "▶ DETAILS"}
                        </span>
                      )}
                    </div>
                    <p className={`text-[9px] font-body mt-1 leading-relaxed ${
                      step.status === "completed" ? "text-green-400/80 line-through" : "text-rpg-border"
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {expanded[step.id] && (step.output_data?.instructions || step.input_data?.instructions) && (
                  <div className="px-4 pb-3 pt-0 ml-8 border-t border-rpg-borderDark/40">
                    <pre className="text-[8px] font-body text-rpg-border leading-relaxed whitespace-pre-wrap mt-2">
                      {step.output_data?.instructions || step.input_data?.instructions}
                    </pre>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
