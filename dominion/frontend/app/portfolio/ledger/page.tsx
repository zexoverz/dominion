"use client";

import { useState, useEffect } from "react";
import { getLedgerSummary } from "../../../lib/api";
import Link from "next/link";
import PixelProgress from "../../../components/PixelProgress";

const CATEGORY_META: Record<string, { icon: string; color: string; label: string }> = {
  btc_dca: { icon: "₿", color: "#f7931a", label: "BTC DCA" },
  war_chest: { icon: "⚔️", color: "#f97316", label: "War Chest" },
  wedding: { icon: "💒", color: "#ec4899", label: "Wedding Fund" },
  health: { icon: "💪", color: "#22c55e", label: "Health & Fitness" },
  keiko: { icon: "💛", color: "#06b6d4", label: "Keiko (Gold)" },
  expenses: { icon: "🏠", color: "#6b7280", label: "Living Expenses" },
  cards: { icon: "🃏", color: "#a855f7", label: "Card Collecting" },
  car: { icon: "🚗", color: "#3b82f6", label: "Zekrom (Car)" },
  other: { icon: "📦", color: "#94a3b8", label: "Other" },
  income_oku: { icon: "💼", color: "#22c55e", label: "OKU Trade" },
  income_forurai: { icon: "🔗", color: "#3b82f6", label: "ForuAI" },
  income_freelance: { icon: "🎯", color: "#f59e0b", label: "Freelance" },
  token_sale: { icon: "🪙", color: "#eab308", label: "Token Sale" },
  freelance: { icon: "🎯", color: "#f59e0b", label: "Freelance" },
};

function formatIDR(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `Rp ${(n / 1000).toFixed(0)}K`;
  return `Rp ${n}`;
}

