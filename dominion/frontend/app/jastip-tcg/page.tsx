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
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="rpg-panel p-4 mb-4">
        <h1 className="font-pixel text-[14px] text-throne-gold text-glow-gold mb-2">
          🃏 JASTIP TCG — MASTER PLAN
        </h1>
        <p className="text-xs text-rpg-border font-body leading-relaxed">
          End-to-end research: Pokemon + One Piece TCG arbitrage Japan → Indo. Cost, market, profit, risk, roadmap.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[8px] font-pixel">
          <span className="px-2 py-1 bg-throne-gold/10 text-throne-gold border border-throne-gold/30">PHASE 1: PERSONAL TEST</span>
          <span className="px-2 py-1 bg-rpg-borderDark/30 text-rpg-borderMid">CAPITAL: ¥50K-500K/run</span>
          <span className="px-2 py-1 bg-rpg-borderDark/30 text-rpg-borderMid">FREQ: 2-4x/year target</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`rpg-panel px-3 py-2 font-pixel text-[8px] whitespace-nowrap transition-none min-h-[40px] ${
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
      <div className="space-y-4">
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
    <div className="rpg-panel p-4">
      <h2 className="font-pixel text-[10px] text-throne-gold text-glow-gold mb-3">{title}</h2>
      <div className="text-xs text-rpg-border font-body leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rpg-panel my-2">
      <table className="w-full text-xs">
        <thead className="bg-rpg-borderDark/30">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left p-2 font-pixel text-[8px] text-throne-gold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-rpg-borderMid/30">
              {r.map((c, j) => (
                <td key={j} className="p-2 text-rpg-border">{c}</td>
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
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Authenticity edge:</strong> Lu beli Japan-direct, langsung dari Mandarake/Surugaya/BookOff = bukan reseller chain. Indo buyer trust this.</li>
          <li><strong>Tax-free arbitrage:</strong> Hemat 10% di Japan checkout via passport.</li>
          <li><strong>FX advantage:</strong> ¥110-113/Rp = current rate, decent purchasing power.</li>
          <li><strong>Indo TCG demand spike:</strong> Pokemon 151 set + OP TCG community 5x growth 2025-2026.</li>
          <li><strong>Travel ROI:</strong> Trip cost partially offset by jastip revenue = effective "paid Japan vacation".</li>
          <li><strong>Personal validation:</strong> Lu udah 47-item BookOff haul Day 7 (¥55K) + Day 12 Tokyo investment grail purchases — proven sourcing capability.</li>
        </ul>
      </Section>

      <Section title="📊 CURRENT STATE (Apr 28 2026)">
        <Table
          headers={["Metric", "Value"]}
          rows={[
            ["Phase", "1 — Personal collection + small-scale validation"],
            ["Trips done", "1 (Apr 21-May 4 2026, in-progress)"],
            ["Capital deployed (this trip)", "~¥80-150K (~Rp 9-17M) personal aesthetic + investment grails"],
            ["Indo network", "ETHJKT 900+ members, crypto Twitter, OP/Pokemon Indo Discord"],
            ["Sales test runs", "0 (validation pending)"],
            ["Brand identity", "Not formed yet — opportunity to build"],
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
        <Table
          headers={["Item", "Lean", "Standard", "Premium"]}
          rows={[
            ["Flight Jakarta⇄Tokyo", "Rp 8M", "Rp 10M", "Rp 14M"],
            ["Hotel 7 nights", "Rp 5M (hostel)", "Rp 9M (business hotel)", "Rp 18M (boutique)"],
            ["Food 7 days", "Rp 2.5M (konbini)", "Rp 4M (mix)", "Rp 8M (fine dining)"],
            ["Local transport", "Rp 1.5M", "Rp 2.5M", "Rp 4M"],
            ["Misc + buffer", "Rp 1M", "Rp 2M", "Rp 3M"],
            ["TRIP SUBTOTAL", "Rp 18M", "Rp 27.5M", "Rp 47M"],
          ]}
        />
        <p className="text-rpg-borderMid italic">
          Lean = solo, hostels, konbini. Standard = couple business hotel. Premium = romantic/honeymoon style.
        </p>
      </Section>

      <Section title="🃏 PRODUCT CAPITAL ALLOCATION (per run)">
        <Table
          headers={["Tier", "Capital", "Mix", "Realistic Volume"]}
          rows={[
            ["Test Run", "Rp 10-20M", "60% sealed / 40% singles", "3-5 boxes + 20-30 singles"],
            ["Standard Run", "Rp 30-50M", "50% sealed / 30% singles / 20% PSA grails", "8-12 boxes + 50 singles + 2-3 PSA"],
            ["Aggressive Run", "Rp 80-150M", "40% sealed / 30% singles / 30% PSA grails", "20+ boxes + 100 singles + 5-10 PSA"],
          ]}
        />
      </Section>

      <Section title="📦 LOGISTICS COST">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Carry-on hand-luggage:</strong> FREE — sampai 7-10kg, fit 5-10 sealed boxes + 100 singles. Optimal untuk test run.</li>
          <li><strong>Checked luggage extra:</strong> Rp 1-2M per koper 23kg (Garuda/JAL excess), masuk 15-25 sealed boxes + bulk singles.</li>
          <li><strong>Air freight (separately shipped):</strong> Rp 50-150K/kg via DHL/JAL Cargo, 3-5 hari. Risiko customs flag.</li>
          <li><strong>Sea freight:</strong> Rp 25-50K/kg, 30-45 hari. Tidak cocok TCG (cards sensitive temperature/humidity).</li>
          <li><strong>Indo customs (if declared):</strong> Personal goods ≤$500 USD = duty-free. Above = duty 7.5% + PPN 11% + PPh = ~25-30% total. Commercial intent flag = full inspection risk.</li>
          <li><strong>Smart approach:</strong> Carry-on + checked luggage = stay under personal allowance, declare honestly as "personal collection". Multi-trip approach scale linear without flagging.</li>
        </ul>
      </Section>

      <Section title="🇮🇩 INDO-SIDE OPERATING COSTS">
        <Table
          headers={["Item", "Cost", "Notes"]}
          rows={[
            ["Marketplace fees", "3-7%", "Shopee 4-6%, Tokopedia 3-5%, Tokopedia Power Merchant +1%"],
            ["Payment processing", "1-3%", "COD vs transfer vs OVO/Gopay"],
            ["Shipping (intra-Indo)", "Rp 20-50K/order", "JNE/J&T regular, biaya buyer cover usually"],
            ["Storage (kalau scale)", "Rp 0-500K/bulan", "Phase 1: di rumah. Phase 3+: dedicated room or 3PL"],
            ["Marketing", "Rp 0-2M/bulan", "Phase 1: organic Twitter/IG. Phase 3+: paid ads, content creator"],
            ["Authentication tools", "Rp 1-2M one-time", "UV light, magnifier, scale, reference book"],
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
      <Section title="📈 INDO TCG MARKET SNAPSHOT (2026)">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Pokemon TCG community Indo:</strong> ~150-300K active collectors (2026 estimate). Surge post-2023 worldwide Pokemon TCG renaissance.</li>
          <li><strong>One Piece TCG community Indo:</strong> ~50-100K active collectors. Faster growth 2024-2026 anime ending hype + ETHGlobal-equivalent excitement.</li>
          <li><strong>Demographic:</strong> 70% male 18-35, urban (Jakarta, Surabaya, Bandung), middle-upper income, anime/manga adjacent.</li>
          <li><strong>Spending habit:</strong> Avg ¥100-500K/month TCG, willing pay 1.5-2.5x Japan retail untuk authenticity guarantee.</li>
          <li><strong>Pain points:</strong> Local stores fake risk (40% reported encountered fake), premium pricing 2-3x Japan, slow new set arrival (3-6 weeks delay).</li>
        </ul>
      </Section>

      <Section title="⚔️ COMPETITOR LANDSCAPE">
        <Table
          headers={["Player Type", "Strength", "Weakness", "Faisal Edge"]}
          rows={[
            ["Big jastip (Tani, etc)", "Volume, fast turnaround", "Generic, no brand voice", "Personal brand + niche curation"],
            ["Local TCG shops", "Physical store trust", "High markup 2.5-3x, slow stock", "Direct Japan pricing 1.5-2x"],
            ["Indo Telegram groups", "Community trust", "Limited inventory", "Larger curated drops"],
            ["Solo collectors", "Personal trust", "Sporadic, no brand", "Consistent brand, regular drops"],
            ["Grailed/Snkrdunk Indo", "Marketplace", "Foreign tax, slow", "Local liquidity, faster"],
          ]}
        />
      </Section>

      <Section title="💰 PRICING ARBITRAGE OPPORTUNITY (live)">
        <Table
          headers={["Product", "Japan Retail", "Japan Used", "Indo Retail", "Markup Potential"]}
          rows={[
            ["Pokemon 151 Booster Box", "¥10-12K", "¥8-10K", "Rp 1.8-2.5M", "40-80% markup"],
            ["Pokemon Crimson Haze Box", "¥6-8K", "¥5-6K", "Rp 900K-1.4M", "30-60% markup"],
            ["OP01 Romance Dawn Box", "¥15-25K (rare)", "¥12-20K", "Rp 3-5M", "50-80% markup"],
            ["OP09 Booster Box", "¥6-8K", "¥5-7K", "Rp 900K-1.3M", "30-50% markup"],
            ["Pokemon Charizard ex 215 PSA10", "¥80-120K", "¥70-100K", "Rp 12-18M", "40-80% markup"],
            ["OP Sanji manga art OP06 PSA10", "¥150-250K", "¥120-200K", "Rp 22-35M", "50-100% markup"],
            ["Pokemon raw mint singles avg", "¥500-3K", "¥400-2.5K", "Rp 100K-450K", "50-100% markup"],
          ]}
        />
        <p className="text-rpg-borderMid italic">
          Arbitrage data Apr 2026, fluctuates ±15% market sentiment. Verify pre-trip via Yuyu-tei, SNKR Dunk, Mercari Japan.
        </p>
      </Section>

      <Section title="🎯 BUYER SEGMENTS">
        <Table
          headers={["Segment", "% of market", "Avg spend", "Best products"]}
          rows={[
            ["Casual collectors", "50%", "Rp 200-500K", "Sealed boosters, themed decks"],
            ["Serious collectors", "25%", "Rp 1-3M", "Booster box, alt art, SP cards"],
            ["Investors", "15%", "Rp 5-20M", "PSA 10 grails, sealed cases"],
            ["Content creators", "5%", "Rp 2-10M", "Box openings, rare pulls"],
            ["Resellers (B2B)", "5%", "Rp 10-50M", "Bulk sealed cases"],
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
      <Section title="🃏 SEALED BOX vs SINGLES STRATEGY">
        <Table
          headers={["Aspect", "Sealed Boxes", "Singles (Raw)", "PSA Grails"]}
          rows={[
            ["Capital efficiency", "Medium", "High", "Low"],
            ["Markup potential", "30-80%", "50-100%", "40-100%"],
            ["Liquidity (Indo)", "⭐⭐⭐ Fast", "⭐⭐ Moderate", "⭐ Slow but premium"],
            ["Risk (fake/damage)", "Low (sealed)", "Medium (auth)", "Low (PSA verified)"],
            ["Time to sell", "1-2 weeks", "2-6 weeks", "4-12 weeks"],
            ["Customs flag risk", "Higher (commercial qty)", "Lower", "Lower"],
            ["Best for", "Casual collectors", "Mid collectors", "Investors"],
          ]}
        />
      </Section>

      <Section title="⭐ TOP BUY TARGETS (2026 hot)">
        <p><strong>POKEMON:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Pokemon 151 Japanese sealed box (high collector demand)</li>
          <li>Crimson Haze (current set strong)</li>
          <li>Mask of Change (emerald art rare)</li>
          <li>Raw singles: Charizard 151, Mew SAR, Gardevoir SAR, Magikarp Shining 25th</li>
          <li>PSA 10 grails: Charizard ex 215, Lugia V SAR, Pikachu V SAR</li>
          <li>Vintage: Base Set 1996 raw NM (rare find Japan, BookOff treasure)</li>
        </ul>
        <p><strong>ONE PIECE:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>OP01 Romance Dawn (foundational, scarce)</li>
          <li>OP05 Awakening of New Era (popular)</li>
          <li>OP09 Emperor of Pirates (Luffy Emperor manga art)</li>
          <li>Manga art parallels (PRB02 series highly sought)</li>
          <li>Mini manga art alternative (kompak unique to JP)</li>
          <li>PSA 10 grails: Sanji OP06 manga, Luffy OP09 manga, Shanks OP01</li>
        </ul>
      </Section>

      <Section title="❌ SKIP / AVOID">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>English language sets</strong> — sourced di Indonesia mostly, no arbitrage</li>
          <li><strong>Promo cards bulk (low-tier)</strong> — Indo market saturated, slow turnover</li>
          <li><strong>Sealed cases (12+ boxes)</strong> — customs flag obvious commercial qty</li>
          <li><strong>Overly common parallels</strong> — markup too low, capital inefficient</li>
          <li><strong>Raw cards with edge wear</strong> — Indo buyers value mint condition strict</li>
          <li><strong>Yu-Gi-Oh JP (declining)</strong> — Indo market weak, focus Pokemon + OP</li>
        </ul>
      </Section>

      <Section title="🛒 BEST SOURCING SHOPS JAPAN">
        <Table
          headers={["Shop", "Best for", "Pricing tier", "Authentication"]}
          rows={[
            ["Mandarake Complex (Akiba)", "Vintage + PSA grails", "Premium", "⭐⭐⭐ Trusted"],
            ["Surugaya Akihabara (multiple)", "Raw singles bulk", "Mid", "⭐⭐ Decent"],
            ["BookOff Akihabara/Gifu/etc", "Random treasure hunt", "Low", "⭐⭐ Variable"],
            ["Hareruya Akihabara", "Pokemon high-end + sealed", "Premium", "⭐⭐⭐ Trusted"],
            ["Pokemon Center official (Tokyo Sky Tree)", "New sealed boxes", "Retail", "⭐⭐⭐ Genuine"],
            ["Yuyu-tei online", "Raw OP singles + price reference", "Mid", "⭐⭐ Decent"],
            ["Mercari Japan", "Marketplace bulk lots", "Variable", "⭐ Risky (auth manual)"],
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
      <Section title="🛒 SALES CHANNEL STRATEGY (multi-tier)">
        <Table
          headers={["Channel", "Audience", "Markup", "Velocity", "Best products"]}
          rows={[
            ["Twitter/X (organic)", "Crypto + anime fans", "50-80%", "Fast", "Hyped sealed + grails"],
            ["Instagram Reels/Story", "Visual collectors", "60-80%", "Medium", "PSA grails + alt art"],
            ["TikTok Shop / Lives", "Younger casual", "40-60%", "Fast (impulse)", "Sealed boosters + cheap singles"],
            ["Telegram channel", "Serious collectors", "40-60%", "Fast", "Bulk drops + early access"],
            ["Discord/private group", "Inner circle premium", "30-50%", "Medium", "PSA + investment grails"],
            ["Shopee/Tokopedia store", "Mass casual", "40-50%", "Slow", "Sealed + popular singles"],
            ["FB Marketplace", "Bargain hunters", "30-40%", "Slow", "Clearance + slow movers"],
          ]}
        />
      </Section>

      <Section title="🎯 RECOMMENDED CHANNEL MIX">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Phase 1-2 (test/early scale):</strong> Twitter/X + Telegram channel + Instagram. Lean into ETHJKT 900+ network + crypto Twitter authenticity story.</li>
          <li><strong>Phase 3 (scale):</strong> Add Tokopedia store + TikTok lives. Brand identity "@zexotcg" or similar.</li>
          <li><strong>Phase 4 (full operation):</strong> Discord premium tier + Shopee Mall + content team.</li>
          <li><strong>Always avoid:</strong> Bukalapak (low engagement), Lazada (luxury fakes association), random WhatsApp (no scale).</li>
        </ul>
      </Section>

      <Section title="💎 BRAND POSITIONING">
        <p>
          <strong>Unique selling proposition:</strong> "BTC maxi blockchain dev brings authentic Japan TCG
          to Indo. Direct sourcing Mandarake/Hareruya/Pokemon Center. Pre-shipment authentication video.
          1.5-2x Japan retail (vs local stores 2.5-3x). Crypto/QR pay accepted."
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
          <li><strong>Trust signals:</strong> Public Twitter persona, Strava activity Japan trips, ETHJKT identity</li>
          <li><strong>Story content:</strong> Behind-the-scenes Mandarake hunt videos, BookOff steal stories</li>
          <li><strong>Authentication:</strong> Unboxing video pre-ship, PSA grade visible, serial number tracking</li>
          <li><strong>Pricing transparency:</strong> Show Japan source price + markup explicit (build trust)</li>
          <li><strong>Crypto-native:</strong> Accept USDT/BTC/IDRT — niche advantage in Indo market</li>
        </ul>
      </Section>

      <Section title="📅 SALES TIMING STRATEGY">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Pre-trip teaser:</strong> Twitter post "Sourcing Japan trip [date], requests open". Build hype + pre-orders.</li>
          <li><strong>In-trip live updates:</strong> Story/Reels each shop visit, builds authenticity narrative.</li>
          <li><strong>Day 1 post-arrival:</strong> Drop announcement, photos, pricing. 72-hour reservation window.</li>
          <li><strong>Week 1:</strong> Fulfill confirmed orders + push remaining via marketplace.</li>
          <li><strong>Week 2-4:</strong> Slow movers via Marketplace + bulk discount Telegram.</li>
          <li><strong>Cash flow target:</strong> 70% inventory liquidated within 4 weeks post-trip.</li>
        </ul>
      </Section>
    </>
  );
}

// ============ PROFIT MATH ============
function ProfitMath() {
  return (
    <>
      <Section title="💰 PROFIT MATH — 3 SCENARIOS">
        <p>Realistic per-trip profit, 4 weeks sell-through, all costs deducted.</p>
      </Section>

      <Section title="🟢 SCENARIO A — Test Run (Conservative)">
        <Table
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (allocated %)", "Rp 5M (only attribute partial trip cost)"],
            ["Capital deployed (products)", "Rp 15M"],
            ["Tax-free saving Japan (10%)", "+Rp 1.5M"],
            ["Logistics (carry-on, no shipping)", "Rp 0"],
            ["Indo customs", "Rp 0 (under personal allowance)"],
            ["Indo selling price gross", "Rp 24M (avg 60% markup over net cost)"],
            ["Marketplace fees 5%", "-Rp 1.2M"],
            ["Indo shipping (buyer cover)", "Rp 0"],
            ["Marketing costs", "Rp 0 (organic)"],
            ["NET REVENUE", "Rp 22.8M"],
            ["NET COST", "Rp 18.5M (trip 5M + product 13.5M after tax-free)"],
            ["📊 NET PROFIT", "Rp 4.3M"],
            ["Per-run ROI", "23%"],
          ]}
        />
        <p className="text-rpg-borderMid italic mt-2">
          Modest but proves model. Validates supply, demand, and Indo buyer trust.
        </p>
      </Section>

      <Section title="🟡 SCENARIO B — Standard Run (Realistic)">
        <Table
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (allocated %)", "Rp 12M (50% trip cost attributed)"],
            ["Capital deployed (products)", "Rp 40M"],
            ["Tax-free saving Japan", "+Rp 4M"],
            ["Logistics (1 extra checked bag)", "Rp 1.5M"],
            ["Indo customs (declared partial)", "Rp 2M"],
            ["Indo selling price gross", "Rp 72M (avg 80% markup over net cost)"],
            ["Marketplace fees 5%", "-Rp 3.6M"],
            ["Marketing costs", "Rp 1M"],
            ["NET REVENUE", "Rp 67.4M"],
            ["NET COST", "Rp 51.5M (trip 12M + product 36M + logistics 1.5M + customs 2M)"],
            ["📊 NET PROFIT", "Rp 15.9M"],
            ["Per-run ROI", "31%"],
          ]}
        />
        <p className="text-rpg-borderMid italic mt-2">
          Sweet spot. 2-4x/year = Rp 32-64M side revenue covering trip costs entirely.
        </p>
      </Section>

      <Section title="🔴 SCENARIO C — Aggressive Run (Risk-On)">
        <Table
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (full allocated)", "Rp 25M (full trip attributed)"],
            ["Capital deployed (products)", "Rp 120M (FORU TGE-funded)"],
            ["Tax-free saving Japan", "+Rp 12M"],
            ["Logistics (multi-bag + air freight)", "Rp 4M"],
            ["Indo customs (commercial declared)", "Rp 12M (~10% duty + tax)"],
            ["Indo selling price gross", "Rp 220M (avg 90% markup PSA grails + sealed)"],
            ["Marketplace fees 5%", "-Rp 11M"],
            ["Marketing + content costs", "Rp 3M"],
            ["NET REVENUE", "Rp 206M"],
            ["NET COST", "Rp 161M (trip 25M + product 108M + logistics 4M + customs 12M + marketing 3M)"],
            ["⚠️ Risk: 30% sell-through fail", "Rp 60M tied up beyond 3 months"],
            ["📊 NET PROFIT (success case)", "Rp 45M"],
            ["📊 NET PROFIT (30% fail case)", "Rp 18M (revisit sell-through)"],
            ["Per-run ROI (success)", "28%"],
          ]}
        />
        <p className="text-rpg-borderMid italic mt-2">
          High capital, high return potential, but liquidity risk. Only attempt after Phase 2-3 validated demand.
        </p>
      </Section>

      <Section title="📊 ANNUAL REVENUE PROJECTION">
        <Table
          headers={["Year", "Trips", "Mode", "Net Profit Annual", "Notes"]}
          rows={[
            ["2026 (current)", "1", "Test run", "Rp 4-8M", "Validation phase"],
            ["2027", "2-3", "Standard", "Rp 30-50M", "Brand building"],
            ["2028", "3-4", "Standard + 1 Aggressive", "Rp 60-100M", "Scale phase"],
            ["2029", "4", "Aggressive", "Rp 100-150M", "Mature operation"],
          ]}
        />
        <p className="text-rpg-borderMid italic mt-2">
          By 2029, jastip TCG = Rp 100-150M/year side revenue + tax-deductible Japan trips. Comparable to OKU
          Trade salary contribution (Rp 113M/month). Powerful diversification.
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
        <Table
          headers={["Risk", "Probability", "Impact", "Mitigation"]}
          rows={[
            ["Customs detain (commercial qty)", "Med (Phase 2+)", "High", "Stay under personal allowance, multi-trip strategy"],
            ["Authentication challenge Indo", "Med", "High", "Mandarake/Hareruya only, video unboxing pre-ship"],
            ["Pokemon market crash", "Low-Med", "High", "Diversify OP + curated grails vs sealed bulk"],
            ["OP TCG hype peak/decline", "Med", "Med", "Manga ending = uncertain timing, monitor closely"],
            ["Inventory tied up >4 weeks", "Med", "Med", "Pre-orders before trip, fast-mover focus"],
            ["Card damage in transit", "Low", "Med", "Hard top-loader + binder + climate-controlled bag"],
            ["FX rate volatility (¥/Rp)", "Med", "Low", "Hedge via partial pre-buy IDR, monitor JPY"],
            ["Fake card slip through (BookOff)", "Low", "Med", "Authenticate before sell, focus Mandarake/Hareruya"],
            ["Indo regulation change", "Low", "High", "Monitor BPOM/Bea Cukai changes, adapt fast"],
            ["Personal trip burnout", "Med (4x/year)", "Med", "Combine with vacation, treat trips holistic"],
            ["Buyer fraud / chargeback", "Low", "Low-Med", "COD only first 3 transactions, build rep first"],
            ["Brand reputation damage", "Low", "High", "Quality control strict, refund policy clear"],
          ]}
        />
      </Section>

      <Section title="🛡️ KEY DEFENSIVE STRATEGIES">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Personal allowance discipline:</strong> Stay under $500 USD declared goods per trip. Multi-trip approach scale safer than 1 mega-haul.</li>
          <li><strong>Authentication video archive:</strong> Every PSA grail + every sealed box filmed pre-ship. Video proof = trust gold.</li>
          <li><strong>Diversify TCG portfolio:</strong> 50% Pokemon / 30% OP / 20% other (DBSCG, Yu-Gi-Oh selective). Reduces single-game crash exposure.</li>
          <li><strong>Quick liquidity rule:</strong> Sell sealed boosters first (fast turnover), grails later (slower but premium).</li>
          <li><strong>Buffer capital reserve:</strong> Keep 25% capital free for next trip even if previous unsold. Avoid forced fire-sale.</li>
          <li><strong>Indo network leverage:</strong> ETHJKT crypto + Discord = trust pre-built. Faster sell-through vs cold traffic.</li>
          <li><strong>Track every transaction:</strong> Spreadsheet (or Dominion finance tracker integration). KPI: ROI per item, sell-through days.</li>
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

      <Section title="🌱 PHASE 1: VALIDATION (Apr 2026 — Jul 2026)">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>✅ Apr 21-May 4 trip: Personal aesthetic haul (Gifu BookOff ¥55K) + Tokyo investment grails Day 12-13</li>
          <li>📋 May 2026: Catalog purchases, photo + auth video</li>
          <li>📋 May-Jun 2026: First test sale Twitter/Telegram (5-10 items)</li>
          <li>📋 Jul 2026: Analyze unit economics, refine listing format, gather buyer feedback</li>
          <li><strong>Capital allocated:</strong> Rp 15-20M</li>
          <li><strong>Goal:</strong> Validate demand exists at target markup, build initial buyer list 20-30 people</li>
        </ul>
      </Section>

      <Section title="🌿 PHASE 2: BRAND BUILDING (Aug 2026 — Feb 2027)">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>📋 Aug 2026: Establish brand handle (@zexotcg or similar). Launch IG + Telegram channel.</li>
          <li>📋 Sep 2026: Trip 2 Japan (Tokyo + Osaka). Standard run Rp 30-40M.</li>
          <li>📋 Oct-Nov 2026: Sell-through cycle. Content marketing: hunt vlog, unboxing reels.</li>
          <li>📋 Dec 2026 - Feb 2027: Trip 3 (winter). Test sealed-heavy mix.</li>
          <li><strong>Capital:</strong> Rp 30-50M per trip</li>
          <li><strong>Goal:</strong> Build 100+ active buyer base, generate Rp 30-50M annual profit, brand recognition crypto + anime Indo Twitter</li>
        </ul>
      </Section>

      <Section title="🌳 PHASE 3: SCALE (Mar 2027 — Dec 2027)">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>📋 Mar 2027: Launch Tokopedia/Shopee storefront. Hire freelance content creator.</li>
          <li>📋 Apr 2027: Trip 4 (combine wedding pre-prep — Keiko involve, photo content)</li>
          <li>📋 May-Jul 2027: Scale to 1500+ buyer base, Rp 60-100M run profit</li>
          <li>📋 Aug 2027: Test air freight bulk shipment (post-Lebaran demand spike)</li>
          <li>📋 Sep-Dec 2027: 4th trip + holiday season push</li>
          <li><strong>Capital:</strong> Rp 80-120M per trip</li>
          <li><strong>Goal:</strong> Rp 60-100M annual profit. Wedding July 2027 partially funded by jastip operation.</li>
        </ul>
      </Section>

      <Section title="🌲 PHASE 4: MATURE OPERATION (2028+)">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>📋 Q1 2028: Hire VA Indonesia for fulfillment + customer service</li>
          <li>📋 Q2 2028: Set up business entity (PT/CV) for tax efficiency</li>
          <li>📋 Q3 2028: Diversify Korea/HK trips (alternative TCG sources)</li>
          <li>📋 Q4 2028: Premium Discord tier launch (¥500K-1M/year membership)</li>
          <li><strong>Capital:</strong> Rp 100-200M per trip</li>
          <li><strong>Goal:</strong> Rp 100-150M annual profit. "@zexotcg" Indonesia top-3 jastip TCG brand.</li>
        </ul>
      </Section>

      <Section title="🎯 SUCCESS METRICS">
        <Table
          headers={["KPI", "Phase 1", "Phase 2", "Phase 3", "Phase 4"]}
          rows={[
            ["Trips/year", "1", "2-3", "4", "4-6"],
            ["Capital/trip", "Rp 15M", "Rp 30-40M", "Rp 80-120M", "Rp 100-200M"],
            ["Sell-through 4 weeks", "50%", "70%", "80%", "85%"],
            ["Active buyers", "20-30", "100+", "500+", "1500+"],
            ["Annual profit", "Rp 4-8M", "Rp 30-50M", "Rp 60-100M", "Rp 100-150M"],
            ["Brand: Twitter followers", "<500", "1-3K", "5-10K", "10K+"],
            ["Marketplace rating", "4.5+", "4.7+", "4.8+", "4.9+"],
          ]}
        />
      </Section>

      <Section title="🔥 IMMEDIATE NEXT STEPS (May 2026)">
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>📸 Day 12-14 trip remaining: Document EVERY purchase (cost, shop, condition video)</li>
          <li>🗂️ Post-trip Indo: Spreadsheet inventory (Google Sheets or Notion)</li>
          <li>📱 May Week 1: Twitter post "Japan haul incoming, requests open via DM"</li>
          <li>💰 May Week 2-4: Test 5-10 listings via Telegram + Twitter, track conversion rate</li>
          <li>🧮 Jun 2026: P&L analysis Phase 1, decide Phase 2 trip timing</li>
          <li>🎯 Q3 2026: If validated, Phase 2 launch</li>
        </ul>
      </Section>
    </>
  );
}
