import { missions } from "../../lib/mock-data";
import QuestCard from "../../components/QuestCard";

export default function MissionsPage() {
  const grouped = {
    IN_PROGRESS: missions.filter((m) => m.status === "IN_PROGRESS"),
    REVIEW: missions.filter((m) => m.status === "REVIEW"),
    PROPOSED: missions.filter((m) => m.status === "PROPOSED"),
    COMPLETE: missions.filter((m) => m.status === "COMPLETE"),
  };

  return (
    <div>
      <h1 className="text-[14px] text-throne-gold text-glow-gold mb-2">⚔️ MISSION BOARD</h1>
      <p className="text-[8px] text-gray-500 mb-8">Active quests and campaigns of the Dominion.</p>

      {Object.entries(grouped).map(([status, items]) => (
        items.length > 0 && (
          <div key={status} className="mb-8">
            <h2 className="text-[10px] text-gray-400 mb-4 border-b-2 border-throne-purple pb-2">
              {status.replace("_", " ")} ({items.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {items.map((m) => (
                <QuestCard key={m.id} mission={m} />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
