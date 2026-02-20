import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

const EchoAvatar: React.FC<Props> = ({ size = 128, className }) => {
  const p = size / 32;

  const pixels: [number, number, string][] = [
    // Central face - primary
    [14,8,'#ec4899'],[15,8,'#ec4899'],[16,8,'#ec4899'],[17,8,'#ec4899'],
    [13,9,'#ec4899'],[14,9,'#d946ef'],[15,9,'#d946ef'],[16,9,'#d946ef'],[17,9,'#d946ef'],[18,9,'#ec4899'],
    [13,10,'#d946ef'],[14,10,'#8b5cf6'],[15,10,'#d946ef'],[16,10,'#d946ef'],[17,10,'#8b5cf6'],[18,10,'#d946ef'],
    [13,11,'#d946ef'],[14,11,'#d946ef'],[15,11,'#d946ef'],[16,11,'#d946ef'],[17,11,'#d946ef'],[18,11,'#d946ef'],
    [13,12,'#d946ef'],[14,12,'#d946ef'],[15,12,'#ec4899'],[16,12,'#ec4899'],[17,12,'#d946ef'],[18,12,'#d946ef'],
    [14,13,'#d946ef'],[15,13,'#d946ef'],[16,13,'#d946ef'],[17,13,'#d946ef'],

    // Ghost face left (offset, translucent feel)
    [9,7,'#ec4899'],[10,7,'#ec4899'],[11,7,'#ec4899'],
    [8,8,'#ec4899'],[9,8,'#be185d'],[10,8,'#be185d'],[11,8,'#be185d'],[12,8,'#ec4899'],
    [8,9,'#be185d'],[9,9,'#8b5cf6'],[10,9,'#be185d'],[11,9,'#8b5cf6'],[12,9,'#be185d'],
    [8,10,'#be185d'],[9,10,'#be185d'],[10,10,'#be185d'],[11,10,'#be185d'],[12,10,'#be185d'],
    [9,11,'#be185d'],[10,11,'#ec4899'],[11,11,'#be185d'],

    // Ghost face right
    [20,7,'#ec4899'],[21,7,'#ec4899'],[22,7,'#ec4899'],
    [19,8,'#ec4899'],[20,8,'#be185d'],[21,8,'#be185d'],[22,8,'#be185d'],[23,8,'#ec4899'],
    [19,9,'#be185d'],[20,9,'#8b5cf6'],[21,9,'#be185d'],[22,9,'#8b5cf6'],[23,9,'#be185d'],
    [19,10,'#be185d'],[20,10,'#be185d'],[21,10,'#be185d'],[22,10,'#be185d'],[23,10,'#be185d'],
    [20,11,'#be185d'],[21,11,'#ec4899'],[22,11,'#be185d'],

    // Sound wave rings - left side
    [4,10,'#8b5cf6'],[4,11,'#8b5cf6'],[4,12,'#8b5cf6'],[4,13,'#8b5cf6'],
    [5,9,'#8b5cf6'],[5,14,'#8b5cf6'],
    [6,8,'#d946ef'],[6,15,'#d946ef'],
    [3,11,'#8b5cf6'],[3,12,'#8b5cf6'],

    // Sound wave rings - right side
    [27,10,'#8b5cf6'],[27,11,'#8b5cf6'],[27,12,'#8b5cf6'],[27,13,'#8b5cf6'],
    [26,9,'#8b5cf6'],[26,14,'#8b5cf6'],
    [25,8,'#d946ef'],[25,15,'#d946ef'],
    [28,11,'#8b5cf6'],[28,12,'#8b5cf6'],

    // Body - flowing sound wave form
    [14,14,'#ec4899'],[15,14,'#d946ef'],[16,14,'#d946ef'],[17,14,'#ec4899'],
    [13,15,'#ec4899'],[14,15,'#d946ef'],[15,15,'#ec4899'],[16,15,'#ec4899'],[17,15,'#d946ef'],[18,15,'#ec4899'],
    [12,16,'#d946ef'],[13,16,'#ec4899'],[14,16,'#d946ef'],[15,16,'#d946ef'],[16,16,'#d946ef'],[17,16,'#d946ef'],[18,16,'#ec4899'],[19,16,'#d946ef'],
    [11,17,'#8b5cf6'],[12,17,'#d946ef'],[13,17,'#ec4899'],[14,17,'#d946ef'],[15,17,'#ec4899'],[16,17,'#ec4899'],[17,17,'#d946ef'],[18,17,'#ec4899'],[19,17,'#d946ef'],[20,17,'#8b5cf6'],
    [10,18,'#8b5cf6'],[11,18,'#d946ef'],[12,18,'#ec4899'],[13,18,'#d946ef'],[14,18,'#ec4899'],[15,18,'#d946ef'],[16,18,'#d946ef'],[17,18,'#ec4899'],[18,18,'#d946ef'],[19,18,'#ec4899'],[20,18,'#d946ef'],[21,18,'#8b5cf6'],

    // Wave dissipation downward
    [11,19,'#8b5cf6'],[13,19,'#d946ef'],[15,19,'#ec4899'],[16,19,'#ec4899'],[18,19,'#d946ef'],[20,19,'#8b5cf6'],
    [10,20,'#8b5cf6'],[12,20,'#d946ef'],[14,20,'#ec4899'],[17,20,'#ec4899'],[19,20,'#d946ef'],[21,20,'#8b5cf6'],
    [11,21,'#8b5cf6'],[13,21,'#d946ef'],[15,21,'#ec4899'],[16,21,'#ec4899'],[18,21,'#d946ef'],[20,21,'#8b5cf6'],
    [12,22,'#8b5cf6'],[14,22,'#d946ef'],[17,22,'#d946ef'],[19,22,'#8b5cf6'],
    [13,23,'#8b5cf6'],[15,23,'#d946ef'],[16,23,'#d946ef'],[18,23,'#8b5cf6'],
    [14,24,'#8b5cf6'],[17,24,'#8b5cf6'],

    // Musical notes floating
    [5,4,'#ec4899'],[6,3,'#ec4899'],[6,4,'#ec4899'],
    [26,5,'#d946ef'],[27,4,'#d946ef'],[27,5,'#d946ef'],
    [3,18,'#8b5cf6'],[4,17,'#8b5cf6'],
    [28,17,'#8b5cf6'],[29,16,'#8b5cf6'],
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
        <filter id="echo-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Pulse animation for the whole figure */}
      <g filter="url(#echo-glow)">
        {pixels.map(([x, y, color], i) => (
          <rect key={i} x={x * p} y={y * p} width={p} height={p} fill={color} />
        ))}
      </g>
      {/* Sound wave pulse rings */}
      {[0, 1, 2].map(i => (
        <circle key={`wave-${i}`} cx={16 * p} cy={12 * p} r={8 * p} fill="none" stroke="#8b5cf6" strokeWidth={p * 0.3} opacity="0">
          <animate attributeName="r" values={`${8*p};${14*p}`} dur="2s" begin={`${i * 0.66}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0" dur="2s" begin={`${i * 0.66}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Ghost face opacity pulse */}
      {/* Left face */}
      <g opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" repeatCount="indefinite" />
        {[[9,7],[10,7],[11,7],[8,8],[12,8],[8,9],[12,9],[8,10],[12,10],[9,11],[11,11]].map(([x,y], i) => (
          <rect key={`lf-${i}`} x={x*p} y={y*p} width={p} height={p} fill="#ec4899" opacity="0.3" />
        ))}
      </g>
      {/* Right face */}
      <g opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" begin="1.5s" repeatCount="indefinite" />
        {[[20,7],[21,7],[22,7],[19,8],[23,8],[19,9],[23,9],[19,10],[23,10],[20,11],[22,11]].map(([x,y], i) => (
          <rect key={`rf-${i}`} x={x*p} y={y*p} width={p} height={p} fill="#ec4899" opacity="0.3" />
        ))}
      </g>
    </svg>
  );
};

export default EchoAvatar;
