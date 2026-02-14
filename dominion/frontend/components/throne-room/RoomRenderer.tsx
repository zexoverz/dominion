"use client";

import React, { useState, useEffect } from "react";

interface TorchProps {
  x: number;
  y: number;
}

const Torch: React.FC<TorchProps> = ({ x, y }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setFrame((f) => (f + 1) % 3), 200 + Math.random() * 100);
    return () => clearInterval(iv);
  }, []);

  const flameColors = ["#FF6600", "#FF9900", "#FFCC00"];
  const flameColor = flameColors[frame];
  const sparkY = frame === 0 ? -6 : frame === 1 ? -8 : -10;

  return (
    <g>
      {/* Bracket */}
      <rect x={x - 2} y={y} width={4} height={12} fill="#5a4a3a" />
      <rect x={x - 1} y={y + 12} width={2} height={4} fill="#3E2723" />
      {/* Flame */}
      <ellipse cx={x} cy={y - 4} rx={4 + frame} ry={6 + frame} fill={flameColor} opacity={0.9} />
      <ellipse cx={x} cy={y - 5} rx={2} ry={4} fill="#FFEE58" opacity={0.8} />
      {/* Spark */}
      <circle cx={x + (frame - 1) * 2} cy={y + sparkY} r={1} fill="#FFCC00" opacity={frame === 1 ? 0.8 : 0.3} />
      {/* Glow on floor */}
      <ellipse cx={x} cy={y + 60} rx={50} ry={20} fill="#FF990011" />
      <ellipse cx={x} cy={y + 40} rx={30} ry={15} fill="#FFCC0008" />
    </g>
  );
};

interface DustMoteProps {
  startX: number;
  startY: number;
  delay: number;
}

