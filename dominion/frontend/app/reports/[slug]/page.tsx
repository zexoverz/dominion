"use client";

import { useState, useEffect } from "react";
import { getReport } from "../../../lib/api";
import Link from "next/link";

// Simple markdown-to-JSX renderer (no deps needed)
function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: JSX.Element[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-1 mb-4 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-[10px] font-body text-rpg-border leading-relaxed flex gap-2">
              <span className="text-throne-gold flex-shrink-0">▸</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  const inlineFormat = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-throne-goldLight">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="text-seer-blue bg-rpg-borderDark/30 px-1 text-[9px]">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-seer-blue underline" target="_blank">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headers
    if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={i} className="font-pixel text-[14px] text-throne-gold text-rpg-shadow mb-4 mt-6 first:mt-0">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={i} className="font-pixel text-[11px] text-throne-goldLight text-rpg-shadow mb-3 mt-5 border-b border-rpg-borderDark pb-1">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={i} className="font-pixel text-[10px] text-rpg-border mb-2 mt-4">
          ⚜️ {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      inList = true;
      listItems.push(line.slice(2));
    } else if (line.startsWith("---")) {
      flushList();
      elements.push(<hr key={i} className="border-rpg-borderDark my-4" />);
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p
          key={i}
          className="text-[10px] font-body text-rpg-border leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
        />
      );
    }
  }
  flushList();
  return elements;
}

export default function ReportDetail({ params }: { params: { slug: string } }) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getReport(params.slug)
      .then(setReport)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto rpg-panel p-8 text-center">
        <p className="font-pixel text-[9px] text-rpg-borderMid animate-pulse">Unrolling the scroll...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-3xl mx-auto rpg-panel p-8 text-center">
        <p className="font-pixel text-[12px] text-red-400 mb-4">📜 SCROLL NOT FOUND</p>
        <Link href="/reports" className="font-pixel text-[9px] text-throne-gold hover:text-throne-goldLight">
          ▶ RETURN TO ARCHIVES
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/reports"
        className="font-pixel text-[9px] text-rpg-borderMid hover:text-throne-gold mb-4 inline-flex items-center min-h-[44px] gap-2"
      >
        <span className="rpg-cursor">▶</span> BACK TO ARCHIVES
      </Link>

      {/* Report Header */}
      <div className="rpg-panel mb-4 p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{report.emoji}</span>
          <div>
            <h1 className="font-pixel text-[12px] md:text-[14px] text-throne-gold text-rpg-shadow">
              {report.title}
            </h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="font-pixel text-[8px] text-rpg-borderMid">
                by {report.general}
              </span>
              <span className="text-[8px] font-body text-rpg-borderMid">{report.date}</span>
              <span className="font-pixel text-[7px] px-2 py-0.5 text-rpg-borderMid bg-rpg-borderDark/30 border border-rpg-borderDark">
                {report.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="rpg-panel p-4 md:p-6">
        <div className="report-content">{renderMarkdown(report.content || "")}</div>
      </div>
    </div>
  );
}
