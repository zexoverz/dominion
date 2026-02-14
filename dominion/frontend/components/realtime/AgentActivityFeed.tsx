"use client";

import { useState, useEffect, useRef } from "react";

interface ActivityEntry {
  id: number;
  emoji: string;
  name: string;
  color: string;
  text: string;
  timestamp: string;
  displayedChars: number;
  fullText: string;
}

const ACTIVITIES = [
  { emoji: "👑", name: "THRONE", color: "#fbbf24", texts: [
    "Analyzing proposal #12 — resource allocation for Phase 2...",
    "Reviewing PHANTOM's deployment report...",
    "Calculating optimal general activation sequence...",
    "Drafting strategic directive for SEER...",
    "Evaluating mission priority queue...",
    "Orchestrating cross-general sync protocol...",
  ]},
  { emoji: "🔮", name: "SEER", color: "#a78bfa", texts: [
    "Running deep market sentiment scan...",
    "Processing 4,217 data points from sector 7...",
    "Correlating pattern anomalies in trading volume...",
    "Generating prophetic insight report v2.3...",
    "Analyzing competitor API response patterns...",
    "Forecasting resource consumption for next 72h...",
  ]},
  { emoji: "👻", name: "PHANTOM", color: "#94a3b8", texts: [
    "Deploying shadow service to edge node...",
    "Writing migration script for database v3...",
    "Executing stealth code review on PR #47...",
    "Running zero-downtime deployment sequence...",
    "Patching security vulnerability in auth module...",
    "Compiling TypeScript build — 0 errors...",
  ]},
  { emoji: "🛡️", name: "WARDEN", color: "#60a5fa", texts: [
    "Scanning system health metrics...",
    "Validating cost guard thresholds...",
    "Monitoring rate limits across all endpoints...",
  ]},
  { emoji: "📯", name: "HERALD", color: "#f97316", texts: [
    "Drafting Phase 1 completion summary...",
    "Formatting intelligence briefing for Lord Zexo...",
    "Composing cross-general status report...",
  ]},
];

export default function AgentActivityFeed({ className = "" }: { className?: string }) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [nextId, setNextId] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  // Add new entries periodically
  useEffect(() => {
    const addEntry = () => {
      const agent = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      const text = agent.texts[Math.floor(Math.random() * agent.texts.length)];
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      setNextId((prev) => {
        const id = prev;
        setEntries((old) => {
          const newEntries = [...old, {
            id,
            emoji: agent.emoji,
            name: agent.name,
            color: agent.color,
            text: "",
            timestamp,
            displayedChars: 0,
            fullText: text,
          }];
          return newEntries.slice(-20); // keep last 20
        });
        return prev + 1;
      });
    };

    addEntry(); // initial
    const interval = setInterval(addEntry, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setEntries((old) =>
        old.map((e) =>
          e.displayedChars < e.fullText.length
            ? { ...e, displayedChars: e.displayedChars + 2, text: e.fullText.slice(0, e.displayedChars + 2) }
            : e
        )
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className={`rpg-panel p-3 flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-throne-green  animate-pulse" />
        <h3 className="text-[9px] text-throne-gold">⚡ LIVE ACTIVITY FEED</h3>
      </div>
      <div ref={feedRef} className="flex-1 overflow-y-auto space-y-2 max-h-[300px] scrollbar-thin">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className="flex gap-2 items-start opacity-0 animate-fadeIn"
            style={{
              animation: "fadeIn 0.4s ease-out forwards",
              animationDelay: `${i === entries.length - 1 ? 0.1 : 0}s`,
            }}
          >
            <span className="text-[8px] text-gray-600 mt-0.5 shrink-0 font-mono">{entry.timestamp}</span>
            <span className="text-sm shrink-0">{entry.emoji}</span>
            <div className="min-w-0">
              <span className="text-[8px] font-bold mr-1" style={{ color: entry.color }}>
                {entry.name}
              </span>
              <span className="text-[8px] text-gray-400">
                {entry.text}
                {entry.displayedChars < entry.fullText.length && (
                  <span className="inline-block w-1.5 h-2.5 bg-throne-gold ml-0.5 animate-blink" />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
