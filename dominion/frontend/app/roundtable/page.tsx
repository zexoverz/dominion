import { generals, roundtableMessages } from "../../lib/mock-data";

export default function RoundtablePage() {
  const getGeneral = (id: string) => generals.find((g) => g.id === id)!;
  const voteEmoji: Record<string, string> = { APPROVE: "✅", REJECT: "❌", ABSTAIN: "⚪" };

  return (
    <div>
      <h1 className="text-[14px] text-throne-gold text-glow-gold mb-2">🏰 THE ROUNDTABLE</h1>
      <p className="text-[8px] text-gray-500 mb-8">Where the generals convene to decide the Dominion&apos;s fate.</p>

      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <div className="pixel-border-thin bg-throne-dark p-4 w-48">
            <p className="text-[8px] text-gray-400 mb-4 text-center">⚜️ SEATED</p>
            <div className="flex flex-col gap-3">
              {generals.map((g) => (
                <div key={g.id} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 flex items-center justify-center text-lg"
                    style={{ backgroundColor: g.bgColor }}
                  >
                    {g.emoji}
                  </div>
                  <div>
                    <p className="text-[7px]" style={{ color: g.color }}>{g.name}</p>
                    <p className="text-[6px] text-gray-600">{g.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="pixel-border-thin bg-throne-dark p-4">
            <p className="text-[8px] text-gray-400 mb-4">📜 COUNCIL LOG</p>
            <div className="flex flex-col gap-3 max-h-[600px] overflow-auto">
              {roundtableMessages.map((msg) => {
                const g = getGeneral(msg.generalId);
                return (
                  <div key={msg.id} className="flex gap-3 p-3 bg-throne-black/50">
                    <div
                      className="w-8 h-8 flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: g.bgColor }}
                    >
                      {g.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px]" style={{ color: g.color }}>{g.name}</span>
                        <span className="text-[6px] text-gray-600">{msg.timestamp}</span>
                        {msg.vote && (
                          <span className="text-[7px] ml-auto">
                            {voteEmoji[msg.vote]} {msg.vote}
                          </span>
                        )}
                      </div>
                      <p className="text-[8px] text-gray-300">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pixel-border-thin bg-throne-dark p-4 mt-4">
            <p className="text-[8px] text-gray-400 mb-3">🗳️ VOTE TALLY — Phase 2 Activation</p>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-lg">✅</p>
                <p className="text-[10px] text-green-500">4</p>
                <p className="text-[6px] text-gray-500">APPROVE</p>
              </div>
              <div className="text-center">
                <p className="text-lg">❌</p>
                <p className="text-[10px] text-red-500">0</p>
                <p className="text-[6px] text-gray-500">REJECT</p>
              </div>
              <div className="text-center">
                <p className="text-lg">⚪</p>
                <p className="text-[10px] text-gray-400">1</p>
                <p className="text-[6px] text-gray-500">ABSTAIN</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
