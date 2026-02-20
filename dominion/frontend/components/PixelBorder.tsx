"use client";

interface PixelBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "thin";
}

export default function PixelBorder({ children, className = "", variant = "default" }: PixelBorderProps) {
  return (
    <div className={`rpg-panel ${className}`}>
      {children}
    </div>
  );
}
