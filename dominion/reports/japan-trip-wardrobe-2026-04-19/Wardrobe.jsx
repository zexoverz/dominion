import { useState } from 'react'

// Data: Daily outfits — what to wear each day and where each item comes from
const dailyOutfits = [
  { day: 1, date: 'Apr 21 Sel', city: 'Tokyo→Kyoto', outfit: 'Jogger + kaos polos + jaket hoodie', indo: 'Semua', thrift: '—', uniqlo: '—' },
  { day: 2, date: 'Apr 22 Rab', city: 'Kyoto (Fushimi Inari)', outfit: 'Kaos polos + celana pendek olive + topi', indo: 'Semua', thrift: '— (thrift baru sore jam 16:30)', uniqlo: '—' },
  { day: 3, date: 'Apr 23 Kam', city: 'Kyoto (Arashiyama)', outfit: 'Kaos polos + chino beige + overshirt', indo: 'Kaos, chino', thrift: 'Overshirt (Sesi 1)', uniqlo: '—' },
  { day: 4, date: 'Apr 24 Jum', city: 'Kyoto 🚲 temple circuit', outfit: 'Kaos cepat kering + jogger (cycling)', indo: 'Semua (kit olahraga)', thrift: '—', uniqlo: '—' },
  { day: 5, date: 'Apr 25 Sab', city: 'Kyoto/Nara', outfit: 'Kaos polos + sweater krim + celana netral', indo: 'Semua', thrift: '— (thrift sore jam 17:30)', uniqlo: '—' },
  { day: 6, date: 'Apr 26 Min', city: 'Kyoto→Gifu', outfit: 'Kemeja kerah + chino gelap + jaket hoodie', indo: 'Chino, hoodie', thrift: 'Kemeja (Sesi 2)', uniqlo: '—' },
  { day: 7, date: 'Apr 27 Sen', city: 'Gifu Monet\'s Pond ✨', outfit: 'Kemeja sage/krim + celana putih/krim (pre-wedding photo)', indo: '⭐ WAJIB dari Indo', thrift: '—', uniqlo: '—' },
  { day: 8, date: 'Apr 28 Sel', city: 'Gifu→Takayama Edo', outfit: 'Henley coklat + chino gelap + rompi', indo: 'Chino', thrift: 'Henley + rompi (Sesi 2)', uniqlo: '—' },
  { day: 9, date: 'Apr 29 Rab', city: 'KAMIKOCHI 🏔️', outfit: 'Base layer + hiking pants + fleece + jaket hujan', indo: 'Hiking pants, fleece, jaket hujan', thrift: '—', uniqlo: 'Heattech base layer' },
  { day: 10, date: 'Apr 30 Kam', city: 'Takayama free (laundry)', outfit: 'Kaos polos + jogger', indo: 'Semua', thrift: '—', uniqlo: '—' },
  { day: 11, date: 'May 1 Jum', city: 'Takayama 🚲 + Shirakawa-go', outfit: 'AIRism lengan panjang + jogger + jaket cycling', indo: 'Jogger', thrift: '—', uniqlo: 'AIRism top' },
  { day: 12, date: 'May 2 Sab', city: 'Tokyo Akihabara', outfit: 'Pagi: kaos polos + jogger → Sore: graphic + cargo + bomber', indo: 'Pagi saja', thrift: 'Sore MEGA HAUL (Sesi 3)', uniqlo: '—' },
  { day: 13, date: 'May 3 Min', city: 'Tokyo flea + sushi', outfit: 'Jeans + graphic tee + overshirt bersih', indo: '—', thrift: 'Semua (Sesi 3+4)', uniqlo: '—' },
  { day: 14, date: 'May 4 Sen', city: 'Tokyo→Pulang ✈️', outfit: 'Jogger + hoodie + slip-on', indo: 'Semua', thrift: '—', uniqlo: '—' },
]

