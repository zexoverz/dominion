"use client";
import React, { useState, useEffect, useMemo } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const ThroneSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 180 : state === 'walking' ? 220 : state === 'celebrating' ? 160 : 350;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 5;
  const breathe = state === 'idle' ? [0, 0, 0.3, 0.3, 0.5, 0.5, 0.3, 0][frame] : 0;
  const celebJump = state === 'celebrating' ? [0, -1, -2, -3, -3, -2, -1, 0][frame] : 0;
  const walkBob = state === 'walking' ? [0, -0.5, 0, 0.5, 0, -0.5, 0, 0.5][frame] : 0;
  const yOff = breathe + celebJump + walkBob;

  // Rich palette - 5 shades per color family
  const pal: Record<string, string> = {
    // Gold (crown, trim)
    G5: '#FFF8C4', G4: '#FFD700', G3: '#DAA520', G2: '#B8860B', G1: '#8B6914',
    // Purple (robes)
    P5: '#C084FC', P4: '#9B59B6', P3: '#7B2FB0', P2: '#5B21B6', P1: '#3B0764',
    // Cape purple
    C5: '#D8B4FE', C4: '#A855F7', C3: '#7E22CE', C2: '#581C87', C1: '#3B0764',
    // Skin
    S5: '#FAEBD7', S4: '#F2D2A9', S3: '#D4A574', S2: '#B8864E', S1: '#8B6434',
    // Hair
    H3: '#3D2352', H2: '#2C1840', H1: '#1A0E2E',
    // Red (jewels)
    R4: '#FF6B6B', R3: '#E53935', R2: '#B71C1C', R1: '#7F0000',
    // Boot
    B3: '#6D4C41', B2: '#3E2723', B1: '#1B0E08',
    // Dark/outline
    K: '#0A0A0A', W: '#FFFFFF', WD: '#E0E0E0',
    // Eye gold glow
    E4: '#FFFDE7', E3: '#FFD700', E2: '#FFC107', E1: '#FF8F00',
    // Scepter orb
    O4: '#E1BEE7', O3: '#CE93D8', O2: '#AB47BC', O1: '#7B1FA2',
    // Blue jewel
    J3: '#5C6BC0', J2: '#3949AB', J1: '#1A237E',
    // Silver filigree
    F3: '#E0E0E0', F2: '#BDBDBD', F1: '#9E9E9E',
  };

  const p = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x},${y},${c}`} x={x} y={y + yOff} width={w} height={h} fill={c} />
  );

  // Row-drawing helper: each char in `data` maps to palette via map
  const row = (y: number, x0: number, data: string, map: string[]) => {
    const result: React.ReactNode[] = [];
    for (let i = 0; i < data.length; i++) {
      const idx = data[i];
      if (idx !== '.') {
        const ci = parseInt(idx, 36);
        if (!isNaN(ci) && map[ci]) {
          result.push(<rect key={`r${y}-${x0 + i}`} x={x0 + i} y={y + yOff} width={1} height={1} fill={map[ci]} />);
        }
      }
    }
    return result;
  };

  const pixels: React.ReactNode[] = [];

  // ===== CROWN (rows 2-9) =====
  // Crown palette: 0=G5 1=G4 2=G3 3=G2 4=G1 5=R3 6=R2 7=J2 8=J1 9=F3 a=F2 b=R4 c=G1
  const crownPal = [pal.G5, pal.G4, pal.G3, pal.G2, pal.G1, pal.R3, pal.R2, pal.J2, pal.J1, pal.F3, pal.F2, pal.R4, pal.G1];
  // 5-pointed crown with filigree
  //                          crown tips
  pixels.push(...row(2, 24, '..1...1...1...1...1', crownPal)); // 5 tines
  pixels.push(...row(3, 23, '.01.0101.010.0101.01', crownPal));
  pixels.push(...row(4, 22, '41121112111211121114', crownPal));
  pixels.push(...row(5, 22, '32211b52117821152233', crownPal));
  pixels.push(...row(6, 22, '43322262228122622344', crownPal));
  pixels.push(...row(7, 23, '4333333333333333334', crownPal));
  // Crown glimmer
  const glimX = [25, 28, 31, 34, 37][frame % 5];
  pixels.push(p(glimX, 3, pal.G5));
  pixels.push(p(glimX, 4, '#FFFFFF88'));

  // ===== HAIR under crown (rows 7-9) =====
  const hairPal = [pal.H1, pal.H2, pal.H3];
  pixels.push(...row(8, 22, '01222222222222222210', hairPal));
  pixels.push(...row(9, 21, '.01222222222222222210', hairPal));
  // Hair flowing behind (left and right)
  pixels.push(...row(10, 20, '00', hairPal));
  pixels.push(...row(10, 42, '00', hairPal));
  for (let y = 11; y <= 18; y++) {
    pixels.push(p(19 + (y % 2), y, pal.H1));
    pixels.push(p(43 - (y % 2), y, pal.H1));
  }

  // ===== HEAD (rows 9-16) =====
  const skinPal = [pal.S1, pal.S2, pal.S3, pal.S4, pal.S5, pal.K];
  pixels.push(...row(9, 23, '.233333333333333332', skinPal));
  pixels.push(...row(10, 22, '.23444444444444444432', skinPal));
  pixels.push(...row(11, 22, '234444444444444444432', skinPal));
  pixels.push(...row(12, 22, '234444444444444444432', skinPal));
  pixels.push(...row(13, 22, '234444444444444444432', skinPal));
  pixels.push(...row(14, 22, '.23444444444444444432', skinPal));
  pixels.push(...row(15, 23, '.2344444444444444432', skinPal));
  pixels.push(...row(16, 24, '.234444444444444432', skinPal));

  // Eyebrows (stern, thin)
  pixels.push(p(26, 11, pal.S1, 3, 1)); // left brow
  pixels.push(p(34, 11, pal.S1, 3, 1)); // right brow

  // Eyes with detail (golden glow)
  const eyeColor = [pal.E3, pal.E4, pal.E3, pal.E2, pal.E3, pal.E3, pal.E4, pal.E2][frame];
  if (!blink) {
    // Left eye
    pixels.push(p(26, 12, pal.K)); pixels.push(p(27, 12, '#FFFFFF')); pixels.push(p(28, 12, eyeColor)); pixels.push(p(29, 12, pal.K));
    pixels.push(p(26, 13, pal.S2)); pixels.push(p(27, 13, eyeColor)); pixels.push(p(28, 13, pal.K)); pixels.push(p(29, 13, pal.S2));
    // Right eye
    pixels.push(p(33, 12, pal.K)); pixels.push(p(34, 12, eyeColor)); pixels.push(p(35, 12, '#FFFFFF')); pixels.push(p(36, 12, pal.K));
    pixels.push(p(33, 13, pal.S2)); pixels.push(p(34, 13, pal.K)); pixels.push(p(35, 13, eyeColor)); pixels.push(p(36, 13, pal.S2));
  } else {
    pixels.push(p(26, 13, pal.K, 4, 1));
    pixels.push(p(33, 13, pal.K, 4, 1));
  }

  // Nose
  pixels.push(p(31, 13, pal.S3)); pixels.push(p(31, 14, pal.S2)); pixels.push(p(32, 14, pal.S3));

  // Mouth / jaw
  const mouthOpen = state === 'talking' && frame % 2 === 0;
  if (mouthOpen) {
    pixels.push(p(29, 15, pal.S2)); pixels.push(p(30, 15, pal.R2, 3, 1)); pixels.push(p(33, 15, pal.S2));
  } else {
    pixels.push(p(29, 15, pal.S2)); pixels.push(p(30, 15, pal.S1, 3, 1)); pixels.push(p(33, 15, pal.S2));
  }
  // Strong jaw line
  pixels.push(p(24, 16, pal.S1)); pixels.push(p(25, 16, pal.S2, 12, 1)); pixels.push(p(37, 16, pal.S1));

  // ===== NECK (row 17) =====
  pixels.push(p(29, 17, pal.S3, 5, 1));
  pixels.push(p(28, 17, pal.S2)); pixels.push(p(34, 17, pal.S2));

  // ===== COLLAR (row 18) =====
  pixels.push(...row(18, 22, '..12333333333333333321', [pal.G1, pal.G2, pal.G3, pal.G4, pal.G5]));

  // ===== ROBES (rows 19-42) =====
  for (let y = 19; y <= 42; y++) {
    const halfW = y < 25 ? 9 : y < 30 ? 10 : y < 36 ? 11 : 12;
    const cx = 31;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const dist = Math.abs(x - cx);
      const isEdge = x === cx - halfW || x === cx + halfW;
      const isNearEdge = x === cx - halfW + 1 || x === cx + halfW - 1;
      if (isEdge) pixels.push(p(x, y, pal.G2));
      else if (isNearEdge) pixels.push(p(x, y, pal.G3));
      else {
        // 4-shade gradient from center outward
        const shade = dist <= 2 ? pal.P4 : dist <= 5 ? pal.P3 : dist <= 7 ? pal.P2 : pal.P1;
        // Dithering for gradient transitions
        const dither = (x + y) % 2 === 0;
        const finalShade = dist === 3 && dither ? pal.P4 : dist === 6 && dither ? pal.P3 : shade;
        pixels.push(p(x, y, finalShade));
      }
    }
  }

  // Gold embroidered center line
  for (let y = 19; y <= 42; y++) {
    if (y % 3 === 0) {
      pixels.push(p(31, y, pal.G3));
    } else {
      pixels.push(p(31, y, pal.G2));
    }
  }

  // Royal crest on chest
  pixels.push(p(30, 22, pal.G4)); pixels.push(p(31, 22, pal.G5)); pixels.push(p(32, 22, pal.G4));
  pixels.push(p(29, 23, pal.G3)); pixels.push(p(31, 23, pal.R3)); pixels.push(p(33, 23, pal.G3));
  pixels.push(p(30, 24, pal.G4)); pixels.push(p(31, 24, pal.G5)); pixels.push(p(32, 24, pal.G4));

  // Gold belt with ornate buckle (rows 30-32)
  for (let x = 20; x <= 42; x++) {
    pixels.push(p(x, 30, pal.G2));
    pixels.push(p(x, 31, pal.G3));
    pixels.push(p(x, 32, pal.G1));
  }
  // Buckle
  pixels.push(p(29, 30, pal.G4)); pixels.push(p(30, 30, pal.G5)); pixels.push(p(31, 30, pal.R3)); pixels.push(p(32, 30, pal.G5)); pixels.push(p(33, 30, pal.G4));
  pixels.push(p(29, 31, pal.G3)); pixels.push(p(30, 31, pal.R3)); pixels.push(p(31, 31, pal.R4)); pixels.push(p(32, 31, pal.R3)); pixels.push(p(33, 31, pal.G3));
  pixels.push(p(29, 32, pal.G2)); pixels.push(p(30, 32, pal.G3)); pixels.push(p(31, 32, pal.G4)); pixels.push(p(32, 32, pal.G3)); pixels.push(p(33, 32, pal.G2));

  // Robe fold detail (vertical lines for wrinkle/fabric feel)
  for (let y = 33; y <= 42; y++) {
    if (y % 2 === 0) {
      pixels.push(p(26, y, pal.P1)); pixels.push(p(36, y, pal.P1));
    }
    if (y % 3 === 0) {
      pixels.push(p(28, y, pal.P2)); pixels.push(p(34, y, pal.P2));
    }
  }

  // Gold hem at bottom
  for (let x = 19; x <= 43; x++) {
    pixels.push(p(x, 43, pal.G2));
    pixels.push(p(x, 44, pal.G3));
  }

  // ===== CAPE (flowing on both sides) =====
  for (let y = 18; y <= 48; y++) {
    const capeW = y < 22 ? 2 : y < 30 ? 3 : y < 38 ? 4 : 5;
    const capeAnim = state === 'idle' ? Math.sin((frame + y * 0.3) * 0.8) * 0.8 : state === 'working' ? Math.sin((frame + y * 0.2) * 1.2) * 1.5 : 0;
    const baseLeft = 20 - capeW + Math.round(capeAnim);
    const baseRight = 42 + Math.round(-capeAnim);

    for (let i = 0; i < capeW; i++) {
      const shade = i === 0 ? pal.C5 : i === 1 ? pal.C4 : i === 2 ? pal.C3 : pal.C2;
      pixels.push(p(baseLeft + i, y, shade));
      pixels.push(p(baseRight + capeW - 1 - i, y, shade));
    }
    // Gold edge
    pixels.push(p(baseLeft, y, pal.G3));
    pixels.push(p(baseRight + capeW - 1, y, pal.G3));
  }

  // ===== ARMS =====
  const armPurple = [pal.P1, pal.P2, pal.P3, pal.P4];
  if (state === 'working') {
    // Right arm raised high with scepter
    for (let y = 19; y >= 10; y--) {
      const ax = 42 + Math.round((19 - y) * 0.4);
      pixels.push(p(ax, y, pal.P3));
      pixels.push(p(ax + 1, y, pal.P2));
    }
    pixels.push(p(46, 10, pal.S4)); pixels.push(p(47, 10, pal.S3)); // hand
    // Scepter
    for (let y = 2; y <= 10; y++) pixels.push(p(48, y, y % 2 === 0 ? pal.G3 : pal.G4));
    // Spiral detail
    pixels.push(p(47, 6, pal.G2)); pixels.push(p(49, 8, pal.G2));
    // Scepter orb (glowing purple)
    pixels.push(p(47, 0, pal.O3)); pixels.push(p(48, 0, pal.O4)); pixels.push(p(49, 0, pal.O3));
    pixels.push(p(47, 1, pal.O4)); pixels.push(p(48, 1, '#E1BEE7')); pixels.push(p(49, 1, pal.O4));
    pixels.push(p(47, 2, pal.O3)); pixels.push(p(48, 2, pal.O2)); pixels.push(p(49, 2, pal.O3));
    // Energy particles
    const ep = frame % 4;
    pixels.push(p(46 + ep, -1 + (ep % 2), pal.P5));
    pixels.push(p(50 - ep, ep, pal.O4));
    if (frame % 2 === 0) pixels.push(p(45, 0, pal.G5));
    // Left arm at side
    pixels.push(p(20, 22, pal.P3)); pixels.push(p(19, 24, pal.P2)); pixels.push(p(18, 26, pal.S4));
  } else if (state === 'thinking') {
    // Right hand to chin
    pixels.push(p(42, 19, pal.P3)); pixels.push(p(42, 18, pal.P2)); pixels.push(p(41, 17, pal.P3));
    pixels.push(p(38, 15, pal.S4)); pixels.push(p(39, 15, pal.S3)); // hand near face
    // Left arm holds scepter
    pixels.push(p(20, 22, pal.P3)); pixels.push(p(19, 24, pal.P2)); pixels.push(p(18, 26, pal.S4));
    for (let y = 5; y <= 26; y++) pixels.push(p(17, y, y % 2 === 0 ? pal.G3 : pal.G4));
    pixels.push(p(16, 4, pal.O3)); pixels.push(p(17, 4, pal.O4)); pixels.push(p(18, 4, pal.O3));
    pixels.push(p(17, 3, pal.O2));
    // Thought sparkle
    if (frame % 3 === 0) pixels.push(p(44, 8, pal.G5));
    if (frame % 3 === 1) pixels.push(p(46, 6, pal.G4));
  } else if (state === 'celebrating') {
    // Both arms raised
    pixels.push(p(42, 16, pal.P3)); pixels.push(p(43, 14, pal.P2)); pixels.push(p(44, 12, pal.S4));
    pixels.push(p(20, 16, pal.P3)); pixels.push(p(19, 14, pal.P2)); pixels.push(p(18, 12, pal.S4));
    // Scepter in right hand, high
    for (let y = 4; y <= 12; y++) pixels.push(p(45, y, pal.G4));
    pixels.push(p(44, 3, pal.O3)); pixels.push(p(45, 3, pal.O4)); pixels.push(p(46, 3, pal.O3));
    // Sparkles
    if (frame % 2 === 0) {
      pixels.push(p(15, 8, pal.G5)); pixels.push(p(48, 5, pal.G5));
      pixels.push(p(12, 12, pal.G4)); pixels.push(p(50, 8, pal.G4));
    }
    if (frame % 3 === 0) {
      pixels.push(p(16, 4, pal.G5)); pixels.push(p(47, 2, pal.R4));
    }
  } else if (state === 'walking') {
    // Arms swinging opposite to legs
    const armSwing = frame % 2;
    // Right arm
    pixels.push(p(42, 20 + armSwing, pal.P3)); pixels.push(p(43, 23 + armSwing, pal.P2)); pixels.push(p(43, 26 + armSwing, pal.S4));
    // Left arm
    pixels.push(p(20, 20 - armSwing, pal.P3)); pixels.push(p(19, 23 - armSwing, pal.P2)); pixels.push(p(19, 26 - armSwing, pal.S4));
    // Scepter in right hand
    for (let y = 14; y <= 26 + armSwing; y++) pixels.push(p(44, y, pal.G4));
    pixels.push(p(43, 13, pal.O3)); pixels.push(p(44, 13, pal.O4)); pixels.push(p(45, 13, pal.O3));
  } else {
    // Idle: scepter in right hand, at rest
    pixels.push(p(42, 20, pal.P3)); pixels.push(p(42, 22, pal.P2)); pixels.push(p(43, 24, pal.S4));
    // Scepter
    for (let y = 8; y <= 24; y++) pixels.push(p(44, y, y % 2 === 0 ? pal.G3 : pal.G4));
    pixels.push(p(44, 7, pal.G5));
    // Scepter orb
    pixels.push(p(43, 5, pal.O3)); pixels.push(p(44, 5, pal.O4)); pixels.push(p(45, 5, pal.O3));
    pixels.push(p(43, 6, pal.O2)); pixels.push(p(44, 6, '#E1BEE7')); pixels.push(p(45, 6, pal.O2));
    pixels.push(p(44, 4, pal.O1));
    // Left arm
    pixels.push(p(20, 20, pal.P3)); pixels.push(p(20, 22, pal.P2)); pixels.push(p(19, 24, pal.S4));
  }

  // ===== BOOTS (rows 45-48) =====
  if (state === 'walking') {
    const wf = frame % 4;
    const lx = wf < 2 ? 26 : 28;
    const rx = wf < 2 ? 34 : 32;
    pixels.push(p(lx, 45, pal.B2, 4, 1)); pixels.push(p(lx, 46, pal.B1, 4, 1));
    pixels.push(p(lx, 45, pal.B3)); // boot highlight
    pixels.push(p(lx, 46, pal.G2)); // gold trim
    pixels.push(p(rx, 45, pal.B2, 4, 1)); pixels.push(p(rx, 46, pal.B1, 4, 1));
    pixels.push(p(rx, 45, pal.B3));
    pixels.push(p(rx, 46, pal.G2));
  } else {
    // Standing boots peeking under robe
    pixels.push(p(25, 45, pal.B3)); pixels.push(p(26, 45, pal.B2, 3, 1)); pixels.push(p(29, 45, pal.B1));
    pixels.push(p(25, 46, pal.G2)); pixels.push(p(26, 46, pal.B1, 3, 1)); pixels.push(p(29, 46, pal.B1));
    pixels.push(p(33, 45, pal.B3)); pixels.push(p(34, 45, pal.B2, 3, 1)); pixels.push(p(37, 45, pal.B1));
    pixels.push(p(33, 46, pal.G2)); pixels.push(p(34, 46, pal.B1, 3, 1)); pixels.push(p(37, 46, pal.B1));
  }

  // ===== GLOW EFFECTS =====
  const glows: React.ReactNode[] = [];
  // Eye glow
  if (!blink) {
    glows.push(<circle key="el" cx={28} cy={12.5 + yOff} r={2.5} fill={eyeColor} opacity={0.3} />);
    glows.push(<circle key="er" cx={35} cy={12.5 + yOff} r={2.5} fill={eyeColor} opacity={0.3} />);
  }
  // Crown glow
  glows.push(<rect key="cg" x={22} y={4 + yOff} width={19} height={4} fill={pal.G5} opacity={0.06} rx={1} />);
  // Working: scepter energy
  if (state === 'working') {
    glows.push(<circle key="so1" cx={48} cy={1 + yOff} r={5} fill={pal.O4} opacity={0.3} />);
    glows.push(<circle key="so2" cx={48} cy={1 + yOff} r={9} fill={pal.P5} opacity={0.1} />);
  }
  // Idle: scepter orb glow
  if (state === 'idle') {
    glows.push(<circle key="soi" cx={44.5} cy={5.5 + yOff} r={3} fill={pal.O4} opacity={0.2} />);
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="64" height="64" fill="transparent" />
      {pixels}
      {glows}
    </svg>
  );
};

export default ThroneSprite;
