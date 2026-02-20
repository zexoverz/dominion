"use client";
import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const EchoSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 140 : state === 'celebrating' ? 170 : 280;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const blink = frame === 5;
  const celebY = state === 'celebrating' ? [0, -1, -2, -3, -3, -2, -1, 0][frame] : 0;
  const floatY = state === 'idle' ? [0, -0.3, -0.5, -0.3, 0, 0.3, 0.5, 0.3][frame] : 0;
  const yOff = celebY + floatY;

  // Color cycle for shimmer
  const colorPhase = frame % 3;
  const pal: Record<string, string> = {
    // Magenta/pink (main body)
    M5: '#F8BBD0', M4: '#F06292', M3: '#EC407A', M2: '#C2185B', M1: '#880E4F',
    // Violet
    V5: '#E1BEE7', V4: '#CE93D8', V3: '#AB47BC', V2: '#8E24AA', V1: '#6A1B9A',
    // Pink-white (highlight)
    PW: '#FCE4EC', PWL: '#FFF0F5',
    // Sound wave cyan-ish
    SW4: '#F48FB1', SW3: '#F06292', SW2: '#EC407A', SW1: '#AD1457',
    // Skin (ghostly pale)
    S5: '#FFF0F5', S4: '#FFE4EC', S3: '#F8BBD0', S2: '#F48FB1', S1: '#EC407A',
    // Hair
    H5: '#F8BBD0', H4: '#F06292', H3: '#CE93D8', H2: '#AB47BC', H1: '#7B1FA2',
    // Dark
    K: '#1A0A1A',
  };

  // Shimmer: shift palette each frame
  const bodyColor = [pal.M3, pal.V3, pal.M4][colorPhase];
  const bodyHi = [pal.M4, pal.V4, pal.M5][colorPhase];
  const bodyDark = [pal.M2, pal.V2, pal.M1][colorPhase];
  const bodyDeep = [pal.M1, pal.V1, pal.M2][colorPhase];

  const p = (x: number, y: number, c: string, w = 1, h = 1, opacity?: number) => (
    <rect key={`${x},${y},${c},${w},${opacity || ''}`} x={x} y={y + yOff} width={w} height={h} fill={c} opacity={opacity} />
  );

  const pixels: React.ReactNode[] = [];

  // ===== ECHO COPIES (offset ghost copies) =====
  // Behind echo (lighter, offset left-2, up-1)
  const echoBehindX = -2;
  const echoBehindY = -1;
  // Ahead echo (lighter violet, offset right+2, down+1)
  const echoAheadX = 2;
  const echoAheadY = 1;

  const drawGhost = (dx: number, dy: number, opacity: number, tint: string) => {
    const ghosts: React.ReactNode[] = [];
    // Simplified body silhouette for ghosts
    for (let y = 6; y <= 48; y++) {
      const halfW = y < 12 ? 4 : y < 18 ? 5 : y < 28 ? 7 : y < 38 ? 8 : y < 44 ? 7 : 5;
      const cx = 31 + dx;
      const gy = y + dy;
      if (gy < 0 || gy > 63) continue;
      // Dithering for transparency
      for (let x = cx - halfW; x <= cx + halfW; x += 2) {
        if (x >= 0 && x < 64) {
          ghosts.push(<rect key={`g${dx}${dy}${x},${gy}`} x={x} y={gy + yOff} width={1} height={1} fill={tint} opacity={opacity} />);
        }
      }
    }
    return ghosts;
  };

  // Behind echo
  const echoVis = state === 'working' ? 0.35 : state === 'idle' ? 0.15 : 0.25;
  pixels.push(...drawGhost(echoBehindX, echoBehindY, echoVis, pal.M5));
  pixels.push(...drawGhost(echoAheadX, echoAheadY, echoVis * 0.8, pal.V4));

  // ===== HAIR (flowing, defying gravity, rows 2-14) =====
  const hairColor1 = [pal.H4, pal.H3, pal.H2][colorPhase];
  const hairColor2 = [pal.H3, pal.H2, pal.H1][colorPhase];
  const hairColor3 = [pal.H5, pal.H4, pal.H3][colorPhase];

  // Hair flows upward and outward
  const hairWave = Math.sin(frame * 0.8) * 2;
  pixels.push(p(28 + hairWave, 2, hairColor3, 2, 1));
  pixels.push(p(34 - hairWave, 2, hairColor2, 2, 1));
  pixels.push(p(26 + hairWave, 3, hairColor3, 3, 1));
  pixels.push(p(33 - hairWave, 3, hairColor2, 3, 1));
  pixels.push(p(25 + hairWave * 0.5, 4, hairColor1, 4, 1));
  pixels.push(p(33, 4, hairColor2, 4, 1));
  for (let y = 5; y <= 8; y++) {
    const spread = Math.round(hairWave * (8 - y) / 6);
    pixels.push(p(24 + spread, y, hairColor1, 2, 1));
    pixels.push(p(37 - spread, y, hairColor2, 2, 1));
  }
  // Hair behind head
  pixels.push(p(26, 5, hairColor2, 10, 4));

  // Long flowing strands going down/out
  for (let y = 9; y <= 20; y++) {
    const strand1X = 22 + Math.round(Math.sin((y + frame) * 0.5) * 1.5);
    const strand2X = 40 + Math.round(Math.sin((y + frame + 3) * 0.5) * 1.5);
    pixels.push(p(strand1X, y, hairColor2));
    pixels.push(p(strand2X, y, hairColor1));
    if (y < 16) {
      pixels.push(p(strand1X + 1, y, hairColor3));
      pixels.push(p(strand2X - 1, y, hairColor3));
    }
  }

  // ===== HEAD (rows 6-14) =====
  // Ethereal face
  for (let y = 6; y <= 14; y++) {
    const halfW = y < 8 ? 4 : y < 12 ? 5 : 4;
    const cx = 31;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const dist = Math.abs(x - cx);
      // Dithered transparency
      const isDither = (x + y) % 2 === 0;
      const shade = dist <= 1 ? pal.S4 : dist <= 3 ? pal.S3 : pal.S2;
      if (isDither || dist <= 2) {
        pixels.push(p(x, y, shade));
      }
    }
  }

  // Face features
  if (!blink) {
    pixels.push(p(28, 9, pal.V3)); pixels.push(p(29, 9, pal.PW)); pixels.push(p(30, 9, pal.K)); // left eye
    pixels.push(p(33, 9, pal.K)); pixels.push(p(34, 9, pal.PW)); pixels.push(p(35, 9, pal.V3)); // right eye
  } else {
    pixels.push(p(28, 9, pal.V2, 3, 1)); pixels.push(p(33, 9, pal.V2, 3, 1));
  }

  // Prominent mouth
  const mouthOpen = (state === 'working' || state === 'talking') && frame % 2 === 0;
  if (mouthOpen) {
    pixels.push(p(29, 12, pal.M1)); pixels.push(p(30, 12, pal.K, 3, 1)); pixels.push(p(33, 12, pal.M1));
    pixels.push(p(30, 13, pal.M2, 3, 1));
  } else {
    pixels.push(p(30, 12, pal.M2, 3, 1));
  }

  // ===== BODY: Flowing dress (rows 15-50) =====
  for (let y = 15; y <= 50; y++) {
    const halfW = y < 20 ? 6 : y < 28 ? 7 : y < 36 ? 8 : y < 44 ? 9 : 10;
    const cx = 31;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const dist = Math.abs(x - cx);
      // Dithered transparency effect - more transparent toward bottom
      const isDither = (x + y) % 2 === 0;
      const fadeOut = y > 40;
      const deepFade = y > 46;

      if (deepFade && !isDither) continue; // very transparent at bottom
      if (fadeOut && isDither && dist > halfW - 2) continue;

      const shade = dist <= 2 ? bodyHi : dist <= 4 ? bodyColor : dist <= 6 ? bodyDark : bodyDeep;
      pixels.push(p(x, y, shade, 1, 1, fadeOut ? 0.6 : undefined));
    }
  }

  // Dress edge glow
  for (let y = 15; y <= 44; y++) {
    const halfW = y < 20 ? 6 : y < 28 ? 7 : y < 36 ? 8 : 9;
    const wave = Math.sin((y + frame) * 0.4) * 0.5;
    pixels.push(p(31 - halfW + wave, y, pal.PW));
    pixels.push(p(31 + halfW - wave, y, pal.PW));
  }

  // ===== ARMS =====
  if (state === 'working' || state === 'talking') {
    // Arms extended, sound waves from hands
    pixels.push(p(22, 18, bodyColor)); pixels.push(p(20, 20, bodyDark)); pixels.push(p(18, 22, pal.S3));
    pixels.push(p(40, 18, bodyColor)); pixels.push(p(42, 20, bodyDark)); pixels.push(p(44, 22, pal.S3));
  } else if (state === 'celebrating') {
    pixels.push(p(22, 16, bodyColor)); pixels.push(p(20, 14, bodyDark)); pixels.push(p(19, 12, pal.S3));
    pixels.push(p(40, 16, bodyColor)); pixels.push(p(42, 14, bodyDark)); pixels.push(p(43, 12, pal.S3));
  } else if (state === 'thinking') {
    pixels.push(p(40, 17, bodyColor)); pixels.push(p(39, 15, bodyDark)); pixels.push(p(36, 14, pal.S3));
    pixels.push(p(22, 18, bodyColor)); pixels.push(p(21, 20, bodyDark)); pixels.push(p(20, 22, pal.S3));
  } else {
    pixels.push(p(23, 18, bodyColor)); pixels.push(p(22, 20, bodyDark)); pixels.push(p(22, 22, pal.S3));
    pixels.push(p(39, 18, bodyColor)); pixels.push(p(40, 20, bodyDark)); pixels.push(p(40, 22, pal.S3));
  }

  // ===== SOUND WAVES =====
  if (state === 'working' || state === 'talking') {
    // Large sound waves from mouth
    for (let ring = 0; ring < 4; ring++) {
      const r = 4 + ring * 3 + (frame % 3);
      const opacity = 0.4 - ring * 0.1;
      const waveColor = ring % 2 === 0 ? pal.SW3 : pal.SW4;
      // Draw arc segments
      for (let a = -3; a <= 3; a++) {
        const wx = Math.round(31 + Math.cos(a * 0.3) * r);
        const wy = Math.round(12 + Math.sin(a * 0.3) * r * 0.3);
        if (wx >= 0 && wx < 64 && wy >= 0 && wy < 64) {
          pixels.push(p(wx, wy, waveColor, 1, 1, opacity));
        }
      }
    }
  } else if (state === 'idle') {
    // Soft hum waves (small)
    for (let ring = 0; ring < 2; ring++) {
      const r = 3 + ring * 2 + (frame % 2);
      for (let a = -2; a <= 2; a++) {
        const wx = Math.round(31 + Math.cos(a * 0.3) * r);
        const wy = Math.round(12 + Math.sin(a * 0.3) * r * 0.3);
        if (wx >= 0 && wx < 64 && wy >= 0 && wy < 64) {
          pixels.push(p(wx, wy, pal.SW4, 1, 1, 0.2));
        }
      }
    }
  }

  // Walking legs
  if (state === 'walking') {
    const wf = frame % 4;
    pixels.push(p(28 + (wf < 2 ? 0 : 2), 48, bodyDark, 3, 2));
    pixels.push(p(33 - (wf < 2 ? 0 : 2), 48, bodyDark, 3, 2));
  }

  // ===== GLOW EFFECTS =====
  const glows: React.ReactNode[] = [];

  // Body glow (ethereal shimmer)
  glows.push(<ellipse key="bg" cx={31} cy={30 + yOff} rx={10} ry={18} fill={bodyHi} opacity={0.06} />);

  // Eye glow
  if (!blink) {
    glows.push(<circle key="el" cx={29} cy={9.5 + yOff} r={2} fill={pal.PW} opacity={0.3} />);
    glows.push(<circle key="er" cx={34} cy={9.5 + yOff} r={2} fill={pal.PW} opacity={0.3} />);
  }

  // Working: mouth glow for sound
  if (state === 'working' || state === 'talking') {
    glows.push(<circle key="mg" cx={31} cy={12 + yOff} r={3} fill={pal.SW3} opacity={0.25} />);
  }

  // Ghost copy glows
  glows.push(<ellipse key="gb" cx={29} cy={30 + yOff - 1} rx={6} ry={12} fill={pal.M5} opacity={echoVis * 0.3} />);
  glows.push(<ellipse key="ga" cx={33} cy={30 + yOff + 1} rx={6} ry={12} fill={pal.V4} opacity={echoVis * 0.25} />);

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="64" height="64" fill="transparent" />
      {pixels}
      {glows}
    </svg>
  );
};

export default EchoSprite;
