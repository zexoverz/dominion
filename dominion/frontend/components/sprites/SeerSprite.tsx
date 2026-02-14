import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const P = 2;

const SeerSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 180 : state === 'celebrating' ? 200 : 350;
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 3;
  const floatY = state === 'idle' ? (frame % 2 === 0 ? 0 : -1) : 0;
  const celebY = state === 'celebrating' ? (frame < 2 ? 0 : -4) : 0;
  const yOff = floatY + celebY;

  const darkBlue = '#1A3A5C';
  const teal = '#00838F';
  const skin = '#D4B896';
  const cyan = '#00E5FF';
  const cyanDim = '#00ACC1';
  const staffBrown = '#5D4037';
  const orbCyan = frame % 2 === 0 ? '#00E5FF' : '#80DEEA';
  const hoodDark = '#0D2137';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${c}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // Hood
  for (let x = 19; x < 27; x++) pixels.push(px(x, 4, hoodDark));
  for (let x = 18; x < 28; x++) pixels.push(px(x, 5, darkBlue));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 6, darkBlue));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 7, darkBlue));

  // Face (inside hood shadow)
  for (let x = 20; x < 26; x++) pixels.push(px(x, 7, skin));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 8, skin));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 9, skin));
  for (let x = 20; x < 26; x++) pixels.push(px(x, 10, skin));

  // Third eye on forehead
  const thirdEyeColor = frame % 2 === 0 ? cyan : cyanDim;
  pixels.push(px(22, 7, thirdEyeColor), px(23, 7, thirdEyeColor));

  // Regular eyes
  if (!blink) {
    pixels.push(px(21, 8, '#E0E0E0'), px(24, 8, '#E0E0E0'));
    pixels.push(px(21, 9, '#1565C0'), px(24, 9, '#1565C0'));
  } else {
    pixels.push(px(21, 9, '#333'), px(24, 9, '#333'));
  }

  // Mouth
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(22, 10, '#8B6F5E', 2, 1));
  } else {
    pixels.push(px(22, 10, '#A68B73'), px(23, 10, '#A68B73'));
  }

  // Neck
  pixels.push(px(22, 11, skin), px(23, 11, skin));

  // Cloak body
  for (let y = 12; y < 22; y++) {
    const w = y < 15 ? 10 : 12;
    const startX = 23 - w / 2;
    for (let x = startX; x < startX + w; x++) {
      const edge = x === startX || x === startX + w - 1;
      pixels.push(px(x, y, edge ? teal : darkBlue));
    }
  }

  // Teal trim pattern
  pixels.push(px(21, 14, teal), px(22, 14, teal), px(23, 14, teal), px(24, 14, teal));
  pixels.push(px(20, 18, teal), px(25, 18, teal));

  // Arms
  if (state === 'working') {
    // Hands over crystal ball
    pixels.push(px(17, 14, darkBlue), px(16, 15, darkBlue), px(16, 16, skin));
    pixels.push(px(28, 14, darkBlue), px(29, 15, darkBlue), px(29, 16, skin));
    // Magic particles
    if (frame % 2 === 0) pixels.push(px(18, 17, cyan), px(27, 17, cyan));
    if (frame % 4 < 2) pixels.push(px(20, 19, cyan), px(25, 19, cyan));
  } else if (state === 'thinking') {
    pixels.push(px(28, 13, darkBlue), px(27, 10, skin)); // hand to chin
    pixels.push(px(17, 14, darkBlue), px(16, 15, darkBlue), px(16, 16, skin));
    // Thought dots
    if (frame > 1) pixels.push(px(30, 5, cyan), px(32, 3, cyanDim));
  } else if (state === 'celebrating') {
    pixels.push(px(28, 10, darkBlue), px(29, 9, skin));
    pixels.push(px(17, 10, darkBlue), px(16, 9, skin));
  } else {
    // Staff in left hand
    pixels.push(px(16, 13, darkBlue), px(15, 14, darkBlue), px(14, 14, skin));
    pixels.push(px(13, 6, orbCyan), px(13, 7, staffBrown), px(13, 8, staffBrown));
    for (let y = 9; y < 23; y++) pixels.push(px(13, y, staffBrown));
    // Right arm
    pixels.push(px(29, 13, darkBlue), px(29, 14, darkBlue), px(29, 15, skin));
  }

  // Robe bottom
  for (let x = 17; x < 29; x++) pixels.push(px(x, 22, teal));
  pixels.push(px(18, 23, '#1A237E', 3, 1), px(25, 23, '#1A237E', 3, 1));

  // Crystal ball (floating)
  const orbX = state === 'working' ? 22 : (32 + (frame % 2));
  const orbY = state === 'working' ? 18 : (8 + Math.floor(frame / 2));
  pixels.push(px(orbX, orbY, orbCyan), px(orbX + 1, orbY, orbCyan));
  pixels.push(px(orbX, orbY + 1, cyanDim), px(orbX + 1, orbY + 1, orbCyan));

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Third eye glow */}
      <circle cx={22.5 * P} cy={7 * P + P / 2 + yOff} r={4} fill={thirdEyeColor} opacity={0.3} />
      {/* Crystal ball glow */}
      <circle cx={(orbX + 0.5) * P} cy={(orbY + 0.5) * P + yOff} r={5} fill={orbCyan} opacity={0.25} />
    </svg>
  );
};

export default SeerSprite;
