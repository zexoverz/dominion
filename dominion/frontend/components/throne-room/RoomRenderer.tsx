"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "ember" | "dust" | "magic" | "gold" | "shadow" | "sparkle";
}

function createParticle(type: Particle["type"], id: number): Particle {
  switch (type) {
    case "ember": {
      // Spawn from torch positions
      const torchXs = [70, 200, 340, 560, 700, 830, 50, 850];
      const tx = torchXs[Math.floor(Math.random() * torchXs.length)];
      return { id, x: tx + (Math.random() - 0.5) * 6, y: 140 + Math.random() * 20, vx: (Math.random() - 0.5) * 0.8, vy: -0.6 - Math.random() * 1.2, life: 1, maxLife: 60 + Math.random() * 40, size: 1 + Math.random() * 1.5, color: Math.random() > 0.5 ? "#FF6600" : "#FFAA00", type };
    }
    case "dust":
      return { id, x: Math.random() * 900, y: 100 + Math.random() * 500, vx: 0.15 + Math.random() * 0.3, vy: -0.05 + Math.random() * 0.1, life: 1, maxLife: 200 + Math.random() * 200, size: 0.5 + Math.random() * 1.2, color: "#FFD700", type };
    case "magic":
      return { id, x: 110 + (Math.random() - 0.5) * 40, y: 270 + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.5) * 0.4, vy: -0.3 - Math.random() * 0.5, life: 1, maxLife: 80 + Math.random() * 60, size: 1 + Math.random() * 2, color: Math.random() > 0.5 ? "#00FFFF" : "#A78BFA", type };
    case "gold":
      return { id, x: 130 + (Math.random() - 0.5) * 50, y: 460 + (Math.random() - 0.5) * 20, vx: (Math.random() - 0.5) * 0.3, vy: -0.2 - Math.random() * 0.3, life: 1, maxLife: 60 + Math.random() * 40, size: 0.8 + Math.random() * 1, color: "#FFD700", type };
    case "shadow":
      return { id, x: 750 + (Math.random() - 0.5) * 60, y: 460 + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.5) * 0.3, vy: -0.15 - Math.random() * 0.2, life: 1, maxLife: 100 + Math.random() * 60, size: 2 + Math.random() * 3, color: "#2d1b4e", type };
    case "sparkle":
      return { id, x: 230 + (Math.random() - 0.5) * 60, y: 230 + (Math.random() - 0.5) * 30, vx: (Math.random() - 0.5) * 0.2, vy: -0.1 - Math.random() * 0.3, life: 1, maxLife: 50 + Math.random() * 40, size: 1 + Math.random() * 1.5, color: "#F59E0B", type };
    default:
      return { id, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, size: 1, color: "#fff", type };
  }
}

function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    // Initialize particles
    const init: Particle[] = [];
    for (let i = 0; i < 12; i++) init.push(createParticle("ember", idRef.current++));
    for (let i = 0; i < 25; i++) init.push(createParticle("dust", idRef.current++));
    for (let i = 0; i < 8; i++) init.push(createParticle("magic", idRef.current++));
    for (let i = 0; i < 6; i++) init.push(createParticle("gold", idRef.current++));
    for (let i = 0; i < 5; i++) init.push(createParticle("shadow", idRef.current++));
    for (let i = 0; i < 6; i++) init.push(createParticle("sparkle", idRef.current++));
    setParticles(init);

    const iv = setInterval(() => {
      setParticles(prev => prev.map(p => {
        const newLife = p.life + 1;
        if (newLife >= p.maxLife) {
          return createParticle(p.type, idRef.current++);
        }
        return {
          ...p,
          x: p.x + p.vx + (Math.random() - 0.5) * 0.3,
          y: p.y + p.vy,
          life: newLife,
        };
      }));
    }, 50);
    return () => clearInterval(iv);
  }, []);

  return particles;
}

// ═══════════════════════════════════════════════
// TORCH COMPONENT (multi-frame)
// ═══════════════════════════════════════════════

const Torch: React.FC<{ x: number; y: number; glowId: string }> = ({ x, y, glowId }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => (f + 1) % 5), 120 + Math.random() * 80);
    return () => clearInterval(iv);
  }, []);

  const flames = [
    { rx: 5, ry: 8, oy: -6 },
    { rx: 6, ry: 9, oy: -7 },
    { rx: 5.5, ry: 10, oy: -8 },
    { rx: 6.5, ry: 9, oy: -7 },
    { rx: 5, ry: 8.5, oy: -6.5 },
  ];
  const f = flames[frame];

  return (
    <g>
      {/* Wall bracket */}
      <rect x={x - 1.5} y={y + 8} width={3} height={3} fill="#3E2723" />
      <rect x={x - 4} y={y + 5} width={8} height={4} fill="#5a4a3a" />
      <rect x={x - 3} y={y + 3} width={6} height={3} fill="#4E342E" />
      {/* Torch handle */}
      <rect x={x - 2} y={y - 2} width={4} height={8} fill="#6D4C41" />
      <rect x={x - 1} y={y - 2} width={2} height={8} fill="#8D6E63" />
      {/* Outer flame glow */}
      <ellipse cx={x} cy={y + f.oy + 2} rx={f.rx + 4} ry={f.ry + 4} fill={`url(#${glowId})`} opacity={0.5} />
      {/* Outer flame */}
      <ellipse cx={x} cy={y + f.oy} rx={f.rx} ry={f.ry} fill="#FF6600" opacity={0.85}>
        <animate attributeName="rx" values={`${f.rx};${f.rx + 1};${f.rx}`} dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      {/* Mid flame */}
      <ellipse cx={x} cy={y + f.oy + 1} rx={f.rx * 0.65} ry={f.ry * 0.7} fill="#FF9900" opacity={0.9} />
      {/* Inner flame */}
      <ellipse cx={x} cy={y + f.oy + 2} rx={f.rx * 0.35} ry={f.ry * 0.5} fill="#FFEE58" opacity={0.95} />
      {/* Flame tip */}
      <ellipse cx={x + (frame % 2 === 0 ? -1 : 1)} cy={y + f.oy - f.ry * 0.6} rx={1.5} ry={3} fill="#FF660088" />
    </g>
  );
};

// ═══════════════════════════════════════════════
// CHANDELIER
// ═══════════════════════════════════════════════

