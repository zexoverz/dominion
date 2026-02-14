"use client";

import { useState, useEffect, useCallback } from "react";
import { getProposals, getMissions, getGenerals, getCosts, patchProposal, patchMission, createProposal, createMission } from "../../lib/api";
import { generals as mockGenerals, missions as mockMissions, dailyBudget } from "../../lib/mock-data";
import { mergeGenerals } from "../../lib/merge-generals";
import { mergeMissions } from "../../lib/merge-missions";

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

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

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

type FlashMsg = { type: "success" | "error"; text: string } | null;

function FlashBanner({ flash, onDismiss }: { flash: FlashMsg; onDismiss: () => void }) {
  if (!flash) return null;
  return (
    <div
      className={`rpg-panel mb-4 p-3 border-2 flex items-center justify-between ${
        flash.type === "success"
          ? "border-green-400 bg-green-400/10"
          : "border-red-400 bg-red-400/10"
      }`}
    >
      <p className={`font-pixel text-[9px] ${flash.type === "success" ? "text-green-400" : "text-red-400"}`}>
        {flash.type === "success" ? "✓ " : "✗ "}{flash.text}
      </p>
      <button onClick={onDismiss} className="font-pixel text-[9px] text-rpg-borderMid hover:text-rpg-border cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center">✕</button>
    </div>
  );
}

