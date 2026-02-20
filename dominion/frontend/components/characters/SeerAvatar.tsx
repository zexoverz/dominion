import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

const SeerAvatar: React.FC<Props> = ({ size = 128, className }) => {
  const p = size / 32;

  const pixels: [number, number, string][] = [
    // Hood top
    [13,3,'#0d9488'],[14,3,'#0d9488'],[15,3,'#0d9488'],[16,3,'#0d9488'],[17,3,'#0d9488'],[18,3,'#0d9488'],
    [12,4,'#0d9488'],[13,4,'#115e59'],[14,4,'#115e59'],[15,4,'#115e59'],[16,4,'#115e59'],[17,4,'#115e59'],[18,4,'#115e59'],[19,4,'#0d9488'],
    [11,5,'#0d9488'],[12,5,'#115e59'],[13,5,'#115e59'],[14,5,'#115e59'],[15,5,'#115e59'],[16,5,'#115e59'],[17,5,'#115e59'],[18,5,'#115e59'],[19,5,'#115e59'],[20,5,'#0d9488'],

    // Third eye on forehead
    [15,5,'#06b6d4'],[16,5,'#06b6d4'],

    // Face in hood shadow
    [11,6,'#0d9488'],[12,6,'#1e3a5f'],[13,6,'#1e3a5f'],[14,6,'#1e3a5f'],[15,6,'#1e3a5f'],[16,6,'#1e3a5f'],[17,6,'#1e3a5f'],[18,6,'#1e3a5f'],[19,6,'#1e3a5f'],[20,6,'#0d9488'],
    // Eyes
    [11,7,'#0d9488'],[12,7,'#1e3a5f'],[13,7,'#06b6d4'],[14,7,'#1e3a5f'],[15,7,'#1e3a5f'],[16,7,'#1e3a5f'],[17,7,'#06b6d4'],[18,7,'#1e3a5f'],[19,7,'#1e3a5f'],[20,7,'#0d9488'],
    [11,8,'#0d9488'],[12,8,'#1e3a5f'],[13,8,'#1e3a5f'],[14,8,'#1e3a5f'],[15,8,'#1e3a5f'],[16,8,'#1e3a5f'],[17,8,'#1e3a5f'],[18,8,'#1e3a5f'],[19,8,'#1e3a5f'],[20,8,'#0d9488'],
    // Mouth area
    [12,9,'#0d9488'],[13,9,'#1e3a5f'],[14,9,'#1e3a5f'],[15,9,'#134e6f'],[16,9,'#134e6f'],[17,9,'#1e3a5f'],[18,9,'#1e3a5f'],[19,9,'#0d9488'],

    // Hood sides / cloak
    [10,6,'#0d9488'],[21,6,'#0d9488'],
    [10,7,'#0d9488'],[21,7,'#0d9488'],
    [10,8,'#0d9488'],[21,8,'#0d9488'],

    // Neck
    [14,10,'#1e3a5f'],[15,10,'#1e3a5f'],[16,10,'#1e3a5f'],[17,10,'#1e3a5f'],

    // Shoulders & cloak
    [8,11,'#0d9488'],[9,11,'#0d9488'],[10,11,'#0d9488'],[11,11,'#0d9488'],[12,11,'#0d9488'],[13,11,'#0d9488'],[14,11,'#0d9488'],[15,11,'#0d9488'],[16,11,'#0d9488'],[17,11,'#0d9488'],[18,11,'#0d9488'],[19,11,'#0d9488'],[20,11,'#0d9488'],[21,11,'#0d9488'],[22,11,'#0d9488'],[23,11,'#0d9488'],

    // Torso / cloak body
    ...[12,13,14,15,16,17,18,19,20].flatMap(y =>
      Array.from({length: 16}, (_, i) => [7 + i, y, y % 2 === 0 ? '#0d9488' : '#115e59'] as [number, number, string])
    ),

    // Crystal ball in hands
    [13,16,'#06b6d4'],[14,16,'#67e8f9'],[15,16,'#67e8f9'],[16,16,'#67e8f9'],[17,16,'#06b6d4'],
    [12,17,'#06b6d4'],[13,17,'#67e8f9'],[14,17,'#a5f3fc'],[15,17,'#cffafe'],[16,17,'#67e8f9'],[17,17,'#67e8f9'],[18,17,'#06b6d4'],
    [12,18,'#06b6d4'],[13,18,'#67e8f9'],[14,18,'#67e8f9'],[15,18,'#a5f3fc'],[16,18,'#67e8f9'],[17,18,'#67e8f9'],[18,18,'#06b6d4'],
    [13,19,'#06b6d4'],[14,19,'#67e8f9'],[15,19,'#67e8f9'],[16,19,'#67e8f9'],[17,19,'#06b6d4'],

    // Hands around crystal ball
    [11,16,'#1e3a5f'],[11,17,'#1e3a5f'],[11,18,'#1e3a5f'],
    [19,16,'#1e3a5f'],[19,17,'#1e3a5f'],[19,18,'#1e3a5f'],

    // Lower cloak flowing
    ...[21,22,23,24].flatMap(y =>
      Array.from({length: Math.min(20, 8 + (y-20)*2)}, (_, i) => {
        const x = 16 - Math.floor((8 + (y-20)*2)/2) + i;
        return [x, y, y % 2 === 0 ? '#0d9488' : '#115e59'] as [number, number, string];
      })
    ),

    // Ethereal wisps at bottom
    [8,25,'#06b6d4'],[10,26,'#06b6d4'],[21,25,'#06b6d4'],[23,26,'#06b6d4'],
    [7,26,'#0891b2'],[22,26,'#0891b2'],
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      <defs>
        <filter id="seer-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Float animation */}
      <g>
        <animateTransform attributeName="transform" type="translate" values={`0,0;0,${-p*1.5};0,0`} dur="4s" repeatCount="indefinite" />
        {pixels.map(([x, y, color], i) => (
          <rect key={i} x={x * p} y={y * p} width={p} height={p} fill={color} />
        ))}
        {/* Crystal ball glow */}
        <circle cx={15.5 * p} cy={17.5 * p} r={3.5 * p} fill="#06b6d4" opacity="0.2" filter="url(#seer-glow)">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Third eye glow */}
        <rect x={15 * p} y={5 * p} width={2 * p} height={p} fill="#06b6d4" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
        </rect>
        {/* Eye glow */}
        <rect x={13 * p} y={7 * p} width={p} height={p} fill="#06b6d4">
          <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x={17 * p} y={7 * p} width={p} height={p} fill="#06b6d4">
          <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
};

export default SeerAvatar;
