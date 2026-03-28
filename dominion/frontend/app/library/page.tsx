"use client";

import { useState, useEffect, useMemo } from "react";
import { getReports, getReport } from "../../lib/api";
import Link from "next/link";

const GENERAL_META: Record<string, { emoji: string; color: string }> = {
  SEER: { emoji: "🔮", color: "#a78bfa" },
  ECHO: { emoji: "🔊", color: "#f97316" },
  PHANTOM: { emoji: "👻", color: "#94a3b8" },
  GRIMOIRE: { emoji: "📜", color: "#60a5fa" },
  MAMMON: { emoji: "💰", color: "#eab308" },
  "WRAITH-EYE": { emoji: "👁️", color: "#22d3ee" },
  THRONE: { emoji: "👑", color: "#fbbf24" },
};

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  "market-intel": { label: "Market Intel", icon: "📊" },
  "financial": { label: "Financial", icon: "💰" },
  "security": { label: "Security", icon: "🔒" },
  "research": { label: "Research", icon: "📚" },
  "content": { label: "Content", icon: "✍️" },
  "engineering": { label: "Engineering", icon: "⚙️" },
  "strategy": { label: "Strategy", icon: "🎯" },
  "curriculum": { label: "Curriculum", icon: "🎓" },
  "mission-report": { label: "Mission Report", icon: "⚔️" },
  "monitoring": { label: "Monitoring", icon: "👁️" },
};

interface Report {
  slug: string;
  title: string;
  general: string;
  emoji: string;
  date: string;
  category: string;
}

export default function LibraryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGeneral, setFilterGeneral] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    getReports().then((d) => {
      setReports(Array.isArray(d) ? d : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const generals = useMemo(() => {
    const set = new Set(reports.map((r) => r.general));
    return Array.from(set).sort();
  }, [reports]);

  const categories = useMemo(() => {
    const set = new Set(reports.map((r) => r.category));
    return Array.from(set).sort();
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (filterGeneral !== "ALL" && r.general !== filterGeneral) return false;
      if (filterCategory !== "ALL" && r.category !== filterCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return r.title.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q) || r.general.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [reports, search, filterGeneral, filterCategory]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, Report[]> = {};
    for (const r of filtered) {
      const date = r.date || "Unknown";
      if (!groups[date]) groups[date] = [];
      groups[date].push(r);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const openReport = async (slug: string) => {
    setSelectedReport(slug);
    setLoadingReport(true);
    try {
      const data = await getReport(slug);
      setReportContent(data?.content || data?.body || JSON.stringify(data, null, 2));
    } catch {
      setReportContent("Failed to load report.");
    }
    setLoadingReport(false);
  };

  // Stats
  const statsByGeneral = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of reports) {
      m[r.general] = (m[r.general] || 0) + 1;
    }
    return Object.entries(m).sort(([, a], [, b]) => b - a);
  }, [reports]);

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="rpg-panel p-4 mb-4 text-center">
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-1">📚 THE LIBRARY</h1>
        <p className="font-body text-[9px] text-rpg-borderMid">GRIMOIRE&apos;s archives — {reports.length} documents indexed</p>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
        {statsByGeneral.map(([gen, count]) => {
          const meta = GENERAL_META[gen] || { emoji: "📄", color: "#94a3b8" };
          return (
            <button
              key={gen}
              onClick={() => setFilterGeneral(filterGeneral === gen ? "ALL" : gen)}
              className={`rpg-panel px-3 py-2 flex items-center gap-2 flex-shrink-0 min-h-[40px] transition-none ${
                filterGeneral === gen ? "border-throne-gold bg-throne-gold/10" : ""
              }`}
            >
              <span>{meta.emoji}</span>
              <span className="font-pixel text-[7px]" style={{ color: meta.color }}>{gen}</span>
              <span className="font-mono text-[8px] text-rpg-borderMid">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full bg-rpg-borderDark/50 border border-rpg-borderMid text-rpg-border font-body text-[11px] p-2 min-h-[40px] focus:border-throne-gold focus:outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-rpg-borderDark/50 border border-rpg-borderMid text-rpg-border font-pixel text-[9px] p-2 min-h-[40px] focus:border-throne-gold focus:outline-none cursor-pointer"
        >
          <option value="ALL">ALL CATEGORIES</option>
          {categories.map((c) => (
            <option key={c} value={c}>{(CATEGORY_META[c]?.icon || "📄") + " " + (CATEGORY_META[c]?.label || c).toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="font-pixel text-[7px] text-rpg-borderMid mb-3">
        {filtered.length} / {reports.length} documents
        {search && ` matching "${search}"`}
        {filterGeneral !== "ALL" && ` by ${filterGeneral}`}
        {filterCategory !== "ALL" && ` in ${filterCategory}`}
      </p>

      {loading && (
        <div className="rpg-panel p-6 text-center">
          <p className="font-pixel text-[10px] text-rpg-borderMid animate-pulse">📚 GRIMOIRE is indexing the archives...</p>
        </div>
      )}

      {/* Report reader panel */}
      {selectedReport && (
        <div className="rpg-panel p-4 mb-4" style={{ border: "2px solid #fbbf2444" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[9px] text-throne-gold">📖 READING: {selectedReport}</span>
            <button
              onClick={() => setSelectedReport(null)}
              className="font-pixel text-[9px] text-rpg-borderMid hover:text-throne-gold min-h-[36px] px-3"
            >
              ✕ CLOSE
            </button>
          </div>
          {loadingReport ? (
            <p className="font-pixel text-[9px] text-rpg-borderMid animate-pulse text-center py-4">Loading...</p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
              <div className="font-body text-[10px] text-rpg-border leading-relaxed whitespace-pre-wrap break-words">
                {reportContent}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report List — grouped by date */}
      {!loading && grouped.map(([date, items]) => (
        <div key={date} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-rpg-borderDark" />
            <span className="font-pixel text-[7px] text-rpg-borderMid">{date}</span>
            <div className="h-px flex-1 bg-rpg-borderDark" />
          </div>
          <div className="space-y-1">
            {items.map((r) => {
              const genMeta = GENERAL_META[r.general] || { emoji: "📄", color: "#94a3b8" };
              const catMeta = CATEGORY_META[r.category] || { label: r.category, icon: "📄" };
              const isSelected = selectedReport === r.slug;
              return (
                <button
                  key={r.slug}
                  onClick={() => openReport(r.slug)}
                  className={`w-full text-left flex items-center gap-3 p-2 md:p-3 transition-none hover:bg-rpg-borderDark/30 min-h-[44px] ${
                    isSelected ? "bg-throne-gold/10 border-l-2 border-throne-gold" : ""
                  }`}
                  style={{ borderLeft: isSelected ? undefined : `2px solid ${genMeta.color}33` }}
                >
                  <span className="text-sm flex-shrink-0">{genMeta.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-[8px] text-throne-goldLight truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-pixel text-[6px]" style={{ color: genMeta.color }}>{r.general}</span>
                      <span className="font-pixel text-[6px] text-rpg-borderMid">{catMeta.icon} {catMeta.label}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!loading && filtered.length === 0 && (
        <div className="rpg-panel p-6 text-center">
          <p className="font-pixel text-[10px] text-rpg-borderMid">No documents found.</p>
        </div>
      )}
    </div>
  );
}
