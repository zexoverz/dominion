"use client";

import { useState, useEffect } from "react";
import { generals as mockGenerals, missions as mockMissions } from "../../../lib/mock-data";
import { getGenerals, getGeneral, getMissions, getEvents, getRelationships } from "../../../lib/api";
import { mergeGenerals } from "../../../lib/merge-generals";
import { mergeMissions } from "../../../lib/merge-missions";
import PixelProgress from "../../../components/PixelProgress";
import SpriteStage from "../../../components/sprites/SpriteStage";
import { getGeneralSprite, SpriteState } from "../../../components/sprites";
import Link from "next/link";

const GENERAL_LORE: Record<string, string> = {
  THRONE: "The Sovereign Eye, first among generals. THRONE sees all threads of the Dominion and weaves them into destiny. Born from Lord Zexo\u2019s vision of strategic command, THRONE orchestrates every mission, every proposal, every decision.",
  SEER: "The Oracle of Markets. SEER peers through the veil of chaos to find patterns in the noise. Armed with data feeds and sentiment engines, SEER tracks Bitcoin\u2019s pulse and whispers prophetic insights to Lord Zexo.",
  PHANTOM: "The Shadow Guardian. PHANTOM moves unseen through the infrastructure, testing defenses, patching vulnerabilities, deploying code in silence. When systems sleep, PHANTOM watches.",
  GRIMOIRE: "The Keeper of Knowledge. GRIMOIRE devours documentation, researches protocols, and synthesizes wisdom from chaos. Every EIP, every codebase, every curriculum passes through GRIMOIRE\u2019s pages.",
  ECHO: "The Voice of the Dominion. ECHO shapes how the world perceives Lord Zexo\u2019s empire. Content strategy, brand positioning, community engagement \u2014 ECHO ensures the message resonates.",
  MAMMON: "The Golden Arbiter. MAMMON guards the treasury with mathematical precision. Every satoshi is tracked, every DCA scheduled, every war chest trigger calculated. Wealth is a weapon, and MAMMON keeps it sharp.",
  "WRAITH-EYE": "The Eternal Watcher. WRAITH-EYE monitors every heartbeat of every service. Uptime, latency, SSL certs, response times \u2014 nothing escapes WRAITH-EYE\u2019s gaze.",
};

interface Mission {
  id: string;
  agent_id: string;
  title: string;
  description?: string;
  status: string;
  progress_pct: number;
  priority: number;
  estimated_cost_usd?: string;
  actual_cost_usd?: string;
  created_at: string;
  completed_at?: string | null;
}

interface DominionEvent {
  id: string;
  agent_id: string;
  kind: string;
  title: string;
  summary?: string | null;
  cost_usd?: string;
  created_at: string;
}

interface Relationship {
  id: string;
  agent_a: string;
  agent_b: string;
  affinity: string;
  interaction_count: number;
  last_interaction_at?: string | null;
}

