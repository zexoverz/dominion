import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

const GrimoireAvatar: React.FC<Props> = ({ size = 128, className }) => {
  const p = size / 32;

  const pixels: [number, number, string][] = [
    // Floating pages above (top-left)
    [6,2,'#fef3c7'],[7,2,'#fef3c7'],[8,2,'#fef3c7'],
    [6,3,'#fef3c7'],[7,3,'#f59e0b'],[8,3,'#fef3c7'],
    [6,4,'#fef3c7'],[7,4,'#fef3c7'],[8,4,'#fef3c7'],

    // Floating pages (top-right)
    [23,3,'#fef3c7'],[24,3,'#fef3c7'],[25,3,'#fef3c7'],
    [23,4,'#fef3c7'],[24,4,'#f59e0b'],[25,4,'#fef3c7'],
    [23,5,'#fef3c7'],[24,5,'#fef3c7'],[25,5,'#fef3c7'],

    // Book spine (left edge)
    [8,7,'#92400e'],[8,8,'#92400e'],[8,9,'#92400e'],[8,10,'#92400e'],[8,11,'#92400e'],[8,12,'#92400e'],[8,13,'#92400e'],[8,14,'#92400e'],[8,15,'#92400e'],[8,16,'#92400e'],[8,17,'#92400e'],[8,18,'#92400e'],[8,19,'#92400e'],[8,20,'#92400e'],[8,21,'#92400e'],[8,22,'#92400e'],

    // Book cover top
    [9,7,'#92400e'],[10,7,'#92400e'],[11,7,'#92400e'],[12,7,'#92400e'],[13,7,'#92400e'],[14,7,'#92400e'],[15,7,'#92400e'],[16,7,'#92400e'],[17,7,'#92400e'],[18,7,'#92400e'],[19,7,'#92400e'],[20,7,'#92400e'],[21,7,'#92400e'],[22,7,'#92400e'],[23,7,'#92400e'],
    // Book cover bottom
    [9,22,'#92400e'],[10,22,'#92400e'],[11,22,'#92400e'],[12,22,'#92400e'],[13,22,'#92400e'],[14,22,'#92400e'],[15,22,'#92400e'],[16,22,'#92400e'],[17,22,'#92400e'],[18,22,'#92400e'],[19,22,'#92400e'],[20,22,'#92400e'],[21,22,'#92400e'],[22,22,'#92400e'],[23,22,'#92400e'],
    // Book cover right
    [23,8,'#92400e'],[23,9,'#92400e'],[23,10,'#92400e'],[23,11,'#92400e'],[23,12,'#92400e'],[23,13,'#92400e'],[23,14,'#92400e'],[23,15,'#92400e'],[23,16,'#92400e'],[23,17,'#92400e'],[23,18,'#92400e'],[23,19,'#92400e'],[23,20,'#92400e'],[23,21,'#92400e'],

    // Book cover fill (parchment/leather)
    ...[8,9,10,11,12,13,14,15,16,17,18,19,20,21].flatMap(y =>
      Array.from({length: 14}, (_, i) => [9 + i, y, '#7c2d12'] as [number, number, string])
    ),

    // Gold corner decorations
    [9,8,'#f59e0b'],[10,8,'#f59e0b'],[9,9,'#f59e0b'],
    [21,8,'#f59e0b'],[22,8,'#f59e0b'],[22,9,'#f59e0b'],
    [9,20,'#f59e0b'],[9,21,'#f59e0b'],[10,21,'#f59e0b'],
    [22,20,'#f59e0b'],[21,21,'#f59e0b'],[22,21,'#f59e0b'],

    // Central eye on cover (the book is alive!)
    [14,12,'#f59e0b'],[15,12,'#f59e0b'],[16,12,'#f59e0b'],[17,12,'#f59e0b'],
    [13,13,'#f59e0b'],[14,13,'#fef3c7'],[15,13,'#fef3c7'],[16,13,'#fef3c7'],[17,13,'#fef3c7'],[18,13,'#f59e0b'],
    [12,14,'#f59e0b'],[13,14,'#fef3c7'],[14,14,'#fef3c7'],[15,14,'#92400e'],[16,14,'#92400e'],[17,14,'#fef3c7'],[18,14,'#fef3c7'],[19,14,'#f59e0b'],
    [12,15,'#f59e0b'],[13,15,'#fef3c7'],[14,15,'#fef3c7'],[15,15,'#0a0a0a'],[16,15,'#0a0a0a'],[17,15,'#fef3c7'],[18,15,'#fef3c7'],[19,15,'#f59e0b'],
    [12,16,'#f59e0b'],[13,16,'#fef3c7'],[14,16,'#fef3c7'],[15,16,'#92400e'],[16,16,'#92400e'],[17,16,'#fef3c7'],[18,16,'#fef3c7'],[19,16,'#f59e0b'],
    [13,17,'#f59e0b'],[14,17,'#fef3c7'],[15,17,'#fef3c7'],[16,17,'#fef3c7'],[17,17,'#fef3c7'],[18,17,'#f59e0b'],
    [14,18,'#f59e0b'],[15,18,'#f59e0b'],[16,18,'#f59e0b'],[17,18,'#f59e0b'],

    // Rune symbols on cover
    [10,11,'#f59e0b'],[11,11,'#f59e0b'],[10,12,'#f59e0b'],
    [20,11,'#f59e0b'],[21,11,'#f59e0b'],[21,12,'#f59e0b'],
    [10,18,'#f59e0b'],[11,18,'#f59e0b'],[11,19,'#f59e0b'],
    [20,18,'#f59e0b'],[21,18,'#f59e0b'],[20,19,'#f59e0b'],

    // Floating rune particles
    [5,10,'#f59e0b'],[4,11,'#f59e0b'],
    [26,9,'#f59e0b'],[27,10,'#f59e0b'],
    [3,16,'#f59e0b'],[28,15,'#f59e0b'],
    [6,24,'#f59e0b'],[25,24,'#f59e0b'],
    [4,7,'#f59e0b'],[27,20,'#f59e0b'],

    // Pages sticking out (bottom)
    [9,23,'#fef3c7'],[10,23,'#fef3c7'],[11,23,'#fef3c7'],[12,23,'#fef3c7'],[13,23,'#fef3c7'],[14,23,'#fef3c7'],[15,23,'#fef3c7'],[16,23,'#fef3c7'],[17,23,'#fef3c7'],[18,23,'#fef3c7'],[19,23,'#fef3c7'],[20,23,'#fef3c7'],[21,23,'#fef3c7'],[22,23,'#fef3c7'],
    // Page edges
    [9,24,'#fef3c7'],[10,24,'#e8d5a3'],[11,24,'#fef3c7'],[12,24,'#e8d5a3'],[13,24,'#fef3c7'],[14,24,'#e8d5a3'],[15,24,'#fef3c7'],[16,24,'#e8d5a3'],[17,24,'#fef3c7'],[18,24,'#e8d5a3'],[19,24,'#fef3c7'],[20,24,'#e8d5a3'],[21,24,'#fef3c7'],[22,24,'#e8d5a3'],
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
        <filter id="grimoire-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Float animation for whole book */}
      <g>
        <animateTransform attributeName="transform" type="translate" values={`0,0;0,${-p*2};0,0`} dur="3.5s" repeatCount="indefinite" />
        {pixels.map(([x, y, color], i) => (
          <rect key={i} x={x * p} y={y * p} width={p} height={p} fill={color} />
        ))}
        {/* Eye pupil glow */}
        <rect x={15 * p} y={15 * p} width={2*p} height={p} fill="#f59e0b" filter="url(#grimoire-glow)">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
        </rect>
        {/* Floating rune particles with individual animations */}
        {[[5,10],[26,9],[3,16],[28,15],[4,7],[27,20],[6,24],[25,24]].map(([rx, ry], i) => (
          <rect key={`rune-${i}`} x={rx * p} y={ry * p} width={p} height={p} fill="#f59e0b" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
    </svg>
  );
};

export default GrimoireAvatar;
