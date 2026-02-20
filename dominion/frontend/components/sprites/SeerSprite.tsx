"use client";
import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const SeerSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 160 : state === 'celebrating' ? 180 : 320;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 6;
  const floatY = state === 'idle' ? [0, -0.5, -1, -1.5, -1, -0.5, 0, 0.5][frame] : 0;
  const celebY = state === 'celebrating' ? [0, -1, -2, -3, -3, -2, -1, 0][frame] : 0;
  const yOff = floatY + celebY;

  // Rich palette
  const pal: Record<string, string> = {
    // Navy/Deep blue (cloak)
    N5: '#2C3E6E', N4: '#1E3055', N3: '#152540', N2: '#0D1A2E', N1: '#06101E',
    // Teal (trim, accents)
    T5: '#80DEEA', T4: '#26C6DA', T3: '#00ACC1', T2: '#00838F', T1: '#006064',
    // Cyan (magic, eyes, third eye)
    C5: '#E0F7FA', C4: '#80DEEA', C3: '#00E5FF', C2: '#00BCD4', C1: '#0097A7',
    // Skin (pale/ethereal)
    S5: '#FFF3E0', S4: '#F5E6D3', S3: '#E8D5BD', S2: '#CCAC8B', S1: '#A68B6B',
    // Staff brown
    W4: '#8D6E63', W3: '#6D4C41', W2: '#5D4037', W1: '#3E2723',
    // Star/constellation
    ST: '#E0E0E0', STD: '#90A4AE',
    // Dark
    K: '#080810', KD: '#1A1A2E',
    // Crystal ball
    O5: '#E0F7FA', O4: '#B2EBF2', O3: '#80DEEA', O2: '#4DD0E1', O1: '#26C6DA',
  };

  const p = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x},${y},${c}`} x={x} y={y + yOff} width={w} height={h} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // ===== DEEP HOOD (rows 3-12) =====
  // Hood peak
  pixels.push(p(29, 3, pal.N1, 4, 1));
  pixels.push(p(27, 4, pal.N1, 8, 1));
  pixels.push(p(25, 5, pal.N1, 12, 1));
  pixels.push(p(24, 6, pal.N2, 14, 1));
  pixels.push(p(23, 7, pal.N2, 16, 1));
  pixels.push(p(22, 8, pal.N3, 18, 1));
  pixels.push(p(22, 9, pal.N3, 18, 1));
  pixels.push(p(22, 10, pal.N4, 18, 1));
  pixels.push(p(23, 11, pal.N3, 16, 1));
  pixels.push(p(24, 12, pal.N2, 14, 1));

  // Hood interior shadow (deep)
  pixels.push(p(26, 7, pal.K, 10, 1));
  pixels.push(p(25, 8, pal.K, 12, 1));
  pixels.push(p(25, 9, pal.KD, 12, 1));

  // Hood border highlight
  pixels.push(p(22, 8, pal.T2)); pixels.push(p(39, 8, pal.T2));
  pixels.push(p(22, 9, pal.T2)); pixels.push(p(39, 9, pal.T2));
  pixels.push(p(22, 10, pal.T1)); pixels.push(p(39, 10, pal.T1));

  // ===== FACE (mostly hidden, rows 9-13) =====
  // Pale face visible in hood shadow
  pixels.push(p(27, 10, pal.S3, 8, 1));
  pixels.push(p(27, 11, pal.S4, 8, 1));
  pixels.push(p(28, 12, pal.S4, 6, 1));
  pixels.push(p(28, 13, pal.S3, 6, 1));

  // Glowing cyan eyes deep in hood
  if (!blink) {
    pixels.push(p(28, 10, pal.C3)); pixels.push(p(29, 10, pal.C5)); // left eye
    pixels.push(p(33, 10, pal.C5)); pixels.push(p(34, 10, pal.C3)); // right eye
  } else {
    pixels.push(p(28, 10, pal.C1)); pixels.push(p(34, 10, pal.C1));
  }

  // Third eye on forehead
  const thirdEyePhase = frame % 4;
  const teColor = [pal.C3, pal.C4, pal.C5, pal.C4][thirdEyePhase];
  const teIris = [pal.C1, pal.C2, pal.C3, pal.C2][thirdEyePhase];
  pixels.push(p(30, 8, teIris)); pixels.push(p(31, 8, teColor)); pixels.push(p(32, 8, teIris));
  pixels.push(p(31, 7, teColor)); pixels.push(p(31, 9, teColor));

  // Knowing smile
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(p(29, 13, pal.S1, 4, 1));
  } else {
    pixels.push(p(30, 13, pal.S2, 2, 1));
  }

  // Neck
  pixels.push(p(30, 14, pal.S3, 2, 1));

  // ===== CLOAK BODY (rows 15-48) =====
  for (let y = 15; y <= 48; y++) {
    const halfW = y < 20 ? 7 : y < 28 ? 8 : y < 36 ? 9 : y < 42 ? 10 : 11;
    const cx = 31;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const dist = Math.abs(x - cx);
      const isEdge = x === cx - halfW || x === cx + halfW;
      if (isEdge) {
        pixels.push(p(x, y, pal.T2));
      } else {
        const shade = dist <= 2 ? pal.N4 : dist <= 5 ? pal.N3 : pal.N2;
        const dither = (x + y) % 2 === 0;
        pixels.push(p(x, y, dist === 3 && dither ? pal.N4 : shade));
      }
    }
  }

  // Constellation pattern on cloak (tiny stars connected by lines)
  const stars = [
    [25, 20], [33, 18], [28, 25], [35, 23], [24, 30], [37, 28],
    [30, 33], [26, 36], [36, 35], [29, 40], [34, 42], [27, 44],
  ];
  const connections = [[0,1],[1,3],[2,3],[0,4],[4,2],[5,3],[6,2],[6,7],[8,5],[9,6],[10,8],[11,9]];

  // Draw constellation lines (faint)
  connections.forEach(([a, b], i) => {
    const [x1, y1] = stars[a]; const [x2, y2] = stars[b];
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    for (let s = 0; s <= steps; s += 2) {
      const lx = Math.round(x1 + (x2 - x1) * s / steps);
      const ly = Math.round(y1 + (y2 - y1) * s / steps);
      if ((lx + ly + frame) % 4 < 2) {
        pixels.push(p(lx, ly, pal.STD));
      }
    }
  });

  // Draw stars (bright dots)
  stars.forEach(([sx, sy], i) => {
    const active = state === 'working' || (i + frame) % 5 < 3;
    pixels.push(p(sx, sy, active ? pal.ST : pal.STD));
  });

  // Teal sash/belt
  for (let x = 23; x <= 39; x++) {
    pixels.push(p(x, 26, pal.T3));
    pixels.push(p(x, 27, pal.T1));
  }
  pixels.push(p(31, 26, pal.C3)); // center gem

  // ===== STAFF (shepherd's crook) =====
  if (state !== 'working') {
    // Shaft
    for (let y = 6; y <= 50; y++) {
      pixels.push(p(16, y, y % 3 === 0 ? pal.W4 : pal.W3));
    }
    // Curved top
    pixels.push(p(16, 5, pal.W3)); pixels.push(p(17, 4, pal.W3)); pixels.push(p(18, 3, pal.W3));
    pixels.push(p(19, 3, pal.W4)); pixels.push(p(20, 4, pal.W4));
    // Small orb nested in curve
    const orbC = [pal.C3, pal.C4, pal.C5, pal.C4][frame % 4];
    pixels.push(p(19, 5, orbC)); pixels.push(p(20, 5, pal.C2));
  }

  // ===== HANDS / ARMS =====
  if (state === 'working') {
    // Both hands extended toward crystal ball
    pixels.push(p(22, 18, pal.N3)); pixels.push(p(21, 20, pal.N2)); pixels.push(p(20, 22, pal.N3));
    pixels.push(p(19, 24, pal.S4)); pixels.push(p(18, 24, pal.S3)); pixels.push(p(20, 24, pal.S3));
    pixels.push(p(40, 18, pal.N3)); pixels.push(p(41, 20, pal.N2)); pixels.push(p(42, 22, pal.N3));
    pixels.push(p(43, 24, pal.S4)); pixels.push(p(44, 24, pal.S3)); pixels.push(p(42, 24, pal.S3));
    // Magic streams from hands to ball
    for (let i = 0; i < 4; i++) {
      const mx = 20 + i * 2 + (frame % 2);
      pixels.push(p(mx, 25, pal.C3));
      pixels.push(p(43 - i * 2 - (frame % 2), 25, pal.C3));
    }
  } else if (state === 'thinking') {
    pixels.push(p(40, 18, pal.N3)); pixels.push(p(41, 17, pal.N2)); pixels.push(p(38, 14, pal.S4));
    pixels.push(p(22, 18, pal.N3)); pixels.push(p(21, 20, pal.N2)); pixels.push(p(20, 22, pal.S4));
    // Thought particles
    if (frame % 3 === 0) pixels.push(p(42, 10, pal.C4));
    if (frame % 3 === 1) pixels.push(p(44, 8, pal.C3));
  } else if (state === 'celebrating') {
    pixels.push(p(40, 16, pal.N3)); pixels.push(p(42, 14, pal.N2)); pixels.push(p(43, 12, pal.S4));
    pixels.push(p(22, 16, pal.N3)); pixels.push(p(20, 14, pal.N2)); pixels.push(p(19, 12, pal.S4));
  } else if (state === 'walking') {
    const aSwing = frame % 2;
    pixels.push(p(40, 20 + aSwing, pal.N3)); pixels.push(p(41, 24 + aSwing, pal.S4));
    pixels.push(p(22, 20 - aSwing, pal.N3)); pixels.push(p(17, 22 - aSwing, pal.S4)); // left hand on staff
  } else {
    // Idle: left hand on staff, right hand gesturing
    pixels.push(p(22, 18, pal.N3)); pixels.push(p(20, 20, pal.N2)); pixels.push(p(17, 22, pal.S4));
    pixels.push(p(40, 18, pal.N3)); pixels.push(p(41, 20, pal.N2)); pixels.push(p(41, 22, pal.S4));
  }

  // Robe bottom / feet hidden
  pixels.push(p(21, 49, pal.N1, 20, 1));
  pixels.push(p(22, 50, pal.N1, 18, 1));

  // Walking legs
  if (state === 'walking') {
    const wf = frame % 4;
    const lx = wf < 2 ? 27 : 29;
    const rx = wf < 2 ? 35 : 33;
    pixels.push(p(lx, 49, pal.N1, 3, 1)); pixels.push(p(lx, 50, '#1A237E', 3, 1));
    pixels.push(p(rx, 49, pal.N1, 3, 1)); pixels.push(p(rx, 50, '#1A237E', 3, 1));
  }

  // ===== CRYSTAL BALL (detailed, 5x5 with swirl) =====
  const orbX = state === 'working' ? 27 : 46;
  const orbY = state === 'working' ? 28 : (14 + [0, 0, 1, 1, 0, 0, -1, -1][frame]);
  const swirlPhase = frame % 4;

  // Ball outline
  pixels.push(p(orbX + 1, orbY, pal.C1, 3, 1));
  pixels.push(p(orbX, orbY + 1, pal.C1)); pixels.push(p(orbX + 4, orbY + 1, pal.C1));
  pixels.push(p(orbX, orbY + 2, pal.C1)); pixels.push(p(orbX + 4, orbY + 2, pal.C1));
  pixels.push(p(orbX, orbY + 3, pal.C1)); pixels.push(p(orbX + 4, orbY + 3, pal.C1));
  pixels.push(p(orbX + 1, orbY + 4, pal.C1, 3, 1));

  // Ball interior
  const orbColors = [pal.O2, pal.O3, pal.O4, pal.O5];
  pixels.push(p(orbX + 1, orbY + 1, orbColors[(swirlPhase + 0) % 4]));
  pixels.push(p(orbX + 2, orbY + 1, orbColors[(swirlPhase + 1) % 4]));
  pixels.push(p(orbX + 3, orbY + 1, orbColors[(swirlPhase + 2) % 4]));
  pixels.push(p(orbX + 1, orbY + 2, orbColors[(swirlPhase + 3) % 4]));
  pixels.push(p(orbX + 2, orbY + 2, pal.C5)); // bright center
  pixels.push(p(orbX + 3, orbY + 2, orbColors[(swirlPhase + 1) % 4]));
  pixels.push(p(orbX + 1, orbY + 3, orbColors[(swirlPhase + 2) % 4]));
  pixels.push(p(orbX + 2, orbY + 3, orbColors[(swirlPhase + 3) % 4]));
  pixels.push(p(orbX + 3, orbY + 3, orbColors[(swirlPhase + 0) % 4]));

  // Highlight
  pixels.push(p(orbX + 1, orbY + 1, '#FFFFFF', 1, 1));

  // ===== GLOW EFFECTS =====
  const glows: React.ReactNode[] = [];
  // Third eye glow
  glows.push(<circle key="te" cx={31.5} cy={8.5 + yOff} r={3} fill={teColor} opacity={0.3} />);
  // Eye glow
  if (!blink) {
    glows.push(<circle key="el" cx={29} cy={10.5 + yOff} r={2} fill={pal.C3} opacity={0.35} />);
    glows.push(<circle key="er" cx={34} cy={10.5 + yOff} r={2} fill={pal.C3} opacity={0.35} />);
  }
  // Crystal ball glow
  glows.push(<circle key="ob" cx={orbX + 2.5} cy={orbY + 2.5 + yOff} r={state === 'working' ? 6 : 4} fill={pal.C3} opacity={state === 'working' ? 0.3 : 0.15} />);
  // Staff orb glow
  if (state !== 'working') {
    glows.push(<circle key="so" cx={19.5} cy={5 + yOff} r={2} fill={pal.C4} opacity={0.25} />);
  }
  // Working: constellation patterns light up
  if (state === 'working') {
    glows.push(<rect key="cg" x={22} y={16 + yOff} width={18} height={30} fill={pal.C3} opacity={0.04} />);
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="64" height="64" fill="transparent" />
      {pixels}
      {glows}
    </svg>
  );
};

export default SeerSprite;
