import { useState } from 'react'

const dailyOutfits = [
  { day: 1, date: 'Apr 21', city: 'Tokyo→Kyoto', vibe: 'Travel/recovery', faisal: 'Joggers + plain tee + light hoodie', keiko: 'Comfy travel set + light cardigan', note: 'Sleep mode after Shinkansen' },
  { day: 2, date: 'Apr 22', city: 'Kyoto', vibe: 'Vermilion contrast', faisal: 'Cream/beige linen shirt, olive shorts or chinos, denim cap', keiko: 'Earth-tone dress + light jacket', note: 'Neutrals make Fushimi Inari\'s orange torii POP in photos' },
  { day: 3, date: 'Apr 23', city: 'Kyoto', vibe: 'Earth & green', faisal: 'Olive/forest green tee, beige cargo pants, light overshirt', keiko: 'Sage/cream blouse, neutral pants', note: 'Bamboo grove = green palette' },
  { day: 4, date: 'Apr 24', city: 'Kyoto 🚲', vibe: 'Athletic-casual', faisal: 'Tech tee, breathable joggers, fanny pack', keiko: 'Athletic top + stretchy pants', note: '6 temples by bike — function over fashion' },
  { day: 5, date: 'Apr 25', city: 'Kyoto/Nara', vibe: 'Soft earthtone', faisal: 'Cream sweater AM (cool), neutral pants', keiko: 'Warm pastel top, comfy bottoms', note: '⚠️ No dangling straps near deer (they bite)' },
  { day: 6, date: 'Apr 26', city: 'Kyoto→Gifu', vibe: 'Smart-casual', faisal: 'Collared overshirt, dark chinos, mid-layer', keiko: 'Cute blouse + jeans, layer for ropeway', note: 'Castle photos = put-together look' },
  { day: 7, date: 'Apr 27', city: 'Gifu', vibe: '✨ Pre-wedding palette', faisal: 'Sage/cream button-up, off-white pants', keiko: 'Pastel dress, cream cardigan', note: 'Monet\'s Pond + private onsen — coordinate colors!' },
  { day: 8, date: 'Apr 28', city: 'Gifu→Takayama', vibe: 'Folkloric/cozy', faisal: 'Brown/rust henley, dark utility pants, vest', keiko: 'Earth tones, knit sweater', note: 'Edo wooden town = warm/aged tones' },
  { day: 9, date: 'Apr 29', city: 'Kamikochi 🏔️', vibe: 'Full hike kit', faisal: 'Moisture-wicking base, hiking pants, fleece, rain shell, cap, gloves', keiko: 'Same setup if joining — function only', note: 'Mountain weather flips fast at 1,500m. NO sandals/sneakers.' },
  { day: 10, date: 'Apr 30', city: 'Takayama', vibe: 'Free day comfy', faisal: 'Plain tee + comfy pants', keiko: 'Lounge outfit, easy', note: 'Laundry day — wear what you don\'t mind washing' },
  { day: 11, date: 'May 1', city: 'Takayama 🚲', vibe: 'Athletic + warm layer', faisal: 'Long-sleeve tech tee, joggers, cycling shell — earthy colors', keiko: 'Active outfit + light jacket', note: 'Shirakawa-go ochre houses = wear browns/greens for photos' },
  { day: 12, date: 'May 2', city: 'Tokyo (Akiba)', vibe: 'Streetwear / otaku district', faisal: 'Graphic tee, cargo pants, light bomber + slim crossbody', keiko: 'Tokyo street fashion — go bolder', note: 'You\'ll fit right in. Pack lighter for card carry.' },
  { day: 13, date: 'May 3', city: 'Tokyo (flea + sushi)', vibe: 'Smart-casual evolving', faisal: 'Dark jeans + clean overshirt; layer up for sushi', keiko: 'Cute day outfit → dressier evening swap', note: 'Farewell sushi = look the part' },
  { day: 14, date: 'May 4', city: 'Tokyo→Home', vibe: 'Airport easy', faisal: 'Joggers, zip hoodie, slip-ons', keiko: 'Comfy travel set', note: 'Comfort > drip' },
]

const faisalShoes = [
  { name: 'NB FuelCell Rebel V5', role: 'Daily walker + 5AM runs', days: '1-8, 10-14', source: 'Bring from Indo ✅', cost: 'Have it', why: 'Your existing shoe — light, max cushion, perfect for road miles + city walks' },
  { name: 'Mont-bell Tazawa (or equiv)', role: 'Kamikochi hike + future naik gunung', days: 'Day 9 only', source: 'Buy Day 1 evening at Kyoto Yodobashi OR Day 2 at Mont-bell Kawaramachi', cost: '¥15-20K (Rp 1.6-2.1M)', why: 'Trail-grade Vibram outsole, Gore-Tex waterproof, wide-fit option. Investment for Indo peaks too.' },
]

