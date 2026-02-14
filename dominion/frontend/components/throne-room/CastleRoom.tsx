"use client";

import React, { useState, useCallback, useMemo } from "react";
import RoomRenderer from "./RoomRenderer";
import GeneralInRoom, { GeneralRoomState } from "./GeneralInRoom";
import ActivityPopup from "./ActivityPopup";
import { useRoomActivity, ActivityEvent } from "./RoomActivity";
import { useActivity, RealEvent } from "../../lib/use-activity";
import { SpriteState } from "../sprites";

const STATION_POSITIONS: Record<string, { x: number; y: number }> = {
  throne: { x: 400, y: 220 },
  seer: { x: 100, y: 290 },
  phantom: { x: 690, y: 280 },
  grimoire: { x: 200, y: 240 },
  echo: { x: 610, y: 240 },
  mammon: { x: 130, y: 460 },
  "wraith-eye": { x: 690, y: 470 },
};

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

const CastleRoom: React.FC = () => {
  const [generals, setGenerals] = useState<GeneralRoomState[]>(GENERALS_INIT);
  const [selectedGeneral, setSelectedGeneral] = useState<string | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const activity = useActivity();

  // Transform API events + missions into RealEvent[] for the room activity system
  const realEvents: RealEvent[] = useMemo(() => {
    const mapped: RealEvent[] = [];

    // Map API events
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

    // Map active missions as activity
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

  const selectedGen = selectedGeneral ? generals.find((g) => g.id === selectedGeneral) : null;

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
          {generals.map((g) => (
            <div key={g.id} className="flex items-center gap-1">
              <span className="text-[8px]">{g.emoji}</span>
              <span className="font-pixel text-[5px] capitalize" style={{ color: g.color }}>
                {g.name}
              </span>
              <span className="font-pixel text-[5px] text-rpg-borderMid capitalize">
                {g.currentState}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Room viewport */}
      <div
        className="w-full overflow-auto"
        style={{ maxHeight: "calc(100vh - 120px)", minHeight: 400 }}
      >
        <div style={{ minWidth: 800, maxWidth: 1100, margin: "0 auto", aspectRatio: "900/650" }}>
          <RoomRenderer>
            {generals.map((g) => (
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
        <div className="space-y-1 max-h-[100px] overflow-y-auto">
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
