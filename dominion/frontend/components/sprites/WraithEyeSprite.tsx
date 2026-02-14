import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const P = 2;

const WraithEyeSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 200 : 400;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? (frame < 4 ? 0 : -3) : 0;
  const hoverY = state === 'idle' ? [0, -0.5, -1, -1, -0.5, 0, 0.5, 0.5][frame] : 0;
  const yOff = celebY + hoverY;

  const black = '#0D0D0D';
  const voidBlack = '#050510';
  const darkPurple = '#1A0033';
  const purple = '#4A148C';
  const purpleMid = '#6A1B9A';
  const purpleDim = '#2E0854';
  const shadow = '#1A1A2E';
  const shadowMid = '#252540';
  const shadowLight = '#30305A';
  const red = '#D50000';
  const redBright = '#FF1744';
  const redHot = '#FF5252';
  const redDim = '#B71C1C';
  const redDeep = '#7F0000';
  const crimson = '#C62828';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${w}-${h}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // === TALL POINTED HOOD ===
  pixels.push(px(22, 0, darkPurple), px(23, 0, darkPurple));
  pixels.push(px(21, 1, darkPurple), px(22, 1, black), px(23, 1, black), px(24, 1, darkPurple));
  for (let x = 20; x <= 25; x++) pixels.push(px(x, 2, x === 20 || x === 25 ? darkPurple : black));
  for (let x = 19; x <= 26; x++) pixels.push(px(x, 3, x === 19 || x === 26 ? purpleDim : black));
  for (let x = 18; x <= 27; x++) pixels.push(px(x, 4, x === 18 || x === 27 ? purple : x === 19 || x === 26 ? purpleDim : black));
  for (let x = 17; x <= 28; x++) pixels.push(px(x, 5, x === 17 || x === 28 ? purple : x === 18 || x === 27 ? purpleDim : black));

  // === THE EYE (massive, detailed iris) ===
  // Eye socket (dark shadow area)
  for (let y = 6; y <= 11; y++) {
    for (let x = 17; x <= 29; x++) {
      const dist = Math.abs(x - 23) + Math.abs(y - 8.5) * 0.8;
      if (dist > 6) pixels.push(px(x, y, black));
      else if (dist > 5) pixels.push(px(x, y, shadow));
      else if (dist > 4) pixels.push(px(x, y, shadowMid));
      else pixels.push(px(x, y, shadowLight));
    }
  }

  // Eye white/sclera (angular, menacing shape)
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 7, '#2C2C2C'));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 8, x === 18 || x === 28 ? '#252525' : '#3A3A3A'));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 9, x === 18 || x === 28 ? '#252525' : '#3A3A3A'));
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 10, '#2C2C2C'));

  // Iris (concentric rings of red, pupil moves)
  const eyeXShift = state === 'idle' ?
    [0, 0, 1, 1, 0, 0, -1, -1][frame] :
    state === 'working' ? [0, 1, 0, -1, 0, 1, 0, -1][frame] : 0;
  const eyeYShift = state === 'idle' && frame > 5 ? 1 : 0;
  const iX = 22 + eyeXShift;
  const iY = 8 + eyeYShift;

  // Outer iris ring
  pixels.push(px(iX - 1, iY - 1, redDeep), px(iX, iY - 1, redDim), px(iX + 1, iY - 1, redDim), px(iX + 2, iY - 1, redDeep));
  pixels.push(px(iX - 2, iY, redDeep), px(iX - 1, iY, crimson), px(iX + 2, iY, crimson), px(iX + 3, iY, redDeep));
  pixels.push(px(iX - 2, iY + 1, redDeep), px(iX - 1, iY + 1, crimson), px(iX + 2, iY + 1, crimson), px(iX + 3, iY + 1, redDeep));
  pixels.push(px(iX - 1, iY + 2, redDeep), px(iX, iY + 2, redDim), px(iX + 1, iY + 2, redDim), px(iX + 2, iY + 2, redDeep));

  // Inner iris ring
  pixels.push(px(iX, iY, red), px(iX + 1, iY, redBright));
  pixels.push(px(iX, iY + 1, redBright), px(iX + 1, iY + 1, red));

  // Pupil (slit-like)
  pixels.push(px(iX, iY, voidBlack), px(iX + 1, iY, voidBlack));
  pixels.push(px(iX, iY + 1, '#111'), px(iX + 1, iY + 1, '#111'));
  // Pupil highlight
  pixels.push(px(iX + 1, iY, '#3A0000'));

  // Talking: eye pulses
  if (state === 'talking') {
    const pulse = frame % 2 === 0;
    pixels.push(px(iX, iY, pulse ? redHot : red), px(iX + 1, iY, pulse ? redHot : redBright));
  }

  // === CLOAK BODY (tall, flowing into shadow) ===
  for (let y = 12; y < 24; y++) {
    const w = y < 14 ? 12 : y < 17 ? 14 : y < 20 ? 16 : 18;
    const sx = Math.floor(23 - w / 2);
    for (let x = sx; x < sx + w; x++) {
      const distFromEdge = Math.min(x - sx, sx + w - 1 - x);
      if (distFromEdge === 0) pixels.push(px(x, y, purple));
      else if (distFromEdge === 1) pixels.push(px(x, y, purpleDim));
      else if (distFromEdge === 2) pixels.push(px(x, y, darkPurple));
      else pixels.push(px(x, y, black));
    }
  }

  // Shadow fade at bottom (smoke effect via dithering)
  for (let y = 24; y <= 26; y++) {
    for (let x = 14; x <= 32; x++) {
      const fade = (x + y + frame) % 3 === 0;
      if (fade) pixels.push(px(x, y, y === 24 ? purpleDim : y === 25 ? darkPurple : '#0A0015'));
    }
  }

  // === TENDRILS (shadow appendages, wave independently) ===
  // Left tendrils (2 with different phase)
  const t1Phase = frame;
  const t2Phase = (frame + 3) % 8;
  const t3Phase = (frame + 5) % 8;

  // Tendril 1 (left upper)
  const t1x = [15, 14, 13, 12, 13, 14, 15, 16][t1Phase];
  pixels.push(px(t1x, 15, purple), px(t1x - 1, 16, purpleDim), px(t1x - 2, 17, darkPurple));

  // Tendril 2 (left lower)
  const t2x = [14, 13, 12, 11, 12, 13, 14, 15][t2Phase];
  pixels.push(px(t2x, 19, purple), px(t2x - 1, 20, purpleDim), px(t2x - 2, 21, darkPurple), px(t2x - 3, 22, '#0A0015'));

  // Tendril 3 (right upper)
  const t3rx = [31, 32, 33, 34, 33, 32, 31, 30][t1Phase];
  pixels.push(px(t3rx, 15, purple), px(t3rx + 1, 16, purpleDim), px(t3rx + 2, 17, darkPurple));

  // Tendril 4 (right lower)
  const t4rx = [32, 33, 34, 35, 34, 33, 32, 31][t2Phase];
  pixels.push(px(t4rx, 19, purple), px(t4rx + 1, 20, purpleDim), px(t4rx + 2, 21, darkPurple), px(t4rx + 3, 22, '#0A0015'));

  // Tendril 5 (center bottom)
  const t5y = [23, 24, 25, 24, 23, 24, 25, 24][t3Phase];
  pixels.push(px(21, t5y, darkPurple), px(22, t5y + 1, '#0A0015'));
  pixels.push(px(25, t5y, darkPurple), px(24, t5y + 1, '#0A0015'));

  // === WORKING: SCANNING BEAM ===
  if (state === 'working') {
    const beamAngle = frame % 8;
    const beamY = 6 + beamAngle;
    // Thin red scanning line
    for (let x = 5; x < 42; x++) {
      const dist = Math.abs(x - 23);
      const alpha = dist > 15 ? 0.1 : dist > 10 ? 0.3 : dist > 5 ? 0.6 : 0.9;
      // Just use bright/dim rects
      if (dist < 5) pixels.push(px(x, beamY, redBright));
      else if (dist < 10) pixels.push(px(x, beamY, red));
      else if (dist < 15) pixels.push(px(x, beamY, redDim));
    }
  }

  // === THINKING ===
  if (state === 'thinking') {
    if (frame > 3) {
      pixels.push(px(31, 4, redDim), px(33, 2, '#7F000088'));
    }
  }

  // === CELEBRATING ===
  if (state === 'celebrating') {
    // Tendrils go up
    pixels.push(px(15, 9, purple), px(14, 8, purpleDim));
    pixels.push(px(31, 9, purple), px(32, 8, purpleDim));
  }

  // === WALKING ===
  if (state === 'walking') {
    // Shift tendrils more dramatically
    const wf = frame % 2;
    pixels.push(px(16 - wf, 24, purple, 7, 1), px(23 + wf, 24, purple, 7, 1));
  }

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Eye glow (ominous) */}
      <circle cx={(iX + 1) * P} cy={(iY + 0.5) * P + yOff} r={10} fill={red} opacity={0.2} />
      <circle cx={(iX + 1) * P} cy={(iY + 0.5) * P + yOff} r={6} fill={redBright} opacity={0.15} />
      {/* Working: beam sweep glow */}
      {state === 'working' && (
        <rect x={5 * P} y={(6 + frame % 8) * P + yOff} width={37 * P} height={P} fill={red} opacity={0.15} />
      )}
      {/* Shadow aura */}
      <ellipse cx={23 * P} cy={20 * P + yOff} rx={12 * P} ry={6 * P} fill={darkPurple} opacity={0.12} />
      {/* Pupil inner glow */}
      <circle cx={(iX + 0.5) * P + P / 2} cy={(iY + 0.5) * P + yOff} r={2} fill={redHot} opacity={0.3} />
    </svg>
  );
};

export default WraithEyeSprite;
