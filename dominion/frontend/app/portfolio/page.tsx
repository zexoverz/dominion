"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PixelBorder from "../../components/PixelBorder";
import PixelProgress from "../../components/PixelProgress";
import {
  getPortfolioSummary,
  getPortfolioHoldings,
  getPortfolioFunds,
  getPortfolioDcaLog,
} from "../../lib/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const IDR_PER_USD = 16400;
const COLORS = ["#fbbf24", "#22c55e", "#ec4899", "#f97316", "#06b6d4", "#6b21a8", "#3b82f6"];

function formatUsd(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function formatIdr(n: number) {
  if (n >= 1_000_000_000) return "Rp " + (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + "M";
  return "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}
function formatBtc(n: number) {
  return n.toFixed(4) + " BTC";
}
function pctChange(cost: number, current: number) {
  if (cost === 0) return 0;
  return ((current - cost) / cost) * 100;
}

export default function PortfolioDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [funds, setFunds] = useState<any[]>([]);
  const [dcaLog, setDcaLog] = useState<any[]>([]);
  const [btcPrice, setBtcPrice] = useState<number>(0);

  const loadData = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const [s, h, f, d] = await Promise.all([
        getPortfolioSummary(pw),
        getPortfolioHoldings(pw),
        getPortfolioFunds(pw),
        getPortfolioDcaLog(pw),
      ]);
      setSummary(s);
      setHoldings(h);
      setFunds(f);
      setDcaLog(d);
      setAuthed(true);

      // Fetch BTC price
      try {
        const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const data = await r.json();
        setBtcPrice(data.bitcoin.usd);
      } catch { /* ignore */ }
    } catch (err: any) {
      if (err.message?.includes("401")) {
        setError("Wrong password");
        setAuthed(false);
      } else {
        // Maybe no password required
        setAuthed(true);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Try without password first
    loadData("");
  }, [loadData]);

  if (!authed) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <PixelBorder className="p-6">
          <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-4 text-center">
            🔒 VAULT ACCESS
          </h1>
          <p className="text-[10px] font-body text-rpg-border mb-4 text-center">
            Enter the password to access Lord Zexo&apos;s portfolio
          </p>
          {error && (
            <p className="text-[10px] font-pixel text-throne-red mb-3 text-center">{error}</p>
          )}
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadData(password)}
              className="flex-1 bg-rpg-borderDark/30 border-2 border-rpg-borderMid text-rpg-border font-body text-sm px-3 py-2 focus:border-throne-gold outline-none"
              placeholder="Password..."
            />
            <button
              onClick={() => loadData(password)}
              disabled={loading}
              className="rpg-panel px-4 py-2 font-pixel text-[9px] text-throne-gold hover:bg-rpg-borderDark/50 transition-colors"
            >
              {loading ? "..." : "ENTER"}
            </button>
          </div>
        </PixelBorder>
      </div>
    );
  }

  if (loading || !summary) {
    return (
      <div className="text-center mt-20">
        <p className="font-pixel text-[12px] text-throne-gold animate-blink">LOADING VAULT...</p>
      </div>
    );
  }

  const btcHolding = holdings.find((h) => h.symbol === "BTC");
  const btcQty = btcHolding ? parseFloat(btcHolding.quantity) : 0;
  const btcCost = btcHolding ? parseFloat(btcHolding.cost_basis_usd) : 0;
  const btcCurrentVal = btcPrice > 0 ? btcQty * btcPrice : btcCost;
  const btcPnl = btcCurrentVal - btcCost;
  const btcPnlPct = pctChange(btcCost, btcCurrentVal);
  const btcAvgCost = btcQty > 0 ? btcCost / btcQty : 0;

  const wedding = funds.find((f) => f.fund_type === "wedding");
  const warChest = funds.find((f) => f.fund_type === "war_chest");
  const weddingCurrent = wedding ? parseFloat(wedding.current_amount_idr) : 0;
  const weddingTarget = wedding ? parseFloat(wedding.target_amount_idr) : 350000000;
  const warChestAmt = warChest ? parseFloat(warChest.current_amount_idr) : 0;

  // War chest deployment thresholds
  // War chest thresholds based on ATH ($126K) drawdown %
  const btcATH = 126000;
  const warChestThresholds = [
    { label: "Deploy 25%", btcBelow: Math.round(btcATH * 0.70), pct: 25 },
    { label: "Deploy 50%", btcBelow: Math.round(btcATH * 0.60), pct: 50 },
    { label: "Deploy 100%", btcBelow: Math.round(btcATH * 0.50), pct: 100 },
  ];

  // Allocation pie data
  const allocData = Object.entries(summary.allocations || {}).map(([name, val]) => ({
    name,
    value: Math.round(val as number),
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  // Net worth with live BTC
  const netWorthUsd = btcPrice > 0
    ? summary.net_worth_usd - (btcCost) + btcCurrentVal
    : summary.net_worth_usd;

  // Months remaining to wedding
  const weddingDate = wedding?.target_date ? new Date(wedding.target_date) : new Date("2027-07-01");
  const now = new Date();
  const monthsRemaining = Math.max(0, (weddingDate.getFullYear() - now.getFullYear()) * 12 + weddingDate.getMonth() - now.getMonth());
  const monthlyNeeded = monthsRemaining > 0 ? (weddingTarget - weddingCurrent) / monthsRemaining : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Title */}
      <div className="rpg-panel p-4 text-center">
        <h1 className="font-pixel text-[14px] md:text-[18px] text-throne-gold text-glow-gold mb-1">
          💰 PORTFOLIO VAULT
        </h1>
        <p className="text-[9px] font-body text-rpg-borderMid">
          Lord Zexo&apos;s Investment Command Center
        </p>
      </div>

      {/* Nav */}
      <div className="flex flex-wrap gap-2">
        <Link href="/portfolio">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-throne-gold bg-rpg-borderDark/50 border border-throne-gold/30">
            📊 OVERVIEW
          </span>
        </Link>
        <Link href="/portfolio/collectibles">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-rpg-border hover:text-throne-gold transition-colors">
            🃏 COLLECTIBLES
          </span>
        </Link>
        <Link href="/portfolio/analytics">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-rpg-border hover:text-throne-gold transition-colors">
            📈 ANALYTICS
          </span>
        </Link>
        <Link href="/portfolio/masterplan">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-rpg-border hover:text-throne-gold transition-colors">
            📜 MASTERPLAN
          </span>
        </Link>
        <Link href="/">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-rpg-border hover:text-throne-gold transition-colors">
            🏰 DOMINION
          </span>
        </Link>
      </div>

      {/* ═══ NET WORTH ═══ */}
      <PixelBorder className="p-4">
        <p className="font-pixel text-[8px] text-rpg-borderMid mb-2 tracking-widest">NET WORTH</p>
        <div className="flex flex-col md:flex-row md:items-end gap-2">
          <div>
            <p className="font-pixel text-[20px] md:text-[28px] text-throne-gold text-glow-gold">
              {formatUsd(netWorthUsd)}
            </p>
            <p className="text-[11px] font-body text-rpg-border">
              {formatIdr(netWorthUsd * IDR_PER_USD)}
            </p>
          </div>
          <div className="md:ml-auto text-right">
            <p className={`font-pixel text-[11px] ${summary.unrealized_pnl_usd >= 0 ? "text-throne-green" : "text-throne-red"}`}>
              {summary.unrealized_pnl_usd >= 0 ? "▲" : "▼"} {formatUsd(Math.abs(summary.unrealized_pnl_usd))} unrealized
            </p>
            <p className="text-[9px] font-body text-rpg-borderMid">
              Cost basis: {formatUsd(summary.total_cost_usd)}
            </p>
          </div>
        </div>
      </PixelBorder>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ═══ BTC STACK ═══ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">₿</span>
            <p className="font-pixel text-[10px] text-throne-gold">BTC STACK</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-body text-rpg-border">Holdings</span>
              <span className="font-pixel text-[12px] text-throne-goldLight">{formatBtc(btcQty)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-body text-rpg-border">Avg Cost</span>
              <span className="font-pixel text-[10px] text-rpg-border">{formatUsd(btcAvgCost)}/BTC</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-body text-rpg-border">Current Price</span>
              <span className="font-pixel text-[10px] text-throne-gold">
                {btcPrice > 0 ? formatUsd(btcPrice) : "Loading..."}
              </span>
            </div>
            <div className="border-t border-rpg-borderDark my-2" />
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-body text-rpg-border">Value</span>
              <span className="font-pixel text-[11px] text-throne-goldLight">
                {formatUsd(btcCurrentVal)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-body text-rpg-border">P&L</span>
              <span className={`font-pixel text-[11px] ${btcPnl >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                {btcPnl >= 0 ? "+" : ""}{formatUsd(btcPnl)} ({btcPnlPct >= 0 ? "+" : ""}{btcPnlPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </PixelBorder>

        {/* ═══ ALLOCATION PIE ═══ */}
        <PixelBorder className="p-4">
          <p className="font-pixel text-[10px] text-throne-gold mb-2">ALLOCATION</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  stroke="#0a0a0f"
                  strokeWidth={2}
                >
                  {allocData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#10102a", border: "2px solid #8b7355", fontSize: 10, fontFamily: "monospace" }}
                  formatter={(value: any) => formatUsd(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {allocData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-2 h-2" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[8px] font-body text-rpg-border">{d.name}</span>
              </div>
            ))}
          </div>
        </PixelBorder>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ═══ WEDDING FUND ═══ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💍</span>
            <p className="font-pixel text-[10px] text-throne-gold">WEDDING FUND</p>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-body text-rpg-border">Progress</span>
            <span className="font-pixel text-[10px] text-throne-goldLight">
              {formatIdr(weddingCurrent)} / {formatIdr(weddingTarget)}
            </span>
          </div>
          <PixelProgress
            value={weddingCurrent}
            max={weddingTarget}
            color="#ec4899"
            segments={20}
          />
          <div className="flex justify-between mt-2">
            <span className="text-[9px] font-body text-rpg-borderMid">
              {((weddingCurrent / weddingTarget) * 100).toFixed(1)}% complete
            </span>
            <span className="text-[9px] font-body text-rpg-borderMid">
              {monthsRemaining} months left
            </span>
          </div>
          <div className="mt-2 border-t border-rpg-borderDark pt-2">
            <div className="flex justify-between">
              <span className="text-[9px] font-body text-rpg-border">Monthly needed</span>
              <span className="font-pixel text-[9px] text-throne-gold">{formatIdr(monthlyNeeded)}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] font-body text-rpg-border">USD equiv</span>
              <span className="text-[9px] font-body text-rpg-borderMid">{formatUsd(weddingCurrent / IDR_PER_USD)} / {formatUsd(weddingTarget / IDR_PER_USD)}</span>
            </div>
          </div>
        </PixelBorder>

        {/* ═══ WAR CHEST ═══ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚔️</span>
            <p className="font-pixel text-[10px] text-throne-gold">WAR CHEST</p>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-body text-rpg-border">Available</span>
            <span className="font-pixel text-[11px] text-throne-goldLight">
              {formatIdr(warChestAmt)} ({formatUsd(warChestAmt / IDR_PER_USD)})
            </span>
          </div>
          <div className="space-y-2 mt-3">
            <p className="text-[8px] font-pixel text-rpg-borderMid tracking-widest">DEPLOYMENT THRESHOLDS</p>
            {warChestThresholds.map((t) => {
              const active = btcPrice > 0 && btcPrice < t.btcBelow;
              return (
                <div key={t.label} className="flex items-center gap-2">
                  <span className={`w-2 h-2 ${active ? "bg-throne-green animate-blink" : "bg-rpg-borderDark"}`} />
                  <span className={`text-[9px] font-body ${active ? "text-throne-green" : "text-rpg-border"}`}>
                    {t.label} — BTC &lt; {formatUsd(t.btcBelow)}
                  </span>
                  <span className="ml-auto font-pixel text-[9px] text-rpg-borderMid">
                    {formatUsd((warChestAmt / IDR_PER_USD) * (t.pct / 100))}
                  </span>
                </div>
              );
            })}
          </div>
        </PixelBorder>
      </div>

      {/* ═══ HOLDINGS TABLE ═══ */}
      <PixelBorder className="p-4">
        <p className="font-pixel text-[10px] text-throne-gold mb-3">ALL HOLDINGS</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-body">
            <thead>
              <tr className="text-rpg-borderMid border-b border-rpg-borderDark">
                <th className="text-left py-2 font-pixel text-[8px]">ASSET</th>
                <th className="text-right py-2 font-pixel text-[8px]">QTY</th>
                <th className="text-right py-2 font-pixel text-[8px]">COST</th>
                <th className="text-right py-2 font-pixel text-[8px]">VALUE</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const qty = parseFloat(h.quantity);
                const cost = parseFloat(h.cost_basis_usd);
                let currentVal = cost;
                if (h.symbol === "BTC" && btcPrice > 0) {
                  currentVal = qty * btcPrice;
                } else if (h.symbol === "IDR") {
                  currentVal = qty / IDR_PER_USD;
                }
                return (
                  <tr key={h.id} className="border-b border-rpg-borderDark/50 hover:bg-rpg-borderDark/20">
                    <td className="py-2 text-rpg-border">
                      <span className="text-throne-goldLight">{h.asset_name}</span>
                      <span className="text-rpg-borderMid ml-1">({h.symbol})</span>
                    </td>
                    <td className="py-2 text-right text-rpg-border">
                      {h.symbol === "IDR" ? formatIdr(qty) : qty.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                    </td>
                    <td className="py-2 text-right text-rpg-borderMid">{formatUsd(cost)}</td>
                    <td className="py-2 text-right">
                      <span className={currentVal >= cost ? "text-throne-green" : "text-throne-red"}>
                        {formatUsd(currentVal)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Cards row */}
              <tr className="border-b border-rpg-borderDark/50 hover:bg-rpg-borderDark/20">
                <td className="py-2 text-rpg-border">
                  <span className="text-throne-goldLight">Card Collection</span>
                  <span className="text-rpg-borderMid ml-1">({summary.cards_count} cards)</span>
                </td>
                <td className="py-2 text-right text-rpg-border">{summary.cards_count}</td>
                <td className="py-2 text-right text-rpg-borderMid">{formatUsd(summary.cards_cost_usd)}</td>
                <td className="py-2 text-right">
                  <span className={summary.cards_current_usd >= summary.cards_cost_usd ? "text-throne-green" : "text-throne-red"}>
                    {formatUsd(summary.cards_current_usd)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PixelBorder>

      {/* ═══ DCA LOG ═══ */}
      {dcaLog.length > 0 && (
        <PixelBorder className="p-4">
          <p className="font-pixel text-[10px] text-throne-gold mb-3">📅 DCA LOG</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-body">
              <thead>
                <tr className="text-rpg-borderMid border-b border-rpg-borderDark">
                  <th className="text-left py-2 font-pixel text-[8px]">MONTH</th>
                  <th className="text-right py-2 font-pixel text-[8px]">AMOUNT</th>
                  <th className="text-right py-2 font-pixel text-[8px]">BTC PRICE</th>
                  <th className="text-right py-2 font-pixel text-[8px]">ACQUIRED</th>
                </tr>
              </thead>
              <tbody>
                {dcaLog.map((d) => (
                  <tr key={d.id} className="border-b border-rpg-borderDark/50">
                    <td className="py-2 text-rpg-border">{new Date(d.month).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</td>
                    <td className="py-2 text-right text-rpg-border">{formatUsd(parseFloat(d.amount_usd))}</td>
                    <td className="py-2 text-right text-rpg-borderMid">{formatUsd(parseFloat(d.btc_price_usd))}</td>
                    <td className="py-2 text-right text-throne-goldLight">{parseFloat(d.btc_acquired).toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PixelBorder>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[8px] font-body text-rpg-borderMid">
          💱 Exchange rate: $1 = Rp {IDR_PER_USD.toLocaleString()} • BTC price via CoinGecko
        </p>
      </div>
    </div>
  );
}