export default function GeneralDetail({ params }: { params: { id: string } }) {
  const [generals, setGenerals] = useState(mockGenerals);
  const [missions, setMissions] = useState(mockMissions);
  const [generalData, setGeneralData] = useState(() => mockGenerals.find((g) => g.id === params.id));
  const [apiMissions, setApiMissions] = useState<Mission[]>([]);
  const [apiEvents, setApiEvents] = useState<DominionEvent[]>([]);
  const [apiRelationships, setApiRelationships] = useState<Relationship[]>([]);
  const [spriteState, setSpriteState] = useState<SpriteState>('idle');
  const spriteStates: SpriteState[] = ['idle', 'working', 'thinking', 'walking', 'talking', 'celebrating'];

  useEffect(() => {
    getGeneral(params.id).then((d) => {
      if (d?.role) setGeneralData(d);
    }).catch(() => {});
    getGenerals().then((d) => setGenerals(mergeGenerals(d))).catch(() => {});
    getMissions().then((d) => {
      setMissions(mergeMissions(d));
      setApiMissions(Array.isArray(d) ? d : []);
    }).catch(() => {});
    getEvents().then((d) => setApiEvents(Array.isArray(d) ? d : [])).catch(() => {});
    getRelationships().then((d) => setApiRelationships(Array.isArray(d) ? d : [])).catch(() => {});
  }, [params.id]);

  const general = generalData || generals.find((g) => g.id === params.id);
  if (!general) {
    return <div className="font-pixel text-[10px] text-throne-red">⚠️ GENERAL NOT FOUND</div>;
  }

  const generalId = params.id;
  const generalIdUpper = params.id?.toUpperCase();

  // Use API data if available, fall back to mock
  const generalMissions = apiMissions.length > 0
    ? apiMissions.filter((m) => m.agent_id === generalId || m.agent_id === generalIdUpper || m.agent_id === generalId?.toLowerCase())
    : missions.filter((m) => m.assignedTo === general.id || m.assignedTo === general.id?.toLowerCase());

  const generalEvents = apiEvents.filter((e) => e.agent_id === generalId || e.agent_id === generalIdUpper || e.agent_id === generalId?.toLowerCase());

  const generalRelationships = apiRelationships.filter(
    (r) => r.agent_a === generalId || r.agent_b === generalId ||
           r.agent_a === generalIdUpper || r.agent_b === generalIdUpper
  );

  // RPG Stats computation
  const completedMissions = apiMissions.length > 0
    ? (generalMissions as Mission[]).filter((m) => m.status === 'completed').length
    : generalMissions.filter((m: any) => m.status === 'COMPLETE' || m.status === 'completed').length;
  const totalMissions = generalMissions.length;
  const totalEvents = generalEvents.length;
  const reportCount = generalEvents.filter((e) => e.kind === 'report').length;
  const totalCost = generalEvents.reduce((sum, e) => sum + parseFloat(e.cost_usd || '0'), 0);
  const sortedEvents = [...generalEvents].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const lastSeen = sortedEvents.length > 0 ? sortedEvents[0].created_at : null;

  const personality = Object.entries((general as any).personality || {});
  const lore = GENERAL_LORE[generalIdUpper] || GENERAL_LORE[generalId] || null;

  function formatTime(dateStr: string) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  }

  function timeAgo(dateStr: string) {
    try {
      const now = Date.now();
      const then = new Date(dateStr).getTime();
      const diff = now - then;
      const mins = Math.floor(diff / 60000);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch { return dateStr; }
  }

  function kindEmoji(kind: string) {
    const map: Record<string, string> = {
      mission_completed: '✅', step_completed: '⚡', heartbeat: '💓',
      cost_alert: '💰', trigger_fired: '🎯', conversation_joined: '💬',
      report: '📋',
    };
    return map[kind] || '📌';
  }

  // Compute stat bar values (0-100)
  const missionScore = totalMissions > 0 ? Math.min(100, Math.round((completedMissions / Math.max(totalMissions, 1)) * 100)) : 0;
  const activityScore = Math.min(100, totalEvents * 5);
  const reportScore = Math.min(100, reportCount * 10);
  const bondScore = Math.min(100, generalRelationships.length * 20);

  return (
    <div className="max-w-full overflow-hidden">
      <Link href="/" className="font-pixel text-[9px] text-rpg-borderMid hover:text-throne-gold mb-4 inline-flex items-center min-h-[44px] gap-2">
        <span className="rpg-cursor">▶</span> BACK TO THRONE ROOM
      </Link>

      {/* Character Header */}
      <div className="rpg-panel p-4 md:p-6 mb-6">
        <div className="flex flex-col items-center mb-4">
          <SpriteStage
            generalId={general.id}
            name={general.name}
            state={spriteState}
            actionText={(general as any).currentMission || `${spriteState}...`}
            status={(general as any).status === 'ACTIVE' ? 'online' : (general as any).status === 'IDLE' ? 'idle' : 'offline'}
            size={192}
          />
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {spriteStates.map((s) => (
              <button
                key={s}
                onClick={() => setSpriteState(s)}
                className={`font-pixel text-[8px] px-3 py-1.5 border transition-colors min-h-[32px] ${
                  spriteState === s
                    ? 'text-throne-gold border-throne-gold bg-throne-gold/10'
                    : 'text-rpg-borderMid border-rpg-borderDark hover:text-rpg-border hover:border-rpg-border'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-pixel text-[14px] md:text-[16px] mb-1 text-rpg-shadow" style={{ color: (general as any).color || '#fbbf24' }}>
              {general.emoji} {general.name}
            </h1>
            <p className="font-body text-[10px] text-rpg-border italic mb-3">{general.title}</p>
            <div className="flex gap-2 md:gap-3 items-center flex-wrap mb-3">
              <span className={`w-3 h-3 status-${((general as any).status || 'IDLE').toLowerCase()}`} />
              <span className="font-pixel text-[8px] text-rpg-border">{(general as any).status || 'IDLE'}</span>
              <span className="font-pixel text-[8px] px-2 py-0.5 bg-rpg-borderDark/30 text-throne-goldLight border border-rpg-borderDark">{general.model}</span>
              {(general as any).role && (
                <span className="font-pixel text-[8px] px-2 py-0.5 bg-throne-gold/10 text-throne-gold border border-throne-gold/30">
                  {(general as any).domain?.[0]?.toUpperCase() || 'GENERAL'}
                </span>
              )}
            </div>
            <p className="font-body text-[9px] text-rpg-border max-w-lg break-words leading-relaxed">
              {(general as any).role || (general as any).description || 'Awaiting orders...'}
            </p>
            {(general as any).domain && (general as any).domain.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(general as any).domain.slice(0, 6).map((d: string) => (
                  <span key={d} className="font-pixel text-[7px] px-2 py-0.5 bg-rpg-borderDark/20 text-rpg-borderMid border border-rpg-borderDark/50">
                    {d}
                  </span>
                ))}
                {(general as any).domain.length > 6 && (
                  <span className="font-pixel text-[7px] text-rpg-borderMid">+{(general as any).domain.length - 6} more</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lore Panel */}
      {lore && (
        <div className="mb-6 relative" style={{ border: '2px solid #b8860b', background: 'linear-gradient(135deg, rgba(16,16,42,0.9) 0%, rgba(30,20,10,0.8) 100%)' }}>
          <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
          <div className="absolute bottom-0 left-0 w-full h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
          <div className="p-4 md:p-6">
            <h2 className="font-pixel text-[10px] text-throne-gold mb-3 text-rpg-shadow flex items-center gap-2">
              <span>📜</span> LORE
            </h2>
            <p className="font-body text-[10px] text-rpg-border italic leading-relaxed" style={{ color: '#d4a574' }}>
              &ldquo;{lore}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* RPG Character Sheet Stats */}
      <div className="mb-6" style={{ border: '2px solid #5a4a3a', background: 'rgba(16,16,42,0.7)' }}>
        <div className="p-4 md:p-6">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow flex items-center gap-2">
            <span>⚔️</span> CHARACTER SHEET
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
            {[
              { label: "QUESTS", value: `${completedMissions}/${totalMissions}`, icon: "🗡️" },
              { label: "EVENTS", value: totalEvents.toString(), icon: "⚡" },
              { label: "REPORTS", value: reportCount.toString(), icon: "📋" },
              { label: "BONDS", value: generalRelationships.length.toString(), icon: "🤝" },
              { label: "COST (USD)", value: `$${totalCost.toFixed(2)}`, icon: "💰" },
              { label: "LAST SEEN", value: lastSeen ? timeAgo(lastSeen) : "—", icon: "👁️" },
            ].map((s) => (
              <div key={s.label} className="text-center p-2" style={{ border: '1px solid #3a3a5a', background: 'rgba(16,16,42,0.5)' }}>
                <span className="text-lg">{s.icon}</span>
                <p className="font-pixel text-[12px] text-throne-goldLight text-rpg-shadow mt-1">{s.value}</p>
                <p className="font-pixel text-[7px] text-rpg-borderMid mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "QUEST MASTERY", value: missionScore, color: "#22c55e" },
              { label: "ACTIVITY", value: activityScore, color: "#3b82f6" },
              { label: "INTELLIGENCE", value: reportScore, color: "#a855f7" },
              { label: "DIPLOMACY", value: bondScore, color: "#f59e0b" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-[8px] font-pixel text-rpg-borderMid mb-1">
                  <span>{stat.label}</span>
                  <span style={{ color: stat.color }}>{stat.value}/100</span>
                </div>
                <PixelProgress value={stat.value} color={stat.color} height={12} segments={20} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Personality Stats */}
        {personality.length > 0 && (
          <div className="rpg-panel p-3 md:p-4">
            <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">🧠 PERSONALITY</h2>
            <div className="flex flex-col gap-3">
              {personality.map(([trait, value]) => (
                <div key={trait}>
                  <div className="flex justify-between text-[8px] font-pixel text-rpg-borderMid mb-1">
                    <span className="uppercase">{trait}</span>
                    <span className="text-throne-goldLight">{String(value)}</span>
                  </div>
                  <PixelProgress value={value as number} color={(general as any).color || "#fbbf24"} height={12} segments={20} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relationships from API */}
        <div className="rpg-panel p-3 md:p-4">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">🤝 BONDS</h2>
          {generalRelationships.length === 0 ? (
            <p className="font-body text-[9px] text-rpg-borderMid italic">No bonds forged yet...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {generalRelationships
                .sort((a, b) => parseFloat(b.affinity) - parseFloat(a.affinity))
                .map((rel) => {
                  const otherId = rel.agent_a === generalId || rel.agent_a === generalIdUpper ? rel.agent_b : rel.agent_a;
                  const other = generals.find((g) => g.id === otherId || g.id === otherId?.toUpperCase());
                  const affinityPct = Math.round(parseFloat(rel.affinity) * 100);
                  return (
                    <div key={rel.id} className="flex items-center gap-2 md:gap-3">
                      <span className="text-lg flex-shrink-0">{other?.emoji || '❓'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[8px] font-pixel text-rpg-borderMid mb-1">
                          <Link href={`/generals/${otherId}`} className="text-rpg-shadow hover:text-throne-gold transition-colors" style={{ color: (other as any)?.color || '#94a3b8' }}>
                            {other?.name || otherId}
                          </Link>
                          <span>{affinityPct}/100</span>
                        </div>
                        <PixelProgress value={affinityPct} color={affinityPct > 70 ? "#22c55e" : affinityPct > 40 ? "#fbbf24" : "#dc2626"} height={8} segments={10} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Mission History */}
        <div className="rpg-panel p-3 md:p-4 lg:col-span-2">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📜 QUEST LOG</h2>
          {generalMissions.length === 0 ? (
            <p className="font-body text-[9px] text-rpg-borderMid italic">No quests yet. Awaiting activation...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {(apiMissions.length > 0
                ? (generalMissions as Mission[]).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)
                : generalMissions
              ).map((m: any) => {
                const status = m.status || '';
                const statusUpper = status.toUpperCase();
                const isComplete = statusUpper === 'COMPLETED' || statusUpper === 'COMPLETE';
                const isActive = statusUpper === 'ACTIVE' || statusUpper === 'IN_PROGRESS';
                const isFailed = statusUpper === 'FAILED';
                const progress = m.progress_pct ?? m.progress ?? 0;
                return (
                  <div key={m.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 p-2 md:p-3"
                    style={{ borderLeft: `3px solid ${isComplete ? '#22c55e' : isActive ? '#fbbf24' : isFailed ? '#dc2626' : '#5a4a3a'}`, background: 'rgba(16,16,42,0.5)' }}>
                    <span className="font-body text-[8px] text-rpg-borderMid sm:w-28 flex-shrink-0">
                      {formatTime(m.created_at || m.createdAt)}
                    </span>
                    <span className="font-pixel text-[8px] text-throne-goldLight flex-1 break-words">{m.title}</span>
                    <div className="flex gap-2 items-center">
                      <span className="font-pixel text-[7px] px-2 py-0.5" style={{
                        color: isComplete ? "#22c55e" : isActive ? "#fbbf24" : isFailed ? "#dc2626" : "#94a3b8",
                        backgroundColor: isComplete ? "#22c55e11" : isActive ? "#fbbf2411" : isFailed ? "#dc262611" : "#94a3b811",
                        border: `1px solid ${isComplete ? "#22c55e33" : isActive ? "#fbbf2433" : isFailed ? "#dc262633" : "#94a3b833"}`,
                      }}>
                        {isComplete ? "✅ " : isActive ? "⚔️ " : isFailed ? "💀 " : "⏳ "}{statusUpper}
                      </span>
                      <span className="font-body text-[8px] text-rpg-borderMid">{progress}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Latest Activity Feed — last 5 events */}
        <div className="rpg-panel p-3 md:p-4 lg:col-span-2">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">⚡ LATEST ACTIVITY</h2>
          {generalEvents.length === 0 ? (
            <p className="font-body text-[9px] text-rpg-borderMid italic">No events recorded yet...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedEvents
                .slice(0, 5)
                .map((e) => (
                  <div key={e.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 p-2 md:p-3"
                    style={{ borderLeft: '3px solid #3a3a5a', background: 'rgba(16,16,42,0.4)' }}>
                    <span className="font-body text-[8px] text-rpg-borderMid sm:w-28 flex-shrink-0">
                      {formatTime(e.created_at)}
                    </span>
                    <span className="text-sm flex-shrink-0">{kindEmoji(e.kind)}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-pixel text-[8px] text-throne-goldLight break-words">{e.title}</span>
                      {e.summary && (
                        <p className="font-body text-[8px] text-rpg-borderMid mt-0.5 break-words">{e.summary}</p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="font-pixel text-[7px] px-2 py-0.5 bg-rpg-borderDark/30 text-rpg-borderMid border border-rpg-borderDark/50">
                        {e.kind.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {e.cost_usd && parseFloat(e.cost_usd) > 0 && (
                        <span className="font-pixel text-[7px] text-throne-gold">${parseFloat(e.cost_usd).toFixed(4)}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Full Event Log */}
        {generalEvents.length > 5 && (
          <div className="rpg-panel p-3 md:p-4 lg:col-span-2">
            <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📖 FULL EVENT LOG</h2>
            <div className="flex flex-col gap-2">
              {sortedEvents
                .slice(5, 15)
                .map((e) => (
                  <div key={e.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 p-2 md:p-3"
                    style={{ borderLeft: '3px solid #3a3a5a', background: 'rgba(16,16,42,0.3)' }}>
                    <span className="font-body text-[8px] text-rpg-borderMid sm:w-28 flex-shrink-0">
                      {formatTime(e.created_at)}
                    </span>
                    <span className="text-sm flex-shrink-0">{kindEmoji(e.kind)}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-pixel text-[8px] text-throne-goldLight break-words">{e.title}</span>
                    </div>
                    <span className="font-pixel text-[7px] px-2 py-0.5 bg-rpg-borderDark/30 text-rpg-borderMid border border-rpg-borderDark/50">
                      {e.kind.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Vital Signs */}
        <div className="rpg-panel p-3 md:p-4 lg:col-span-2">
          <h2 className="font-pixel text-[10px] text-throne-gold mb-4 text-rpg-shadow">📊 VITAL SIGNS</h2>
          <div className="flex flex-wrap gap-6 md:gap-8">
            {[
              { label: "TOTAL QUESTS", value: totalMissions.toString() },
              { label: "COMPLETED", value: completedMissions.toString() },
              { label: "MODEL", value: general.model },
              { label: "PRIORITY", value: `#${(general as any).priority || '—'}` },
              { label: "BONDS", value: generalRelationships.length.toString() },
              { label: "EVENTS", value: totalEvents.toString() },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-pixel text-[7px] text-rpg-borderMid">{s.label}</p>
                <p className="font-pixel text-[14px] text-throne-goldLight text-rpg-shadow">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
