"use client";

import { useState, useEffect, useCallback } from "react";
import { generals as mockGenerals } from "../lib/mock-data";
import { getGenerals, getMissions, getDailyCosts, getPortfolioSummary, getPortfolioFunds, getPortfolioHoldings, getLedgerSummary } from "../lib/api";
import { mergeGenerals } from "../lib/merge-generals";
import { getGeneralSprite } from "../components/sprites";
import Link from "next/link";
import PixelProgress from "../components/PixelProgress";

const IDR_PER_USD = 16800;
const BTC_ATH = 126000;

function formatUsd(n: number) { return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 }); }
function formatIdr(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}M`;
  return `Rp ${(n / 1000).toFixed(0)}K`;
}

interface BtcData { price: number; change24h: number; fearGreed: number; fearGreedLabel: string; high24h: number; low24h: number; }

export default function Dashboard() {
  const [generals, setGenerals] = useState(mockGenerals);
  const [btc, setBtc] = useState<BtcData | null>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [funds, setFunds] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [costToday, setCostToday] = useState(0);
  const [flash, setFlash] = useState(false);
  const [time, setTime] = useState(new Date());

  // Clock
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // BTC price
  const fetchBtc = useCallback(async () => {
    try {
      const [priceRes, fgRes] = await Promise.allSettled([
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_high_24h=true&include_low_24h=true"),
        fetch("https://api.alternative.me/fng/?limit=1"),
      ]);
      const p = priceRes.status === "fulfilled" ? await priceRes.value.json() : null;
      const fg = fgRes.status === "fulfilled" ? await fgRes.value.json() : null;
      setBtc({
        price: p?.bitcoin?.usd ?? 0,
        change24h: p?.bitcoin?.usd_24h_change ?? 0,
        fearGreed: parseInt(fg?.data?.[0]?.value ?? "50"),
        fearGreedLabel: fg?.data?.[0]?.value_classification ?? "Neutral",
        high24h: p?.bitcoin?.usd_24h_high ?? 0,
        low24h: p?.bitcoin?.usd_24h_low ?? 0,
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    } catch {}
  }, []);

  useEffect(() => {
    fetchBtc();
    const iv = setInterval(fetchBtc, 60000);
    return () => clearInterval(iv);
  }, [fetchBtc]);

  // API data
  useEffect(() => {
    getGenerals().then(d => setGenerals(mergeGenerals(d))).catch(() => {});
    getMissions().then(d => setMissions(d || [])).catch(() => {});
    getDailyCosts().then(d => { const t = (d||[]).reduce((s:number,c:any) => s+parseFloat(c.cost_usd||"0"),0); setCostToday(t); }).catch(() => {});
    getPortfolioSummary().then(setPortfolio).catch(() => {});
    getPortfolioHoldings().then(d => setHoldings(d||[])).catch(() => {});
    getPortfolioFunds().then(d => setFunds(d||[])).catch(() => {});
    // Current month ledger
    const now = new Date();
    const m = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    getLedgerSummary(m).then(setLedger).catch(() => {});
  }, []);

  const btcFromHoldings = holdings.find((h: any) => h.symbol === "BTC");
  const btcHoldings = btcFromHoldings ? parseFloat(btcFromHoldings.quantity) : 0.20251;
  const btcCostBasis = btcFromHoldings ? parseFloat(btcFromHoldings.cost_basis_usd || "0") : 13400;
  const btcValue = btcHoldings * (btc?.price || 0);
  const warChest = funds.find((f:any) => f.fund_type === "war_chest");
  const wedding = funds.find((f:any) => f.fund_type === "wedding");
  const warChestIdr = warChest ? parseFloat(warChest.current_amount_idr) : 0;
  const weddingIdr = wedding ? parseFloat(wedding.current_amount_idr) : 0;
  const weddingTarget = wedding ? parseFloat(wedding.target_amount_idr || "350000000") : 350000000;

  // War chest triggers
  const triggerLevels = btc?.price ? [
    { label: "-30%", target: BTC_ATH * 0.7, pct: 25, color: "#fbbf24" },
    { label: "-40%", target: BTC_ATH * 0.6, pct: 50, color: "#f97316" },
    { label: "-50%", target: BTC_ATH * 0.5, pct: 100, color: "#ef4444" },
  ] : [];

  const dropFromAth = btc?.price ? ((BTC_ATH - btc.price) / BTC_ATH * 100) : 0;

  // Salary cycle
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  // OKU lands 1st of month
  let nextOku = new Date(thisYear, thisMonth + 1, 1);
  if (now.getDate() === 1) nextOku = now; // today!
  const daysToOku = Math.max(0, Math.ceil((nextOku.getTime() - now.getTime()) / 86400000));
  // ForuAI lands ~25th-27th
  let nextForu = new Date(thisYear, thisMonth, 26);
  if (now.getDate() > 27) nextForu = new Date(thisYear, thisMonth + 1, 26);
  const daysToForu = Math.max(0, Math.ceil((nextForu.getTime() - now.getTime()) / 86400000));

  const activeMissions = missions.filter((m:any) => m.status === "active");
  const completedMissions = missions.filter((m:any) => m.status === "completed");

  const fgColor = (btc?.fearGreed ?? 50) <= 25 ? "#ef4444" : (btc?.fearGreed ?? 50) <= 45 ? "#f97316" : (btc?.fearGreed ?? 50) <= 55 ? "#fbbf24" : (btc?.fearGreed ?? 50) <= 75 ? "#a3e635" : "#22c55e";
  const isUp = (btc?.change24h ?? 0) >= 0;

  const wibTime = new Date(time.getTime() + 7 * 60 * 60 * 1000);
  const timeStr = wibTime.toISOString().slice(11, 19);
  const dateStr = wibTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  // Cards P&L
  const cardsCost = portfolio?.cards_cost_usd || 0;
  const cardsCurrent = portfolio?.cards_current_usd || 0;
  const cardsPnl = cardsCurrent - cardsCost;

  return (
    <div className="max-w-full overflow-hidden">
      {/* ═══ TOP BAR — TERMINAL HEADER ═══ */}
      <div className="flex items-center justify-between px-3 py-2 mb-4" style={{
        background: "linear-gradient(90deg, rgba(251,191,36,0.12) 0%, rgba(15,10,25,0.95) 40%, rgba(15,10,25,0.95) 60%, rgba(251,191,36,0.08) 100%)",
        borderBottom: "2px solid #5a4a3a",
      }}>
        <div className="flex items-center gap-3">
          <span className="text-lg">👑</span>
          <div>
            <span className="font-pixel text-[10px] text-throne-gold text-glow-gold">THE DOMINION</span>
            <span className="font-pixel text-[7px] text-rpg-borderMid ml-2">of Lord Zexo</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[12px] text-throne-goldLight tracking-wider">{timeStr}</p>
          <p className="font-pixel text-[7px] text-rpg-borderMid">{dateStr} WIB</p>
        </div>
      </div>

      {/* ═══ ROW 1: BTC PRICE + POSITION + FEAR/GREED ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
        {/* BTC Price — Big hero */}
        <div className="md:col-span-5 p-4" style={{
          background: "linear-gradient(135deg, rgba(247,147,26,0.08) 0%, rgba(15,10,25,0.95) 100%)",
          border: "1px solid #f7931a33",
        }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">₿ BITCOIN / USD</span>
            <span className="font-pixel text-[7px] text-rpg-borderMid">COINGECKO</span>
          </div>
          {btc ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className={`font-mono text-[28px] md:text-[36px] font-bold text-[#f7931a] transition-transform ${flash ? "scale-[1.02]" : ""}`}>
                  ${btc.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className={`font-mono text-[14px] font-bold ${isUp ? "text-green-400" : "text-red-400"}`}>
                  {isUp ? "▲" : "▼"} {Math.abs(btc.change24h).toFixed(2)}%
                </span>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="font-pixel text-[7px] text-rpg-borderMid">H: ${btc.high24h?.toLocaleString(undefined,{maximumFractionDigits:0}) || "—"}</span>
                <span className="font-pixel text-[7px] text-rpg-borderMid">L: ${btc.low24h?.toLocaleString(undefined,{maximumFractionDigits:0}) || "—"}</span>
                <span className="font-pixel text-[7px] text-rpg-borderMid">ATH: ${BTC_ATH.toLocaleString()}</span>
                <span className={`font-pixel text-[7px] ${dropFromAth > 40 ? "text-red-400" : dropFromAth > 25 ? "text-orange-400" : "text-rpg-borderMid"}`}>
                  {dropFromAth > 0 ? `-${dropFromAth.toFixed(1)}%` : "AT ATH"}
                </span>
              </div>
            </>
          ) : (
            <p className="font-pixel text-[10px] text-rpg-borderMid animate-pulse">Loading oracle...</p>
          )}
        </div>

        {/* My BTC Position */}
        <div className="md:col-span-4 p-4" style={{
          background: "linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(15,10,25,0.95) 100%)",
          border: "1px solid #fbbf2433",
        }}>
          <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">MY BTC STACK</span>
          <div className="mt-2">
            <span className="font-mono text-[22px] md:text-[28px] font-bold text-throne-gold">{btcHoldings.toFixed(4)}</span>
            <span className="font-pixel text-[10px] text-rpg-borderMid ml-2">BTC</span>
          </div>
          <div className="flex gap-4 mt-1">
            <span className="font-pixel text-[9px] text-throne-goldLight">{formatUsd(btcValue)}</span>
            <span className="font-pixel text-[7px] text-rpg-borderMid">{formatIdr(btcValue * IDR_PER_USD)}</span>
          </div>
          <div className="flex gap-4 mt-1">
            <span className="font-pixel text-[7px] text-rpg-borderMid">AVG: {formatUsd(btcCostBasis > 0 && btcHoldings > 0 ? btcCostBasis / btcHoldings : 0)}</span>
            <span className={`font-pixel text-[7px] ${btcValue - btcCostBasis >= 0 ? "text-green-400" : "text-red-400"}`}>
              P&L: {btcValue - btcCostBasis >= 0 ? "+" : ""}{formatUsd(btcValue - btcCostBasis)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-pixel text-[7px] text-rpg-borderMid">2030 TARGET: 5 BTC</span>
            <div className="flex-1 h-2 bg-rpg-borderDark rounded-sm overflow-hidden">
              <div className="h-full bg-throne-gold rounded-sm" style={{ width: `${Math.min(btcHoldings/5*100, 100)}%` }} />
            </div>
            <span className="font-pixel text-[7px] text-throne-gold">{(btcHoldings/5*100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Fear & Greed + Drop from ATH */}
        <div className="md:col-span-3 p-4" style={{
          background: "rgba(15,10,25,0.95)",
          border: "1px solid #3a3a5a",
        }}>
          <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">MARKET SENTIMENT</span>
          {btc && (
            <>
              <div className="flex items-center gap-3 mt-3">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1028" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={fgColor} strokeWidth="3"
                      strokeDasharray={`${btc.fearGreed} ${100 - btc.fearGreed}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-[14px] font-bold" style={{ color: fgColor }}>{btc.fearGreed}</span>
                  </div>
                </div>
                <div>
                  <p className="font-pixel text-[10px]" style={{ color: fgColor }}>{btc.fearGreedLabel}</p>
                  <p className="font-pixel text-[7px] text-rpg-borderMid mt-1">FEAR & GREED</p>
                </div>
              </div>
              {/* War chest trigger distances */}
              <div className="mt-3 pt-2" style={{ borderTop: "1px solid #3a3a5a" }}>
                <p className="font-pixel text-[7px] text-rpg-borderMid mb-1">WAR CHEST TRIGGERS</p>
                {triggerLevels.map(t => {
                  const hit = btc.price <= t.target;
                  return (
                    <div key={t.label} className="flex items-center gap-2 mb-0.5">
                      <span className="font-pixel text-[7px] w-8" style={{ color: t.color }}>{t.label}</span>
                      <span className="font-mono text-[7px] text-rpg-borderMid">${t.target.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
                      {hit ? (
                        <span className="font-pixel text-[7px] text-red-400 animate-pulse">🔥 DEPLOY {t.pct}%</span>
                      ) : (
                        <span className="font-pixel text-[6px] text-rpg-borderMid">
                          ${(btc.price - t.target).toLocaleString(undefined,{maximumFractionDigits:0})} away
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══ ROW 2: TREASURY + SALARY CYCLE + CARDS ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
        {/* Treasury */}
        <div className="md:col-span-4 p-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">💰 TREASURY</span>
            <Link href="/portfolio/ledger" className="font-pixel text-[7px] text-throne-gold hover:underline">LEDGER →</Link>
          </div>
          {/* Net Worth */}
          <div className="mb-3">
            <p className="font-pixel text-[7px] text-rpg-borderMid">NET WORTH</p>
            <p className="font-mono text-[18px] font-bold text-throne-gold">{formatUsd(portfolio?.net_worth_usd || 0)}</p>
            <p className="font-pixel text-[7px] text-rpg-borderMid">{formatIdr((portfolio?.net_worth_usd || 0) * IDR_PER_USD)}</p>
          </div>
          {/* Funds */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[8px] text-[#f97316]">⚔️ War Chest</span>
              <span className="font-mono text-[9px] text-rpg-border">{formatIdr(warChestIdr)}</span>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="font-pixel text-[8px] text-[#ec4899]">💒 Wedding</span>
                <span className="font-mono text-[9px] text-rpg-border">{formatIdr(weddingIdr)} / {formatIdr(weddingTarget)}</span>
              </div>
              <PixelProgress value={weddingIdr/weddingTarget*100} color="#ec4899" height={6} segments={20} />
              <p className="font-pixel text-[6px] text-rpg-borderMid mt-0.5">STOPPED — redirected to BTC Blitz</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[8px] text-[#22c55e]">📊 Unrealized P&L</span>
              <span className={`font-mono text-[9px] ${(portfolio?.unrealized_pnl_usd || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                {(portfolio?.unrealized_pnl_usd || 0) >= 0 ? "+" : ""}{formatUsd(portfolio?.unrealized_pnl_usd || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Salary Cycle */}
        <div className="md:col-span-4 p-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">📅 SALARY CYCLE</span>
            <span className="font-pixel text-[7px] text-throne-gold">
              ${(10050).toLocaleString()}/mo
            </span>
          </div>
          {/* OKU */}
          <div className="p-2 mb-2" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[8px] text-[#22c55e]">💼 OKU TRADE</span>
              <span className="font-mono text-[9px] text-[#22c55e]">$6,750</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-pixel text-[7px] text-rpg-borderMid">Lands: 1st of month</span>
              {daysToOku === 0 ? (
                <span className="font-pixel text-[8px] text-green-400 animate-pulse">💰 TODAY</span>
              ) : (
                <span className="font-mono text-[10px] text-rpg-border">{daysToOku}d</span>
              )}
            </div>
          </div>
          {/* ForuAI */}
          <div className="p-2 mb-2" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[8px] text-[#3b82f6]">🔗 FORURAI</span>
              <span className="font-mono text-[9px] text-[#3b82f6]">$2,310 + tokens</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-pixel text-[7px] text-rpg-borderMid">Lands: ~25th-27th</span>
              {daysToForu <= 0 ? (
                <span className="font-pixel text-[8px] text-green-400">✅ LANDED</span>
              ) : (
                <span className="font-mono text-[10px] text-rpg-border">{daysToForu}d</span>
              )}
            </div>
          </div>
          {/* Monthly DCA Status */}
          <div className="p-2" style={{ background: "rgba(247,147,26,0.05)", border: "1px solid rgba(247,147,26,0.15)" }}>
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[8px] text-[#f7931a]">₿ MONTHLY DCA</span>
              <span className="font-pixel text-[7px] text-rpg-borderMid">~Rp 80M/mo</span>
            </div>
            {ledger?.allocations && (() => {
              const dca = ledger.allocations.find((a:any) => a.category === "btc_dca");
              if (!dca) return null;
              const pct = dca.budgeted_idr > 0 ? Math.min(dca.actual_idr / dca.budgeted_idr * 100, 100) : 0;
              return (
                <div className="mt-1">
                  <PixelProgress value={pct} color="#f7931a" height={6} segments={15} />
                  <div className="flex justify-between mt-0.5">
                    <span className="font-pixel text-[6px] text-rpg-borderMid">{formatIdr(dca.actual_idr)} / {formatIdr(dca.budgeted_idr)}</span>
                    <span className="font-pixel text-[6px] text-[#f7931a]">{pct >= 100 ? "✅ DONE" : `${pct.toFixed(0)}%`}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Cards Portfolio */}
        <div className="md:col-span-4 p-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">🃏 CARD COLLECTION</span>
            <Link href="/portfolio/collectibles" className="font-pixel text-[7px] text-throne-gold hover:underline">VIEW →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="font-pixel text-[7px] text-rpg-borderMid">CARDS</p>
              <p className="font-mono text-[16px] text-[#a855f7]">{portfolio?.cards_count || 0}</p>
            </div>
            <div>
              <p className="font-pixel text-[7px] text-rpg-borderMid">TOTAL VALUE</p>
              <p className="font-mono text-[16px] text-throne-goldLight">{formatUsd(cardsCurrent)}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-pixel text-[7px] text-rpg-borderMid">Cost basis</span>
              <span className="font-mono text-[8px] text-rpg-border">{formatUsd(cardsCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-pixel text-[7px] text-rpg-borderMid">Unrealized P&L</span>
              <span className={`font-mono text-[8px] ${cardsPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                {cardsPnl >= 0 ? "+" : ""}{formatUsd(cardsPnl)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-pixel text-[7px] text-rpg-borderMid">ROI</span>
              <span className={`font-mono text-[8px] ${cardsPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                {cardsCost > 0 ? `${(cardsPnl/cardsCost*100).toFixed(1)}%` : "—"}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2" style={{ borderTop: "1px solid #3a3a5a" }}>
            <p className="font-pixel text-[7px] text-rpg-borderMid mb-1">FRANCHISE SPLIT</p>
            <div className="flex gap-1">
              <div className="h-2 bg-[#e11d48] rounded-sm" style={{ flex: 6 }} title="One Piece" />
              <div className="h-2 bg-[#eab308] rounded-sm" style={{ flex: 4 }} title="Pokemon" />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="font-pixel text-[6px] text-[#e11d48]">ONE PIECE</span>
              <span className="font-pixel text-[6px] text-[#eab308]">POKEMON</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ROW 3: GENERALS STATUS + MISSIONS + DOMINION COST ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
        {/* Generals Grid */}
        <div className="md:col-span-8 p-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">⚔️ GENERALS — 7/7 OPERATIONAL</span>
            <span className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2">
            {generals.map((g) => (
              <Link key={g.id} href={`/generals/${g.id}`}>
                <div className="text-center p-2 hover:bg-rpg-borderDark/30 transition-colors cursor-pointer" style={{
                  border: `1px solid ${g.color}22`,
                }}>
                  <div className="flex justify-center mb-1">
                    {getGeneralSprite(g.id, "working", 36) || <span className="text-xl">{g.emoji}</span>}
                  </div>
                  <p className="font-pixel text-[7px] truncate" style={{ color: g.color }}>{g.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-green-500" style={{ boxShadow: "0 0 3px #22c55e" }} />
                    <span className="font-pixel text-[5px] text-green-400">ACTIVE</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dominion Status */}
        <div className="md:col-span-4 p-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
          <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">📊 DOMINION STATUS</span>
          <div className="space-y-3 mt-3">
            <div>
              <div className="flex justify-between">
                <span className="font-pixel text-[7px] text-rpg-borderMid">TODAY&apos;S COST</span>
                <span className="font-mono text-[9px] text-throne-gold">${costToday.toFixed(2)} / $25</span>
              </div>
              <PixelProgress value={costToday/25*100} color="#fbbf24" height={6} segments={15} />
            </div>
            <div className="flex justify-between">
              <span className="font-pixel text-[7px] text-rpg-borderMid">ACTIVE MISSIONS</span>
              <span className="font-mono text-[10px] text-[#3b82f6]">{activeMissions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-pixel text-[7px] text-rpg-borderMid">COMPLETED</span>
              <span className="font-mono text-[10px] text-green-400">{completedMissions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-pixel text-[7px] text-rpg-borderMid">REPORTS</span>
              <span className="font-mono text-[10px] text-[#a855f7]">113+</span>
            </div>
            <div className="flex justify-between">
              <span className="font-pixel text-[7px] text-rpg-borderMid">HEARTBEAT</span>
              <span className="font-pixel text-[8px] text-green-400">● LIVE</span>
            </div>
          </div>
          {/* Quick nav */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2" style={{ borderTop: "1px solid #3a3a5a" }}>
            <Link href="/admin" className="rpg-panel px-2 py-1.5 text-center font-pixel text-[7px] text-rpg-border hover:text-throne-gold transition-colors">
              ⚔️ COMMAND
            </Link>
            <Link href="/reports" className="rpg-panel px-2 py-1.5 text-center font-pixel text-[7px] text-rpg-border hover:text-throne-gold transition-colors">
              📜 INTEL
            </Link>
            <Link href="/portfolio" className="rpg-panel px-2 py-1.5 text-center font-pixel text-[7px] text-rpg-border hover:text-throne-gold transition-colors">
              💰 VAULT
            </Link>
            <Link href="/roundtable" className="rpg-panel px-2 py-1.5 text-center font-pixel text-[7px] text-rpg-border hover:text-throne-gold transition-colors">
              🏰 ROUNDTABLE
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ ROW 4: KEY DATES + FIRE SALE THEORY ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
        {/* Key Dates */}
        <div className="md:col-span-6 p-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
          <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">📅 KEY DATES</span>
          <div className="space-y-2 mt-3">
            {[
              { label: "OKU Salary (Apr)", date: "2026-04-01", icon: "💼", color: "#22c55e" },
              { label: "Japan Card Hunt", date: "2026-05-15", icon: "🇯🇵", color: "#ef4444" },
              { label: "Wedding", date: "2026-11-01", icon: "💒", color: "#ec4899" },
            ].map(evt => {
              const daysLeft = Math.ceil((new Date(evt.date).getTime() - now.getTime()) / 86400000);
              return (
                <div key={evt.label} className="flex items-center justify-between p-2" style={{ borderLeft: `3px solid ${evt.color}`, background: `${evt.color}08` }}>
                  <div className="flex items-center gap-2">
                    <span>{evt.icon}</span>
                    <span className="font-pixel text-[8px]" style={{ color: evt.color }}>{evt.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-rpg-border">{daysLeft}d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fire Sale Theory */}
        <div className="md:col-span-6 p-4" style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(15,10,25,0.95) 100%)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}>
          <span className="font-pixel text-[8px] text-rpg-borderMid tracking-widest">🔥 FIRE SALE THEORY</span>
          <p className="font-body text-[8px] text-rpg-borderMid mt-1 italic">&quot;AI destroys Indonesian middle class by 2030. Be the buyer.&quot;</p>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="text-center">
              <p className="font-pixel text-[7px] text-rpg-borderMid">TARGET</p>
              <p className="font-mono text-[14px] text-[#f7931a]">5-12</p>
              <p className="font-pixel text-[6px] text-rpg-borderMid">BTC by 2030</p>
            </div>
            <div className="text-center">
              <p className="font-pixel text-[7px] text-rpg-borderMid">NET WORTH</p>
              <p className="font-mono text-[14px] text-throne-gold">Rp 26B+</p>
              <p className="font-pixel text-[6px] text-rpg-borderMid">at 5 BTC × $300K</p>
            </div>
            <div className="text-center">
              <p className="font-pixel text-[7px] text-rpg-borderMid">PROGRESS</p>
              <p className="font-mono text-[14px] text-green-400">{(btcHoldings/5*100).toFixed(1)}%</p>
              <p className="font-pixel text-[6px] text-rpg-borderMid">to minimum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
