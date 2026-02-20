import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

const MammonAvatar: React.FC<Props> = ({ size = 128, className }) => {
  const p = size / 32;

  const pixels: [number, number, string][] = [
    // Dragon head - top
    [14,2,'#991b1b'],[15,2,'#991b1b'],[16,2,'#991b1b'],
    [12,3,'#991b1b'],[13,3,'#eab308'],[14,3,'#eab308'],[15,3,'#991b1b'],[16,3,'#eab308'],[17,3,'#eab308'],[19,3,'#991b1b'],
    // Horns
    [10,1,'#cd7f32'],[11,2,'#cd7f32'],[12,2,'#cd7f32'],
    [20,1,'#cd7f32'],[19,2,'#cd7f32'],[18,2,'#cd7f32'],

    // Dragon head
    [11,4,'#991b1b'],[12,4,'#eab308'],[13,4,'#eab308'],[14,4,'#eab308'],[15,4,'#eab308'],[16,4,'#eab308'],[17,4,'#eab308'],[18,4,'#eab308'],[19,4,'#991b1b'],
    // Eyes
    [11,5,'#eab308'],[12,5,'#eab308'],[13,5,'#ef4444'],[14,5,'#eab308'],[15,5,'#eab308'],[16,5,'#eab308'],[17,5,'#ef4444'],[18,5,'#eab308'],[19,5,'#eab308'],
    // Snout
    [11,6,'#eab308'],[12,6,'#cd7f32'],[13,6,'#eab308'],[14,6,'#eab308'],[15,6,'#eab308'],[16,6,'#eab308'],[17,6,'#eab308'],[18,6,'#cd7f32'],[19,6,'#eab308'],
    [12,7,'#eab308'],[13,7,'#991b1b'],[14,7,'#eab308'],[15,7,'#eab308'],[16,7,'#eab308'],[17,7,'#991b1b'],[18,7,'#eab308'],
    // Teeth
    [13,8,'#fef3c7'],[14,8,'#991b1b'],[15,8,'#991b1b'],[16,8,'#991b1b'],[17,8,'#fef3c7'],

    // Neck
    [13,9,'#eab308'],[14,9,'#cd7f32'],[15,9,'#eab308'],[16,9,'#cd7f32'],[17,9,'#eab308'],

    // Body coiling - scales made of coin-like circles
    [11,10,'#eab308'],[12,10,'#cd7f32'],[13,10,'#eab308'],[14,10,'#cd7f32'],[15,10,'#eab308'],[16,10,'#cd7f32'],[17,10,'#eab308'],[18,10,'#cd7f32'],[19,10,'#eab308'],
    [10,11,'#cd7f32'],[11,11,'#eab308'],[12,11,'#eab308'],[13,11,'#cd7f32'],[14,11,'#eab308'],[15,11,'#cd7f32'],[16,11,'#eab308'],[17,11,'#cd7f32'],[18,11,'#eab308'],[19,11,'#eab308'],[20,11,'#cd7f32'],
    [9,12,'#eab308'],[10,12,'#eab308'],[11,12,'#cd7f32'],[12,12,'#eab308'],[13,12,'#eab308'],[14,12,'#cd7f32'],[15,12,'#eab308'],[16,12,'#eab308'],[17,12,'#eab308'],[18,12,'#cd7f32'],[19,12,'#eab308'],[20,12,'#eab308'],[21,12,'#eab308'],

    // Coil going right
    [20,13,'#cd7f32'],[21,13,'#eab308'],[22,13,'#cd7f32'],[23,13,'#eab308'],
    [21,14,'#eab308'],[22,14,'#cd7f32'],[23,14,'#eab308'],[24,14,'#cd7f32'],
    [22,15,'#cd7f32'],[23,15,'#eab308'],[24,15,'#eab308'],

    // Coil going back left
    [8,13,'#eab308'],[9,13,'#cd7f32'],[10,13,'#eab308'],
    [7,14,'#cd7f32'],[8,14,'#eab308'],[9,14,'#cd7f32'],
    [7,15,'#eab308'],[8,15,'#cd7f32'],[9,15,'#eab308'],

    // Lower body
    [9,16,'#cd7f32'],[10,16,'#eab308'],[11,16,'#cd7f32'],[12,16,'#eab308'],[13,16,'#cd7f32'],[14,16,'#eab308'],[15,16,'#cd7f32'],[16,16,'#eab308'],[17,16,'#cd7f32'],[18,16,'#eab308'],[19,16,'#cd7f32'],[20,16,'#eab308'],[21,16,'#cd7f32'],[22,16,'#eab308'],
    [10,17,'#eab308'],[11,17,'#cd7f32'],[12,17,'#eab308'],[13,17,'#cd7f32'],[14,17,'#eab308'],[15,17,'#cd7f32'],[16,17,'#eab308'],[17,17,'#cd7f32'],[18,17,'#eab308'],[19,17,'#cd7f32'],[20,17,'#eab308'],[21,17,'#cd7f32'],

    // Tail curling
    [20,18,'#eab308'],[21,18,'#cd7f32'],[22,18,'#eab308'],
    [22,19,'#cd7f32'],[23,19,'#eab308'],[24,19,'#cd7f32'],
    [24,20,'#eab308'],[25,20,'#cd7f32'],
    [25,21,'#eab308'],[26,21,'#991b1b'],

    // Gold coins / treasure hoard
    [8,19,'#eab308'],[9,19,'#fbbf24'],[10,19,'#eab308'],[11,19,'#fbbf24'],[12,19,'#eab308'],[13,19,'#fbbf24'],[14,19,'#eab308'],[15,19,'#fbbf24'],[16,19,'#eab308'],[17,19,'#fbbf24'],[18,19,'#eab308'],[19,19,'#fbbf24'],
    [7,20,'#fbbf24'],[8,20,'#eab308'],[9,20,'#fbbf24'],[10,20,'#eab308'],[11,20,'#fbbf24'],[12,20,'#eab308'],[13,20,'#fbbf24'],[14,20,'#eab308'],[15,20,'#fbbf24'],[16,20,'#eab308'],[17,20,'#fbbf24'],[18,20,'#eab308'],[19,20,'#fbbf24'],[20,20,'#eab308'],
    [6,21,'#eab308'],[7,21,'#fbbf24'],[8,21,'#eab308'],[9,21,'#fbbf24'],[10,21,'#eab308'],[11,21,'#fbbf24'],[12,21,'#eab308'],[13,21,'#fbbf24'],[14,21,'#eab308'],[15,21,'#fbbf24'],[16,21,'#eab308'],[17,21,'#fbbf24'],[18,21,'#eab308'],[19,21,'#fbbf24'],[20,21,'#eab308'],[21,21,'#fbbf24'],
    [5,22,'#fbbf24'],[6,22,'#eab308'],[7,22,'#fbbf24'],[8,22,'#eab308'],[9,22,'#fbbf24'],[10,22,'#eab308'],[11,22,'#fbbf24'],[12,22,'#eab308'],[13,22,'#fbbf24'],[14,22,'#eab308'],[15,22,'#fbbf24'],[16,22,'#eab308'],[17,22,'#fbbf24'],[18,22,'#eab308'],[19,22,'#fbbf24'],[20,22,'#eab308'],[21,22,'#fbbf24'],[22,22,'#eab308'],
    [5,23,'#cd7f32'],[6,23,'#fbbf24'],[7,23,'#cd7f32'],[8,23,'#fbbf24'],[9,23,'#cd7f32'],[10,23,'#fbbf24'],[11,23,'#cd7f32'],[12,23,'#fbbf24'],[13,23,'#cd7f32'],[14,23,'#fbbf24'],[15,23,'#cd7f32'],[16,23,'#fbbf24'],[17,23,'#cd7f32'],[18,23,'#fbbf24'],[19,23,'#cd7f32'],[20,23,'#fbbf24'],[21,23,'#cd7f32'],[22,23,'#fbbf24'],

    // Wings hint
    [6,10,'#991b1b'],[5,9,'#991b1b'],[4,8,'#991b1b'],[3,7,'#991b1b'],
    [24,10,'#991b1b'],[25,9,'#991b1b'],[26,8,'#991b1b'],[27,7,'#991b1b'],
    [5,10,'#991b1b'],[6,11,'#991b1b'],
    [25,10,'#991b1b'],[24,11,'#991b1b'],
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
        <filter id="mammon-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {pixels.map(([x, y, color], i) => (
        <rect key={i} x={x * p} y={y * p} width={p} height={p} fill={color} />
      ))}
      {/* Dragon eye glow */}
      {[[13,5],[17,5]].map(([ex,ey], i) => (
        <rect key={`eye-${i}`} x={ex*p} y={ey*p} width={p} height={p} fill="#ef4444" filter="url(#mammon-glow)">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </rect>
      ))}
      {/* Gold shimmer on coins */}
      <rect x={10*p} y={20*p} width={p} height={p} fill="#fef08a" opacity="0">
        <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" repeatCount="indefinite" />
      </rect>
      <rect x={15*p} y={21*p} width={p} height={p} fill="#fef08a" opacity="0">
        <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
      </rect>
      <rect x={8*p} y={22*p} width={p} height={p} fill="#fef08a" opacity="0">
        <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" begin="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
};

export default MammonAvatar;
