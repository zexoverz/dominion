"use client";

import { useState, useEffect } from "react";

export default function SystemPulse({ className = "" }: { className?: string }) {
  const [uptime, setUptime] = useState(0);
  const [beat, setBeat] = useState(false);
  const [ekgFrame, setEkgFrame] = useState(0);

  // EKG pattern: flat, small bump, big spike, dip, recover, flat
  const EKG = [0, 0, 0, 1, 2, 8, -4, 3, 1, 0, 0, 0, 0, 0, 0, 0];

  useEffect(() => {
    const uptimeInterval = setInterval(() => setUptime((u) => u + 1), 1000);
    const ekgInterval = setInterval(() => setEkgFrame((f) => (f + 1) % EKG.length), 150);
    const beatInterval = setInterval(() => {
      setBeat(true);
      setTimeout(() => setBeat(false), 200);
    }, 2400);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(ekgInterval);
      clearInterval(beatInterval);
    };
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Build EKG line from history
  const ekgPoints = Array.from({ length: 16 }, (_, i) => {
    const idx = (ekgFrame - 15 + i + EKG.length * 10) % EKG.length;
    const val = EKG[idx];
    return `${i * 4},${12 - val}`;
  }).join(" ");

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2.5 h-2.5  transition-all duration-100 ${beat ? "bg-throne-green scale-125" : "bg-throne-green/60 scale-100"}`}
        style={{ boxShadow: beat ? "0 0 8px #22c55e, 0 0 16px #22c55e66" : "none" }}
      />
      <svg width="60" height="24" viewBox="0 0 60 24" className="overflow-visible">
        <polyline
          points={ekgPoints}
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          opacity={beat ? 1 : 0.7}
        />
      </svg>
      <div className="flex flex-col">
        <span className={`text-[7px] ${beat ? "text-throne-green" : "text-green-700"} transition-colors`}>
          SYSTEM ONLINE
        </span>
        <span className="text-[7px] text-gray-600 font-mono">{formatUptime(uptime)}</span>
      </div>
    </div>
  );
}
