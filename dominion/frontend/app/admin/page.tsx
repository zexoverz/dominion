"use client";

import { useState, useEffect, useCallback } from "react";
import { getProposals, getMissions, getGenerals, getCosts, patchProposal, patchMission, createProposal } from "../../lib/api";
import { generals as mockGenerals, missions as mockMissions, dailyBudget } from "../../lib/mock-data";

const QUICK_COMMANDS = [
  {
    label: "📊 Run Market Analysis",
    desc: "SEER scans markets for opportunities",
    agent: "seer",
    proposal: {
      title: "Market Analysis Sweep",
      description: "Comprehensive market sentiment and trend analysis across all monitored sectors.",
      assignedTo: "seer",
      priority: "HIGH",
      steps: ["Gather market data", "Run sentiment analysis", "Identify patterns", "Generate report"],
      estimatedCost: 2.5,
    },
  },
  {
    label: "💻 Code Review Sprint",
    desc: "PHANTOM audits the codebase",
    agent: "phantom",
    proposal: {
      title: "Code Review Sprint",
      description: "Full codebase audit — security, performance, and style compliance.",
      assignedTo: "phantom",
      priority: "HIGH",
      steps: ["Scan repositories", "Static analysis", "Security check", "Generate findings"],
      estimatedCost: 1.8,
    },
  },
  {
    label: "📝 Content Pipeline",
    desc: "GRIMOIRE + ECHO produce content",
    agent: "herald",
    proposal: {
      title: "Content Pipeline Activation",
      description: "Draft and publish content across all channels — blogs, docs, and announcements.",
      assignedTo: "herald",
      priority: "MEDIUM",
      steps: ["Outline topics", "Draft content", "Review & edit", "Publish"],
      estimatedCost: 1.2,
    },
  },
  {
    label: "🔒 Security Sweep",
    desc: "WRAITH-EYE hunts vulnerabilities",
    agent: "cipher",
    proposal: {
      title: "Security Perimeter Sweep",
      description: "Full vulnerability scan of all exposed endpoints and infrastructure.",
      assignedTo: "cipher",
      priority: "CRITICAL",
      steps: ["Port scanning", "Dependency audit", "Penetration test", "Patch report"],
      estimatedCost: 2.0,
    },
  },
  {
    label: "💰 Financial Health Check",
    desc: "MAMMON analyzes spending",
    agent: "warden",
    proposal: {
      title: "Financial Health Check",
      description: "Detailed cost analysis and budget optimization across all generals.",
      assignedTo: "warden",
      priority: "MEDIUM",
      steps: ["Collect cost data", "Analyze trends", "Identify waste", "Recommend cuts"],
      estimatedCost: 0.8,
    },
  },
];

const SERVICES = [
  { name: "Frontend", icon: "🖥️", status: "online" },
  { name: "API", icon: "⚡", status: "online" },
  { name: "Database", icon: "🗄️", status: "online" },
  { name: "OpenClaw", icon: "🦀", status: "online" },
];

