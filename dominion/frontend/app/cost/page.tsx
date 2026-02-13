import { generals, costData, dailyBudget, weeklyBudget, monthlyBudget } from "../../lib/mock-data";
import PixelProgress from "../../components/PixelProgress";

export default function CostPage() {
  const costToday = generals.reduce((s, g) => s + g.costToday, 0);
  const costWeek = costData.reduce((s, e) => s + e.amount, 0);
  const costMonth = costWeek; // mock: same data

  // Daily breakdown by general
  const todayByGeneral = generals
    .map((g) => ({ ...g, cost: g.costToday }))
    .filter((g) => g.cost > 0)
    .sort((a, b) => b.cost - a.cost);

  // Daily totals for chart
  const dailyTotals = costData.reduce((acc, e) => {
    acc[e.date] = (acc[e.date] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  const days = Object.entries(dailyTotals).sort(([a], [b]) => a.localeCompare(b));
  const maxDay = Math.max(...Object.values(dailyTotals));

  return (
    <div>
      <h1 className="text-[14px] text-throne-gold text-glow-gold mb-2">💰 THE TREASURY</h1>
      <p className="text-[8px] text-gray-500 mb-8">Gold spent in service of the Dominion.</p>

      {/* Budget HP Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "DAILY BUDGET", spent: costToday, budget: dailyBudget },
          { label: "WEEKLY BUDGET", spent: costWeek, budget: weeklyBudget },
          { label: "MONTHLY BUDGET", spent: costMonth, budget: monthlyBudget },
        ].map((b) => {
          const pct = (b.spent / b.budget) * 100;
          const color = pct > 80 ? "#dc2626" : pct > 50 ? "#fbbf24" : "#22c55e";
          return (
            <div key={b.label} className="pixel-border-thin bg-throne-dark p-4">
              <div className="flex justify-between text-[7px] text-gray-400 mb-2">
                <span>{b.label}</span>
                <span style={{ color }}>{pct.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-[10px] mb-2">
                <span className="text-throne-goldLight">${b.spent.toFixed(2)}</span>
                <span className="text-gray-600">/ ${b.budget}</span>
              </div>
              <PixelProgress value={b.spent} max={b.budget} color={color} height={20} segments={20} />
              <p className="text-[6px] text-gray-600 mt-2">
                {pct > 80 ? "⚠️ DANGER ZONE" : pct > 50 ? "⚡ MODERATE" : "✅ HEALTHY"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Daily chart (bar chart with divs) */}
      <div className="pixel-border-thin bg-throne-dark p-4 mb-8">
        <h2 className="text-[10px] text-throne-gold mb-4">📈 DAILY EXPENDITURE</h2>
        <div className="flex items-end gap-2 h-40">
          {days.map(([date, total]) => {
            const height = (total / maxDay) * 100;
            return (
              <div key={date} className="flex-1 flex flex-col items-center justify-end h-full">
                <p className="text-[7px] text-throne-goldLight mb-1">${total.toFixed(0)}</p>
                <div
                  className="w-full min-h-[4px]"
                  style={{
                    height: `${height}%`,
                    backgroundColor: "#fbbf24",
                    boxShadow: "0 0 8px #fbbf2444",
                  }}
                />
                <p className="text-[5px] text-gray-600 mt-1">{date.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-general breakdown */}
      <div className="pixel-border-thin bg-throne-dark p-4">
        <h2 className="text-[10px] text-throne-gold mb-4">👥 GENERAL EXPENDITURE (TODAY)</h2>
        <div className="flex flex-col gap-3">
          {todayByGeneral.map((g) => (
            <div key={g.id} className="flex items-center gap-3">
              <span className="text-lg">{g.emoji}</span>
              <span className="text-[8px] w-20" style={{ color: g.color }}>{g.name}</span>
              <div className="flex-1">
                <PixelProgress value={g.cost} max={dailyBudget / 3} color={g.color} height={12} segments={15} />
              </div>
              <span className="text-[9px] text-throne-goldLight w-16 text-right">${g.cost.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-throne-purple mt-4 pt-3 flex justify-between">
          <span className="text-[8px] text-gray-400">TOTAL</span>
          <span className="text-[10px] text-throne-gold">${costToday.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
