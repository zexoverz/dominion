"use client";

import React, { useState, useCallback, useMemo } from "react";
import RoomRenderer from "./RoomRenderer";
import GeneralInRoom, { GeneralRoomState } from "./GeneralInRoom";
import ActivityPopup from "./ActivityPopup";
import { useRoomActivity, ActivityEvent } from "./RoomActivity";
import { useActivity, RealEvent } from "../../lib/use-activity";
import { SpriteState } from "../sprites";

const GENERALS_INIT: GeneralRoomState[] = [
  {
    id: "throne",
    name: "THRONE",
    emoji: "👑",
    color: "#fbbf24",
    position: { x: 400, y: 220 },
    targetPosition: null,
    currentState: "idle" as SpriteState,
    currentActivity: "Surveying the realm",
    stationPosition: { x: 400, y: 220 },
    activityStatus: "idle",
  },
  {
    id: "seer",
    name: "SEER",
    emoji: "🔮",
    color: "#a78bfa",
    position: { x: 100, y: 290 },
    targetPosition: null,
    currentState: "working" as SpriteState,
    currentActivity: "Gazing into the crystal ball",
    stationPosition: { x: 100, y: 290 },
    activityStatus: "working",
  },
  {
    id: "phantom",
    name: "PHANTOM",
    emoji: "👻",
    color: "#94a3b8",
    position: { x: 690, y: 280 },
    targetPosition: null,
    currentState: "working" as SpriteState,
    currentActivity: "Deploying shadow code",
    stationPosition: { x: 690, y: 280 },
    activityStatus: "working",
  },
  {
    id: "grimoire",
    name: "GRIMOIRE",
    emoji: "📜",
    color: "#f97316",
    position: { x: 200, y: 240 },
    targetPosition: null,
    currentState: "thinking" as SpriteState,
    currentActivity: "Reading ancient scrolls",
    stationPosition: { x: 200, y: 240 },
    activityStatus: "working",
  },
  {
    id: "echo",
    name: "ECHO",
    emoji: "🔊",
    color: "#f97316",
    position: { x: 610, y: 240 },
    targetPosition: null,
    currentState: "idle" as SpriteState,
    currentActivity: "Tuning broadcast frequencies",
    stationPosition: { x: 610, y: 240 },
    activityStatus: "idle",
  },
  {
    id: "mammon",
    name: "MAMMON",
    emoji: "💰",
    color: "#fbbf24",
    position: { x: 130, y: 460 },
    targetPosition: null,
    currentState: "working" as SpriteState,
    currentActivity: "Counting treasury gold",
    stationPosition: { x: 130, y: 460 },
    activityStatus: "working",
  },
  {
    id: "wraith-eye",
    name: "WRAITH-EYE",
    emoji: "👁️",
    color: "#ef4444",
    position: { x: 690, y: 470 },
    targetPosition: null,
    currentState: "thinking" as SpriteState,
    currentActivity: "Monitoring the shadows",
    stationPosition: { x: 690, y: 470 },
    activityStatus: "working",
  },
];

const GENERAL_EMOJI: Record<string, string> = {
  THRONE: "👑", SEER: "🔮", PHANTOM: "👻", GRIMOIRE: "📜",
  ECHO: "🔊", MAMMON: "💰", "WRAITH-EYE": "👁️",
};

const KIND_EMOJI: Record<string, string> = {
  mission_completed: "✅", step_completed: "⚙️", trigger_fired: "⚡",
  heartbeat: "💓", cost_alert: "💸", error: "❌",
};

let eventId = 0;