const DustMote: React.FC<DustMoteProps> = ({ startX, startY, delay }) => {
  const [pos, setPos] = useState({ x: startX, y: startY, opacity: 0 });
  useEffect(() => {
    const timeout = setTimeout(() => {
      const iv = setInterval(() => {
        setPos((p) => {
          const newY = p.y - 0.3;
          const newX = p.x + (Math.random() - 0.5) * 0.5;
          const newOp = newY < startY - 60 ? 0 : Math.min(0.6, p.opacity + 0.02);
          if (newY < startY - 80) return { x: startX + (Math.random() - 0.5) * 20, y: startY, opacity: 0 };
          return { x: newX, y: newY, opacity: newOp };
        });
      }, 50);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timeout);
  }, [startX, startY, delay]);

  return <circle cx={pos.x} cy={pos.y} r={0.8} fill="#FFD70044" opacity={pos.opacity} />;
};

const RoomRenderer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-full"
      style={{ imageRendering: "pixelated", background: "#0a0a0f" }}
    >
      <defs>
        <pattern id="stone-floor" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#1a1a28" />
          <rect x="0" y="0" width="16" height="16" fill="#1e1e30" />
          <rect x="16" y="16" width="16" height="16" fill="#1e1e30" />
          <rect x="0" y="0" width="32" height="1" fill="#12121f" />
          <rect x="0" y="16" width="32" height="1" fill="#12121f" />
          <rect x="0" y="0" width="1" height="32" fill="#12121f" />
          <rect x="16" y="0" width="1" height="32" fill="#12121f" />
        </pattern>
        <pattern id="wall-stone" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#151520" />
          <rect x="0" y="0" width="20" height="10" fill="#18182a" />
          <rect x="20" y="10" width="20" height="10" fill="#18182a" />
          <rect x="0" y="0" width="40" height="1" fill="#0e0e18" />
          <rect x="0" y="10" width="40" height="1" fill="#0e0e18" />
          <rect x="0" y="0" width="1" height="20" fill="#0e0e18" />
          <rect x="20" y="0" width="1" height="10" fill="#0e0e18" />
          <rect x="20" y="10" width="1" height="10" fill="#0e0e18" />
        </pattern>
        <radialGradient id="torch-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF990022" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Wall */}
      <rect x="0" y="0" width="800" height="200" fill="url(#wall-stone)" />
      {/* Wall base molding */}
      <rect x="0" y="195" width="800" height="8" fill="#2a1f15" />
      <rect x="0" y="197" width="800" height="2" fill="#8b7355" />

      {/* Floor */}
      <rect x="0" y="200" width="800" height="400" fill="url(#stone-floor)" />

      {/* Red carpet - entrance to throne */}
      <rect x="370" y="200" width="60" height="400" fill="#6B1010" />
      <rect x="372" y="200" width="2" height="400" fill="#8B1A1A" />
      <rect x="426" y="200" width="2" height="400" fill="#8B1A1A" />
      {/* Carpet gold trim */}
      <rect x="368" y="200" width="2" height="400" fill="#DAA520" opacity={0.5} />
      <rect x="430" y="200" width="2" height="400" fill="#DAA520" opacity={0.5} />

      {/* Throne platform */}
      <rect x="340" y="180" width="120" height="50" fill="#2a1f15" />
      <rect x="340" y="178" width="120" height="4" fill="#8b7355" />
      <rect x="350" y="175" width="100" height="4" fill="#5a4a3a" />

      {/* Throne chair */}
      <rect x="370" y="155" width="60" height="50" fill="#DAA520" />
      {/* Throne back */}
      <rect x="375" y="130" width="50" height="30" fill="#B8860B" />
      <rect x="380" y="125" width="40" height="8" fill="#FFD700" />
      <rect x="395" y="120" width="10" height="8" fill="#FFD700" />
      {/* Throne jewels */}
      <rect x="398" y="121" width="4" height="4" fill="#E53935" />
      <rect x="385" y="133" width="4" height="4" fill="#6B21A8" />
      <rect x="411" y="133" width="4" height="4" fill="#6B21A8" />
      {/* Throne arms */}
      <rect x="365" y="170" width="10" height="20" fill="#DAA520" />
      <rect x="425" y="170" width="10" height="20" fill="#DAA520" />
      <rect x="363" y="168" width="14" height="4" fill="#FFD700" />
      <rect x="423" y="168" width="14" height="4" fill="#FFD700" />
      {/* Throne seat */}
      <rect x="375" y="175" width="50" height="15" fill="#6B1010" />

      {/* Round table in center */}
      <ellipse cx="400" cy="370" rx="70" ry="35" fill="#5D3A1A" />
      <ellipse cx="400" cy="367" rx="65" ry="32" fill="#7B4F2A" />
      <ellipse cx="400" cy="365" rx="60" ry="30" fill="#6B4423" />
      {/* Table edge highlight */}
      <ellipse cx="400" cy="365" rx="55" ry="27" fill="none" stroke="#8B6340" strokeWidth="1" />

      {/* === WORKSTATIONS === */}

      {/* SEER's crystal ball station - left alcove */}
      {/* Pedestal */}
      <rect x="80" y="270" width="20" height="30" fill="#5a4a3a" />
      <rect x="75" y="268" width="30" height="4" fill="#8b7355" />
      {/* Crystal ball */}
      <circle cx="90" cy="260" r="10" fill="#6B21A8" opacity={0.6} />
      <circle cx="90" cy="260" r="8" fill="#A78BFA" opacity={0.4} />
      <circle cx="87" cy="257" r={3} fill="white" opacity={0.3} />
      {/* Star chart on wall */}
      <rect x="60" y="140" width="50" height="40" fill="#1a1028" stroke="#8b7355" strokeWidth="1" />
      <circle cx="72" cy="152" r={1} fill="#FFD700" />
      <circle cx="85" cy="148" r={1} fill="#FFD700" />
      <circle cx="80" cy="162" r={1} fill="#FFD700" />
      <circle cx="95" cy="158" r={1.5} fill="#A78BFA" />
      <line x1="72" y1="152" x2="85" y2="148" stroke="#A78BFA33" strokeWidth="0.5" />
      <line x1="85" y1="148" x2="95" y2="158" stroke="#A78BFA33" strokeWidth="0.5" />

      {/* PHANTOM's engineering desk - right alcove */}
      <rect x="660" y="260" width="60" height="30" fill="#2a2a3a" />
      <rect x="658" y="258" width="64" height="4" fill="#5a4a3a" />
      {/* Floating screens */}
      <rect x="665" y="230" width="18" height="12" fill="#0f2" opacity={0.15} stroke="#0f2" strokeWidth="0.5" />
      <rect x="688" y="225" width="18" height="12" fill="#0f2" opacity={0.15} stroke="#0f2" strokeWidth="0.5" />
      <rect x="710" y="232" width="18" height="12" fill="#0f2" opacity={0.15} stroke="#0f2" strokeWidth="0.5" />
      {/* Mechanical parts */}
      <rect x="670" y="265" width="6" height="6" fill="#94a3b8" />
      <rect x="680" y="268" width="4" height="4" fill="#64748b" />

      {/* GRIMOIRE's library corner - back left */}
      {/* Bookshelf */}
      <rect x="170" y="130" width="60" height="70" fill="#3E2723" />
      <rect x="172" y="132" width="56" height="12" fill="#4E342E" />
      <rect x="172" y="146" width="56" height="12" fill="#4E342E" />
      <rect x="172" y="160" width="56" height="12" fill="#4E342E" />
      {/* Books */}
      <rect x="174" y="133" width="4" height="10" fill="#E53935" />
      <rect x="179" y="133" width="3" height="10" fill="#1565C0" />
      <rect x="183" y="133" width="5" height="10" fill="#2E7D32" />
      <rect x="189" y="133" width="3" height="10" fill="#FFD700" />
      <rect x="193" y="133" width="4" height="10" fill="#6B21A8" />
      <rect x="174" y="147" width="5" height="10" fill="#FF6F00" />
      <rect x="180" y="147" width="3" height="10" fill="#00695C" />
      <rect x="184" y="147" width="4" height="10" fill="#8B1A1A" />
      {/* Reading desk */}
      <rect x="180" y="220" width="40" height="20" fill="#5D3A1A" />
      <rect x="178" y="218" width="44" height="4" fill="#7B4F2A" />

      {/* ECHO's broadcast podium - back right */}
      <rect x="590" y="210" width="40" height="30" fill="#431407" />
      <rect x="585" y="208" width="50" height="4" fill="#8b7355" />
      {/* Sound wave symbols on wall */}
      <path d="M 610 150 Q 620 155 610 160" fill="none" stroke="#f97316" strokeWidth="1" opacity={0.5} />
      <path d="M 615 145 Q 630 155 615 165" fill="none" stroke="#f97316" strokeWidth="1" opacity={0.3} />
      <path d="M 620 140 Q 640 155 620 170" fill="none" stroke="#f97316" strokeWidth="1" opacity={0.2} />

      {/* MAMMON's treasury - front left */}
      {/* Desk */}
      <rect x="100" y="440" width="60" height="25" fill="#5D3A1A" />
      <rect x="98" y="438" width="64" height="4" fill="#7B4F2A" />
      {/* Gold chest */}
      <rect x="80" y="450" width="30" height="20" fill="#B8860B" />
      <rect x="80" y="448" width="30" height="4" fill="#DAA520" />
      <rect x="92" y="449" width="6" height="2" fill="#FFD700" />
      {/* Gold piles */}
      <circle cx="88" cy="447" r={3} fill="#FFD700" opacity={0.8} />
      <circle cx="93" cy="446" r={2} fill="#FFD700" opacity={0.7} />
      <circle cx="100" cy="448" r={2.5} fill="#DAA520" opacity={0.6} />
      {/* Scales */}
      <rect x="140" y="435" width="2" height="15" fill="#8b7355" />
      <line x1="130" y1="435" x2="152" y2="435" stroke="#8b7355" strokeWidth="1.5" />
      <ellipse cx="132" cy="437" rx="6" ry="2" fill="#8b7355" />
      <ellipse cx="150" cy="437" rx="6" ry="2" fill="#8b7355" />

      {/* WRAITH-EYE's shadow corner - front right */}
      {/* Shadow pool */}
      <ellipse cx="690" cy="470" rx="50" ry="25" fill="#0a0a12" opacity={0.8} />
      <ellipse cx="690" cy="470" rx="35" ry="18" fill="#050508" opacity={0.6} />
      {/* Surveillance orbs */}
      <circle cx="675" cy="430" r={4} fill="#E53935" opacity={0.5} />
      <circle cx="675" cy="430" r={2} fill="#FF5252" opacity={0.8} />
      <circle cx="705" cy="425" r={3} fill="#E53935" opacity={0.4} />
      <circle cx="705" cy="425" r={1.5} fill="#FF5252" opacity={0.7} />
      <circle cx="690" cy="440" r={3.5} fill="#E53935" opacity={0.4} />
      <circle cx="690" cy="440" r={1.5} fill="#FF5252" opacity={0.7} />

      {/* === BANNERS === */}
      {/* Left banner */}
      <rect x="270" y="110" width="30" height="70" fill="#2d1b4e" />
      <rect x="270" y="110" width="30" height="4" fill="#DAA520" />
      <rect x="270" y="176" width="30" height="4" fill="#DAA520" />
      <rect x="270" y="110" width="2" height="70" fill="#DAA520" opacity={0.5} />
      <rect x="298" y="110" width="2" height="70" fill="#DAA520" opacity={0.5} />
      <text x="285" y="150" textAnchor="middle" fill="#FFD700" fontSize="16" fontFamily="serif">⚜</text>
      {/* Right banner */}
      <rect x="500" y="110" width="30" height="70" fill="#2d1b4e" />
      <rect x="500" y="110" width="30" height="4" fill="#DAA520" />
      <rect x="500" y="176" width="30" height="4" fill="#DAA520" />
      <rect x="500" y="110" width="2" height="70" fill="#DAA520" opacity={0.5} />
      <rect x="528" y="110" width="2" height="70" fill="#DAA520" opacity={0.5} />
      <text x="515" y="150" textAnchor="middle" fill="#FFD700" fontSize="16" fontFamily="serif">⚜</text>

      {/* === TORCHES === */}
      <Torch x={140} y={120} />
      <Torch x={330} y={115} />
      <Torch x={470} y={115} />
      <Torch x={660} y={120} />
      <Torch x={50} y={200} />
      <Torch x={750} y={200} />

      {/* === DUST MOTES === */}
      <DustMote startX={200} startY={400} delay={0} />
      <DustMote startX={500} startY={350} delay={1000} />
      <DustMote startX={350} startY={500} delay={2000} />
      <DustMote startX={600} startY={450} delay={3000} />
      <DustMote startX={150} startY={350} delay={1500} />
      <DustMote startX={700} startY={380} delay={2500} />

      {/* === SHIELDS on walls === */}
      <circle cx="440" cy="150" r="12" fill="#5a4a3a" />
      <circle cx="440" cy="150" r="10" fill="#8B1A1A" />
      <line x1="435" y1="145" x2="445" y2="155" stroke="#DAA520" strokeWidth="1.5" />
      <line x1="445" y1="145" x2="435" y2="155" stroke="#DAA520" strokeWidth="1.5" />

      <circle cx="360" cy="150" r="12" fill="#5a4a3a" />
      <circle cx="360" cy="150" r="10" fill="#172554" />
      <rect x="357" y="143" width="6" height="14" fill="#DAA520" />

      {/* Children (generals rendered on top) */}
      {children}
    </svg>
  );
};

export default RoomRenderer;
