import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const P = 2;

const EchoSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 200 : state === 'talking' ? 180 : 350;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? (frame < 4 ? 0 : -4) : 0;
  const floatY = state === 'idle' ? [0, -0.5, -1, -0.5, 0, 0.5, 1, 0.5][frame] : 0;
  const yOff = celebY + floatY;

  // Color cycling: pink → violet → magenta
  const colorCycle = frame % 8;
  const pink = ['#E91E63', '#D81B60', '#C2185B', '#AD1457', '#9C27B0', '#8E24AA', '#AB47BC', '#EC407A'][colorCycle];
  const magenta = '#AD1457';
  const violet = '#7B1FA2';
  const deepViolet = '#4A148C';
  const lightPink = '#F48FB1';
  const palePink = '#FCE4EC';
  const skin = '#F3E5F5';
  const skinShade = '#CE93D8';
  const skinGhost = '#E1BEE7';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${w}-${h}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // === ECHO OUTLINES (ghost duplicates offset by a few pixels) ===
  // Echo 1 (offset left-up, lightest)
  const e1 = -2;
  for (let x = 20; x <= 26; x++) pixels.push(px(x + e1, 5 - 1, palePink));
  for (let x = 19; x <= 27; x++) pixels.push(px(x + e1, 7 - 1, palePink));
  // Echo body outline 1
  for (let y = 11; y < 20; y += 2) {
    pixels.push(px(17 + e1, y - 1, palePink), px(28 + e1, y - 1, palePink));
  }

  // Echo 2 (offset right-up, medium)
  const e2 = 2;
  for (let x = 20; x <= 26; x++) pixels.push(px(x + e2, 5 - 1, lightPink));
  for (let x = 19; x <= 27; x++) pixels.push(px(x + e2, 7 - 1, lightPink));
  // Echo body outline 2
  for (let y = 11; y < 20; y += 2) {
    pixels.push(px(17 + e2, y - 1, lightPink), px(28 + e2, y - 1, lightPink));
  }

  // === HEAD (ethereal, detailed face) ===
  // Hair/top
  for (let x = 20; x <= 26; x++) pixels.push(px(x, 4, skinShade));
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 5, x % 2 === 0 ? skin : skinGhost)); // ethereal alternating
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 6, x === 18 || x === 28 ? skinShade : skin));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 7, x === 18 || x === 28 ? skinShade : skin));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 8, x === 18 || x === 28 ? skinShade : skin));
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 9, skin));
  for (let x = 20; x <= 26; x++) pixels.push(px(x, 10, skinShade));

  // Ethereal dithering (alternating empty pixels for transparency effect)
  [5, 7, 9].forEach(y => {
    [19, 21, 23, 25, 27].forEach(x => {
      if ((x + y + frame) % 3 === 0) pixels.push(px(x, y, skinGhost));
    });
  });

  // Eyes (ghostly, with glow)
  const blink = frame === 5;
  if (!blink) {
    pixels.push(px(20, 7, '#FFF'), px(21, 7, pink), px(22, 7, '#FFF'));
    pixels.push(px(25, 7, '#FFF'), px(26, 7, pink), px(27, 7, '#FFF'));
    pixels.push(px(21, 8, deepViolet), px(26, 8, deepViolet)); // pupils
  } else {
    pixels.push(px(20, 8, deepViolet, 3, 1), px(25, 8, deepViolet, 3, 1));
  }

  // Nose
  pixels.push(px(23, 8, skinShade));

  // Mouth
  if ((state === 'talking' || state === 'working') && frame % 2 === 0) {
    // Open mouth (singing/projecting)
    pixels.push(px(22, 9, violet), px(23, 9, deepViolet), px(24, 9, violet));
    pixels.push(px(22, 10, violet, 3, 1));
  } else {
    pixels.push(px(22, 9, skinShade), px(23, 9, skinShade), px(24, 9, skinShade));
  }

  // Neck
  pixels.push(px(22, 11, skin), px(23, 11, skinGhost), px(24, 11, skin));

  // === TORSO (ethereal, flowing) ===
  for (let y = 12; y < 21; y++) {
    for (let x = 17; x <= 29; x++) {
      const edge = x === 17 || x === 29;
      const innerEdge = x === 18 || x === 28;
      // Shimmer effect
      const shimmer = (y + x + frame) % 4 === 0;
      // Alternating filled/empty for ethereal effect
      const dither = (x + y) % 2 === 0;
      if (edge) {
        if (dither) pixels.push(px(x, y, magenta));
        // else leave empty for ghostly edge
      } else if (innerEdge) {
        pixels.push(px(x, y, shimmer ? lightPink : violet));
      } else {
        pixels.push(px(x, y, shimmer ? lightPink : (dither ? violet : pink)));
      }
    }
  }

  // Musical note patterns on torso
  pixels.push(px(20, 14, lightPink), px(21, 13, lightPink));
  pixels.push(px(25, 15, lightPink), px(26, 14, lightPink));
  pixels.push(px(22, 17, palePink), px(24, 18, palePink));

  // === ARMS ===
  if (state === 'working') {
    // Arms spread wide, broadcasting
    pixels.push(px(16, 12, violet), px(15, 11, magenta), px(14, 10, pink), px(13, 9, lightPink), px(12, 8, palePink));
    pixels.push(px(30, 12, violet), px(31, 11, magenta), px(32, 10, pink), px(33, 9, lightPink), px(34, 8, palePink));
    // Hands open (fingers spread)
    pixels.push(px(11, 7, palePink), px(11, 8, palePink), px(12, 7, lightPink));
    pixels.push(px(35, 7, palePink), px(35, 8, palePink), px(34, 7, lightPink));
  } else if (state === 'thinking') {
    pixels.push(px(30, 12, violet), px(28, 10, skin));
    pixels.push(px(16, 13, violet), px(15, 14, magenta));
    if (frame > 3) pixels.push(px(31, 4, pink), px(33, 2, lightPink));
  } else if (state === 'celebrating') {
    pixels.push(px(16, 9, violet), px(15, 8, lightPink), px(14, 7, palePink));
    pixels.push(px(30, 9, violet), px(31, 8, lightPink), px(32, 7, palePink));
  } else if (state === 'walking') {
    const swing = frame % 2;
    pixels.push(px(16, 13 - swing, violet), px(15, 14 - swing, magenta), px(15, 15 - swing, skin));
    pixels.push(px(30, 13 + swing, violet), px(31, 14 + swing, magenta), px(31, 15 + swing, skin));
  } else {
    pixels.push(px(16, 13, violet), px(16, 14, magenta), px(16, 15, lightPink), px(16, 16, skin));
    pixels.push(px(30, 13, violet), px(30, 14, magenta), px(30, 15, lightPink), px(30, 16, skin));
  }

  // === LOWER BODY (ethereal fade) ===
  for (let x = 18; x <= 28; x++) {
    const dith = (x + frame) % 2 === 0;
    pixels.push(px(x, 21, dith ? magenta : violet));
  }
  if (state === 'walking') {
    const wf = frame % 2;
    pixels.push(px(19 + wf, 22, violet, 3, 1), px(24 - wf, 22, violet, 3, 1));
    pixels.push(px(19 + wf, 23, magenta, 3, 1), px(24 - wf, 23, magenta, 3, 1));
    pixels.push(px(20 + wf, 24, lightPink, 2, 1), px(24 - wf, 24, lightPink, 2, 1));
  } else {
    // Fading ghostly legs
    pixels.push(px(19, 22, violet, 3, 1), px(24, 22, violet, 3, 1));
    for (let x = 19; x <= 27; x++) {
      if ((x + frame) % 2 === 0) pixels.push(px(x, 23, magenta));
    }
    for (let x = 20; x <= 26; x++) {
      if ((x + frame) % 3 === 0) pixels.push(px(x, 24, lightPink));
    }
    // Wisps at bottom
    pixels.push(px(18 + (frame % 3), 25, palePink));
    pixels.push(px(26 - (frame % 3), 25, palePink));
  }

  // Sound wave rings
  const showWaves = state === 'talking' || state === 'working';
  const waveCount = state === 'working' ? 3 : 2;

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <defs>
        <filter id="echo-glow">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <rect width="96" height="96" fill="transparent" />
      {/* Ethereal body underlay */}
      <rect x={18 * P} y={12 * P + yOff} width={10 * P} height={9 * P} fill={violet} opacity={0.1} />
      {pixels}
      {/* Sound wave arcs */}
      {showWaves && Array.from({ length: waveCount }, (_, i) => (
        <React.Fragment key={`wave-${i}`}>
          <circle cx={23 * P} cy={14 * P + yOff} r={10 + (frame + i * 3) * 3}
            fill="none" stroke={pink} strokeWidth={1.5} opacity={Math.max(0, 0.5 - (frame + i * 3) * 0.05)} />
          <circle cx={23 * P} cy={14 * P + yOff} r={14 + (frame + i * 3) * 3}
            fill="none" stroke={magenta} strokeWidth={1} opacity={Math.max(0, 0.35 - (frame + i * 3) * 0.04)} />
        </React.Fragment>
      ))}
      {/* Shimmer line */}
      {state === 'idle' && (
        <rect x={19 * P} y={(6 + (frame % 4)) * P + yOff} width={8 * P} height={P * 0.5} fill="white" opacity={0.2} />
      )}
      {/* Eye glow */}
      {!blink && (
        <>
          <circle cx={21 * P + P / 2} cy={7 * P + P / 2 + yOff} r={3} fill={pink} opacity={0.35} />
          <circle cx={26 * P + P / 2} cy={7 * P + P / 2 + yOff} r={3} fill={pink} opacity={0.35} />
        </>
      )}
    </svg>
  );
};

export default EchoSprite;
