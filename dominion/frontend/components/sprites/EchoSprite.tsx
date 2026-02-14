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
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? (frame < 2 ? 0 : -4) : 0;
  const yOff = celebY;

  const pink = '#E91E63';
  const magenta = '#AD1457';
  const violet = '#7B1FA2';
  const lightPink = '#F48FB1';
  const skin = '#F3E5F5'; // ethereal pale
  const skinDark = '#CE93D8';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${c}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // Head
  for (let x = 20; x < 26; x++) pixels.push(px(x, 5, skinDark));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 6, skin));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 7, skin));
  for (let x = 19; x < 27; x++) pixels.push(px(x, 8, skin));
  for (let x = 20; x < 26; x++) pixels.push(px(x, 9, skin));

  // Echo face outlines (ghostly duplicates offset)
  const echoShift = frame % 2 === 0 ? -1 : 1;
  // Ghost face 1
  pixels.push(px(19 + echoShift, 6, lightPink));
  pixels.push(px(27 + echoShift, 6, lightPink));
  // Ghost face 2
  pixels.push(px(19 - echoShift, 7, magenta));
  pixels.push(px(27 - echoShift, 7, magenta));

  // Eyes
  const blink = frame === 3;
  if (!blink) {
    pixels.push(px(21, 7, pink), px(24, 7, pink));
    pixels.push(px(21, 8, '#4A148C'), px(24, 8, '#4A148C'));
  } else {
    pixels.push(px(21, 8, '#4A148C'), px(24, 8, '#4A148C'));
  }

  // Mouth
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(22, 9, violet, 2, 1));
  } else {
    pixels.push(px(22, 9, skinDark), px(23, 9, skinDark));
  }

  // Neck
  pixels.push(px(22, 10, skin), px(23, 10, skin));

  // Torso - ethereal flowing form
  for (let y = 11; y < 20; y++) {
    const shimmer = (y + frame) % 3 === 0;
    for (let x = 18; x < 28; x++) {
      const edge = x === 18 || x === 27;
      pixels.push(px(x, y, edge ? (shimmer ? lightPink : magenta) : (shimmer ? lightPink : violet)));
    }
  }

  // Pattern on torso
  pixels.push(px(21, 13, pink), px(24, 13, pink));
  pixels.push(px(22, 15, magenta), px(23, 15, magenta));

  // Arms
  if (state === 'working') {
    // Broadcast pose
    pixels.push(px(16, 12, violet), px(15, 11, magenta), px(14, 10, lightPink));
    pixels.push(px(29, 12, violet), px(30, 11, magenta), px(31, 10, lightPink));
  } else if (state === 'thinking') {
    pixels.push(px(29, 12, violet), px(27, 9, skin));
    pixels.push(px(16, 13, violet), px(15, 14, magenta));
    if (frame > 1) pixels.push(px(30, 4, pink), px(32, 2, lightPink));
  } else if (state === 'celebrating') {
    pixels.push(px(16, 9, violet), px(15, 8, lightPink));
    pixels.push(px(29, 9, violet), px(30, 8, lightPink));
  } else {
    pixels.push(px(16, 13, violet), px(16, 14, magenta), px(16, 15, skin));
    pixels.push(px(29, 13, violet), px(29, 14, magenta), px(29, 15, skin));
  }

  // Lower body (ethereal, fading)
  for (let x = 19; x < 27; x++) pixels.push(px(x, 20, magenta));
  if (state === 'walking') {
    const wf = frame % 2;
    pixels.push(px(19 + wf, 21, violet, 3, 1), px(24 - wf, 21, violet, 3, 1));
    pixels.push(px(19 + wf, 22, magenta, 3, 1), px(24 - wf, 22, magenta, 3, 1));
    pixels.push(px(19 + wf, 23, lightPink, 3, 1), px(24 - wf, 23, lightPink, 3, 1));
  } else {
    pixels.push(px(19, 21, violet, 3, 1), px(24, 21, violet, 3, 1));
    pixels.push(px(19, 22, magenta, 3, 1), px(24, 22, magenta, 3, 1));
    pixels.push(px(20, 23, lightPink, 2, 1), px(24, 23, lightPink, 2, 1));
  }

  // Sound waves when talking/working
  const showWaves = state === 'talking' || state === 'working';

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <defs>
        <filter id="echo-blur">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>
      <rect width="96" height="96" fill="transparent" />
      {/* Translucent body overlay */}
      <rect x={18 * P} y={11 * P + yOff} width={10 * P} height={9 * P} fill={violet} opacity={0.15} />
      {pixels}
      {/* Sound wave rings */}
      {showWaves && (
        <>
          <circle cx={23 * P} cy={14 * P + yOff} r={(8 + frame * 4)} fill="none" stroke={pink} strokeWidth={1} opacity={0.4 - frame * 0.1} />
          <circle cx={23 * P} cy={14 * P + yOff} r={(16 + frame * 4)} fill="none" stroke={magenta} strokeWidth={1} opacity={0.3 - frame * 0.07} />
        </>
      )}
      {/* Shimmer effect */}
      {state === 'idle' && (
        <rect x={19 * P} y={(6 + frame) * P + yOff} width={8 * P} height={P} fill="white" opacity={0.15} />
      )}
    </svg>
  );
};

export default EchoSprite;