const keikoShoes = [
  { name: 'Skechers Slip-ins (Hands Free)', role: 'Daily walker + temple shoe-off ease', days: '1-8, 10-14', source: 'Buy in Jakarta/BSD before flying', cost: 'Rp 1.2-1.8M', why: 'Designed for "step in no hands" — perfect for temple removals. Cushion for 20K steps.' },
  { name: 'Crocs Mellow (or LiteRide 360)', role: 'Ryokan/hotel slip-on, plane shoe, recovery', days: 'Hotel use, evenings', source: 'Buy in Indo or 2nd Street Tokyo', cost: 'Rp 600-800K', why: 'Shoe-off zones (Dormy Inn, tatami restaurants). NOT for primary walking — calves die.' },
  { name: 'Optional: Workman trail shoe', role: 'Kamikochi if joining hike', days: 'Day 9 only', source: 'Workman Plus Takayama or skip the hike', cost: '¥3,900 (Rp 420K)', why: 'Cheap one-day insurance. Or sit Day 9 out — no shame in skipping a 6h alpine hike.' },
]

const thriftStops = [
  { name: '2nd Street Shimokitazawa', day: 'Day 13 (May 3 PM)', for: 'Streetwear, vintage denim, graphic tees', why: 'Already on your itinerary as optional. Stack the visit.' },
  { name: '2nd Street Harajuku', day: 'Day 12 or 13', for: 'Fashion-forward pieces, Keiko\'s outfits', why: 'Walk over from Akiba area. Big inventory.' },
  { name: '2nd Street Ueno', day: 'Day 13 (with Ameyoko)', for: 'General thrift, near where you already are', why: 'Right next to Ameyoko Market on existing schedule.' },
  { name: 'Mont-bell Kyoto Kawaramachi', day: 'Day 2 morning', for: 'Hiking shoe + future naik gunung jacket', why: 'Premium Japanese outdoor brand. Combine with Nishiki Market visit.' },
  { name: 'HARD OFF / OFF HOUSE (Tokyo)', day: 'Day 12-13', for: 'Cameras, electronics, vintage tech', why: 'Different chain, hard goods focus' },
  { name: 'Mercari (app)', day: 'Set up NOW', for: 'Specific grail hunts, ship to Super Hotel Akihabara', why: 'Online C2C. Sometimes better deals than in-store thrift.' },
]

