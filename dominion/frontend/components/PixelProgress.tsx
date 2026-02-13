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
    <div className="flex gap-[2px]" style={{ height }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="flex-1"
          style={{
            backgroundColor: i < filled ? color : "#1a1028",
            boxShadow: i < filled ? `0 0 4px ${color}44` : "none",
          }}
        />
      ))}
    </div>
  );
}
