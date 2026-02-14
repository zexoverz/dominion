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
    const iv = setInterval(() => setFrame(f => (f + 1) % 4), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? (frame < 2 ? 0 : -3) : 0;
  const yOff = celebY;

  const gold = '#FFD700';
  const goldDark = '#DAA520';
  const goldScale = '#FFC107';
  const vest = '#B71C1C'; // deep red vest
  const vestDark = '#7F0000';
  const skin = '#FFB74D'; // warm dragon skin
  const skinDark = '#F57C00';
  const monocle = '#E0E0E0';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${c}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // Head (wider, stout dragon)
  for (let x = 18; x < 28; x++) pixels.push(px(x, 5, goldScale));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 6, goldScale));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 7, goldScale));
  for (let x = 17; x < 29; x++) pixels.push(px(x, 8, goldScale));
  for (let x = 18; x < 28; x++) pixels.push(px(x, 9, goldScale));
  // Dragon horns/ridges
  pixels.push(px(17, 4, goldDark), px(18, 4, goldDark));
  pixels.push(px(27, 4, goldDark), px(28, 4, goldDark));
  // Snout
  for (let x = 19; x < 27; x++) pixels.push(px(x, 10, skin));

  // Monocle on right eye
  const blink = frame === 3;
  if (!blink) {
    pixels.push(px(20, 7, '#1A1A1A'), px(25, 7, '#1A1A1A')); // eyes
    pixels.push(px(20, 8, goldDark), px(25, 8, goldDark)); // pupils
  } else {
    pixels.push(px(20, 8, '#333'), px(25, 8, '#333'));
  }
  // Monocle frame
  pixels.push(px(24, 6, monocle), px(26, 6, monocle));
  pixels.push(px(24, 8, monocle), px(26, 8, monocle));
  pixels.push(px(27, 7, monocle));
  // Monocle chain
  pixels.push(px(27, 8, monocle), px(28, 9, goldDark));

  // Mouth
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(21, 10, '#BF360C', 4, 1));
  } else {
    pixels.push(px(21, 10, skinDark, 4, 1));
  }

  // Neck (thick)
  for (let x = 20; x < 26; x++) pixels.push(px(x, 11, goldScale));

  // Torso - stout, with vest
  for (let y = 12; y < 21; y++) {
    for (let x = 16; x < 30; x++) {
      const isOuter = x < 18 || x > 27;
      pixels.push(px(x, y, isOuter ? goldScale : vest));
    }
  }
  // Vest buttons
  pixels.push(px(23, 13, gold), px(23, 15, gold), px(23, 17, gold));
  // Vest lapels
  pixels.push(px(19, 12, vestDark), px(20, 12, vestDark));
  pixels.push(px(25, 12, vestDark), px(26, 12, vestDark));
  // Belt
  for (let x = 18; x < 28; x++) pixels.push(px(x, 19, goldDark));
  pixels.push(px(22, 19, gold, 2, 1)); // buckle

  // Arms
  if (state === 'working') {
    // Counting on abacus
    pixels.push(px(14, 14, goldScale), px(13, 15, goldScale), px(13, 16, skin));
    pixels.push(px(31, 14, goldScale), px(32, 15, goldScale), px(32, 16, skin));
    // Abacus
    for (let y = 14; y < 18; y++) pixels.push(px(12, y, '#5D4037'));
    for (let y = 14; y < 18; y++) pixels.push(px(33, y, '#5D4037'));
    pixels.push(px(12, 14, '#5D4037', 22, 1)); // top bar
    pixels.push(px(12, 17, '#5D4037', 22, 1)); // bottom bar
    // Beads (animated)
    const beadX = 14 + (frame * 2);
    pixels.push(px(beadX, 15, gold), px(beadX + 2, 15, gold), px(beadX + 4, 15, goldDark));
    pixels.push(px(beadX + 1, 16, goldDark), px(beadX + 3, 16, gold));
  } else if (state === 'thinking') {
    pixels.push(px(31, 12, goldScale), px(28, 9, skin));
    pixels.push(px(14, 14, goldScale), px(13, 15, skin));
    if (frame > 1) pixels.push(px(31, 4, gold), px(33, 2, goldDark));
  } else if (state === 'celebrating') {
    pixels.push(px(14, 10, goldScale), px(13, 9, skin));
    pixels.push(px(31, 10, goldScale), px(32, 9, skin));
  } else {
    // Idle: polishing monocle animation
    const polishFrame = frame % 4;
    if (state === 'idle' && polishFrame < 2) {
      pixels.push(px(31, 13, goldScale), px(32, 12, goldScale), px(32, 11, skin));
    } else {
      pixels.push(px(31, 13, goldScale), px(31, 14, goldScale), px(31, 15, skin));
    }
    pixels.push(px(14, 13, goldScale), px(14, 14, goldScale), px(14, 15, skin));
  }

  // Legs (stout)
  const wf = frame % 2;
  if (state === 'walking') {
    pixels.push(px(18 + wf, 21, goldScale, 4, 1), px(18 + wf, 22, goldScale, 4, 1), px(18 + wf, 23, '#5D4037', 4, 1));
    pixels.push(px(24 - wf, 21, goldScale, 4, 1), px(24 - wf, 22, goldScale, 4, 1), px(24 - wf, 23, '#5D4037', 4, 1));
  } else {
    pixels.push(px(18, 21, goldScale, 4, 1), px(24, 21, goldScale, 4, 1));
    pixels.push(px(18, 22, goldScale, 4, 1), px(24, 22, goldScale, 4, 1));
    pixels.push(px(18, 23, '#5D4037', 4, 1), px(24, 23, '#5D4037', 4, 1));
  }

  // Floating coins
  const coinPositions = [
    { x: 10 + (frame % 3), y: 8 },
    { x: 33 - (frame % 3), y: 12 },
    { x: 12 + frame, y: 18 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Floating coins */}
      {coinPositions.map((c, i) => (
        <React.Fragment key={`coin-${i}`}>
          <circle cx={(c.x + 0.5) * P} cy={(c.y + 0.5) * P + yOff} r={P} fill={gold} />
          <circle cx={(c.x + 0.5) * P} cy={(c.y + 0.5) * P + yOff} r={P * 0.5} fill={goldDark} />
        </React.Fragment>
      ))}
    </svg>
  );
};

export default MammonSprite;