export default function Wardrobe() {
  const [openDay, setOpenDay] = useState(null)
  const [tab, setTab] = useState('outfits')

  return (
    <section id="wardrobe" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-cream/40 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sakura font-heading font-semibold text-sm tracking-widest uppercase mb-3">旅装 — Wardrobe & Shoes</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-dark mb-4">What to Wear</h2>
          <p className="text-dark-light max-w-2xl mx-auto text-lg">
            14-day outfit plan, shoe loadout strategy, and where to thrift-hunt in Tokyo.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {[
            { id: 'outfits', label: '👕 Daily Outfits' },
            { id: 'shoes', label: '👟 Shoe Loadout' },
            { id: 'thrift', label: '🛍️ Thrift Map' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-sakura text-white shadow-md'
                  : 'bg-white text-dark-light hover:bg-sakura/10 border border-sakura/20'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Daily Outfits */}
        {tab === 'outfits' && (
          <div className="space-y-3">
            {dailyOutfits.map((d) => (
              <div
                key={d.day}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                  openDay === d.day ? 'border-sakura ring-2 ring-sakura/20 shadow-lg' : 'border-sakura/10 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpenDay(openDay === d.day ? null : d.day)}
                  className="w-full text-left p-4 flex items-center gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sakura/10 flex flex-col items-center justify-center">
                    <span className="text-xs text-sakura-dark font-semibold">DAY</span>
                    <span className="text-lg font-heading font-bold text-sakura-dark">{d.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-dark-light">{d.date}</span>
                      <span className="text-xs bg-cream px-2 py-0.5 rounded-full font-semibold text-dark-light">{d.city}</span>
                    </div>
                    <h3 className="font-heading font-bold text-dark text-base">{d.vibe}</h3>
                  </div>
                  <svg className={`w-5 h-5 text-sakura flex-shrink-0 transition-transform ${openDay === d.day ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDay === d.day && (
                  <div className="px-4 pb-4 space-y-3 animate-fade-in-up">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-800 mb-1">👨 Faisal</p>
                      <p className="text-sm text-blue-900">{d.faisal}</p>
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-pink-800 mb-1">👩 Keiko</p>
                      <p className="text-sm text-pink-900">{d.keiko}</p>
                    </div>
                    {d.note && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs text-amber-800"><span className="font-semibold">💡 Note:</span> {d.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Shoe Loadout */}
        {tab === 'shoes' && (
          <div className="space-y-8">
            {/* Strategy callout */}
            <div className="bg-gradient-to-br from-sakura/10 to-cream rounded-2xl p-5 border border-sakura/20">
              <h3 className="font-heading font-bold text-dark mb-2">🎯 Strategy</h3>
              <ul className="text-sm text-dark space-y-1.5">
                <li>• Faisal: bring Rebel V5 from Indo. Buy hiking shoe in <strong>Kyoto Day 1-2</strong> (NOT Takayama Day 8 — no break-in window).</li>
                <li>• Keiko: buy Skechers Slip-ins in Jakarta before flying. Crocs as hotel utility.</li>
                <li>• Break in any new shoe over Kyoto Days 2-5 (~40km walking) before Kamikochi Day 9.</li>
                <li>• Total budget: ~Rp 4-5M for both, future naik gunung gear included.</li>
              </ul>
            </div>

            {/* Faisal */}
            <div>
              <h3 className="font-heading font-bold text-dark mb-3 flex items-center gap-2">
                <span className="text-2xl">👨</span> Faisal — 2 pairs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faisalShoes.map((s) => (
                  <div key={s.name} className="bg-white rounded-2xl p-5 shadow-sm border border-blue-200">
                    <h4 className="font-heading font-bold text-blue-900 mb-2">{s.name}</h4>
                    <p className="text-sm text-dark mb-3">{s.role}</p>
                    <div className="space-y-1.5 text-xs">
                      <p><span className="font-semibold text-dark-light">Days:</span> {s.days}</p>
                      <p><span className="font-semibold text-dark-light">Source:</span> {s.source}</p>
                      <p><span className="font-semibold text-dark-light">Cost:</span> {s.cost}</p>
                    </div>
                    <p className="text-xs text-dark-light mt-3 italic">{s.why}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keiko */}
            <div>
              <h3 className="font-heading font-bold text-dark mb-3 flex items-center gap-2">
                <span className="text-2xl">👩</span> Keiko — 2-3 pairs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {keikoShoes.map((s) => (
                  <div key={s.name} className="bg-white rounded-2xl p-5 shadow-sm border border-pink-200">
                    <h4 className="font-heading font-bold text-pink-900 mb-2">{s.name}</h4>
                    <p className="text-sm text-dark mb-3">{s.role}</p>
                    <div className="space-y-1.5 text-xs">
                      <p><span className="font-semibold text-dark-light">Days:</span> {s.days}</p>
                      <p><span className="font-semibold text-dark-light">Source:</span> {s.source}</p>
                      <p><span className="font-semibold text-dark-light">Cost:</span> {s.cost}</p>
                    </div>
                    <p className="text-xs text-dark-light mt-3 italic">{s.why}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">💡 Pro tip:</span> Swap Rebel V5 laces for elastic no-tie laces (Lock Laces, Caterpy — Rp 50-100K on Tokopedia). Turns it into a slip-on for temple days. Lighter than packing a 3rd pair.
              </p>
            </div>
          </div>
        )}

        {/* Thrift */}
        {tab === 'thrift' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-sakura/10 to-cream rounded-2xl p-5 border border-sakura/20">
              <h3 className="font-heading font-bold text-dark mb-2">🛍️ Why Thrift in Japan?</h3>
              <p className="text-sm text-dark mb-2">
                Japanese sellers ditch barely-worn gear constantly. <strong>2nd Street</strong> is the biggest chain — fashion, streetwear, outerwear at 30-70% off retail.
              </p>
              <p className="text-sm text-dark">
                <strong>Skip used hiking shoes</strong> (dead foam, worn lugs = safety risk for Kamikochi). Everything else: fair game.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {thriftStops.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-5 shadow-sm border border-sakura/10">
                  <h4 className="font-heading font-bold text-dark mb-2">{t.name}</h4>
                  <div className="space-y-1.5 text-xs mb-3">
                    <p><span className="font-semibold text-dark-light">When:</span> {t.day}</p>
                    <p><span className="font-semibold text-dark-light">Hunt for:</span> {t.for}</p>
                  </div>
                  <p className="text-xs text-dark-light italic">{t.why}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">📱 Mercari setup:</span> Download the Mercari Japan app NOW. Set up account before flying. Ship targeted finds to your Super Hotel Akihabara (Days 12-14).
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
