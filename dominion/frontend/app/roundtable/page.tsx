"use client";

import { useState, useEffect } from "react";
import { generals as mockGenerals, roundtableMessages as mockMessages } from "../../lib/mock-data";
import { getGenerals, getRoundtables } from "../../lib/api";
import { mergeGenerals } from "../../lib/merge-generals";
import { getGeneralSprite, SpriteState } from "../../components/sprites";

export default function RoundtablePage() {
  const [generals, setGenerals] = useState(mockGenerals);
  const [roundtableMessages, setRoundtableMessages] = useState(mockMessages);

  useEffect(() => {
    getGenerals().then((d) => setGenerals(mergeGenerals(d))).catch(() => {});
    getRoundtables().then(setRoundtableMessages).catch(() => {});
  }, []);

  const getGeneral = (id: string) => generals.find((g) => g.id === id)!;
  const voteEmoji: Record<string, string> = { APPROVE: "✅", REJECT: "❌", ABSTAIN: "⚪" };

  return (
    <div className="max-w-full overflow-hidden">
      <div className="rpg-panel mb-6 text-center py-4">
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-2">🏰 THE ROUNDTABLE 🏰</h1>
        <p className="text-[9px] font-body text-rpg-border">Where the generals convene to decide the Dominion&apos;s fate.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Generals panel */}
        <div className="md:flex-shrink-0">
          <div className="rpg-panel p-3 md:p-4 md:w-48">
            <p className="text-[8px] font-pixel text-throne-gold mb-3 md:mb-4 text-center text-rpg-shadow">⚜️ SEATED</p>
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
              {generals.map((g) => (
                <div key={g.id} className="flex items-center gap-2 flex-shrink-0" style={{ opacity: g.status === 'OFFLINE' ? 0.4 : 1 }}>
                  <div className="flex-shrink-0">
                    {getGeneralSprite(g.id, g.status === 'ACTIVE' ? 'thinking' : 'idle', 48) || (
                      <div
                        className="w-10 h-10 flex items-center justify-center text-lg"
                        style={{ backgroundColor: g.bgColor, border: `1px solid ${g.color}44` }}
                      >
                        {g.emoji}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[8px] font-pixel whitespace-nowrap text-rpg-shadow" style={{ color: g.color }}>{g.name}</p>
                    <p className="text-[7px] font-body text-rpg-borderMid">{g.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-w-0">
          <div className="rpg-panel p-3 md:p-4">
            <p className="text-[8px] font-pixel text-throne-gold mb-4 text-rpg-shadow">📜 COUNCIL LOG</p>
            <div className="flex flex-col gap-2 max-h-[400px] md:max-h-[600px] overflow-auto">
              {roundtableMessages.map((msg) => {
                const g = getGeneral(msg.generalId);
                if (!g) return null;
                return (
                  <div key={msg.id} className="flex gap-2 md:gap-3 p-2 md:p-3" style={{
                    background: 'linear-gradient(90deg, rgba(16,16,42,0.8), rgba(10,10,30,0.5))',
                    borderLeft: `3px solid ${g.color}66`,
                  }}>
                    <div className="flex-shrink-0">
                      {getGeneralSprite(g.id, 'talking', 48) || (
                        <div
                          className="w-8 h-8 flex items-center justify-center text-lg"
                          style={{ backgroundColor: g.bgColor, border: `1px solid ${g.color}33` }}
                        >
                          {g.emoji}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[8px] font-pixel text-rpg-shadow" style={{ color: g.color }}>{g.name}</span>
                        <span className="text-[7px] font-body text-rpg-borderMid">{msg.timestamp}</span>
                        {msg.vote && (
                          <span className="text-[7px] font-pixel md:ml-auto">
                            {voteEmoji[msg.vote]} {msg.vote}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] font-body text-rpg-border break-words leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vote tally */}
          <div className="rpg-panel p-3 md:p-4 mt-4">
            <p className="text-[8px] font-pixel text-throne-gold mb-3 text-rpg-shadow">🗳️ VOTE TALLY — Phase 2 Activation</p>
            <div className="flex gap-6 justify-center md:justify-start">
              {[
                { emoji: "✅", count: 4, label: "APPROVE", color: "#22c55e" },
                { emoji: "❌", count: 0, label: "REJECT", color: "#dc2626" },
                { emoji: "⚪", count: 1, label: "ABSTAIN", color: "#94a3b8" },
              ].map((v) => (
                <div key={v.label} className="text-center min-w-[44px]">
                  <p className="text-lg">{v.emoji}</p>
                  <p className="font-pixel text-[12px]" style={{ color: v.color }}>{v.count}</p>
                  <p className="text-[7px] font-pixel text-rpg-borderMid">{v.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
