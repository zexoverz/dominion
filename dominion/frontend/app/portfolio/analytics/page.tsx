"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import PixelBorder from "../../../components/PixelBorder";
import PixelProgress from "../../../components/PixelProgress";
import { getPortfolioAnalytics } from "../../../lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend, ComposedChart, Line,
} from "recharts";

const IDR_PER_USD = 16800;

function fmtUsd(n: number) {
  if (n >= 1_000_000_000) return "$" + (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function fmtIdr(n: number) {
  if (n >= 1_000_000_000_000) return "Rp " + (n / 1_000_000_000_000).toFixed(1) + "T";
  if (n >= 1_000_000_000) return "Rp " + (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + "M";
  return "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}
function fmtBtc(n: number) { return n.toFixed(4) + " ₿"; }
function fmtSats(n: number) { return Math.round(n * 100_000_000).toLocaleString() + " sats"; }
function monthLabel(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { year: "2-digit", month: "short" });
}

const NAV_ITEMS = [
  { href: "/portfolio", label: "📊 OVERVIEW" },
  { href: "/portfolio/collectibles", label: "🃏 COLLECTIBLES" },
  { href: "/portfolio/analytics", label: "📈 ANALYTICS", active: true },
  { href: "/portfolio/masterplan", label: "📜 MASTERPLAN" },
  { href: "/", label: "🏰 DOMINION" },
];

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: "#10102a", border: "2px solid #8b7355", fontSize: 10, fontFamily: "monospace" },
  labelStyle: { color: "#fbbf24", fontSize: 10 },
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState(0);
  const [targetPrice, setTargetPrice] = useState(300000);
  const [monthlyDca, setMonthlyDca] = useState(2841);
  const [showCurrency, setShowCurrency] = useState<"usd" | "idr">("usd");

  useEffect(() => {
    Promise.all([
      getPortfolioAnalytics(),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
        .then((r) => r.json()).then((d) => d.bitcoin?.usd || 0).catch(() => 0),
    ]).then(([analytics, price]) => {
      setData(analytics);
      setBtcPrice(price);
      if (analytics?.income_allocation?.breakdown?.[0]?.amount_usd) {
        setMonthlyDca(analytics.income_allocation.breakdown[0].amount_usd);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // ═══ BTC Accumulation Chart Data ═══
  const accumulationData = useMemo(() => {
    if (!data) return [];
    const historical = (data.dca_timeline || []).map((d: any) => ({
      month: monthLabel(d.month),
      btc: d.cumulative_btc,
      cost: d.cumulative_cost,
      projected: false,
    }));
    const future = (data.future_timeline || []).slice(0, 48).filter((_: any, i: number) => i % 3 === 0).map((d: any) => ({
      month: monthLabel(d.month),
      btcProjected: d.cumulative_btc,
      projected: true,
    }));
    // Bridge: last historical point also gets projected value
    if (historical.length > 0 && future.length > 0) {
      historical[historical.length - 1].btcProjected = historical[historical.length - 1].btc;
    }
    return [...historical, ...future];
  }, [data]);

  // ═══ Net Worth Projection Data ═══
  const projectionData = useMemo(() => {
    if (!data?.projections_2030?.price_scenarios) return [];
    return data.projections_2030.price_scenarios.map((s: any) => {
      const row: any = { price: fmtUsd(s.btc_price) };
      for (const sc of s.scenarios) {
        row[sc.label] = showCurrency === "usd" ? sc.net_worth_usd : sc.net_worth_idr;
      }
      return row;
    });
  }, [data, showCurrency]);

  // ═══ Income Allocation Data ═══
  const incomeData = useMemo(() => {
    if (!data?.income_allocation?.breakdown) return [];
    return data.income_allocation.breakdown.map((b: any) => ({
      name: b.category,
      value: b.amount_usd,
      pct: b.pct,
      color: b.color,
    }));
  }, [data]);

  // ═══ BTC Cycle Phases ═══
  const cycleData = useMemo(() => {
    if (!data?.masterplan?.btc_price_cycle) return [];
    const strategyColors: Record<string, string> = {
      "MAX ACCUMULATION": "#22c55e",
      "BEAR BOTTOM": "#3b82f6",
      "Pre-halving DCA": "#8b5cf6",
      "Post-halving": "#f59e0b",
      "Bull run": "#ef4444",
      "Cycle peak": "#ec4899",
    };
    return data.masterplan.btc_price_cycle.map((c: any) => ({
      ...c,
      color: strategyColors[c.strategy] || "#6b7280",
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <p className="font-pixel text-[12px] text-throne-gold animate-blink">LOADING ANALYTICS...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-20">
        <p className="font-pixel text-[12px] text-throne-red">FAILED TO LOAD ANALYTICS</p>
      </div>
    );
  }

  const btcATH = data.masterplan?.btc_ath || data.projections_2030?.btc_ath || 126000;
  const btcCurrentValue = btcPrice > 0 ? data.btc.quantity * btcPrice : 0;
  const btcPnl = btcCurrentValue - data.btc.cost_basis_usd;
  const btcPnlPct = data.btc.cost_basis_usd > 0 ? (btcPnl / data.btc.cost_basis_usd) * 100 : 0;
  const drawdownPct = btcPrice > 0 ? ((btcATH - btcPrice) / btcATH) * 100 : 0;
  const drawdownZone =
    drawdownPct >= 50 ? "🔥 FIRE SALE" :
    drawdownPct >= 40 ? "⚠️ HEAVY DIP" :
    drawdownPct >= 30 ? "💰 BUYING ZONE" :
    drawdownPct >= 20 ? "📉 MILD DIP" : "✅ NORMAL";
  const drawdownColor =
    drawdownPct >= 50 ? "text-throne-red" :
    drawdownPct >= 40 ? "text-orange-400" :
    drawdownPct >= 30 ? "text-yellow-400" :
    drawdownPct >= 20 ? "text-throne-blue" : "text-throne-green";

  const warChestUsd = data.war_chest?.amount_usd || 0;
  const warChestIdr = data.war_chest?.amount_idr || 0;
  const weddingPct = data.wedding?.progress_pct || 0;
  const weddingCurrent = data.wedding?.current_idr || 0;
  const weddingTarget = data.wedding?.target_idr || 350000000;
  const weddingMonthsLeft = Math.max(0, Math.ceil(
    (new Date(data.masterplan?.wedding_date || "2027-07-01").getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)
  ));
  const weddingMonthlyNeeded = weddingMonthsLeft > 0 ? (weddingTarget - weddingCurrent) / weddingMonthsLeft : 0;

  const scenarioLabels = data.projections_2030?.masterplan_scenarios?.map((s: any) => s.label) || [];
  const SCENARIO_COLORS = ["#6b7280", "#3b82f6", "#fbbf24", "#22c55e"];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* ═══ TITLE ═══ */}
      <div className="rpg-panel p-4 text-center">
        <h1 className="font-pixel text-[14px] md:text-[18px] text-throne-gold text-glow-gold mb-1">
          📊 ANALYTICS & PROJECTIONS
        </h1>
        <p className="text-[9px] font-body text-rpg-borderMid">
          Synced with Investment Master Plan v2.2 • Live BTC: {btcPrice > 0 ? fmtUsd(btcPrice) : "loading"} • ATH: {fmtUsd(btcATH)}
        </p>
      </div>

      {/* ═══ NAV ═══ */}
      <div className="flex flex-wrap gap-2">
        {NAV_ITEMS.map((n) => (
          <Link key={n.href} href={n.href}>
            <span className={`rpg-panel px-3 py-2 font-pixel text-[8px] transition-colors ${
              n.active ? "text-throne-gold bg-rpg-borderDark/50 border border-throne-gold/30" : "text-rpg-border hover:text-throne-gold"
            }`}>{n.label}</span>
          </Link>
        ))}
      </div>

      {/* ═══ SECTION 1: INCOME & CASH FLOW ═══ */}
      <PixelBorder className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💰</span>
          <h2 className="font-pixel text-[12px] text-throne-gold text-glow-gold">MONTHLY CASH FLOW</h2>
          <span className="ml-auto font-pixel text-[14px] text-throne-goldLight">
            {fmtUsd(data.income_allocation?.monthly_income_usd || 10050)}/mo
          </span>
        </div>

        {/* Income Sources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {(data.income_allocation?.income_sources || []).map((s: any) => (
            <div key={s.source} className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/20">
              <p className="font-pixel text-[9px] text-throne-goldLight mb-1">{s.source}</p>
              <p className="font-pixel text-[14px] text-throne-gold">{fmtUsd(s.usd)}</p>
              <p className="text-[8px] font-body text-rpg-borderMid mt-1">{s.allocation}</p>
            </div>
          ))}
        </div>

        {/* Allocation Bars */}
        <p className="text-[8px] font-pixel text-rpg-borderMid mb-2 tracking-widest">WHERE IT GOES</p>
        <div className="space-y-2">
          {incomeData.map((b: any) => (
            <div key={b.name}>
              <div className="flex justify-between text-[9px] font-body mb-0.5">
                <span className="text-rpg-border">{b.name}</span>
                <span className="text-rpg-borderMid">{fmtUsd(b.value)} ({b.pct}%)</span>
              </div>
              <div className="h-3 bg-rpg-borderDark/50 overflow-hidden relative">
                <div
                  className="h-full transition-all"
                  style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-rpg-borderDark flex justify-between items-center">
          <span className="text-[8px] font-pixel text-rpg-borderMid">SAVINGS RATE (BTC + Wedding + War Chest)</span>
          <span className="font-pixel text-[14px] text-throne-green">
            {data.income_allocation?.savings_rate_pct || 55}%
          </span>
        </div>
      </PixelBorder>

      {/* ═══ SECTION 2: BTC ACCUMULATION TIMELINE ═══ */}
      <PixelBorder className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">₿</span>
          <h2 className="font-pixel text-[12px] text-throne-gold text-glow-gold">BTC ACCUMULATION TIMELINE</h2>
          <div className="ml-auto flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-[#fbbf24]" />
              <span className="text-[7px] font-body text-rpg-borderMid">Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-[#fbbf24]/30" style={{ borderTop: "1px dashed #fbbf24" }} />
              <span className="text-[7px] font-body text-rpg-borderMid">Projected</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">CURRENT STACK</p>
            <p className="font-pixel text-[14px] text-throne-gold text-glow-gold">{fmtBtc(data.btc.quantity)}</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">AVG BUY PRICE</p>
            <p className="font-pixel text-[11px] text-rpg-border">{fmtUsd(data.dca.avg_buy_price || data.btc.avg_price)}</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">MONTHLY DCA</p>
            <p className="font-pixel text-[11px] text-throne-goldLight">+{fmtSats(data.projections_2030?.monthly_accumulation || 0)}/mo</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">UNREALIZED P&L</p>
            <p className={`font-pixel text-[11px] ${btcPnl >= 0 ? "text-throne-green" : "text-throne-red"}`}>
              {btcPnl >= 0 ? "+" : ""}{fmtUsd(btcPnl)} ({btcPnlPct >= 0 ? "+" : ""}{btcPnlPct.toFixed(1)}%)
            </p>
          </div>
          <div className="text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">DCA ENTRIES</p>
            <p className="font-pixel text-[11px] text-rpg-border">{data.dca.entries} months</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={accumulationData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3e" />
              <XAxis dataKey="month" tick={{ fill: "#8b7355", fontSize: 8, fontFamily: "monospace" }} />
              <YAxis tick={{ fill: "#8b7355", fontSize: 8 }} tickFormatter={(v) => v.toFixed(2)} domain={[0, "auto"]} />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                formatter={(value: any, name: any) => {
                  if (name === "btc" || name === "btcProjected") return [Number(value).toFixed(4) + " BTC", name === "btcProjected" ? "Projected" : "Actual"];
                  return [fmtUsd(Number(value)), "Cost"];
                }}
              />
              <Area type="monotone" dataKey="btc" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.3} strokeWidth={2} name="btc" />
              <Area type="monotone" dataKey="btcProjected" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" name="btcProjected" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </PixelBorder>

      {/* ═══ SECTION 3: 2030 NET WORTH CALCULATOR ═══ */}
      <PixelBorder className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔮</span>
          <h2 className="font-pixel text-[12px] text-throne-gold text-glow-gold">2030 NET WORTH MATRIX</h2>
          <button
            onClick={() => setShowCurrency(showCurrency === "usd" ? "idr" : "usd")}
            className="ml-auto rpg-panel px-3 py-1 font-pixel text-[8px] text-rpg-border hover:text-throne-gold"
          >
            {showCurrency === "usd" ? "$ USD" : "Rp IDR"} ⇄
          </button>
        </div>

        {/* Scenario Matrix Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectionData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3e" />
              <XAxis dataKey="price" tick={{ fill: "#8b7355", fontSize: 8, fontFamily: "monospace" }} />
              <YAxis tick={{ fill: "#8b7355", fontSize: 8 }} tickFormatter={(v) => showCurrency === "usd" ? fmtUsd(v) : fmtIdr(v)} />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                formatter={(value: any) => showCurrency === "usd" ? fmtUsd(Number(value)) : fmtIdr(Number(value))}
              />
              <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
              {scenarioLabels.map((label: string, i: number) => (
                <Bar key={label} dataKey={label} fill={SCENARIO_COLORS[i]} opacity={0.85} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[9px] font-body">
            <thead>
              <tr className="text-rpg-borderMid border-b border-rpg-borderDark">
                <th className="text-left py-1 font-pixel text-[7px]">BTC PRICE</th>
                {(data.projections_2030?.masterplan_scenarios || []).map((s: any) => (
                  <th key={s.label} className="text-right py-1 font-pixel text-[7px]">{s.label.toUpperCase()} ({s.btc} ₿)</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data.projections_2030?.price_scenarios || []).map((ps: any) => (
                <tr key={ps.btc_price} className={`border-b border-rpg-borderDark/50 hover:bg-rpg-borderDark/30 cursor-pointer ${ps.btc_price === targetPrice ? "bg-throne-gold/10" : ""}`} onClick={() => setTargetPrice(ps.btc_price)}>
                  <td className={`py-1.5 ${ps.btc_price === targetPrice ? "text-throne-gold font-pixel" : "text-rpg-border"}`}>
                    {ps.btc_price === targetPrice ? "▸ " : ""}{fmtUsd(ps.btc_price)}
                  </td>
                  {ps.scenarios.map((sc: any, i: number) => (
                    <td key={sc.label} className="py-1.5 text-right" style={{ color: SCENARIO_COLORS[i] }}>
                      {showCurrency === "usd" ? fmtUsd(sc.net_worth_usd) : fmtIdr(sc.net_worth_idr)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-center">
          <p className="text-[8px] font-body text-rpg-borderMid">
            Masterplan target: <span className="text-throne-gold">5-12 BTC by 2030</span> = {fmtIdr(5 * targetPrice * IDR_PER_USD)} — {fmtIdr(12 * targetPrice * IDR_PER_USD)} at {fmtUsd(targetPrice)}/BTC
          </p>
        </div>
      </PixelBorder>

      {/* ═══ SECTION 4: BTC CYCLE ROADMAP ═══ */}
      <PixelBorder className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🗺️</span>
          <h2 className="font-pixel text-[10px] text-throne-gold">BTC CYCLE ROADMAP (2026-2030)</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {cycleData.map((c: any) => (
            <div key={c.period} className="bg-rpg-borderDark/30 p-3 border-l-4" style={{ borderLeftColor: c.color }}>
              <p className="font-pixel text-[9px] text-rpg-border">{c.period}</p>
              <p className="font-pixel text-[11px] text-throne-goldLight mt-1">{c.range}</p>
              <p className="text-[8px] font-body mt-1" style={{ color: c.color }}>{c.strategy}</p>
            </div>
          ))}
        </div>
      </PixelBorder>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ═══ SECTION 5: FIRE SALE READINESS ═══ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔥</span>
            <h2 className="font-pixel text-[10px] text-throne-gold">FIRE SALE READINESS</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">War Chest</span>
              <span className="font-pixel text-[10px] text-throne-goldLight">
                {fmtUsd(warChestUsd)} ({fmtIdr(warChestIdr)})
              </span>
            </div>

            <div className="border-t border-rpg-borderDark my-1" />

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[8px] font-pixel text-rpg-borderMid">BTC FROM ATH ({fmtUsd(btcATH)})</span>
                <span className={`font-pixel text-[10px] ${drawdownColor}`}>
                  -{drawdownPct.toFixed(1)}% {drawdownZone}
                </span>
              </div>

              <div className="relative h-8 bg-rpg-borderDark/50 border border-rpg-borderMid/30 overflow-hidden">
                <div className="absolute top-0 left-[30%] w-px h-full bg-yellow-400/30" />
                <div className="absolute top-0 left-[40%] w-px h-full bg-orange-400/30" />
                <div className="absolute top-0 left-[50%] w-px h-full bg-throne-red/30" />
                <div
                  className="absolute top-0 h-full bg-gradient-to-r from-throne-green/40 to-transparent"
                  style={{ width: `${Math.min(drawdownPct, 100)}%` }}
                />
                <div
                  className={`absolute top-0 w-1.5 h-full ${drawdownColor.replace("text-", "bg-")} animate-pulse`}
                  style={{ left: `${Math.min(drawdownPct, 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center px-2">
                  <span className="text-[6px] font-pixel text-rpg-borderMid">0%</span>
                  <span className="absolute left-[29%] text-[6px] font-pixel text-yellow-400/60">30%</span>
                  <span className="absolute left-[39%] text-[6px] font-pixel text-orange-400/60">40%</span>
                  <span className="absolute left-[49%] text-[6px] font-pixel text-throne-red/60">50%</span>
                </div>
              </div>
            </div>

            <div className="border-t border-rpg-borderDark my-1" />

            <p className="text-[7px] font-pixel text-rpg-borderMid tracking-widest">DEPLOYMENT TRIGGERS (from ATH {fmtUsd(btcATH)})</p>
            {(data.masterplan?.war_chest_thresholds || []).map((t: any) => {
              const isActive = drawdownPct >= t.drawdown_pct;
              const deployUsd = warChestUsd * (t.deploy_pct / 100);
              return (
                <div key={t.drawdown_pct} className="flex items-center gap-2">
                  <span className={`w-2 h-2 ${isActive ? "bg-throne-green animate-blink" : "bg-rpg-borderDark"}`} />
                  <span className={`text-[9px] font-body ${isActive ? "text-throne-green" : "text-rpg-border"}`}>
                    -{t.drawdown_pct}% (BTC &lt; {fmtUsd(t.btc_price)}) → Deploy {t.deploy_pct}%
                  </span>
                  <span className="ml-auto font-pixel text-[9px] text-rpg-borderMid">
                    {fmtUsd(deployUsd)}
                  </span>
                </div>
              );
            })}

            <div className="mt-2 text-center p-2 border border-rpg-borderMid/30 bg-rpg-borderDark/20">
              {drawdownPct >= 30 ? (
                <span className="font-pixel text-[10px] text-throne-green animate-blink">
                  ⚡ BUYING ZONE ACTIVE ⚡
                </span>
              ) : (
                <span className="font-pixel text-[10px] text-rpg-borderMid">
                  🛡️ HOLDING — Need {fmtUsd(btcATH * 0.70)} or lower
                </span>
              )}
            </div>
          </div>
        </PixelBorder>

        {/* ═══ SECTION 6: WEDDING FUND TRACKER ═══ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💍</span>
            <h2 className="font-pixel text-[10px] text-throne-gold">WEDDING FUND</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[9px] font-body text-rpg-border">Progress</span>
              <span className="font-pixel text-[9px] text-rpg-border">
                {fmtIdr(weddingCurrent)} / {fmtIdr(weddingTarget)}
              </span>
            </div>
            <PixelProgress value={weddingCurrent} max={weddingTarget} color="#ec4899" segments={20} />
            <div className="flex justify-between">
              <span className="text-[9px] font-body text-rpg-borderMid">{weddingPct.toFixed(1)}% complete</span>
              <span className="text-[9px] font-body text-rpg-borderMid">{weddingMonthsLeft} months left</span>
            </div>

            <div className="border-t border-rpg-borderDark mt-2 pt-2" />

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-rpg-borderDark/30 p-2 border border-rpg-borderMid/20 text-center">
                <p className="text-[7px] font-pixel text-rpg-borderMid">MONTHLY NEEDED</p>
                <p className="font-pixel text-[11px] text-ec4899">{fmtIdr(weddingMonthlyNeeded)}</p>
                <p className="text-[8px] font-body text-rpg-borderMid">{fmtUsd(weddingMonthlyNeeded / IDR_PER_USD)}/mo</p>
              </div>
              <div className="bg-rpg-borderDark/30 p-2 border border-rpg-borderMid/20 text-center">
                <p className="text-[7px] font-pixel text-rpg-borderMid">ALLOCATING</p>
                <p className="font-pixel text-[11px] text-throne-green">{fmtIdr(30000000)}</p>
                <p className="text-[8px] font-body text-rpg-borderMid">{fmtUsd(1829)}/mo</p>
              </div>
            </div>

            <div className="mt-2 text-center">
              <p className="text-[9px] font-body text-rpg-borderMid">
                Wedding: <span className="text-throne-goldLight">Jul 2027</span> with <span className="text-throne-goldLight">Keiko</span> 💒
              </p>
              {weddingMonthlyNeeded <= 30000000 ? (
                <p className="text-[8px] font-pixel text-throne-green mt-1">✅ ON TRACK</p>
              ) : (
                <p className="text-[8px] font-pixel text-orange-400 mt-1">⚠️ NEED TO INCREASE MONTHLY</p>
              )}
            </div>
          </div>
        </PixelBorder>
      </div>

      {/* ═══ SECTION 7: DCA PERFORMANCE TABLE ═══ */}
      {data.dca_timeline && data.dca_timeline.length > 0 && (
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📅</span>
            <h2 className="font-pixel text-[10px] text-throne-gold">DCA LOG</h2>
          </div>

          {/* DCA Chart */}
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.dca_timeline} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a3e" />
                <XAxis dataKey="month" tick={{ fill: "#8b7355", fontSize: 8 }} tickFormatter={monthLabel} />
                <YAxis yAxisId="usd" tick={{ fill: "#8b7355", fontSize: 8 }} tickFormatter={(v) => "$" + v} />
                <YAxis yAxisId="btc" orientation="right" tick={{ fill: "#fbbf24", fontSize: 8 }} tickFormatter={(v) => v.toFixed(3)} />
                <Tooltip
                  {...CHART_TOOLTIP_STYLE}
                  formatter={(value: any, name: any) => {
                    if (name === "amount_usd") return [fmtUsd(Number(value)), "Invested"];
                    if (name === "btc_acquired") return [Number(value).toFixed(6) + " BTC", "Acquired"];
                    if (name === "btc_price") return [fmtUsd(Number(value)), "BTC Price"];
                    return [value, name];
                  }}
                />
                <Bar yAxisId="usd" dataKey="amount_usd" fill="#3b82f6" opacity={0.6} name="amount_usd" />
                <Line yAxisId="btc" type="monotone" dataKey="btc_acquired" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3, fill: "#fbbf24" }} name="btc_acquired" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] font-body">
              <thead>
                <tr className="text-rpg-borderMid border-b border-rpg-borderDark">
                  <th className="text-left py-1 font-pixel text-[7px]">MONTH</th>
                  <th className="text-right py-1 font-pixel text-[7px]">INVESTED</th>
                  <th className="text-right py-1 font-pixel text-[7px]">BTC PRICE</th>
                  <th className="text-right py-1 font-pixel text-[7px]">ACQUIRED</th>
                  <th className="text-right py-1 font-pixel text-[7px]">CUMULATIVE</th>
                </tr>
              </thead>
              <tbody>
                {[...data.dca_timeline].reverse().map((d: any, i: number) => (
                  <tr key={i} className="border-b border-rpg-borderDark/50">
                    <td className="py-1.5 text-rpg-border">{monthLabel(d.month)}</td>
                    <td className="py-1.5 text-right text-rpg-border">{fmtUsd(d.amount_usd)}</td>
                    <td className="py-1.5 text-right text-rpg-borderMid">{fmtUsd(d.btc_price)}</td>
                    <td className="py-1.5 text-right text-throne-goldLight">{d.btc_acquired.toFixed(5)} ₿</td>
                    <td className="py-1.5 text-right text-throne-gold">{d.cumulative_btc.toFixed(4)} ₿</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-3 pt-2 border-t border-rpg-borderDark grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">TOTAL INVESTED</p>
              <p className="font-pixel text-[11px] text-rpg-border">{fmtUsd(data.dca.total_invested_usd)}</p>
            </div>
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">AVG PRICE</p>
              <p className="font-pixel text-[11px] text-rpg-border">{fmtUsd(data.dca.avg_buy_price)}</p>
            </div>
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">MONTHLY AVG</p>
              <p className="font-pixel text-[11px] text-throne-goldLight">{fmtUsd(data.dca.monthly_avg_usd)}/mo</p>
            </div>
          </div>
        </PixelBorder>
      )}

      {/* ═══ SECTION 8: CARD PORTFOLIO PERFORMANCE ═══ */}
      <PixelBorder className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🃏</span>
          <h2 className="font-pixel text-[10px] text-throne-gold">CARD PORTFOLIO</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/20 text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">INVESTED</p>
            <p className="font-pixel text-[12px] text-rpg-border">{fmtUsd(data.cards.total_cost_usd)}</p>
          </div>
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/20 text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">CURRENT VALUE</p>
            <p className="font-pixel text-[12px] text-throne-goldLight">{fmtUsd(data.cards.total_current_usd)}</p>
          </div>
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/20 text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">TOTAL ROI</p>
            <p className={`font-pixel text-[14px] ${data.cards.roi_pct >= 0 ? "text-throne-green" : "text-throne-red"}`}>
              {data.cards.roi_pct >= 0 ? "+" : ""}{data.cards.roi_pct.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {(data.cards.franchise_breakdown || []).map((f: any) => {
            const icon = f.franchise === "one_piece" ? "🏴‍☠️" : "⚡";
            const name = f.franchise === "one_piece" ? "ONE PIECE" : "POKEMON";
            const pnl = f.current_usd - f.cost_usd;
            return (
              <div key={f.franchise} className="bg-rpg-borderDark/20 p-3 border border-rpg-borderMid/20">
                <div className="flex items-center gap-2 mb-2">
                  <span>{icon}</span>
                  <span className="font-pixel text-[9px] text-throne-goldLight">{name}</span>
                  <span className="ml-auto font-pixel text-[8px] text-rpg-borderMid">{f.count} cards</span>
                </div>
                <div className="flex justify-between text-[9px] font-body">
                  <span className="text-rpg-borderMid">Cost: {fmtUsd(f.cost_usd)}</span>
                  <span className="text-rpg-border">Now: {fmtUsd(f.current_usd)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`font-pixel text-[10px] ${pnl >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                    {pnl >= 0 ? "+" : ""}{fmtUsd(pnl)}
                  </span>
                  <span className={`font-pixel text-[10px] ${f.roi_pct >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                    {f.roi_pct >= 0 ? "+" : ""}{f.roi_pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[8px] font-pixel text-throne-green mb-2">▲ TOP GAINERS</p>
            <div className="space-y-1">
              {(data.cards.top_by_roi || []).map((c: any, i: number) => (
                <div key={c.id} className="flex items-center gap-2 text-[9px] font-body bg-rpg-borderDark/20 p-1.5">
                  <span className="font-pixel text-[8px] text-rpg-borderMid w-4">{i + 1}.</span>
                  <span className="text-rpg-border truncate flex-1">{c.card_name}</span>
                  <span className="text-throne-green font-pixel text-[9px]">+{c.roi_pct.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[8px] font-pixel text-throne-goldLight mb-2">💎 TOP BY VALUE</p>
            <div className="space-y-1">
              {(data.cards.top_by_value || []).map((c: any, i: number) => (
                <div key={c.id} className="flex items-center gap-2 text-[9px] font-body bg-rpg-borderDark/20 p-1.5">
                  <span className="font-pixel text-[8px] text-rpg-borderMid w-4">{i + 1}.</span>
                  <span className="text-rpg-border truncate flex-1">{c.card_name}</span>
                  <span className="text-throne-goldLight font-pixel text-[9px]">{fmtUsd(c.current_usd)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PixelBorder>

      {/* ═══ FOOTER ═══ */}
      <div className="text-center py-4 space-y-1">
        <p className="text-[8px] font-body text-rpg-borderMid">
          💱 $1 = Rp {IDR_PER_USD.toLocaleString()} • BTC: {btcPrice > 0 ? fmtUsd(btcPrice) : "loading"} via CoinGecko • ATH: {fmtUsd(btcATH)}
        </p>
        <p className="text-[7px] font-body text-rpg-borderMid/60">
          Synced with Investment Master Plan v2.2 (Mar 14, 2026) • &quot;Stack sats. No speculation. See you at Rp 50 Billion.&quot;
        </p>
      </div>
    </div>
  );
}
