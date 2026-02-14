import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const P = 2;

const ThroneSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 200 : state === 'walking' ? 250 : state === 'celebrating' ? 180 : 400;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 5;
  const walkFrame = frame % 2;
  const talkOpen = frame % 2 === 0;
  const celebrateJump = frame < 4 ? 0 : -4;
  const breathe = frame % 4 < 2 ? 0 : 0.5;

  const yOff = state === 'celebrating' ? celebrateJump : 0;
  const bodyY = state === 'idle' ? breathe : 0;

  // Rich color palette
  const skin = '#F2D2A9';
  const skinShade = '#D4A574';
  const skinHi = '#FAEBD7';
  const purple = '#7B2FB0';
  const purpleMid = '#6B2FA0';
  const darkPurple = '#4A1D6E';
  const deepPurple = '#2E0854';
  const lightPurple = '#9B59B6';
  const gold = '#FFD700';
  const goldHi = '#FFF8A0';
  const goldMid = '#DAA520';
  const goldDark = '#B8860B';
  const red = '#E53935';
  const redDark = '#B71C1C';
  const capePrimary = '#7B1FA2';
  const capeShade = '#4A148C';
  const capeHi = '#AB47BC';
  const hair = '#2C1810';
  const boot = '#3E2723';
  const bootHi = '#5D4037';

  // Crown glimmer rotates
  const glimmerPos = frame % 5;
  const eyeColor = frame % 3 === 0 ? '#FFD700' : frame % 3 === 1 ? '#FFF8C4' : '#FFE44D';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${w}-${h}`} x={x * P} y={(y * P) + yOff + bodyY} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // === CROWN (3D with jewels) ===
  // Crown points (5 tines)
  pixels.push(px(19, 2, gold), px(21, 2, gold), px(23, 2, goldHi), px(25, 2, gold), px(27, 2, gold));
  pixels.push(px(19, 3, goldMid), px(20, 3, gold), px(21, 3, goldHi), px(22, 3, gold), px(23, 3, gold), px(24, 3, gold), px(25, 3, goldHi), px(26, 3, gold), px(27, 3, goldMid));
  // Crown band
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 4, x === 18 || x === 28 ? goldDark : gold));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 5, x === 18 || x === 28 ? goldDark : goldMid));
  // Crown jewels
  pixels.push(px(20, 4, red), px(23, 4, '#4169E1'), px(26, 4, red));
  pixels.push(px(20, 5, redDark), px(23, 5, '#27408B'), px(26, 5, redDark));
  // Glimmer highlight
  const glimX = [19, 21, 23, 25, 27][glimmerPos];
  pixels.push(px(glimX, 2, goldHi));

  // === HAIR ===
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 6, hair));
  pixels.push(px(18, 7, hair), px(28, 7, hair));

  // === HEAD (8 wide for detail) ===
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 7, skin));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 8, x === 18 || x === 28 ? skinShade : skin));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 9, x === 18 || x === 28 ? skinShade : skin));
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 10, skin));
  for (let x = 20; x <= 26; x++) pixels.push(px(x, 11, x === 20 || x === 26 ? skinShade : skin));

  // Brow line
  pixels.push(px(20, 7, skinShade), px(21, 7, skinShade), px(25, 7, skinShade), px(26, 7, skinShade));

  // Eyes with detail
  if (!blink) {
    pixels.push(px(20, 8, '#FFF', 2, 1), px(25, 8, '#FFF', 2, 1)); // whites
    pixels.push(px(21, 8, eyeColor), px(26, 8, eyeColor)); // iris
    pixels.push(px(21, 9, '#1A1A1A'), px(26, 9, '#1A1A1A')); // pupils
    pixels.push(px(20, 9, skinShade), px(22, 9, skinShade), px(25, 9, skinShade), px(27, 9, skinShade)); // lower lid
  } else {
    pixels.push(px(20, 9, '#1A1A1A', 3, 1), px(25, 9, '#1A1A1A', 3, 1));
  }

  // Nose
  pixels.push(px(23, 9, skinShade), px(23, 10, skinShade));

  // Mouth
  if (state === 'talking' && talkOpen) {
    pixels.push(px(22, 11, '#8B4513', 3, 1));
  } else {
    pixels.push(px(22, 11, '#C4956A', 3, 1));
  }

  // Stern expression - slight frown lines
  pixels.push(px(19, 8, skinShade), px(27, 8, skinShade));

  // Neck
  pixels.push(px(22, 12, skin), px(23, 12, skin), px(24, 12, skin));
  pixels.push(px(21, 12, skinShade), px(25, 12, skinShade));

  // === TORSO - Royal robes with gold trim ===
  // Collar
  pixels.push(px(19, 13, gold), px(20, 13, goldMid), px(21, 13, purple), px(22, 13, purple), px(23, 13, purple), px(24, 13, purple), px(25, 13, purple), px(26, 13, goldMid), px(27, 13, gold));

  // Main robe body
  for (let y = 14; y < 21; y++) {
    const w = y < 16 ? 12 : 14;
    const sx = Math.floor(23 - w / 2);
    for (let x = sx; x < sx + w; x++) {
      if (x === sx || x === sx + w - 1) pixels.push(px(x, y, gold));
      else if (x === sx + 1 || x === sx + w - 2) pixels.push(px(x, y, goldMid));
      else {
        // Shading: center lighter
        const distFromCenter = Math.abs(x - 23);
        pixels.push(px(x, y, distFromCenter > 3 ? darkPurple : distFromCenter > 1 ? purpleMid : purple));
      }
    }
  }

  // Royal crest on chest
  pixels.push(px(22, 15, goldHi), px(23, 15, gold), px(24, 15, goldHi));
  pixels.push(px(23, 16, gold));

  // Gold belt with ornate buckle
  for (let x = 17; x < 30; x++) pixels.push(px(x, 18, goldDark));
  for (let x = 17; x < 30; x++) pixels.push(px(x, 19, goldMid));
  pixels.push(px(22, 18, red), px(23, 18, gold), px(24, 18, red));
  pixels.push(px(22, 19, goldHi), px(23, 19, redDark), px(24, 19, goldHi));

  // === CAPE (flowing, 2-tone purple with shading) ===
  for (let y = 13; y < 26; y++) {
    const capeWidth = y < 16 ? 1 : y < 20 ? 2 : 3;
    const capeShading = y % 2 === 0 ? capePrimary : capeShade;
    const hi = y % 3 === 0 ? capeHi : capePrimary;
    // Left cape
    for (let i = 0; i < capeWidth; i++) {
      pixels.push(px(16 - i, y, i === 0 ? hi : capeShading));
    }
    // Right cape
    for (let i = 0; i < capeWidth; i++) {
      pixels.push(px(30 + i, y, i === 0 ? hi : capeShading));
    }
  }
  // Cape flow animation
  if (state === 'idle') {
    const phase = frame % 4;
    if (phase < 2) {
      pixels.push(px(13, 24, capeShade), px(13, 25, capeHi));
      pixels.push(px(33, 24, capeShade), px(33, 25, capeHi));
    } else {
      pixels.push(px(14, 24, capeShade), px(14, 25, capeHi));
      pixels.push(px(32, 24, capeShade), px(32, 25, capeHi));
    }
  }
  // Cape bottom edge
  for (let x = 14; x < 17; x++) pixels.push(px(x, 26, capeShade));
  for (let x = 30; x < 33; x++) pixels.push(px(x, 26, capeShade));

  // === ARMS ===
  if (state === 'working') {
    // Right arm raised with scepter
    pixels.push(px(29, 14, purple), px(30, 13, purple), px(31, 12, purpleMid), px(32, 11, skin), px(32, 10, skin));
    // Scepter extended upward
    pixels.push(px(33, 5, goldHi), px(33, 6, gold), px(33, 7, goldMid), px(33, 8, goldDark));
    for (let y = 9; y <= 11; y++) pixels.push(px(33, y, goldDark));
    // Scepter orb with energy
    pixels.push(px(32, 4, '#FF6F00'), px(33, 4, red), px(34, 4, '#FF6F00'));
    pixels.push(px(33, 3, '#FFAB00'));
    // Energy particles
    const ePhase = frame % 4;
    pixels.push(px(31 + ePhase, 2, goldHi));
    pixels.push(px(35 - ePhase, 3, '#FF6F00'));
    if (frame % 2 === 0) {
      pixels.push(px(31, 1, red));
      pixels.push(px(35, 5, gold));
    }
    // Left arm down
    pixels.push(px(16, 14, purple), px(15, 15, purpleMid), px(14, 16, skin));
  } else if (state === 'thinking') {
    pixels.push(px(29, 14, purple), px(29, 13, purple), px(27, 11, skin)); // hand near chin
    pixels.push(px(16, 14, purple), px(15, 15, purpleMid), px(14, 14, gold));
    for (let y = 6; y < 15; y++) pixels.push(px(14, y, goldDark)); // scepter held left
    pixels.push(px(14, 5, red)); // scepter gem
    if (frame % 2 === 0) pixels.push(px(29, 5, goldHi));
    if (frame % 4 < 2) pixels.push(px(31, 3, '#FFD70088'));
  } else if (state === 'celebrating') {
    pixels.push(px(29, 11, purple), px(30, 10, purpleMid), px(31, 9, skin));
    pixels.push(px(16, 11, purple), px(15, 10, purpleMid), px(14, 9, skin));
    pixels.push(px(32, 8, gold), px(32, 7, gold), px(32, 6, red)); // scepter in air
    // Sparkles
    if (frame % 2 === 0) {
      pixels.push(px(12, 7, goldHi), px(34, 6, goldHi), px(10, 5, gold));
    }
  } else if (state === 'walking') {
    pixels.push(px(29, 14, purple), px(30, 15, skin));
    pixels.push(px(16, 15, purple), px(15, 16, skin));
    // Scepter at side
    for (let y = 12; y <= 18; y++) pixels.push(px(31, y, goldDark));
    pixels.push(px(31, 11, red));
  } else {
    // Idle: scepter in right hand
    pixels.push(px(29, 14, purple), px(29, 15, purpleMid), px(29, 16, skin));
    // Scepter
    for (let y = 7; y <= 16; y++) pixels.push(px(30, y, y < 10 ? gold : goldDark));
    pixels.push(px(30, 6, red), px(29, 5, goldHi), px(31, 5, goldHi), px(30, 5, '#FF6F00'));
    // Left arm
    pixels.push(px(16, 14, purple), px(16, 15, purpleMid), px(16, 16, skin));
  }

  // === LEGS / ROBE BOTTOM ===
  if (state === 'walking') {
    if (walkFrame === 0) {
      pixels.push(px(19, 21, darkPurple, 4, 1), px(19, 22, deepPurple, 4, 1), px(19, 23, deepPurple, 4, 1));
      pixels.push(px(19, 24, boot, 4, 1));
      pixels.push(px(24, 21, darkPurple, 4, 1), px(25, 22, deepPurple, 4, 1), px(26, 23, deepPurple, 4, 1));
      pixels.push(px(26, 24, boot, 4, 1));
    } else {
      pixels.push(px(19, 21, darkPurple, 4, 1), px(18, 22, deepPurple, 4, 1), px(17, 23, deepPurple, 4, 1));
      pixels.push(px(17, 24, boot, 4, 1));
      pixels.push(px(24, 21, darkPurple, 4, 1), px(24, 22, deepPurple, 4, 1), px(24, 23, deepPurple, 4, 1));
      pixels.push(px(24, 24, boot, 4, 1));
    }
  } else {
    // Flowing robe bottom
    for (let x = 17; x < 30; x++) {
      const shade = (x + frame) % 3 === 0 ? purpleMid : darkPurple;
      pixels.push(px(x, 21, shade));
    }
    for (let x = 18; x < 29; x++) pixels.push(px(x, 22, deepPurple));
    for (let x = 18; x < 29; x++) pixels.push(px(x, 23, deepPurple));
    // Gold robe hem
    for (let x = 18; x < 29; x++) pixels.push(px(x, 24, goldDark));
    // Boots peeking
    pixels.push(px(19, 25, boot, 3, 1), px(25, 25, boot, 3, 1));
    pixels.push(px(19, 25, bootHi), px(25, 25, bootHi));
  }

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Eye glow */}
      {!blink && (
        <>
          <circle cx={21 * P + P / 2} cy={8 * P + P / 2 + yOff + bodyY} r={3} fill={eyeColor} opacity={0.35} />
          <circle cx={26 * P + P / 2} cy={8 * P + P / 2 + yOff + bodyY} r={3} fill={eyeColor} opacity={0.35} />
        </>
      )}
      {/* Crown glow */}
      <rect x={18 * P} y={4 * P + yOff + bodyY} width={11 * P} height={2 * P} fill={goldHi} opacity={0.08} />
      {/* Working: energy particles from scepter */}
      {state === 'working' && (
        <>
          <circle cx={33 * P + P / 2} cy={4 * P + yOff + bodyY} r={6} fill={red} opacity={0.3} />
          <circle cx={33 * P + P / 2} cy={4 * P + yOff + bodyY} r={10} fill={'#FF6F00'} opacity={0.12} />
        </>
      )}
    </svg>
  );
};

export default ThroneSprite;