function formatUSD(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function LedgerPage() {
  const [data, setData] = useState<any>(null);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLedgerSummary(month)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [month]);

  const prevMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 2, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };
  const nextMonth = () => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m, 1);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = new Date(Number(month.split("-")[0]), Number(month.split("-")[1]) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Link href="/portfolio" className="font-pixel text-[9px] text-rpg-borderMid hover:text-throne-gold min-h-[44px] flex items-center gap-2">
          <span className="rpg-cursor">▶</span> VAULT
        </Link>
        <span className="text-rpg-borderMid">/</span>
        <span className="font-pixel text-[9px] text-throne-gold">MAMMON&apos;S LEDGER</span>
      </div>

      {/* Title */}
      <div className="rpg-panel p-4 mb-6 text-center">
        <div className="text-3xl mb-2">💰</div>
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-1">MAMMON&apos;S FINANCIAL LEDGER</h1>
        <p className="font-body text-[9px] text-rpg-borderMid">Monthly allocation tracking • Budget vs Actual</p>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={prevMonth} className="font-pixel text-[10px] text-rpg-border hover:text-throne-gold px-3 py-2 rpg-panel min-h-[44px]">
          ◀ PREV
        </button>
        <div className="rpg-panel px-6 py-3 text-center min-w-[200px]">
          <p className="font-pixel text-[12px] text-throne-goldLight text-glow-gold">{monthLabel}</p>
        </div>
        <button onClick={nextMonth} className="font-pixel text-[10px] text-rpg-border hover:text-throne-gold px-3 py-2 rpg-panel min-h-[44px]">
          NEXT ▶
        </button>
      </div>

      {loading && (
        <div className="rpg-panel p-6 text-center">
          <p className="font-pixel text-[10px] text-rpg-borderMid animate-pulse">💰 MAMMON is counting gold...</p>
        </div>
      )}

      {!loading && !data && (
        <div className="rpg-panel p-6 text-center">
          <p className="font-pixel text-[10px] text-rpg-borderMid">No ledger data for {monthLabel}</p>
          <p className="font-body text-[9px] text-rpg-borderMid mt-2">MAMMON hasn&apos;t seeded this month yet.</p>
        </div>
      )}

      {!loading && data && (
        <>
          {/* Balances Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="rpg-panel p-3 text-center">
              <p className="font-pixel text-[7px] text-rpg-borderMid">₿ BTC HOLDINGS</p>
              <p className="font-pixel text-[14px] text-[#f7931a] text-rpg-shadow">{data.balances?.btc?.toFixed(4) || "0"}</p>
            </div>
            <div className="rpg-panel p-3 text-center">
              <p className="font-pixel text-[7px] text-rpg-borderMid">⚔️ WAR CHEST</p>
              <p className="font-pixel text-[14px] text-[#f97316] text-rpg-shadow">{formatIDR(data.balances?.war_chest_idr || 0)}</p>
            </div>
            <div className="rpg-panel p-3 text-center">
              <p className="font-pixel text-[7px] text-rpg-borderMid">💒 WEDDING FUND</p>
              <p className="font-pixel text-[14px] text-[#ec4899] text-rpg-shadow">{formatIDR(data.balances?.wedding_idr || 0)}</p>
            </div>
          </div>

          {/* BTC Blitz Banner */}
          {data.budget?.btc_blitz_active && (
            <div className="mb-6 p-3 text-center" style={{ border: "2px solid #f7931a", background: "rgba(247,147,26,0.08)" }}>
              <p className="font-pixel text-[10px] text-[#f7931a]">⚡ BTC BLITZ MODE ACTIVE ⚡</p>
              <p className="font-body text-[8px] text-rpg-borderMid mt-1">Wedding fund paused → all redirected to BTC accumulation</p>
            </div>
          )}

          {/* Income Section */}
          <div className="rpg-panel p-4 mb-6">
            <h2 className="font-pixel text-[10px] text-[#22c55e] mb-3 text-rpg-shadow">📥 INCOME</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="p-2 text-center" style={{ border: "1px solid #3a3a5a", background: "rgba(16,16,42,0.5)" }}>
                <p className="font-pixel text-[7px] text-rpg-borderMid">💼 OKU TRADE</p>
                <p className="font-pixel text-[11px] text-[#22c55e]">{formatUSD(6750)}</p>
              </div>
              <div className="p-2 text-center" style={{ border: "1px solid #3a3a5a", background: "rgba(16,16,42,0.5)" }}>
                <p className="font-pixel text-[7px] text-rpg-borderMid">🔗 FORURAI CASH</p>
                <p className="font-pixel text-[11px] text-[#3b82f6]">{formatUSD(2310)}</p>
              </div>
              <div className="p-2 text-center" style={{ border: "1px solid #3a3a5a", background: "rgba(16,16,42,0.5)" }}>
                <p className="font-pixel text-[7px] text-rpg-borderMid">🪙 FORURAI TOKENS</p>
                <p className="font-pixel text-[11px] text-[#eab308]">{formatUSD(990)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2" style={{ borderTop: "1px solid #3a3a5a" }}>
              <span className="font-pixel text-[8px] text-rpg-borderMid">TOTAL MONTHLY INCOME</span>
              <span className="font-pixel text-[12px] text-[#22c55e]">{formatUSD(10050)} / mo</span>
            </div>
          </div>

          {/* Allocations — Budget vs Actual */}
          <div className="rpg-panel p-4 mb-6">
            <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📊 ALLOCATIONS — BUDGET vs ACTUAL</h2>
            <div className="flex flex-col gap-4">
              {(data.allocations || []).map((alloc: any) => {
                const meta = CATEGORY_META[alloc.category] || { icon: "📦", color: "#94a3b8", label: alloc.category };
                const budgetedIdr = alloc.budgeted_idr || 0;
                const actualIdr = alloc.actual_idr || 0;
                const pct = budgetedIdr > 0 ? Math.min((actualIdr / budgetedIdr) * 100, 100) : 0;
                const isOver = actualIdr > budgetedIdr && budgetedIdr > 0;
                const isDone = pct >= 100;
                const isSkipped = budgetedIdr === 0;

                return (
                  <div key={alloc.category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{meta.icon}</span>
                        <span className="font-pixel text-[9px]" style={{ color: meta.color }}>{alloc.label}</span>
                        {isDone && <span className="font-pixel text-[7px] text-[#22c55e]">✅</span>}
                        {isSkipped && <span className="font-pixel text-[7px] text-rpg-borderMid">(skipped)</span>}
                      </div>
                      <div className="text-right">
                        <span className="font-pixel text-[8px] text-rpg-border">
                          {formatIDR(actualIdr)} / {formatIDR(budgetedIdr)}
                        </span>
                        {alloc.btc_acquired > 0 && (
                          <span className="font-pixel text-[7px] text-[#f7931a] ml-2">
                            +{alloc.btc_acquired.toFixed(4)} ₿
                          </span>
                        )}
                      </div>
                    </div>
                    <PixelProgress
                      value={isSkipped ? 0 : pct}
                      color={isOver ? "#ef4444" : isDone ? "#22c55e" : meta.color}
                      height={10}
                      segments={20}
                    />
                    {alloc.note && (
                      <p className="font-body text-[7px] text-rpg-borderMid mt-0.5 ml-6">{alloc.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log */}
          <div className="rpg-panel p-4 mb-6">
            <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📜 FINANCIAL LOG — {monthLabel.toUpperCase()}</h2>
            {(!data.all_entries || data.all_entries.length === 0) ? (
              <p className="font-body text-[9px] text-rpg-borderMid italic text-center py-4">
                No entries logged yet for {monthLabel}. MAMMON awaits transactions.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {data.all_entries.map((entry: any) => {
                  const meta = CATEGORY_META[entry.category] || { icon: "📦", color: "#94a3b8", label: entry.category };
                  const isIncome = entry.direction === "in";
                  const isDone = entry.status === "done";
                  const isPlanned = entry.status === "planned";
                  const isSkipped = entry.status === "skipped";

                  return (
                    <div
                      key={entry.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 p-2 md:p-3"
                      style={{
                        borderLeft: `3px solid ${isDone ? meta.color : isSkipped ? "#64748b" : "#4a4a6a"}`,
                        background: "rgba(16,16,42,0.5)",
                        opacity: isSkipped ? 0.5 : 1,
                      }}
                    >
                      <span className="text-sm flex-shrink-0">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-pixel text-[8px] text-throne-goldLight break-words">{entry.description}</span>
                        {entry.notes && (
                          <p className="font-body text-[7px] text-rpg-borderMid mt-0.5">{entry.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2 items-center flex-shrink-0">
                        <span className="font-pixel text-[8px]" style={{ color: isIncome ? "#22c55e" : meta.color }}>
                          {isIncome ? "+" : "-"}{formatUSD(parseFloat(entry.amount_usd) || 0)}
                        </span>
                        {entry.btc_amount && parseFloat(entry.btc_amount) > 0 && (
                          <span className="font-pixel text-[7px] text-[#f7931a]">
                            {parseFloat(entry.btc_amount).toFixed(4)}₿
                          </span>
                        )}
                        <span
                          className="font-pixel text-[7px] px-1.5 py-0.5"
                          style={{
                            color: isDone ? "#22c55e" : isPlanned ? "#fbbf24" : "#64748b",
                            border: `1px solid ${isDone ? "#22c55e33" : isPlanned ? "#fbbf2433" : "#64748b33"}`,
                            background: isDone ? "#22c55e11" : isPlanned ? "#fbbf2411" : "#64748b11",
                          }}
                        >
                          {isDone ? "✅ DONE" : isPlanned ? "⏳ PLANNED" : "⏭️ SKIP"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DCA History for this month */}
          {data.dca_log && data.dca_log.length > 0 && (
            <div className="rpg-panel p-4 mb-6">
              <h2 className="font-pixel text-[10px] text-[#f7931a] mb-3 text-rpg-shadow">₿ DCA EXECUTIONS</h2>
              {data.dca_log.map((dca: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2" style={{ borderLeft: "3px solid #f7931a", background: "rgba(247,147,26,0.05)" }}>
                  <span className="text-lg">₿</span>
                  <div className="flex-1">
                    <span className="font-pixel text-[8px] text-throne-goldLight">
                      +{parseFloat(dca.btc_acquired).toFixed(4)} BTC @ {formatUSD(parseFloat(dca.btc_price_usd))}
                    </span>
                    {dca.notes && <p className="font-body text-[7px] text-rpg-borderMid">{dca.notes}</p>}
                  </div>
                  <span className="font-pixel text-[8px] text-rpg-borderMid">{formatUSD(parseFloat(dca.amount_usd))}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer Nav */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/portfolio" className="rpg-panel px-4 py-3 font-pixel text-[8px] text-rpg-border hover:text-throne-gold min-h-[44px] flex items-center">💰 VAULT</Link>
        <Link href="/portfolio/analytics" className="rpg-panel px-4 py-3 font-pixel text-[8px] text-rpg-border hover:text-throne-gold min-h-[44px] flex items-center">📊 ANALYTICS</Link>
        <Link href="/portfolio/collectibles" className="rpg-panel px-4 py-3 font-pixel text-[8px] text-rpg-border hover:text-throne-gold min-h-[44px] flex items-center">🃏 CARDS</Link>
        <Link href="/portfolio/masterplan" className="rpg-panel px-4 py-3 font-pixel text-[8px] text-rpg-border hover:text-throne-gold min-h-[44px] flex items-center">📋 MASTERPLAN</Link>
      </div>
    </div>
  );
}
