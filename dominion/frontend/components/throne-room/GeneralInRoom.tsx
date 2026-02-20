"use client";

import React, { useEffect, useState } from "react";
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
}

interface GeneralInRoomProps {
  general: GeneralRoomState;
  onClick: (id: string) => void;
  spriteSize?: number;
}

const GeneralInRoom: React.FC<GeneralInRoomProps> = ({ general, onClick, spriteSize = 48 }) => {
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [lastActivity, setLastActivity] = useState(general.currentActivity);

  useEffect(() => {
    if (general.currentActivity !== lastActivity) {
      setLastActivity(general.currentActivity);
      setBubbleVisible(true);
      const t = setTimeout(() => setBubbleVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [general.currentActivity, lastActivity]);

  // Determine facing direction based on movement
  const facingLeft =
    general.targetPosition && general.targetPosition.x < general.position.x;

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
        {/* Speech bubble */}
        {bubbleVisible && general.currentActivity && (
          <div
            style={{
              position: "absolute",
              bottom: spriteSize + 4,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1a1028",
              border: "2px solid #8b7355",
              padding: "3px 6px",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "5px",
              color: "#fde68a",
              whiteSpace: "nowrap",
              maxWidth: "120px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {general.currentActivity}
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
