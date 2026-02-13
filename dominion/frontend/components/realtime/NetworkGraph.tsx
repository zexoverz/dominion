"use client";

import { useState, useEffect } from "react";

const NODES = [
  { id: "throne", emoji: "👑", name: "THRONE", color: "#fbbf24", x: 50, y: 15 },
  { id: "seer", emoji: "🔮", name: "SEER", color: "#a78bfa", x: 20, y: 45 },
  { id: "phantom", emoji: "👻", name: "PHANTOM", color: "#94a3b8", x: 80, y: 45 },
  { id: "warden", emoji: "🛡️", name: "WARDEN", color: "#60a5fa", x: 10, y: 80 },
  { id: "herald", emoji: "📯", name: "HERALD", color: "#f97316", x: 50, y: 85 },
  { id: "forge", emoji: "⚒️", name: "FORGE", color: "#ef4444", x: 90, y: 80 },
  { id: "cipher", emoji: "🗝️", name: "CIPHER", color: "#22d3ee", x: 50, y: 55 },
];

const CONNECTIONS = [
  { from: "throne", to: "seer", active: true },
  { from: "throne", to: "phantom", active: true },
  { from: "throne", to: "herald", active: false },
  { from: "seer", to: "phantom", active: true },
  { from: "seer", to: "cipher", active: false },
  { from: "phantom", to: "cipher", active: false },
  { from: "warden", to: "throne", active: false },
  { from: "forge", to: "phantom", active: false },
  { from: "herald", to: "seer", active: false },
];

interface DataPacket {
  id: number;
  from: string;
  to: string;
  progress: number;
  color: string;
}

export default function NetworkGraph({ className = "" }: { className?: string }) {
  const [activeConns, setActiveConns] = useState(CONNECTIONS.map((c) => c.active));
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [packetId, setPacketId] = useState(0);
  const [roundtable, setRoundtable] = useState<string[]>(["throne", "seer", "phantom"]);
  const [rtPulse, setRtPulse] = useState(false);

  // Toggle connections randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConns((prev) =>
        prev.map((a, i) => (i < 3 ? true : Math.random() > 0.6 ? !a : a))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Spawn data packets
  useEffect(() => {
    const interval = setInterval(() => {
      const activeIndices = activeConns
        .map((a, i) => (a ? i : -1))
        .filter((i) => i >= 0);
      if (activeIndices.length === 0) return;
      const connIdx = activeIndices[Math.floor(Math.random() * activeIndices.length)];
      const conn = CONNECTIONS[connIdx];
      const fromNode = NODES.find((n) => n.id === conn.from)!;

      setPacketId((prev) => {
        setPackets((old) => [
          ...old.slice(-10),
          { id: prev, from: conn.from, to: conn.to, progress: 0, color: fromNode.color },
        ]);
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [activeConns]);

  // Animate packets
  useEffect(() => {
    const interval = setInterval(() => {
      setPackets((old) =>
        old
          .map((p) => ({ ...p, progress: p.progress + 0.05 }))
          .filter((p) => p.progress <= 1)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Roundtable pulse
  useEffect(() => {
    const interval = setInterval(() => setRtPulse((p) => !p), 1500);
    return () => clearInterval(interval);
  }, []);

  const getNode = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div className={`pixel-border-thin bg-throne-dark p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] text-throne-gold">🌐 NETWORK TOPOLOGY</span>
        <span className={`text-[7px] ml-auto ${rtPulse ? "text-throne-green" : "text-gray-600"}`}>
          ● ROUNDTABLE ACTIVE
        </span>
      </div>

      <div className="relative w-full" style={{ paddingBottom: "60%" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Connection lines */}
          {CONNECTIONS.map((conn, i) => {
            const from = getNode(conn.from);
            const to = getNode(conn.to);
            return (
              <line
                key={`${conn.from}-${conn.to}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={activeConns[i] ? from.color : "#2d1b4e"}
                strokeWidth={activeConns[i] ? "0.5" : "0.2"}
                opacity={activeConns[i] ? 0.6 : 0.2}
                className={activeConns[i] ? "animate-pulse" : ""}
              />
            );
          })}

          {/* Data packets */}
          {packets.map((p) => {
            const from = getNode(p.from);
            const to = getNode(p.to);
            const x = from.x + (to.x - from.x) * p.progress;
            const y = from.y + (to.y - from.y) * p.progress;
            return (
              <circle
                key={p.id}
                cx={x} cy={y} r="1"
                fill={p.color}
                opacity={1 - p.progress * 0.5}
              >
                <animate attributeName="r" values="0.5;1.2;0.5" dur="0.5s" repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Roundtable ring */}
          {roundtable.length > 1 && (
            <circle
              cx="50" cy="40" r="25"
              fill="none"
              stroke="#fbbf2433"
              strokeWidth="0.3"
              strokeDasharray="2 2"
              className="animate-spin"
              style={{ animationDuration: "20s", transformOrigin: "50px 40px" }}
            />
          )}
        </svg>

        {/* Node labels (HTML overlay) */}
        {NODES.map((node) => {
          const isRt = roundtable.includes(node.id);
          const isActive = node.id === "throne" || node.id === "seer" || node.id === "phantom";
          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${(node.y / 100) * 60}%` }}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center text-sm ${isActive ? "" : "opacity-40"}`}
                style={{
                  backgroundColor: `${node.color}22`,
                  boxShadow: isRt && rtPulse ? `0 0 10px ${node.color}66` : "none",
                }}
              >
                {node.emoji}
              </div>
              <span
                className="text-[6px] mt-0.5"
                style={{ color: isActive ? node.color : "#4a5568" }}
              >
                {node.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
