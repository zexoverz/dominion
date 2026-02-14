"use client";

import React, { useState, useCallback } from "react";
import RoomRenderer from "./RoomRenderer";
import GeneralInRoom, { GeneralRoomState } from "./GeneralInRoom";
import ActivityPopup from "./ActivityPopup";
import { useRoomActivity, ActivityEvent } from "./RoomActivity";
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

let eventId = 0;

const CastleRoom: React.FC = () => {
  const [generals, setGenerals] = useState<GeneralRoomState[]>(GENERALS_INIT);
  const [selectedGeneral, setSelectedGeneral] = useState<string | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  const addEvent = useCallback((emoji: string, text: string) => {
    setEvents((prev) => {
      const next = [{ id: eventId++, emoji, text, timestamp: Date.now() }, ...prev];
      return next.slice(0, 20);
    });
  }, []);

  useRoomActivity({ generals, setGenerals, addEvent });

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
        <div style={{ minWidth: 800, maxWidth: 1000, margin: "0 auto", aspectRatio: "800/600" }}>
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
        <p className="font-pixel text-[7px] text-rpg-border mb-2">ACTIVITY LOG</p>
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