const Chandelier: React.FC = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 150);
    return () => clearInterval(iv);
  }, []);

  const candles = [
    { cx: 420, cy: 210 },
    { cx: 440, cy: 208 },
    { cx: 460, cy: 210 },
    { cx: 430, cy: 215 },
    { cx: 450, cy: 214 },
  ];
  const sway = Math.sin(tick * 0.04) * 1.5;

  return (
    <g transform={`translate(${sway}, 0)`}>
      {/* Chain */}
      <line x1={445} y1={60} x2={445} y2={195} stroke="#5a4a3a" strokeWidth={1.5} />
      <line x1={445} y1={60} x2={445 + sway} y2={195} stroke="#8b7355" strokeWidth={0.5} />
      {/* Iron ring */}
      <ellipse cx={445} cy={205} rx={30} ry={8} fill="none" stroke="#5a4a3a" strokeWidth={3} />
      <ellipse cx={445} cy={205} rx={30} ry={8} fill="none" stroke="#8b7355" strokeWidth={1} />
      {/* Cross bars */}
      <line x1={415} y1={205} x2={475} y2={205} stroke="#4E342E" strokeWidth={2} />
      <line x1={445} y1={197} x2={445} y2={213} stroke="#4E342E" strokeWidth={2} />
      {/* Candles */}
      {candles.map((c, i) => {
        const flicker = ((tick + i * 7) % 4);
        const fy = flicker < 2 ? -5 : -6;
        const fr = flicker < 2 ? 2.5 : 3;
        return (
          <g key={i}>
            {/* Wax candle */}
            <rect x={c.cx - 1.5} y={c.cy - 2} width={3} height={8} fill="#F5F5DC" />
            <rect x={c.cx - 1} y={c.cy - 2} width={2} height={8} fill="#FFFDD0" />
            {/* Flame */}
            <ellipse cx={c.cx} cy={c.cy + fy} rx={fr} ry={fr + 2} fill="#FF9900" opacity={0.85} />
            <ellipse cx={c.cx} cy={c.cy + fy + 0.5} rx={fr * 0.5} ry={fr + 0.5} fill="#FFEE58" opacity={0.9} />
            {/* Dripping wax */}
            {i % 2 === 0 && <circle cx={c.cx + 1.5} cy={c.cy + 7 + (tick % 20) * 0.1} r={0.8} fill="#F5F5DC" opacity={0.6} />}
          </g>
        );
      })}
      {/* Chandelier warm glow */}
      <ellipse cx={445} cy={220} rx={80} ry={40} fill="url(#chandelier-glow)" opacity={0.4 + Math.sin(tick * 0.08) * 0.05} />
    </g>
  );
};

// ═══════════════════════════════════════════════
// STAINED GLASS WINDOWS
// ═══════════════════════════════════════════════

const StainedWindow: React.FC<{ x: number; side: "left" | "right" }> = ({ x, side }) => (
  <g>
    {/* Window frame */}
    <rect x={x} y={75} width={36} height={90} fill="#1a1028" stroke="#5a4a3a" strokeWidth={2} />
    {/* Arch top */}
    <path d={`M ${x} 75 Q ${x + 18} 55 ${x + 36} 75`} fill="#1a1028" stroke="#5a4a3a" strokeWidth={2} />
    {/* Glass panes */}
    <rect x={x + 3} y={78} width={14} height={28} fill="#6B21A8" opacity={0.4} />
    <rect x={x + 19} y={78} width={14} height={28} fill="#DAA520" opacity={0.35} />
    <rect x={x + 3} y={109} width={14} height={28} fill="#1565C0" opacity={0.35} />
    <rect x={x + 19} y={109} width={14} height={28} fill="#6B21A8" opacity={0.3} />
    <rect x={x + 3} y={140} width={30} height={22} fill="#DAA520" opacity={0.25} />
    {/* Dividers */}
    <line x1={x + 18} y1={78} x2={x + 18} y2={165} stroke="#5a4a3a" strokeWidth={1} />
    <line x1={x + 3} y1={108} x2={x + 33} y2={108} stroke="#5a4a3a" strokeWidth={1} />
    <line x1={x + 3} y1={139} x2={x + 33} y2={139} stroke="#5a4a3a" strokeWidth={1} />
    {/* Light beam streaming in */}
    <polygon
      points={
        side === "left"
          ? `${x + 18},165 ${x + 60},380 ${x + 120},380 ${x + 36},165`
          : `${x + 18},165 ${x - 40},380 ${x - 100},380 ${x},165`
      }
      fill={side === "left" ? "url(#window-beam-purple)" : "url(#window-beam-gold)"}
      opacity={0.08}
    />
  </g>
);

// ═══════════════════════════════════════════════
// BANNER (animated sway)
// ═══════════════════════════════════════════════

const Banner: React.FC<{ x: number; color: string; delay: number }> = ({ x, color, delay }) => (
  <g>
    {/* Rod */}
    <rect x={x - 2} y={108} width={34} height={3} fill="#8b7355" />
    <circle cx={x - 2} cy={109.5} r={2.5} fill="#DAA520" />
    <circle cx={x + 32} cy={109.5} r={2.5} fill="#DAA520" />
    {/* Banner fabric with sway */}
    <rect x={x} y={111} width={30} height={68} fill={color}>
      <animateTransform attributeName="transform" type="rotate" values={`-1 ${x + 15} 111;1 ${x + 15} 111;-1 ${x + 15} 111`} dur="4s" begin={`${delay}s`} repeatCount="indefinite" />
    </rect>
    {/* Gold trim */}
    <rect x={x} y={111} width={30} height={3} fill="#DAA520" />
    <rect x={x} y={176} width={30} height={3} fill="#DAA520" />
    <rect x={x} y={111} width={2} height={68} fill="#DAA520" opacity={0.6} />
    <rect x={x + 28} y={111} width={2} height={68} fill="#DAA520" opacity={0.6} />
    {/* Crest symbol */}
    <text x={x + 15} y={152} textAnchor="middle" fill="#FFD700" fontSize="16" fontFamily="serif" opacity={0.9}>⚜</text>
    {/* Fringe / tassels at bottom */}
    <line x1={x + 5} y1={179} x2={x + 5} y2={185} stroke="#DAA520" strokeWidth={1} opacity={0.7}>
      <animateTransform attributeName="transform" type="rotate" values={`-2 ${x + 5} 179;2 ${x + 5} 179;-2 ${x + 5} 179`} dur="3.5s" begin={`${delay + 0.2}s`} repeatCount="indefinite" />
    </line>
    <line x1={x + 15} y1={179} x2={x + 15} y2={185} stroke="#DAA520" strokeWidth={1} opacity={0.7}>
      <animateTransform attributeName="transform" type="rotate" values={`-2 ${x + 15} 179;2 ${x + 15} 179;-2 ${x + 15} 179`} dur="3.8s" begin={`${delay + 0.5}s`} repeatCount="indefinite" />
    </line>
    <line x1={x + 25} y1={179} x2={x + 25} y2={185} stroke="#DAA520" strokeWidth={1} opacity={0.7}>
      <animateTransform attributeName="transform" type="rotate" values={`-2 ${x + 25} 179;2 ${x + 25} 179;-2 ${x + 25} 179`} dur="3.3s" begin={`${delay + 0.3}s`} repeatCount="indefinite" />
    </line>
  </g>
);

