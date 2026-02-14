"use client";
import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const PhantomSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 150 : state === 'walking' ? 200 : state === 'celebrating' ? 170 : 300;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 4;
  const celebY = state === 'celebrating' ? [0, -1, -2, -3, -3, -2, -1, 0][frame] : 0;
  const breathe = state === 'idle' ? [0, 0, 0.3, 0.3, 0, 0, -0.3, -0.3][frame] : 0;
  const yOff = celebY + breathe;

  const pal: Record<string, string> = {
    // Dark grays/blacks (cloak/jacket)
    D5: '#4A4A4A', D4: '#363636', D3: '#2A2A2A', D2: '#1E1E1E', D1: '#111111',
    // Green (tech/visor/circuits)
    G5: '#B9F6CA', G4: '#69F0AE', G3: '#00E676', G2: '#00C853', G1: '#009624',
    // Skin
    S5: '#FFE0B2', S4: '#FFCC80', S3: '#D4A574', S2: '#B8864E', S1: '#8B6434',
    // Metal (mechanical arm)
    M5: '#E0E0E0', M4: '#BDBDBD', M3: '#9E9E9E', M2: '#757575', M1: '#424242',
    // Gunmetal
    GM: '#546E7A',
    // Dark
    K: '#0A0A0A',
    // Hood
    H3: '#333333', H2: '#222222', H1: '#151515',
  };

  const p = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x},${y},${c},${w}`} x={x} y={y + yOff} width={w} height={h} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // ===== SHORT TACTICAL HOOD (rows 4-10) =====
  pixels.push(p(28, 4, pal.H1, 6, 1));
  pixels.push(p(26, 5, pal.H1, 10, 1));
  pixels.push(p(25, 6, pal.H2, 12, 1));
  pixels.push(p(24, 7, pal.H2, 14, 1));
  pixels.push(p(24, 8, pal.H3, 14, 1));
  pixels.push(p(25, 9, pal.H3, 12, 1));

  // ===== HEAD / FACE (rows 8-16) =====
  // Face visible below visor
  pixels.push(p(27, 10, pal.S3, 8, 1));
  pixels.push(p(27, 11, pal.S4, 8, 1));
  pixels.push(p(27, 12, pal.S4, 8, 1));
  pixels.push(p(28, 13, pal.S4, 6, 1));
  pixels.push(p(28, 14, pal.S3, 6, 1));

  // Green visor/goggles (solid band across eyes with scan-line)
  pixels.push(p(25, 8, pal.G1, 12, 1));
  pixels.push(p(25, 9, pal.G2, 12, 1));
  // Scan-line animation sweeps across visor
  const scanX = 25 + (frame % 8) * 1.5;
  pixels.push(p(Math.floor(scanX), 8, pal.G4)); pixels.push(p(Math.floor(scanX), 9, pal.G5));
  pixels.push(p(Math.floor(scanX) + 1, 8, pal.G3)); pixels.push(p(Math.floor(scanX) + 1, 9, pal.G4));
  // Visor frame
  pixels.push(p(24, 8, pal.M2)); pixels.push(p(37, 8, pal.M2));
  pixels.push(p(24, 9, pal.M2)); pixels.push(p(37, 9, pal.M2));

  // Sharp features, slight smirk
  pixels.push(p(30, 12, pal.S2)); // nose shadow
  pixels.push(p(31, 12, pal.S2));
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(p(29, 13, pal.K, 4, 1)); // open mouth
  } else {
    pixels.push(p(29, 13, pal.S1)); pixels.push(p(30, 13, pal.S2)); pixels.push(p(31, 13, pal.S2)); pixels.push(p(32, 13, pal.S1)); // smirk - asymmetric
  }
  // Jawline
  pixels.push(p(27, 14, pal.S1)); pixels.push(p(34, 14, pal.S1));

  // Neck
  pixels.push(p(29, 15, pal.S3, 4, 1));

  // ===== BODY / JACKET (rows 16-38) =====
  // Slightly hunched - right shoulder higher
  for (let y = 16; y <= 38; y++) {
    const halfW = y < 20 ? 7 : y < 28 ? 8 : 9;
    const cx = 31;
    const hunch = y < 22 ? -1 : 0; // right side shifted up
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const dist = Math.abs(x - cx);
      const isEdge = x === cx - halfW || x === cx + halfW;
      if (isEdge) pixels.push(p(x, y, pal.D1));
      else {
        const shade = dist <= 2 ? pal.D4 : dist <= 5 ? pal.D3 : pal.D2;
        pixels.push(p(x, y, shade));
      }
    }
  }

  // Circuit-line patterns on jacket (animated pulse)
  const circuitPaths = [
    [[25, 20], [25, 24], [27, 24], [27, 28]],
    [[37, 19], [37, 23], [35, 23], [35, 27]],
    [[26, 32], [28, 32], [28, 36]],
    [[36, 30], [34, 30], [34, 34]],
  ];
  circuitPaths.forEach((path, pi) => {
    path.forEach(([cx, cy], i) => {
      const pulseOffset = (frame * 2 + pi * 3) % (path.length * 4);
      const dist = Math.abs(i * 4 - pulseOffset);
      const color = dist < 2 ? pal.G4 : dist < 4 ? pal.G2 : pal.G1;
      pixels.push(p(cx, cy, color));
    });
  });

  // Utility belt (row 28-29)
  for (let x = 23; x <= 39; x++) {
    pixels.push(p(x, 28, pal.D1));
    pixels.push(p(x, 29, pal.M2));
  }
  // Belt gadgets
  pixels.push(p(26, 29, pal.M4)); pixels.push(p(27, 29, pal.M3)); // small tool
  pixels.push(p(35, 29, pal.G2)); pixels.push(p(36, 29, pal.M4)); // green light + tool

  // ===== MECHANICAL LEFT ARM =====
  // Upper arm (rows 17-22)
  pixels.push(p(22, 17, pal.M3)); pixels.push(p(21, 17, pal.M2));
  pixels.push(p(21, 18, pal.M4)); pixels.push(p(20, 18, pal.M3)); pixels.push(p(22, 18, pal.M2));
  pixels.push(p(20, 19, pal.M3)); pixels.push(p(21, 19, pal.M4)); pixels.push(p(19, 19, pal.M2));
  pixels.push(p(19, 20, pal.M3)); pixels.push(p(20, 20, pal.M4)); pixels.push(p(18, 20, pal.M2));
  // Joint with green LED
  pixels.push(p(18, 21, pal.G3)); pixels.push(p(19, 21, pal.M5)); pixels.push(p(20, 21, pal.G3));
  // Forearm
  pixels.push(p(17, 22, pal.M3)); pixels.push(p(18, 22, pal.GM)); pixels.push(p(19, 22, pal.M2));
  pixels.push(p(16, 23, pal.M3)); pixels.push(p(17, 23, pal.M4)); pixels.push(p(18, 23, pal.M2));
  pixels.push(p(15, 24, pal.M3)); pixels.push(p(16, 24, pal.GM)); pixels.push(p(17, 24, pal.M2));
  // Wrist joint LED
  pixels.push(p(15, 25, pal.G3)); pixels.push(p(16, 25, pal.M5)); pixels.push(p(17, 25, pal.G3));

  // Hand (articulated fingers)
  if (state === 'working') {
    // Typing position - fingers spread on holographic keyboard
    pixels.push(p(12, 26, pal.M4)); pixels.push(p(13, 26, pal.M3)); pixels.push(p(14, 26, pal.M4));
    pixels.push(p(15, 26, pal.M3)); pixels.push(p(16, 26, pal.M4));
    pixels.push(p(12, 27, pal.G2)); // finger LED
    pixels.push(p(14, 27, pal.G2)); // finger LED
    pixels.push(p(16, 27, pal.G2)); // finger LED
  } else if (state === 'idle') {
    // Flexing/calibrating
    const flexPhase = frame % 4;
    pixels.push(p(14, 26, pal.M3)); pixels.push(p(15, 26, pal.M4)); pixels.push(p(16, 26, pal.M3));
    if (flexPhase < 2) {
      pixels.push(p(13, 26, pal.M4)); pixels.push(p(13, 27, pal.G3));
    } else {
      pixels.push(p(13, 27, pal.M4)); pixels.push(p(13, 28, pal.G3));
    }
  } else {
    pixels.push(p(14, 26, pal.M3)); pixels.push(p(15, 26, pal.M4)); pixels.push(p(16, 26, pal.M3));
    pixels.push(p(14, 27, pal.G2));
  }

  // ===== RIGHT ARM (organic) =====
  if (state === 'working') {
    pixels.push(p(40, 18, pal.D3)); pixels.push(p(41, 20, pal.D2)); pixels.push(p(42, 22, pal.D3));
    pixels.push(p(43, 24, pal.S4)); pixels.push(p(43, 25, pal.S3));
  } else if (state === 'thinking') {
    pixels.push(p(40, 18, pal.D3)); pixels.push(p(40, 17, pal.D2)); pixels.push(p(36, 14, pal.S4));
  } else if (state === 'celebrating') {
    pixels.push(p(40, 16, pal.D3)); pixels.push(p(42, 14, pal.D2)); pixels.push(p(43, 12, pal.S4));
  } else {
    pixels.push(p(40, 18, pal.D3)); pixels.push(p(41, 20, pal.D2)); pixels.push(p(41, 22, pal.S4));
  }

  // ===== HOLOGRAPHIC SCREENS (working state) =====
  if (state === 'working') {
    // 3 floating green screens
    const screenAlpha = [0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.7, 0.8][frame];
    // Main screen
    for (let y = 16; y <= 22; y++) {
      pixels.push(p(8, y, pal.G2));
      pixels.push(p(9, y, pal.G1));
      for (let x = 10; x <= 18; x++) {
        // Scrolling code lines
        const isCode = (x + y + frame * 2) % 3 === 0;
        pixels.push(p(x, y, isCode ? pal.G4 : pal.G1));
      }
      pixels.push(p(19, y, pal.G2));
    }
    // Side screen (smaller)
    for (let y = 18; y <= 22; y++) {
      pixels.push(p(5, y, pal.G1));
      for (let x = 6; x <= 7; x++) {
        const isCode = (x + y + frame) % 2 === 0;
        pixels.push(p(x, y, isCode ? pal.G3 : pal.G1));
      }
    }
    // Top screen
    for (let x = 10; x <= 16; x++) {
      pixels.push(p(x, 14, pal.G1));
      pixels.push(p(x, 15, (x + frame) % 2 === 0 ? pal.G3 : pal.G1));
    }
  }

  // ===== LEGS (rows 39-48) =====
  if (state === 'walking') {
    const wf = frame % 4;
    // Left leg
    const lx = wf < 2 ? 26 : 29;
    pixels.push(p(lx, 39, pal.D2, 4, 3));
    pixels.push(p(lx, 42, pal.D1, 4, 3));
    pixels.push(p(lx, 45, pal.K, 5, 2)); // boot
    // Right leg
    const rx = wf < 2 ? 33 : 30;
    pixels.push(p(rx, 39, pal.D2, 4, 3));
    pixels.push(p(rx, 42, pal.D1, 4, 3));
    pixels.push(p(rx, 45, pal.K, 5, 2)); // boot
  } else {
    // Standing
    pixels.push(p(26, 39, pal.D2, 4, 3)); pixels.push(p(26, 42, pal.D1, 4, 3));
    pixels.push(p(25, 45, pal.K, 5, 2)); // left boot
    pixels.push(p(33, 39, pal.D2, 4, 3)); pixels.push(p(33, 42, pal.D1, 4, 3));
    pixels.push(p(33, 45, pal.K, 5, 2)); // right boot
    // Boot detail
    pixels.push(p(25, 45, pal.D5)); pixels.push(p(33, 45, pal.D5));
  }

  // ===== GLOW EFFECTS =====
  const glows: React.ReactNode[] = [];

  // Visor glow
  glows.push(<rect key="vg" x={25} y={8 + yOff} width={12} height={2} fill={pal.G3} opacity={0.2} rx={0.5} />);
  // Scan-line highlight
  glows.push(<rect key="sc" x={Math.floor(scanX)} y={8 + yOff} width={2} height={2} fill={pal.G5} opacity={0.3} />);

  // Mechanical arm joint glows
  glows.push(<circle key="j1" cx={19} cy={21.5 + yOff} r={1.5} fill={pal.G4} opacity={0.4} />);
  glows.push(<circle key="j2" cx={16} cy={25.5 + yOff} r={1.5} fill={pal.G4} opacity={0.4} />);

  // Working: screen glow
  if (state === 'working') {
    glows.push(<rect key="sg" x={7} y={14 + yOff} width={14} height={10} fill={pal.G3} opacity={0.08} />);
  }

  // Circuit pulse glow
  circuitPaths.forEach((path, pi) => {
    const pulseIdx = (frame + pi) % path.length;
    const [px2, py2] = path[pulseIdx];
    glows.push(<circle key={`cp${pi}`} cx={px2 + 0.5} cy={py2 + 0.5 + yOff} r={1.5} fill={pal.G4} opacity={0.25} />);
  });

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="64" height="64" fill="transparent" />
      {pixels}
      {glows}
    </svg>
  );
};

export default PhantomSprite;