// Data: Pack list from Indonesia
const packIndo = {
  'Atasan (5 buah)': [
    { item: '4× Kaos polos biasa', note: 'rotasi Day 1, 2, 4, 5, 10' },
    { item: '1× Kemeja sage/krim ⭐', note: 'Day 7 pre-wedding WAJIB' },
  ],
  'Layer (4 buah)': [
    { item: '1× Sweater krim rajut', note: 'Day 5 pagi + malam dingin' },
    { item: '1× Jaket hoodie ritsleting', note: 'Day 1, 14, cadangan' },
    { item: '1× Jaket hujan packable', note: 'Day 9 WAJIB' },
    { item: '1× Jaket fleece', note: 'Day 9 WAJIB' },
  ],
  'Bawahan (4 buah)': [
    { item: '1× Celana chino beige', note: 'Day 2, 3' },
    { item: '1× Celana chino gelap', note: 'Day 6, 7, 8' },
    { item: '1× Celana pendek olive', note: 'Day 2' },
    { item: '1× Celana jogger', note: 'Day 1, 4, 10, 14' },
  ],
  'Kit Hiking (3 buah)': [
    { item: '1× Celana hiking panjang', note: 'Day 9 WAJIB (BUKAN jeans)' },
    { item: '2 pasang Kaos kaki hiking tebal', note: 'Day 9 anti-lecet' },
    { item: '1 pasang Sarung tangan tipis', note: 'Day 8 pagi + Day 9' },
  ],
  'Kit Olahraga (6 buah)': [
    { item: '2× Kaos cepat kering lengan pendek', note: 'Day 2, 3, 4, 5, 6, 12, 13, 14' },
    { item: '3× Celana pendek lari (cepat kering)', note: 'rotasi 9 sesi workout' },
    { item: '1× Celana olahraga panjang (non-katun)', note: 'Day 8 + lapisan Day 9' },
  ],
  'Dalaman + Kaos Kaki': [
    { item: '7× Celana dalam biasa', note: 'cuci Day 10' },
    { item: '4× Celana dalam olahraga (anti-lecet)', note: 'tiap workout' },
    { item: '3× Kaos kaki biasa', note: '' },
    { item: '5× Kaos kaki olahraga (non-katun)', note: 'WAJIB non-katun, anti-lecet' },
  ],
  'Aksesoris + Sepatu': [
    { item: '1× Topi lari', note: 'outdoor runs' },
    { item: '1× Ikat pinggang, 1× Kacamata hitam', note: '' },
    { item: '1× Handuk kecil cepat kering', note: 'keringat + onsen' },
    { item: '1× Tas pinggang, 1× Daypack', note: 'Day 4 cycling + Day 9 hiking' },
    { item: '👟 NB FuelCell Rebel V5', note: 'daily walk + runs' },
  ],
}

// Data: Shopping in Japan
const shopJapan = [
  { when: 'Day 1 malam / Day 2 pagi', where: 'Kyoto Yodobashi / Mont-bell Kawaramachi', item: '🥾 Sepatu hiking Gore-Tex', price: '¥15-20K (Rp 1.6-2.1M)', why: 'Safety-critical. Butuh 5 hari break-in sebelum Day 9 Kamikochi.' },
  { when: 'Day 2 pagi', where: 'Uniqlo Kyoto Shijo-Kawaramachi atau BIC Camera', item: '👕 Uniqlo AIRism Performance Long Sleeve', price: '¥1,500 (Rp 165K)', why: 'Day 8 lari Nagara 3-8°C + Day 10 opsional + Day 11 cycling' },
  { when: 'Day 2 pagi', where: 'Uniqlo Kyoto (same visit)', item: '🌡️ Uniqlo Heattech Ultra Warm Long Sleeve', price: '¥1,990 (Rp 220K)', why: 'Base layer Day 9 Kamikochi. Investasi lifetime buat naik gunung Indo (Semeru, Rinjani).' },
]

