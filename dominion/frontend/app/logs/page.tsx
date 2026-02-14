"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getEvents } from "../../lib/api";
import { generals as mockGenerals } from "../../lib/mock-data";

const AGENTS = [
  { id: "ALL", label: "ALL AGENTS", emoji: "📜" },
  { id: "throne", label: "THRONE", emoji: "👑" },
  { id: "seer", label: "SEER", emoji: "🔮" },
  { id: "phantom", label: "PHANTOM", emoji: "👻" },
  { id: "warden", label: "WARDEN", emoji: "🛡️" },
  { id: "herald", label: "HERALD", emoji: "📯" },
  { id: "forge", label: "FORGE", emoji: "⚒️" },
  { id: "cipher", label: "CIPHER", emoji: "🗝️" },
];

const EVENT_TYPES = ["ALL", "mission", "proposal", "cost", "system", "roundtable", "alert"];
const PAGE_SIZE = 50;

// Mock events for when API is unavailable
const MOCK_EVENTS = [
  { id: "e1", agentId: "throne", type: "system", description: "Phase 1 deployment initiated", timestamp: "2026-02-13T19:00:00Z" },
  { id: "e2", agentId: "seer", type: "mission", description: "Market analysis pipeline started — scanning 12 sectors", timestamp: "2026-02-13T18:45:00Z" },
  { id: "e3", agentId: "phantom", type: "mission", description: "Shadow Protocol Alpha submitted for review", timestamp: "2026-02-13T18:30:00Z" },
  { id: "e4", agentId: "throne", type: "proposal", description: "Approved: Deploy the Watchtower infrastructure", timestamp: "2026-02-13T18:15:00Z" },
  { id: "e5", agentId: "warden", type: "alert", description: "Budget threshold warning — 60% daily budget consumed", timestamp: "2026-02-13T18:00:00Z" },
  { id: "e6", agentId: "phantom", type: "cost", description: "Task execution: $1.87 spent on Shadow Protocol", timestamp: "2026-02-13T17:30:00Z" },
  { id: "e7", agentId: "seer", type: "roundtable", description: "Proposed investigation of sector 7 anomaly", timestamp: "2026-02-13T17:00:00Z" },
  { id: "e8", agentId: "herald", type: "system", description: "Communication relay standing by — awaiting activation", timestamp: "2026-02-13T16:00:00Z" },
  { id: "e9", agentId: "throne", type: "mission", description: "Assigned Throne Room UI build — priority CRITICAL", timestamp: "2026-02-13T15:00:00Z" },
  { id: "e10", agentId: "seer", type: "cost", description: "Oracle Vision pipeline: $3.18 daily spend", timestamp: "2026-02-13T14:00:00Z" },
  { id: "e11", agentId: "phantom", type: "mission", description: "Decoded Ancient Scrolls — mission COMPLETE (+50 XP)", timestamp: "2026-02-10T12:00:00Z" },
  { id: "e12", agentId: "throne", type: "system", description: "The Dominion awakens. All systems initialized.", timestamp: "2026-02-10T08:00:00Z" },
];

function formatTimestamp(ts: string) {
  try {
    const d = new Date(ts);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return ts;
  }
}

function eventTypeColor(type: string) {
  switch (type) {
    case "mission": return "text-throne-gold";
    case "proposal": return "text-seer-blue";
    case "cost": return "text-green-400";
    case "alert": return "text-red-400";
    case "system": return "text-rpg-border";
    case "roundtable": return "text-orange-400";
    default: return "text-rpg-borderMid";
  }
}

function eventTypeIcon(type: string) {
  switch (type) {
    case "mission": return "⚔️";
    case "proposal": return "📋";
    case "cost": return "💰";
    case "alert": return "🚨";
    case "system": return "⚙️";
    case "roundtable": return "🏰";
    default: return "📌";
  }
}

