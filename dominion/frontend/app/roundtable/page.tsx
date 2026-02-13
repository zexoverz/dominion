import { generals, roundtableMessages } from "../../lib/mock-data";

export default function RoundtablePage() {
  const getGeneral = (id: string) => generals.find((g) => g.id === id)!;
  const voteEmoji: Record<string, string> = { APPROVE: "✅", REJECT: "❌", ABSTAIN: "⚪" };

  return (
    <div className="max-w-full overflow-hidden">
      <h1 className="text-[12px] md:text-[14px] text-throne-gold text-glow-gold mb-2">🏰 THE ROUNDTABLE</h1>
      <p className="text-[9px] md:text-[8px] text-gray-500 mb-6 md:mb-8">Where the generals convene to decide the Dominion&apos;s fate.</p>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Generals panel — above chat on mobile */}
        <div className="md:flex-shrink-0">
          <div className="pixel-border-thin bg-throne-dark p-3 md:p-4 md:w-48">
            <p className="text-[9px] md:text-[8px] text-gray-400 mb-3 md:mb-4 text-center">⚜️ SEATED</p>
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
              {generals.map((g) => (
                <div key={g.id} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-lg"
                    style={{ backgroundColor: g.bgColor }}
                  >
                    {g.emoji}
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[8px] whitespace-nowrap" style={{ color: g.color }}>{g.name}</p>
                    <p className="text-[8px] md:text-[7px] text-gray-600">{g.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-w-0">
          <div className="pixel-border-thin bg-throne-dark p-3 md:p-4">
            <p className="text-[9px] md:text-[8px] text-gray-400 mb-4">📜 COUNCIL LOG</p>
            <div className="flex flex-col gap-3 max-h-[400px] md:max-h-[600px] overflow-auto">
              {roundtableMessages.map((msg) => {
                const g = getGeneral(msg.generalId);
                return (
                  <div key={msg.id} className="flex gap-2 md:gap-3 p-2 md:p-3 bg-throne-black/50">
                    <div
                      className="w-8 h-8 flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: g.bgColor }}
                    >
                      {g.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[9px] md:text-[8px]" style={{ color: g.color }}>{g.name}</span>
                        <span className="text-[8px] md:text-[7px] text-gray-600">{msg.timestamp}</span>
                        {msg.vote && (
                          <span className="text-[8px] md:text-[7px] md:ml-auto">
                            {voteEmoji[msg.vote]} {msg.vote}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] md:text-[8px] text-gray-300 break-words">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vote tally */}
          <div className="pixel-border-thin bg-throne-dark p-3 md:p-4 mt-4">
            <p className="text-[9px] md:text-[8px] text-gray-400 mb-3">🗳️ VOTE TALLY — Phase 2 Activation</p>
            <div className="flex gap-6 justify-center md:justify-start">
              <div className="text-center min-w-[44px]">
                <p className="text-lg">✅</p>
                <p className="text-[11px] md:text-[10px] text-green-500">4</p>
                <p className="text-[8px] md:text-[7px] text-gray-500">APPROVE</p>
              </div>
              <div className="text-center min-w-[44px]">
                <p className="text-lg">❌</p>
                <p className="text-[11px] md:text-[10px] text-red-500">0</p>
                <p className="text-[8px] md:text-[7px] text-gray-500">REJECT</p>
              </div>
              <div className="text-center min-w-[44px]">
                <p className="text-lg">⚪</p>
                <p className="text-[11px] md:text-[10px] text-gray-400">1</p>
                <p className="text-[8px] md:text-[7px] text-gray-500">ABSTAIN</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