// Data: Thrift sessions — 4 specific windows
const thriftSessions = [
  {
    num: 1,
    day: 'Day 2 Rab',
    time: '16:30-17:30',
    location: '2nd Street Kyoto Shijo-Kawaramachi',
    context: 'Selipkan setelah Teramachi arcade 16:00, sebelum Gion walk 17:30',
    targets: [
      'Overshirt denim atau flanel (Day 3, Day 6)',
      'Kaos gambar / graphic tee (Day 3, Day 8)',
    ],
    budget: '¥2,500-4,500 (Rp 275-500K)',
    priority: 'sedang',
  },
  {
    num: 2,
    day: 'Day 5 Sab',
    time: '17:30-18:30',
    location: '2nd Street Kyoto Shijo (round 2)',
    context: 'Last chance Kyoto. Setelah Nara pulang 16:00 + Nishiki shopping 17:30 → thrift → farewell dinner Pontocho 18:30',
    targets: [
      'Kaos kerah henley coklat/rust (Day 8 Takayama Edo)',
      'Rompi atau kardigan rajut (Day 6, Day 8)',
    ],
    budget: '¥4,500-7,500 (Rp 500-825K)',
    priority: 'tinggi',
  },
  {
    num: 3,
    day: 'Day 12 Sab',
    time: '18:00-19:30',
    location: '2nd Street Shimokitazawa (swap dari Nakano)',
    context: 'SWAP: skip Nakano Broadway, go Shimokitazawa langsung dari Akiba (JR + Odakyu, 30 min). Nakano bisa balik Day 13.',
    targets: [
      '⭐ Jaket bomber vintage Jepang (Day 12 + bawa pulang)',
      'Graphic tee / kaos band (Day 12, Day 14)',
      'Celana cargo atau celana kerja (Day 12)',
      '⭐ Vintage denim / celana jeans gelap (Day 13 + bawa pulang)',
    ],
    budget: '¥10,000-17,500 (Rp 1.1-1.9M)',
    priority: 'MEGA HAUL',
  },
  {
    num: 4,
    day: 'Day 13 Min',
    time: '13:30-15:00',
    location: '2nd Street Ueno',
    context: 'Setelah Tokyo International Forum flea market 12:00 + lunch 13:00 → walk/train ke Ueno (10 min) → 2nd Street → Ameyoko 15:00',
    targets: [
      'Overshirt bersih farewell sushi (Day 13 dinner)',
      'Piece Keiko (dress, kardigan)',
      'Cadangan kalau Sesi 3 ada yang kelewatan',
    ],
    budget: '¥5,000-10,500 (Rp 550K-1.15M)',
    priority: 'sedang',
  },
]

// Data: Workout per day
const workoutDays = [
  { day: 1, session: '😴 Istirahat (travel)', temp: '—', outfit: '—' },
  { day: 2, session: '🏃 Lari Kamogawa 5-8km + 💪 Push', temp: '8-12°C Kyoto', outfit: 'Kaos cepat kering lengan pendek + celana pendek lari + topi' },
  { day: 3, session: '🦵 Legs indoor', temp: 'indoor', outfit: 'Kaos cepat kering + celana pendek' },
  { day: 4, session: '🦾 Pull indoor', temp: 'indoor', outfit: 'Kaos cepat kering + celana pendek' },
  { day: 5, session: '💪 Push indoor', temp: 'indoor', outfit: 'Kaos cepat kering + celana pendek' },
  { day: 6, session: '🏃 Lari Kamogawa 5km', temp: '8-12°C Kyoto', outfit: 'Kaos cepat kering lengan pendek + celana pendek lari + topi' },
  { day: 7, session: '😌 Istirahat (onsen day)', temp: '—', outfit: '—' },
  { day: 8, session: '🏃 Lari Nagara 3-5km + 🦵 Legs', temp: '3-8°C DINGIN', outfit: '⚠️ AIRism lengan panjang + celana olahraga panjang + topi + sarung tangan' },
  { day: 9, session: '🥾 Hiking Kamikochi (ini workoutnya)', temp: '0-5°C Alps', outfit: 'Pake kit hiking (Heattech base + fleece + rain jacket + hiking pants)' },
  { day: 10, session: '🏃 Opsional lari Miyagawa', temp: '3-8°C', outfit: 'AIRism lengan panjang + celana olahraga panjang (kalau mau lari)' },
  { day: 11, session: '🚲 Cycling Shirakawa-go', temp: '—', outfit: 'Baju cycling dari outfit harian' },
  { day: 12, session: '💪 Push ringan indoor', temp: 'indoor', outfit: 'Kaos cepat kering + celana pendek' },
  { day: 13, session: '🏃 Lari Imperial Palace 5km + 🦾 Pull', temp: '10-15°C Tokyo', outfit: 'Kaos cepat kering lengan pendek + celana pendek lari + topi' },
  { day: 14, session: '🦵 Legs terakhir indoor', temp: 'indoor', outfit: 'Kaos cepat kering + celana pendek' },
]