export default function LogsPage() {
  const [events, setEvents] = useState<any[]>(MOCK_EVENTS);
  const [agentFilter, setAgentFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      if (data && data.length > 0) setEvents(data);
    } catch { /* keep mock */ }
  }, []);

  useEffect(() => {
    fetchEvents();
    timerRef.current = setInterval(fetchEvents, 10000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchEvents]);

  const filtered = events.filter((e) => {
    if (agentFilter !== "ALL" && e.agentId !== agentFilter) return false;
    if (typeFilter !== "ALL" && e.type !== typeFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const getAgent = (id: string) => AGENTS.find((a) => a.id === id) || { emoji: "❓", label: id?.toUpperCase() || "UNKNOWN" };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Title */}
      <div className="rpg-panel mb-6 text-center py-4">
        <p className="font-pixel text-[8px] text-rpg-borderMid tracking-widest mb-1">— THE DOMINION —</p>
        <h1 className="font-pixel text-[16px] md:text-[20px] text-throne-gold text-glow-gold chapter-title">
          📜 QUEST LOG
        </h1>
        <p className="font-pixel text-[8px] text-rpg-border mt-2">A chronicle of all that has transpired.</p>
        <p className="font-pixel text-[7px] text-rpg-borderMid mt-1 animate-pulse">● Auto-refreshing every 10s</p>
      </div>

      {/* Filters */}
      <div className="rpg-panel mb-4 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="font-pixel text-[8px] text-rpg-borderMid block mb-1">AGENT</label>
            <select
              value={agentFilter}
              onChange={(e) => { setAgentFilter(e.target.value); setPage(0); }}
              className="bg-rpg-panelDark text-rpg-border font-pixel text-[9px] border-2 border-rpg-borderMid px-2 py-1 outline-none focus:border-throne-gold"
            >
              {AGENTS.map((a) => (
                <option key={a.id} value={a.id}>{a.emoji} {a.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-pixel text-[8px] text-rpg-borderMid block mb-1">TYPE</label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
              className="bg-rpg-panelDark text-rpg-border font-pixel text-[9px] border-2 border-rpg-borderMid px-2 py-1 outline-none focus:border-throne-gold"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t === "ALL" ? "📜 ALL TYPES" : `${eventTypeIcon(t)} ${t.toUpperCase()}`}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto font-pixel text-[8px] text-rpg-borderMid">
            {filtered.length} entries
          </div>
        </div>
      </div>

      {/* Event List */}
      <div className="rpg-panel p-4">
        {paginated.length === 0 ? (
          <p className="font-pixel text-[9px] text-rpg-borderMid text-center py-8">The chronicles are empty...</p>
        ) : (
          <div className="flex flex-col gap-1">
            {paginated.map((ev, i) => {
              const agent = getAgent(ev.agentId);
              return (
                <div
                  key={ev.id || i}
                  className="flex items-start gap-3 px-2 py-2 hover:bg-rpg-borderDark/20 border-b border-rpg-borderDark/30 last:border-b-0"
                >
                  <span className="font-pixel text-[7px] text-rpg-borderMid whitespace-nowrap min-w-[90px]">
                    {formatTimestamp(ev.timestamp)}
                  </span>
                  <span className="text-sm min-w-[20px]">{agent.emoji}</span>
                  <span className="font-pixel text-[8px] text-rpg-border min-w-[60px]">{agent.label}</span>
                  <span className={`font-pixel text-[7px] min-w-[60px] ${eventTypeColor(ev.type)}`}>
                    {eventTypeIcon(ev.type)} {ev.type?.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-rpg-border font-body flex-1">{ev.description}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-rpg-borderDark/30">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="font-pixel text-[8px] text-throne-gold disabled:text-rpg-borderMid disabled:cursor-default cursor-pointer px-2 py-1 border border-rpg-borderMid hover:border-throne-gold disabled:hover:border-rpg-borderMid"
            >
              ◀ PREV
            </button>
            <span className="font-pixel text-[8px] text-rpg-border">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="font-pixel text-[8px] text-throne-gold disabled:text-rpg-borderMid disabled:cursor-default cursor-pointer px-2 py-1 border border-rpg-borderMid hover:border-throne-gold disabled:hover:border-rpg-borderMid"
            >
              NEXT ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
