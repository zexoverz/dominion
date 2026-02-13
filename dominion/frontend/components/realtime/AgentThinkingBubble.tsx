"use client";

import { useState, useEffect } from "react";

const THINKING_TEXTS = [
  "Processing data...",
  "Analyzing patterns...",
  "Computing strategy...",
  "Evaluating options...",
  "Cross-referencing...",
  "Running simulation...",
  "Optimizing path...",
  "Consulting oracle...",
];

interface Props {
  className?: string;
  color?: string;
  agentName?: string;
}

export default function AgentThinkingBubble({ className = "", color = "#fbbf24", agentName = "AGENT" }: Props) {
  const [dots, setDots] = useState(1);
  const [textIdx, setTextIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dotInterval = setInterval(() => setDots((d) => (d % 3) + 1), 500);
    const textInterval = setInterval(() => setTextIdx((i) => (i + 1) % THINKING_TEXTS.length), 2500);
    const pulseInterval = setInterval(() => {
      setVisible(false);
      setTimeout(() => setVisible(true), 150);
    }, 4000);
    return () => {
      clearInterval(dotInterval);
      clearInterval(textInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Thought bubble trail */}
      <div className="absolute -top-2 left-3 w-1.5 h-1.5 rounded-full bg-throne-purple opacity-60" />
      <div className="absolute -top-4 left-5 w-2 h-2 rounded-full bg-throne-purple opacity-80" />
      {/* Main bubble */}
      <div
        className="pixel-border-thin bg-throne-dark/95 px-3 py-2 relative"
        style={{
          boxShadow: `0 0 12px ${color}33, 0 0 24px ${color}11`,
          animation: "thinkPulse 2s ease-in-out infinite",
        }}
      >
        <p className="text-[7px] text-gray-500 mb-0.5">{agentName} is thinking</p>
        <p className="text-[8px]" style={{ color }}>
          {THINKING_TEXTS[textIdx]}
          <span className="text-throne-gold">{".".repeat(dots)}</span>
        </p>
      </div>
      <style jsx>{`
        @keyframes thinkPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
