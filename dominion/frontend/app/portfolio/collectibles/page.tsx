"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import PixelBorder from "../../../components/PixelBorder";
import PixelProgress from "../../../components/PixelProgress";
import { getPortfolioCards, getPortfolioCardPrices, markCardSold, getPortfolioRealizedGains } from "../../../lib/api";

const IDR_PER_USD = 16400;
const OP_BUDGET_CAP_IDR = 200_000_000;
const OP_SPENT_IDR = 26_500_000;

type SortKey = "roi" | "value" | "cost" | "grade" | "name";
type Card = {
  id: string;
  franchise: string;
  card_name: string;
  card_code: string;
  set_name: string;
  rarity: string;
  grade: string;
  grading_company: string;
  language: string;
  cost_usd: string;
  cost_idr: string;
  current_price_usd: string | null;
  current_price_idr: string | null;
  image_url: string | null;
  date_added: string;
  notes: string | null;
  metadata: { price_url?: string; ebay_url?: string; snkr_url?: string; yuyu_tei_jpy?: number; snkr_dunk_jpy?: number; slab_price_usd?: number } | null;
  price_source: string | null;
  status: 'active' | 'listed' | 'sold' | 'keeper';
  sold_price_usd: string | null;
  sold_price_idr: string | null;
  sold_date: string | null;
};

