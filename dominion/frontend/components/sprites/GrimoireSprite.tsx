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
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? (frame < 2 ? 0 : -4) : 0;
  const yOff = celebY;

  const parchment = '#D7CCC8';
  const parchDark = '#BCAAA4';
  const amber = '#FF8F00';
  const amberDim = '#E65100';
  const brown = '#5D4037';
  const darkBrown = '#3E2723';
  const pageBg = '#EFEBE9';
  const runeGlow = frame % 2 === 0 ? '#FFB300' : '#FFA000';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${c}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // Tome head - open book shape
  for (let x = 18; x < 28; x++) pixels.push(px(x, 4, darkBrown)); // spine top
  for (let x = 17; x < 29; x++) pixels.push(px(x, 5, brown));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 6, pageBg));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 7, pageBg));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 8, pageBg));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 9, pageBg));
  for (let x = 18; x < 28; x++) pixels.push(px(x, 10, brown)); // spine bottom
  // Book spine center
  pixels.push(px(22, 5, darkBrown), px(23, 5, darkBrown));
  pixels.push(px(22, 6, brown), px(23, 6, brown));
  pixels.push(px(22, 7, brown), px(23, 7, brown));
  pixels.push(px(22, 8, brown), px(23, 8, brown));
  pixels.push(px(22, 9, brown), px(23, 9, brown));

  // Eyes peeking from pages
  const blink = frame === 3;
  if (!blink) {
    pixels.push(px(19, 7, amber), px(20, 7, '#1A1A1A')); // left eye
    pixels.push(px(25, 7, '#1A1A1A'), px(26, 7, amber)); // right eye
  } else {
    pixels.push(px(19, 7, '#5D4037'), px(26, 7, '#5D4037'));
  }

  // Mouth (text on page)
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(20, 9, amberDim, 2, 1), px(24, 9, amberDim, 2, 1));
  }

  // Body made of pages
  for (let y = 11; y < 20; y++) {
    for (let x = 18; x < 28; x++) {
      const isEdge = x === 18 || x === 27;
      const pageFlutter = (y + frame) % 3 === 0 && isEdge;
      pixels.push(px(x, y, pageFlutter ? pageBg : parchment));
    }
  }
  // Page texture lines
  for (let y = 12; y < 19; y += 2) {
    pixels.push(px(20, y, parchDark, 6, 1));
  }

  // Rune marks on body
  if (state === 'working') {
    pixels.push(px(20, 13, runeGlow), px(25, 13, runeGlow));
    pixels.push(px(21, 15, runeGlow), px(24, 15, runeGlow));
    pixels.push(px(22, 17, runeGlow), px(23, 17, runeGlow));
  }

  // Arms (paper/parchment)
  if (state === 'working') {
    // Arms out, pages flipping
    pixels.push(px(16, 13, parchment), px(15, 14, parchDark), px(14, 15, parchment));
    pixels.push(px(29, 13, parchment), px(30, 14, parchDark), px(31, 15, parchment));
  } else if (state === 'thinking') {
    pixels.push(px(29, 12, parchment), px(27, 10, parchDark));
    pixels.push(px(16, 14, parchment), px(15, 15, parchDark));
    if (frame > 1) pixels.push(px(30, 4, amber), px(32, 2, amberDim));
  } else if (state === 'celebrating') {
    pixels.push(px(16, 10, parchment), px(15, 9, parchDark));
    pixels.push(px(29, 10, parchment), px(30, 9, parchDark));
  } else {
    pixels.push(px(16, 13, parchment), px(16, 14, parchDark), px(16, 15, parchment));
    pixels.push(px(29, 13, parchment), px(29, 14, parchDark), px(29, 15, parchment));
  }

  // Legs (stacked pages)
  const walkF = frame % 2;
  if (state === 'walking') {
    const lx = walkF === 0 ? 19 : 21;
    const rx = walkF === 0 ? 25 : 23;
    pixels.push(px(lx, 20, parchDark, 3, 1), px(lx, 21, parchment, 3, 1), px(lx, 22, parchDark, 3, 1), px(lx, 23, brown, 3, 1));
    pixels.push(px(rx, 20, parchDark, 3, 1), px(rx, 21, parchment, 3, 1), px(rx, 22, parchDark, 3, 1), px(rx, 23, brown, 3, 1));
  } else {
    for (let x = 19; x < 27; x++) pixels.push(px(x, 20, parchDark));
    pixels.push(px(19, 21, parchment, 3, 1), px(24, 21, parchment, 3, 1));
    pixels.push(px(19, 22, parchDark, 3, 1), px(24, 22, parchDark, 3, 1));
    pixels.push(px(19, 23, brown, 3, 1), px(24, 23, brown, 3, 1));
  }

  // Floating pages
  const pagePositions = [
    { x: 12 + (frame % 3), y: 8 + Math.floor(frame / 2) },
    { x: 32 - (frame % 3), y: 10 - Math.floor(frame / 2) },
    { x: 10 + frame, y: 16 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Floating pages */}
      {pagePositions.map((p, i) => (
        <rect key={`page-${i}`} x={p.x * P} y={p.y * P + yOff} width={3 * P} height={2 * P} fill={pageBg} opacity={0.7}
          transform={`rotate(${i * 30 + frame * 10}, ${(p.x + 1.5) * P}, ${(p.y + 1) * P + yOff})`} />
      ))}
      {/* Eye glow */}
      <circle cx={19.5 * P} cy={7 * P + P / 2 + yOff} r={3} fill={amber} opacity={0.3} />
      <circle cx={25.5 * P} cy={7 * P + P / 2 + yOff} r={3} fill={amber} opacity={0.3} />
    </svg>
  );
};

export default GrimoireSprite;
