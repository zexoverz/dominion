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
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const hoverY = state === 'idle' ? [0, 0, -1, -1, 0, 0, 1, 1][frame] * 0.5 : 0;
  const celebY = state === 'celebrating' ? (frame < 4 ? 0 : -4) : 0;
  const yOff = hoverY + celebY;
  const visorFlicker = frame % 3 !== 0;

  const black = '#1A1A1A';
  const darkGray = '#2D2D2D';
  const midGray = '#3A3A3A';
  const green = '#00E676';
  const greenBright = '#69F0AE';
  const greenMid = '#00C853';
  const greenDark = '#1B5E20';
  const greenDim = '#2E7D32';
  const skin = '#B0BEC5';
  const skinShade = '#90A4AE';
  const skinHi = '#CFD8DC';
  const metalBright = '#90A4AE';
  const metalMid = '#78909C';
  const metalDark = '#455A64';
  const metalDeep = '#37474F';
  const jointGreen = '#00E676';

  const px = (x: number, y: number, c: string, w = 1, h = 1) => (
    <rect key={`${x}-${y}-${w}-${h}`} x={x * P} y={y * P + yOff} width={w * P} height={h * P} fill={c} />
  );

  const pixels: React.ReactNode[] = [];

  // === HOOD (angular, tech-style) ===
  pixels.push(px(21, 3, black), px(22, 3, black), px(23, 3, black), px(24, 3, black));
  for (let x = 19; x <= 26; x++) pixels.push(px(x, 4, black));
  for (let x = 18; x <= 28; x++) pixels.push(px(x, 5, x < 20 || x > 26 ? black : darkGray));
  for (let x = 17; x <= 29; x++) pixels.push(px(x, 6, x < 19 || x > 27 ? black : darkGray));
  for (let x = 17; x <= 29; x++) pixels.push(px(x, 7, x < 19 || x > 27 ? black : midGray));

  // === FACE (pale, cybernetic) ===
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 8, x === 19 || x === 27 ? skinShade : skin));
  for (let x = 19; x <= 27; x++) pixels.push(px(x, 9, skin));
  for (let x = 20; x <= 26; x++) pixels.push(px(x, 10, skin));
  for (let x = 21; x <= 25; x++) pixels.push(px(x, 11, skinShade));

  // === GREEN VISOR (clear band across eyes) ===
  const visorColor = visorFlicker ? green : greenMid;
  const visorHi = visorFlicker ? greenBright : green;
  for (let x = 19; x <= 27; x++) {
    pixels.push(px(x, 8, x === 23 ? visorHi : visorColor));
  }
  // Visor frame (metallic edges)
  pixels.push(px(18, 8, metalDark), px(28, 8, metalDark));
  // Scanline on visor
  if (frame % 4 < 2) {
    pixels.push(px(20 + (frame % 4) * 2, 8, greenBright));
  }

  // Nose/mouth
  pixels.push(px(23, 10, skinShade));
  if (state === 'talking' && frame % 2 === 0) {
    pixels.push(px(22, 11, '#546E7A', 2, 1));
  } else {
    pixels.push(px(22, 11, skinShade), px(23, 11, skinShade));
  }

  // Neck with implant
  pixels.push(px(22, 12, skin), px(23, 12, skin), px(24, 12, skin));
  pixels.push(px(23, 12, greenDark)); // neck implant

  // === TORSO - Dark cloak with circuit patterns ===
  for (let y = 13; y < 22; y++) {
    const w = y < 15 ? 10 : y < 18 ? 12 : 14;
    const sx = Math.floor(23 - w / 2);
    for (let x = sx; x < sx + w; x++) {
      const isEdge = x === sx || x === sx + w - 1;
      pixels.push(px(x, y, isEdge ? darkGray : black));
    }
  }

  // Circuit line patterns (green thin lines on cloak)
  // Left circuit path
  pixels.push(px(20, 14, greenDark), px(20, 15, greenDark), px(21, 15, greenDark), px(22, 15, greenDark), px(22, 16, greenDark));
  pixels.push(px(20, 18, greenDark), px(21, 18, greenDark), px(21, 19, greenDark));
  // Right circuit path
  pixels.push(px(26, 14, greenDark), px(26, 15, greenDark), px(25, 15, greenDark), px(24, 15, greenDark), px(24, 16, greenDark));
  pixels.push(px(26, 18, greenDark), px(25, 18, greenDark), px(25, 19, greenDark));
  // Circuit nodes (brighter)
  pixels.push(px(22, 16, greenDim), px(24, 16, greenDim));
  pixels.push(px(21, 19, greenDim), px(25, 19, greenDim));
  // Animated circuit pulse
  const pulsePos = frame % 6;
  const circuitPath = [[20, 14], [20, 15], [21, 15], [22, 15], [22, 16], [22, 16]];
  if (pulsePos < circuitPath.length) {
    pixels.push(px(circuitPath[pulsePos][0], circuitPath[pulsePos][1], green));
  }

  // === MECHANICAL LEFT ARM (detailed joints) ===
  if (state === 'working') {
    // Both arms typing on floating terminal
    // Mech arm
    pixels.push(px(16, 14, metalMid), px(15, 15, metalDark), px(15, 16, jointGreen), px(14, 17, metalBright), px(14, 18, metalMid));
    // Fingers typing (animated)
    const fingerPhase = frame % 4;
    pixels.push(px(13 + fingerPhase, 19, metalBright));
    pixels.push(px(15 - (fingerPhase % 2), 19, metalMid));
    // Right arm
    pixels.push(px(30, 14, black), px(31, 15, darkGray), px(31, 16, skin), px(31, 17, skinShade));
    pixels.push(px(30 + (fingerPhase % 2), 19, skin));
    pixels.push(px(32 - (fingerPhase % 2), 19, skinShade));

    // Holographic green screens
    // Main screen
    for (let y = 17; y <= 20; y++) {
      for (let x = 13; x <= 33; x++) {
        if (y === 17 || y === 20 || x === 13 || x === 33) {
          pixels.push(px(x, y, green));
        }
      }
    }
    // Screen content (scrolling code)
    const codeOffset = frame * 2;
    for (let i = 0; i < 5; i++) {
      const cx = 15 + ((codeOffset + i * 3) % 16);
      pixels.push(px(cx, 18, greenBright), px(cx + 1, 18, green));
      pixels.push(px(cx + 2, 19, greenMid), px(cx, 19, green));
    }
    // Side screen (smaller)
    pixels.push(px(10, 14, green), px(11, 14, green), px(12, 14, green));
    pixels.push(px(10, 15, green), px(12, 15, green));
    pixels.push(px(10, 16, green), px(11, 16, green), px(12, 16, green));
    pixels.push(px(11, 15, greenBright));
  } else if (state === 'thinking') {
    pixels.push(px(16, 14, metalMid), px(15, 15, metalDark), px(15, 16, jointGreen));
    pixels.push(px(30, 13, black), px(28, 11, skin));
    if (frame > 3) pixels.push(px(31, 5, green), px(33, 3, greenDim));
  } else if (state === 'celebrating') {
    pixels.push(px(16, 11, metalMid), px(15, 10, metalDark), px(15, 9, jointGreen));
    pixels.push(px(30, 11, black), px(31, 10, skin));
  } else if (state === 'walking') {
    // Swinging arms
    const swing = frame % 2;
    pixels.push(px(16, 14 - swing, metalMid), px(15, 15 - swing, metalDark), px(15, 16 - swing, jointGreen), px(14, 17 - swing, metalBright));
    pixels.push(px(30, 14 + swing, black), px(31, 15 + swing, skin));
  } else {
    // Detailed mechanical arm at rest
    pixels.push(px(16, 14, metalMid), px(15, 15, metalDark)); // upper arm
    pixels.push(px(15, 16, jointGreen)); // elbow joint (glows)
    pixels.push(px(14, 17, metalBright), px(14, 18, metalMid)); // forearm
    pixels.push(px(13, 19, metalDark), px(14, 19, metalBright)); // hand
    // Joint detail
    pixels.push(px(16, 16, metalDeep));
    // Right arm (organic)
    pixels.push(px(30, 14, black), px(30, 15, darkGray), px(30, 16, skin));
  }

  // Cloak billow in idle
  if (state === 'idle') {
    const billowPhase = frame % 4;
    if (billowPhase < 2) {
      pixels.push(px(15, 20, darkGray), px(31, 21, darkGray));
    } else {
      pixels.push(px(15, 21, darkGray), px(31, 20, darkGray));
    }
  }

  // === LEGS ===
  const walkFrame = frame % 2;
  if (state === 'walking') {
    if (walkFrame === 0) {
      pixels.push(px(19, 22, darkGray, 4, 1), px(18, 23, darkGray, 4, 1), px(18, 24, midGray, 4, 1), px(18, 25, '#333', 4, 1));
      pixels.push(px(24, 22, darkGray, 4, 1), px(25, 23, darkGray, 4, 1), px(26, 24, midGray, 4, 1), px(26, 25, '#333', 4, 1));
    } else {
      pixels.push(px(19, 22, darkGray, 4, 1), px(20, 23, darkGray, 4, 1), px(21, 24, midGray, 4, 1), px(21, 25, '#333', 4, 1));
      pixels.push(px(24, 22, darkGray, 4, 1), px(24, 23, darkGray, 4, 1), px(24, 24, midGray, 4, 1), px(24, 25, '#333', 4, 1));
    }
  } else {
    for (let x = 17; x <= 29; x++) pixels.push(px(x, 22, darkGray));
    pixels.push(px(19, 23, darkGray, 4, 1), px(24, 23, darkGray, 4, 1));
    pixels.push(px(19, 24, midGray, 4, 1), px(24, 24, midGray, 4, 1));
    pixels.push(px(19, 25, '#333', 4, 1), px(24, 25, '#333', 4, 1));
    // Boot detail
    pixels.push(px(19, 25, greenDark), px(24, 25, greenDark));
  }

  return (
    <svg width={size} height={size} viewBox="0 0 96 96" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="96" height="96" fill="transparent" />
      {pixels}
      {/* Visor glow */}
      {visorFlicker && (
        <rect x={19 * P} y={8 * P + yOff} width={9 * P} height={P} fill={green} opacity={0.2} rx={1} />
      )}
      {/* Mechanical joint glow */}
      <circle cx={15 * P + P / 2} cy={16 * P + P / 2 + yOff} r={3} fill={jointGreen} opacity={0.35} />
      {/* Working: holographic screen glow */}
      {state === 'working' && (
        <rect x={13 * P} y={17 * P + yOff} width={21 * P} height={4 * P} fill={green} opacity={0.08} />
      )}
    </svg>
  );
};

export default PhantomSprite;
