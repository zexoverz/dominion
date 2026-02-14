"use client";

import React from "react";
import { GeneralRoomState } from "./GeneralInRoom";
import { getGeneralSprite } from "../sprites";
import Link from "next/link";

interface ActivityPopupProps {
  general: GeneralRoomState;
  onClose: () => void;
}

const ActivityPopup: React.FC<ActivityPopupProps> = ({ general, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="rpg-panel p-0"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: "3px solid #8b7355",
          background: "#10102a",
          minWidth: 280,
          maxWidth: 340,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "2px solid #5a4a3a", background: "#1a1028" }}
        >
          <span className="font-pixel text-[10px]" style={{ color: general.color }}>
            {general.emoji} {general.name}
          </span>
          <button
            onClick={onClose}
            className="font-pixel text-[10px] text-rpg-border hover:text-throne-gold"
          >
            ✕
          </button>
        </div>

        {/* Sprite */}
        <div className="flex justify-center py-4" style={{ background: "#0a0a0f" }}>
          {getGeneralSprite(general.id, general.currentState, 96)}
        </div>

        {/* Info */}
        <div className="px-4 py-3 space-y-2" style={{ borderTop: "2px solid #5a4a3a" }}>
          <div>
            <span className="font-pixel text-[7px] text-rpg-border">STATUS</span>
            <p className="font-pixel text-[8px] text-throne-goldLight mt-1 capitalize">
              {general.currentState}
            </p>
          </div>
          <div>
            <span className="font-pixel text-[7px] text-rpg-border">CURRENT TASK</span>
            <p className="font-pixel text-[8px] text-throne-goldLight mt-1">
              {general.currentActivity || "Idle"}
            </p>
          </div>
          <div className="flex gap-4">
            <div>
              <span className="font-pixel text-[7px] text-rpg-border">POS</span>
              <p className="font-pixel text-[8px] text-rpg-border mt-1">
                ({Math.round(general.position.x)}, {Math.round(general.position.y)})
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="px-4 pb-3">
          <Link href={`/generals/${general.id}`}>
            <div
              className="rpg-menu-item text-center font-pixel text-[8px] py-2 text-throne-gold hover:bg-rpg-borderDark/30"
              style={{ border: "2px solid #5a4a3a" }}
            >
              ▶ VIEW FULL PROFILE
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityPopup;
