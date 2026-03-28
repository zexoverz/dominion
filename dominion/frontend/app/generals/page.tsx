"use client";

import { useState, useEffect } from "react";
import { generals as mockGenerals } from "../../lib/mock-data";
import { getGenerals } from "../../lib/api";
import { mergeGenerals } from "../../lib/merge-generals";
import { getGeneralSprite } from "../../components/sprites";
import Link from "next/link";
import PixelProgress from "../../components/PixelProgress";

export default function GeneralsPage() {
  const [generals, setGenerals] = useState(mockGenerals);

  useEffect(() => {
    getGenerals().then((d) => setGenerals(mergeGenerals(d))).catch(() => {});
  }, []);

  return (
    <div className="max-w-full overflow-hidden">
      <div className="rpg-panel p-4 mb-6 text-center">
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-1">👥 THE SEVEN GENERALS</h1>
        <p className="font-body text-[9px] text-rpg-borderMid">The Dominion&apos;s council of AI agents — each with a purpose.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {generals.map((g) => (
          <Link key={g.id} href={`/generals/${g.id}`}>
            <div className="rpg-panel p-4 hover:translate-y-[-2px] transition-all cursor-pointer" style={{
              borderColor: `${g.color}44`,
              boxShadow: `0 0 12px ${g.color}11`,
            }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0">
                  {getGeneralSprite(g.id, "working", 56) || <span className="text-3xl">{g.emoji}</span>}
                </div>
                <div>
                  <p className="font-pixel text-[10px] text-rpg-shadow" style={{ color: g.color }}>{g.name}</p>
                  <p className="font-body text-[8px] text-rpg-borderMid italic">{g.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: "0 0 4px #22c55e" }} />
                    <span className="font-pixel text-[6px] text-green-400">ACTIVE</span>
                    <span className="font-pixel text-[6px] text-rpg-borderMid ml-1">{g.model}</span>
                  </div>
                </div>
              </div>
              <p className="font-body text-[8px] text-rpg-border leading-relaxed mb-3 line-clamp-2">{g.description}</p>
              {/* Personality mini bars */}
              <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                {Object.entries(g.personality).slice(0, 3).map(([trait, val]) => (
                  <div key={trait}>
                    <p className="font-pixel text-[5px] text-rpg-borderMid uppercase">{trait}</p>
                    <PixelProgress value={val as number} color={g.color} height={4} segments={10} />
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
