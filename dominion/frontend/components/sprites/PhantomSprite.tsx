import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const P = 2;

const PhantomSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 150 : state === 'walking' ? 250 : 350;
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), speed);
    return () => clearInterval(iv);
  }, [state]);

  const hoverY = state === 'idle' ? (frame % 2 === 0 ? 0 : -1) : 0;
  const celebY = state === 'celebrating' ? (frame < 2 ? 0 : -4) : 0;
  const yOff = hoverY + celebY;
  const visorFlicker = frame % 3 !== 0;

  const black = '#1A1A1A';
  const darkGray = '#2D2D2D';
  const green = '#00E676';
  const greenDim = '#00C853';
  const greenDark = '#1B5E20';
  const skin = '#B0BEC5'; // pale/cybernetic
  const metalArm = '#78909C';
  const metalDark = '#455A64';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${c}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // Hood
  for (let x = 19; x < 27; x++) pixels.push(px(x, 5, black));
  for (let x = 18; x < 28; x++) pixels.push(px(x, 6, darkGray));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 7, darkGray));

  // Face
  for (let x = 19; x < 27; x++) pixels.push(px(x, 8, skin));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 9, skin));
  for (let x = 20; x < 26; x++) pixels.push(px(x, 10, skin));

  // Visor/goggles
  const visorColor = visorFlicker ? green : greenDim;
  pixels.push(px(20, 8, visorColor, 2, 1), px(24, 8, visorColor, 2, 1));
  pixels.push(px(22, 8, metalDark, 2, 1)); // bridge

  // Mouth
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(22, 10, '#546E7A', 2, 1));
  } else {
    pixels.push(px(22, 10, '#78909C'), px(23, 10, '#78909C'));
  }

  // Neck
  pixels.push(px(22, 11, skin), px(23, 11, skin));

  // Torso - black cloak with green circuit lines
  for (let y = 12; y < 20; y++) {
    for (let x = 18; x < 28; x++) {
      pixels.push(px(x, y, black));
    }
  }
  // Circuit patterns
  pixels.push(px(20, 13, greenDark), px(20, 14, greenDark), px(21, 14, greenDark), px(22, 14, greenDark));
  pixels.push(px(25, 13, greenDark), px(25, 14, greenDark), px(24, 14, greenDark));
  pixels.push(px(20, 17, greenDark), px(25, 17, greenDark));
  pixels.push(px(21, 18, greenDark), px(24, 18, greenDark));

  // Left arm (mechanical)
  if (state === 'working') {
    // Both hands typing on floating terminal
    pixels.push(px(16, 15, metalArm), px(15, 16, metalDark), px(15, 17, metalArm));
    pixels.push(px(29, 15, black), px(30, 16, skin));
    // Floating terminal
    for (let x = 14; x < 32; x++) pixels.push(px(x, 18, '#263238'));
    for (let x = 15; x < 31; x++) pixels.push(px(x, 19, '#37474F'));
    // Screen text (animated)
    const textX = 16 + (frame * 2) % 8;
    pixels.push(px(textX, 19, green, 3, 1));
    // Code particles
    if (frame % 2 === 0) {
      pixels.push(px(13 + frame, 15, green));
      pixels.push(px(28 - frame, 14, green));
    }
  } else if (state === 'thinking') {
    pixels.push(px(16, 14, metalArm), px(27, 10, skin)); // hand to chin
    pixels.push(px(29, 13, black), px(28, 12, black));
    if (frame > 1) pixels.push(px(30, 5, green), px(32, 3, greenDim));
  } else if (state === 'celebrating') {
    pixels.push(px(16, 10, metalArm), px(15, 9, metalDark));
    pixels.push(px(29, 10, black), px(30, 9, skin));
  } else {
    // Mechanical left arm
    pixels.push(px(16, 13, metalArm), px(15, 14, metalDark), px(15, 15, metalArm), px(14, 16, metalArm));
    pixels.push(px(14, 15, greenDark)); // joint glow
    // Right arm
    pixels.push(px(29, 13, black), px(29, 14, black), px(29, 15, skin));
  }

  // Legs
  const walkFrame = frame % 2;
  if (state === 'walking') {
    if (walkFrame === 0) {
      pixels.push(px(20, 20, darkGray, 3, 1), px(19, 21, darkGray, 3, 1), px(19, 22, darkGray, 3, 1), px(19, 23, '#333', 3, 1));
      pixels.push(px(24, 20, darkGray, 3, 1), px(25, 21, darkGray, 3, 1), px(26, 22, darkGray, 3, 1), px(26, 23, '#333', 3, 1));
    } else {
      pixels.push(px(20, 20, darkGray, 3, 1), px(21, 21, darkGray, 3, 1), px(22, 22, darkGray, 3, 1), px(22, 23, '#333', 3, 1));
      pixels.push(px(24, 20, darkGray, 3, 1), px(23, 21, darkGray, 3, 1), px(22, 22, darkGray, 3, 1), px(22, 23, '#333', 3, 1));
    }
  } else {
    for (let x = 19; x < 27; x++) pixels.push(px(x, 20, darkGray));
    pixels.push(px(19, 21, darkGray, 3, 1), px(24, 21, darkGray, 3, 1));
    pixels.push(px(19, 22, darkGray, 3, 1), px(24, 22, darkGray, 3, 1));
    pixels.push(px(19, 23, '#333', 3, 1), px(24, 23, '#333', 3, 1));
  }

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Visor glow */}
      {visorFlicker && (
        <>
          <circle cx={21 * P} cy={8 * P + P / 2 + yOff} r={4} fill={green} opacity={0.3} />
          <circle cx={25 * P} cy={8 * P + P / 2 + yOff} r={4} fill={green} opacity={0.3} />
        </>
      )}
    </svg>
  );
};

export default PhantomSprite;
