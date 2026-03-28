"use client";

import { useState, useEffect } from "react";
import PixelProgress from "../../components/PixelProgress";

const IDR_PER_USD = 16800;

function fmtUsd(n: number) { return "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 }); }
function fmtIdr(n: number) {
  if (n >= 1e12) return "Rp " + (n/1e12).toFixed(1) + "T";
  if (n >= 1e9) return "Rp " + (n/1e9).toFixed(1) + "B";
  if (n >= 1e6) return "Rp " + (n/1e6).toFixed(1) + "M";
  return "Rp " + n.toLocaleString();
}

// Income scenarios
const SCENARIOS = [
  { label: "Current", monthly: 10050, color: "#94a3b8", desc: "OKU $6,750 + ForuAI $3,300" },
  { label: "Job Upgrade", monthly: 18300, color: "#22c55e", desc: "New ZK role $15K + ForuAI $3,300" },
  { label: "Senior ZK", monthly: 23300, color: "#3b82f6", desc: "Top ZK role $20K + ForuAI $3,300" },
  { label: "Dual Senior", monthly: 28000, color: "#a855f7", desc: "Both roles upgraded" },
];

const HACKATHONS = [
  { name: "ETHGlobal Bangkok", date: "2026-05-16", prize: "$50K pool", url: "https://ethglobal.com", status: "upcoming" },
  { name: "ETHGlobal San Francisco", date: "2026-08-15", prize: "$75K pool", url: "https://ethglobal.com", status: "upcoming" },
  { name: "Devfolio Hackathon", date: "2026-06-01", prize: "$25K pool", url: "https://devfolio.co", status: "upcoming" },
];

const JOB_SOURCES = [
  { name: "CryptoJobsList", url: "https://cryptojobslist.com/remote", icon: "💼" },
  { name: "Web3.career", url: "https://web3.career/remote", icon: "🌐" },
  { name: "Remote3.co", url: "https://remote3.co", icon: "📡" },
  { name: "Crypto.recruit", url: "https://www.crypto-recruit.com", icon: "🔗" },
];

const SKILLS_MARKET = [
  { skill: "ZK Circuit Engineering", demand: 95, salary: "$180-250K/yr", hot: true },
  { skill: "Solidity / Smart Contracts", demand: 80, salary: "$120-200K/yr", hot: false },
  { skill: "Uniswap V4 Hooks", demand: 90, salary: "$150-220K/yr", hot: true },
  { skill: "Full-Stack Web3", demand: 70, salary: "$100-160K/yr", hot: false },
  { skill: "EVM / Client Dev", demand: 85, salary: "$140-200K/yr", hot: true },
  { skill: "Privacy Protocols", demand: 92, salary: "$160-240K/yr", hot: true },
];

const MONETIZATION_IDEAS = [
  { idea: "ETHJKT Paid Workshops", revenue: "Rp 5-15M/event", effort: "LOW", desc: "ZK basics, Solidity advanced. 900+ member audience. Charge Rp 250K-500K/person." },
  { idea: "Corporate Web3 Training", revenue: "$3-10K/session", effort: "MED", desc: "Teach web3 companies. Full-day workshops. Your ETHJKT brand = credibility." },
  { idea: "ZK Architecture Consulting", revenue: "$200-500/hr", effort: "LOW", desc: "Review ZK circuit designs, audit privacy implementations. GrimSwap = proof of skill." },
  { idea: "ETHGlobal Bounties", revenue: "$5-50K/win", effort: "HIGH", desc: "You got Top 10 once. Do it 3-4x/year. Prize + reputation + job offers." },
  { idea: "Kruu Company Revenue", revenue: "???", effort: "VARIES", desc: "CTO equity. Is this generating revenue? If not, kill or pivot." },
  { idea: "Qurban Cattle Business", revenue: "30-50% margin", effort: "MED", desc: "Buy 2-3 cows, sell at Idul Adha. Dzikri manages. Rp 15-30M capital per cow." },
];

export default function OpportunitiesPage() {
  const [btcPrice, setBtcPrice] = useState(66000);
  const [dcaPct, setDcaPct] = useState(75); // % of income after expenses that goes to BTC

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
      .then(r => r.json()).then(d => setBtcPrice(d.bitcoin?.usd || 66000)).catch(() => {});
  }, []);

  // Calculate projections for each scenario
  const projections = SCENARIOS.map(s => {
    const expenses = 3500; // ~$3.5K/mo fixed (health, keiko, living, car)
    const investable = s.monthly - expenses;
    const btcMonthly = investable * (dcaPct / 100);
    const btcPerMonth = btcMonthly / btcPrice;
    const btcBy2030 = btcPerMonth * 48 + 0.20251; // 48 months + current
    const nw300k = btcBy2030 * 300000;
    const nw500k = btcBy2030 * 500000;
    return { ...s, investable, btcMonthly, btcPerMonth, btcBy2030, nw300k, nw500k };
  });

  const now = new Date();

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="rpg-panel p-4 mb-4 text-center">
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-1">🔍 OPPORTUNITY SCANNER</h1>
        <p className="font-body text-[9px] text-rpg-borderMid">SEER&apos;s intelligence division — finding alpha for Lord Zexo</p>
      </div>

      {/* ═══ INCOME SIMULATOR ═══ */}
      <div className="p-4 mb-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-pixel text-[10px] text-throne-gold text-rpg-shadow">💰 INCOME SIMULATOR</span>
          <span className="font-pixel text-[7px] text-rpg-borderMid">BTC @ {fmtUsd(btcPrice)}</span>
        </div>
        <p className="font-body text-[8px] text-rpg-borderMid mb-3">
          What happens to your 2030 net worth at different income levels?
        </p>

        {/* Scenario cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {projections.map((p) => (
            <div key={p.label} className="p-3" style={{ border: `1px solid ${p.color}33`, background: `${p.color}08` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-[9px]" style={{ color: p.color }}>{p.label}</span>
                <span className="font-mono text-[10px] text-rpg-border">{fmtUsd(p.monthly)}/mo</span>
              </div>
              <p className="font-body text-[7px] text-rpg-borderMid mb-2">{p.desc}</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-pixel text-[6px] text-rpg-borderMid">BTC/MONTH</span>
                  <span className="font-mono text-[8px] text-[#f7931a]">{p.btcPerMonth.toFixed(4)} ₿</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-pixel text-[6px] text-rpg-borderMid">BTC BY 2030</span>
                  <span className="font-mono text-[10px] text-[#f7931a] font-bold">{p.btcBy2030.toFixed(2)} ₿</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-pixel text-[6px] text-rpg-borderMid">@ $300K</span>
                  <span className="font-mono text-[8px] text-throne-gold">{fmtUsd(p.nw300k)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-pixel text-[6px] text-rpg-borderMid">@ $500K</span>
                  <span className="font-mono text-[8px] text-green-400">{fmtUsd(p.nw500k)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delta highlight */}
        <div className="p-3 text-center" style={{ border: "1px solid #22c55e33", background: "rgba(34,197,94,0.05)" }}>
          <p className="font-pixel text-[8px] text-[#22c55e]">
            💡 Upgrading to a $15K ZK role = +{fmtUsd(projections[1].nw300k - projections[0].nw300k)} net worth by 2030 (@$300K BTC)
          </p>
          <p className="font-pixel text-[7px] text-rpg-borderMid mt-1">
            That&apos;s {fmtIdr((projections[1].nw300k - projections[0].nw300k) * IDR_PER_USD)} more just from one job upgrade
          </p>
        </div>
      </div>

      {/* ═══ YOUR SKILLS MARKET VALUE ═══ */}
      <div className="p-4 mb-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
        <span className="font-pixel text-[10px] text-throne-gold text-rpg-shadow">🧠 YOUR SKILLS — MARKET VALUE</span>
        <p className="font-body text-[8px] text-rpg-borderMid mt-1 mb-3">Skills you have that the market pays premium for.</p>
        <div className="space-y-2">
          {SKILLS_MARKET.map((s) => (
            <div key={s.skill} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-pixel text-[8px] text-rpg-border">{s.skill}</span>
                  {s.hot && <span className="font-pixel text-[6px] text-red-400 animate-pulse">🔥 HOT</span>}
                </div>
                <PixelProgress value={s.demand} color={s.demand >= 90 ? "#22c55e" : s.demand >= 80 ? "#fbbf24" : "#94a3b8"} height={6} segments={20} />
              </div>
              <span className="font-mono text-[8px] text-throne-goldLight flex-shrink-0">{s.salary}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HACKATHON RADAR ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
          <span className="font-pixel text-[10px] text-throne-gold text-rpg-shadow">🏆 HACKATHON RADAR</span>
          <p className="font-body text-[8px] text-rpg-borderMid mt-1 mb-3">Your record: ETHGlobal HackMoney 2026 Top 10 (GrimSwap)</p>
          <div className="space-y-2">
            {HACKATHONS.map((h) => {
              const daysLeft = Math.ceil((new Date(h.date).getTime() - now.getTime()) / 86400000);
              return (
                <div key={h.name} className="p-2 flex items-center justify-between" style={{ borderLeft: "3px solid #fbbf24", background: "rgba(251,191,36,0.03)" }}>
                  <div>
                    <p className="font-pixel text-[8px] text-throne-goldLight">{h.name}</p>
                    <p className="font-pixel text-[7px] text-rpg-borderMid">{h.prize}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[9px] text-rpg-border">{daysLeft}d</p>
                    <p className="font-pixel text-[6px] text-rpg-borderMid">{h.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Job Sources */}
        <div className="p-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
          <span className="font-pixel text-[10px] text-throne-gold text-rpg-shadow">💼 JOB SOURCES</span>
          <p className="font-body text-[8px] text-rpg-borderMid mt-1 mb-3">Remote ZK/blockchain roles. SEER scans these weekly.</p>
          <div className="space-y-2">
            {JOB_SOURCES.map((j) => (
              <a key={j.name} href={j.url} target="_blank" rel="noopener noreferrer"
                className="p-2 flex items-center gap-3 hover:bg-rpg-borderDark/30 transition-colors min-h-[44px]"
                style={{ borderLeft: "3px solid #3b82f6", background: "rgba(59,130,246,0.03)" }}
              >
                <span className="text-lg">{j.icon}</span>
                <div>
                  <p className="font-pixel text-[8px] text-[#3b82f6]">{j.name}</p>
                  <p className="font-pixel text-[6px] text-rpg-borderMid">{j.url.replace("https://", "")}</p>
                </div>
                <span className="font-pixel text-[7px] text-rpg-borderMid ml-auto">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MONETIZATION IDEAS ═══ */}
      <div className="p-4 mb-4" style={{ background: "rgba(15,10,25,0.95)", border: "1px solid #3a3a5a" }}>
        <span className="font-pixel text-[10px] text-throne-gold text-rpg-shadow">🎯 MONETIZATION OPPORTUNITIES</span>
        <p className="font-body text-[8px] text-rpg-borderMid mt-1 mb-3">Ways to increase income using what you already have.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MONETIZATION_IDEAS.map((m) => (
            <div key={m.idea} className="p-3" style={{ border: "1px solid #3a3a5a", background: "rgba(16,16,42,0.5)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[8px] text-throne-goldLight">{m.idea}</span>
                <span className={`font-pixel text-[6px] px-1.5 py-0.5 ${
                  m.effort === "LOW" ? "text-green-400 border border-green-400/30 bg-green-400/10" :
                  m.effort === "MED" ? "text-yellow-400 border border-yellow-400/30 bg-yellow-400/10" :
                  "text-red-400 border border-red-400/30 bg-red-400/10"
                }`}>{m.effort}</span>
              </div>
              <p className="font-body text-[8px] text-rpg-border mb-1">{m.desc}</p>
              <p className="font-mono text-[9px] text-[#22c55e]">{m.revenue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom insight */}
      <div className="rpg-panel p-4 text-center">
        <p className="font-pixel text-[9px] text-throne-gold">⚡ SEER&apos;S PRIME DIRECTIVE</p>
        <p className="font-body text-[10px] text-rpg-border mt-2 max-w-lg mx-auto">
          &quot;Your $33K savings growing at 4x via BTC = $132K. Your SKILLS growing at 2x via job upgrade = +$100K/year FOREVER. 
          The math is clear: upgrade income first, then let compounding do the rest.&quot;
        </p>
      </div>
    </div>
  );
}