export default function Wardrobe() {
  const [tab, setTab] = useState('outfits')

  const tabs = [
    { id: 'outfits', label: '📅 Outfit Harian' },
    { id: 'pack', label: '🎒 Bawaan Indo' },
    { id: 'shop', label: '🛒 Belanja Jepang' },
    { id: 'thrift', label: '🛍️ Thrift Plan' },
    { id: 'workout', label: '💪 Kit Olahraga' },
  ]

  return (
    <section id="wardrobe" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-cream/40 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sakura font-heading font-semibold text-sm tracking-widest uppercase mb-3">旅装 — Wardrobe & Shoes</p>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-dark mb-4">Pakaian & Belanja</h2>
          <p className="text-dark-light max-w-2xl mx-auto text-lg">
            Bawa minimum dari Indo, haul sisanya di Jepang. 4 sesi thrift + Uniqlo + sepatu hiking.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
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

        {/* Tab: Daily Outfits */}
        {tab === 'outfits' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-sakura/10 to-cream rounded-2xl p-5 border border-sakura/20 mb-4">
              <h3 className="font-heading font-bold text-dark mb-2">🎯 Strategi</h3>
              <p className="text-sm text-dark">
                Bawa dari Indo: Kit 5 hari Kyoto + kit olahraga + kit hiking + outfit Day 7. Haul Day 6-13 dari thrift + Uniqlo.
                Koper berangkat <strong>50% kosong</strong>, pulang <strong>85% full + piece Jepang</strong>.
              </p>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-sakura/10">
              <table className="w-full text-sm">
                <thead className="bg-sakura/5">
                  <tr>
                    <th className="text-left p-3 font-heading font-bold text-dark">Day</th>
                    <th className="text-left p-3 font-heading font-bold text-dark">Tanggal</th>
                    <th className="text-left p-3 font-heading font-bold text-dark">Kota</th>
                    <th className="text-left p-3 font-heading font-bold text-dark">Outfit</th>
                    <th className="text-left p-3 font-heading font-bold text-blue-700">🎒 Indo</th>
                    <th className="text-left p-3 font-heading font-bold text-purple-700">🛍️ Thrift</th>
                    <th className="text-left p-3 font-heading font-bold text-red-700">🏪 Uniqlo</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyOutfits.map((d) => (
                    <tr key={d.day} className="border-t border-sakura/10 hover:bg-cream/50">
                      <td className="p-3 font-bold text-sakura-dark">{d.day}</td>
                      <td className="p-3 text-dark-light text-xs">{d.date}</td>
                      <td className="p-3 text-dark-light text-xs">{d.city}</td>
                      <td className="p-3 text-dark">{d.outfit}</td>
                      <td className="p-3 text-blue-900 text-xs">{d.indo}</td>
                      <td className="p-3 text-purple-900 text-xs">{d.thrift}</td>
                      <td className="p-3 text-red-900 text-xs">{d.uniqlo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Pack from Indo */}
        {tab === 'pack' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-blue-900 mb-2">🎒 Yang Dibawa dari Indonesia</h3>
              <p className="text-sm text-blue-900">
                ~45 item textile + 1 sepatu. Koper 50% kosong — sisa buat haul thrift + oleh-oleh pulang.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(packIndo).map(([cat, items]) => (
                <div key={cat} className="bg-white rounded-2xl p-5 shadow-sm border border-sakura/10">
                  <h4 className="font-heading font-bold text-dark mb-3">{cat}</h4>
                  <ul className="space-y-2">
                    {items.map((i, idx) => (
                      <li key={idx} className="text-sm">
                        <div className="font-semibold text-dark">{i.item}</div>
                        {i.note && <div className="text-xs text-dark-light italic">{i.note}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Shop in Japan */}
        {tab === 'shop' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-red-900 mb-2">🛒 Belanja Wajib di Jepang (Non-Thrift)</h3>
              <p className="text-sm text-red-900">
                Sepatu hiking + Uniqlo AIRism + Heattech. Total ~Rp 2M. Semua di Kyoto Day 1-2 biar ada waktu break-in + pake.
              </p>
            </div>
            {shopJapan.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-red-200">
                <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                  <h4 className="font-heading font-bold text-dark">{s.item}</h4>
                  <span className="text-sm font-bold text-red-700">{s.price}</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <p><span className="font-semibold text-dark-light">Kapan:</span> {s.when}</p>
                  <p><span className="font-semibold text-dark-light">Di mana:</span> {s.where}</p>
                  <p className="text-dark-light italic mt-2">{s.why}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Thrift Plan */}
        {tab === 'thrift' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-purple-900 mb-2">🛍️ 4 Sesi Thrift — Total ¥22-40K (Rp 2.4-4.4M)</h3>
              <p className="text-sm text-purple-900">
                10-14 pieces. Semua di 2nd Street (chain terbesar Jepang). Jadwal nempel ke itinerary existing, gak butuh add-on jam.
              </p>
            </div>
            {thriftSessions.map((s) => (
              <div key={s.num} className={`bg-white rounded-2xl p-5 shadow-sm border ${
                s.priority === 'MEGA HAUL' ? 'border-purple-400 ring-2 ring-purple-200' : 'border-purple-200'
              }`}>
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <h4 className="font-heading font-bold text-dark">
                      {s.priority === 'MEGA HAUL' && '⭐⭐⭐ '}
                      Sesi {s.num} — {s.day}
                    </h4>
                    <p className="text-sm text-purple-700 font-semibold">{s.time} • {s.location}</p>
                  </div>
                  <span className="text-sm font-bold text-purple-900">{s.budget}</span>
                </div>
                <p className="text-xs text-dark-light italic mb-3">{s.context}</p>
                <div>
                  <p className="text-xs font-semibold text-dark-light mb-1.5">Target:</p>
                  <ul className="text-sm space-y-1">
                    {s.targets.map((t, i) => (
                      <li key={i} className="text-dark">• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">💡 Tips thrift:</span> Bawa cash ¥50K. Pake passport (tax-free 10% kalo spend ¥5K+ di satu toko). Timer HP 1 jam tiap sesi biar gak kebablasan. Foto tag harga, cek SNKR Dunk di HP kalo brand tertentu.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Workout per day */}
        {tab === 'workout' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-green-900 mb-2">💪 9 Sesi Workout + 1 Opsional</h3>
              <p className="text-sm text-green-900">
                5 outdoor + 4 indoor + 1 hiking. Laundry Day 10 Takayama coin laundry (Rp 70-120K).
              </p>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-sakura/10">
              <table className="w-full text-sm">
                <thead className="bg-sakura/5">
                  <tr>
                    <th className="text-left p-3 font-heading font-bold text-dark">Day</th>
                    <th className="text-left p-3 font-heading font-bold text-dark">Sesi</th>
                    <th className="text-left p-3 font-heading font-bold text-dark">Suhu</th>
                    <th className="text-left p-3 font-heading font-bold text-dark">Outfit</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutDays.map((w) => (
                    <tr key={w.day} className={`border-t border-sakura/10 ${
                      w.outfit.includes('AIRism') || w.outfit.includes('Heattech') ? 'bg-red-50/40' : ''
                    } ${w.session.includes('Kamikochi') ? 'bg-emerald-50/40' : ''}`}>
                      <td className="p-3 font-bold text-sakura-dark">{w.day}</td>
                      <td className="p-3 text-dark">{w.session}</td>
                      <td className="p-3 text-dark-light text-xs whitespace-nowrap">{w.temp}</td>
                      <td className="p-3 text-dark text-xs">{w.outfit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm text-amber-900">
                <span className="font-semibold">⚠️ Prinsip layering:</span> JANGAN pake jaket tanpa kaos dalaman. Keringet nempel = flu risk. Always: base layer (cepat kering) + outer shell (jaket) kalo perlu. Start lari dikit dingin OK — 10 menit kemudian panas sendiri.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
