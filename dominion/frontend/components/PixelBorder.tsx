"use client";

interface PixelBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "thin";
}

export default function PixelBorder({ children, className = "", variant = "default" }: PixelBorderProps) {
  const borderClass = variant === "gold" ? "pixel-border-gold" : variant === "thin" ? "pixel-border-thin" : "pixel-border";
  return (
    <div className={`${borderClass} bg-throne-dark p-4 ${className}`}>
      {children}
    </div>
  );
}
