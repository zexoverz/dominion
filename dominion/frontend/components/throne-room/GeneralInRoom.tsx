"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getGeneralSprite, SpriteState } from "../sprites";

export interface GeneralRoomState {
  id: string;
  name: string;
  emoji: string;
  color: string;
  position: { x: number; y: number };
  targetPosition: { x: number; y: number } | null;
  currentState: SpriteState;
  currentActivity: string;
  stationPosition: { x: number; y: number };
  /** Set externally: "mission" | "idle" | "working" */
  activityStatus?: "mission" | "idle" | "working";
  /** Last speech text (from real events) */
  lastSpeech?: string;
  /** Timestamp when lastSpeech was set */
  lastSpeechAt?: number;
}

interface GeneralInRoomProps {
  general: GeneralRoomState;
  onClick: (id: string) => void;
  spriteSize?: number;
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

const ACTIVITY_ICONS: Record<string, string> = {
  mission: "⚔️",
  idle: "💤",
  working: "", // use general's own emoji
};

const GeneralInRoom: React.FC<GeneralInRoomProps> = ({ general, onClick, spriteSize = 48 }) => {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [bubbleFading, setBubbleFading] = useState(false);

  // Show speech bubble when lastSpeech changes
  useEffect(() => {
    if (!general.lastSpeech || !general.lastSpeechAt) return;
    setBubbleText(truncate(general.lastSpeech, 30));
    setBubbleVisible(true);
    setBubbleFading(false);

    const fadeTimer = setTimeout(() => setBubbleFading(true), 4000);
    const hideTimer = setTimeout(() => {
      setBubbleVisible(false);
      setBubbleFading(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [general.lastSpeech, general.lastSpeechAt]);

  // Determine facing direction based on movement
  const facingLeft =
    general.targetPosition && general.targetPosition.x < general.position.x;

  // Activity indicator
  const activityIcon = useMemo(() => {
    const status = general.activityStatus || "idle";
    if (status === "working") return general.emoji;
    return ACTIVITY_ICONS[status] || "💤";
  }, [general.activityStatus, general.emoji]);

  return (
    <foreignObject
      x={general.position.x - spriteSize / 2}
      y={general.position.y - spriteSize}
      width={spriteSize + 80}
      height={spriteSize + 40}
      style={{ overflow: "visible", cursor: "pointer" }}
      onClick={() => onClick(general.id)}
    >
      <div
        style={{
          position: "relative",
          width: spriteSize,
          height: spriteSize,
        }}
      >
        {/* Activity indicator */}
        <div
          style={{
            position: "absolute",
            bottom: spriteSize + (bubbleVisible ? 28 : 4),
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "12px",
            lineHeight: 1,
            zIndex: 11,
            pointerEvents: "none",
            transition: "bottom 0.3s ease",
            filter: general.activityStatus === "mission" ? "drop-shadow(0 0 3px #ef4444)" : "none",
          }}
        >
          {activityIcon}
        </div>

        {/* Speech bubble */}
        {bubbleVisible && bubbleText && (
          <div
            style={{
              position: "absolute",
              bottom: spriteSize + 4,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1a1028",
              border: "2px solid #8b7355",
              borderRadius: "2px",
              padding: "3px 6px",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "5px",
              color: "#fde68a",
              whiteSpace: "nowrap",
              maxWidth: "140px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              zIndex: 10,
              pointerEvents: "none",
              opacity: bubbleFading ? 0 : 1,
              transition: "opacity 1s ease-out",
            }}
          >
            {bubbleText}
            <div
              style={{
                position: "absolute",
                bottom: -5,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: "5px solid #8b7355",
              }}
            />
          </div>
        )}

        {/* Sprite */}
        <div
          style={{
            transform: facingLeft ? "scaleX(-1)" : "none",
            transition: "transform 0.2s",
          }}
        >
          {getGeneralSprite(general.id, general.currentState, spriteSize)}
        </div>

        {/* Name tag */}
        <div
          style={{
            position: "absolute",
            top: spriteSize + 1,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "5px",
            color: general.color,
            whiteSpace: "nowrap",
            textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
          }}
        >
          {general.emoji} {general.name}
        </div>

        {/* Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: "50%",
            transform: "translateX(-50%)",
            width: spriteSize * 0.6,
            height: 4,
            background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>
    </foreignObject>
  );
};

export default GeneralInRoom;