function formatUsd(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function formatIdr(n: number) {
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return "Rp " + (n / 1_000).toFixed(0) + "K";
  return "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

function getCardCostUsd(c: Card): number {
  const usd = parseFloat(c.cost_usd) || 0;
  if (usd > 0) return usd;
  const idr = parseFloat(c.cost_idr) || 0;
  return idr / IDR_PER_USD;
}

function getCardCurrentUsd(c: Card): number {
  const usd = parseFloat(c.current_price_usd || "0");
  if (usd > 0) return usd;
  const idr = parseFloat(c.current_price_idr || "0");
  if (idr > 0) return idr / IDR_PER_USD;
  return getCardCostUsd(c); // fallback to cost
}

function getROI(c: Card): number {
  const cost = getCardCostUsd(c);
  const current = getCardCurrentUsd(c);
  if (cost === 0) return 0;
  return ((current - cost) / cost) * 100;
}

function gradeBadgeColor(grade: string): string {
  if (grade?.includes("10")) return "bg-throne-gold/20 text-throne-gold border-throne-gold/40";
  if (grade?.includes("9.5")) return "bg-throne-green/20 text-throne-green border-throne-green/40";
  if (grade?.includes("9")) return "bg-throne-blue/20 text-throne-blue border-throne-blue/40";
  if (grade === "Raw") return "bg-rpg-borderDark/30 text-rpg-border border-rpg-borderMid/40";
  return "bg-rpg-borderDark/30 text-rpg-border border-rpg-borderMid/40";
}

function franchiseIcon(franchise: string): string {
  return franchise === "one_piece" ? "🏴‍☠️" : "⚡";
}

export default function CollectiblesPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"one_piece" | "pokemon">("one_piece");
  const [sortBy, setSortBy] = useState<SortKey>("roi");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [realizedGains, setRealizedGains] = useState<any>(null);

  const loadCards = useCallback(() => {
    setLoading(true);
    Promise.all([
      getPortfolioCards(),
      getPortfolioRealizedGains().catch(() => null),
    ])
      .then(([cardsData, gainsData]) => {
        setCards(cardsData);
        setRealizedGains(gainsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const filtered = useMemo(() => {
    let list = cards.filter((c) => c.franchise === tab);

    list.sort((a, b) => {
      let va: number, vb: number;
      switch (sortBy) {
        case "roi": va = getROI(a); vb = getROI(b); break;
        case "value": va = getCardCurrentUsd(a); vb = getCardCurrentUsd(b); break;
        case "cost": va = getCardCostUsd(a); vb = getCardCostUsd(b); break;
        case "name": return sortDir === "asc" ? a.card_name.localeCompare(b.card_name) : b.card_name.localeCompare(a.card_name);
        case "grade":
          va = a.grade?.includes("10") ? 3 : a.grade?.includes("9") ? 2 : 1;
          vb = b.grade?.includes("10") ? 3 : b.grade?.includes("9") ? 2 : 1;
          break;
        default: va = 0; vb = 0;
      }
      return sortDir === "desc" ? vb - va : va - vb;
    });

    return list;
  }, [cards, tab, sortBy, sortDir]);

  const summary = useMemo(() => {
    const list = cards.filter((c) => c.franchise === tab);
    const totalCost = list.reduce((s, c) => s + getCardCostUsd(c), 0);
    const totalCurrent = list.reduce((s, c) => s + getCardCurrentUsd(c), 0);
    const totalROI = totalCost > 0 ? ((totalCurrent - totalCost) / totalCost) * 100 : 0;
    return { count: list.length, totalCost, totalCurrent, totalROI };
  }, [cards, tab]);

  if (loading) {
    return (
      <div className="text-center mt-20">
        <p className="font-pixel text-[12px] text-throne-gold animate-blink">LOADING INVENTORY...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Title */}
      <div className="rpg-panel p-4 text-center">
        <h1 className="font-pixel text-[14px] md:text-[18px] text-throne-gold text-glow-gold mb-1">
          🃏 CARD VAULT
        </h1>
        <p className="text-[9px] font-body text-rpg-borderMid">
          Collectible Card Inventory — Deck Builder View
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
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-throne-gold bg-rpg-borderDark/50 border border-throne-gold/30">
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

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("one_piece")}
          className={`rpg-panel px-4 py-2 font-pixel text-[9px] transition-colors ${
            tab === "one_piece" ? "text-throne-gold bg-rpg-borderDark/50" : "text-rpg-border hover:text-throne-gold"
          }`}
        >
          🏴‍☠️ ONE PIECE ({cards.filter((c) => c.franchise === "one_piece").length})
        </button>
        <button
          onClick={() => setTab("pokemon")}
          className={`rpg-panel px-4 py-2 font-pixel text-[9px] transition-colors ${
            tab === "pokemon" ? "text-throne-gold bg-rpg-borderDark/50" : "text-rpg-border hover:text-throne-gold"
          }`}
        >
          ⚡ POKEMON ({cards.filter((c) => c.franchise === "pokemon").length})
        </button>
      </div>

      {/* Summary Bar */}
      <PixelBorder className="p-3">
        <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
          <div>
            <p className="text-[7px] font-pixel text-rpg-borderMid">INVESTED</p>
            <p className="font-pixel text-[11px] text-rpg-border">{formatUsd(summary.totalCost)}</p>
            <p className="text-[9px] font-body text-rpg-borderMid">{formatIdr(summary.totalCost * IDR_PER_USD)}</p>
          </div>
          <div>
            <p className="text-[7px] font-pixel text-rpg-borderMid">CURRENT VALUE</p>
            <p className="font-pixel text-[11px] text-throne-goldLight">{formatUsd(summary.totalCurrent)}</p>
            <p className="text-[9px] font-body text-rpg-borderMid">{formatIdr(summary.totalCurrent * IDR_PER_USD)}</p>
          </div>
          <div>
            <p className="text-[7px] font-pixel text-rpg-borderMid">TOTAL ROI</p>
            <p className={`font-pixel text-[11px] ${summary.totalROI >= 0 ? "text-throne-green" : "text-throne-red"}`}>
              {summary.totalROI >= 0 ? "+" : ""}{summary.totalROI.toFixed(1)}%
            </p>
            <p className={`text-[9px] font-body ${summary.totalROI >= 0 ? "text-throne-green" : "text-throne-red"}`}>
              {summary.totalCurrent - summary.totalCost >= 0 ? "+" : ""}{formatUsd(summary.totalCurrent - summary.totalCost)}
            </p>
          </div>
          <div>
            <p className="text-[7px] font-pixel text-rpg-borderMid">CARDS</p>
            <p className="font-pixel text-[11px] text-rpg-border">{summary.count}</p>
          </div>
        </div>
      </PixelBorder>

      {/* OP Budget Progress (One Piece only) */}
      {tab === "one_piece" && (
        <PixelBorder className="p-3">
          <div className="flex justify-between mb-1">
            <span className="text-[8px] font-pixel text-rpg-borderMid">OP BUDGET</span>
            <span className="font-pixel text-[9px] text-rpg-border">
              {formatIdr(OP_SPENT_IDR)} / {formatIdr(OP_BUDGET_CAP_IDR)}
            </span>
          </div>
          <PixelProgress
            value={OP_SPENT_IDR}
            max={OP_BUDGET_CAP_IDR}
            color="#fbbf24"
            segments={20}
          />
          <p className="text-[8px] font-body text-rpg-borderMid mt-1 text-right">
            {((OP_SPENT_IDR / OP_BUDGET_CAP_IDR) * 100).toFixed(1)}% of cap used • {formatIdr(OP_BUDGET_CAP_IDR - OP_SPENT_IDR)} remaining
          </p>
        </PixelBorder>
      )}

      {/* Realized Gains Summary */}
      {realizedGains && realizedGains.total_sold > 0 && (
        <PixelBorder className="p-3">
          <p className="text-[8px] font-pixel text-rpg-borderMid mb-2">💰 REALIZED GAINS</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">REVENUE</p>
              <p className="font-pixel text-[11px] text-throne-goldLight">{formatUsd(realizedGains.total_revenue_usd)}</p>
            </div>
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">COST BASIS</p>
              <p className="font-pixel text-[11px] text-rpg-border">{formatUsd(realizedGains.total_cost_usd)}</p>
            </div>
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">PROFIT</p>
              <p className={`font-pixel text-[11px] ${realizedGains.total_profit_usd >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                {realizedGains.total_profit_usd >= 0 ? "+" : ""}{formatUsd(realizedGains.total_profit_usd)}
                {" "}({realizedGains.total_profit_pct >= 0 ? "+" : ""}{realizedGains.total_profit_pct.toFixed(1)}%)
              </p>
            </div>
            <div>
              <p className="text-[7px] font-pixel text-rpg-borderMid">CARDS SOLD</p>
              <p className="font-pixel text-[11px] text-rpg-border">{realizedGains.total_sold}</p>
            </div>
          </div>
        </PixelBorder>
      )}

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[8px] font-pixel text-rpg-borderMid">SORT:</span>
        {(["roi", "value", "cost", "grade", "name"] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => {
              if (sortBy === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
              else { setSortBy(key); setSortDir("desc"); }
            }}
            className={`rpg-panel px-2 py-1 font-pixel text-[7px] ${
              sortBy === key ? "text-throne-gold" : "text-rpg-border hover:text-throne-gold"
            }`}
          >
            {key.toUpperCase()} {sortBy === key ? (sortDir === "desc" ? "▼" : "▲") : ""}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((card) => {
          const cost = getCardCostUsd(card);
          const current = getCardCurrentUsd(card);
          const roi = getROI(card);
          const hasPrice = parseFloat(card.current_price_usd || "0") > 0 || parseFloat(card.current_price_idr || "0") > 0;

          return (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="rpg-panel p-3 cursor-pointer hover:bg-rpg-borderDark/30 transition-colors group"
            >
              {/* Card Image */}
              <div className="w-full h-32 bg-rpg-borderDark/40 border border-rpg-borderMid/30 mb-2 flex items-center justify-center overflow-hidden relative">
                {card.image_url ? (
                  <img
                    src={card.image_url}
                    alt={card.card_name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-3xl opacity-50">{franchiseIcon(card.franchise)}</span>
                )}
                {card.status === 'sold' && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[7px] font-pixel px-1.5 py-0.5 border border-red-400/50 z-10">
                    🔴 SOLD
                  </span>
                )}
                {card.status === 'listed' && (
                  <span className="absolute top-1 right-1 bg-yellow-600 text-white text-[7px] font-pixel px-1.5 py-0.5 border border-yellow-400/50 z-10">
                    🟡 LISTED
                  </span>
                )}
                {card.status === 'keeper' && (
                  <span className="absolute top-1 right-1 bg-purple-600 text-white text-[7px] font-pixel px-1.5 py-0.5 border border-purple-400/50 z-10">
                    🏆 KEEPER
                  </span>
                )}
                {card.language && card.status !== 'sold' && card.status !== 'listed' && card.status !== 'keeper' && (
                  <span className="absolute top-1 right-1 bg-black/70 text-[7px] font-pixel px-1 py-0.5 text-throne-gold border border-rpg-borderMid/50">
                    {card.language}
                  </span>
                )}
              </div>

              {/* Card Name */}
              <p className="font-pixel text-[8px] text-throne-goldLight leading-tight mb-1 group-hover:text-throne-gold truncate">
                {card.card_name}
              </p>
              <p className="text-[8px] font-body text-rpg-borderMid mb-2">{card.card_code}</p>

              {/* Grade Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 text-[7px] font-pixel border ${gradeBadgeColor(card.grade)}`}>
                  {card.grade}
                </span>
                {card.rarity && (
                  <span className="text-[7px] font-body text-rpg-borderMid">{card.rarity}</span>
                )}
              </div>

              {/* Cost vs Current */}
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="text-[7px] font-pixel text-rpg-borderMid">COST</p>
                  <p className="text-[9px] font-body text-rpg-border">{formatUsd(cost)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] font-pixel text-rpg-borderMid">NOW</p>
                  <p className="text-[9px] font-body text-throne-goldLight">
                    {hasPrice ? formatUsd(current) : "—"}
                  </p>
                </div>
              </div>

              {/* ROI + Link */}
              <div className="mt-2 flex justify-between items-center">
                {(card.metadata?.price_url || card.metadata?.ebay_url || card.metadata?.snkr_url) ? (
                  <a
                    href={card.metadata?.price_url || card.metadata?.snkr_url || card.metadata?.ebay_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-[7px] font-pixel ${
                      card.metadata?.snkr_url ? 'text-green-400/60 hover:text-green-400' :
                      card.metadata?.ebay_url && !card.metadata?.price_url ? 'text-blue-400/60 hover:text-blue-400' :
                      'text-throne-gold/60 hover:text-throne-gold'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                    title={card.metadata?.price_url ? 'Yuyu-tei' : card.metadata?.snkr_url ? 'SNKRDUNK' : 'eBay Sold'}
                  >
                    {card.metadata?.price_url ? '🏪' : card.metadata?.snkr_url ? '👟' : '🔍'}
                  </a>
                ) : <span />}
                {hasPrice && (
                  <span className={`font-pixel text-[10px] ${roi >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                    {roi >= 0 ? "+" : ""}{roi.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onRefresh={loadCards}
        />
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[8px] font-body text-rpg-borderMid">
          Price sources: Yuyu-tei • SNKR Dunk • eBay (NO TCGPlayer) • $1 = Rp {IDR_PER_USD.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ═══ Price History SVG Chart ═══
function PriceHistoryChart({ prices }: { prices: { price_usd: string; recorded_at: string }[] }) {
  if (prices.length < 2) {
    return (
      <div className="w-full h-24 bg-rpg-borderDark/30 border border-rpg-borderMid/20 flex items-center justify-center">
        <span className="text-[8px] font-pixel text-rpg-borderMid">
          {prices.length === 0 ? "NO PRICE DATA YET" : "NEED 2+ DATA POINTS"}
        </span>
      </div>
    );
  }

  const values = prices.map((p) => parseFloat(p.price_usd));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const W = 400;
  const H = 100;
  const PAD = 10;
  const chartW = W - PAD * 2;
  const chartH = H - PAD * 2;

  const points = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * chartW;
    const y = PAD + chartH - ((v - min) / range) * chartH;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const areaPoints = `${PAD},${PAD + chartH} ${polyline} ${PAD + chartW},${PAD + chartH}`;
  const isUp = values[values.length - 1] >= values[0];
  const strokeColor = isUp ? "#22c55e" : "#ef4444";
  const fillColor = isUp ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)";

  const firstDate = new Date(prices[0].recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const lastDate = new Date(prices[prices.length - 1].recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24" preserveAspectRatio="none">
        {/* Grid lines */}
        <line x1={PAD} y1={PAD} x2={PAD + chartW} y2={PAD} stroke="#333" strokeWidth="0.5" strokeDasharray="4" />
        <line x1={PAD} y1={PAD + chartH / 2} x2={PAD + chartW} y2={PAD + chartH / 2} stroke="#333" strokeWidth="0.5" strokeDasharray="4" />
        <line x1={PAD} y1={PAD + chartH} x2={PAD + chartW} y2={PAD + chartH} stroke="#333" strokeWidth="0.5" strokeDasharray="4" />
        {/* Fill area */}
        <polygon points={areaPoints} fill={fillColor} />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* End dot */}
        {(() => {
          const lastPt = points[points.length - 1].split(",");
          return <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={strokeColor} />;
        })()}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[7px] font-body text-rpg-borderMid">{firstDate}</span>
        <span className="text-[7px] font-body text-rpg-borderMid">
          ${min.toFixed(2)} — ${max.toFixed(2)}
        </span>
        <span className="text-[7px] font-body text-rpg-borderMid">{lastDate}</span>
      </div>
    </div>
  );
}

// ═══ Card Detail Modal ═══
function CardDetailModal({ card, onClose, onRefresh }: { card: Card; onClose: () => void; onRefresh: () => void }) {
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [showSoldForm, setShowSoldForm] = useState(false);
  const [soldPriceIdr, setSoldPriceIdr] = useState("");
  const [soldDate, setSoldDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingPrices(true);
    getPortfolioCardPrices(card.id, 90)
      .then(setPriceHistory)
      .catch(() => setPriceHistory([]))
      .finally(() => setLoadingPrices(false));
  }, [card.id]);

  const cost = getCardCostUsd(card);
  const current = getCardCurrentUsd(card);
  const roi = getROI(card);
  const pnl = current - cost;
  const hasPrice = parseFloat(card.current_price_usd || "0") > 0 || parseFloat(card.current_price_idr || "0") > 0;
  const snkrDunkSearchUrl = `https://snkrdunk.com/v3/search?keyword=${encodeURIComponent(card.card_code)}`;
  const snkrDunkUrl = card.metadata?.snkr_url || snkrDunkSearchUrl;
  const lastUpdate = (card.metadata as any)?.last_price_update;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="rpg-panel p-0 max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          border: "3px solid #d4a017",
          boxShadow: "0 0 20px rgba(212,160,23,0.3), inset 0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-4 pb-2 border-b border-rpg-borderDark">
          <div className="flex-1 min-w-0">
            <h2 className="font-pixel text-[12px] text-throne-gold text-glow-gold mb-1 truncate">{card.card_name}</h2>
            <p className="text-[9px] font-body text-rpg-borderMid">
              {card.card_code} • {card.set_name} • {card.rarity}
            </p>
          </div>
          <button
            onClick={onClose}
            className="font-pixel text-[12px] text-rpg-border hover:text-throne-gold ml-2 leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Card Image */}
          <div className="w-full h-56 bg-rpg-borderDark/40 border border-rpg-borderMid/30 flex items-center justify-center overflow-hidden relative">
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={card.card_name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-5xl opacity-50">{franchiseIcon(card.franchise)}</span>
            )}
            {card.language && (
              <span className="absolute top-2 right-2 bg-black/80 text-[9px] font-pixel px-2 py-1 text-throne-gold border border-rpg-borderMid/50">
                {card.language}
              </span>
            )}
            <span className={`absolute top-2 left-2 px-2 py-0.5 text-[8px] font-pixel border ${gradeBadgeColor(card.grade)}`}>
              {card.grade}{card.grading_company ? ` (${card.grading_company})` : ""}
            </span>
          </div>

          {/* Card Info Grid */}
          <div className="grid grid-cols-2 gap-2">
            <DetailRow label="Franchise" value={card.franchise === "one_piece" ? "🏴‍☠️ One Piece" : "⚡ Pokemon"} />
            <DetailRow label="Set" value={card.set_name || "—"} />
            <DetailRow label="Rarity" value={card.rarity || "—"} />
            <DetailRow label="Grade" value={`${card.grade}${card.grading_company ? ` (${card.grading_company})` : ""}`} />
          </div>

          {/* Price Comparison */}
          <div className="border border-rpg-borderMid/30 bg-rpg-borderDark/20 p-3">
            <p className="text-[8px] font-pixel text-rpg-borderMid mb-2">💰 PRICE ANALYSIS</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[7px] font-pixel text-rpg-borderMid">PURCHASE PRICE</p>
                <p className="font-pixel text-[11px] text-rpg-border">{formatUsd(cost)}</p>
                <p className="text-[8px] font-body text-rpg-borderMid">{formatIdr(cost * IDR_PER_USD)}</p>
              </div>
              <div className="text-right">
                <p className="text-[7px] font-pixel text-rpg-borderMid">CURRENT PRICE</p>
                <p className="font-pixel text-[11px] text-throne-goldLight">
                  {hasPrice ? formatUsd(current) : "—"}
                </p>
                {hasPrice && (
                  <p className="text-[8px] font-body text-rpg-borderMid">{formatIdr(current * IDR_PER_USD)}</p>
                )}
              </div>
            </div>
            {hasPrice && (
              <div className="mt-2 pt-2 border-t border-rpg-borderDark flex justify-between items-center">
                <div>
                  <span className="text-[7px] font-pixel text-rpg-borderMid">P&L: </span>
                  <span className={`font-pixel text-[10px] ${pnl >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                    {pnl >= 0 ? "+" : ""}{formatUsd(pnl)}
                  </span>
                </div>
                <span className={`font-pixel text-[12px] ${roi >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                  {roi >= 0 ? "▲" : "▼"} {roi >= 0 ? "+" : ""}{roi.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Price History Chart */}
          <div className="border border-rpg-borderMid/30 bg-rpg-borderDark/20 p-3">
            <p className="text-[8px] font-pixel text-rpg-borderMid mb-2">📈 PRICE HISTORY (90 DAYS)</p>
            {loadingPrices ? (
              <div className="w-full h-24 flex items-center justify-center">
                <span className="text-[8px] font-pixel text-rpg-borderMid animate-blink">LOADING...</span>
              </div>
            ) : (
              <PriceHistoryChart prices={priceHistory} />
            )}
          </div>

          {/* Links */}
          <div className="border border-rpg-borderMid/30 bg-rpg-borderDark/20 p-3">
            <p className="text-[8px] font-pixel text-rpg-borderMid mb-2">🔗 MARKET LINKS</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={snkrDunkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rpg-panel px-3 py-1.5 text-[8px] font-pixel text-green-400 hover:text-green-300 hover:bg-rpg-borderDark/50 transition-colors"
              >
                👟 SNKR DUNK
                {card.metadata?.snkr_dunk_jpy ? ` ¥${card.metadata.snkr_dunk_jpy.toLocaleString()}` : ""}
              </a>
              {card.metadata?.price_url && (
                <a
                  href={card.metadata.price_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rpg-panel px-3 py-1.5 text-[8px] font-pixel text-throne-gold hover:text-throne-goldLight hover:bg-rpg-borderDark/50 transition-colors"
                >
                  🏪 YUYU-TEI
                  {card.metadata.yuyu_tei_jpy ? ` ¥${card.metadata.yuyu_tei_jpy.toLocaleString()}` : ""}
                </a>
              )}
            </div>
          </div>

          {/* Mark as Sold / Sold Info */}
          {card.status === 'sold' ? (
            <div className="border border-red-500/30 bg-red-900/20 p-3">
              <p className="text-[8px] font-pixel text-red-400 mb-2">🔴 SOLD</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[7px] font-pixel text-rpg-borderMid">SOLD PRICE</p>
                  <p className="font-pixel text-[11px] text-throne-goldLight">
                    {card.sold_price_idr ? formatIdr(parseFloat(card.sold_price_idr)) : card.sold_price_usd ? formatUsd(parseFloat(card.sold_price_usd)) : "—"}
                  </p>
                  {card.sold_price_idr && (
                    <p className="text-[8px] font-body text-rpg-borderMid">{formatUsd(parseFloat(card.sold_price_idr) / IDR_PER_USD)}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[7px] font-pixel text-rpg-borderMid">SOLD DATE</p>
                  <p className="font-pixel text-[10px] text-rpg-border">
                    {card.sold_date ? new Date(card.sold_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
              {(() => {
                const soldUsd = parseFloat(card.sold_price_usd || '0') || (parseFloat(card.sold_price_idr || '0') / IDR_PER_USD);
                const realizedProfit = soldUsd - cost;
                const realizedPct = cost > 0 ? ((realizedProfit / cost) * 100) : 0;
                return (
                  <div className="mt-2 pt-2 border-t border-red-500/20 flex justify-between items-center">
                    <div>
                      <span className="text-[7px] font-pixel text-rpg-borderMid">REALIZED P&L: </span>
                      <span className={`font-pixel text-[10px] ${realizedProfit >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                        {realizedProfit >= 0 ? "+" : ""}{formatUsd(realizedProfit)}
                      </span>
                    </div>
                    <span className={`font-pixel text-[12px] ${realizedPct >= 0 ? "text-throne-green" : "text-throne-red"}`}>
                      {realizedPct >= 0 ? "▲" : "▼"} {realizedPct >= 0 ? "+" : ""}{realizedPct.toFixed(1)}%
                    </span>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="border border-rpg-borderMid/30 bg-rpg-borderDark/20 p-3">
              {!showSoldForm ? (
                <button
                  onClick={() => setShowSoldForm(true)}
                  className="w-full rpg-panel px-3 py-2 text-[9px] font-pixel text-throne-gold hover:text-throne-goldLight hover:bg-rpg-borderDark/50 transition-colors text-center"
                >
                  💰 MARK AS SOLD
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-[8px] font-pixel text-throne-gold mb-2">💰 RECORD SALE</p>
                  <div>
                    <label className="text-[7px] font-pixel text-rpg-borderMid block mb-1">SOLD PRICE (IDR)</label>
                    <input
                      type="number"
                      value={soldPriceIdr}
                      onChange={(e) => setSoldPriceIdr(e.target.value)}
                      placeholder="e.g. 500000"
                      className="w-full bg-rpg-borderDark/50 border border-rpg-borderMid/40 text-rpg-border font-body text-[10px] px-2 py-1.5 focus:border-throne-gold/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[7px] font-pixel text-rpg-borderMid block mb-1">SOLD DATE</label>
                    <input
                      type="date"
                      value={soldDate}
                      onChange={(e) => setSoldDate(e.target.value)}
                      className="w-full bg-rpg-borderDark/50 border border-rpg-borderMid/40 text-rpg-border font-body text-[10px] px-2 py-1.5 focus:border-throne-gold/60 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!soldPriceIdr) return;
                        setSubmitting(true);
                        try {
                          await markCardSold(card.id, {
                            sold_price_idr: parseFloat(soldPriceIdr),
                            sold_date: soldDate,
                          });
                          onRefresh();
                          onClose();
                        } catch (err) {
                          console.error("Failed to mark as sold:", err);
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      disabled={submitting || !soldPriceIdr}
                      className="flex-1 rpg-panel px-3 py-1.5 text-[8px] font-pixel text-throne-green hover:bg-rpg-borderDark/50 transition-colors disabled:opacity-50"
                    >
                      {submitting ? "SAVING..." : "✅ CONFIRM SALE"}
                    </button>
                    <button
                      onClick={() => setShowSoldForm(false)}
                      className="rpg-panel px-3 py-1.5 text-[8px] font-pixel text-rpg-border hover:text-throne-red transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Last Update Timestamp */}
          {lastUpdate && (
            <div className="text-center">
              <p className="text-[7px] font-body text-rpg-borderMid">
                Last price update: {new Date(lastUpdate).toLocaleString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[9px] font-body text-rpg-borderMid">{label}</span>
      <span className={`text-[9px] font-body ${color || "text-rpg-border"}`}>{value}</span>
    </div>
  );
}
