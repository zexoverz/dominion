"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import PixelBorder from "../../../components/PixelBorder";
import PixelProgress from "../../../components/PixelProgress";
import { getPortfolioAnalytics } from "../../../lib/api";

const IDR_PER_USD = 16400;

function formatUsd(n: number) {
  if (n >= 1_000_000_000) return "$" + (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function formatIdr(n: number) {
  if (n >= 1_000_000_000_000) return "Rp " + (n / 1_000_000_000_000).toFixed(1) + "T";
  if (n >= 1_000_000_000) return "Rp " + (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + "M";
  return "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}
function formatBtc(n: number) {
  return n.toFixed(4) + " ₿";
}

const PRICE_TARGETS = [100000, 150000, 200000, 300000, 500000, 750000, 1000000];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState(0);

  // Interactive controls
  const [targetPrice, setTargetPrice] = useState(300000);
  const [monthlyDca, setMonthlyDca] = useState(500);
  const [fireSaleMultiplier, setFireSaleMultiplier] = useState(1);

  useEffect(() => {
    Promise.all([
      getPortfolioAnalytics(),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
        .then((r) => r.json())
        .then((d) => d.bitcoin?.usd || 0)
        .catch(() => 0),
    ])
      .then(([analytics, price]) => {
        setData(analytics);
        setBtcPrice(price);
        if (analytics?.dca?.monthly_avg_usd) {
          setMonthlyDca(Math.round(analytics.dca.monthly_avg_usd));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // 2030 projection calc
  const projection = useMemo(() => {
    if (!data) return null;
    const currentBtc = data.btc.quantity;
    const monthsTo2030 = data.projections_2030.months_to_2030;
    const avgBtcPrice = btcPrice || 85000;
    const monthlyBtcBase = monthlyDca / avgBtcPrice;
    const monthlyBtcWithMultiplier = monthlyBtcBase * fireSaleMultiplier;
    const projectedBtc = currentBtc + monthlyBtcWithMultiplier * monthsTo2030;
    const netWorthUsd = projectedBtc * targetPrice;
    const netWorthIdr = netWorthUsd * IDR_PER_USD;
    // Add card portfolio value (assume grows 50% by 2030)
    const cardValue2030 = (data.cards.total_current_usd || 0) * 1.5;
    const totalNetWorth = netWorthUsd + cardValue2030;

    return {
      currentBtc,
      monthlyBtc: monthlyBtcWithMultiplier,
      projectedBtc,
      netWorthUsd,
      netWorthIdr,
      totalNetWorth,
      totalNetWorthIdr: totalNetWorth * IDR_PER_USD,
      monthsTo2030,
      cardValue2030,
    };
  }, [data, btcPrice, targetPrice, monthlyDca, fireSaleMultiplier]);

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

  const btcCurrentValue = btcPrice > 0 ? data.btc.quantity * btcPrice : 0;
  const btcPnl = btcCurrentValue - data.btc.cost_basis_usd;
  const btcPnlPct = data.btc.cost_basis_usd > 0 ? (btcPnl / data.btc.cost_basis_usd) * 100 : 0;

  // ATH tracking (hardcoded known ATH for now)
  const btcATH = 109000; // approximate recent ATH
  const drawdownPct = btcPrice > 0 ? ((btcATH - btcPrice) / btcATH) * 100 : 0;
  const drawdownZone =
    drawdownPct >= 50 ? "FIRE SALE" : drawdownPct >= 40 ? "HEAVY DIP" : drawdownPct >= 30 ? "BUYING ZONE" : drawdownPct >= 20 ? "MILD DIP" : "NORMAL";
  const drawdownColor =
    drawdownPct >= 50
      ? "text-throne-red"
      : drawdownPct >= 40
        ? "text-orange-400"
        : drawdownPct >= 30
          ? "text-yellow-400"
          : drawdownPct >= 20
            ? "text-throne-blue"
            : "text-throne-green";

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Title */}
      <div className="rpg-panel p-4 text-center">
        <h1 className="font-pixel text-[14px] md:text-[18px] text-throne-gold text-glow-gold mb-1">
          📊 ANALYTICS & PROJECTIONS
        </h1>
        <p className="text-[9px] font-body text-rpg-borderMid">
          2030 Net Worth Calculator • Portfolio Performance • Fire Sale Readiness
        </p>
      </div>

      {/* Nav */}
      <div className="flex flex-wrap gap-2">
        <Link href="/portfolio">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-rpg-border hover:text-throne-gold transition-colors">
            📊 OVERVIEW
          </span>
        </Link>
        <Link href="/portfolio/collectibles">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-rpg-border hover:text-throne-gold transition-colors">
            🃏 COLLECTIBLES
          </span>
        </Link>
        <Link href="/portfolio/analytics">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-throne-gold bg-rpg-borderDark/50 border border-throne-gold/30">
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

      {/* ═══════════════════════════════════════ */}
      {/* ═══ 2030 NET WORTH CALCULATOR ═══ */}
      {/* ═══════════════════════════════════════ */}
      <PixelBorder className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔮</span>
          <h2 className="font-pixel text-[12px] text-throne-gold text-glow-gold">2030 NET WORTH CALCULATOR</h2>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* BTC Target Price */}
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/30">
            <label className="font-pixel text-[8px] text-rpg-borderMid block mb-2">BTC TARGET PRICE</label>
            <input
              type="range"
              min={100000}
              max={1000000}
              step={50000}
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full accent-throne-gold h-2 bg-rpg-borderDark cursor-pointer"
            />
            <p className="font-pixel text-[14px] text-throne-gold text-center mt-2">
              {formatUsd(targetPrice)}
            </p>
          </div>

          {/* Monthly DCA */}
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/30">
            <label className="font-pixel text-[8px] text-rpg-borderMid block mb-2">MONTHLY DCA</label>
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={monthlyDca}
              onChange={(e) => setMonthlyDca(Number(e.target.value))}
              className="w-full accent-throne-gold h-2 bg-rpg-borderDark cursor-pointer"
            />
            <p className="font-pixel text-[14px] text-throne-gold text-center mt-2">
              {formatUsd(monthlyDca)}/mo
            </p>
          </div>

          {/* Fire Sale Multiplier */}
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/30">
            <label className="font-pixel text-[8px] text-rpg-borderMid block mb-2">FIRE SALE MULTIPLIER</label>
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={fireSaleMultiplier}
              onChange={(e) => setFireSaleMultiplier(Number(e.target.value))}
              className="w-full accent-throne-gold h-2 bg-rpg-borderDark cursor-pointer"
            />
            <p className="font-pixel text-[14px] text-throne-gold text-center mt-2">
              {fireSaleMultiplier}x
            </p>
          </div>
        </div>

        {/* Projection Results */}
        {projection && (
          <div className="border-2 border-throne-gold/30 bg-rpg-borderDark/40 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-[7px] font-pixel text-rpg-borderMid">CURRENT BTC</p>
                <p className="font-pixel text-[12px] text-rpg-border">{formatBtc(projection.currentBtc)}</p>
              </div>
              <div>
                <p className="text-[7px] font-pixel text-rpg-borderMid">MONTHLY STACK</p>
                <p className="font-pixel text-[12px] text-throne-goldLight">
                  +{(projection.monthlyBtc * 100000000).toFixed(0)} sats
                </p>
              </div>
              <div>
                <p className="text-[7px] font-pixel text-rpg-borderMid">PROJECTED BTC (2030)</p>
                <p className="font-pixel text-[14px] text-throne-gold text-glow-gold">{formatBtc(projection.projectedBtc)}</p>
              </div>
              <div>
                <p className="text-[7px] font-pixel text-rpg-borderMid">MONTHS LEFT</p>
                <p className="font-pixel text-[12px] text-rpg-border">{projection.monthsTo2030}</p>
              </div>
            </div>

            <div className="border-t border-rpg-borderDark my-3" />

            <div className="text-center space-y-1">
              <p className="text-[8px] font-pixel text-rpg-borderMid">PROJECTED 2030 NET WORTH</p>
              <p className="font-pixel text-[24px] md:text-[32px] text-throne-gold text-glow-gold">
                {formatUsd(projection.totalNetWorth)}
              </p>
              <p className="font-pixel text-[14px] text-throne-goldLight">
                {formatIdr(projection.totalNetWorthIdr)}
              </p>
              <p className="text-[8px] font-body text-rpg-borderMid mt-1">
                BTC: {formatUsd(projection.netWorthUsd)} + Cards: {formatUsd(projection.cardValue2030)}
              </p>
            </div>
          </div>
        )}

        {/* Quick scenario table */}
        <div className="mt-4">
          <p className="text-[8px] font-pixel text-rpg-borderMid mb-2">SCENARIO TABLE (at {formatBtc(projection?.projectedBtc || 0)})</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] font-body">
              <thead>
                <tr className="text-rpg-borderMid border-b border-rpg-borderDark">
                  <th className="text-left py-1 font-pixel text-[7px]">BTC PRICE</th>
                  <th className="text-right py-1 font-pixel text-[7px]">NET WORTH (USD)</th>
                  <th className="text-right py-1 font-pixel text-[7px]">NET WORTH (IDR)</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_TARGETS.map((price) => {
                  const nw = (projection?.projectedBtc || 0) * price;
                  const isActive = price === targetPrice;
                  return (
                    <tr
                      key={price}
                      className={`border-b border-rpg-borderDark/50 cursor-pointer hover:bg-rpg-borderDark/30 ${isActive ? "bg-throne-gold/10" : ""}`}
                      onClick={() => setTargetPrice(price)}
                    >
                      <td className={`py-1.5 ${isActive ? "text-throne-gold font-pixel" : "text-rpg-border"}`}>
                        {isActive ? "▸ " : ""}{formatUsd(price)}
                      </td>
                      <td className={`py-1.5 text-right ${isActive ? "text-throne-gold" : "text-rpg-border"}`}>
                        {formatUsd(nw)}
                      </td>
                      <td className={`py-1.5 text-right ${isActive ? "text-throne-goldLight" : "text-rpg-borderMid"}`}>
                        {formatIdr(nw * IDR_PER_USD)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </PixelBorder>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ═══════════════════════════════════════ */}
        {/* ═══ DCA PERFORMANCE ═══ */}
        {/* ═══════════════════════════════════════ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📈</span>
            <h2 className="font-pixel text-[10px] text-throne-gold">DCA PERFORMANCE</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">Avg Buy Price</span>
              <span className="font-pixel text-[10px] text-rpg-border">{formatUsd(data.dca.avg_buy_price)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">Current BTC Price</span>
              <span className="font-pixel text-[10px] text-throne-gold">
                {btcPrice > 0 ? formatUsd(btcPrice) : "Loading..."}
              </span>
            </div>
            <div className="border-t border-rpg-borderDark my-1" />
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">Total Invested</span>
              <span className="font-pixel text-[10px] text-rpg-border">{formatUsd(data.btc.cost_basis_usd)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">Current Value</span>
              <span className="font-pixel text-[10px] text-throne-goldLight">{formatUsd(btcCurrentValue)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">Unrealized P&L</span>
              <span className={`font-pixel text-[11px] ${btcPnl >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                {btcPnl >= 0 ? "+" : ""}{formatUsd(btcPnl)} ({btcPnlPct >= 0 ? "+" : ""}{btcPnlPct.toFixed(1)}%)
              </span>
            </div>
            <div className="border-t border-rpg-borderDark my-1" />
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">DCA Entries</span>
              <span className="font-pixel text-[9px] text-rpg-borderMid">{data.dca.entries} months</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">Monthly Avg</span>
              <span className="font-pixel text-[9px] text-rpg-borderMid">{formatUsd(data.dca.monthly_avg_usd)}/mo</span>
            </div>
          </div>
        </PixelBorder>

        {/* ═══════════════════════════════════════ */}
        {/* ═══ FIRE SALE READINESS ═══ */}
        {/* ═══════════════════════════════════════ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔥</span>
            <h2 className="font-pixel text-[10px] text-throne-gold">FIRE SALE READINESS</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-body text-rpg-border">War Chest</span>
              <span className="font-pixel text-[10px] text-throne-goldLight">
                {formatUsd(data.war_chest.amount_usd)} ({formatIdr(data.war_chest.amount_idr)})
              </span>
            </div>

            <div className="border-t border-rpg-borderDark my-1" />

            {/* Drawdown indicator */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[8px] font-pixel text-rpg-borderMid">BTC DRAWDOWN FROM ATH</span>
                <span className={`font-pixel text-[10px] ${drawdownColor}`}>
                  -{drawdownPct.toFixed(1)}% ({drawdownZone})
                </span>
              </div>

              {/* Visual drawdown bar */}
              <div className="relative h-6 bg-rpg-borderDark/50 border border-rpg-borderMid/30 overflow-hidden">
                {/* Zone markers */}
                <div className="absolute top-0 left-[20%] w-px h-full bg-throne-blue/30" />
                <div className="absolute top-0 left-[30%] w-px h-full bg-yellow-400/30" />
                <div className="absolute top-0 left-[40%] w-px h-full bg-orange-400/30" />
                <div className="absolute top-0 left-[50%] w-px h-full bg-throne-red/30" />

                {/* Current position */}
                <div
                  className="absolute top-0 h-full bg-gradient-to-r from-throne-green/40 to-transparent"
                  style={{ width: `${Math.min(drawdownPct, 100)}%` }}
                />
                <div
                  className={`absolute top-0 w-1 h-full ${drawdownColor.replace("text-", "bg-")}`}
                  style={{ left: `${Math.min(drawdownPct, 100)}%` }}
                />

                {/* Labels */}
                <div className="absolute inset-0 flex items-center justify-between px-1">
                  <span className="text-[6px] font-pixel text-rpg-borderMid">0%</span>
                  <span className="text-[6px] font-pixel text-yellow-400/60">-30%</span>
                  <span className="text-[6px] font-pixel text-orange-400/60">-40%</span>
                  <span className="text-[6px] font-pixel text-throne-red/60">-50%</span>
                </div>
              </div>
            </div>

            <div className="border-t border-rpg-borderDark my-1" />

            {/* Deployment thresholds */}
            <p className="text-[7px] font-pixel text-rpg-borderMid tracking-widest">DEPLOYMENT TRIGGERS</p>
            {data.war_chest.deployment_triggers.map((t: any) => {
              const isActive = drawdownPct >= t.drawdown_pct;
              return (
                <div key={t.drawdown_pct} className="flex items-center gap-2">
                  <span className={`w-2 h-2 ${isActive ? "bg-throne-green animate-blink" : "bg-rpg-borderDark"}`} />
                  <span className={`text-[9px] font-body ${isActive ? "text-throne-green" : "text-rpg-border"}`}>
                    -{t.drawdown_pct}% → Deploy {t.deploy_pct}%
                  </span>
                  <span className="ml-auto font-pixel text-[9px] text-rpg-borderMid">
                    {formatUsd(t.deploy_usd)}
                  </span>
                </div>
              );
            })}

            {/* Ready indicator */}
            <div className="mt-2 text-center p-2 border border-rpg-borderMid/30 bg-rpg-borderDark/20">
              {drawdownPct >= 30 ? (
                <span className="font-pixel text-[10px] text-throne-green animate-blink">
                  ⚡ READY TO DEPLOY ⚡
                </span>
              ) : (
                <span className="font-pixel text-[10px] text-rpg-borderMid">
                  🛡️ HOLDING — Wait for -{(30).toFixed(0)}% drawdown
                </span>
              )}
            </div>
          </div>
        </PixelBorder>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* ═══ CARD PORTFOLIO PERFORMANCE ═══ */}
      {/* ═══════════════════════════════════════ */}
      <PixelBorder className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🃏</span>
          <h2 className="font-pixel text-[10px] text-throne-gold">CARD PORTFOLIO PERFORMANCE</h2>
        </div>

        {/* Total Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/20 text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">TOTAL INVESTED</p>
            <p className="font-pixel text-[12px] text-rpg-border">{formatUsd(data.cards.total_cost_usd)}</p>
          </div>
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/20 text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">CURRENT VALUE</p>
            <p className="font-pixel text-[12px] text-throne-goldLight">{formatUsd(data.cards.total_current_usd)}</p>
          </div>
          <div className="bg-rpg-borderDark/30 p-3 border border-rpg-borderMid/20 text-center">
            <p className="text-[7px] font-pixel text-rpg-borderMid">TOTAL ROI</p>
            <p className={`font-pixel text-[14px] ${data.cards.roi_pct >= 0 ? "text-throne-green" : "text-throne-red"}`}>
              {data.cards.roi_pct >= 0 ? "+" : ""}{data.cards.roi_pct.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Franchise Comparison */}
        <p className="text-[8px] font-pixel text-rpg-borderMid mb-2 tracking-widest">FRANCHISE COMPARISON</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {data.cards.franchise_breakdown.map((f: any) => {
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
                  <span className="text-rpg-borderMid">Cost: {formatUsd(f.cost_usd)}</span>
                  <span className="text-rpg-border">Now: {formatUsd(f.current_usd)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`font-pixel text-[10px] ${pnl >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                    {pnl >= 0 ? "+" : ""}{formatUsd(pnl)}
                  </span>
                  <span className={`font-pixel text-[10px] ${f.roi_pct >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                    {f.roi_pct >= 0 ? "+" : ""}{f.roi_pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Gainers & Losers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Gainers */}
          <div>
            <p className="text-[8px] font-pixel text-throne-green mb-2">▲ TOP GAINERS (ROI %)</p>
            <div className="space-y-1">
              {data.cards.top_by_roi.map((c: any, i: number) => (
                <div key={c.id} className="flex items-center gap-2 text-[9px] font-body bg-rpg-borderDark/20 p-1.5">
                  <span className="font-pixel text-[8px] text-rpg-borderMid w-4">{i + 1}.</span>
                  <span className="text-rpg-border truncate flex-1">{c.card_name}</span>
                  <span className="text-throne-green font-pixel text-[9px]">+{c.roi_pct.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top by Value */}
          <div>
            <p className="text-[8px] font-pixel text-throne-goldLight mb-2">💎 TOP BY VALUE</p>
            <div className="space-y-1">
              {data.cards.top_by_value.map((c: any, i: number) => (
                <div key={c.id} className="flex items-center gap-2 text-[9px] font-body bg-rpg-borderDark/20 p-1.5">
                  <span className="font-pixel text-[8px] text-rpg-borderMid w-4">{i + 1}.</span>
                  <span className="text-rpg-border truncate flex-1">{c.card_name}</span>
                  <span className="text-throne-goldLight font-pixel text-[9px]">{formatUsd(c.current_usd)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PixelBorder>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ═══════════════════════════════════════ */}
        {/* ═══ WEDDING FUND PROGRESS ═══ */}
        {/* ═══════════════════════════════════════ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💍</span>
            <h2 className="font-pixel text-[10px] text-throne-gold">WEDDING FUND</h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[9px] font-body text-rpg-border">Progress</span>
              <span className="font-pixel text-[9px] text-rpg-border">
                {formatIdr(data.wedding.current_idr)} / {formatIdr(data.wedding.target_idr)}
              </span>
            </div>
            <PixelProgress
              value={data.wedding.current_idr}
              max={data.wedding.target_idr}
              color="#ec4899"
              segments={20}
            />
            <div className="flex justify-between">
              <span className="text-[9px] font-body text-rpg-borderMid">
                {data.wedding.progress_pct.toFixed(1)}% complete
              </span>
              <span className="text-[9px] font-body text-rpg-borderMid">
                Target: {data.wedding.target_date}
              </span>
            </div>
          </div>
        </PixelBorder>

        {/* ═══════════════════════════════════════ */}
        {/* ═══ INCOME ALLOCATION ═══ */}
        {/* ═══════════════════════════════════════ */}
        <PixelBorder className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💰</span>
            <h2 className="font-pixel text-[10px] text-throne-gold">INCOME ALLOCATION</h2>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-[9px] font-body text-rpg-border">Monthly Income</span>
            <span className="font-pixel text-[10px] text-throne-goldLight">
              {formatUsd(data.income_allocation.monthly_income_usd)}
            </span>
          </div>

          <div className="space-y-1.5">
            {data.income_allocation.breakdown.map((b: any) => {
              const colors: Record<string, string> = {
                "BTC DCA": "bg-throne-gold",
                "Wedding Fund": "bg-pink-500",
                "War Chest": "bg-orange-500",
                "Cards": "bg-throne-blue",
                "Living & Expenses": "bg-rpg-borderMid",
              };
              const barColor = colors[b.category] || "bg-rpg-border";
              return (
                <div key={b.category}>
                  <div className="flex justify-between text-[8px] font-body mb-0.5">
                    <span className="text-rpg-border">{b.category}</span>
                    <span className="text-rpg-borderMid">{formatUsd(b.amount_usd)} ({b.pct}%)</span>
                  </div>
                  <div className="h-2 bg-rpg-borderDark/50 overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-rpg-borderDark flex justify-between items-center">
            <span className="text-[8px] font-pixel text-rpg-borderMid">SAVINGS RATE</span>
            <span className="font-pixel text-[12px] text-throne-green">
              {data.income_allocation.savings_rate_pct}%
            </span>
          </div>
        </PixelBorder>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[8px] font-body text-rpg-borderMid">
          💱 $1 = Rp {IDR_PER_USD.toLocaleString()} • BTC: {btcPrice > 0 ? formatUsd(btcPrice) : "loading"} via CoinGecko • ATH: {formatUsd(btcATH)}
        </p>
      </div>
    </div>
  );
}