export default function AdminPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>(mockMissions);
  const [generals, setGenerals] = useState(mockGenerals);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [flash, setFlash] = useState<FlashMsg>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "MEDIUM",
    estimatedCost: "",
  });

  const showFlash = (type: "success" | "error", text: string) => {
    setFlash({ type, text });
    setTimeout(() => setFlash(null), 4000);
  };

  const refresh = useCallback(async () => {
    try {
      const [p, m, g] = await Promise.all([getProposals(), getMissions(), getGenerals()]);
      setProposals(p);
      setMissions(mergeMissions(m));
      setGenerals(mergeGenerals(g));
    } catch {
      // use mock data on failure
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const costToday = generals.reduce((s, g) => s + g.costToday, 0);
  const activeAgents = generals.filter((g) => g.status === "ACTIVE").length;
  const pendingProposals = proposals.filter((p) => p.status === "pending" || p.status === "PROPOSED");
  const approvedProposals = proposals.filter((p) => p.status === "approved");
  const activeMissions = missions.filter((m) => m.status === "active" || m.status === "IN_PROGRESS" || m.status === "REVIEW");
  const recentMissions = missions.slice(0, 10);

  const handleProposalAction = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await patchProposal(id, { status });
      await refresh();
      showFlash("success", `Proposal ${status === "approved" ? "approved" : "rejected"} successfully.`);
    } catch (e: any) {
      showFlash("error", `Failed to ${status === "approved" ? "approve" : "reject"} proposal: ${e.message}`);
    }
    setActionLoading(null);
  };

  const handleCancelMission = async (id: string) => {
    setActionLoading(id);
    try {
      await patchMission(id, { status: "cancelled" });
      await refresh();
      showFlash("success", "Mission cancelled.");
    } catch (e: any) {
      showFlash("error", `Failed to cancel mission: ${e.message}`);
    }
    setActionLoading(null);
  };

  const handleCreateMission = async (proposal: any) => {
    setActionLoading(proposal.id);
    try {
      await createMission({
        proposal_id: proposal.id,
        agent_id: proposal.agent_id || proposal.assignedTo?.toUpperCase(),
        title: proposal.title,
        description: proposal.description,
        priority: typeof proposal.priority === "string" ? parseInt(proposal.priority) || 50 : proposal.priority,
        estimated_cost_usd: proposal.estimatedCost || proposal.estimated_cost_usd || 0,
      });
      await refresh();
      showFlash("success", `Mission created from "${proposal.title}".`);
    } catch (e: any) {
      showFlash("error", `Failed to create mission: ${e.message}`);
    }
    setActionLoading(null);
  };

  const handleQuickCommand = async (cmd: typeof QUICK_COMMANDS[0]) => {
    setActionLoading(cmd.label);
    try {
      await createProposal(cmd.proposal);
      await refresh();
      showFlash("success", `Quick command "${cmd.label}" submitted.`);
    } catch (e: any) {
      showFlash("error", `Failed to submit command: ${e.message}`);
    }
    setActionLoading(null);
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.assignedTo) {
      showFlash("error", "Fill in title, description, and assign a general.");
      return;
    }
    setActionLoading("create-form");
    try {
      await createProposal({
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        agent_id: formData.assignedTo.toUpperCase(),
        priority: formData.priority,
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
      });
      await refresh();
      showFlash("success", `Proposal "${formData.title}" created.`);
      setFormData({ title: "", description: "", assignedTo: "", priority: "MEDIUM", estimatedCost: "" });
      setShowForm(false);
    } catch (e: any) {
      showFlash("error", `Failed to create proposal: ${e.message}`);
    }
    setActionLoading(null);
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

      {/* Flash Message */}
      <FlashBanner flash={flash} onDismiss={() => setFlash(null)} />

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
              disabled={actionLoading === cmd.label}
              className={`rpg-panel p-3 text-left transition-none hover:bg-rpg-borderDark/40 active:bg-throne-gold/20 border-2 border-rpg-borderMid hover:border-throne-gold cursor-pointer min-h-[44px] disabled:opacity-50 ${
                actionLoading === cmd.label ? "bg-throne-gold/30 border-throne-gold" : ""
              }`}
            >
              <p className="font-pixel text-[9px] text-throne-gold">{cmd.label}</p>
              <p className="text-[10px] text-rpg-border font-body mt-1">{cmd.desc}</p>
              <p className="font-pixel text-[7px] text-rpg-borderMid mt-1">~${cmd.proposal.estimatedCost.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Create Proposal Form */}
      <div className="rpg-panel mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-[10px] text-throne-gold text-rpg-shadow">📜 CREATE PROPOSAL</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rpg-panel px-4 font-pixel text-[8px] text-throne-gold border border-throne-gold hover:bg-throne-gold/20 active:bg-throne-gold/40 cursor-pointer min-h-[44px]"
          >
            {showForm ? "▲ HIDE" : "▼ NEW PROPOSAL"}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleCreateProposal} className="flex flex-col gap-3">
            <div>
              <label className="font-pixel text-[8px] text-rpg-borderMid block mb-1">TITLE</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-rpg-borderDark/50 border border-rpg-borderMid text-rpg-border font-body text-[11px] p-2 min-h-[44px] focus:border-throne-gold focus:outline-none"
                placeholder="Enter proposal title..."
              />
            </div>
            <div>
              <label className="font-pixel text-[8px] text-rpg-borderMid block mb-1">DESCRIPTION</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-rpg-borderDark/50 border border-rpg-borderMid text-rpg-border font-body text-[11px] p-2 min-h-[88px] focus:border-throne-gold focus:outline-none resize-y"
                placeholder="Describe the mission objective..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="font-pixel text-[8px] text-rpg-borderMid block mb-1">ASSIGN TO</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full bg-rpg-borderDark/50 border border-rpg-borderMid text-rpg-border font-body text-[11px] p-2 min-h-[44px] focus:border-throne-gold focus:outline-none cursor-pointer"
                >
                  <option value="">Select general...</option>
                  {generals.map((g) => (
                    <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-pixel text-[8px] text-rpg-borderMid block mb-1">PRIORITY</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-rpg-borderDark/50 border border-rpg-borderMid text-rpg-border font-body text-[11px] p-2 min-h-[44px] focus:border-throne-gold focus:outline-none cursor-pointer"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-pixel text-[8px] text-rpg-borderMid block mb-1">EST. COST ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  className="w-full bg-rpg-borderDark/50 border border-rpg-borderMid text-rpg-border font-body text-[11px] p-2 min-h-[44px] focus:border-throne-gold focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={actionLoading === "create-form"}
              className="rpg-panel px-4 font-pixel text-[9px] text-throne-gold border-2 border-throne-gold hover:bg-throne-gold/20 active:bg-throne-gold/40 cursor-pointer min-h-[44px] disabled:opacity-50"
            >
              {actionLoading === "create-form" ? "⏳ SUBMITTING..." : "📜 SUBMIT PROPOSAL"}
            </button>
          </form>
        )}
      </div>

      {/* Pending Proposals */}
      <div className="rpg-panel mb-6 p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">
          📋 PENDING PROPOSALS ({pendingProposals.length})
        </h2>
        {pendingProposals.length === 0 ? (
          <p className="font-pixel text-[9px] text-rpg-borderMid text-center py-4">No pending proposals. The realm is quiet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingProposals.map((p) => {
              const agent = generals.find((g) => g.id === (p.assignedTo || p.agent_id?.toLowerCase()));
              return (
                <div key={p.id} className="rpg-panel p-3">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm">{agent?.emoji || "❓"}</span>
                        <span className="font-pixel text-[9px] text-throne-gold">{p.title}</span>
                        {(p.priority || p.priority === 0) && (
                          <span className={`font-pixel text-[7px] px-1 border ${
                            (p.priority === "CRITICAL" || p.priority >= 90) ? "text-red-400 border-red-400" :
                            (p.priority === "HIGH" || p.priority >= 70) ? "text-orange-400 border-orange-400" :
                            "text-rpg-borderMid border-rpg-borderMid"
                          }`}>{typeof p.priority === "number" ? (p.priority >= 90 ? "CRITICAL" : p.priority >= 70 ? "HIGH" : p.priority >= 40 ? "MEDIUM" : "LOW") : p.priority}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-rpg-border font-body">{p.description}</p>
                      {(p.steps || p.proposed_steps) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(p.steps || p.proposed_steps)?.map((s: any, i: number) => (
                            <span key={i} className="font-pixel text-[7px] text-rpg-borderMid bg-rpg-borderDark/30 px-1">
                              {i + 1}. {typeof s === "string" ? s : s.title}
                            </span>
                          ))}
                        </div>
                      )}
                      {(p.estimatedCost || p.estimated_cost_usd) && (
                        <p className="font-pixel text-[7px] text-rpg-borderMid mt-1">Est. cost: ${p.estimatedCost || p.estimated_cost_usd}</p>
                      )}
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2">
                      <button
                        onClick={() => handleProposalAction(p.id, "approved")}
                        disabled={actionLoading === p.id}
                        className="rpg-panel px-3 font-pixel text-[8px] text-green-400 border border-green-400 hover:bg-green-400/20 active:bg-green-400/40 cursor-pointer disabled:opacity-50 min-h-[44px]"
                      >
                        ✓ APPROVE
                      </button>
                      <button
                        onClick={() => handleProposalAction(p.id, "rejected")}
                        disabled={actionLoading === p.id}
                        className="rpg-panel px-3 font-pixel text-[8px] text-red-400 border border-red-400 hover:bg-red-400/20 active:bg-red-400/40 cursor-pointer disabled:opacity-50 min-h-[44px]"
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

      {/* Approved Proposals → Create Mission */}
      {approvedProposals.length > 0 && (
        <div className="rpg-panel mb-6 p-4">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">
            ✅ APPROVED — READY FOR DEPLOYMENT ({approvedProposals.length})
          </h2>
          <div className="flex flex-col gap-3">
            {approvedProposals.map((p) => {
              const agent = generals.find((g) => g.id === (p.assignedTo || p.agent_id?.toLowerCase()));
              return (
                <div key={p.id} className="rpg-panel p-3">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{agent?.emoji || "❓"}</span>
                        <span className="font-pixel text-[9px] text-throne-gold">{p.title}</span>
                        <span className="font-pixel text-[7px] px-1 border text-green-400 border-green-400">APPROVED</span>
                      </div>
                      <p className="text-[10px] text-rpg-border font-body">{p.description}</p>
                    </div>
                    <button
                      onClick={() => handleCreateMission(p)}
                      disabled={actionLoading === p.id}
                      className="rpg-panel px-4 font-pixel text-[8px] text-seer-blue border-2 border-seer-blue hover:bg-seer-blue/20 active:bg-seer-blue/40 cursor-pointer disabled:opacity-50 min-h-[44px] whitespace-nowrap"
                    >
                      {actionLoading === p.id ? "⏳ CREATING..." : "🚀 CREATE MISSION"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Missions */}
      <div className="rpg-panel mb-6 p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">
          🎯 ACTIVE MISSIONS ({activeMissions.length})
        </h2>
        {activeMissions.length === 0 ? (
          <p className="font-pixel text-[9px] text-rpg-borderMid text-center py-4">No active missions.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeMissions.map((m) => {
              const agent = generals.find((g) => g.id === (m.assignedTo || (m as any).agent_id?.toLowerCase()));
              return (
                <div key={m.id} className="rpg-panel p-3">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
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
                      className="rpg-panel px-3 font-pixel text-[7px] text-red-400 border border-red-400 hover:bg-red-400/20 cursor-pointer disabled:opacity-50 min-h-[44px]"
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

      {/* Recent Missions Log */}
      <div className="rpg-panel mb-6 p-4">
        <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">
          📖 RECENT MISSIONS ({recentMissions.length})
        </h2>
        <div className="flex flex-col gap-2">
          {recentMissions.map((m) => {
            const agent = generals.find((g) => g.id === (m.assignedTo || (m as any).agent_id?.toLowerCase()));
            const statusColor =
              m.status === "completed" ? "text-green-400 border-green-400" :
              m.status === "cancelled" || m.status === "failed" ? "text-red-400 border-red-400" :
              m.status === "active" || m.status === "IN_PROGRESS" ? "text-seer-blue border-seer-blue" :
              "text-rpg-borderMid border-rpg-borderMid";
            return (
              <div key={m.id} className="rpg-panel p-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm shrink-0">{agent?.emoji || "❓"}</span>
                  <span className="font-pixel text-[8px] text-rpg-border truncate">{m.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-pixel text-[7px] text-rpg-borderMid">{m.progress ?? 0}%</span>
                  <span className={`font-pixel text-[7px] px-1 border ${statusColor}`}>{m.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