// ═══════════════════════════════════════════════
// MAIN ROOM RENDERER
// ═══════════════════════════════════════════════

const RoomRenderer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const particles = useParticles();
  const [flickerTick, setFlickerTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setFlickerTick(t => (t + 1) % 100), 100);
    return () => clearInterval(iv);
  }, []);

  // Subtle torch glow oscillation
  const glowPulse = 0.35 + Math.sin(flickerTick * 0.15) * 0.08;

  return (
    <svg
      viewBox="0 0 900 650"
      className="w-full h-full"
      style={{ imageRendering: "pixelated", background: "#06060c" }}
    >
      <defs>
        {/* ═══ PATTERNS ═══ */}
        <pattern id="wall-stone2" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#13131f" />
          <rect x="0" y="0" width="19" height="9" fill="#161626" />
          <rect x="21" y="0" width="19" height="9" fill="#141422" />
          <rect x="10" y="11" width="19" height="9" fill="#151525" />
          <rect x="31" y="11" width="9" height="9" fill="#131321" />
          <rect x="0" y="11" width="9" height="9" fill="#171729" />
          {/* Mortar lines */}
          <rect x="0" y="0" width="40" height="1" fill="#0c0c16" />
          <rect x="0" y="10" width="40" height="1" fill="#0c0c16" />
          <rect x="0" y="0" width="1" height="10" fill="#0c0c16" />
          <rect x="20" y="0" width="1" height="10" fill="#0c0c16" />
          <rect x="10" y="10" width="1" height="10" fill="#0c0c16" />
          <rect x="30" y="10" width="1" height="10" fill="#0c0c16" />
        </pattern>

        <pattern id="floor-tiles" width="36" height="36" patternUnits="userSpaceOnUse">
          <rect width="36" height="36" fill="#121220" />
          <rect x="0" y="0" width="17" height="17" fill="#141428" />
          <rect x="19" y="0" width="17" height="17" fill="#111120" />
          <rect x="0" y="19" width="17" height="17" fill="#101020" />
          <rect x="19" y="19" width="17" height="17" fill="#131326" />
          <rect x="0" y="17" width="36" height="2" fill="#0a0a15" />
          <rect x="17" y="0" width="2" height="36" fill="#0a0a15" />
        </pattern>

        {/* ═══ GRADIENTS ═══ */}
        <radialGradient id="torch-glow-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF9900" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#FF6600" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6600" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="chandelier-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFCC44" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#FF9900" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6600" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="crystal-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#6B21A8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6B21A8" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="green-screen-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FF22" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00FF22" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="red-shadow-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E53935" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E53935" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="gold-shimmer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="center-ambient" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#2d1b4e" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#1a1028" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0.6" />
        </radialGradient>

        <linearGradient id="window-beam-purple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6B21A8" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="window-beam-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#DAA520" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="fog-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="60%" stopColor="white" stopOpacity="0.02" />
          <stop offset="100%" stopColor="white" stopOpacity="0.06" />
        </linearGradient>

        <linearGradient id="depth-fade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0a1a" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#0a0a1a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0a1a" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="carpet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7B1818" />
          <stop offset="15%" stopColor="#8B1A1A" />
          <stop offset="50%" stopColor="#6B1010" />
          <stop offset="85%" stopColor="#8B1A1A" />
          <stop offset="100%" stopColor="#7B1818" />
        </linearGradient>

        {/* ═══ FILTERS ═══ */}
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>

        <filter id="blur-light" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
        </filter>

        {/* Per-torch glow gradients */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <radialGradient key={i} id={`tg${i}`} cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FF9900" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF6600" stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* ═══════════════════════════════════════
           LAYER 0: CEILING
         ═══════════════════════════════════════ */}
      <rect x="0" y="0" width="900" height="70" fill="#08080e" />
      {/* Wooden beams */}
      <rect x="0" y="65" width="900" height="6" fill="#2a1f15" />
      <rect x="0" y="66" width="900" height="2" fill="#3E2723" />
      <rect x="180" y="0" width="5" height="70" fill="#2a1f15" />
      <rect x="450" y="0" width="5" height="70" fill="#2a1f15" />
      <rect x="720" y="0" width="5" height="70" fill="#2a1f15" />
      {/* Cobwebs in corners */}
      <path d="M 0 0 Q 20 15 0 30" fill="none" stroke="#444" strokeWidth="0.5" opacity="0.3" />
      <path d="M 0 0 Q 15 20 30 0" fill="none" stroke="#444" strokeWidth="0.5" opacity="0.3" />
      <path d="M 0 0 L 25 25" stroke="#444" strokeWidth="0.3" opacity="0.25" />
      <path d="M 900 0 Q 880 15 900 30" fill="none" stroke="#444" strokeWidth="0.5" opacity="0.3" />
      <path d="M 900 0 Q 885 20 870 0" fill="none" stroke="#444" strokeWidth="0.5" opacity="0.3" />
      <path d="M 900 0 L 875 25" stroke="#444" strokeWidth="0.3" opacity="0.25" />

      {/* ═══════════════════════════════════════
           LAYER 1: BACK WALL
         ═══════════════════════════════════════ */}
      <rect x="0" y="70" width="900" height="140" fill="url(#wall-stone2)" />
      {/* Moss patches */}
      <rect x="5" y="180" width="3" height="2" fill="#2E7D32" opacity="0.4" />
      <rect x="10" y="185" width="2" height="3" fill="#388E3C" opacity="0.3" />
      <rect x="890" y="178" width="3" height="3" fill="#2E7D32" opacity="0.35" />
      <rect x="885" y="183" width="2" height="2" fill="#388E3C" opacity="0.3" />
      {/* Cracks */}
      <path d="M 300 90 L 305 100 L 302 115" fill="none" stroke="#0a0a12" strokeWidth="0.8" opacity="0.6" />
      <path d="M 650 85 L 655 95 L 652 105 L 658 110" fill="none" stroke="#0a0a12" strokeWidth="0.7" opacity="0.5" />
      {/* Wall base molding */}
      <rect x="0" y="205" width="900" height="8" fill="#2a1f15" />
      <rect x="0" y="207" width="900" height="2" fill="#8b7355" />
      <rect x="0" y="210" width="900" height="2" fill="#1a1510" />

      {/* ═══════════════════════════════════════
           LAYER 2: FLOOR
         ═══════════════════════════════════════ */}
      <rect x="0" y="212" width="900" height="438" fill="url(#floor-tiles)" />

      {/* Floor puddles/reflections near walls */}
      <ellipse cx={30} cy={520} rx={15} ry={5} fill="#1a1a40" opacity={0.3} />
      <ellipse cx={870} cy={540} rx={12} ry={4} fill="#1a1a40" opacity={0.25} />

      {/* ═══════════════════════════════════════
           LAYER 3: RED CARPET
         ═══════════════════════════════════════ */}
      <rect x="400" y="212" width="100" height="438" fill="url(#carpet-grad)" />
      {/* Gold fringe edges */}
      <rect x="397" y="212" width="3" height="438" fill="#DAA520" opacity={0.5} />
      <rect x="500" y="212" width="3" height="438" fill="#DAA520" opacity={0.5} />
      {/* Inner carpet pattern lines */}
      <rect x="410" y="212" width="1" height="438" fill="#8B1A1A" opacity={0.4} />
      <rect x="489" y="212" width="1" height="438" fill="#8B1A1A" opacity={0.4} />
      {/* Worn areas */}
      <rect x="430" y="350" width="40" height="60" fill="#5B0E0E" opacity={0.3} />

      {/* ═══════════════════════════════════════
           LAYER 4: DOOR ARCH (bottom)
         ═══════════════════════════════════════ */}
      <rect x="405" y="580" width="90" height="70" fill="#0a0a0f" />
      {/* Stone archway */}
      <rect x="395" y="570" width="10" height="80" fill="#1e1e30" />
      <rect x="495" y="570" width="10" height="80" fill="#1e1e30" />
      <path d="M 395 570 Q 450 545 505 570" fill="#1e1e30" />
      <path d="M 400 570 Q 450 550 500 570" fill="#0a0a0f" />
      {/* Wooden door (ajar) */}
      <rect x="410" y="575" width="35" height="75" fill="#3E2723" />
      <rect x="412" y="577" width="31" height="71" fill="#4E342E" />
      {/* Iron bands */}
      <rect x="410" y="590" width="35" height="3" fill="#5a4a3a" />
      <rect x="410" y="620" width="35" height="3" fill="#5a4a3a" />
      {/* Door handle */}
      <circle cx="440" cy="610" r={2} fill="#DAA520" />
      {/* Light leaking through */}
      <rect x="446" y="575" width="40" height="75" fill="#FF990008" />
      <rect x="448" y="575" width="2" height="75" fill="#FFCC0010" />

      {/* ═══════════════════════════════════════
           LAYER 5: STAINED GLASS WINDOWS
         ═══════════════════════════════════════ */}
      <StainedWindow x={130} side="left" />
      <StainedWindow x={735} side="right" />

      {/* ═══════════════════════════════════════
           LAYER 6: BANNERS
         ═══════════════════════════════════════ */}
      <Banner x={280} color="#2d1b4e" delay={0} />
      <Banner x={350} color="#1a1028" delay={0.5} />
      <Banner x={520} color="#1a1028" delay={0.3} />
      <Banner x={590} color="#2d1b4e" delay={0.8} />

      {/* ═══════════════════════════════════════
           LAYER 7: THRONE PLATFORM
         ═══════════════════════════════════════ */}
      {/* 3 Steps */}
      <rect x="370" y="210" width="160" height="10" fill="#2a1f15" />
      <rect x="370" y="208" width="160" height="3" fill="#8b7355" />
      <rect x="380" y="200" width="140" height="10" fill="#3E2723" />
      <rect x="380" y="198" width="140" height="3" fill="#DAA520" opacity={0.5} />
      <rect x="390" y="190" width="120" height="10" fill="#2a1f15" />
      <rect x="390" y="188" width="120" height="3" fill="#DAA520" opacity={0.7} />

      {/* Guard statues */}
      {/* Left statue */}
      <rect x="395" y="165" width="12" height="25" fill="#5a4a3a" />
      <rect x="397" y="160" width="8" height="8" fill="#6D6D6D" />
      <rect x="393" y="175" width={4} height={12} fill="#5a4a3a" />
      <rect x="399" y="155" width={4} height={6} fill="#8b7355" />
      {/* Right statue */}
      <rect x="493" y="165" width="12" height="25" fill="#5a4a3a" />
      <rect x="495" y="160" width="8" height="8" fill="#6D6D6D" />
      <rect x="503" y="175" width={4} height={12} fill="#5a4a3a" />
      <rect x="497" y="155" width={4} height={6} fill="#8b7355" />

      {/* Royal banner behind throne */}
      <rect x="425" y="100" width="50" height="80" fill="#2d1b4e" stroke="#DAA520" strokeWidth={1.5} />
      <text x="450" y="148" textAnchor="middle" fill="#FFD700" fontSize="20" fontFamily="serif">♛</text>

      {/* THRONE CHAIR */}
      {/* Back */}
      <rect x="420" y="135" width="60" height="45" fill="#B8860B" />
      <rect x="422" y="137" width="56" height="41" fill="#DAA520" />
      {/* Ornate top */}
      <rect x="415" y="128" width="70" height="10" fill="#FFD700" />
      <rect x="445" y="118" width="10" height="12" fill="#FFD700" />
      {/* Crown jewel */}
      <rect x="447" y="120" width="6" height="6" fill="#E53935" />
      <rect x="448" y="121" width="4" height="4" fill="#FF5252" />
      {/* Side jewels */}
      <rect x="425" y="140" width="5" height="5" fill="#6B21A8" />
      <rect x="470" y="140" width="5" height="5" fill="#6B21A8" />
      {/* Armrests with dragon/lion heads */}
      <rect x="412" y="165" width="14" height="22" fill="#DAA520" />
      <rect x="474" y="165" width="14" height="22" fill="#DAA520" />
      <rect x="410" y="163" width="18" height="5" fill="#FFD700" />
      <rect x="472" y="163" width="18" height="5" fill="#FFD700" />
      {/* Lion head detail on arms */}
      <rect x="413" y="164" width="4" height="3" fill="#B8860B" />
      <rect x="483" y="164" width="4" height="3" fill="#B8860B" />
      {/* Seat cushion */}
      <rect x="424" y="175" width="52" height="12" fill="#6B1010" />
      <rect x="426" y="177" width="48" height="8" fill="#8B1A1A" />
      {/* Throne base */}
      <rect x="418" y="187" width="64" height="6" fill="#B8860B" />

      {/* ═══════════════════════════════════════
           LAYER 8: ROUND TABLE
         ═══════════════════════════════════════ */}
      <ellipse cx="450" cy="385" rx="80" ry="40" fill="#3E2723" />
      <ellipse cx="450" cy="382" rx="75" ry="37" fill="#5D3A1A" />
      <ellipse cx="450" cy="380" rx="70" ry="35" fill="#6B4423" />
      {/* Table edge carved detail */}
      <ellipse cx="450" cy="380" rx="65" ry="32" fill="none" stroke="#8B6340" strokeWidth="1.5" />
      <ellipse cx="450" cy="380" rx="58" ry="28" fill="none" stroke="#5D3A1A" strokeWidth="0.8" />
      {/* Map/documents on table */}
      <rect x="425" y="370" width="30" height="20" fill="#D4C5A9" opacity={0.2} transform="rotate(-5 440 380)" />
      <rect x="455" y="372" width="25" height="15" fill="#C4B090" opacity={0.15} transform="rotate(8 468 380)" />
      {/* Quill on table */}
      <line x1="460" y1="368" x2="470" y2="358" stroke="#8B6340" strokeWidth="0.8" opacity="0.5" />

      {/* Chairs around table (7, one larger) */}
      {/* THRONE's larger chair (top) */}
      <rect x="440" y="332" width="20" height="12" fill="#5D3A1A" />
      <rect x="442" y="328" width="16" height="6" fill="#DAA520" opacity={0.4} />
      {/* Other chairs */}
      {[
        { x: 390, y: 345, r: -20 },
        { x: 500, y: 348, r: 15 },
        { x: 375, y: 380, r: -30 },
        { x: 515, y: 382, r: 25 },
        { x: 395, y: 410, r: -10 },
        { x: 495, y: 412, r: 12 },
      ].map((ch, i) => (
        <rect key={i} x={ch.x} y={ch.y} width="15" height="10" fill="#4E342E" transform={`rotate(${ch.r} ${ch.x + 7} ${ch.y + 5})`} />
      ))}

      {/* ═══════════════════════════════════════
           LAYER 9: WORKSTATIONS
         ═══════════════════════════════════════ */}

      {/* ── SEER's Alcove (left) ── */}
      {/* Curtain */}
      <rect x="55" y="78" width="8" height="130" fill="#2d1b4e" opacity={0.7}>
        <animateTransform attributeName="transform" type="rotate" values="-1 59 78;1 59 78;-1 59 78" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="145" y="78" width="8" height="130" fill="#2d1b4e" opacity={0.7}>
        <animateTransform attributeName="transform" type="rotate" values="1 149 78;-1 149 78;1 149 78" dur="5s" repeatCount="indefinite" />
      </rect>
      {/* Star chart */}
      <rect x="65" y="85" width="75" height="55" fill="#0a0818" stroke="#5a4a3a" strokeWidth="1" />
      {[{x:75,y:95,r:1.2},{x:90,y:92,r:0.8},{x:110,y:98,r:1},{x:100,y:108,r:1.3},{x:82,y:115,r:0.9},{x:120,y:90,r:0.7},{x:128,y:112,r:1.1},{x:72,y:128,r:0.8}].map((s,i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFD700" opacity={0.7}>
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Constellation lines */}
      <path d="M 75 95 L 90 92 L 110 98 L 100 108 L 82 115" fill="none" stroke="#A78BFA" strokeWidth="0.5" opacity="0.3" />
      {/* Crystal ball pedestal */}
      <rect x="88" y="285" width="30" height="5" fill="#5a4a3a" />
      <rect x="92" y="268" width="22" height="20" fill="#3E2723" />
      <rect x="94" y="266" width="18" height="4" fill="#8b7355" />
      {/* Crystal ball */}
      <circle cx="103" cy="258" r="14" fill="#1a0a30" opacity={0.9} />
      <circle cx="103" cy="258" r="12" fill="#6B21A8" opacity={0.5} />
      <circle cx="103" cy="258" r="9" fill="#A78BFA" opacity={0.3} />
      <circle cx="99" cy="253" r={4} fill="white" opacity={0.15} />
      <circle cx="103" cy="258" r="12" fill="url(#crystal-glow)" />
      {/* Magic circle on floor */}
      <ellipse cx="103" cy="300" rx="25" ry="10" fill="none" stroke="#A78BFA" strokeWidth="0.8" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.15;0.25" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="103" cy="300" rx="18" ry="7" fill="none" stroke="#6B21A8" strokeWidth="0.5" opacity="0.2" />
      {/* Floating constellation dots */}
      {[{x:85,y:245,d:"3s"},{x:118,y:242,d:"3.5s"},{x:95,y:235,d:"2.8s"}].map((c,i) => (
        <circle key={i} cx={c.x} cy={c.y} r={1.2} fill="#A78BFA" opacity={0.5}>
          <animate attributeName="cy" values={`${c.y};${c.y - 4};${c.y}`} dur={c.d} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur={c.d} repeatCount="indefinite" />
        </circle>
      ))}

      {/* ── PHANTOM's Engineering Desk (right) ── */}
      {/* L-shaped desk */}
      <rect x="720" y="268" width="70" height="28" fill="#2a2a3a" />
      <rect x="718" y="266" width="74" height="4" fill="#5a4a3a" />
      <rect x="780" y="250" width="28" height="48" fill="#2a2a3a" />
      <rect x="778" y="248" width="32" height="4" fill="#5a4a3a" />
      {/* 3 Holographic screens */}
      <g>
        <rect x="725" y="238" width="22" height="16" fill="#00FF22" opacity={0.08} stroke="#00FF22" strokeWidth="0.6">
          <animate attributeName="opacity" values="0.08;0.12;0.08" dur="2s" repeatCount="indefinite" />
        </rect>
        {/* Screen content lines */}
        <rect x="727" y="241" width="14" height="1" fill="#00FF22" opacity="0.3" />
        <rect x="727" y="244" width="10" height="1" fill="#00FF22" opacity="0.2" />
        <rect x="727" y="247" width="16" height="1" fill="#00FF22" opacity="0.25" />
      </g>
      <g>
        <rect x="752" y="233" width="22" height="16" fill="#00FF22" opacity={0.08} stroke="#00FF22" strokeWidth="0.6">
          <animate attributeName="opacity" values="0.1;0.06;0.1" dur="2.3s" repeatCount="indefinite" />
        </rect>
        <rect x="754" y="236" width="12" height="1" fill="#00FF22" opacity="0.25" />
        <rect x="754" y="239" width="16" height="1" fill="#00FF22" opacity="0.2" />
      </g>
      <g>
        <rect x="779" y="225" width="22" height="16" fill="#00FF22" opacity={0.08} stroke="#00FF22" strokeWidth="0.6">
          <animate attributeName="opacity" values="0.06;0.12;0.06" dur="1.8s" repeatCount="indefinite" />
        </rect>
        <rect x="781" y="228" width="8" height="1" fill="#00FF22" opacity="0.2" />
        <rect x="781" y="231" width="14" height="1" fill="#00FF22" opacity="0.3" />
      </g>
      {/* Mechanical parts */}
      <rect x="730" y="272" width="8" height="8" fill="#94a3b8" />
      <rect x="740" y="275" width="5" height="5" fill="#64748b" />
      <circle cx="755" cy="278" r={3} fill="#5a4a3a" />
      <circle cx="755" cy="278" r={1.5} fill="#94a3b8" />
      {/* Gear decoration */}
      <circle cx="810" cy="132" r={8} fill="none" stroke="#5a4a3a" strokeWidth="2" />
      <circle cx="810" cy="132" r={4} fill="#3E2723" />
      {/* Sparking soldering iron */}
      <line x1="765" y1="270" x2="770" y2="265" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="770" cy="264" r={1} fill="#FFEE58" opacity={0.7}>
        <animate attributeName="opacity" values="0.7;0.2;0.7;1;0.5" dur="0.5s" repeatCount="indefinite" />
      </circle>
      {/* Green ambient glow */}
      <ellipse cx="760" cy="270" rx="60" ry="30" fill="url(#green-screen-glow)" />

      {/* ── GRIMOIRE's Library (back left) ── */}
      {/* Floor-to-ceiling bookshelf */}
      <rect x="185" y="75" width="80" height="135" fill="#3E2723" stroke="#2a1f15" strokeWidth="1" />
      {/* Shelf dividers */}
      {[90, 115, 140, 165].map(sy => (
        <rect key={sy} x="187" y={sy} width="76" height="2" fill="#5D3A1A" />
      ))}
      {/* Books row 1 */}
      {[{x:189,w:5,c:"#E53935"},{x:195,w:4,c:"#1565C0"},{x:200,w:6,c:"#2E7D32"},{x:207,w:3,c:"#FFD700"},{x:211,w:5,c:"#6B21A8"},{x:217,w:4,c:"#FF6F00"},{x:222,w:5,c:"#00695C"},{x:228,w:3,c:"#8B1A1A"},{x:232,w:6,c:"#1565C0"},{x:239,w:4,c:"#DAA520"},{x:244,w:5,c:"#E53935"},{x:250,w:4,c:"#2E7D32"},{x:255,w:4,c:"#6B21A8"}].map((b,i) => (
        <rect key={i} x={b.x} y={92} width={b.w} height={22} fill={b.c} opacity={0.7} />
      ))}
      {/* Books row 2 */}
      {[{x:189,w:4,c:"#FF6F00"},{x:194,w:5,c:"#00695C"},{x:200,w:4,c:"#8B1A1A"},{x:205,w:6,c:"#1565C0"},{x:212,w:3,c:"#FFD700"},{x:216,w:5,c:"#E53935"},{x:222,w:4,c:"#6B21A8"},{x:227,w:5,c:"#2E7D32"},{x:233,w:4,c:"#DAA520"},{x:238,w:6,c:"#FF6F00"},{x:245,w:3,c:"#00695C"},{x:249,w:5,c:"#8B1A1A"},{x:255,w:4,c:"#1565C0"}].map((b,i) => (
        <rect key={i} x={b.x} y={117} width={b.w} height={22} fill={b.c} opacity={0.65} />
      ))}
      {/* Books row 3 */}
      {[{x:189,w:5,c:"#2E7D32"},{x:195,w:3,c:"#DAA520"},{x:199,w:6,c:"#E53935"},{x:206,w:4,c:"#1565C0"},{x:211,w:5,c:"#FF6F00"},{x:217,w:3,c:"#6B21A8"},{x:221,w:5,c:"#00695C"},{x:227,w:4,c:"#FFD700"},{x:232,w:6,c:"#8B1A1A"},{x:239,w:3,c:"#2E7D32"},{x:243,w:5,c:"#DAA520"},{x:249,w:5,c:"#E53935"},{x:255,w:4,c:"#1565C0"}].map((b,i) => (
        <rect key={i} x={b.x} y={142} width={b.w} height={22} fill={b.c} opacity={0.6} />
      ))}
      {/* Books row 4 */}
      {[{x:189,w:4,c:"#8B1A1A"},{x:194,w:5,c:"#FFD700"},{x:200,w:3,c:"#6B21A8"},{x:204,w:6,c:"#2E7D32"},{x:211,w:4,c:"#FF6F00"},{x:216,w:5,c:"#1565C0"},{x:222,w:3,c:"#E53935"},{x:226,w:5,c:"#DAA520"},{x:232,w:4,c:"#00695C"}].map((b,i) => (
        <rect key={i} x={b.x} y={167} width={b.w} height={22} fill={b.c} opacity={0.55} />
      ))}
      {/* Ladder leaning on shelf */}
      <line x1="270" y1="78" x2="275" y2="210" stroke="#8B6340" strokeWidth="2" />
      <line x1="278" y1="78" x2="283" y2="210" stroke="#8B6340" strokeWidth="2" />
      {[95, 120, 145, 170, 195].map(ry => (
        <line key={ry} x1={270 + (ry - 78) * 5 / 132} y1={ry} x2={278 + (ry - 78) * 5 / 132} y2={ry} stroke="#6D4C41" strokeWidth="1.5" />
      ))}
      {/* Reading desk */}
      <rect x="195" y="228" width="50" height="22" fill="#5D3A1A" />
      <rect x="193" y="226" width="54" height="4" fill="#7B4F2A" />
      {/* Open tome */}
      <rect x="200" y="228" width="20" height="14" fill="#D4C5A9" opacity={0.3} />
      <rect x="222" y="228" width="18" height="14" fill="#C4B090" opacity={0.25} />
      <line x1="220" y1="228" x2="220" y2="242" stroke="#8B6340" strokeWidth="0.5" opacity="0.4" />
      {/* Ink pot */}
      <rect x="244" y="230" width="5" height="6" fill="#0a0a0f" />
      <rect x="243" y="228" width="7" height="3" fill="#1a1a28" />
      {/* Quill in ink */}
      <line x1="246" y1="228" x2="252" y2="218" stroke="#D4C5A9" strokeWidth="0.8" />
      {/* Floating glowing books */}
      <rect x="178" y="215" width="8" height="6" fill="#FFD700" opacity={0.3}>
        <animate attributeName="y" values="215;211;215" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="258" y="220" width="7" height="5" fill="#A78BFA" opacity={0.25}>
        <animate attributeName="y" values="220;216;220" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.12;0.25" dur="3.5s" repeatCount="indefinite" />
      </rect>

      {/* ── ECHO's Broadcast Podium (back right) ── */}
      {/* Acoustic panels on wall */}
      <rect x="630" y="85" width="40" height="50" fill="#1a1510" stroke="#2a1f15" strokeWidth="1" />
      <rect x="632" y="87" width="12" height="14" fill="#15120e" />
      <rect x="646" y="87" width="12" height="14" fill="#15120e" />
      <rect x="660" y="87" width="8" height="14" fill="#15120e" />
      <rect x="632" y="103" width="12" height="14" fill="#15120e" />
      <rect x="646" y="103" width="12" height="14" fill="#15120e" />
      <rect x="660" y="103" width="8" height="14" fill="#15120e" />
      <rect x="632" y="119" width="12" height="14" fill="#15120e" />
      <rect x="646" y="119" width="12" height="14" fill="#15120e" />
      {/* Sound wave symbols */}
      <path d="M 688 100 Q 698 108 688 116" fill="none" stroke="#f97316" strokeWidth="1.2" opacity={0.4}>
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M 693 94 Q 708 108 693 122" fill="none" stroke="#f97316" strokeWidth="1" opacity={0.25}>
        <animate attributeName="opacity" values="0.25;0.08;0.25" dur="2s" begin="0.3s" repeatCount="indefinite" />
      </path>
      <path d="M 698 88 Q 718 108 698 128" fill="none" stroke="#f97316" strokeWidth="0.8" opacity={0.15}>
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" begin="0.6s" repeatCount="indefinite" />
      </path>
      {/* Stone podium */}
      <rect x="635" y="220" width="50" height="32" fill="#3E2723" />
      <rect x="630" y="218" width="60" height="5" fill="#5a4a3a" />
      <rect x="632" y="216" width="56" height="3" fill="#8b7355" />
      {/* Sound wave carving */}
      <path d="M 645 235 Q 650 230 655 235 Q 660 240 665 235 Q 670 230 675 235" fill="none" stroke="#8b7355" strokeWidth="1" opacity="0.4" />
      {/* Microphone crystal */}
      <rect x="657" y="208" width="6" height="10" fill="#06b6d4" opacity={0.5} />
      <rect x="658" y="206" width="4" height="3" fill="#22d3ee" opacity={0.4} />
      {/* Floating scroll messages */}
      {[{x:620,y:200,d:"3s"},{x:680,y:195,d:"3.5s"},{x:650,y:190,d:"2.8s"}].map((s,i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width="14" height="8" fill="#D4C5A9" opacity={0.2}>
            <animate attributeName="y" values={`${s.y};${s.y - 5};${s.y}`} dur={s.d} repeatCount="indefinite" />
          </rect>
        </g>
      ))}

      {/* ── MAMMON's Treasury (front left) ── */}
      {/* Desk */}
      <rect x="110" y="450" width="70" height="28" fill="#5D3A1A" />
      <rect x="108" y="448" width="74" height="4" fill="#7B4F2A" />
      {/* Ledger book */}
      <rect x="155" y="450" width="15" height="10" fill="#3E2723" />
      <rect x="156" y="451" width="13" height="8" fill="#4E342E" />
      {/* Gold chest (overflowing) */}
      <rect x="70" y="458" width="40" height="25" fill="#8B6340" />
      <rect x="70" y="456" width="40" height="4" fill="#B8860B" />
      <rect x="87" y="457" width="6" height="2" fill="#FFD700" />
      {/* Open lid */}
      <rect x="70" y="448" width="40" height="10" fill="#A0522D" transform="rotate(-15 90 458)" />
      {/* Gold coins overflowing */}
      {[{x:75,y:455,r:3},{x:82,y:453,r:2.5},{x:90,y:452,r:3},{x:97,y:454,r:2},{x:85,y:450,r:2},{x:93,y:449,r:2.5},{x:78,y:448,r:1.8},{x:100,y:451,r:2}].map((c,i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={i % 2 === 0 ? "#FFD700" : "#DAA520"} opacity={0.8 - i * 0.03} />
      ))}
      {/* Stacked gold bars */}
      <rect x="115" y="475" width="12" height="5" fill="#DAA520" />
      <rect x="113" y="470" width="12" height="5" fill="#FFD700" />
      <rect x="116" y="465" width="12" height="5" fill="#DAA520" />
      {/* Weighing scales */}
      <rect x="160" y="440" width="2" height="18" fill="#8b7355" />
      <line x1="148" y1="440" x2="174" y2="440" stroke="#8b7355" strokeWidth="1.5" />
      <ellipse cx="150" cy="443" rx="7" ry="2.5" fill="#8b7355" />
      <ellipse cx="172" cy="442" rx="7" ry="2.5" fill="#8b7355" />
      {/* Gems scattered */}
      <rect x="130" y="476" width="4" height="4" fill="#E53935" opacity={0.7} transform="rotate(45 132 478)" />
      <rect x="142" y="480" width="3" height="3" fill="#2E7D32" opacity={0.6} transform="rotate(45 143 481)" />
      <rect x="100" y="482" width="3" height="3" fill="#1565C0" opacity={0.6} transform="rotate(45 101 483)" />
      {/* Gold shimmer glow */}
      <ellipse cx="100" cy="465" rx="50" ry="25" fill="url(#gold-shimmer)" />

      {/* ── WRAITH-EYE's Shadow Corner (front right) ── */}
      {/* Intentionally darker area */}
      <rect x="680" y="420" width="220" height="230" fill="#050508" opacity={0.5} />
      {/* Shadow pool on floor */}
      <ellipse cx="760" cy="480" rx="55" ry="28" fill="#0a0a12" opacity={0.85} />
      <ellipse cx="760" cy="480" rx="40" ry="20" fill="#050508" opacity={0.7} />
      {/* Web-like shadow patterns */}
      <path d="M 720 440 L 760 480 L 800 440" fill="none" stroke="#1a1028" strokeWidth="0.5" opacity="0.4" />
      <path d="M 730 500 L 760 480 L 790 500" fill="none" stroke="#1a1028" strokeWidth="0.5" opacity="0.4" />
      <path d="M 715 470 L 760 480 L 805 470" fill="none" stroke="#1a1028" strokeWidth="0.5" opacity="0.3" />
      <path d="M 735 445 L 760 480 L 785 445" fill="none" stroke="#1a1028" strokeWidth="0.3" opacity="0.3" />
      {/* Surveillance mirror on wall */}
      <ellipse cx="760" cy="160" rx="18" ry="22" fill="#0a0a18" stroke="#5a4a3a" strokeWidth="2" />
      <ellipse cx="760" cy="160" rx="15" ry="19" fill="#101025" />
      {/* Tiny room reflection in mirror */}
      <rect x="750" y="155" width="20" height="10" fill="#1a1028" opacity={0.3} />
      <rect x="755" y="160" width="3" height="3" fill="#FFD700" opacity={0.1} />
      <rect x="762" y="157" width="2" height="2" fill="#FF9900" opacity={0.1} />
      {/* Floating red observation orbs */}
      {[{x:735,y:440,r:5,d:"2.5s"},{x:775,y:435,r:4,d:"3s"},{x:755,y:450,r:4.5,d:"2.8s"},{x:790,y:455,r:3.5,d:"3.2s"}].map((o,i) => (
        <g key={i}>
          <circle cx={o.x} cy={o.y} r={o.r} fill="#E53935" opacity={0.35}>
            <animate attributeName="cy" values={`${o.y};${o.y - 5};${o.y}`} dur={o.d} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.2;0.35" dur={o.d} repeatCount="indefinite" />
          </circle>
          <circle cx={o.x} cy={o.y} r={o.r * 0.45} fill="#FF5252" opacity={0.7}>
            <animate attributeName="cy" values={`${o.y};${o.y - 5};${o.y}`} dur={o.d} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Red ambient glow */}
      <ellipse cx="760" cy="470" rx="60" ry="35" fill="url(#red-shadow-glow)" />

      {/* ── Weapon Rack (near entrance) ── */}
      <rect x="330" y="540" width="40" height="4" fill="#5a4a3a" />
      <rect x="330" y="530" width="3" height="14" fill="#5a4a3a" />
      <rect x="367" y="530" width="3" height="14" fill="#5a4a3a" />
      {/* Swords */}
      <line x1="338" y1="530" x2="338" y2="505" stroke="#94a3b8" strokeWidth="2" />
      <line x1="335" y1="520" x2="341" y2="520" stroke="#DAA520" strokeWidth="1.5" />
      <line x1="350" y1="530" x2="350" y2="508" stroke="#94a3b8" strokeWidth="2" />
      <line x1="347" y1="522" x2="353" y2="522" stroke="#DAA520" strokeWidth="1.5" />
      {/* Shield */}
      <circle cx="362" cy="520" r={8} fill="#172554" stroke="#DAA520" strokeWidth="1" />
      <rect x="359" y="515" width="6" height="10" fill="#DAA520" opacity="0.5" />

      {/* ── Potted Crystal Pedestal ── */}
      <rect x="555" y="525" width="16" height="20" fill="#3E2723" />
      <rect x="552" y="523" width="22" height="4" fill="#5a4a3a" />
      {/* Crystal formation */}
      <polygon points="563,523 558,508 563,500 568,508" fill="#7C3AED" opacity={0.6} />
      <polygon points="560,523 556,512 560,506 564,512" fill="#A78BFA" opacity={0.4} />
      <polygon points="566,523 570,510 566,504 562,510" fill="#8B5CF6" opacity={0.5} />
      <circle cx="563" cy="510" r="12" fill="url(#crystal-glow)" opacity={0.3}>
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* ── Wall Shields ── */}
      <circle cx="490" cy="130" r="12" fill="#5a4a3a" />
      <circle cx="490" cy="130" r="10" fill="#8B1A1A" />
      <line x1="485" y1="125" x2="495" y2="135" stroke="#DAA520" strokeWidth="1.5" />
      <line x1="495" y1="125" x2="485" y2="135" stroke="#DAA520" strokeWidth="1.5" />
      <circle cx="410" cy="130" r="12" fill="#5a4a3a" />
      <circle cx="410" cy="130" r="10" fill="#172554" />
      <rect x="407" y="123" width="6" height="14" fill="#DAA520" />

      {/* ═══════════════════════════════════════
           LAYER 10: TORCHES
         ═══════════════════════════════════════ */}
      <Torch x={70} y={130} glowId="tg0" />
      <Torch x={200} y={125} glowId="tg1" />
      <Torch x={340} y={120} glowId="tg2" />
      <Torch x={560} y={120} glowId="tg3" />
      <Torch x={700} y={125} glowId="tg4" />
      <Torch x={830} y={130} glowId="tg5" />
      <Torch x={50} y={230} glowId="tg6" />
      <Torch x={850} y={230} glowId="tg7" />

      {/* ═══════════════════════════════════════
           LAYER 11: CHANDELIER
         ═══════════════════════════════════════ */}
      <Chandelier />

      {/* ═══════════════════════════════════════
           LAYER 12: LIGHTING OVERLAYS
         ═══════════════════════════════════════ */}
      {/* Torch floor glow pools */}
      {[{x:70,y:200},{x:200,y:195},{x:340,y:190},{x:560,y:190},{x:700,y:195},{x:830,y:200},{x:50,y:290},{x:850,y:290}].map((t,i) => (
        <ellipse key={i} cx={t.x} cy={t.y + 50} rx={55} ry={22} fill="#FF990008" opacity={glowPulse}>
          <animate attributeName="rx" values="55;58;55" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
        </ellipse>
      ))}

      {/* Global ambient purple haze */}
      <rect x="0" y="0" width="900" height="650" fill="url(#center-ambient)" />

      {/* Depth fade on top (things further away are darker) */}
      <rect x="0" y="70" width="900" height="140" fill="url(#depth-fade)" />

      {/* WRAITH-EYE corner darker tint */}
      <rect x="680" y="400" width="220" height="250" fill="#0a0010" opacity={0.2} />

      {/* ═══════════════════════════════════════
           LAYER 13: CHILDREN (Generals)
         ═══════════════════════════════════════ */}
      {children}

      {/* ═══════════════════════════════════════
           LAYER 14: PARTICLES
         ═══════════════════════════════════════ */}
      {particles.map(p => {
        const lifeRatio = p.life / p.maxLife;
        const opacity = lifeRatio < 0.15 ? lifeRatio / 0.15 : lifeRatio > 0.7 ? (1 - lifeRatio) / 0.3 : 1;
        const finalOpacity = p.type === "dust" ? opacity * 0.35 : p.type === "shadow" ? opacity * 0.25 : opacity * 0.7;
        return (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={p.color}
            opacity={finalOpacity}
          />
        );
      })}

      {/* ═══════════════════════════════════════
           LAYER 15: FOG / ATMOSPHERE
         ═══════════════════════════════════════ */}
      {/* Bottom fog/mist */}
      <rect x="0" y="500" width="900" height="150" fill="url(#fog-gradient)" />

      {/* Vignette overlay */}
      <rect x="0" y="0" width="900" height="650" fill="url(#center-ambient)" opacity={0.3} />
    </svg>
  );
};

export default RoomRenderer;
