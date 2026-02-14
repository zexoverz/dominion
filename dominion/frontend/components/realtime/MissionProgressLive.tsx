"use client";

import { useState, useEffect } from "react";

const STEPS = ["Analyzing...", "Planning...", "Executing...", "Reviewing...", "Optimizing...", "Deploying..."];

interface Props {
  className?: string;
  missionName?: string;
  initialProgress?: number;
  color?: string;
}

export default function MissionProgressLive({
  className = "",
  missionName = "Shadow Protocol Alpha",
  initialProgress = 0,
  color = "#fbbf24",
}: Props) {
  const [progress, setProgress] = useState(initialProgress);
  const [stepIdx, setStepIdx] = useState(0);
  const [sparks, setSparks] = useState<number[]>([]);
  const totalBlocks = 20;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.random() * 2 + 0.5);
        // Spark at milestones
        if (Math.floor(next / 25) > Math.floor(p / 25)) {
          setSparks((s) => [...s, Date.now()]);
          setTimeout(() => setSparks((s) => s.slice(1)), 1000);
        }
        if (next >= 100) {
          setTimeout(() => setProgress(0), 3000);
          return 100;
        }
        return next;
      });
    }, 400);

    const stepInterval = setInterval(() => setStepIdx((i) => (i + 1) % STEPS.length), 2000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className={`rpg-panel p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[8px] font-pixel text-throne-gold text-rpg-shadow">⚔️ {missionName}</span>
        <span className="text-[9px] font-bold" style={{ color }}>{Math.floor(progress)}%</span>
      </div>

      {/* Pixel progress bar */}
      <div className="flex gap-px mb-2 relative">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div
            key={i}
            className="h-3 flex-1 transition-colors duration-300"
            style={{
              backgroundColor: i < filledBlocks ? color : "#1a1028",
              boxShadow: i === filledBlocks - 1 && filledBlocks > 0 ? `0 0 8px ${color}` : "none",
            }}
          />
        ))}
        {/* Sparks */}
        {sparks.map((id) => (
          <div key={id} className="absolute inset-0 pointer-events-none" style={{ animation: "sparkBurst 1s ease-out forwards" }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1"
                style={{
                  background: color,
                  left: `${filledBlocks * (100 / totalBlocks)}%`,
                  top: "50%",
                  animation: `spark${i} 0.8s ease-out forwards`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[7px] text-gray-500">{progress >= 100 ? "✨ COMPLETE!" : STEPS[stepIdx]}</span>
        <span className="text-[7px] text-gray-600">{filledBlocks}/{totalBlocks} blocks</span>
      </div>

      <style jsx>{`
        @keyframes spark0 { to { transform: translate(8px, -12px); opacity: 0; } }
        @keyframes spark1 { to { transform: translate(-6px, -10px); opacity: 0; } }
        @keyframes spark2 { to { transform: translate(12px, 8px); opacity: 0; } }
        @keyframes spark3 { to { transform: translate(-10px, 6px); opacity: 0; } }
        @keyframes spark4 { to { transform: translate(4px, -14px); opacity: 0; } }
        @keyframes spark5 { to { transform: translate(-8px, -8px); opacity: 0; } }
      `}</style>
    </div>
  );
}
