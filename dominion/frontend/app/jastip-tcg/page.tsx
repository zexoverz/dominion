"use client";

import { useState } from "react";

const SECTIONS = [
  { id: "overview", label: "📊 OVERVIEW" },
  { id: "cost", label: "💴 COST" },
  { id: "market", label: "📈 MARKET" },
  { id: "products", label: "🃏 PRODUCTS" },
  { id: "sales", label: "🛒 SALES" },
  { id: "profit", label: "💰 PROFIT" },
  { id: "risk", label: "⚠️ RISK" },
  { id: "roadmap", label: "🗺️ ROADMAP" },
];

export default function JastipTcgPage() {
  const [section, setSection] = useState("overview");

  return (
    <div className="max-w-full overflow-hidden pb-20 md:pb-4">
      {/* Header */}
      <div className="rpg-panel p-3 sm:p-4 mb-3 sm:mb-4">
        <h1 className="font-pixel text-[11px] sm:text-[14px] text-throne-gold text-glow-gold mb-2">
          🃏 JASTIP TCG — MASTER PLAN
        </h1>
        <p className="text-[11px] sm:text-xs text-rpg-border font-body leading-relaxed">
          End-to-end research: Pokemon + One Piece TCG arbitrage Japan → Indo. Cost, market, profit, risk, roadmap.
        </p>
        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2 text-[7px] sm:text-[8px] font-pixel">
          <span className="px-2 py-1 bg-throne-gold/10 text-throne-gold border border-throne-gold/30">PHASE 1: PERSONAL TEST</span>
          <span className="px-2 py-1 bg-rpg-borderDark/30 text-rpg-borderMid">CAPITAL: ¥50K-500K/run</span>
          <span className="px-2 py-1 bg-rpg-borderDark/30 text-rpg-borderMid">FREQ: 2-4x/year</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 mb-3 sm:mb-4 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 scrollbar-hide">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`rpg-panel px-3 py-2 font-pixel text-[8px] whitespace-nowrap transition-none min-h-[40px] flex-shrink-0 ${
              section === s.id
                ? "text-throne-gold border-throne-gold bg-throne-gold/10"
                : "text-rpg-borderMid hover:text-rpg-border"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-3 sm:space-y-4">
        {section === "overview" && <Overview />}
        {section === "cost" && <CostAnalysis />}
        {section === "market" && <MarketRead />}
        {section === "products" && <ProductStrategy />}
        {section === "sales" && <SalesChannels />}
        {section === "profit" && <ProfitMath />}
        {section === "risk" && <RiskAssessment />}
        {section === "roadmap" && <Roadmap />}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rpg-panel p-3 sm:p-4">
      <h2 className="font-pixel text-[9px] sm:text-[10px] text-throne-gold text-glow-gold mb-2 sm:mb-3">{title}</h2>
      <div className="text-[11px] sm:text-xs text-rpg-border font-body leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rpg-panel my-2 -mx-1">
      <table className="w-full text-[10px] sm:text-xs min-w-full">
        <thead className="bg-rpg-borderDark/30">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left p-1.5 sm:p-2 font-pixel text-[7px] sm:text-[8px] text-throne-gold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-rpg-borderMid/30">
              {r.map((c, j) => (
                <td key={j} className="p-1.5 sm:p-2 text-rpg-border align-top">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============ OVERVIEW ============
function Overview() {
  return (
    <>
      <Section title="🎯 MISSION">
        <p>
          <strong>Capitalize on Japan TCG retail-Indo arbitrage gap</strong> via 2-4 trips/year.
          Faisal udah natural buyer (Pokemon + OP TCG personal collection — 50+ cards), connections
          (ETHJKT 900+ members + crypto Indo Twitter), capital (FORU TGE + freelance overflow).
        </p>
        <p>
          <strong>Phase 1 target:</strong> validate market 1-2 test runs, prove unit economics,
          build buyer trust. <strong>Phase 4 target (2027):</strong> Rp 50-150M side revenue/year
          + tax-deductible Japan trips.
        </p>
      </Section>

      <Section title="💡 WHY THIS WORKS">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Authenticity edge:</strong> Lu beli Japan-direct, dari Mandarake/Surugaya/BookOff = bukan reseller chain. Indo buyer trust this.</li>
          <li><strong>Tax-free arbitrage:</strong> Hemat 10% di Japan checkout via passport.</li>
          <li><strong>FX advantage:</strong> ¥110-113/Rp = current rate, decent purchasing power.</li>
          <li><strong>Indo TCG demand spike:</strong> Pokemon 151 set + OP TCG community 5x growth 2025-2026.</li>
          <li><strong>Travel ROI:</strong> Trip cost partially offset by jastip revenue = effective "paid Japan vacation".</li>
          <li><strong>Personal validation:</strong> Lu udah 47-item BookOff haul Day 7 (¥55K) + Day 12 Tokyo investment grail purchases — proven sourcing capability.</li>
        </ul>
      </Section>

      <Section title="📊 CURRENT STATE (Apr 28 2026)">
        <TableBlock
          headers={["Metric", "Value"]}
          rows={[
            ["Phase", "1 — Personal collection + small-scale validation"],
            ["Trips done", "1 (Apr 21-May 4 2026, COMPLETED)"],
            ["Capital deployed", "~¥80-150K personal aesthetic + investment grails"],
            ["Indo network", "ETHJKT 900+, crypto Twitter, OP/Pokemon Discord"],
            ["Sales test runs", "0 (validation pending)"],
            ["Brand identity", "Not formed — opportunity to build"],
          ]}
        />
      </Section>
    </>
  );
}

// ============ COST ANALYSIS ============
function CostAnalysis() {
  return (
    <>
      <Section title="💴 PER-TRIP COST BREAKDOWN">
        <p>Realistic Japan trip 7-14 days, Tokyo + Osaka + Kyoto/Hida region for sourcing diversity.</p>
        <TableBlock
          headers={["Item", "Lean", "Standard", "Premium"]}
          rows={[
            ["Flight Jakarta⇄Tokyo", "Rp 8M", "Rp 10M", "Rp 14M"],
            ["Hotel 7 nights", "Rp 5M", "Rp 9M", "Rp 18M"],
            ["Food 7 days", "Rp 2.5M", "Rp 4M", "Rp 8M"],
            ["Local transport", "Rp 1.5M", "Rp 2.5M", "Rp 4M"],
            ["Misc + buffer", "Rp 1M", "Rp 2M", "Rp 3M"],
            ["TRIP SUBTOTAL", "Rp 18M", "Rp 27.5M", "Rp 47M"],
          ]}
        />
      </Section>

      <Section title="🃏 PRODUCT CAPITAL (per run)">
        <TableBlock
          headers={["Tier", "Capital", "Mix", "Volume"]}
          rows={[
            ["Test Run", "Rp 10-20M", "60% sealed / 40% singles", "3-5 boxes + 20-30 singles"],
            ["Standard Run", "Rp 30-50M", "50/30/20", "8-12 boxes + 50 singles + 2-3 PSA"],
            ["Aggressive Run", "Rp 80-150M", "40/30/30", "20+ boxes + 100 singles + 5-10 PSA"],
          ]}
        />
      </Section>

      <Section title="📦 LOGISTICS COST">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Carry-on hand-luggage:</strong> FREE — 7-10kg, fit 5-10 sealed boxes + 100 singles. Optimal test run.</li>
          <li><strong>Checked luggage extra:</strong> Rp 1-2M per koper 23kg, masuk 15-25 sealed boxes.</li>
          <li><strong>Air freight:</strong> Rp 50-150K/kg via DHL/JAL Cargo, 3-5 hari. Customs flag risk.</li>
          <li><strong>Indo customs:</strong> Personal goods ≤$500 USD = duty-free. Above = 7.5% + PPN 11% + PPh = ~25-30% total.</li>
          <li><strong>Smart approach:</strong> Carry-on + checked = stay under personal allowance, declare honestly.</li>
        </ul>
      </Section>

      <Section title="🇮🇩 INDO OPERATING COSTS">
        <TableBlock
          headers={["Item", "Cost", "Notes"]}
          rows={[
            ["Marketplace fees", "3-7%", "Shopee 4-6%, Tokopedia 3-5%"],
            ["Payment processing", "1-3%", "COD vs transfer vs OVO"],
            ["Shipping", "Rp 20-50K/order", "JNE/J&T, buyer cover"],
            ["Storage", "Rp 0-500K/bln", "Phase 1: rumah"],
            ["Marketing", "Rp 0-2M/bln", "Phase 1: organic"],
            ["Auth tools", "Rp 1-2M one-time", "UV light, magnifier, scale"],
          ]}
        />
      </Section>
    </>
  );
}

// ============ MARKET READ ============
function MarketRead() {
  return (
    <>
      <Section title="📈 INDO TCG SNAPSHOT (2026)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Pokemon TCG Indo:</strong> ~150-300K active collectors. Surge post-2023 renaissance.</li>
          <li><strong>One Piece TCG Indo:</strong> ~50-100K active. Faster growth 2024-2026 anime ending hype.</li>
          <li><strong>Demographic:</strong> 70% male 18-35, urban (Jakarta/Surabaya/Bandung), middle-upper income.</li>
          <li><strong>Spending:</strong> Avg Rp 100-500K/month TCG, willing pay 1.5-2.5x Japan retail untuk auth guarantee.</li>
          <li><strong>Pain points:</strong> Local fake risk (40% reported), 2-3x Japan markup, slow new set arrival.</li>
        </ul>
      </Section>

      <Section title="⚔️ COMPETITOR LANDSCAPE">
        <TableBlock
          headers={["Player", "Strength", "Weakness", "Faisal Edge"]}
          rows={[
            ["Big jastip", "Volume", "Generic, no brand", "Personal brand + niche"],
            ["Local TCG shops", "Physical trust", "2.5-3x markup", "1.5-2x pricing"],
            ["Telegram groups", "Community trust", "Limited inv", "Larger drops"],
            ["Solo collectors", "Personal trust", "Sporadic", "Consistent brand"],
            ["Snkrdunk Indo", "Marketplace", "Foreign tax/slow", "Local liquidity"],
          ]}
        />
      </Section>

      <Section title="💰 ARBITRAGE OPPORTUNITY">
        <TableBlock
          headers={["Product", "Japan", "Indo", "Markup"]}
          rows={[
            ["Pokemon 151 Box", "¥10-12K", "Rp 1.8-2.5M", "40-80%"],
            ["Pokemon Crimson Haze", "¥6-8K", "Rp 900K-1.4M", "30-60%"],
            ["OP01 Romance Dawn", "¥15-25K", "Rp 3-5M", "50-80%"],
            ["OP09 Box", "¥6-8K", "Rp 900K-1.3M", "30-50%"],
            ["Charizard ex 215 PSA10", "¥80-120K", "Rp 12-18M", "40-80%"],
            ["Sanji OP06 PSA10", "¥150-250K", "Rp 22-35M", "50-100%"],
            ["Raw mint singles", "¥500-3K", "Rp 100-450K", "50-100%"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs">
          Apr 2026 data, fluctuates ±15%. Verify pre-trip Yuyu-tei/SNKR Dunk/Mercari.
        </p>
      </Section>

      <Section title="🎯 BUYER SEGMENTS">
        <TableBlock
          headers={["Segment", "% market", "Spend", "Best products"]}
          rows={[
            ["Casual", "50%", "Rp 200-500K", "Sealed boosters"],
            ["Serious", "25%", "Rp 1-3M", "Box, alt art, SP"],
            ["Investors", "15%", "Rp 5-20M", "PSA grails, cases"],
            ["Creators", "5%", "Rp 2-10M", "Box openings"],
            ["Resellers", "5%", "Rp 10-50M", "Bulk cases"],
          ]}
        />
      </Section>
    </>
  );
}

// ============ PRODUCT STRATEGY ============
function ProductStrategy() {
  return (
    <>
      <Section title="🃏 SEALED vs SINGLES vs PSA">
        <TableBlock
          headers={["Aspect", "Sealed", "Singles", "PSA Grails"]}
          rows={[
            ["Capital eff", "Med", "High", "Low"],
            ["Markup", "30-80%", "50-100%", "40-100%"],
            ["Liquidity", "⭐⭐⭐ Fast", "⭐⭐ Med", "⭐ Slow premium"],
            ["Risk fake", "Low", "Med (auth)", "Low (PSA)"],
            ["Sell time", "1-2 wk", "2-6 wk", "4-12 wk"],
            ["Customs flag", "Higher", "Lower", "Lower"],
            ["Best for", "Casual", "Mid coll", "Investors"],
          ]}
        />
      </Section>

      <Section title="⭐ TOP BUY TARGETS 2026">
        <p><strong>POKEMON:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Pokemon 151 Japanese sealed box</li>
          <li>Crimson Haze (current set strong)</li>
          <li>Mask of Change (emerald art rare)</li>
          <li>Raw: Charizard 151, Mew SAR, Gardevoir SAR</li>
          <li>PSA 10: Charizard ex 215, Lugia V SAR, Pikachu V SAR</li>
          <li>Vintage: Base Set 1996 raw NM (BookOff treasure)</li>
        </ul>
        <p className="mt-2"><strong>ONE PIECE:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>OP01 Romance Dawn (foundational, scarce)</li>
          <li>OP05 Awakening (popular)</li>
          <li>OP09 Emperor (Luffy manga art)</li>
          <li>Manga art parallels (PRB02 series)</li>
          <li>Mini manga art (JP exclusive)</li>
          <li>PSA 10: Sanji OP06, Luffy OP09, Shanks OP01</li>
        </ul>
      </Section>

      <Section title="❌ SKIP / AVOID">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>English sets</strong> — sourced Indo, no arbitrage</li>
          <li><strong>Promo bulk low-tier</strong> — Indo saturated</li>
          <li><strong>Sealed cases (12+)</strong> — customs flag commercial</li>
          <li><strong>Common parallels</strong> — markup low</li>
          <li><strong>Edge wear cards</strong> — Indo strict mint</li>
          <li><strong>Yu-Gi-Oh JP</strong> — Indo market weak</li>
        </ul>
      </Section>

      <Section title="🛒 BEST SOURCING JAPAN">
        <TableBlock
          headers={["Shop", "Best for", "Tier", "Auth"]}
          rows={[
            ["Mandarake (Akiba)", "Vintage + PSA", "Premium", "⭐⭐⭐"],
            ["Surugaya (multi)", "Raw bulk", "Mid", "⭐⭐"],
            ["BookOff", "Treasure hunt", "Low", "⭐⭐ Variable"],
            ["Hareruya Akiba", "Pokemon high", "Premium", "⭐⭐⭐"],
            ["Pokemon Center", "New sealed", "Retail", "⭐⭐⭐"],
            ["Yuyu-tei online", "OP raw + price ref", "Mid", "⭐⭐"],
            ["Mercari Japan", "Bulk lots", "Variable", "⭐ Risky"],
          ]}
        />
      </Section>
    </>
  );
}

// ============ SALES CHANNELS ============
function SalesChannels() {
  return (
    <>
      <Section title="🛒 CHANNEL STRATEGY">
        <TableBlock
          headers={["Channel", "Audience", "Markup", "Velocity", "Best"]}
          rows={[
            ["Twitter/X", "Crypto+anime", "50-80%", "Fast", "Hyped sealed+grails"],
            ["Instagram", "Visual coll", "60-80%", "Med", "PSA+alt art"],
            ["TikTok Shop", "Younger casual", "40-60%", "Fast impulse", "Sealed+cheap singles"],
            ["Telegram", "Serious coll", "40-60%", "Fast", "Bulk drops+early"],
            ["Discord", "Inner premium", "30-50%", "Med", "PSA+investment"],
            ["Shopee/Tokped", "Mass", "40-50%", "Slow", "Sealed+popular"],
            ["FB Marketplace", "Bargain", "30-40%", "Slow", "Clearance"],
          ]}
        />
      </Section>

      <Section title="🎯 RECOMMENDED MIX">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Phase 1-2:</strong> Twitter/X + Telegram + IG. Lean ETHJKT 900+ network.</li>
          <li><strong>Phase 3:</strong> Add Tokopedia + TikTok lives. Brand "@zexotcg".</li>
          <li><strong>Phase 4:</strong> Discord premium tier + Shopee Mall + content team.</li>
          <li><strong>Avoid:</strong> Bukalapak (low engagement), random WA (no scale).</li>
        </ul>
      </Section>

      <Section title="💎 BRAND POSITIONING">
        <p>
          <strong>USP:</strong> "BTC maxi blockchain dev brings authentic Japan TCG to Indo.
          Direct Mandarake/Hareruya/Pokemon Center sourcing. Pre-shipment auth video.
          1.5-2x Japan retail (vs local 2.5-3x). Crypto/QR pay accepted."
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1 mt-2">
          <li>Trust signals: Public Twitter, Strava Japan trips, ETHJKT identity</li>
          <li>Story content: Mandarake hunt vlogs, BookOff steals</li>
          <li>Auth: Unboxing video pre-ship, PSA grade visible</li>
          <li>Pricing transparency: Show source price + markup</li>
          <li>Crypto-native: USDT/BTC/IDRT accepted</li>
        </ul>
      </Section>

      <Section title="📅 SALES TIMING">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Pre-trip teaser:</strong> Twitter "Sourcing Japan [date], requests open". Pre-orders.</li>
          <li><strong>In-trip updates:</strong> Story/Reels each shop, auth narrative.</li>
          <li><strong>Day 1 post-arrival:</strong> Drop + 72h reservation window.</li>
          <li><strong>Week 1:</strong> Fulfill orders + push remaining marketplace.</li>
          <li><strong>Week 2-4:</strong> Slow movers via Marketplace + Telegram bulk.</li>
          <li><strong>Target:</strong> 70% liquidated 4 weeks post-trip.</li>
        </ul>
      </Section>
    </>
  );
}

// ============ PROFIT MATH ============
function ProfitMath() {
  return (
    <>
      <Section title="💰 3 SCENARIOS">
        <p>Realistic per-trip profit, 4 weeks sell-through, all costs deducted.</p>
      </Section>

      <Section title="🟢 SCENARIO A — Test Run">
        <TableBlock
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (allocated)", "Rp 5M"],
            ["Capital products", "Rp 15M"],
            ["Tax-free saving", "+Rp 1.5M"],
            ["Logistics", "Rp 0"],
            ["Customs", "Rp 0"],
            ["Selling gross", "Rp 24M (60% markup)"],
            ["Marketplace fees 5%", "-Rp 1.2M"],
            ["NET REVENUE", "Rp 22.8M"],
            ["NET COST", "Rp 18.5M"],
            ["📊 PROFIT", "Rp 4.3M"],
            ["ROI", "23%"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs mt-2">
          Modest tapi proves model. Validates supply, demand, Indo trust.
        </p>
      </Section>

      <Section title="🟡 SCENARIO B — Standard Run">
        <TableBlock
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (50%)", "Rp 12M"],
            ["Capital products", "Rp 40M"],
            ["Tax-free saving", "+Rp 4M"],
            ["Logistics", "Rp 1.5M"],
            ["Customs partial", "Rp 2M"],
            ["Selling gross", "Rp 72M (80% markup)"],
            ["Marketplace fees", "-Rp 3.6M"],
            ["Marketing", "Rp 1M"],
            ["NET REVENUE", "Rp 67.4M"],
            ["NET COST", "Rp 51.5M"],
            ["📊 PROFIT", "Rp 15.9M"],
            ["ROI", "31%"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs mt-2">
          Sweet spot. 2-4x/year = Rp 32-64M annual revenue.
        </p>
      </Section>

      <Section title="🔴 SCENARIO C — Aggressive Run">
        <TableBlock
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (full)", "Rp 25M"],
            ["Capital products", "Rp 120M (FORU TGE)"],
            ["Tax-free saving", "+Rp 12M"],
            ["Logistics + freight", "Rp 4M"],
            ["Customs commercial", "Rp 12M"],
            ["Selling gross", "Rp 220M (90% markup)"],
            ["Marketplace fees", "-Rp 11M"],
            ["Marketing", "Rp 3M"],
            ["NET REVENUE", "Rp 206M"],
            ["NET COST", "Rp 161M"],
            ["PROFIT (success)", "Rp 45M"],
            ["PROFIT (30% fail)", "Rp 18M"],
            ["ROI", "28%"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs mt-2">
          High capital high return. Liquidity risk — only attempt post Phase 2-3.
        </p>
      </Section>

      <Section title="📊 ANNUAL PROJECTION">
        <TableBlock
          headers={["Year", "Trips", "Mode", "Profit"]}
          rows={[
            ["2026", "1", "Test", "Rp 4-8M"],
            ["2027", "2-3", "Standard", "Rp 30-50M"],
            ["2028", "3-4", "Std + 1 Aggr", "Rp 60-100M"],
            ["2029", "4", "Aggressive", "Rp 100-150M"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs mt-2">
          By 2029 = Rp 100-150M/year + tax-deductible Japan trips. Comparable to OKU contribution.
        </p>
      </Section>
    </>
  );
}

// ============ RISK ASSESSMENT ============
function RiskAssessment() {
  return (
    <>
      <Section title="⚠️ RISK MATRIX">
        <TableBlock
          headers={["Risk", "Prob", "Impact", "Mitigation"]}
          rows={[
            ["Customs detain", "Med", "High", "Stay under personal allow"],
            ["Auth challenge", "Med", "High", "Mandarake/Hareruya only, video"],
            ["Pokemon crash", "Low-Med", "High", "Diversify OP+grails"],
            ["OP hype peak", "Med", "Med", "Manga ending uncertain timing"],
            ["Inv tied >4wk", "Med", "Med", "Pre-orders, fast-mover focus"],
            ["Card damage", "Low", "Med", "Hard top-loader+climate bag"],
            ["FX volatility", "Med", "Low", "Hedge partial pre-buy"],
            ["Fake slip BookOff", "Low", "Med", "Auth before sell"],
            ["Indo regulation", "Low", "High", "Monitor BPOM/Bea Cukai"],
            ["Trip burnout", "Med", "Med", "Combine vacation"],
            ["Buyer fraud", "Low", "Low-Med", "COD first 3 trans"],
            ["Brand damage", "Low", "High", "QC strict, refund clear"],
          ]}
        />
      </Section>

      <Section title="🛡️ DEFENSIVE STRATEGIES">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Allowance discipline:</strong> $500 USD declared/trip. Multi-trip safer than mega-haul.</li>
          <li><strong>Auth video archive:</strong> Every PSA + sealed filmed pre-ship. Trust gold.</li>
          <li><strong>Diversify portfolio:</strong> 50% Pokemon / 30% OP / 20% other. Reduces single-game crash.</li>
          <li><strong>Quick liquidity:</strong> Sealed first (fast), grails later (premium).</li>
          <li><strong>Capital reserve:</strong> 25% free for next trip. Avoid forced fire-sale.</li>
          <li><strong>Indo network leverage:</strong> ETHJKT + Discord = trust pre-built.</li>
          <li><strong>Track everything:</strong> Spreadsheet/Dominion finance. KPI: ROI/item, sell-through days.</li>
        </ul>
      </Section>
    </>
  );
}

// ============ ROADMAP ============
function Roadmap() {
  return (
    <>
      <Section title="🗺️ 4-PHASE ROADMAP">
        <p>Build slow, validate each phase before scaling capital.</p>
      </Section>

      <Section title="🌱 PHASE 1: VALIDATION (Apr-Jul 2026)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>✅ Apr 21-May 4 trip: Personal aesthetic Gifu BookOff (¥55K) + Tokyo grails Day 12-13 — DONE</li>
          <li>📋 May 2026: Catalog purchases, photo + auth video</li>
          <li>📋 May-Jun 2026: First test sale Twitter/Telegram (5-10 items)</li>
          <li>📋 Jul 2026: Analyze unit economics, refine listing format</li>
          <li><strong>Capital:</strong> Rp 15-20M</li>
          <li><strong>Goal:</strong> Validate demand, build buyer list 20-30</li>
        </ul>
      </Section>

      <Section title="🌿 PHASE 2: BRAND BUILDING (Aug 2026 - Feb 2027)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>📋 Aug 2026: Brand handle (@zexotcg). Launch IG + Telegram.</li>
          <li>📋 Sep 2026: Trip 2 Japan. Standard run Rp 30-40M.</li>
          <li>📋 Oct-Nov 2026: Sell-through cycle. Content marketing.</li>
          <li>📋 Dec 2026 - Feb 2027: Trip 3 (winter). Sealed-heavy mix.</li>
          <li><strong>Capital:</strong> Rp 30-50M per trip</li>
          <li><strong>Goal:</strong> 100+ buyer base, Rp 30-50M annual profit</li>
        </ul>
      </Section>

      <Section title="🌳 PHASE 3: SCALE (Mar-Dec 2027)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>📋 Mar 2027: Tokopedia/Shopee storefront. Hire content creator.</li>
          <li>📋 Apr 2027: Trip 4 (combine wedding pre-prep with Keiko)</li>
          <li>📋 May-Jul 2027: Scale 1500+ buyer base, Rp 60-100M/run</li>
          <li>📋 Aug 2027: Test air freight bulk (Lebaran demand spike)</li>
          <li>📋 Sep-Dec 2027: 4th trip + holiday season push</li>
          <li><strong>Capital:</strong> Rp 80-120M per trip</li>
          <li><strong>Goal:</strong> Rp 60-100M annual. Wedding July 2027 partial funded.</li>
        </ul>
      </Section>

      <Section title="🌲 PHASE 4: MATURE (2028+)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>📋 Q1 2028: Hire VA Indo for fulfillment + CS</li>
          <li>📋 Q2 2028: Setup PT/CV business entity</li>
          <li>📋 Q3 2028: Diversify Korea/HK trips</li>
          <li>📋 Q4 2028: Premium Discord tier (Rp 5-10M/year membership)</li>
          <li><strong>Capital:</strong> Rp 100-200M per trip</li>
          <li><strong>Goal:</strong> Rp 100-150M annual. Top-3 Indo TCG jastip brand.</li>
        </ul>
      </Section>

      <Section title="🎯 SUCCESS METRICS">
        <TableBlock
          headers={["KPI", "P1", "P2", "P3", "P4"]}
          rows={[
            ["Trips/yr", "1", "2-3", "4", "4-6"],
            ["Capital/trip", "15M", "30-40M", "80-120M", "100-200M"],
            ["Sell 4wk", "50%", "70%", "80%", "85%"],
            ["Buyers", "20-30", "100+", "500+", "1500+"],
            ["Profit/yr", "4-8M", "30-50M", "60-100M", "100-150M"],
            ["Twitter", "<500", "1-3K", "5-10K", "10K+"],
            ["Marketplace", "4.5+", "4.7+", "4.8+", "4.9+"],
          ]}
        />
      </Section>

      <Section title="🔥 IMMEDIATE NEXT STEPS">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>📸 Document EVERY purchase from Apr 2026 trip (cost, shop, condition video)</li>
          <li>🗂️ May Week 1: Spreadsheet inventory (Sheets/Notion)</li>
          <li>📱 May Week 1: Twitter "Japan haul incoming, DM requests"</li>
          <li>💰 May Week 2-4: Test 5-10 listings Telegram + Twitter</li>
          <li>🧮 Jun 2026: P&L analysis, decide Phase 2 timing</li>
          <li>🎯 Q3 2026: If validated, Phase 2 launch</li>
        </ul>
      </Section>
    </>
  );
}
