"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getEvents } from "../../lib/api";

interface ActivityEntry {
  id: string;
  emoji: string;
  name: string;
  color: string;
  text: string;
  timestamp: string;
  displayedChars: number;
  fullText: string;
}

const AGENT_META: Record<string, { emoji: string; color: string }> = {
  throne: { emoji: "👑", color: "#fbbf24" },
  seer:   { emoji: "🔮", color: "#a78bfa" },
  phantom:{ emoji: "👻", color: "#94a3b8" },
  warden: { emoji: "🛡️", color: "#60a5fa" },
  herald: { emoji: "📯", color: "#f97316" },
  forge:  { emoji: "⚒️", color: "#ef4444" },
  cipher: { emoji: "🗝️", color: "#22d3ee" },
  grimoire:{ emoji: "📖", color: "#10b981" },
  echo:   { emoji: "🔊", color: "#f472b6" },
  mammon: { emoji: "💰", color: "#eab308" },
  "wraith-eye": { emoji: "👁️", color: "#8b5cf6" },
};

function formatTime(ts: string) {
  try {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  } catch {
    return "00:00:00";
  }
}

export default function AgentActivityFeed({ className = "" }: { className?: string }) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const fetchAndSet = useCallback(async () => {
    try {
      const data = await getEvents();
      if (!Array.isArray(data) || data.length === 0) return;

      const mapped: ActivityEntry[] = data.slice(0, 30).map((e: any) => {
        const agentId = (e.agent_id || e.agentId || "throne").toLowerCase();
        const meta = AGENT_META[agentId] || { emoji: "❓", color: "#888" };
        const text = e.title || e.description || e.summary || "Activity logged";
        return {
          id: e.id || Math.random().toString(),
          emoji: meta.emoji,
          name: agentId.toUpperCase(),
          color: meta.color,
          text,
          timestamp: formatTime(e.created_at || e.timestamp || ""),
          displayedChars: text.length, // show full text for past events
          fullText: text,
        };
      });

      setEntries(mapped);
      setLoaded(true);
    } catch {
      // keep existing entries
    }
  }, []);

  // Initial fetch + poll every 15s
  useEffect(() => {
    fetchAndSet();
    const iv = setInterval(fetchAndSet, 15000);
    return () => clearInterval(iv);
  }, [fetchAndSet]);

  // Auto-scroll on new entries
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className={`rpg-panel p-3 flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-throne-green animate-pulse" />
        <h3 className="text-[9px] text-throne-gold">⚡ LIVE INTEL FEED</h3>
        {loaded && (
          <span className="text-[7px] text-rpg-borderMid ml-auto">{entries.length} events</span>
        )}
      </div>
      <div ref={feedRef} className="flex-1 overflow-y-auto space-y-2 max-h-[300px] scrollbar-thin">
        {entries.length === 0 && (
          <p className="text-[8px] text-rpg-borderMid italic text-center py-4">Awaiting intel...</p>
        )}
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className="flex gap-2 items-start"
            style={{
              animation: i >= entries.length - 3 ? "fadeIn 0.4s ease-out forwards" : undefined,
              opacity: i >= entries.length - 3 ? undefined : 1,
            }}
          >
            <span className="text-[8px] text-gray-600 mt-0.5 shrink-0 font-mono">{entry.timestamp}</span>
            <span className="text-sm shrink-0">{entry.emoji}</span>
            <div className="min-w-0">
              <span className="text-[8px] font-bold mr-1" style={{ color: entry.color }}>
                {entry.name}
              </span>
              <span className="text-[8px] text-gray-400">{entry.text}</span>
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
