"use client";
import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const MammonSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 160 : state === 'celebrating' ? 180 : 320;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 3;
  const celebY = state === 'celebrating' ? [0, -1, -2, -2, -1, 0, 0, 0][frame] : 0;
  const breathe = state === 'idle' ? [0, 0.2, 0.4, 0.6, 0.4, 0.2, 0, 0][frame] : 0;
  const yOff = celebY + breathe;

  const pal: Record<string, string> = {
    // Gold scales
    GS5: '#FFF8C4', GS4: '#FFD700', GS3: '#DAA520', GS2: '#B8860B', GS1: '#8B6914',
    // Red/burgundy (vest)
    R5: '#EF9A9A', R4: '#EF5350', R3: '#C62828', R2: '#8E1616', R1: '#5D0F0F',
    // White (shirt)
    W4: '#FFFFFF', W3: '#F5F5F5', W2: '#E0E0E0', W1: '#BDBDBD',
    // Skin/scales base
    SK5: '#FFE082', SK4: '#FFD54F', SK3: '#FFC107', SK2: '#FFA000', SK1: '#E65100',
    // Horn
    H3: '#D7CCC8', H2: '#BCAAA4', H1: '#8D6E63',
    // Eye
    E4: '#FF5252', E3: '#D32F2F', E2: '#B71C1C',
    // Monocle
    MO: '#E0E0E0', MOF: '#90CAF9', MOC: '#9E9E9E',
    // Coin gold
    C5: '#FFF9C4', C4: '#FFD700', C3: '#DAA520', C2: '#B8860B',
    // Dark
    K: '#0A0A0A', KD: '#2A1A00',
    // Tail
    T4: '#DAA520', T3: '#B8860B', T2: '#8B6914', T1: '#6B5010',
    // Tooth
    TH: '#F5F5F5',
    // Abacus
    AB: '#5D4037', ABB: '#E53935',
  };

  const p = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x},${y},${c},${w}`} x={x} y={y + yOff} width={w} height={h} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // ===== HORNS (rows 4-8) =====
  pixels.push(p(25, 4, pal.H1)); pixels.push(p(26, 5, pal.H2)); pixels.push(p(27, 6, pal.H3));
  pixels.push(p(37, 4, pal.H1)); pixels.push(p(36, 5, pal.H2)); pixels.push(p(35, 6, pal.H3));

  // ===== HEAD: Dragon face (rows 6-16) =====
  // Rounded wide head
  for (let y = 6; y <= 16; y++) {
    const halfW = y < 8 ? 5 : y < 11 ? 7 : y < 14 ? 6 : 5;
    const cx = 31;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      // Checkerboard scales on head
      const isScale = (x + y) % 2 === 0;
      const dist = Math.abs(x - cx);
      const isEdge = x === cx - halfW || x === cx + halfW;
      if (isEdge) {
        pixels.push(p(x, y, pal.GS1));
      } else {
        pixels.push(p(x, y, isScale ? pal.GS3 : pal.GS4));
      }
    }
  }

  // Short snout (extends forward slightly)
  pixels.push(p(27, 14, pal.GS3, 8, 1));
  pixels.push(p(28, 15, pal.GS2, 6, 1));
  pixels.push(p(29, 16, pal.SK2, 4, 1));

  // Nostrils
  pixels.push(p(29, 15, pal.K)); pixels.push(p(32, 15, pal.K));

  // Small sharp teeth
  pixels.push(p(28, 16, pal.TH)); pixels.push(p(30, 16, pal.TH)); pixels.push(p(32, 16, pal.TH)); pixels.push(p(34, 16, pal.TH));

  // Eyes
  const eyeGleam = state === 'working' ? pal.C5 : pal.E3;
  if (!blink) {
    // Left eye
    pixels.push(p(26, 9, pal.K)); pixels.push(p(27, 9, '#FFFFFF')); pixels.push(p(28, 9, pal.E3)); pixels.push(p(29, 9, pal.K));
    pixels.push(p(27, 10, pal.E4)); pixels.push(p(28, 10, pal.GS4)); // gold pupil
    // Right eye
    pixels.push(p(33, 9, pal.K)); pixels.push(p(34, 9, pal.E3)); pixels.push(p(35, 9, '#FFFFFF')); pixels.push(p(36, 9, pal.K));
    pixels.push(p(34, 10, pal.GS4)); pixels.push(p(35, 10, pal.E4)); // gold pupil

    // Monocle on right eye
    pixels.push(p(32, 8, pal.MO)); pixels.push(p(33, 8, pal.MOF)); pixels.push(p(34, 8, pal.MOF));
    pixels.push(p(35, 8, pal.MOF)); pixels.push(p(36, 8, pal.MO));
    pixels.push(p(32, 9, pal.MO)); pixels.push(p(37, 9, pal.MO));
    pixels.push(p(32, 10, pal.MO)); pixels.push(p(37, 10, pal.MO));
    pixels.push(p(33, 11, pal.MO)); pixels.push(p(34, 11, pal.MOF)); pixels.push(p(35, 11, pal.MOF)); pixels.push(p(36, 11, pal.MO));
    // Monocle chain going to vest
    pixels.push(p(37, 11, pal.MOC)); pixels.push(p(37, 12, pal.MOC)); pixels.push(p(38, 13, pal.MOC));
    pixels.push(p(38, 14, pal.MOC)); pixels.push(p(38, 15, pal.MOC));
  } else {
    pixels.push(p(26, 10, pal.K, 4, 1)); pixels.push(p(33, 10, pal.K, 4, 1));
  }

  // Satisfied/smug expression
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(p(29, 14, pal.K, 4, 1)); // open mouth
    pixels.push(p(28, 15, pal.TH)); pixels.push(p(33, 15, pal.TH));
  }

  // ===== NECK (row 17) =====
  pixels.push(p(28, 17, pal.GS3, 6, 1));

  // ===== WHITE SHIRT COLLAR (row 18) =====
  pixels.push(p(26, 18, pal.W3, 10, 1));
  pixels.push(p(25, 18, pal.W2)); pixels.push(p(36, 18, pal.W2));
  // Collar points
  pixels.push(p(27, 19, pal.W4)); pixels.push(p(35, 19, pal.W4));

  // ===== RED/BURGUNDY VEST (rows 19-36) =====
  for (let y = 19; y <= 36; y++) {
    // Stocky wide body
    const halfW = y < 24 ? 8 : y < 30 ? 10 : y < 34 ? 11 : 10;
    const cx = 31;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const dist = Math.abs(x - cx);
      const isEdge = x === cx - halfW || x === cx + halfW;
      if (isEdge) {
        pixels.push(p(x, y, pal.R1));
      } else if (dist <= 1) {
        // Center seam
        pixels.push(p(x, y, pal.R2));
      } else {
        const shade = dist <= 4 ? pal.R3 : dist <= 7 ? pal.R2 : pal.R1;
        pixels.push(p(x, y, shade));
      }
    }
  }

  // Gold buttons (4)
  for (let i = 0; i < 4; i++) {
    const by = 21 + i * 4;
    pixels.push(p(31, by, pal.GS4)); pixels.push(p(32, by, pal.GS5));
  }

  // Vest pocket (monocle chain ends here)
  pixels.push(p(37, 20, pal.R1, 2, 2));
  pixels.push(p(38, 20, pal.GS3)); // chain end

  // Slightly rounded belly
  for (let y = 28; y <= 33; y++) {
    const bulge = y < 31 ? 1 : 0;
    pixels.push(p(31 - 5 - bulge, y, pal.R4));
    pixels.push(p(31 + 5 + bulge, y, pal.R4));
  }

  // ===== ARMS with scales (rows 19-30) =====
  // Left arm
  for (let y = 19; y <= 28; y++) {
    const ax = 22 - Math.round((y - 19) * 0.3);
    const isScale = (ax + y) % 2 === 0;
    pixels.push(p(ax, y, isScale ? pal.GS3 : pal.GS4));
    pixels.push(p(ax + 1, y, isScale ? pal.GS4 : pal.GS3));
  }
  // Right arm
  for (let y = 19; y <= 28; y++) {
    const ax = 40 + Math.round((y - 19) * 0.3);
    const isScale = (ax + y) % 2 === 0;
    pixels.push(p(ax, y, isScale ? pal.GS3 : pal.GS4));
    pixels.push(p(ax - 1, y, isScale ? pal.GS4 : pal.GS3));
  }

  // Hands
  if (state === 'working') {
    // Holding abacus
    pixels.push(p(19, 29, pal.GS4, 2, 1)); pixels.push(p(43, 29, pal.GS4, 2, 1));
    // Abacus frame
    pixels.push(p(17, 28, pal.AB, 1, 8));
    pixels.push(p(45, 28, pal.AB, 1, 8));
    pixels.push(p(18, 28, pal.AB, 27, 1));
    pixels.push(p(18, 35, pal.AB, 27, 1));
    // Abacus rods and beads
    for (let rod = 0; rod < 5; rod++) {
      const rx = 20 + rod * 5;
      pixels.push(p(rx, 29, pal.AB, 1, 6));
      // Beads (animated sliding)
      const beadPos = (frame + rod) % 4;
      pixels.push(p(rx, 29 + beadPos, pal.ABB, 1, 1));
      pixels.push(p(rx, 30 + beadPos, pal.C4, 1, 1));
    }
  } else if (state === 'idle') {
    // Polishing monocle (hand near face)
    const polishPhase = frame % 4;
    if (polishPhase < 2) {
      pixels.push(p(40, 10, pal.GS4)); pixels.push(p(41, 10, pal.GS3));
    } else {
      pixels.push(p(39, 11, pal.GS4)); pixels.push(p(40, 11, pal.GS3));
    }
    pixels.push(p(19, 29, pal.GS4, 2, 1));
  } else {
    pixels.push(p(19, 29, pal.GS4, 2, 1)); pixels.push(p(43, 29, pal.GS4, 2, 1));
  }

  // ===== DRAGON LEGS with scales (rows 37-48) =====
  for (let y = 37; y <= 46; y++) {
    // Left leg
    for (let x = 25; x <= 29; x++) {
      const isScale = (x + y) % 2 === 0;
      pixels.push(p(x, y, isScale ? pal.GS3 : pal.GS2));
    }
    // Right leg
    for (let x = 33; x <= 37; x++) {
      const isScale = (x + y) % 2 === 0;
      pixels.push(p(x, y, isScale ? pal.GS3 : pal.GS2));
    }
  }
  // Clawed feet
  pixels.push(p(24, 47, pal.GS1, 7, 2)); pixels.push(p(32, 47, pal.GS1, 7, 2));
  pixels.push(p(24, 47, pal.K)); pixels.push(p(26, 47, pal.K)); pixels.push(p(28, 47, pal.K)); // claws
  pixels.push(p(32, 47, pal.K)); pixels.push(p(34, 47, pal.K)); pixels.push(p(36, 47, pal.K));

  if (state === 'walking') {
    const wf = frame % 4;
    if (wf < 2) {
      pixels.push(p(25, 45, pal.GS2, 5, 2)); pixels.push(p(35, 43, pal.GS2, 5, 2));
    } else {
      pixels.push(p(25, 43, pal.GS2, 5, 2)); pixels.push(p(35, 45, pal.GS2, 5, 2));
    }
  }

  // ===== TAIL (curls behind) =====
  const tailWave = Math.sin(frame * 0.6) * 1.5;
  for (let i = 0; i < 8; i++) {
    const tx = 42 + i + Math.round(Math.sin((i + frame * 0.8) * 0.7) * tailWave);
    const ty = 38 + Math.round(Math.sin(i * 0.5) * 2);
    if (tx < 64 && ty < 64) {
      const isScale = (tx + ty) % 2 === 0;
      pixels.push(p(tx, ty, isScale ? pal.T3 : pal.T4));
      pixels.push(p(tx, ty + 1, isScale ? pal.T2 : pal.T3));
    }
  }

  // ===== FLOATING COINS (3-5) =====
  const coinCount = 5;
  const coinSpeed = state === 'working' ? 0.6 : 0.25;
  const coinR = state === 'working' ? 16 : 12;

  for (let i = 0; i < coinCount; i++) {
    const angle = frame * coinSpeed + i * (Math.PI * 2 / coinCount);
    const cx = Math.round(31 + Math.cos(angle) * coinR);
    const cy = Math.round(20 + Math.sin(angle) * coinR * 0.4);
    if (cx >= 1 && cx < 62 && cy >= 1 && cy < 62) {
      // Coin: 3x3 circle with detail
      pixels.push(p(cx, cy, pal.C3)); pixels.push(p(cx + 1, cy, pal.C4)); pixels.push(p(cx + 2, cy, pal.C3));
      pixels.push(p(cx, cy + 1, pal.C4)); pixels.push(p(cx + 1, cy + 1, pal.C5)); pixels.push(p(cx + 2, cy + 1, pal.C2));
      pixels.push(p(cx, cy + 2, pal.C2)); pixels.push(p(cx + 1, cy + 2, pal.C3)); pixels.push(p(cx + 2, cy + 2, pal.C2));
      // $ symbol
      pixels.push(p(cx + 1, cy + 1, pal.C2));
    }
  }

  // ===== GLOW EFFECTS =====
  const glows: React.ReactNode[] = [];

  // Eye gleam
  if (!blink) {
    glows.push(<circle key="el" cx={28} cy={9.5 + yOff} r={1.5} fill={eyeGleam} opacity={0.3} />);
    glows.push(<circle key="er" cx={35} cy={9.5 + yOff} r={1.5} fill={eyeGleam} opacity={0.3} />);
  }

  // Monocle glint
  if (!blink && frame % 4 === 0) {
    glows.push(<circle key="mg" cx={35} cy={9.5 + yOff} r={3} fill="#FFFFFF" opacity={0.15} />);
  }

  // Coin glows
  for (let i = 0; i < coinCount; i++) {
    const angle = frame * coinSpeed + i * (Math.PI * 2 / coinCount);
    const cx = 31 + Math.cos(angle) * coinR + 1;
    const cy = 20 + Math.sin(angle) * coinR * 0.4 + 1;
    if (cx >= 1 && cx < 63 && cy >= 1 && cy < 63) {
      glows.push(<circle key={`cg${i}`} cx={cx} cy={cy + yOff} r={2} fill={pal.C4} opacity={0.15} />);
    }
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="64" height="64" fill="transparent" />
      {pixels}
      {glows}
    </svg>
  );
};

export default MammonSprite;
