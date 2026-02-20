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

  const maxGeneralCost = todayByGeneral.length > 0 ? todayByGeneral[0].cost : 1;

  const dailyTotals = costData.reduce((acc, e) => {
    acc[e.date] = (acc[e.date] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  const days = Object.entries(dailyTotals).sort(([a], [b]) => a.localeCompare(b));
  const maxDay = Math.max(...Object.values(dailyTotals), 1);

  // Yesterday's cost for trend
  const sortedDays = [...days];
  const yesterdayCost = sortedDays.length >= 2 ? sortedDays[sortedDays.length - 2][1] : 0;
  const costTrend = costToday - yesterdayCost;
  const trendUp = costTrend > 0;
  const weekEstimate = costToday * 7;

  // Budget thresholds
  const WARNING_THRESHOLD = 5;
  const SLOWDOWN_THRESHOLD = 10;
  const EMERGENCY_THRESHOLD = 15;
  const gaugeMax = EMERGENCY_THRESHOLD;
  const gaugePct = Math.min((costToday / gaugeMax) * 100, 100);
  const gaugeColor = costToday > SLOWDOWN_THRESHOLD ? "#dc2626" : costToday > WARNING_THRESHOLD ? "#fbbf24" : "#22c55e";
  const gaugeLabel = costToday > SLOWDOWN_THRESHOLD ? "🔴 CRITICAL" : costToday > WARNING_THRESHOLD ? "🟡 WARNING" : "🟢 NOMINAL";

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="rpg-panel mb-6 text-center py-4">
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-2">💰 THE TREASURY 💰</h1>
        <p className="text-[9px] font-body text-rpg-border">Gold spent in service of the Dominion.</p>
      </div>

      {/* Treasury Summary Card */}
      <div className="rpg-panel p-4 mb-6">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📜 TREASURY SUMMARY</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 4 }}>
            <p className="text-[7px] font-pixel text-rpg-borderMid mb-1">TODAY&apos;S COST</p>
            <p className="text-[14px] font-pixel text-throne-gold text-glow-gold">{costToday.toFixed(2)}g</p>
          </div>
          <div className="text-center p-3" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 4 }}>
            <p className="text-[7px] font-pixel text-rpg-borderMid mb-1">WEEK ESTIMATE</p>
            <p className="text-[14px] font-pixel text-throne-goldLight">{weekEstimate.toFixed(2)}g</p>
          </div>
          <div className="text-center p-3" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 4 }}>
            <p className="text-[7px] font-pixel text-rpg-borderMid mb-1">BUDGET LEFT</p>
            <p className="text-[14px] font-pixel" style={{ color: gaugeColor }}>{Math.max(0, dailyBudget - costToday).toFixed(2)}g</p>
          </div>
          <div className="text-center p-3" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 4 }}>
            <p className="text-[7px] font-pixel text-rpg-borderMid mb-1">VS YESTERDAY</p>
            <p className="text-[14px] font-pixel" style={{ color: trendUp ? "#dc2626" : "#22c55e" }}>
              {trendUp ? "▲" : "▼"} {Math.abs(costTrend).toFixed(2)}g
            </p>
          </div>
        </div>
      </div>

      {/* Budget Threshold Gauge */}
      <div className="rpg-panel p-4 mb-6">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-3 text-rpg-shadow">⚔️ DAILY SPENDING GAUGE</h2>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[8px] font-pixel text-rpg-borderMid">0g</span>
          <div className="flex-1 relative" style={{ height: 28, background: "#1a1a2e", border: "2px solid #444", borderRadius: 4, overflow: "hidden" }}>
            {/* Filled bar */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${gaugePct}%`,
              background: `linear-gradient(90deg, #22c55e 0%, ${costToday > WARNING_THRESHOLD ? "#fbbf24" : "#22c55e"} ${(WARNING_THRESHOLD / gaugeMax) * 100}%, ${costToday > SLOWDOWN_THRESHOLD ? "#dc2626" : costToday > WARNING_THRESHOLD ? "#fbbf24" : "#22c55e"} 100%)`,
              boxShadow: `0 0 12px ${gaugeColor}66`,
              transition: "width 0.5s ease",
            }} />
            {/* Threshold markers */}
            {[
              { val: WARNING_THRESHOLD, label: "$5", color: "#fbbf24" },
              { val: SLOWDOWN_THRESHOLD, label: "$10", color: "#f97316" },
              { val: EMERGENCY_THRESHOLD, label: "$15", color: "#dc2626" },
            ].map((t) => (
              <div key={t.label} style={{
                position: "absolute", left: `${(t.val / gaugeMax) * 100}%`, top: 0, bottom: 0,
                width: 2, background: t.color, opacity: 0.8,
              }}>
                <span style={{
                  position: "absolute", top: -14, left: -8,
                  fontSize: 7, fontFamily: "var(--font-pixel)", color: t.color,
                }}>{t.label}</span>
              </div>
            ))}
            {/* Pixel segments overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", gap: 1 }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{ flex: 1, borderRight: "1px solid rgba(0,0,0,0.3)" }} />
              ))}
            </div>
          </div>
          <span className="text-[8px] font-pixel text-rpg-borderMid">15g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-pixel" style={{ color: gaugeColor }}>{gaugeLabel}</span>
          <span className="text-[9px] font-pixel text-throne-goldLight">{costToday.toFixed(2)}g / {gaugeMax}g</span>
        </div>
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

      {/* Per-general breakdown — horizontal bar chart */}
      <div className="rpg-panel p-3 md:p-4 mb-6">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">👥 GENERAL EXPENDITURE</h2>
        <div className="flex flex-col gap-3">
          {todayByGeneral.map((g) => (
            <div key={g.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg flex-shrink-0">{g.emoji}</span>
                  <span className="text-[9px] font-pixel truncate" style={{ color: g.color }}>{g.name}</span>
                </div>
                <span className="text-[9px] font-pixel text-throne-goldLight">{g.cost.toFixed(2)}g</span>
              </div>
              {/* CSS horizontal bar */}
              <div style={{ height: 16, background: "#1a1a2e", border: "1px solid #333", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                <div style={{
                  height: "100%",
                  width: `${(g.cost / maxGeneralCost) * 100}%`,
                  background: `linear-gradient(90deg, ${g.color}88, ${g.color})`,
                  boxShadow: `0 0 8px ${g.color}44`,
                  transition: "width 0.4s ease",
                  position: "relative",
                }}>
                  {/* Pixel segment overlay */}
                  <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} style={{ flex: 1, borderRight: "1px solid rgba(0,0,0,0.25)" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-rpg-borderMid mt-4 pt-3 flex justify-between">
          <span className="text-[8px] font-pixel text-rpg-borderMid">TOTAL TODAY</span>
          <span className="text-[11px] font-pixel text-throne-gold text-rpg-shadow">{costToday.toFixed(2)}g</span>
        </div>
      </div>

      {/* Cost per Mission */}
      <div className="rpg-panel p-3 md:p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">🎯 COST EFFICIENCY</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {todayByGeneral.map((g) => {
            const missions = g.totalMissions || 1;
            const costPerMission = g.costToday / missions;
            return (
              <div key={g.id} className="text-center p-2" style={{ background: `${g.color}11`, border: `1px solid ${g.color}33`, borderRadius: 4 }}>
                <span className="text-lg">{g.emoji}</span>
                <p className="text-[8px] font-pixel mt-1" style={{ color: g.color }}>{g.name}</p>
                <p className="text-[11px] font-pixel text-throne-goldLight mt-1">{costPerMission.toFixed(3)}g</p>
                <p className="text-[6px] font-pixel text-rpg-borderMid">per mission</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
