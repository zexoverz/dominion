"use client";

interface PixelProgressProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  segments?: number;
}

export default function PixelProgress({ value, max = 100, color = "#22c55e", height = 16, segments = 10 }: PixelProgressProps) {
  const filled = Math.round((value / max) * segments);
  return (
    <div className="flex gap-[2px] bg-rpg-borderDark/30 p-[2px] border border-rpg-borderDark" style={{ height: height + 4 }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="flex-1 relative"
          style={{
            backgroundColor: i < filled ? color : '#0a0a0f',
            boxShadow: i < filled ? `0 0 4px ${color}44` : 'none',
          }}
        >
          {i < filled && (
            <div className="absolute top-0 left-0 right-0 h-1/2" style={{ background: 'rgba(255,255,255,0.15)' }} />
          )}
        </div>
      ))}
    </div>
  );
}
