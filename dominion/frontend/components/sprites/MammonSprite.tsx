import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const P = 2;

const MammonSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 200 : 350;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? (frame < 4 ? 0 : -3) : 0;
  const breathe = state === 'idle' ? [0, 0, 0.5, 0.5, 0, 0, -0.5, -0.5][frame] : 0;
  const yOff = celebY;

  const gold = '#FFD700';
  const goldHi = '#FFF176';
  const goldMid = '#FFC107';
  const goldDark = '#DAA520';
  const goldDeep = '#B8860B';
  const scaleLight = '#FFE082';
  const scaleDark = '#FFB300';
  const vest = '#B71C1C';
  const vestMid = '#C62828';
  const vestDark = '#7F0000';
  const vestHi = '#D32F2F';
  const skin = '#FFB74D';
  const skinShade = '#F57C00';
  const skinHi = '#FFCC80';
  const monocle = '#E8EAF6';
  const monocleRim = '#9FA8DA';
  const brown = '#5D4037';
  const bootBrown = '#4E342E';
  const white = '#FAFAFA';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${w}-${h}`} x={x * P} y={y * P + yOff + breathe} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // === HEAD (stocky dragon, wider) ===
  // Horns
  pixels.push(px(16, 3, goldDark), px(17, 3, goldMid), px(17, 4, goldDark));
  pixels.push(px(29, 3, goldDark), px(28, 3, goldMid), px(28, 4, goldDark));

  // Head top
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 4, x % 2 === 0 ? goldMid : scaleLight));
  // Head sides & face
  for (let y = 5; y <= 8; y++) {
    for (let x = 17; x <= 29; x++) {
      // Scale pattern (checkerboard)
      const isScale = (x + y) % 2 === 0;
      const isEdge = x === 17 || x === 29;
      if (isEdge) pixels.push(px(x, y, goldDark));
      else pixels.push(px(x, y, isScale ? goldMid : scaleLight));
    }
  }
  // Lighter belly/front
  for (let x = 20; x <= 26; x++) {
    pixels.push(px(x, 7, skinHi));
    pixels.push(px(x, 8, skin));
  }

  // Brow ridge
  pixels.push(px(18, 5, goldDeep), px(19, 5, goldDeep), px(20, 5, goldDeep));
  pixels.push(px(26, 5, goldDeep), px(27, 5, goldDeep), px(28, 5, goldDeep));

  // Eyes
  const blink = frame === 5;
  if (!blink) {
    pixels.push(px(19, 6, '#FFF', 2, 1), px(20, 6, goldDark)); // left eye
    pixels.push(px(26, 6, goldDark), px(27, 6, '#FFF', 2, 1)); // right eye
    pixels.push(px(20, 7, '#1A1A1A'), px(27, 7, '#1A1A1A')); // pupils
  } else {
    pixels.push(px(19, 7, goldDeep, 2, 1), px(26, 7, goldDeep, 2, 1));
  }

  // === MONOCLE (right eye, with chain) ===
  pixels.push(px(25, 5, monocleRim), px(26, 5, monocleRim), px(27, 5, monocleRim), px(28, 5, monocleRim));
  pixels.push(px(25, 6, monocleRim), px(28, 6, monocleRim));
  pixels.push(px(25, 7, monocleRim), px(28, 7, monocleRim));
  pixels.push(px(25, 8, monocleRim), px(26, 8, monocleRim), px(27, 8, monocleRim), px(28, 8, monocleRim));
  // Monocle glass
  pixels.push(px(26, 6, monocle), px(27, 6, monocle), px(26, 7, monocle), px(27, 7, monocle));
  // Chain
  pixels.push(px(29, 8, monocleRim), px(29, 9, goldDark), px(30, 10, goldDark), px(30, 11, goldDark));

  // Snout
  for (let x = 20; x <= 26; x++) pixels.push(px(x, 9, skin));
  pixels.push(px(21, 9, skinShade), px(25, 9, skinShade)); // nostrils

  // Mouth
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(21, 10, '#BF360C', 5, 1));
    pixels.push(px(22, 10, '#E64A19'));
  } else {
    pixels.push(px(21, 10, skinShade, 5, 1));
  }

  // Neck (thick)
  for (let x = 20; x <= 26; x++) {
    pixels.push(px(x, 11, (x + 11) % 2 === 0 ? goldMid : scaleLight));
  }

  // === TORSO (stout, with vest) ===
  // Wide body
  for (let y = 12; y < 21; y++) {
    const w = y < 14 ? 14 : 16;
    const sx = Math.floor(23 - w / 2);
    for (let x = sx; x < sx + w; x++) {
      const isOuter = x < sx + 2 || x > sx + w - 3;
      const isMid = x < sx + 3 || x > sx + w - 4;
      if (isOuter) {
        // Scaled dragon arms/sides
        pixels.push(px(x, y, (x + y) % 2 === 0 ? goldMid : scaleDark));
      } else if (isMid) {
        pixels.push(px(x, y, vestDark));
      } else {
        // Vest body
        const vestShade = Math.abs(x - 23) < 2 ? vestHi : (y % 2 === 0 ? vest : vestMid);
        pixels.push(px(x, y, vestShade));
      }
    }
  }

  // Vest buttons (gold)
  pixels.push(px(23, 13, goldHi), px(23, 15, gold), px(23, 17, goldHi), px(23, 19, gold));

  // Vest lapels (V-shape)
  pixels.push(px(20, 12, vestDark), px(21, 13, vestDark), px(22, 14, vestDark));
  pixels.push(px(26, 12, vestDark), px(25, 13, vestDark), px(24, 14, vestDark));

  // Belly roundness (lighter vest center)
  for (let y = 15; y <= 18; y++) {
    pixels.push(px(22, y, vestHi), px(24, y, vestHi));
  }

  // Belt
  for (let x = 17; x <= 29; x++) pixels.push(px(x, 20, goldDark));
  pixels.push(px(22, 20, goldHi), px(23, 20, gold), px(24, 20, goldHi)); // ornate buckle

  // Tail
  pixels.push(px(31, 18, goldMid), px(32, 17, scaleDark), px(33, 16, goldMid), px(34, 16, goldDark));
  pixels.push(px(34, 15, scaleDark)); // tail tip

  // === ARMS ===
  if (state === 'working') {
    // Holding abacus
    pixels.push(px(14, 14, goldMid), px(13, 15, scaleDark), px(13, 16, skin), px(12, 17, skinShade));
    pixels.push(px(32, 14, goldMid), px(33, 15, scaleDark), px(33, 16, skin), px(34, 17, skinShade));
    // Abacus frame
    for (let y = 15; y <= 19; y++) { pixels.push(px(11, y, brown)); pixels.push(px(35, y, brown)); }
    pixels.push(px(11, 15, brown, 25, 1)); // top
    pixels.push(px(11, 19, brown, 25, 1)); // bottom
    pixels.push(px(11, 17, brown, 25, 1)); // middle bar
    // Beads (animated)
    const beadShift = frame % 4;
    for (let i = 0; i < 6; i++) {
      const bx = 13 + i * 3 + (i === beadShift ? 1 : 0);
      pixels.push(px(bx, 16, gold), px(bx + 1, 16, goldDark));
      pixels.push(px(bx + (i % 2), 18, goldMid), px(bx + 1 - (i % 2), 18, goldHi));
    }
  } else if (state === 'thinking') {
    pixels.push(px(32, 12, goldMid), px(29, 9, skin));
    pixels.push(px(14, 14, goldMid), px(13, 15, skin));
    if (frame > 3) pixels.push(px(32, 4, gold), px(34, 2, goldDark));
  } else if (state === 'celebrating') {
    pixels.push(px(14, 10, goldMid), px(13, 9, skin));
    pixels.push(px(32, 10, goldMid), px(33, 9, skin));
  } else if (state === 'walking') {
    const swing = frame % 2;
    pixels.push(px(14, 14 - swing, goldMid), px(13, 15 - swing, skin));
    pixels.push(px(32, 14 + swing, goldMid), px(33, 15 + swing, skin));
  } else {
    // Idle: one hand adjusting monocle
    const polishF = frame % 4;
    if (polishF < 2) {
      pixels.push(px(32, 13, goldMid), px(33, 12, scaleDark), px(33, 11, skin));
    } else {
      pixels.push(px(32, 14, goldMid), px(32, 15, scaleDark), px(32, 16, skin));
    }
    pixels.push(px(14, 14, goldMid), px(14, 15, scaleDark), px(14, 16, skin));
  }

  // === LEGS (stout, wide) ===
  const wf = frame % 2;
  if (state === 'walking') {
    pixels.push(px(17 + wf, 21, goldMid, 5, 1), px(17 + wf, 22, scaleDark, 5, 1), px(17 + wf, 23, scaleDark, 5, 1), px(17 + wf, 24, bootBrown, 5, 1));
    pixels.push(px(24 - wf, 21, goldMid, 5, 1), px(24 - wf, 22, scaleDark, 5, 1), px(24 - wf, 23, scaleDark, 5, 1), px(24 - wf, 24, bootBrown, 5, 1));
  } else {
    pixels.push(px(17, 21, goldMid, 5, 1), px(24, 21, goldMid, 5, 1));
    pixels.push(px(17, 22, scaleDark, 5, 1), px(24, 22, scaleDark, 5, 1));
    pixels.push(px(17, 23, goldDark, 5, 1), px(24, 23, goldDark, 5, 1));
    pixels.push(px(17, 24, bootBrown, 5, 1), px(24, 24, bootBrown, 5, 1));
    // Boot buckle
    pixels.push(px(19, 24, goldDark), px(26, 24, goldDark));
  }

  // === FLOATING COINS ===
  const coinData = [
    { x: 9 + (frame % 4), y: 7, spin: frame % 3 },
    { x: 34 - (frame % 4), y: 11, spin: (frame + 1) % 3 },
    { x: 11 + ((frame + 2) % 4), y: 18, spin: (frame + 2) % 3 },
    { x: 33 - ((frame + 2) % 4), y: 5, spin: frame % 3 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Floating coins with detail */}
      {coinData.map((c, i) => {
        const coinW = c.spin === 0 ? 2 : c.spin === 1 ? 1.5 : 1;
        return (
          <React.Fragment key={`coin-${i}`}>
            <ellipse cx={(c.x + 1) * P} cy={(c.y + 0.5) * P + yOff} rx={coinW * P} ry={P} fill={gold} />
            <ellipse cx={(c.x + 1) * P} cy={(c.y + 0.5) * P + yOff} rx={coinW * P * 0.5} ry={P * 0.5} fill={goldDark} />
            {coinW > 1.5 && (
              <text x={(c.x + 0.7) * P} y={(c.y + 0.8) * P + yOff} fontSize={P * 0.8} fill={goldDeep} fontWeight="bold">$</text>
            )}
          </React.Fragment>
        );
      })}
      {/* Monocle glint */}
      {frame % 4 === 0 && (
        <rect x={26 * P} y={6 * P + yOff + breathe} width={P * 0.5} height={P * 0.5} fill="white" opacity={0.8} />
      )}
    </svg>
  );
};

export default MammonSprite;
