"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PixelBorder from "../../../components/PixelBorder";
import PixelProgress from "../../../components/PixelProgress";

const API = process.env.NEXT_PUBLIC_API_URL || "https://dominion-api-production.up.railway.app";
const IDR_PER_USD = 16400;

async function getMasterplan() {
  const res = await fetch(`${API}/api/portfolio/masterplan`);
  if (!res.ok) throw new Error("Failed to fetch masterplan");
  return res.json();
}

function formatUsd(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function formatIdr(n: number) {
  if (n >= 1_000_000_000) return "Rp " + (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + "M";
  return "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

// Simple markdown renderer — handles headers, bold, tables, lists, blockquotes, code blocks, hr
function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={key++} className="bg-gray-900 border border-yellow-900/50 rounded p-4 my-4 overflow-x-auto text-sm text-green-400 font-mono">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // HR
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={key++} className="border-yellow-900/30 my-6" />);
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1]?.includes("---")) {
      const headers = line.split("|").map(h => h.trim()).filter(Boolean);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(lines[i].split("|").map(c => c.trim()).filter(Boolean));
        i++;
      }
      elements.push(
        <div key={key++} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-yellow-600/50">
                {headers.map((h, j) => (
                  <th key={j} className="text-left px-3 py-2 text-yellow-400 font-bold whitespace-nowrap">{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-gray-800 hover:bg-yellow-900/10">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-gray-300 whitespace-nowrap">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headers
    if (line.startsWith("# ")) {
      elements.push(<h1 key={key++} className="text-3xl font-bold text-yellow-400 mt-8 mb-4 border-b-2 border-yellow-600/30 pb-2">{renderInline(line.slice(2))}</h1>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-2xl font-bold text-yellow-300 mt-8 mb-3">{renderInline(line.slice(3))}</h2>);
      i++; continue;
    }
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-xl font-bold text-amber-400 mt-6 mb-2">{renderInline(line.slice(4))}</h3>);
      i++; continue;
    }
    if (line.startsWith("#### ")) {
      elements.push(<h4 key={key++} className="text-lg font-bold text-amber-300 mt-4 mb-2">{renderInline(line.slice(5))}</h4>);
      i++; continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={key++} className="border-l-4 border-yellow-600 pl-4 my-4 italic text-yellow-200/80 bg-yellow-900/10 py-3 pr-4 rounded-r">
          {quoteLines.map((ql, qi) => <p key={qi} className="mb-1">{renderInline(ql)}</p>)}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*] /, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside my-3 space-y-1.5 text-gray-300 ml-2">
          {listItems.map((li, j) => <li key={j}>{renderInline(li)}</li>)}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside my-3 space-y-1.5 text-gray-300 ml-2">
          {listItems.map((li, j) => <li key={j}>{renderInline(li)}</li>)}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(<p key={key++} className="text-gray-300 my-2 leading-relaxed">{renderInline(line)}</p>);
    i++;
  }

  return elements;
}

// Inline formatting: bold, italic, inline code, links, emojis
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    // Bold + italic
    const boldItalicMatch = remaining.match(/^\*\*\*(.*?)\*\*\*/);
    if (boldItalicMatch) {
      parts.push(<strong key={k++} className="font-bold italic text-yellow-200">{boldItalicMatch[1]}</strong>);
      remaining = remaining.slice(boldItalicMatch[0].length);
      continue;
    }
    // Bold
    const boldMatch = remaining.match(/^\*\*(.*?)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={k++} className="font-bold text-yellow-200">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }
    // Italic
    const italicMatch = remaining.match(/^\*(.*?)\*/);
    if (italicMatch) {
      parts.push(<em key={k++} className="italic text-yellow-100/80">{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }
    // Inline code
    const codeMatch = remaining.match(/^`(.*?)`/);
    if (codeMatch) {
      parts.push(<code key={k++} className="bg-gray-800 text-green-400 px-1.5 py-0.5 rounded text-sm font-mono">{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }
    // Link
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(<a key={k++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">{linkMatch[1]}</a>);
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }
    // Regular character
    parts.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

export default function MasterplanPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState(0);

  useEffect(() => {
    Promise.all([
      getMasterplan(),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
        .then(r => r.json()).then(d => d.bitcoin?.usd || 0).catch(() => 0),
    ]).then(([mp, price]) => {
      setData(mp);
      setBtcPrice(price);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-yellow-400 text-xl animate-pulse">📜 Loading Master Plan...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load masterplan</div>
      </div>
    );
  }

  const live = data.live_data;
  const portfolioValue = live.btc_holdings * btcPrice;
  const weddingPct = live.wedding_target_idr > 0 ? (live.wedding_fund_idr / live.wedding_target_idr * 100) : 0;
  const btcPct = live.btc_holdings / 5 * 100; // 5 BTC target
  const cardsRoi = live.cards_cost_usd > 0 ? ((live.cards_current_usd - live.cards_cost_usd) / live.cards_cost_usd * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/40 via-amber-900/30 to-yellow-900/40 border-b-2 border-yellow-600/30">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">📜 Investment Master Plan</h1>
              <p className="text-amber-300/70 mt-1">v2.1 — Bitcoin Maximalist Strategy 2025-2030</p>
            </div>
            <div className="flex gap-2">
              <Link href="/portfolio" className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 rounded text-sm border border-yellow-900/50">← Dashboard</Link>
              <Link href="/portfolio/analytics" className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 rounded text-sm border border-yellow-900/50">📊 Analytics</Link>
              <Link href="/portfolio/collectibles" className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 rounded text-sm border border-yellow-900/50">🃏 Cards</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Live Data Dashboard */}
        <PixelBorder className="mb-8">
          <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-950">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">⚡ Live Portfolio Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-900/30">
                <div className="text-xs text-gray-500 uppercase">BTC Stack</div>
                <div className="text-xl font-bold text-yellow-400">{live.btc_holdings.toFixed(4)} ₿</div>
                <div className="text-sm text-gray-400">{formatUsd(portfolioValue)}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-900/30">
                <div className="text-xs text-gray-500 uppercase">BTC Price</div>
                <div className="text-xl font-bold text-green-400">{formatUsd(btcPrice)}</div>
                <div className="text-sm text-gray-400">Target: 5 ₿</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-900/30">
                <div className="text-xs text-gray-500 uppercase">Wedding Fund</div>
                <div className="text-xl font-bold text-pink-400">{formatIdr(live.wedding_fund_idr)}</div>
                <div className="text-sm text-gray-400">{weddingPct.toFixed(1)}% of target</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-900/30">
                <div className="text-xs text-gray-500 uppercase">Cards ({live.cards_count})</div>
                <div className="text-xl font-bold" style={{ color: cardsRoi >= 0 ? '#22c55e' : '#ef4444' }}>{formatUsd(live.cards_current_usd)}</div>
                <div className="text-sm text-gray-400">ROI: {cardsRoi >= 0 ? '+' : ''}{cardsRoi.toFixed(1)}%</div>
              </div>
            </div>

            {/* Progress bars */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">BTC Target (5 ₿)</span>
                  <span className="text-yellow-400">{btcPct.toFixed(1)}%</span>
                </div>
                <PixelProgress value={Math.min(btcPct, 100)} color="#fbbf24" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Wedding Fund</span>
                  <span className="text-pink-400">{weddingPct.toFixed(1)}%</span>
                </div>
                <PixelProgress value={Math.min(weddingPct, 100)} color="#ec4899" />
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600 text-right">
              Last updated: {new Date(live.last_updated).toLocaleString()}
            </div>
          </div>
        </PixelBorder>

        {/* Masterplan Content */}
        <PixelBorder>
          <div className="p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-950">
            <div className="prose prose-invert max-w-none">
              {renderMarkdown(data.content)}
            </div>
          </div>
        </PixelBorder>
      </div>
    </div>
  );
}
