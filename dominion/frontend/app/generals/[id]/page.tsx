import { generals, missions } from "../../../lib/mock-data";
import PixelProgress from "../../../components/PixelProgress";
import Link from "next/link";

export default function GeneralDetail({ params }: { params: { id: string } }) {
  const general = generals.find((g) => g.id === params.id);
  if (!general) {
    return <div className="text-throne-red text-[11px] md:text-[10px]">⚠️ GENERAL NOT FOUND</div>;
  }

  const generalMissions = missions.filter((m) => m.assignedTo === general.id);
  const personality = Object.entries(general.personality);
  const relationships = Object.entries(general.relationships);

  return (
    <div className="max-w-full overflow-hidden">
      <Link href="/" className="text-[10px] md:text-[9px] text-gray-500 hover:text-throne-gold mb-4 inline-block min-h-[44px] flex items-center">
        ← BACK TO THRONE ROOM
      </Link>

      {/* Header — stack on mobile */}
      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-6 md:mb-8">
        <div
          className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-4xl md:text-5xl flex-shrink-0"
          style={{ backgroundColor: general.bgColor, boxShadow: `0 0 20px ${general.color}44` }}
        >
          {general.emoji}
        </div>
        <div className="min-w-0">
          <h1 className="text-[14px] md:text-[16px] mb-1 break-words" style={{ color: general.color }}>
            {general.emoji} {general.name}
          </h1>
          <p className="text-[10px] md:text-[9px] text-gray-400 mb-2">{general.title}</p>
          <div className="flex gap-2 md:gap-3 items-center flex-wrap">
            <span className={`w-3 h-3 status-${general.status.toLowerCase()}`} />
            <span className="text-[9px] md:text-[8px] text-gray-300">{general.status}</span>
            <span className="text-[9px] md:text-[8px] px-2 py-1 md:py-0.5 bg-throne-purple text-throne-goldLight">{general.model}</span>
            <span className="text-[9px] md:text-[8px] text-gray-500">Phase {general.phase}</span>
          </div>
          <p className="text-[9px] md:text-[8px] text-gray-400 mt-3 max-w-lg break-words">{general.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Personality */}
        <div className="pixel-border-thin bg-throne-dark p-3 md:p-4">
          <h2 className="text-[11px] md:text-[10px] text-throne-gold mb-4">🧠 PERSONALITY MATRIX</h2>
          <div className="flex flex-col gap-3">
            {personality.map(([trait, value]) => (
              <div key={trait}>
                <div className="flex justify-between text-[9px] md:text-[8px] text-gray-400 mb-1">
                  <span className="uppercase">{trait}</span>
                  <span>{value}</span>
                </div>
                <PixelProgress value={value} color={general.color} height={12} segments={20} />
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="pixel-border-thin bg-throne-dark p-3 md:p-4">
          <h2 className="text-[11px] md:text-[10px] text-throne-gold mb-4">🤝 RELATIONSHIPS</h2>
          <div className="flex flex-col gap-3">
            {relationships.map(([id, score]) => {
              const other = generals.find((g) => g.id === id);
              if (!other) return null;
              return (
                <div key={id} className="flex items-center gap-2 md:gap-3">
                  <span className="text-lg flex-shrink-0">{other.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[9px] md:text-[8px] text-gray-400 mb-1">
                      <span>{other.name}</span>
                      <span>{score}/100</span>
                    </div>
                    <PixelProgress value={score} color={score > 70 ? "#22c55e" : score > 40 ? "#fbbf24" : "#dc2626"} height={8} segments={10} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission History */}
        <div className="pixel-border-thin bg-throne-dark p-3 md:p-4 lg:col-span-2">
          <h2 className="text-[11px] md:text-[10px] text-throne-gold mb-4">📜 MISSION HISTORY</h2>
          {generalMissions.length === 0 ? (
            <p className="text-[9px] md:text-[8px] text-gray-600">No missions yet. Awaiting activation...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {generalMissions.map((m) => (
                <div key={m.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 p-2 md:p-3 bg-throne-black/50">
                  <span className="text-[9px] md:text-[8px] text-gray-500 sm:w-20 flex-shrink-0">{m.createdAt}</span>
                  <span className="text-[9px] md:text-[8px] text-throne-goldLight flex-1 break-words">{m.title}</span>
                  <div className="flex gap-2 items-center">
                    <span className="text-[8px] md:text-[7px] px-2 py-0.5" style={{
                      color: m.status === "COMPLETE" ? "#22c55e" : m.status === "IN_PROGRESS" ? "#fbbf24" : "#94a3b8",
                      backgroundColor: m.status === "COMPLETE" ? "#22c55e22" : m.status === "IN_PROGRESS" ? "#fbbf2422" : "#94a3b822",
                    }}>
                      {m.status}
                    </span>
                    <span className="text-[9px] md:text-[8px] text-gray-500">{m.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="pixel-border-thin bg-throne-dark p-3 md:p-4 lg:col-span-2">
          <h2 className="text-[11px] md:text-[10px] text-throne-gold mb-4">📊 VITAL SIGNS</h2>
          <div className="flex flex-wrap gap-6 md:gap-8">
            <div>
              <p className="text-[9px] md:text-[8px] text-gray-500">TOTAL MISSIONS</p>
              <p className="text-[14px] text-throne-goldLight">{general.totalMissions}</p>
            </div>
            <div>
              <p className="text-[9px] md:text-[8px] text-gray-500">COST TODAY</p>
              <p className="text-[14px] text-throne-goldLight">${general.costToday.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[9px] md:text-[8px] text-gray-500">MODEL</p>
              <p className="text-[14px] text-throne-goldLight">{general.model}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
