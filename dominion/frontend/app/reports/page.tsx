"use client";

import { useState, useEffect } from "react";
import { getReports } from "../../lib/api";
import Link from "next/link";

interface ReportMeta {
  slug: string;
  title: string;
  general: string;
  emoji: string;
  date: string;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "market-intel": "#a78bfa",
  finance: "#fbbf24",
  research: "#10b981",
  content: "#f97316",
  general: "#94a3b8",
};

const CATEGORY_LABELS: Record<string, string> = {
  "market-intel": "🔮 MARKET INTEL",
  finance: "💰 FINANCE",
  research: "📖 RESEARCH",
  content: "📯 CONTENT",
  general: "📜 GENERAL",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getReports()
      .then((d) => {
        if (Array.isArray(d)) setReports(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["ALL", ...Array.from(new Set(reports.map((r) => r.category)))];
  const filtered = filter === "ALL" ? reports : reports.filter((r) => r.category === filter);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rpg-panel mb-6 text-center py-4">
        <p className="font-pixel text-[8px] text-rpg-borderMid tracking-widest mb-1">— INTELLIGENCE —</p>
        <h1 className="font-pixel text-[16px] md:text-[20px] text-throne-gold text-glow-gold chapter-title">
          📜 SCROLLS OF KNOWLEDGE
        </h1>
        <p className="font-pixel text-[8px] text-rpg-border mt-2">
          Reports, analyses, and intel gathered by the generals.
        </p>
        <p className="text-[9px] font-body text-rpg-borderMid mt-1">{reports.length} scrolls in the archives</p>
      </div>

      {/* Category Filter */}
      <div className="rpg-panel mb-4 p-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-pixel text-[8px] px-3 py-1.5 border transition-colors min-h-[44px] cursor-pointer ${
                filter === cat
                  ? "text-throne-gold border-throne-gold bg-throne-gold/10"
                  : "text-rpg-borderMid border-rpg-borderDark hover:text-rpg-border hover:border-rpg-border"
              }`}
            >
              {cat === "ALL" ? "📜 ALL" : CATEGORY_LABELS[cat] || cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="rpg-panel p-8 text-center">
          <p className="font-pixel text-[9px] text-rpg-borderMid animate-pulse">Consulting the archives...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rpg-panel p-8 text-center">
          <p className="font-pixel text-[9px] text-rpg-borderMid">No scrolls found in this category.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((report) => {
            const catColor = CATEGORY_COLORS[report.category] || "#94a3b8";
            return (
              <Link key={report.slug} href={`/reports/${report.slug}`}>
                <div
                  className="rpg-panel p-4 hover:translate-y-[-1px] transition-transform cursor-pointer"
                  style={{ borderLeft: `3px solid ${catColor}` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{report.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-pixel text-[10px] text-throne-gold text-rpg-shadow">
                          {report.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="font-pixel text-[7px] px-2 py-0.5"
                          style={{
                            color: catColor,
                            backgroundColor: catColor + "15",
                            border: `1px solid ${catColor}33`,
                          }}
                        >
                          {CATEGORY_LABELS[report.category] || report.category}
                        </span>
                        <span className="font-pixel text-[8px] text-rpg-borderMid">
                          by {report.general}
                        </span>
                        <span className="text-[8px] font-body text-rpg-borderMid">{report.date}</span>
                      </div>
                    </div>
                    <span className="font-pixel text-[9px] text-rpg-borderMid self-center">▶</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