/* ── Event Ticker (marquee) ── */
const EventTicker: React.FC<{ events: ActivityEvent[] }> = React.memo(({ events }) => {
  const tickerEvents = events.slice(0, 3);
  if (tickerEvents.length === 0) return null;

  const tickerText = tickerEvents.map(e => `${e.emoji} ${e.text}`).join("   ⬥   ");

  return (
    <div
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        background: "linear-gradient(90deg, #10102aEE, #1a1028EE, #10102aEE)",
        border: "2px solid #5a4a3a",
        borderLeft: "none",
        borderRight: "none",
        padding: "4px 0",
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: "ticker-scroll 20s linear infinite",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "6px",
          color: "#fde68a",
          paddingLeft: "100%",
        }}
      >
        {tickerText}
      </div>
      <style jsx>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
});
EventTicker.displayName = "EventTicker";

const CastleRoom: React.FC = () => {
  const [generals, setGenerals] = useState<GeneralRoomState[]>(GENERALS_INIT);
  const [selectedGeneral, setSelectedGeneral] = useState<string | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const activity = useActivity();

  // Build a set of generals with active missions
  const activeMissionGenerals = useMemo(() => {
    const s = new Set<string>();
    for (const m of activity.missions) {
      if (m.status === "active" || (m as any).status === "active") {
        const id = ((m as any).agent_id || m.assignedGeneral || "").toUpperCase();
        s.add(id);
      }
    }
    return s;
  }, [activity.missions]);

  // Track recent event timestamps per general for idle detection
  const recentEventGenerals = useMemo(() => {
    const s = new Set<string>();
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    for (const evt of activity.events.slice(0, 30)) {
      const ts = new Date(evt.timestamp || (evt as any).created_at || 0).getTime();
      if (ts > fiveMinAgo) {
        const id = (evt.generalId || (evt as any).agent_id || "").toUpperCase();
        if (id) s.add(id);
      }
    }
    return s;
  }, [activity.events]);

  // Transform API events into RealEvent[] for the room activity system
  const realEvents: RealEvent[] = useMemo(() => {
    const mapped: RealEvent[] = [];

    for (const evt of activity.events.slice(0, 15)) {
      const agentId = evt.generalId || (evt as any).agent_id || "";
      const upperAgent = agentId.toUpperCase();
      mapped.push({
        id: evt.id || `evt-${mapped.length}`,
        type: evt.type || (evt as any).kind || "event",
        generalId: upperAgent,
        emoji: evt.emoji || KIND_EMOJI[(evt as any).kind] || GENERAL_EMOJI[upperAgent] || "⚡",
        message: evt.message || (evt as any).title || "Activity detected",
        timestamp: evt.timestamp || (evt as any).created_at || new Date().toISOString(),
      });
    }

    for (const m of activity.missions) {
      const agentId = ((m as any).agent_id || m.assignedGeneral || "").toUpperCase();
      if ((m as any).status === "active" || m.status === "active") {
        mapped.push({
          id: `mission-${m.id}`,
          type: "mission_active",
          generalId: agentId,
          emoji: "🎯",
          message: `${agentId} working on: ${m.title}`,
          timestamp: (m as any).last_activity_at || (m as any).created_at || new Date().toISOString(),
        });
      }
    }

    return mapped;
  }, [activity.events, activity.missions]);

  const addEvent = useCallback((emoji: string, text: string) => {
    setEvents((prev) => {
      const next = [{ id: eventId++, emoji, text, timestamp: Date.now() }, ...prev];
      return next.slice(0, 20);
    });
  }, []);

  useRoomActivity({ generals, setGenerals, addEvent, realEvents });

  // Derive generals with activity status and speech bubbles
  const enrichedGenerals = useMemo(() => {
    return generals.map((g) => {
      const upperId = g.name.toUpperCase();
      let activityStatus: "mission" | "idle" | "working" = "idle";
      if (activeMissionGenerals.has(upperId)) {
        activityStatus = "mission";
      } else if (recentEventGenerals.has(upperId) || g.currentState === "working" || g.currentState === "thinking") {
        activityStatus = "working";
      }

      // Find latest real event for this general to use as speech
      let lastSpeech = g.lastSpeech;
      let lastSpeechAt = g.lastSpeechAt;
      for (const evt of realEvents) {
        if (evt.generalId === upperId) {
          const ts = new Date(evt.timestamp).getTime();
          if (!lastSpeechAt || ts > lastSpeechAt) {
            lastSpeech = evt.message;
            lastSpeechAt = ts;
          }
          break; // only need the latest
        }
      }

      return { ...g, activityStatus, lastSpeech, lastSpeechAt };
    });
  }, [generals, activeMissionGenerals, recentEventGenerals, realEvents]);

  const selectedGen = selectedGeneral
    ? enrichedGenerals.find((g) => g.id === selectedGeneral)
    : null;

  return (
    <div className="relative w-full h-full min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* Title */}
      <div className="absolute top-3 left-4 z-10">
        <h1
          className="font-pixel text-[12px] text-throne-gold animate-glow"
          style={{ textShadow: "0 0 10px #fbbf2466" }}
        >
          ⚜️ THE THRONE ROOM ⚜️
        </h1>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-4 z-10">
        <div
          className="p-2 space-y-1"
          style={{ background: "#10102aCC", border: "2px solid #5a4a3a" }}
        >
          <p className="font-pixel text-[6px] text-rpg-border mb-1">GENERALS</p>
          {enrichedGenerals.map((g) => (
            <div key={g.id} className="flex items-center gap-1">
              <span className="text-[8px]">{g.emoji}</span>
              <span className="font-pixel text-[5px] capitalize" style={{ color: g.color }}>
                {g.name}
              </span>
              <span className="font-pixel text-[5px] text-rpg-borderMid capitalize">
                {g.currentState}
              </span>
              <span className="text-[6px] ml-auto">
                {g.activityStatus === "mission" ? "⚔️" : g.activityStatus === "idle" ? "💤" : g.emoji}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Room viewport */}
      <div
        className="w-full overflow-auto"
        style={{ maxHeight: "calc(100vh - 140px)", minHeight: 400 }}
      >
        <div style={{ minWidth: 800, maxWidth: 1100, margin: "0 auto", aspectRatio: "900/650" }}>
          <RoomRenderer>
            {enrichedGenerals.map((g) => (
              <GeneralInRoom
                key={g.id}
                general={g}
                onClick={(id) => setSelectedGeneral(id)}
                spriteSize={44}
              />
            ))}
          </RoomRenderer>
        </div>
      </div>

      {/* Event Ticker */}
      <div className="absolute bottom-[110px] left-0 right-0 z-10">
        <EventTicker events={events} />
      </div>

      {/* Activity feed */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          background: "linear-gradient(transparent, #0a0a0fDD 20%, #0a0a0f)",
          padding: "30px 16px 12px",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <p className="font-pixel text-[7px] text-rpg-border">ACTIVITY LOG</p>
          {activity.lastUpdate && (
            <span className="font-pixel text-[5px] text-green-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE — {activity.eventCount} events
            </span>
          )}
          {activity.loading && (
            <span className="font-pixel text-[5px] text-rpg-borderMid">connecting...</span>
          )}
        </div>
        <div className="space-y-1 max-h-[80px] overflow-y-auto">
          {events.slice(0, 5).map((e) => (
            <div key={e.id} className="flex items-center gap-2">
              <span className="text-[10px]">{e.emoji}</span>
              <span className="font-pixel text-[7px] text-rpg-border">{e.text}</span>
              <span className="font-pixel text-[6px] text-rpg-borderMid ml-auto">
                {Math.round((Date.now() - e.timestamp) / 1000)}s ago
              </span>
            </div>
          ))}
          {events.length === 0 && (
            <p className="font-pixel text-[7px] text-rpg-borderMid">The throne room stirs...</p>
          )}
        </div>
      </div>

      {/* Popup */}
      {selectedGen && (
        <ActivityPopup general={selectedGen} onClose={() => setSelectedGeneral(null)} />
      )}
    </div>
  );
};

export default CastleRoom;
