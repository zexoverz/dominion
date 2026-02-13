import { generals } from "../lib/mock-data";
import GeneralCard from "../components/GeneralCard";
import StatsBar from "../components/StatsBar";

export default function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[14px] text-throne-gold text-glow-gold mb-2">
          👑 THE DOMINION OF LORD ZEXO
        </h1>
        <p className="text-[8px] text-gray-500">
          Command your generals. Conquer the unknown.
        </p>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Phase Banner */}
      <div className="pixel-border-gold bg-throne-purple/30 p-4 mb-6 text-center">
        <p className="text-[8px] text-throne-goldLight mb-2">⚔️ PHASE 1: THE FIRST THREE ⚔️</p>
        <div className="flex justify-center gap-6">
          {generals.slice(0, 3).map((g) => (
            <div key={g.id} className="text-center">
              <span className="text-2xl">{g.emoji}</span>
              <p className="text-[7px] mt-1" style={{ color: g.color }}>{g.name}</p>
            </div>
          ))}
          <div className="border-l-2 border-throne-purple" />
          {generals.slice(3).map((g) => (
            <div key={g.id} className="text-center opacity-30">
              <span className="text-2xl">{g.emoji}</span>
              <p className="text-[7px] mt-1 text-gray-600">{g.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generals Grid */}
      <h2 className="text-[10px] text-gray-400 mb-4">📋 THE GENERALS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {generals.map((g) => (
          <GeneralCard key={g.id} general={g} />
        ))}
      </div>
    </div>
  );
}
