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
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? (frame < 2 ? 0 : -3) : 0;
  const yOff = celebY;

  const darkPurple = '#1A0033';
  const purple = '#4A148C';
  const black = '#0D0D0D';
  const red = '#D50000';
  const redBright = '#FF1744';
  const redDim = '#B71C1C';
  const shadow = '#1A1A2E';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${c}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // Hood (tall, pointed)
  pixels.push(px(22, 2, black), px(23, 2, black));
  for (let x = 21; x < 25; x++) pixels.push(px(x, 3, darkPurple));
  for (let x = 20; x < 26; x++) pixels.push(px(x, 4, darkPurple));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 5, black));
  for (let x = 18; x < 28; x++) pixels.push(px(x, 6, black));

  // The Eye (massive, where face should be)
  for (let x = 18; x < 28; x++) pixels.push(px(x, 7, shadow));
  for (let x = 18; x < 28; x++) pixels.push(px(x, 8, shadow));
  for (let x = 18; x < 28; x++) pixels.push(px(x, 9, shadow));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 10, shadow));

  // Eye white
  pixels.push(px(20, 7, '#2C2C2C', 6, 1));
  pixels.push(px(19, 8, '#3A3A3A', 8, 1));
  pixels.push(px(20, 9, '#2C2C2C', 6, 1));

  // Iris (moves based on state/frame)
  const eyeXShift = state === 'idle' ? (frame < 2 ? 0 : frame === 2 ? 1 : -1) : 0;
  const irisX = 22 + eyeXShift;
  pixels.push(px(irisX, 7, red, 2, 1));
  pixels.push(px(irisX - 1, 8, red), px(irisX, 8, redBright), px(irisX + 1, 8, redBright), px(irisX + 2, 8, red));
  pixels.push(px(irisX, 9, red, 2, 1));
  // Pupil
  pixels.push(px(irisX, 8, '#1A1A1A'), px(irisX + 1, 8, '#1A1A1A'));

  // Working: scanning laser
  if (state === 'working') {
    const laserY = 7 + (frame % 3);
    for (let x = 10; x < 36; x++) {
      pixels.push(px(x, laserY, red));
    }
  }

  // Mouth area (just shadow, this character has no mouth)
  if (state === 'talking') {
    // Eye pulses instead
    pixels.push(px(irisX, 8, frame % 2 === 0 ? redBright : red));
  }

  // Cloak body (tall and narrow)
  for (let y = 11; y < 22; y++) {
    const width = y < 14 ? 10 : y < 18 ? 12 : 14;
    const startX = Math.floor(23 - width / 2);
    for (let x = startX; x < startX + width; x++) {
      const edge = x === startX || x === startX + width - 1;
      pixels.push(px(x, y, edge ? purple : black));
    }
  }

  // Arms (shadow tendrils)
  if (state === 'working') {
    // Tendrils spreading
    for (let i = 0; i < 4; i++) {
      const tx = 15 - i * 2 - (frame % 2);
      pixels.push(px(tx, 14 + i, purple));
      pixels.push(px(31 + i * 2 + (frame % 2), 14 + i, purple));
    }
  } else if (state === 'thinking') {
    pixels.push(px(16, 13, purple), px(15, 14, darkPurple));
    pixels.push(px(29, 12, purple));
    if (frame > 1) pixels.push(px(31, 4, red), px(33, 2, redDim));
  } else if (state === 'celebrating') {
    pixels.push(px(15, 10, purple), px(14, 9, darkPurple));
    pixels.push(px(30, 10, purple), px(31, 9, darkPurple));
  } else {
    pixels.push(px(16, 13, purple), px(15, 14, purple), px(14, 15, darkPurple));
    pixels.push(px(29, 13, purple), px(30, 14, purple), px(31, 15, darkPurple));
  }

  // Base / shadow tendrils
  const tendrilWave = frame % 2 === 0;
  for (let x = 16; x < 30; x++) pixels.push(px(x, 22, purple));
  if (state === 'walking') {
    const wf = frame % 2;
    pixels.push(px(17 - wf, 23, darkPurple, 6, 1), px(23 + wf, 23, darkPurple, 6, 1));
  } else {
    pixels.push(px(16, 23, darkPurple, 5, 1), px(25, 23, darkPurple, 5, 1));
  }

  // Shadow tendrils at base
  const tendrilPositions = [
    { x: tendrilWave ? 13 : 14, y: 23 },
    { x: tendrilWave ? 32 : 31, y: 23 },
    { x: tendrilWave ? 11 : 12, y: 22 },
    { x: tendrilWave ? 34 : 33, y: 22 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Tendrils */}
      {tendrilPositions.map((t, i) => (
        <rect key={`tendril-${i}`} x={t.x * P} y={t.y * P + yOff} width={2 * P} height={P} fill={purple} opacity={0.6} />
      ))}
      {/* Eye glow */}
      <circle cx={(irisX + 1) * P} cy={8 * P + P / 2 + yOff} r={8} fill={red} opacity={0.25} />
      {/* Scanning glow */}
      {state === 'working' && (
        <rect x={10 * P} y={(7 + frame % 3) * P + yOff} width={26 * P} height={P} fill={red} opacity={0.2} />
      )}
    </svg>
  );
};

export default WraithEyeSprite;
