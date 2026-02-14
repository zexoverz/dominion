import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const P = 2; // pixel size in SVG units (48*2=96 viewBox)

const ThroneSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 200 : state === 'walking' ? 250 : state === 'celebrating' ? 180 : 400;
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 3;
  const breathe = frame % 2 === 0 ? 0 : P;
  const walkFrame = frame % 2;
  const talkOpen = frame % 2 === 0;
  const celebrateJump = frame < 2 ? 0 : -4;

  const yOff = state === 'celebrating' ? celebrateJump : 0;
  const bodyY = state === 'idle' ? breathe * 0.5 : 0;

  // Colors
  const skin = '#F2D2A9';
  const purple = '#6B2FA0';
  const darkPurple = '#4A1D6E';
  const gold = '#FFD700';
  const darkGold = '#DAA520';
  const red = '#E53935';
  const cape = '#7B1FA2';
  const eyeColor = frame % 2 === 0 ? '#FFD700' : '#FFF8C4';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}`} x={x * P} y={(y * P) + yOff + bodyY} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // Crown
  pixels.push(px(20, 4, gold), px(22, 4, gold), px(24, 4, gold));
  pixels.push(px(19, 5, gold, 8, 1));
  pixels.push(px(20, 5, red), px(24, 5, red)); // jewels
  pixels.push(px(19, 6, gold, 8, 1));

  // Head
  for (let x = 20; x < 26; x++) pixels.push(px(x, 7, skin));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 8, skin));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 9, skin));
  for (let x = 20; x < 26; x++) pixels.push(px(x, 10, skin));

  // Eyes
  if (!blink) {
    pixels.push(px(21, 8, eyeColor), px(24, 8, eyeColor));
    pixels.push(px(21, 9, '#1A1A1A'), px(24, 9, '#1A1A1A')); // pupils
  } else {
    pixels.push(px(21, 9, '#1A1A1A'), px(24, 9, '#1A1A1A'));
  }

  // Mouth
  if (state === 'talking' && talkOpen) {
    pixels.push(px(22, 10, '#8B4513', 2, 1));
  } else {
    pixels.push(px(22, 10, '#C4956A'), px(23, 10, '#C4956A'));
  }

  // Neck
  pixels.push(px(22, 11, skin), px(23, 11, skin));

  // Torso - purple robes with gold trim
  for (let y = 12; y < 20; y++) {
    for (let x = 17; x < 29; x++) {
      if (x === 17 || x === 28) pixels.push(px(x, y, gold)); // gold trim
      else pixels.push(px(x, y, purple));
    }
  }
  // Gold belt
  for (let x = 18; x < 28; x++) pixels.push(px(x, 16, darkGold));
  pixels.push(px(22, 16, red), px(23, 16, red)); // belt buckle

  // Cape (behind, sides)
  for (let y = 11; y < 24; y++) {
    pixels.push(px(15, y, cape));
    pixels.push(px(16, y, darkPurple));
    pixels.push(px(29, y, darkPurple));
    pixels.push(px(30, y, cape));
  }
  // Cape flow animation
  if (state === 'idle') {
    const capeWave = frame % 2 === 0;
    pixels.push(px(capeWave ? 14 : 15, 22, cape));
    pixels.push(px(capeWave ? 31 : 30, 22, cape));
  }

  // Arms
  if (state === 'working') {
    // Right arm pointing with scepter
    for (let x = 29; x < 34; x++) pixels.push(px(x, 13, purple));
    pixels.push(px(34, 13, skin));
    // Scepter extended
    pixels.push(px(35, 12, gold), px(35, 13, gold), px(35, 14, gold));
    pixels.push(px(35, 11, red)); // scepter gem
    // Left arm down
    pixels.push(px(16, 13, purple), px(15, 14, purple), px(15, 15, skin));
  } else if (state === 'thinking') {
    // Right hand on chin
    pixels.push(px(29, 13, purple), px(29, 14, purple));
    pixels.push(px(26, 10, skin), px(27, 10, skin)); // hand near chin
    // Left arm holding scepter
    pixels.push(px(16, 13, purple), px(15, 14, purple), px(14, 14, gold), px(14, 13, gold), px(14, 12, gold), px(14, 11, red));
    // Thought particles
    if (frame % 2 === 0) {
      pixels.push(px(28, 3, '#FFD70088'));
      pixels.push(px(30, 1, '#FFD70066'));
    }
  } else if (state === 'celebrating') {
    // Arms up
    pixels.push(px(29, 10, purple), px(30, 9, purple), px(30, 8, skin));
    pixels.push(px(16, 10, purple), px(15, 9, purple), px(15, 8, skin));
    // Scepter up
    pixels.push(px(31, 7, gold), px(31, 6, gold), px(31, 5, red));
  } else if (state === 'walking') {
    pixels.push(px(29, 13, purple), px(29, 14, skin));
    pixels.push(px(16, 14, purple), px(16, 15, skin));
  } else {
    // Default arms with scepter in right hand
    pixels.push(px(29, 13, purple), px(29, 14, purple), px(29, 15, skin));
    pixels.push(px(30, 15, gold), px(30, 14, gold), px(30, 13, gold), px(30, 12, gold), px(30, 11, red)); // scepter
    pixels.push(px(16, 13, purple), px(16, 14, purple), px(16, 15, skin));
  }

  // Legs
  if (state === 'walking') {
    if (walkFrame === 0) {
      pixels.push(px(20, 20, darkPurple, 3, 1), px(20, 21, darkPurple, 3, 1), px(20, 22, darkPurple, 3, 1), px(20, 23, '#3E2723', 3, 1));
      pixels.push(px(24, 20, darkPurple, 3, 1), px(25, 21, darkPurple, 3, 1), px(26, 22, darkPurple, 3, 1), px(26, 23, '#3E2723', 3, 1));
    } else {
      pixels.push(px(20, 20, darkPurple, 3, 1), px(19, 21, darkPurple, 3, 1), px(18, 22, darkPurple, 3, 1), px(18, 23, '#3E2723', 3, 1));
      pixels.push(px(24, 20, darkPurple, 3, 1), px(24, 21, darkPurple, 3, 1), px(24, 22, darkPurple, 3, 1), px(24, 23, '#3E2723', 3, 1));
    }
  } else {
    // Robe bottom / legs
    for (let x = 18; x < 28; x++) pixels.push(px(x, 20, darkPurple));
    for (let x = 19; x < 27; x++) pixels.push(px(x, 21, darkPurple));
    for (let x = 19; x < 27; x++) pixels.push(px(x, 22, darkPurple));
    // Boots
    pixels.push(px(19, 23, '#3E2723', 3, 1), px(24, 23, '#3E2723', 3, 1));
  }

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Eye glow effect */}
      {!blink && (
        <>
          <circle cx={21 * P + P / 2} cy={8 * P + P / 2 + yOff + bodyY} r={3} fill={eyeColor} opacity={0.4} />
          <circle cx={24 * P + P / 2} cy={8 * P + P / 2 + yOff + bodyY} r={3} fill={eyeColor} opacity={0.4} />
        </>
      )}
    </svg>
  );
};

export default ThroneSprite;
