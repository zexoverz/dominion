"use client";
import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const GrimoireSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 140 : state === 'celebrating' ? 170 : 300;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? [0, -1, -2, -3, -2, -1, 0, 0][frame] : 0;
  const breathe = state === 'idle' ? [0, 0.2, 0.4, 0.2, 0, -0.2, -0.4, -0.2][frame] : 0;
  const yOff = celebY + breathe;

  const pal: Record<string, string> = {
    // Parchment/paper (body)
    P5: '#FFF8E1', P4: '#FFECB3', P3: '#FFE082', P2: '#DCC27C', P1: '#B8A060',
    // Dark parchment/leather
    L4: '#A1887F', L3: '#8D6E63', L2: '#6D4C41', L1: '#4E342E',
    // Amber/gold (eyes, runes)
    A5: '#FFECB3', A4: '#FFD54F', A3: '#FFC107', A2: '#FF8F00', A1: '#E65100',
    // Ink
    I: '#1A1A1A', ID: '#333333',
    // Book colors (orbiting books)
    BR: '#8D6E63', RD: '#E53935', GN: '#43A047', BL: '#1E88E5', GD: '#FFC107',
    // Rune glow
    R4: '#FFE082', R3: '#FFD54F', R2: '#FFC107', R1: '#FF8F00',
    K: '#0A0A0A',
  };

  const p = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x},${y},${c},${w},${h}`} x={x} y={y + yOff} width={w} height={h} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // ===== HEAD: Open book (rows 2-14) =====
  // Book spine on top
  pixels.push(p(30, 2, pal.L2, 2, 1));
  pixels.push(p(29, 3, pal.L3, 4, 1));
  pixels.push(p(28, 4, pal.L2, 6, 1));

  // Pages spread to sides (left page)
  for (let y = 5; y <= 13; y++) {
    const pageW = y < 8 ? 8 : y < 11 ? 10 : 8;
    const sx = 31 - pageW;
    for (let x = sx; x <= 30; x++) {
      const fromSpine = 30 - x;
      const shade = fromSpine < 2 ? pal.P2 : fromSpine < 5 ? pal.P3 : fromSpine < 8 ? pal.P4 : pal.P5;
      pixels.push(p(x, y, shade));
    }
  }
  // Right page
  for (let y = 5; y <= 13; y++) {
    const pageW = y < 8 ? 8 : y < 11 ? 10 : 8;
    const ex = 31 + pageW;
    for (let x = 32; x <= ex; x++) {
      const fromSpine = x - 32;
      const shade = fromSpine < 2 ? pal.P2 : fromSpine < 5 ? pal.P3 : fromSpine < 8 ? pal.P4 : pal.P5;
      pixels.push(p(x, y, shade));
    }
  }
  // Spine line
  for (let y = 4; y <= 13; y++) {
    pixels.push(p(30, y, pal.L2)); pixels.push(p(31, y, pal.L1)); pixels.push(p(32, y, pal.L2));
  }

  // Page edges (leather binding)
  for (let y = 5; y <= 13; y++) {
    const pageW = y < 8 ? 8 : y < 11 ? 10 : 8;
    pixels.push(p(31 - pageW, y, pal.L3));
    pixels.push(p(31 + pageW, y, pal.L3));
  }
  // Bottom of book
  pixels.push(p(23, 14, pal.L2, 16, 1));

  // Eyes peeking from between pages
  const eyeColor = [pal.A3, pal.A4, pal.A5, pal.A4, pal.A3, pal.A2, pal.A3, pal.A4][frame];
  pixels.push(p(27, 9, eyeColor)); pixels.push(p(28, 9, pal.A5)); pixels.push(p(29, 9, pal.K)); // left eye
  pixels.push(p(33, 9, pal.K)); pixels.push(p(34, 9, pal.A5)); pixels.push(p(35, 9, eyeColor)); // right eye

  // Small runes on visible pages
  const pageFlip = state === 'working' ? frame % 2 : 0;
  if (pageFlip === 0) {
    pixels.push(p(25, 7, pal.R2)); pixels.push(p(26, 8, pal.R1)); pixels.push(p(24, 10, pal.R2));
    pixels.push(p(36, 7, pal.R2)); pixels.push(p(37, 8, pal.R1)); pixels.push(p(38, 10, pal.R2));
  } else {
    pixels.push(p(25, 8, pal.R1)); pixels.push(p(27, 7, pal.R2)); pixels.push(p(24, 11, pal.R1));
    pixels.push(p(37, 7, pal.R1)); pixels.push(p(35, 8, pal.R2)); pixels.push(p(38, 11, pal.R1));
  }

  // ===== BODY: Layered parchment (rows 15-42) =====
  for (let y = 15; y <= 42; y++) {
    const halfW = y < 20 ? 6 : y < 28 ? 7 : y < 35 ? 8 : 7;
    const cx = 31;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      // Layer different tan/cream shades
      const layer = (y + x) % 4;
      const shade = layer === 0 ? pal.P5 : layer === 1 ? pal.P4 : layer === 2 ? pal.P3 : pal.P2;
      const isEdge = x === cx - halfW || x === cx + halfW;
      pixels.push(p(x, y, isEdge ? pal.L3 : shade));
    }
    // Page-fold detail (vertical lines)
    if (y % 3 === 0) {
      pixels.push(p(cx - 3, y, pal.P1)); pixels.push(p(cx + 3, y, pal.P1));
    }
  }

  // ===== ARMS: Rolled scroll/paper (rows 17-30) =====
  const armBaseL = state === 'working' ? 19 : state === 'celebrating' ? 18 : 22;
  const armBaseR = state === 'working' ? 43 : state === 'celebrating' ? 44 : 40;

  // Left arm
  for (let y = 17; y <= 28; y++) {
    const ax = armBaseL + Math.round((y - 17) * (state === 'working' ? -0.3 : state === 'celebrating' ? -0.5 : -0.15));
    pixels.push(p(ax, y, pal.P3));
    pixels.push(p(ax + 1, y, pal.P4));
    // Scroll roll detail
    if (y % 2 === 0) pixels.push(p(ax, y, pal.P2));
  }
  // Right arm
  for (let y = 17; y <= 28; y++) {
    const ax = armBaseR + Math.round((y - 17) * (state === 'working' ? 0.3 : state === 'celebrating' ? 0.5 : 0.15));
    pixels.push(p(ax, y, pal.P4));
    pixels.push(p(ax - 1, y, pal.P3));
    if (y % 2 === 0) pixels.push(p(ax, y, pal.P2));
  }

  // Ink drip from hands
  const inkDrips = [
    [armBaseL - 1, 29 + (frame % 4)],
    [armBaseR + 1, 30 + ((frame + 2) % 4)],
  ];
  if (state !== 'walking') {
    inkDrips.forEach(([ix, iy], i) => {
      if (iy < 36) {
        pixels.push(p(ix, iy, pal.I));
        if (iy + 2 < 38) pixels.push(p(ix, iy + 2, pal.ID));
      }
    });
  }

  // ===== LEGS (rows 43-48) =====
  if (state === 'walking') {
    const wf = frame % 4;
    const lx = wf < 2 ? 27 : 29;
    const rx = wf < 2 ? 34 : 32;
    pixels.push(p(lx, 43, pal.P2, 3, 2)); pixels.push(p(lx, 45, pal.L3, 3, 2));
    pixels.push(p(rx, 43, pal.P2, 3, 2)); pixels.push(p(rx, 45, pal.L3, 3, 2));
  } else {
    pixels.push(p(27, 43, pal.P2, 3, 2)); pixels.push(p(27, 45, pal.L3, 3, 2));
    pixels.push(p(33, 43, pal.P2, 3, 2)); pixels.push(p(33, 45, pal.L3, 3, 2));
  }

  // ===== ORBITING BOOKS (5 small books) =====
  const bookColors = [pal.BR, pal.RD, pal.GN, pal.BL, pal.GD];
  const orbitSpeed = state === 'working' ? 0.8 : state === 'celebrating' ? 0.6 : 0.3;
  const orbitR = state === 'working' ? 18 : 15;

  for (let i = 0; i < 5; i++) {
    const angle = (frame * orbitSpeed + i * (Math.PI * 2 / 5));
    const bx = Math.round(31 + Math.cos(angle) * orbitR);
    const by = Math.round(28 + Math.sin(angle) * orbitR * 0.5);
    if (bx >= 0 && bx < 62 && by >= 0 && by < 62) {
      // Small book (2x3 or 3x2 based on position)
      const isOpen = state === 'working' && i === Math.floor(frame / 2) % 5;
      if (isOpen) {
        pixels.push(p(bx, by, bookColors[i], 3, 1));
        pixels.push(p(bx, by + 1, pal.P5, 3, 1)); // open pages
      } else {
        pixels.push(p(bx, by, bookColors[i], 2, 2));
        pixels.push(p(bx, by, pal.P5)); // page edge
      }
    }
  }

  // ===== FLOATING RUNES (6-8 glowing amber/gold) =====
  const runeSymbols = 8;
  const runeOrbitR = state === 'working' ? 22 : 18;
  const runeSpeed = state === 'working' ? 0.5 : 0.2;

  for (let i = 0; i < runeSymbols; i++) {
    const angle = (frame * runeSpeed + i * (Math.PI * 2 / runeSymbols)) + Math.PI / 4;
    const rx = Math.round(31 + Math.cos(angle) * runeOrbitR);
    const ry = Math.round(26 + Math.sin(angle) * runeOrbitR * 0.6);
    if (rx >= 1 && rx < 63 && ry >= 1 && ry < 63) {
      const runeColor = (i + frame) % 3 === 0 ? pal.R4 : (i + frame) % 3 === 1 ? pal.R3 : pal.R2;
      pixels.push(p(rx, ry, runeColor));
    }
  }

  // ===== GLOW EFFECTS =====
  const glows: React.ReactNode[] = [];

  // Eye glow
  glows.push(<circle key="el" cx={28} cy={9.5 + yOff} r={2} fill={eyeColor} opacity={0.3} />);
  glows.push(<circle key="er" cx={35} cy={9.5 + yOff} r={2} fill={eyeColor} opacity={0.3} />);

  // Rune ambient glow
  for (let i = 0; i < runeSymbols; i++) {
    const angle = (frame * runeSpeed + i * (Math.PI * 2 / runeSymbols)) + Math.PI / 4;
    const rx = 31 + Math.cos(angle) * runeOrbitR;
    const ry = 26 + Math.sin(angle) * runeOrbitR * 0.6;
    if (rx >= 1 && rx < 63 && ry >= 1 && ry < 63) {
      glows.push(<circle key={`rg${i}`} cx={rx + 0.5} cy={ry + 0.5 + yOff} r={1.5} fill={pal.A3} opacity={0.2} />);
    }
  }

  // Working: intense book glow
  if (state === 'working') {
    glows.push(<circle key="bg" cx={31} cy={8 + yOff} r={8} fill={pal.A4} opacity={0.08} />);
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="64" height="64" fill="transparent" />
      {pixels}
      {glows}
    </svg>
  );
};

export default GrimoireSprite;
