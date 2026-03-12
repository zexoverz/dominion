"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import PixelBorder from "../../../components/PixelBorder";
import PixelProgress from "../../../components/PixelProgress";
import { getPortfolioCards } from "../../../lib/api";

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

  useEffect(() => {
    setLoading(true);
    getPortfolioCards()
      .then(setCards)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      <div className="flex gap-2">
        <Link href="/portfolio">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-rpg-border hover:text-throne-gold">
            📊 OVERVIEW
          </span>
        </Link>
        <Link href="/portfolio/collectibles">
          <span className="rpg-panel px-3 py-2 font-pixel text-[8px] text-throne-gold bg-rpg-borderDark/50">
            🃏 COLLECTIBLES
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
                {card.language && (
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelectedCard(null)}>
          <div className="rpg-panel p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-pixel text-[12px] text-throne-gold mb-1">{selectedCard.card_name}</h2>
                <p className="text-[10px] font-body text-rpg-borderMid">{selectedCard.card_code} • {selectedCard.set_name}</p>
              </div>
              <button onClick={() => setSelectedCard(null)} className="font-pixel text-[10px] text-rpg-border hover:text-throne-gold">✕</button>
            </div>

            {/* Card Image */}
            <div className="w-full h-48 bg-rpg-borderDark/40 border border-rpg-borderMid/30 mb-4 flex items-center justify-center overflow-hidden relative">
              {selectedCard.image_url ? (
                <img
                  src={selectedCard.image_url}
                  alt={selectedCard.card_name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-5xl opacity-50">{franchiseIcon(selectedCard.franchise)}</span>
              )}
              {selectedCard.language && (
                <span className="absolute top-2 right-2 bg-black/80 text-[9px] font-pixel px-2 py-1 text-throne-gold border border-rpg-borderMid/50">
                  {selectedCard.language}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <DetailRow label="Franchise" value={selectedCard.franchise === "one_piece" ? "One Piece" : "Pokemon"} />
              <DetailRow label="Set" value={selectedCard.set_name || "—"} />
              <DetailRow label="Rarity" value={selectedCard.rarity || "—"} />
              <DetailRow label="Grade" value={`${selectedCard.grade}${selectedCard.grading_company ? ` (${selectedCard.grading_company})` : ""}`} />
              <DetailRow label="Language" value={selectedCard.language} />
              <DetailRow label="Date Added" value={selectedCard.date_added ? new Date(selectedCard.date_added).toLocaleDateString() : "—"} />

              <div className="border-t border-rpg-borderDark my-3" />

              <DetailRow label="Cost (USD)" value={formatUsd(getCardCostUsd(selectedCard))} />
              <DetailRow label="Cost (IDR)" value={formatIdr(getCardCostUsd(selectedCard) * IDR_PER_USD)} />
              
              {(parseFloat(selectedCard.current_price_usd || "0") > 0 || parseFloat(selectedCard.current_price_idr || "0") > 0) && (
                <>
                  <DetailRow label="Current (USD)" value={formatUsd(getCardCurrentUsd(selectedCard))} color="text-throne-goldLight" />
                  <DetailRow label="Current (IDR)" value={formatIdr(getCardCurrentUsd(selectedCard) * IDR_PER_USD)} color="text-throne-goldLight" />
                  
                  <div className="border-t border-rpg-borderDark my-3" />
                  
                  {(() => {
                    const roi = getROI(selectedCard);
                    const pnl = getCardCurrentUsd(selectedCard) - getCardCostUsd(selectedCard);
                    return (
                      <>
                        <DetailRow label="P&L" value={`${pnl >= 0 ? "+" : ""}${formatUsd(pnl)}`} color={pnl >= 0 ? "text-throne-green" : "text-throne-red"} />
                        <DetailRow label="ROI" value={`${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%`} color={roi >= 0 ? "text-throne-green" : "text-throne-red"} />
                      </>
                    );
                  })()}
                </>
              )}

              {/* Price Source Links */}
              {(selectedCard.metadata?.price_url || selectedCard.metadata?.ebay_url || selectedCard.metadata?.snkr_url) && (
                <>
                  <div className="border-t border-rpg-borderDark my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-pixel text-rpg-borderMid">Price Source</span>
                    <div className="flex gap-2">
                      {selectedCard.metadata?.price_url && (
                        <a href={selectedCard.metadata.price_url} target="_blank" rel="noopener noreferrer"
                          className="text-[9px] font-pixel text-throne-gold hover:text-throne-goldLight underline">
                          🏪 Yuyu-tei {selectedCard.metadata.yuyu_tei_jpy ? `¥${selectedCard.metadata.yuyu_tei_jpy.toLocaleString()}` : ''}
                        </a>
                      )}
                      {selectedCard.metadata?.snkr_url && (
                        <a href={selectedCard.metadata.snkr_url} target="_blank" rel="noopener noreferrer"
                          className="text-[9px] font-pixel text-green-400 hover:text-green-300 underline">
                          👟 SNKRDUNK {selectedCard.metadata.snkr_dunk_jpy ? `¥${selectedCard.metadata.snkr_dunk_jpy.toLocaleString()}` : ''}
                        </a>
                      )}
                      {selectedCard.metadata?.ebay_url && (
                        <a href={selectedCard.metadata.ebay_url} target="_blank" rel="noopener noreferrer"
                          className="text-[9px] font-pixel text-blue-400 hover:text-blue-300 underline">
                          🔍 eBay Sold
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
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

function DetailRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[9px] font-body text-rpg-borderMid">{label}</span>
      <span className={`text-[9px] font-body ${color || "text-rpg-border"}`}>{value}</span>
    </div>
  );
}
