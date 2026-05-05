"use client";

import { useState } from "react";

const SECTIONS = [
  { id: "overview", label: "📊 OVERVIEW" },
  { id: "cost", label: "💴 COST" },
  { id: "market", label: "📈 MARKET" },
  { id: "products", label: "📦 SEALED CASES" },
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
          📦 JASTIP TCG — SEALED CASE STRATEGY
        </h1>
        <p className="text-[11px] sm:text-xs text-rpg-border font-body leading-relaxed">
          <strong>Strategy lock:</strong> Buy sealed CASES Japan (12-20 boxes/case at wholesale-equivalent price)
          → Split sell INDIVIDUAL boxes Indo via FB groups + Twitter (brewek/box-cracker market). Fastest turnover,
          highest liquidity, lowest auth risk.
        </p>
        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2 text-[7px] sm:text-[8px] font-pixel">
          <span className="px-2 py-1 bg-throne-gold/10 text-throne-gold border border-throne-gold/30">PHASE 1: TEST</span>
          <span className="px-2 py-1 bg-rpg-borderDark/30 text-rpg-borderMid">FOCUS: SEALED 80%+</span>
          <span className="px-2 py-1 bg-rpg-borderDark/30 text-rpg-borderMid">TURNOVER: 1-2 WK</span>
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
      <Section title="🎯 MISSION (REVISED)">
        <p>
          <strong>SEALED CASE arbitrage Japan → Indo brewek market.</strong> Indo FB groups + Twitter = barang sealed
          "gila gilaan susah" — box-cracker collectors butuh stock konstan, willing pay premium.
          Buy CASES Japan (12-20 boxes wholesale-equivalent), split-sell INDIVIDUAL boxes Indo at retail markup.
        </p>
        <p>
          <strong>Why sealed > singles/grails:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>⭐ <strong>Turnover 1-2 minggu</strong> (vs singles 4-6 mgg, PSA 4-12 mgg)</li>
          <li>⭐ <strong>Liquidity ekstrem</strong> — FB Indo TCG groups jual habis hours not days</li>
          <li>⭐ <strong>Zero authentication issue</strong> — sealed = factory-sealed Pokemon Center / Japan retail</li>
          <li>⭐ <strong>Brewek crowd</strong> = repeat buyer (open box terus, butuh stock baru)</li>
          <li>⭐ <strong>Capital recycle cepat</strong> — fund next trip dari current trip profit</li>
          <li>⭐ <strong>Predictable markup</strong> 50-100% per box, gak fluktuatif kayak singles</li>
        </ul>
      </Section>

      <Section title="💡 BREWEK MARKET INDO REALITY">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>FB Pokemon TCG Indonesia:</strong> 80-150K members, daily "WTB sealed box" posts</li>
          <li><strong>FB One Piece TCG Indonesia:</strong> 30-60K members, hyper-active sealed demand</li>
          <li><strong>Reality check:</strong> Local store stock arrival 3-6 weeks delay vs Japan release. Pre-order langka, often 2.5-3x Japan price kalau tersedia.</li>
          <li><strong>Brewek profile:</strong> Collector dengan budget Rp 1-5M/bulan TCG, willing pay Rp 1.5-2.5x Japan retail untuk sealed Japan-direct authentic.</li>
          <li><strong>Pain point #1:</strong> "Susah dapet barang" — itu lo solve langsung dengan supply Japan</li>
          <li><strong>Lu's edge:</strong> Direct Japan source + auth video + crypto/QR pay = trust premium</li>
        </ul>
      </Section>

      <Section title="📊 CURRENT STATE (Apr 28 2026)">
        <TableBlock
          headers={["Metric", "Value"]}
          rows={[
            ["Strategy", "SEALED CASES split-sell"],
            ["Trips done", "1 (Apr 21-May 4 2026, COMPLETED)"],
            ["Apr trip haul", "~¥80-150K personal aesthetic + investment grails (NOT sealed-focused yet)"],
            ["Indo network", "ETHJKT 900+, FB TCG groups, crypto Twitter"],
            ["Brand identity", "Not formed — launch Phase 2"],
            ["Phase 1 capital test", "Rp 15-25M (focused 80% sealed boxes)"],
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
        <p>Realistic Japan trip 7-14 days, Tokyo + Osaka focus (sealed shop density highest).</p>
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

      <Section title="📦 SEALED CASE CAPITAL ALLOCATION">
        <TableBlock
          headers={["Tier", "Capital", "Cases", "Boxes Total"]}
          rows={[
            ["Test Run", "Rp 15-25M", "1-2 cases", "12-30 boxes"],
            ["Standard Run", "Rp 40-70M", "3-5 cases", "40-80 boxes"],
            ["Aggressive Run", "Rp 80-150M", "7-10+ cases", "100-200 boxes"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs">
          80% sealed cases / 20% singles+grails (variety + collector build). Trade depth for speed.
        </p>
      </Section>

      <Section title="📦 LOGISTICS COST (sealed boxes WEIGHT-HEAVY)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Per case weight:</strong> Pokemon ~3-4kg, OP ~2-3kg per case (12-20 boxes)</li>
          <li><strong>Carry-on (7-10kg):</strong> 2-3 cases max. Test run cocok.</li>
          <li><strong>Checked luggage 23kg:</strong> 5-7 cases. Standard run cocok. Rp 1-2M per koper.</li>
          <li><strong>Air freight (DHL/JAL Cargo):</strong> Rp 80-150K/kg, 3-5 hari. Aggressive run perlu ini.</li>
          <li><strong>Customs Indo personal allowance ≤$500 USD:</strong> 2-3 cases sealed = OK declare honest.</li>
          <li><strong>Above $500:</strong> 7.5% duty + PPN 11% + PPh = ~25-30% total. Tetap profitable kalau planning bener.</li>
          <li><strong>Pro-tip multi-trip:</strong> Spread 3-5 trips/year = stay under flag-able commercial qty + consistent supply Indo market.</li>
        </ul>
      </Section>

      <Section title="🇮🇩 INDO OPERATING COSTS">
        <TableBlock
          headers={["Item", "Cost", "Notes"]}
          rows={[
            ["FB Marketplace", "FREE", "Best ROI for sealed boxes"],
            ["Shopee/Tokped fees", "3-7%", "Optional Phase 2+"],
            ["Payment processing", "1-3%", "COD/transfer/OVO"],
            ["Shipping intra-Indo", "Rp 30-80K/box", "JNE/J&T, buyer cover usually"],
            ["Storage", "Rp 0", "Phase 1: rumah, dry place"],
            ["Marketing", "Rp 0-1M/bln", "Organic FB groups + Twitter"],
            ["Packing supplies", "Rp 200-500K", "Bubble wrap, hard box, top loaders"],
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
      <Section title="📈 INDO BREWEK MARKET (2026)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>FB Pokemon TCG Indonesia (main group):</strong> 80-150K members, posting WTB/WTS sealed daily</li>
          <li><strong>FB Pokemon TCG Indo Premium / Box Cracker:</strong> 20-40K members serious buyers</li>
          <li><strong>FB One Piece TCG Indonesia:</strong> 30-60K members, hyper-active</li>
          <li><strong>Twitter Indo TCG:</strong> 50-100K followers across major accounts</li>
          <li><strong>Discord Indo TCG:</strong> 10-30K total members, premium tier</li>
          <li><strong>Spending:</strong> Brewek collectors Rp 2-10M/bulan, willing 1.5-2.5x Japan retail</li>
          <li><strong>Key insight:</strong> Indo retail stores carry product 3-6 weeks DELAYED + 2.5-3x markup. Lu undercut + fresh supply.</li>
        </ul>
      </Section>

      <Section title="⚔️ COMPETITOR LANDSCAPE">
        <TableBlock
          headers={["Player", "Strength", "Weakness", "Faisal Edge"]}
          rows={[
            ["Big jastip TCG", "Volume, established", "Gampang tipu, bulk no curation", "Personal brand + niche"],
            ["Local TCG shops", "Physical store", "2.5-3x markup, slow new set", "1.5-2x + fresh supply"],
            ["FB groups solo seller", "Personal trust", "Sporadic supply", "Consistent monthly drops"],
            ["Tokopedia preorder", "Marketplace", "6-8 wk delivery", "Direct trip 1-2 wk"],
            ["Indo retail (Toys Kingdom etc)", "Mall presence", "Delayed stock 4-6 wk", "Day-1 Japan release"],
          ]}
        />
      </Section>

      <Section title="💰 SEALED BOX ARBITRAGE TABLE">
        <TableBlock
          headers={["Box", "Japan retail", "Indo FB price", "Markup"]}
          rows={[
            ["Pokemon 151 JP", "¥10-12K", "Rp 1.8-2.5M", "60-100%"],
            ["Pokemon Crimson Haze", "¥6-8K", "Rp 950K-1.4M", "40-60%"],
            ["Pokemon Mask of Change", "¥6-7K", "Rp 900K-1.3M", "40-60%"],
            ["Pokemon Twilight Masquerade", "¥5-7K", "Rp 900K-1.2M", "40-60%"],
            ["OP01 Romance Dawn", "¥15-25K (rare)", "Rp 3-5M", "50-80%"],
            ["OP05 Awakening", "¥6-9K", "Rp 1-1.5M", "40-60%"],
            ["OP09 Emperor", "¥6-8K", "Rp 1-1.4M", "40-60%"],
            ["OP10 (latest Apr 2026)", "¥5-7K", "Rp 950K-1.3M", "50-70%"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs">
          Pricing live Apr 2026. Verify pre-trip Yuyu-tei/Mercari/FB Indo group avg.
        </p>
      </Section>

      <Section title="🎯 BREWEK BUYER SEGMENTS (sealed-focused)">
        <TableBlock
          headers={["Segment", "% market", "Spend/order", "Behavior"]}
          rows={[
            ["Casual brewek", "40%", "1-2 boxes", "Beli 1 set/release"],
            ["Serious brewek", "35%", "3-6 boxes", "Buy on release week"],
            ["Deck builders", "15%", "5-10 boxes", "Hunt specific cards"],
            ["Investors", "5%", "10+ boxes", "Sealed long hold + flip"],
            ["Resellers (B2B)", "5%", "20+ boxes", "Buy bulk markup further"],
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
      <Section title="📦 SEALED CASE PRIMARY STRATEGY">
        <p>
          <strong>80% capital sealed boxes/cases. 15% singles for collector variety. 5% PSA grails for premium tier reputation.</strong>
        </p>
        <TableBlock
          headers={["Tier", "Sealed", "Singles", "PSA"]}
          rows={[
            ["Capital allocation", "80%", "15%", "5%"],
            ["Liquidity", "⭐⭐⭐ 1-2 wk", "⭐⭐ 4-6 wk", "⭐ 4-12 wk"],
            ["Markup", "40-100%", "50-100%", "40-100%"],
            ["Auth issue", "None (sealed)", "Med", "Low (PSA)"],
            ["Repeat buyer", "⭐⭐⭐ High", "⭐ Low", "Once-off"],
            ["Best for", "Brewek/cracker market", "Collectors", "Investors"],
          ]}
        />
      </Section>

      <Section title="⭐ TOP SEALED BUYS Apr-Dec 2026">
        <p><strong>POKEMON (priority order):</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>🔥 <strong>Pokemon 151 JP Booster Box</strong> — highest demand, 60-100% markup</li>
          <li>🔥 <strong>Crimson Haze (current set)</strong> — strong sales, 40-60% markup</li>
          <li><strong>Mask of Change</strong> — emerald art rare hits</li>
          <li><strong>Twilight Masquerade</strong> — latest sets always demand</li>
          <li><strong>Pokemon Card Game ex Boost (Half-deck packs)</strong> — entry-level collector</li>
          <li><strong>Vintage retro box (kalau nemu BookOff)</strong> — rare, premium</li>
        </ul>
        <p className="mt-2"><strong>ONE PIECE (priority order):</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>🔥 <strong>OP09 Emperor of Pirates</strong> — manga ending hype peak</li>
          <li>🔥 <strong>OP10 (newest Apr 2026)</strong> — fresh release, brewek demand</li>
          <li><strong>OP05 Awakening of New Era</strong> — popular set</li>
          <li><strong>OP08, OP07</strong> — backstock kalau price reasonable</li>
          <li><strong>OP01 Romance Dawn</strong> — jika nemu (rare, premium markup)</li>
          <li><strong>Pre-Release / Promo Booster</strong> — limited, premium</li>
        </ul>
      </Section>

      <Section title="📦 CASE STRATEGY MATH">
        <p>
          <strong>Pokemon Booster Box CASE</strong> = 16-20 boxes typically.
          <strong> OP TCG CASE</strong> = 12 boxes typically.
        </p>
        <p>
          <strong>Wholesale benefit Japan:</strong> Buying full case dari Mandarake/Surugaya/Pokemon Center kadang dapet diskon 5-10% vs individual boxes. Plus convenience (1 transaction, all sealed certificate).
        </p>
        <TableBlock
          headers={["Case Type", "Box count", "Japan price", "Per box wholesale", "Indo retail (per box)"]}
          rows={[
            ["Pokemon 151 case", "20 boxes", "¥180-220K", "¥9-11K", "Rp 1.8-2.5M"],
            ["Pokemon Crimson case", "20 boxes", "¥110-150K", "¥5.5-7.5K", "Rp 950K-1.4M"],
            ["OP09 case", "12 boxes", "¥70-90K", "¥5.8-7.5K", "Rp 1-1.4M"],
            ["OP10 case (newest)", "12 boxes", "¥60-80K", "¥5-6.7K", "Rp 950-1.3M"],
          ]}
        />
      </Section>

      <Section title="🛒 BEST SOURCING SEALED JAPAN">
        <TableBlock
          headers={["Shop", "Sealed availability", "Pricing", "Notes"]}
          rows={[
            ["Pokemon Center (official)", "⭐⭐⭐ New sets", "Retail (no discount)", "Limit per person, lottery for hot sets"],
            ["Mandarake Akihabara", "⭐⭐ Used + new", "Premium 5-10% over retail", "Reliable auth, less stock"],
            ["Surugaya Akihabara", "⭐⭐⭐ Bulk available", "At/below retail", "Best volume sourcing"],
            ["Yodobashi/BIC Camera", "⭐⭐ New sets only", "Retail", "Limit 1-2 per visit"],
            ["Yamashiroya Ueno", "⭐⭐ Hidden gem", "At retail", "Good for OP TCG cases"],
            ["Akihabara Card Shops", "⭐⭐ Variable", "Variable", "Shop around for case deal"],
            ["Mercari Japan online", "⭐⭐ Bulk lots", "Variable", "Risky auth, pre-arrival ship to hotel"],
            ["Wholesalers (B2B)", "⭐⭐⭐ Best price", "-15-20%", "Phase 3+ when established credibility"],
          ]}
        />
      </Section>

      <Section title="❌ WHAT TO SKIP">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Old singles bulk</strong> — slow, capital inefficient untuk speed strategy</li>
          <li><strong>Yu-Gi-Oh JP sealed</strong> — Indo demand weak vs Pokemon/OP</li>
          <li><strong>English language sets</strong> — sourced di Indo, no arbitrage</li>
          <li><strong>Heavy PSA grails (>¥100K)</strong> — Phase 1-2 capital better used buying 5-10 sealed boxes</li>
          <li><strong>Sealed cases >5 same product</strong> — customs flag commercial qty obvious</li>
          <li><strong>Damaged/broken-seal boxes</strong> — brewek market strict, sealed = mint only</li>
        </ul>
      </Section>
    </>
  );
}

// ============ SALES CHANNELS ============
function SalesChannels() {
  return (
    <>
      <Section title="🛒 SEALED-OPTIMIZED CHANNEL MIX">
        <TableBlock
          headers={["Channel", "Audience", "Markup", "Velocity", "Best for sealed?"]}
          rows={[
            ["FB Pokemon TCG Indo", "⭐⭐⭐ Brewek", "60-100%", "FAST 24-72h", "⭐⭐⭐ BEST"],
            ["FB OP TCG Indo", "⭐⭐⭐ Brewek", "60-80%", "FAST", "⭐⭐⭐ BEST"],
            ["Twitter/X", "Crypto+anime", "50-80%", "Fast", "⭐⭐ Strong"],
            ["Telegram channel", "Serious coll", "40-60%", "Fast", "⭐⭐ Good"],
            ["Instagram Story/Reels", "Visual", "50-70%", "Med", "⭐⭐ OK"],
            ["Discord premium", "Inner circle", "30-50%", "Med", "⭐ OK (Phase 4)"],
            ["TikTok Shop Lives", "Casual", "40-60%", "Fast (impulse)", "⭐ OK"],
            ["Tokopedia store", "Mass", "40-50%", "Slow", "⭐ Phase 3+"],
            ["Shopee", "Mass", "40-50%", "Slow", "⭐ Phase 3+"],
          ]}
        />
      </Section>

      <Section title="🎯 FB INDO STRATEGY (most important)">
        <p><strong>Top FB groups to join + post:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>🔥 <strong>Pokemon TCG Indonesia (Original)</strong> — main 80-150K members</li>
          <li>🔥 <strong>One Piece TCG Indonesia</strong> — 30-60K members</li>
          <li><strong>Pokemon Card Indo Premium</strong> — serious buyers tier</li>
          <li><strong>Jastip TCG Japan Indonesia</strong> — niche jastip community</li>
          <li><strong>Indonesia TCG Buy/Sell/Trade</strong> — multi-game</li>
          <li><strong>Local city groups</strong> — Pokemon TCG Jakarta, Bandung, Surabaya, etc</li>
        </ul>
        <p className="mt-2"><strong>Posting strategy:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Pre-trip (1 week before):</strong> "WTS open: Sourcing Japan trip [date] | Pokemon 151, Crimson Haze, OP09, OP10 sealed boxes | DM for pre-order"</li>
          <li><strong>In-trip (live updates):</strong> Story Mandarake hunt, Pokemon Center pickup, dengan price tag visible. Trust building.</li>
          <li><strong>Post-trip (day 1-3):</strong> "FRESH from Japan | Pokemon 151 [qty] | Rp [price] | DM cepet barang habis"</li>
          <li><strong>Visual:</strong> photo box dengan tax-free receipt + Mandarake bag = authenticity proof</li>
          <li><strong>Reply DM fast:</strong> first 24 hours = critical, brewek market impatient</li>
        </ul>
      </Section>

      <Section title="💎 BRAND POSITIONING">
        <p>
          <strong>USP:</strong> "BTC maxi blockchain dev membawa fresh sealed Japan TCG ke Indonesia.
          Direct Pokemon Center / Mandarake / Surugaya. 1.5-2x Japan retail (vs local 2.5-3x).
          Day-1 supply, no 6-week wait. Auth video included. Crypto/QR pay."
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1 mt-2">
          <li><strong>Trust signals:</strong> Public Twitter (ETHJKT identity), Strava Japan trip GPS proof, FB profile photo with sealed boxes</li>
          <li><strong>Story content:</strong> Behind-the-scenes "unboxing case at Pokemon Center", Mandarake walkthrough video</li>
          <li><strong>Auth proof:</strong> Tax-free receipt photo + sealed box video pre-ship</li>
          <li><strong>Pricing transparency:</strong> Show Japan retail price + Indo markup explicit</li>
          <li><strong>Crypto-native:</strong> Accept USDT/IDRT/BTC — unique vs other jastip</li>
          <li><strong>Repeat customer rewards:</strong> Discord-only early bird access for repeat buyers</li>
        </ul>
      </Section>

      <Section title="📅 LIQUIDITY-FIRST TIMING">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Pre-trip teaser (1 wk):</strong> FB + Twitter + Telegram "sourcing list" announcement, collect pre-orders</li>
          <li><strong>Pre-orders DP 30%:</strong> Reservation valid 48 hours after arrival, build trust + ensure capital flow</li>
          <li><strong>In-trip live drop:</strong> Photo each shop with price visible, build hype</li>
          <li><strong>Day 1 post-arrival:</strong> Drop announcement with photo all sealed boxes + price list. 24-48 hour first-come-first-served untuk non-DP buyers.</li>
          <li><strong>Week 1:</strong> Fulfill orders + push remaining FB groups</li>
          <li><strong>Week 2-3:</strong> Marketplace listing for slow movers (Tokped/Shopee)</li>
          <li><strong>Target:</strong> 80% sealed liquidated within 2 weeks. Rest 4 weeks max.</li>
        </ul>
      </Section>
    </>
  );
}

// ============ PROFIT MATH ============
function ProfitMath() {
  return (
    <>
      <Section title="💰 SEALED-FOCUSED PROFIT MATH">
        <p>3 scenarios berbasis case-buying strategy. Realistic 2-3 weeks sell-through (vs all-tier 4 weeks).</p>
      </Section>

      <Section title="🟢 SCENARIO A — Test Run (1-2 cases)">
        <TableBlock
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (allocated)", "Rp 5M"],
            ["Cases bought", "1 Pokemon 151 (20 boxes) + 1 OP09 (12 boxes) = 32 boxes"],
            ["Capital products (Japan)", "¥240K (~Rp 26.4M)"],
            ["Tax-free saving", "+¥24K (~Rp 2.6M)"],
            ["NET cost products", "Rp 23.8M"],
            ["Logistics", "Rp 0 (carry-on + 1 checked)"],
            ["Customs declared", "Rp 0 (under $500)"],
            ["Selling 32 boxes avg Rp 1.4M each", "Rp 44.8M"],
            ["FB free, marketplace 5% on 30%", "-Rp 700K"],
            ["NET REVENUE", "Rp 44.1M"],
            ["NET COST", "Rp 28.8M (trip 5M + product 23.8M)"],
            ["📊 PROFIT", "Rp 15.3M"],
            ["ROI", "53%"],
            ["Sell-through", "2 weeks (sealed FB liquidity)"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs mt-2">
          Validates sealed-first model. Test buyer trust + supply consistency.
        </p>
      </Section>

      <Section title="🟡 SCENARIO B — Standard Run (3-5 cases)">
        <TableBlock
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (50%)", "Rp 12M"],
            ["Cases bought", "2 Pokemon 151 + 1 Crimson + 2 OP10 = 76 boxes"],
            ["Capital products", "¥560K (~Rp 61.6M)"],
            ["Tax-free saving", "+¥56K (~Rp 6.2M)"],
            ["NET cost products", "Rp 55.4M"],
            ["Logistics 2 checked + 1 carry-on", "Rp 3M"],
            ["Customs declared partial", "Rp 5M"],
            ["Selling 76 boxes avg Rp 1.5M", "Rp 114M"],
            ["Marketplace fees mix 5%", "-Rp 2.3M"],
            ["Marketing", "Rp 1M"],
            ["NET REVENUE", "Rp 110.7M"],
            ["NET COST", "Rp 76.4M"],
            ["📊 PROFIT", "Rp 34.3M"],
            ["ROI", "45%"],
            ["Sell-through", "2-3 weeks"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs mt-2">
          Sweet spot. 3-4x/year = Rp 100-140M annual profit.
        </p>
      </Section>

      <Section title="🔴 SCENARIO C — Aggressive Run (7-10 cases)">
        <TableBlock
          headers={["Item", "Amount"]}
          rows={[
            ["Trip cost (full)", "Rp 25M"],
            ["Cases bought", "4 Pokemon 151 + 2 Crimson + 2 OP10 + 1 OP09 = 168 boxes"],
            ["Capital products", "¥1.2M (~Rp 132M)"],
            ["Tax-free saving", "+¥120K (~Rp 13.2M)"],
            ["NET cost products", "Rp 118.8M"],
            ["Logistics + air freight", "Rp 8M"],
            ["Customs commercial declared", "Rp 18M (~12% of value)"],
            ["Selling 168 boxes avg Rp 1.5M", "Rp 252M"],
            ["Marketplace fees mix 4%", "-Rp 10M"],
            ["Marketing + content", "Rp 3M"],
            ["NET REVENUE", "Rp 239M"],
            ["NET COST", "Rp 169.8M"],
            ["📊 PROFIT (success)", "Rp 69.2M"],
            ["⚠️ Risk: 20% slow-move", "Rp 30M tied up beyond 4 wk"],
            ["ROI (success)", "41%"],
            ["Sell-through", "3-4 weeks"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs mt-2">
          High capital, high return. Only Phase 3+ after demand validated. Customs flag risk = honest declare + spread trips.
        </p>
      </Section>

      <Section title="📊 ANNUAL PROJECTION (sealed-focused)">
        <TableBlock
          headers={["Year", "Trips", "Mode", "Profit/year"]}
          rows={[
            ["2026 (current)", "1 (DONE)", "Test (mostly personal)", "Phase 1 actual TBD"],
            ["Late 2026", "1 sealed test", "Test sealed-first", "Rp 15-25M test profit"],
            ["2027", "3-4", "Standard sealed-heavy", "Rp 100-140M"],
            ["2028", "4-5", "Std + 1 Aggressive", "Rp 180-250M"],
            ["2029", "4-6", "Aggressive sealed cases", "Rp 250-350M"],
          ]}
        />
        <p className="text-rpg-borderMid italic text-[10px] sm:text-xs mt-2">
          Sealed-focused = 2-3x profit potential vs mixed strategy. By 2029 = OKU Trade salary equivalent (Rp 300-400M).
        </p>
      </Section>
    </>
  );
}

// ============ RISK ASSESSMENT ============
function RiskAssessment() {
  return (
    <>
      <Section title="⚠️ SEALED-STRATEGY RISKS">
        <TableBlock
          headers={["Risk", "Prob", "Impact", "Mitigation"]}
          rows={[
            ["Customs flag (cases obvious)", "Med-High", "High", "Spread 3-5 trips/year, declare honest, allowance discipline"],
            ["Pokemon Center purchase limit", "High", "Med", "Multi-shop sourcing, lottery ticket"],
            ["Set demand crash post-release", "Low-Med", "High", "Avoid hoarding old sets, fresh release focus"],
            ["Inv stuck (slow moving set)", "Med", "Med", "Pre-orders before trip, Twitter teaser"],
            ["Sealed box damage transit", "Low", "High", "Hard case + bubble + climate bag"],
            ["FX volatility (¥/Rp)", "Med", "Low", "Pre-buy partial IDR, monitor JPY"],
            ["Indo regulation change", "Low", "High", "Monitor Bea Cukai TCG classification"],
            ["Competitor undercut price", "Med", "Med", "Differentiate brand + speed + crypto pay"],
            ["FB group ban/exit", "Low-Med", "High", "Build Twitter + Telegram backup audience"],
            ["Buyer refund chargeback", "Low", "Low-Med", "COD first 3 trans, reputation build"],
            ["Trip burnout (4-5x/year)", "Med", "Med", "Combine vacation, treat holistic"],
            ["Counterfeit seal (rare)", "Very low", "High", "Pokemon Center direct + Mandarake/Surugaya only"],
          ]}
        />
      </Section>

      <Section title="🛡️ DEFENSIVE STRATEGIES">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Customs allowance discipline:</strong> $500 USD declared/trip. Multi-trip approach safer than mega-haul. 3-4 trips/year baseline.</li>
          <li><strong>Sealed video archive:</strong> Every box filmed pre-ship with tax-free receipt visible. Trust gold + chargeback defense.</li>
          <li><strong>Set diversification:</strong> Don't go all-in on 1 set. Mix Pokemon (2-3 sets) + OP (2-3 sets) per trip.</li>
          <li><strong>Pre-order DP system:</strong> 30% deposit pre-trip = locks demand + capital flow + reduces unsold risk.</li>
          <li><strong>Capital reserve 25%:</strong> Always 1/4 capital free for next trip. Avoid forced fire-sale.</li>
          <li><strong>Network leverage:</strong> ETHJKT + crypto Twitter = trust pre-built. Faster sell-through vs cold traffic.</li>
          <li><strong>P&L tracking obsessive:</strong> Spreadsheet every transaction. KPI: ROI/box, sell-through days, repeat buyer rate.</li>
          <li><strong>Backup audience build:</strong> FB + Twitter + Telegram + Discord. Don't depend single channel.</li>
        </ul>
      </Section>
    </>
  );
}

// ============ ROADMAP ============
function Roadmap() {
  return (
    <>
      <Section title="🗺️ 4-PHASE ROADMAP (sealed-focused)">
        <p>Build slow, validate sealed demand each phase, scale capital toward case-heavy.</p>
      </Section>

      <Section title="🌱 PHASE 1: VALIDATION (May-Jul 2026)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>✅ Apr 21-May 4 trip: Personal aesthetic + investment grails (NOT sealed-focused) — DONE</li>
          <li>📋 May 2026: Catalog Apr trip purchases. Sell aesthetic singles via FB + Twitter test.</li>
          <li>📋 May-Jun 2026: Build FB group presence, post in Pokemon TCG Indo + OP TCG Indo. Profile build.</li>
          <li>📋 Jul 2026: <strong>Quick test trip (3-5 days, sealed-focus)</strong> — 1-2 cases buy, immediate sell test</li>
          <li><strong>Capital:</strong> Rp 25-35M (Phase 1 sealed test)</li>
          <li><strong>Goal:</strong> Validate sealed FB demand + sell-through speed. Build buyer list 50+.</li>
        </ul>
      </Section>

      <Section title="🌿 PHASE 2: BRAND + SCALE (Aug 2026 - Jun 2027)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>📋 Aug 2026: Brand handle (@zexotcg). Launch Twitter + Telegram + IG.</li>
          <li>📋 Sep 2026: Trip 2 (4-day Tokyo sealed-focus). Standard run Rp 50-70M.</li>
          <li>📋 Oct-Nov 2026: Sell-through 2-3 weeks. Content marketing.</li>
          <li>📋 Dec 2026: Trip 3 (winter season holiday demand spike). Standard run.</li>
          <li>📋 Mar 2027: Trip 4 (spring). Test 5-case run.</li>
          <li>📋 Jun 2027: Trip 5 (Wedding pre-prep with Keiko). 7+ cases aggressive run.</li>
          <li><strong>Capital:</strong> Rp 50-100M per trip</li>
          <li><strong>Goal:</strong> 200+ buyer base, Rp 80-140M annual profit, brand established. Wedding July 2027 partial funded.</li>
        </ul>
      </Section>

      <Section title="🌳 PHASE 3: SCALE OPERATION (Jul 2027 - Dec 2028)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>📋 Q3 2027: Hire VA Indo for fulfillment + customer service (post-wedding return)</li>
          <li>📋 Launch Tokopedia Power Merchant + Shopee Mall storefront</li>
          <li>📋 4-5 trips/year aggressive scaling, 5-7 cases per trip</li>
          <li>📋 Build B2B reseller network (cheap bulk to local TCG shops)</li>
          <li>📋 Air freight bulk shipment kalau capital >¥1M per trip</li>
          <li><strong>Capital:</strong> Rp 100-200M per trip</li>
          <li><strong>Goal:</strong> Rp 180-250M annual profit. Top jastip TCG Indo brand top-3.</li>
        </ul>
      </Section>

      <Section title="🌲 PHASE 4: MATURE BUSINESS (2029+)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>📋 Setup PT/CV business entity (tax efficiency + legitimacy)</li>
          <li>📋 Direct wholesaler relationship Japan (B2B pricing -15-20%)</li>
          <li>📋 Diversify Korea/HK trips (alternative TCG sources)</li>
          <li>📋 Premium Discord tier (Rp 5-10M/year membership)</li>
          <li>📋 Content team: vlogger + photographer + admin</li>
          <li>📋 Box-cracking livestream business arm (TikTok lives)</li>
          <li><strong>Capital:</strong> Rp 200-400M per trip</li>
          <li><strong>Goal:</strong> Rp 300-400M annual profit. OKU Trade salary equivalent achieved.</li>
        </ul>
      </Section>

      <Section title="🎯 SUCCESS METRICS">
        <TableBlock
          headers={["KPI", "P1", "P2", "P3", "P4"]}
          rows={[
            ["Trips/yr", "1-2", "3-4", "4-5", "5-6"],
            ["Capital/trip", "25-35M", "50-100M", "100-200M", "200-400M"],
            ["Cases/trip", "1-2", "3-5", "5-7", "7-10+"],
            ["Sell 2 wk", "50%", "70%", "80%", "85%"],
            ["Buyers active", "50+", "200+", "500+", "2000+"],
            ["Profit/yr", "15-25M", "80-140M", "180-250M", "300-400M"],
            ["FB group rep", "Active", "Trusted", "Top 5", "Top 1-3"],
          ]}
        />
      </Section>

      <Section title="🔥 IMMEDIATE NEXT STEPS (May 2026)">
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>📸 Catalog Apr trip purchases (cards + Prada + Nintendo cartridge) di Notion/Sheets</li>
          <li>📱 Build FB profile presence — post in Pokemon TCG Indo + OP TCG Indo (tanya/share)</li>
          <li>🔍 Survey current sealed prices Indo FB groups (data gathering 1-2 weeks)</li>
          <li>💡 Decide: Trip 2 timing Jul 2026 (sealed-focus test)</li>
          <li>🎯 Pre-trip teaser Twitter/FB: "Sourcing Japan Jul, sealed Pokemon + OP available, DM pre-order"</li>
          <li>💰 Capital plan: alokasi Rp 25-35M dari FORU TGE atau OKU bonus untuk Phase 1 sealed test</li>
          <li>📊 Setup Notion/Airtable inventory tracking (cost, sell price, days-to-sell, buyer)</li>
        </ul>
      </Section>
    </>
  );
}