function StatusDot({ status }: { status: string }) {
  const color = status === "online" ? "bg-green-500" : status === "degraded" ? "bg-yellow-500" : "bg-red-500";
  return <span className={`inline-block w-2 h-2 ${color} ${status === "online" ? "animate-pulse" : ""}`} />;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-3 bg-rpg-borderDark border border-rpg-borderMid">
      <div
        className="h-full bg-throne-gold transition-all"
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

export default function AdminPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>(mockMissions);
  const [generals, setGenerals] = useState(mockGenerals);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [p, m, g] = await Promise.all([getProposals(), getMissions(), getGenerals()]);
      setProposals(p);
      setMissions(m);
      setGenerals(g);
    } catch {
      // use mock data on failure
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const costToday = generals.reduce((s, g) => s + g.costToday, 0);
  const activeAgents = generals.filter((g) => g.status === "ACTIVE").length;
  const pendingProposals = proposals.filter((p) => p.status === "pending" || p.status === "PROPOSED");
  const activeMissions = missions.filter((m) => m.status === "IN_PROGRESS" || m.status === "REVIEW");

  const handleProposalAction = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await patchProposal(id, { status });
      await refresh();
    } catch { /* silent */ }
    setActionLoading(null);
  };

  const handleCancelMission = async (id: string) => {
    setActionLoading(id);
    try {
      await patchMission(id, { status: "cancelled" });
      await refresh();
    } catch { /* silent */ }
    setActionLoading(null);
  };

  const handleQuickCommand = async (cmd: typeof QUICK_COMMANDS[0]) => {
    setFlash(cmd.label);
    try {
      await createProposal(cmd.proposal);
      await refresh();
    } catch { /* silent */ }
    setTimeout(() => setFlash(null), 600);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Title */}
      <div className="rpg-panel mb-6 text-center py-4">
        <p className="font-pixel text-[8px] text-rpg-borderMid tracking-widest mb-1">— LORD ZEXO&apos;S —</p>
        <h1 className="font-pixel text-[16px] md:text-[20px] text-throne-gold text-glow-gold chapter-title">
          ⚔️ COMMAND CENTER
        </h1>
        <p className="font-pixel text-[8px] text-rpg-border mt-2">Issue orders. Shape destiny.</p>
      </div>

      {/* System Status */}
      <div className="rpg-panel mb-6 p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">⚙️ SYSTEM STATUS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {SERVICES.map((s) => (
            <div key={s.name} className="rpg-panel p-3 text-center">
              <span className="text-lg">{s.icon}</span>
              <p className="font-pixel text-[8px] text-rpg-border mt-1">{s.name}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <StatusDot status={s.status} />
                <span className="font-pixel text-[7px] text-green-400 uppercase">{s.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rpg-panel p-3 text-center">
            <p className="font-pixel text-[7px] text-rpg-borderMid">TODAY&apos;S COST</p>
            <p className="font-pixel text-[12px] text-throne-gold">${costToday.toFixed(2)}</p>
            <p className="font-pixel text-[7px] text-rpg-borderMid">/ ${dailyBudget}</p>
          </div>
          <div className="rpg-panel p-3 text-center">
            <p className="font-pixel text-[7px] text-rpg-borderMid">ACTIVE AGENTS</p>
            <p className="font-pixel text-[12px] text-seer-blue">{activeAgents}</p>
            <p className="font-pixel text-[7px] text-rpg-borderMid">/ {generals.length}</p>
          </div>
          <div className="rpg-panel p-3 text-center">
            <p className="font-pixel text-[7px] text-rpg-borderMid">LAST HEARTBEAT</p>
            <p className="font-pixel text-[10px] text-green-400">● LIVE</p>
            <p className="font-pixel text-[7px] text-rpg-borderMid">just now</p>
          </div>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="rpg-panel mb-6 p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">⚡ QUICK COMMANDS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => handleQuickCommand(cmd)}
              className={`rpg-panel p-3 text-left transition-none hover:bg-rpg-borderDark/40 active:bg-throne-gold/20 border-2 border-rpg-borderMid hover:border-throne-gold cursor-pointer ${
                flash === cmd.label ? "bg-throne-gold/30 border-throne-gold" : ""
              }`}
            >
              <p className="font-pixel text-[9px] text-throne-gold">{cmd.label}</p>
              <p className="text-[10px] text-rpg-border font-body mt-1">{cmd.desc}</p>
              <p className="font-pixel text-[7px] text-rpg-borderMid mt-1">~${cmd.proposal.estimatedCost.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Proposal Management */}
      <div className="rpg-panel mb-6 p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">
          📋 PENDING PROPOSALS ({pendingProposals.length})
        </h2>
        {pendingProposals.length === 0 ? (
          <p className="font-pixel text-[9px] text-rpg-borderMid text-center py-4">No pending proposals. The realm is quiet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingProposals.map((p) => {
              const agent = generals.find((g) => g.id === p.assignedTo);
              return (
                <div key={p.id} className="rpg-panel p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{agent?.emoji || "❓"}</span>
                        <span className="font-pixel text-[9px] text-throne-gold">{p.title}</span>
                        {p.priority && (
                          <span className={`font-pixel text-[7px] px-1 border ${
                            p.priority === "CRITICAL" ? "text-red-400 border-red-400" :
                            p.priority === "HIGH" ? "text-orange-400 border-orange-400" :
                            "text-rpg-borderMid border-rpg-borderMid"
                          }`}>{p.priority}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-rpg-border font-body">{p.description}</p>
                      {p.steps && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.steps.map((s: string, i: number) => (
                            <span key={i} className="font-pixel text-[7px] text-rpg-borderMid bg-rpg-borderDark/30 px-1">
                              {i + 1}. {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {p.estimatedCost && (
                        <p className="font-pixel text-[7px] text-rpg-borderMid mt-1">Est. cost: ${p.estimatedCost}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleProposalAction(p.id, "approved")}
                        disabled={actionLoading === p.id}
                        className="rpg-panel px-3 py-1 font-pixel text-[8px] text-green-400 border border-green-400 hover:bg-green-400/20 active:bg-green-400/40 cursor-pointer disabled:opacity-50"
                      >
                        ✓ APPROVE
                      </button>
                      <button
                        onClick={() => handleProposalAction(p.id, "rejected")}
                        disabled={actionLoading === p.id}
                        className="rpg-panel px-3 py-1 font-pixel text-[8px] text-red-400 border border-red-400 hover:bg-red-400/20 active:bg-red-400/40 cursor-pointer disabled:opacity-50"
                      >
                        ✗ REJECT
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mission Control */}
      <div className="rpg-panel mb-6 p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">
          🎯 ACTIVE MISSIONS ({activeMissions.length})
        </h2>
        {activeMissions.length === 0 ? (
          <p className="font-pixel text-[9px] text-rpg-borderMid text-center py-4">No active missions.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeMissions.map((m) => {
              const agent = generals.find((g) => g.id === m.assignedTo);
              return (
                <div key={m.id} className="rpg-panel p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{agent?.emoji || "❓"}</span>
                      <span className="font-pixel text-[9px] text-throne-gold">{m.title}</span>
                      <span className={`font-pixel text-[7px] px-1 border ${
                        m.status === "REVIEW" ? "text-seer-blue border-seer-blue" : "text-green-400 border-green-400"
                      }`}>{m.status}</span>
                    </div>
                    <button
                      onClick={() => handleCancelMission(m.id)}
                      disabled={actionLoading === m.id}
                      className="rpg-panel px-2 py-1 font-pixel text-[7px] text-red-400 border border-red-400 hover:bg-red-400/20 cursor-pointer disabled:opacity-50"
                    >
                      CANCEL
                    </button>
                  </div>
                  <p className="text-[10px] text-rpg-border font-body mb-2">{m.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <ProgressBar value={m.progress} />
                    </div>
                    <span className="font-pixel text-[8px] text-throne-gold">{m.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
