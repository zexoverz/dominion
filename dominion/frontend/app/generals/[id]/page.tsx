import { generals, missions } from "../../../lib/mock-data";
import PixelProgress from "../../../components/PixelProgress";
import Link from "next/link";

export default function GeneralDetail({ params }: { params: { id: string } }) {
  const general = generals.find((g) => g.id === params.id);
  if (!general) {
    return <div className="text-throne-red text-[10px]">⚠️ GENERAL NOT FOUND</div>;
  }

  const generalMissions = missions.filter((m) => m.assignedTo === general.id);
  const personality = Object.entries(general.personality);
  const relationships = Object.entries(general.relationships);

  return (
    <div>
      <Link href="/" className="text-[8px] text-gray-500 hover:text-throne-gold mb-4 inline-block">
        ← BACK TO THRONE ROOM
      </Link>

      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <div
          className="w-24 h-24 flex items-center justify-center text-5xl"
          style={{ backgroundColor: general.bgColor, boxShadow: `0 0 20px ${general.color}44` }}
        >
          {general.emoji}
        </div>
        <div>
          <h1 className="text-[16px] mb-1" style={{ color: general.color }}>
            {general.emoji} {general.name}
          </h1>
          <p className="text-[9px] text-gray-400 mb-2">{general.title}</p>
          <div className="flex gap-3 items-center">
            <span className={`w-3 h-3 status-${general.status.toLowerCase()}`} />
            <span className="text-[8px] text-gray-300">{general.status}</span>
            <span className="text-[8px] px-2 py-0.5 bg-throne-purple text-throne-goldLight">{general.model}</span>
            <span className="text-[8px] text-gray-500">Phase {general.phase}</span>
          </div>
          <p className="text-[8px] text-gray-400 mt-3 max-w-lg">{general.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality */}
        <div className="pixel-border-thin bg-throne-dark p-4">
          <h2 className="text-[10px] text-throne-gold mb-4">🧠 PERSONALITY MATRIX</h2>
          <div className="flex flex-col gap-3">
            {personality.map(([trait, value]) => (
              <div key={trait}>
                <div className="flex justify-between text-[7px] text-gray-400 mb-1">
                  <span className="uppercase">{trait}</span>
                  <span>{value}</span>
                </div>
                <PixelProgress value={value} color={general.color} height={12} segments={20} />
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="pixel-border-thin bg-throne-dark p-4">
          <h2 className="text-[10px] text-throne-gold mb-4">🤝 RELATIONSHIPS</h2>
          <div className="flex flex-col gap-3">
            {relationships.map(([id, score]) => {
              const other = generals.find((g) => g.id === id);
              if (!other) return null;
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-lg">{other.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-[7px] text-gray-400 mb-1">
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
        <div className="pixel-border-thin bg-throne-dark p-4 lg:col-span-2">
          <h2 className="text-[10px] text-throne-gold mb-4">📜 MISSION HISTORY</h2>
          {generalMissions.length === 0 ? (
            <p className="text-[8px] text-gray-600">No missions yet. Awaiting activation...</p>
          ) : (
            <div className="flex flex-col gap-2">
              {generalMissions.map((m) => (
                <div key={m.id} className="flex items-center gap-4 p-3 bg-throne-black/50">
                  <span className="text-[8px] text-gray-500 w-20">{m.createdAt}</span>
                  <span className="text-[8px] text-throne-goldLight flex-1">{m.title}</span>
                  <span className="text-[7px] px-2 py-0.5" style={{
                    color: m.status === "COMPLETE" ? "#22c55e" : m.status === "IN_PROGRESS" ? "#fbbf24" : "#94a3b8",
                    backgroundColor: m.status === "COMPLETE" ? "#22c55e22" : m.status === "IN_PROGRESS" ? "#fbbf2422" : "#94a3b822",
                  }}>
                    {m.status}
                  </span>
                  <span className="text-[8px] text-gray-500">{m.progress}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="pixel-border-thin bg-throne-dark p-4 lg:col-span-2">
          <h2 className="text-[10px] text-throne-gold mb-4">📊 VITAL SIGNS</h2>
          <div className="flex gap-8">
            <div>
              <p className="text-[7px] text-gray-500">TOTAL MISSIONS</p>
              <p className="text-[14px] text-throne-goldLight">{general.totalMissions}</p>
            </div>
            <div>
              <p className="text-[7px] text-gray-500">COST TODAY</p>
              <p className="text-[14px] text-throne-goldLight">${general.costToday.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[7px] text-gray-500">MODEL</p>
              <p className="text-[14px] text-throne-goldLight">{general.model}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
