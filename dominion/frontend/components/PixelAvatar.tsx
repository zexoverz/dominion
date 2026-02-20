// 32x32 pixel art avatars for each general, rendered as inline SVGs
// Each avatar is a 8x8 grid scaled up (each cell = 4px)

const AVATARS: Record<string, { pixels: string[]; palette: Record<string, string> }> = {
  throne: {
    palette: { a: '#c8a832', b: '#9a7e1e', c: '#ffe066', d: '#5a3e1b', e: '#f4e8c1', f: '#c03030', g: '#fff' },
    pixels: [
      '..aca..',
      '.ccccc.',
      '..eee..',
      '.deded.',
      '.daaad.',
      '.daaad.',
      '..ddd..',
      '..d.d..',
    ],
  },
  grimoire: {
    palette: { a: '#8b5cf6', b: '#6d28d9', c: '#c4b5fd', d: '#f4e8c1', e: '#5a3e1b', f: '#ffe066', g: '#3b82f6' },
    pixels: [
      '..fff..',
      '..ddd..',
      '.addda.',
      '.aadaa.',
      '.aaaaa.',
      '.aeeea.',
      '..aaa..',
      '..a.a..',
    ],
  },
  echo: {
    palette: { a: '#3465a4', b: '#1e40af', c: '#93c5fd', d: '#f4e8c1', e: '#5a3e1b', f: '#c8a832', g: '#fff' },
    pixels: [
      '..ddd..',
      '.ddddf.',
      '.addff.',
      '.aadaa.',
      '.aaaaa.',
      '.acaca.',
      '..aaa..',
      '..a.a..',
    ],
  },
  seer: {
    palette: { a: '#06b6d4', b: '#0891b2', c: '#67e8f9', d: '#f4e8c1', e: '#5a3e1b', f: '#c4b5fd', g: '#fff' },
    pixels: [
      '.aaaaa.',
      '.addda.',
      '..ddd..',
      '.aadaa.',
      '.aaaaa.',
      '.afcfa.',
      '..ccc..',
      '..a.a..',
    ],
  },
  phantom: {
    palette: { a: '#374151', b: '#111827', c: '#6b7280', d: '#f4e8c1', e: '#c03030', f: '#1f2937', g: '#9ca3af' },
    pixels: [
      '.bbbbb.',
      '.bbbbb.',
      '.bdddb.',
      '.bedeb.',
      '.bbbbb.',
      '.bfbfb.',
      '..bbb..',
      '.b...b.',
    ],
  },
  mammon: {
    palette: { a: '#92400e', b: '#78350f', c: '#d97706', d: '#f4e8c1', e: '#5a3e1b', f: '#c8a832', g: '#ffe066' },
    pixels: [
      '..ddd..',
      '.ddddf.',
      '.addgf.',
      '.aadaa.',
      '.aaaaa.',
      '.afafa.',
      '..aaa..',
      '..a.a..',
    ],
  },
  'wraith-eye': {
    palette: { a: '#1f2937', b: '#111827', c: '#374151', d: '#f4e8c1', e: '#c03030', f: '#ef4444', g: '#6b7280' },
    pixels: [
      '.bbbbb.',
      '.bbbbb.',
      '.bcdcb.',
      '.bdedb.',
      '.bcfcb.',
      '.bbbbb.',
      '..bbb..',
      '.b...b.',
    ],
  },
};

export default function PixelAvatar({ generalId, size = 'sm' }: { generalId: string; size?: 'sm' | 'lg' }) {
  const key = generalId.toLowerCase().replace(/[^a-z-]/g, '');
  const avatar = AVATARS[key];
  const cellSize = size === 'lg' ? 8 : 4;
  const gridW = 7;
  const gridH = 8;
  const w = gridW * cellSize;
  const h = gridH * cellSize;

  if (!avatar) {
    // Fallback: simple sword icon
    return (
      <svg width={w} height={h} viewBox={`0 0 ${gridW} ${gridH}`} style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="0" width="1" height="5" fill="#8b6914" />
        <rect x="2" y="5" width="3" height="1" fill="#8b6914" />
        <rect x="3" y="6" width="1" height="2" fill="#5a3e1b" />
      </svg>
    );
  }

  const rects: JSX.Element[] = [];
  avatar.pixels.forEach((row, y) => {
    row.split('').forEach((ch, x) => {
      if (ch !== '.') {
        const color = avatar.palette[ch] || '#000';
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />);
      }
    });
  });

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${gridW} ${gridH}`}
      style={{ imageRendering: 'pixelated' }}
      className={size === 'lg' ? 'pixel-avatar lg' : 'pixel-avatar'}
    >
      {rects}
    </svg>
  );
}
