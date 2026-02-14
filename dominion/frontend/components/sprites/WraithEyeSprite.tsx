"use client";
import React, { useState, useEffect } from 'react';

interface SpriteProps {
  size?: number;
  state?: 'idle' | 'working' | 'thinking' | 'walking' | 'talking' | 'celebrating';
  className?: string;
}

const WraithEyeSprite: React.FC<SpriteProps> = ({ size = 96, state = 'idle', className }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const speed = state === 'working' ? 150 : state === 'celebrating' ? 190 : 350;
    const iv = setInterval(() => setFrame(f => (f + 1) % 8), speed);
    return () => clearInterval(iv);
  }, [state]);

  const celebY = state === 'celebrating' ? [0, -1, -2, -2, -1, 0, 0, 0][frame] : 0;
  const breathe = state === 'idle' ? [0, 0.2, 0.3, 0.2, 0, -0.2, -0.3, -0.2][frame] : 0;
  const yOff = celebY + breathe;

  // Blink (the big eye)
  const blinkPhase = frame === 7 ? 1 : frame === 0 ? 0.5 : 0; // periodic blink

  const pal: Record<string, string> = {
    // Black/shadow (cloak)
    K5: '#2D2D3D', K4: '#1E1E2E', K3: '#141420', K2: '#0A0A14', K1: '#050508',
    // Dark purple (hood lining, tendrils)
    DP5: '#4A3060', DP4: '#3D2450', DP3: '#2E1A3D', DP2: '#1F1028', DP1: '#120A1A',
    // Red/crimson (THE EYE)
    R5: '#FF8A80', R4: '#FF5252', R3: '#F44336', R2: '#D32F2F', R1: '#B71C1C',
    RC: '#7F0000', // deep crimson
    // Sclera (white of the eye, veiny)
    SC: '#F5F5F5', SCV: '#FFCDD2', SCG: '#E0E0E0',
    // Pupil
    PU: '#0A0A0A',
    // Observation orb red
    OR3: '#FF5252', OR2: '#D32F2F', OR1: '#B71C1C',
    // Scan beam
    SB: '#FF1744',
    K: '#000000',
  };

  const p = (x: number, y: number, c: string, w = 1, h = 1, opacity?: number) => (
    <rect key={`${x},${y},${c},${w},${opacity||''}`} x={x} y={y + yOff} width={w} height={h} fill={c} opacity={opacity} />
  );

  const pixels: React.ReactNode[] = [];

  // ===== POINTED HOOD (rows 2-12) =====
  // Sharp peaked hood
  pixels.push(p(31, 1, pal.K1));
  pixels.push(p(30, 2, pal.K1, 3, 1));
  pixels.push(p(29, 3, pal.K2, 5, 1));
  pixels.push(p(28, 4, pal.K2, 7, 1));
  pixels.push(p(27, 5, pal.K3, 9, 1));
  pixels.push(p(26, 6, pal.K3, 11, 1));
  pixels.push(p(25, 7, pal.K4, 13, 1));
  pixels.push(p(24, 8, pal.K4, 15, 1));
  pixels.push(p(23, 9, pal.K4, 17, 1));
  pixels.push(p(23, 10, pal.K5, 17, 1));
  pixels.push(p(23, 11, pal.K4, 17, 1));
  pixels.push(p(24, 12, pal.K3, 15, 1));

  // Hood interior lining (dark purple)
  pixels.push(p(27, 6, pal.DP3, 9, 1));
  pixels.push(p(26, 7, pal.DP3, 11, 1));
  pixels.push(p(25, 8, pal.DP4, 13, 1));
  pixels.push(p(25, 9, pal.DP4, 13, 1));
  pixels.push(p(25, 10, pal.DP3, 13, 1));
  pixels.push(p(25, 11, pal.DP2, 13, 1));

  // ===== THE EYE (rows 7-16) - MASSIVE, detailed =====
  // Pupil position (tracks/looks around in idle)
  const pupilDX = state === 'idle' ? [0, 0, 1, 1, 0, -1, -1, 0][frame] : state === 'working' ? 0 : 0;
  const pupilDY = state === 'idle' ? [0, -0.5, 0, 0.5, 0, 0.5, 0, -0.5][frame] : 0;

  // Eye opening (affected by blink)
  const eyeOpenness = blinkPhase > 0 ? (blinkPhase > 0.5 ? 0 : 0.5) : 1;

  if (eyeOpenness > 0) {
    // Sclera (white of eye with veins) - large oval
    const eyeCX = 31;
    const eyeCY = 11;
    const eyeRX = 5;
    const eyeRY = eyeOpenness > 0.5 ? 4 : 2;

    for (let ey = eyeCY - eyeRY; ey <= eyeCY + eyeRY; ey++) {
      const rowDist = Math.abs(ey - eyeCY) / eyeRY;
      const rowWidth = Math.round(eyeRX * Math.sqrt(1 - rowDist * rowDist));
      for (let ex = eyeCX - rowWidth; ex <= eyeCX + rowWidth; ex++) {
        // Veiny sclera
        const isVein = ((ex + ey * 3) % 7 === 0) || ((ex * 2 + ey) % 11 === 0);
        pixels.push(p(ex, ey, isVein ? pal.SCV : pal.SC));
      }
    }

    // 5 concentric iris rings
    const irisCX = eyeCX + pupilDX;
    const irisCY = eyeCY + pupilDY;
    const irisR = 3;
    const irisColors = [pal.R1, pal.R2, pal.R3, pal.R4, pal.R5];

    for (let iy = irisCY - irisR; iy <= irisCY + irisR; iy++) {
      for (let ix = irisCX - irisR; ix <= irisCX + irisR; ix++) {
        const dist = Math.sqrt((ix - irisCX) ** 2 + (iy - irisCY) ** 2);
        if (dist <= irisR) {
          const ring = Math.floor(dist / irisR * 5);
          const color = irisColors[Math.min(ring, 4)];
          pixels.push(p(Math.round(ix), Math.round(iy), color));
        }
      }
    }

    // Slit pupil (vertical, dilates when working)
    const pupilWidth = state === 'working' ? 2 : 1;
    const pupilHeight = 3;
    for (let py = irisCY - 1; py <= irisCY + 1; py++) {
      for (let px2 = 0; px2 < pupilWidth; px2++) {
        pixels.push(p(Math.round(irisCX) - Math.floor(pupilWidth / 2) + px2, Math.round(py), pal.PU));
      }
    }

    // Eye highlight
    pixels.push(p(Math.round(irisCX) - 1, Math.round(irisCY) - 1, '#FFFFFF'));
  } else {
    // Blink - closed eye line
    pixels.push(p(26, 11, pal.R2, 11, 1));
  }

  // ===== CLOAK BODY (rows 13-48) =====
  for (let y = 13; y <= 48; y++) {
    const halfW = y < 18 ? 7 : y < 24 ? 8 : y < 32 ? 9 : y < 40 ? 10 : 11;
    const cx = 31;
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const dist = Math.abs(x - cx);
      const isEdge = x === cx - halfW || x === cx + halfW;
      // Dissolving into shadow at bottom
      const fadeY = y > 40;
      const deepFade = y > 44;

      if (deepFade && (x + y) % 2 !== 0) continue; // dithered fade
      if (isEdge) {
        pixels.push(p(x, y, pal.K1, 1, 1, fadeY ? 0.7 : undefined));
      } else {
        const shade = dist <= 2 ? pal.K4 : dist <= 5 ? pal.K3 : pal.K2;
        pixels.push(p(x, y, shade, 1, 1, fadeY ? 0.7 : undefined));
      }
    }
  }

  // Dark aura (surrounding darker pixels)
  for (let y = 8; y <= 48; y += 2) {
    const halfW = y < 18 ? 8 : y < 32 ? 10 : 12;
    pixels.push(p(31 - halfW, y, pal.K1, 1, 1, 0.3));
    pixels.push(p(31 + halfW, y, pal.K1, 1, 1, 0.3));
    if (y > 20) {
      pixels.push(p(31 - halfW - 1, y, pal.DP1, 1, 1, 0.15));
      pixels.push(p(31 + halfW + 1, y, pal.DP1, 1, 1, 0.15));
    }
  }

  // ===== SHADOW TENDRILS (5-7 from base) =====
  const tendrilCount = 7;
  for (let t = 0; t < tendrilCount; t++) {
    const baseX = 22 + t * 3;
    const phaseOffset = t * 1.3;
    for (let seg = 0; seg < 8; seg++) {
      const ty = 48 + seg;
      const tx = baseX + Math.round(Math.sin((frame * 0.8 + phaseOffset + seg * 0.4)) * (1.5 + seg * 0.2));
      if (ty < 64 && tx >= 0 && tx < 64) {
        const fade = seg > 4;
        const isDither = (tx + ty) % 2 === 0;
        if (fade && !isDither) continue;
        pixels.push(p(tx, ty, seg < 3 ? pal.DP3 : seg < 5 ? pal.DP2 : pal.DP1, 1, 1, fade ? 0.5 : 0.8));
      }
    }
  }

  // ===== OBSERVATION ORBS (3-4 floating red eyes) =====
  const orbCount = 4;
  const orbR = state === 'working' ? 18 : 14;
  const orbSpeed = state === 'working' ? 0.4 : 0.2;

  for (let i = 0; i < orbCount; i++) {
    const angle = frame * orbSpeed + i * (Math.PI * 2 / orbCount) + Math.PI / 6;
    const ox = Math.round(31 + Math.cos(angle) * orbR);
    const oy = Math.round(24 + Math.sin(angle) * orbR * 0.5);

    if (ox >= 1 && ox < 62 && oy >= 1 && oy < 62) {
      // Small eye orb (3x3)
      // Each looks a different direction
      const lookDir = (i + frame) % 4;
      pixels.push(p(ox, oy, pal.OR1)); pixels.push(p(ox + 1, oy, pal.OR2)); pixels.push(p(ox + 2, oy, pal.OR1));
      pixels.push(p(ox, oy + 1, pal.OR2)); pixels.push(p(ox + 2, oy + 1, pal.OR2));
      // Pupil direction
      const pdx = lookDir === 0 ? 0 : lookDir === 1 ? 1 : lookDir === 2 ? 2 : 1;
      pixels.push(p(ox + pdx, oy + 1, pal.PU));
      pixels.push(p(ox, oy + 2, pal.OR1)); pixels.push(p(ox + 1, oy + 2, pal.OR2)); pixels.push(p(ox + 2, oy + 2, pal.OR1));
    }
  }

  // ===== WORKING: SCANNING BEAM =====
  if (state === 'working') {
    // Thin red scanning beam sweeps from the eye
    const beamAngle = (frame / 8) * Math.PI * 2;
    const beamLength = 20;
    for (let b = 0; b < beamLength; b++) {
      const bx = Math.round(31 + Math.cos(beamAngle) * b);
      const by = Math.round(11 + Math.sin(beamAngle) * b * 0.3);
      if (bx >= 0 && bx < 64 && by >= 0 && by < 64) {
        pixels.push(p(bx, by, pal.SB, 1, 1, 0.5 - b * 0.02));
      }
    }
  }

  // ===== GLOW EFFECTS =====
  const glows: React.ReactNode[] = [];

  // THE EYE glow
  if (eyeOpenness > 0) {
    glows.push(<circle key="eg1" cx={31 + pupilDX} cy={11 + pupilDY + yOff} r={6} fill={pal.R3} opacity={0.2} />);
    glows.push(<circle key="eg2" cx={31 + pupilDX} cy={11 + pupilDY + yOff} r={10} fill={pal.R1} opacity={0.08} />);
    if (state === 'working') {
      glows.push(<circle key="eg3" cx={31} cy={11 + yOff} r={14} fill={pal.R3} opacity={0.06} />);
    }
  }

  // Observation orb glows
  for (let i = 0; i < orbCount; i++) {
    const angle = frame * orbSpeed + i * (Math.PI * 2 / orbCount) + Math.PI / 6;
    const ox = 31 + Math.cos(angle) * orbR + 1.5;
    const oy = 24 + Math.sin(angle) * orbR * 0.5 + 1.5;
    if (ox >= 1 && ox < 63 && oy >= 1 && oy < 63) {
      glows.push(<circle key={`og${i}`} cx={ox} cy={oy + yOff} r={2.5} fill={pal.OR3} opacity={0.2} />);
    }
  }

  // Dark aura overlay
  glows.push(<ellipse key="aura" cx={31} cy={30 + yOff} rx={14} ry={22} fill={pal.K1} opacity={0.05} />);

  // Working: beam glow
  if (state === 'working') {
    const beamAngle = (frame / 8) * Math.PI * 2;
    glows.push(<line key="beam" x1={31} y1={11 + yOff} x2={31 + Math.cos(beamAngle) * 20} y2={11 + Math.sin(beamAngle) * 6 + yOff} stroke={pal.SB} strokeWidth={0.5} opacity={0.3} />);
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect width="64" height="64" fill="transparent" />
      {pixels}
      {glows}
    </svg>
  );
};

export default WraithEyeSprite;
