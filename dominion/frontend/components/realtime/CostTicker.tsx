"use client";

import { useState, useEffect } from "react";

interface Props {
  className?: string;
  initialCost?: number;
  dailyBudget?: number;
}

export default function CostTicker({ className = "", initialCost = 10.14, dailyBudget = 25 }: Props) {
  const [cost, setCost] = useState(initialCost);
  const [prevDigits, setPrevDigits] = useState<string[]>([]);
  const [animating, setAnimating] = useState<boolean[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCost((c) => {
        const increment = 0.001 + Math.random() * 0.005;
        return Math.round((c + increment) * 1000) / 1000;
      });
    }, 2000 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = cost.toFixed(2);
  const digits = formatted.split("");

  useEffect(() => {
    const newAnimating = digits.map((d, i) => d !== prevDigits[i]);
    setAnimating(newAnimating);
    setPrevDigits(digits);
    const timeout = setTimeout(() => setAnimating(new Array(digits.length).fill(false)), 400);
    return () => clearTimeout(timeout);
  }, [formatted]);

  const ratio = cost / dailyBudget;
  const costColor = ratio < 0.5 ? "#22c55e" : ratio < 0.8 ? "#fbbf24" : "#dc2626";
  const ratePerMin = ((cost / (Date.now() % 86400000)) * 60000).toFixed(4);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-lg">💰</span>
      <div>
        <div className="flex items-baseline">
          <span className="text-[8px] text-gray-500 mr-1">$</span>
          {digits.map((d, i) => (
            <span
              key={i}
              className="text-[12px] inline-block transition-transform duration-300"
              style={{
                color: costColor,
                textShadow: `0 0 6px ${costColor}66`,
                transform: animating[i] ? "translateY(-3px)" : "translateY(0)",
                opacity: animating[i] ? 0.7 : 1,
              }}
            >
              {d}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[7px] text-gray-600">/${dailyBudget} budget</span>
          <span className="text-[6px]" style={{ color: costColor }}>●</span>
        </div>
      </div>
    </div>
  );
}
