import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const P = 2;

const GrimoireSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 180 : 350;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? (frame < 4 ? 0 : -4) : 0;
  const bobY = state === 'idle' ? [0, 0, 0.5, 0.5, 0, 0, -0.5, -0.5][frame] : 0;
  const yOff = celebY + bobY;

  const parchLight = '#EFEBE9';
  const parchment = '#D7CCC8';
  const parchMid = '#BCAAA4';
  const parchDark = '#A1887F';
  const brown = '#5D4037';
  const darkBrown = '#3E2723';
  const deepBrown = '#2C1A0E';
  const amber = '#FF8F00';
  const amberBright = '#FFB300';
  const amberDim = '#E65100';
  const pageBg = '#FAF3E0';
  const runeGlow = [amberBright, amber, amberDim, amber, amberBright, amber, amberDim, amber][frame];
  const pageFlip = state === 'working' ? frame % 2 : 0;

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${w}-${h}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // === BOOK HEAD (detailed with spine, pages, cover) ===
  // Book cover top
  for (let x = 17; x <= 29; x++) pixels.push(px(x, 3, darkBrown));
  // Left page spread
  for (let y = 4; y <= 9; y++) {
    for (let x = 17; x <= 22; x++) {
      if (x === 17) pixels.push(px(x, y, brown));
      else if (x === 18) pixels.push(px(x, y, parchMid));
      else pixels.push(px(x, y, y % 2 === 0 ? pageBg : parchLight));
    }
  }
  // Right page spread
  for (let y = 4; y <= 9; y++) {
    for (let x = 24; x <= 29; x++) {
      if (x === 29) pixels.push(px(x, y, brown));
      else if (x === 28) pixels.push(px(x, y, parchMid));
      else pixels.push(px(x, y, y % 2 === 0 ? pageBg : parchLight));
    }
  }
  // Spine (center)
  for (let y = 3; y <= 10; y++) {
    pixels.push(px(22, y, deepBrown), px(23, y, darkBrown), px(24, y, deepBrown));
  }
  // Book cover bottom
  for (let x = 17; x <= 29; x++) pixels.push(px(x, 10, darkBrown));

  // Page text lines (tiny detail)
  pixels.push(px(19, 5, parchDark, 3, 1), px(25, 5, parchDark, 3, 1));
  pixels.push(px(19, 7, parchDark, 2, 1), px(25, 7, parchDark, 2, 1));
  pixels.push(px(19, 9, parchDark, 3, 1), px(25, 9, parchDark, 2, 1));

  // Page flip animation when working
  if (state === 'working' && pageFlip) {
    pixels.push(px(22, 5, pageBg), px(22, 6, parchLight), px(22, 7, pageBg));
  }

  // === EYES (glowing amber, peering from pages) ===
  const blink = frame === 5;
  if (!blink) {
    // Left eye
    pixels.push(px(19, 6, '#1A1A1A'), px(20, 6, amber), px(21, 6, '#1A1A1A'));
    pixels.push(px(20, 7, amberDim));
    // Right eye
    pixels.push(px(25, 6, '#1A1A1A'), px(26, 6, amber), px(27, 6, '#1A1A1A'));
    pixels.push(px(26, 7, amberDim));
  } else {
    pixels.push(px(19, 7, darkBrown, 3, 1), px(25, 7, darkBrown, 3, 1));
  }

  // Mouth (text on page that moves)
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(19, 9, amberDim, 3, 1), px(25, 9, amberDim, 3, 1));
  }

  // === BODY (layered pages/parchment) ===
  for (let y = 11; y < 22; y++) {
    const w = y < 14 ? 10 : 12;
    const sx = Math.floor(23 - w / 2);
    for (let x = sx; x < sx + w; x++) {
      const isEdge = x === sx || x === sx + w - 1;
      const isInner = x === sx + 1 || x === sx + w - 2;
      // Layered page texture
      const layerColor = (y + x) % 3 === 0 ? parchLight :
                         (y + x) % 3 === 1 ? parchment : parchMid;
      if (isEdge) pixels.push(px(x, y, parchDark));
      else if (isInner) pixels.push(px(x, y, parchMid));
      else pixels.push(px(x, y, layerColor));
    }
  }

  // Page fold details on body
  pixels.push(px(20, 12, parchDark), px(26, 12, parchDark));
  pixels.push(px(19, 15, parchDark), px(27, 15, parchDark));
  pixels.push(px(20, 18, parchDark), px(26, 18, parchDark));

  // Text lines on body
  for (let y = 13; y <= 19; y += 2) {
    pixels.push(px(21, y, parchDark, 5, 1));
  }

  // === RUNES on body (glowing amber symbols) ===
  const runePositions = [[20, 13], [26, 14], [21, 16], [25, 17], [22, 19], [24, 20]];
  runePositions.forEach(([rx, ry], i) => {
    const active = state === 'working' || (i + frame) % 4 === 0;
    if (active) pixels.push(px(rx, ry, runeGlow));
  });

  // === ARMS (paper/parchment) ===
  if (state === 'working') {
    // Arms outstretched, channeling
    pixels.push(px(16, 13, parchMid), px(15, 14, parchDark), px(14, 14, parchment), px(13, 15, parchLight));
    pixels.push(px(30, 13, parchMid), px(31, 14, parchDark), px(32, 14, parchment), px(33, 15, parchLight));
    // Paper hands spreading
    pixels.push(px(12, 15, parchMid), px(13, 14, parchDark));
    pixels.push(px(34, 15, parchMid), px(33, 14, parchDark));
  } else if (state === 'thinking') {
    pixels.push(px(30, 12, parchment), px(28, 10, parchMid));
    pixels.push(px(16, 14, parchment), px(15, 15, parchDark));
    if (frame > 3) pixels.push(px(31, 4, amber), px(33, 2, amberDim));
  } else if (state === 'celebrating') {
    pixels.push(px(16, 10, parchment), px(15, 9, parchMid));
    pixels.push(px(30, 10, parchment), px(31, 9, parchMid));
  } else if (state === 'walking') {
    const swing = frame % 2;
    pixels.push(px(16, 14 - swing, parchMid), px(15, 15 - swing, parchDark));
    pixels.push(px(30, 14 + swing, parchMid), px(31, 15 + swing, parchDark));
  } else {
    pixels.push(px(16, 13, parchMid), px(16, 14, parchDark), px(16, 15, parchment), px(16, 16, parchMid));
    pixels.push(px(30, 13, parchMid), px(30, 14, parchDark), px(30, 15, parchment), px(30, 16, parchMid));
  }

  // === LEGS (stacked pages) ===
  const walkF = frame % 2;
  if (state === 'walking') {
    const lx = walkF === 0 ? 19 : 21;
    const rx = walkF === 0 ? 25 : 23;
    pixels.push(px(lx, 22, parchDark, 3, 1), px(lx, 23, parchment, 3, 1), px(lx, 24, parchMid, 3, 1), px(lx, 25, brown, 3, 1));
    pixels.push(px(rx, 22, parchDark, 3, 1), px(rx, 23, parchment, 3, 1), px(rx, 24, parchMid, 3, 1), px(rx, 25, brown, 3, 1));
  } else {
    for (let x = 17; x <= 29; x++) pixels.push(px(x, 22, parchDark));
    pixels.push(px(19, 23, parchment, 4, 1), px(24, 23, parchment, 4, 1));
    pixels.push(px(19, 24, parchMid, 4, 1), px(24, 24, parchMid, 4, 1));
    pixels.push(px(19, 25, brown, 4, 1), px(24, 25, brown, 4, 1));
  }

  // === FLOATING BOOKS/PAGES (3-4 orbiting) ===
  const orbitSpeed = state === 'working' ? frame * 2 : frame;
  const bookPositions = [
    { x: 11 + Math.round(2 * Math.sin(orbitSpeed * 0.8)), y: 7 + Math.round(Math.cos(orbitSpeed * 0.8)) },
    { x: 33 - Math.round(2 * Math.sin(orbitSpeed * 0.8 + 2)), y: 10 + Math.round(Math.cos(orbitSpeed * 0.8 + 2)) },
    { x: 9 + Math.round(1.5 * Math.sin(orbitSpeed * 0.8 + 4)), y: 16 + Math.round(Math.cos(orbitSpeed * 0.8 + 4)) },
    { x: 35 - Math.round(1.5 * Math.sin(orbitSpeed * 0.8 + 6)), y: 14 + Math.round(Math.cos(orbitSpeed * 0.8 + 6)) },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Floating mini-books */}
      {bookPositions.map((b, i) => (
        <g key={`book-${i}`} transform={`rotate(${i * 25 + frame * (state === 'working' ? 15 : 5)}, ${(b.x + 1.5) * P}, ${(b.y + 1) * P + yOff})`}>
          <rect x={b.x * P} y={b.y * P + yOff} width={3 * P} height={2 * P} fill={i % 2 === 0 ? brown : darkBrown} rx={1} />
          <rect x={(b.x + 0.5) * P} y={(b.y + 0.3) * P + yOff} width={2 * P} height={1.4 * P} fill={pageBg} />
        </g>
      ))}
      {/* Eye glow */}
      {!blink && (
        <>
          <circle cx={20 * P + P / 2} cy={6 * P + P / 2 + yOff} r={4} fill={amber} opacity={0.3} />
          <circle cx={26 * P + P / 2} cy={6 * P + P / 2 + yOff} r={4} fill={amber} opacity={0.3} />
        </>
      )}
      {/* Working: rune circle glow */}
      {state === 'working' && (
        <circle cx={23 * P} cy={16 * P + yOff} r={14} fill={amber} opacity={0.1} />
      )}
    </svg>
  );
};

export default GrimoireSprite;
