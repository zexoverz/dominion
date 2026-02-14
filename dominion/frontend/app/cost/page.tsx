"use client";

import { useState, useEffect } from "react";
import { generals as mockGenerals, costData as mockCostData, dailyBudget, weeklyBudget, monthlyBudget } from "../../lib/mock-data";
import { getGenerals, getCosts } from "../../lib/api";
import { mergeGenerals } from "../../lib/merge-generals";
import PixelProgress from "../../components/PixelProgress";

export default function CostPage() {
  const [generals, setGenerals] = useState(mockGenerals);
  const [costData, setCostData] = useState(mockCostData);

  useEffect(() => {
    getGenerals().then((d) => setGenerals(mergeGenerals(d))).catch(() => {});
    getCosts().then((d) => {
      // API returns {daily, weekly, monthly} object, not array — don't replace mock array
      if (Array.isArray(d)) setCostData(d);
    }).catch(() => {});
  }, []);

  const costToday = generals.reduce((s, g) => s + (g.costToday ?? 0), 0);
  const costWeek = Array.isArray(costData) ? costData.reduce((s, e) => s + (e.amount ?? 0), 0) : 0;
  const costMonth = costWeek;

  const todayByGeneral = generals
    .map((g) => ({ ...g, cost: g.costToday }))
    .filter((g) => g.cost > 0)
    .sort((a, b) => b.cost - a.cost);

  const dailyTotals = costData.reduce((acc, e) => {
    acc[e.date] = (acc[e.date] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  const days = Object.entries(dailyTotals).sort(([a], [b]) => a.localeCompare(b));
  const maxDay = Math.max(...Object.values(dailyTotals));

  return (
    <div className="max-w-full overflow-hidden">
      <div className="rpg-panel mb-6 text-center py-4">
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-2">💰 THE TREASURY 💰</h1>
        <p className="text-[9px] font-body text-rpg-border">Gold spent in service of the Dominion.</p>
      </div>

      {/* Budget HP Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          { label: "DAILY BUDGET", spent: costToday, budget: dailyBudget, icon: "🌅" },
          { label: "WEEKLY BUDGET", spent: costWeek, budget: weeklyBudget, icon: "📅" },
          { label: "MONTHLY BUDGET", spent: costMonth, budget: monthlyBudget, icon: "🏛️" },
        ].map((b) => {
          const pct = (b.spent / b.budget) * 100;
          const color = pct > 80 ? "#dc2626" : pct > 50 ? "#fbbf24" : "#22c55e";
          const statusText = pct > 80 ? "⚠️ DANGER" : pct > 50 ? "⚡ CAUTION" : "✅ SAFE";
          return (
            <div key={b.label} className="rpg-panel p-3 md:p-4">
              <div className="flex justify-between text-[8px] font-pixel text-rpg-borderMid mb-2">
                <span>{b.icon} {b.label}</span>
                <span style={{ color }}>{pct.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-[11px] font-pixel mb-2">
                <span className="text-throne-goldLight">{b.spent.toFixed(2)}g</span>
                <span className="text-rpg-borderMid">/ {b.budget}g</span>
              </div>
              <PixelProgress value={b.spent} max={b.budget} color={color} height={20} segments={20} />
              <p className="text-[8px] font-pixel mt-2" style={{ color }}>{statusText}</p>
            </div>
          );
        })}
      </div>

      {/* Daily chart */}
      <div className="rpg-panel p-3 md:p-4 mb-6 md:mb-8 overflow-x-auto">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📈 DAILY EXPENDITURE</h2>
        <div className="flex items-end gap-1 md:gap-2 h-32 md:h-40 min-w-[300px]">
          {days.map(([date, total]) => {
            const height = (total / maxDay) * 100;
            return (
              <div key={date} className="flex-1 flex flex-col items-center justify-end h-full">
                <p className="text-[7px] font-body text-throne-goldLight mb-1">{total.toFixed(0)}g</p>
                <div
                  className="w-full min-h-[4px]"
                  style={{
                    height: `${height}%`,
                    background: 'linear-gradient(180deg, #fbbf24, #b8860b)',
                    boxShadow: '0 0 8px #fbbf2444',
                  }}
                />
                <p className="text-[6px] font-body text-rpg-borderMid mt-1">{date.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-general breakdown */}
      <div className="rpg-panel p-3 md:p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">👥 GENERAL EXPENDITURE</h2>
        <div className="flex flex-col gap-3">
          {todayByGeneral.map((g) => (
            <div key={g.id} className="flex items-center gap-2 md:gap-3">
              <span className="text-lg flex-shrink-0">{g.emoji}</span>
              <span className="text-[8px] font-pixel w-16 md:w-20 flex-shrink-0 truncate text-rpg-shadow" style={{ color: g.color }}>{g.name}</span>
              <div className="flex-1 min-w-0">
                <PixelProgress value={g.cost} max={dailyBudget / 3} color={g.color} height={12} segments={15} />
              </div>
              <span className="text-[9px] font-pixel text-throne-goldLight w-14 md:w-16 text-right flex-shrink-0">{g.cost.toFixed(2)}g</span>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-rpg-borderMid mt-4 pt-3 flex justify-between">
          <span className="text-[8px] font-pixel text-rpg-borderMid">TOTAL</span>
          <span className="text-[11px] font-pixel text-throne-gold text-rpg-shadow">{costToday.toFixed(2)}g</span>
        </div>
      </div>
    </div>
  );
}
