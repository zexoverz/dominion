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
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 5;
  const floatY = state === 'idle' ? [0, -0.5, -1, -0.5, 0, 0.5, 1, 0.5][frame] : 0;
  const celebY = state === 'celebrating' ? (frame < 4 ? 0 : -4) : 0;
  const yOff = floatY + celebY;

  const darkBlue = '#1A3A5C';
  const midBlue = '#234B6E';
  const deepBlue = '#0D2137';
  const teal = '#00838F';
  const tealBright = '#00ACC1';
  const tealDark = '#006064';
  const skin = '#D4B896';
  const skinShade = '#B89870';
  const cyan = '#00E5FF';
  const cyanBright = '#80DEEA';
  const cyanDim = '#00ACC1';
  const staffBrown = '#5D4037';
  const staffLight = '#795548';
  const orbCyan = [cyan, cyanBright, cyanDim, cyan, cyanBright, cyanDim, cyan, cyanBright][frame];
  const starColor = frame % 2 === 0 ? '#E0E0E0' : '#B0BEC5';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${w}-${h}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // === DEEP HOOD ===
  pixels.push(px(21, 2, deepBlue), px(22, 2, deepBlue), px(23, 2, deepBlue), px(24, 2, deepBlue));
  for (let x = 19; x <= 26; x++) pixels.push(px(x, 3, deepBlue));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 4, x < 20 || x > 26 ? deepBlue : darkBlue));
  for (let x = 17; x <= 29; x++) pixels.push(px(x, 5, x < 19 || x > 27 ? deepBlue : darkBlue));
  for (let x = 16; x <= 30; x++) pixels.push(px(x, 6, x < 18 || x > 28 ? deepBlue : midBlue));
  for (let x = 16; x <= 30; x++) pixels.push(px(x, 7, x < 18 || x > 28 ? deepBlue : darkBlue));
  // Hood inner shadow
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 5, deepBlue));

  // === FACE (partially hidden in hood shadow) ===
  for (let x = 20; x <= 26; x++) pixels.push(px(x, 7, '#1A1A2E')); // shadow
  for (let x = 20; x <= 26; x++) pixels.push(px(x, 8, skinShade)); // face in shadow
  for (let x = 20; x <= 26; x++) pixels.push(px(x, 9, skin));
  for (let x = 21; x <= 25; x++) pixels.push(px(x, 10, skin));

  // Glowing cyan eyes peering from hood
  if (!blink) {
    pixels.push(px(21, 8, cyan), px(22, 8, '#1A1A1A')); // left eye
    pixels.push(px(25, 8, '#1A1A1A'), px(26, 8, cyan)); // right eye
  } else {
    pixels.push(px(21, 8, cyanDim), px(26, 8, cyanDim));
  }

  // Third eye
  const thirdEyeColor = [cyan, cyanBright, cyanDim, cyan, cyanBright, cyanDim, cyan, cyanBright][frame];
  pixels.push(px(23, 7, thirdEyeColor));

  // Nose shadow
  pixels.push(px(23, 9, skinShade));

  // Mouth
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(22, 10, '#8B6F5E', 2, 1));
  } else {
    pixels.push(px(22, 10, '#A68B73'), px(23, 10, '#A68B73'));
  }

  // Neck
  pixels.push(px(22, 11, skinShade), px(23, 11, skin), px(24, 11, skinShade));

  // === ROBES with star/constellation pattern ===
  for (let y = 12; y < 23; y++) {
    const w = y < 15 ? 10 : y < 18 ? 12 : 14;
    const startX = Math.floor(23 - w / 2);
    for (let x = startX; x < startX + w; x++) {
      const isEdge = x === startX || x === startX + w - 1;
      const isInnerEdge = x === startX + 1 || x === startX + w - 2;
      if (isEdge) pixels.push(px(x, y, teal));
      else if (isInnerEdge) pixels.push(px(x, y, tealDark));
      else pixels.push(px(x, y, darkBlue));
    }
  }

  // Stars/constellation dots on robes
  const starPositions = [
    [20, 14], [25, 13], [22, 16], [24, 18], [19, 17], [26, 15], [21, 20], [25, 20]
  ];
  starPositions.forEach(([sx, sy]) => {
    if ((sx + sy + frame) % 5 < 2) pixels.push(px(sx, sy, starColor));
  });

  // Teal belt/sash
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 17, tealBright));
  pixels.push(px(23, 17, cyan)); // center gem

  // === STAFF with curved top ===
  if (state !== 'working') {
    // Staff shaft
    for (let y = 4; y <= 25; y++) pixels.push(px(13, y, y % 3 === 0 ? staffLight : staffBrown));
    // Curved top
    pixels.push(px(13, 3, staffBrown), px(14, 2, staffBrown), px(15, 2, staffBrown));
    // Staff orb
    pixels.push(px(15, 1, cyanDim), px(16, 1, orbCyan), px(16, 2, cyanBright));
  }

  // === ARMS ===
  if (state === 'working') {
    // Hands over crystal ball
    pixels.push(px(17, 14, darkBlue), px(16, 15, darkBlue), px(15, 16, darkBlue), px(15, 17, skin));
    pixels.push(px(29, 14, darkBlue), px(30, 15, darkBlue), px(31, 16, darkBlue), px(31, 17, skin));
    // Fingers spread
    pixels.push(px(14, 17, skinShade), px(16, 17, skinShade));
    pixels.push(px(30, 17, skinShade), px(32, 17, skinShade));
    // Magic particles intensify
    const mp = frame % 4;
    pixels.push(px(18 + mp, 19, cyan), px(28 - mp, 19, cyan));
    pixels.push(px(19 + mp, 20, cyanBright), px(27 - mp, 20, cyanBright));
    if (frame % 2 === 0) {
      pixels.push(px(20, 18, cyan), px(26, 18, cyan));
    }
  } else if (state === 'thinking') {
    pixels.push(px(29, 13, darkBlue), px(28, 12, darkBlue), px(27, 11, skin));
    pixels.push(px(17, 14, darkBlue), px(16, 15, darkBlue), px(15, 16, skin));
    if (frame > 3) pixels.push(px(30, 5, cyan), px(32, 3, cyanDim));
  } else if (state === 'celebrating') {
    pixels.push(px(29, 11, darkBlue), px(30, 10, darkBlue), px(30, 9, skin));
    pixels.push(px(17, 11, darkBlue), px(16, 10, darkBlue), px(16, 9, skin));
  } else if (state === 'walking') {
    pixels.push(px(29, 14, darkBlue), px(30, 15, skin));
    pixels.push(px(17, 14, darkBlue), px(16, 15, skin));
  } else {
    // Holding staff
    pixels.push(px(17, 14, darkBlue), px(16, 15, darkBlue), px(15, 15, skin));
    pixels.push(px(14, 15, skinShade)); // grip on staff
    // Right arm
    pixels.push(px(29, 14, darkBlue), px(29, 15, darkBlue), px(29, 16, skin));
  }

  // === LEGS / ROBE BOTTOM ===
  if (state === 'walking') {
    const wf = frame % 2;
    if (wf === 0) {
      pixels.push(px(19, 23, tealDark, 4, 1), px(18, 24, deepBlue, 4, 1), px(18, 25, '#1A237E', 4, 1));
      pixels.push(px(24, 23, tealDark, 4, 1), px(25, 24, deepBlue, 4, 1), px(26, 25, '#1A237E', 4, 1));
    } else {
      pixels.push(px(19, 23, tealDark, 4, 1), px(20, 24, deepBlue, 4, 1), px(21, 25, '#1A237E', 4, 1));
      pixels.push(px(24, 23, tealDark, 4, 1), px(24, 24, deepBlue, 4, 1), px(24, 25, '#1A237E', 4, 1));
    }
  } else {
    // Robe hem
    for (let x = 16; x <= 30; x++) pixels.push(px(x, 23, teal));
    for (let x = 17; x <= 29; x++) pixels.push(px(x, 24, tealDark));
    pixels.push(px(18, 25, '#1A237E', 4, 1), px(25, 25, '#1A237E', 4, 1));
  }

  // === CRYSTAL BALL ===
  const orbX = state === 'working' ? 21 : 33;
  const orbY = state === 'working' ? 19 : (9 + [0, 0, 1, 1, 0, 0, -1, -1][frame]);
  // Ball body (3x3)
  pixels.push(px(orbX, orbY, cyanDim), px(orbX + 1, orbY, orbCyan), px(orbX + 2, orbY, cyanDim));
  pixels.push(px(orbX, orbY + 1, orbCyan), px(orbX + 1, orbY + 1, cyanBright), px(orbX + 2, orbY + 1, orbCyan));
  pixels.push(px(orbX, orbY + 2, cyanDim), px(orbX + 1, orbY + 2, orbCyan), px(orbX + 2, orbY + 2, cyanDim));
  // Inner swirl pattern
  const swirlPhase = frame % 4;
  if (swirlPhase < 2) pixels.push(px(orbX + 1, orbY, '#FFFFFF88'));
  else pixels.push(px(orbX + 1, orbY + 2, '#FFFFFF88'));

  // Floating particles around crystal ball
  const particlePhase = frame % 8;
  const particlePositions = [
    [orbX - 1, orbY - 1], [orbX + 3, orbY], [orbX - 1, orbY + 2], [orbX + 3, orbY + 2],
    [orbX, orbY - 1], [orbX + 2, orbY + 3], [orbX - 1, orbY + 1], [orbX + 3, orbY + 1]
  ];
  pixels.push(px(particlePositions[particlePhase][0], particlePositions[particlePhase][1], cyan));
  pixels.push(px(particlePositions[(particlePhase + 4) % 8][0], particlePositions[(particlePhase + 4) % 8][1], cyanDim));

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Third eye glow */}
      <circle cx={23 * P + P / 2} cy={7 * P + P / 2 + yOff} r={5} fill={thirdEyeColor} opacity={0.25} />
      {/* Eye glow from hood */}
      {!blink && (
        <>
          <circle cx={21 * P + P / 2} cy={8 * P + P / 2 + yOff} r={3} fill={cyan} opacity={0.4} />
          <circle cx={26 * P + P / 2} cy={8 * P + P / 2 + yOff} r={3} fill={cyan} opacity={0.4} />
        </>
      )}
      {/* Crystal ball glow */}
      <circle cx={(orbX + 1.5) * P} cy={(orbY + 1.5) * P + yOff} r={8} fill={orbCyan} opacity={state === 'working' ? 0.35 : 0.2} />
      {/* Staff orb glow */}
      {state !== 'working' && (
        <circle cx={16 * P} cy={1.5 * P + yOff} r={4} fill={orbCyan} opacity={0.3} />
      )}
    </svg>
  );
};

export default SeerSprite;
