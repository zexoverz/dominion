# Portfolio Dashboard — Technical Spec
**Feature: Personal Investment & Collectibles Dashboard**
**Author: THRONE | Date: March 12, 2026**

---

## Overview

A new section in the Dominion frontend: **Lord Zexo's Portfolio** — a comprehensive personal finance dashboard with investment tracking, collectible card inventory, live price scraping, and analytics. Always synced with the masterplan.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  DOMINION FRONTEND                   │
│  /portfolio ── Dashboard (charts, net worth, DCA)    │
│  /portfolio/collectibles ── Card Deck View           │
│  /portfolio/analytics ── ROI, projections, fire sale │
│  /portfolio/masterplan ── Rendered masterplan v2.1    │
└──────────────────────┬──────────────────────────────┘
                       │ API calls
┌──────────────────────▼──────────────────────────────┐
│                  DOMINION API                        │
│  /api/portfolio/summary ── Net worth, allocations    │
│  /api/portfolio/btc ── BTC holdings + DCA history    │
│  /api/portfolio/cards ── Card inventory + prices     │
│  /api/portfolio/cards/prices ── Latest scraped prices│
│  /api/portfolio/war-chest ── War chest status        │
│  /api/portfolio/wedding ── Wedding fund tracker      │
│  /api/portfolio/dca-log ── Monthly DCA log           │
│  /api/portfolio/projections ── 2030 net worth calc   │
└──────────────────────┬──────────────────────────────┘
                       │ DB queries + scraper
┌──────────────────────▼──────────────────────────────┐
│               POSTGRESQL (new tables)                │
│  portfolio_holdings ── BTC, USDT, FORU, etc.         │
│  portfolio_cards ── One Piece & Pokemon inventory     │
│  portfolio_card_prices ── Scraped price history       │
│  portfolio_dca_log ── Monthly DCA records             │
│  portfolio_fund_tracker ── Wedding + War Chest        │
└──────────────────────┬──────────────────────────────┘
                       │ cron scraper
┌──────────────────────▼──────────────────────────────┐
│              PRICE SCRAPER (cron job)                 │
│  Runs daily/weekly via THRONE heartbeat              │
│  Sources: Yuyu-tei, eBay sold listings, SNKRDUNK    │
│  Writes to portfolio_card_prices table               │
└─────────────────────────────────────────────────────┘
```

---

## Database Schema (New Tables)

### `portfolio_holdings`
Core investment positions.

```sql
CREATE TABLE portfolio_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_type TEXT NOT NULL CHECK (asset_type IN ('btc', 'usdt', 'fiat_idr', 'fiat_usd', 'token', 'gold')),
    asset_name TEXT NOT NULL,           -- 'Bitcoin', 'USDT War Chest', 'Wedding Fund', etc.
    quantity DECIMAL(20,8) NOT NULL,    -- 0.153 BTC, etc.
    cost_basis_usd DECIMAL(12,2),      -- Total USD spent to acquire
    cost_basis_idr DECIMAL(16,0),      -- Total IDR spent
    category TEXT NOT NULL CHECK (category IN ('investment', 'war_chest', 'wedding', 'gold', 'write_off')),
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `portfolio_cards`
Collectible card inventory (One Piece + Pokemon).

```sql
CREATE TABLE portfolio_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    franchise TEXT NOT NULL CHECK (franchise IN ('one_piece', 'pokemon')),
    card_name TEXT NOT NULL,            -- 'Zoro Flagship OP01-025'
    card_code TEXT,                     -- 'OP01-025', 'SV2a-151', etc.
    set_name TEXT,                      -- 'Romance Dawn', 'Pokemon 151'
    rarity TEXT,                        -- 'SEC', 'SR', 'Parallel', etc.
    grade TEXT,                         -- 'PSA 10', 'Raw', 'BGS 9.5'
    quantity INTEGER NOT NULL DEFAULT 1,
    purchase_price_usd DECIMAL(10,2),
    purchase_price_idr DECIMAL(14,0),
    purchase_date DATE,
    purchase_source TEXT,               -- 'Tokopedia', 'eBay', 'Local shop'
    current_price_usd DECIMAL(10,2),   -- Latest scraped price
    current_price_idr DECIMAL(14,0),
    price_updated_at TIMESTAMPTZ,
    image_url TEXT,                     -- Card image for deck view
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true, -- false = sold
    sold_price_usd DECIMAL(10,2),
    sold_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolio_cards_franchise ON portfolio_cards (franchise, is_active);
```

### `portfolio_card_prices`
Price history from scraping (for charts).

```sql
CREATE TABLE portfolio_card_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL REFERENCES portfolio_cards(id) ON DELETE CASCADE,
    source TEXT NOT NULL CHECK (source IN ('yuyu_tei', 'ebay_sold', 'ebay_listing', 'snkrdunk', 'manual')),
    price_usd DECIMAL(10,2),
    price_jpy INTEGER,                 -- Yuyu-tei prices in JPY
    price_idr DECIMAL(14,0),
    url TEXT,                          -- Source listing URL
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_card_prices_card_id_scraped ON portfolio_card_prices (card_id, scraped_at DESC);
```

### `portfolio_dca_log`
Monthly DCA execution tracking.

```sql
CREATE TABLE portfolio_dca_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month DATE NOT NULL,               -- '2026-03-01' (first of month)
    btc_amount DECIMAL(10,8) NOT NULL, -- BTC purchased
    btc_price_usd DECIMAL(10,2),       -- Price at purchase
    usd_spent DECIMAL(10,2),
    idr_spent DECIMAL(14,0),
    source TEXT,                        -- 'OKU salary', 'ForuAI salary', 'Bonus'
    war_chest_deployed DECIMAL(10,2) DEFAULT 0,  -- USDT deployed
    wedding_fund_added DECIMAL(14,0) DEFAULT 0,  -- IDR added
    gold_added DECIMAL(14,0) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `portfolio_fund_tracker`
Running totals for wedding fund + war chest.

```sql
CREATE TABLE portfolio_fund_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_type TEXT NOT NULL CHECK (fund_type IN ('wedding', 'war_chest', 'gold')),
    current_balance DECIMAL(14,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'IDR',
    target_amount DECIMAL(14,2),
    target_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Frontend Pages

### 1. `/portfolio` — Dashboard Overview
The main hub. Pixel art RPG style consistent with Dominion.

**Sections:**
- **Net Worth Card** — Total liquid + hard assets, IDR + USD
- **BTC Stack** — Current holdings (0.153 BTC), avg cost basis, unrealized P&L
- **Allocation Pie Chart** — BTC / War Chest / Wedding / Gold / Cards / Cash
- **Monthly DCA Tracker** — This month's execution status (✅ done / ⏳ pending)
- **War Chest Status** — Bar showing deployment thresholds (-30%/-40%/-50%) vs current BTC price
- **Wedding Fund Progress** — Bar: Rp 120M / Rp 350M target, months remaining
- **Quick Stats** — Savings rate, months to target, BTC rank among holders

**Charts (pixel art styled):**
- BTC accumulation over time (line chart)
- Net worth growth projection (area chart)
- Monthly DCA history (bar chart)
- Asset allocation donut

### 2. `/portfolio/collectibles` — Card Deck View
The showpiece. Visual card gallery.

**Layout:**
- Tab switcher: **One Piece** | **Pokemon**
- Grid of card tiles, each showing:
  - Card image (if available) or placeholder with card name
  - Grade badge (PSA 10, Raw, etc.)
  - Purchase price vs current price
  - ROI % with color coding (green/red)
  - Last price update timestamp
- **Summary Bar:**
  - Total invested | Current value | Total ROI %
  - OP budget: Rp 26.5M / Rp 200M cap (progress bar)
- **Sort/Filter:** By ROI, by value, by franchise, by grade
- Click card → detail modal with price history chart

### 3. `/portfolio/analytics` — Deep Dive
Advanced analysis page.

**Sections:**
- **2030 Projection Calculator** — Interactive: adjust BTC price, stack size → see net worth
- **Fire Sale Readiness** — How much cash/BTC available for 2030 fire sale
- **DCA Performance** — Dollar-cost averaging vs lump sum comparison
- **Card Portfolio Performance** — OP vs Pokemon ROI comparison
- **Income Allocation Sankey** — Rp 165M → expenses → investments flow
- **Masterplan Compliance** — Are you on track? Checklist vs actual

### 4. `/portfolio/masterplan` — Rendered Masterplan
Beautifully rendered version of `investment-masterplan-v2.md` with:
- Collapsible sections
- Live data injected (current BTC price, current holdings, etc.)
- Progress indicators on milestones

---

## Price Scraper System

### Sources & Strategy

| Source | Cards | Data | Frequency | Method |
|--------|-------|------|-----------|--------|
| **Yuyu-tei** | One Piece (JP) | Buy/sell prices in JPY | Daily | HTML scrape `yuyu-tei.jp/sell/ws/s/search` |
| **eBay Sold** | Both | Actual sold prices USD | Weekly | eBay sold listings scrape |
| **eBay Listings** | Both | Current asking prices | Daily | eBay active listings |
| **SNKRDUNK** | One Piece (JP) | Market prices JPY | Weekly | HTML scrape |
| **Manual** | Both | User-provided updates | On demand | THRONE syncs from Telegram chat |

### Scraper Implementation

```
/dominion/src/scrapers/
├── yuyu-tei.ts        — Yuyu-tei One Piece card scraper
├── ebay.ts            — eBay sold + listing scraper
├── snkrdunk.ts        — SNKRDUNK price scraper
├── price-updater.ts   — Orchestrator: runs all scrapers, updates DB
└── card-search.ts     — Search helpers (fuzzy match card names to listings)
```

**Scraper runs via:**
- THRONE heartbeat (check `heartbeat-state.json` for `lastCardPriceUpdate`)
- Manual trigger: Faisal says "update card prices" in Telegram → THRONE runs scraper
- Cron: daily at 10:00 WIB for Yuyu-tei, weekly Sunday for eBay

### Anti-Ban Strategy
- Rate limit: 2-3 req/sec max
- Rotate user-agent strings
- Cache responses for 24h
- Respect robots.txt
- Fall back to manual if blocked

---

## Telegram Sync Protocol

When Faisal updates portfolio info in Telegram chat, THRONE:

1. **Detects intent** — "bought 0.02 BTC at $65K", "added Rp 30M to wedding fund", "bought new OP card"
2. **Confirms** — "Got it, logging: 0.02 BTC @ $65K from ForuAI salary. Updating portfolio."
3. **Updates DB** — POST to `/api/portfolio/...` endpoint
4. **Updates masterplan** — If significant (new DCA record, card purchase), edit `investment-masterplan-v2.md`
5. **Logs in memory** — `memory/YYYY-MM-DD.md` entry

**Trigger phrases:**
- "bought X BTC" → update holdings + DCA log
- "added X to wedding" → update fund tracker
- "deployed war chest" → update war chest + holdings
- "bought [card name]" → add to card inventory
- "sold [card name]" → mark card sold, record price
- "update card prices" → trigger scraper

---

## API Endpoints (New)

### Portfolio Routes (`/api/portfolio/...`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/portfolio/summary` | Net worth, allocations, key metrics |
| GET | `/api/portfolio/holdings` | All active holdings |
| POST | `/api/portfolio/holdings` | Add/update a holding |
| GET | `/api/portfolio/btc` | BTC-specific: stack, avg price, DCA history |
| GET | `/api/portfolio/cards` | All cards with latest prices |
| GET | `/api/portfolio/cards/:id` | Single card with price history |
| POST | `/api/portfolio/cards` | Add a card |
| PATCH | `/api/portfolio/cards/:id` | Update card (price, sold, etc.) |
| POST | `/api/portfolio/cards/scrape` | Trigger price scrape |
| GET | `/api/portfolio/cards/prices/:id` | Price history for a card |
| GET | `/api/portfolio/dca-log` | Monthly DCA records |
| POST | `/api/portfolio/dca-log` | Log a DCA purchase |
| GET | `/api/portfolio/funds` | Wedding + war chest + gold status |
| PATCH | `/api/portfolio/funds/:type` | Update fund balance |
| GET | `/api/portfolio/projections` | 2030 net worth calculator data |
| GET | `/api/portfolio/analytics` | Aggregated analytics data |

---

## Data Seed (Current Portfolio)

### Holdings (from masterplan)
```json
[
  { "asset_type": "btc", "asset_name": "Bitcoin", "quantity": 0.153, "category": "investment" },
  { "asset_type": "usdt", "asset_name": "War Chest", "quantity": 1309, "category": "war_chest" },
  { "asset_type": "fiat_idr", "asset_name": "Wedding Fund", "quantity": 120000000, "category": "wedding" },
  { "asset_type": "token", "asset_name": "XPL", "quantity": 3278, "category": "write_off" },
  { "asset_type": "gold", "asset_name": "Gold", "quantity": 0, "category": "gold" }
]
```

### One Piece Cards
```json
[
  { "card_name": "Zoro Flagship", "card_code": "OP01-025", "set_name": "Romance Dawn", "rarity": "SEC", "grade": "PSA 10", "purchase_price_usd": 780, "current_price_usd": 1300 },
  { "card_name": "Gorosei Red Parallel (x5)", "card_code": "OP09-XXX", "set_name": "OP09", "rarity": "Parallel", "grade": "Raw", "purchase_price_usd": 325, "current_price_usd": 900 },
  { "card_name": "Luffy-Tarou", "card_code": "ST18-005", "set_name": "ST18", "rarity": "Alt Art", "grade": "PSA 10", "purchase_price_usd": 60, "current_price_usd": 125 },
  { "card_name": "Sanji", "card_code": "PRB01-001", "set_name": "Premium Booster", "rarity": "Promo", "grade": "PSA 10", "purchase_price_usd": 36, "current_price_usd": 63 },
  { "card_name": "Others (misc)", "card_code": "various", "set_name": "various", "grade": "Mixed", "purchase_price_usd": 20, "current_price_usd": 215 }
]
```

### Pokemon Cards
```json
[
  // Need Faisal to provide full deck list
  // Estimated: ~$1,508 total value, sell plan → BTC
]
```

---

## Implementation Plan

### Phase 1: Foundation (API + DB) — ~3-4 hours
1. Create migration SQL for new tables
2. Build portfolio API routes (CRUD)
3. Seed current data from masterplan
4. Test endpoints

### Phase 2: Frontend Dashboard — ~4-5 hours
1. Install chart library (recharts or lightweight pixel-style)
2. Build `/portfolio` main dashboard page
3. Build net worth card, BTC stack, allocation chart
4. Build DCA tracker, war chest, wedding fund components
5. Wire to API

### Phase 3: Collectibles — ~3-4 hours
1. Build `/portfolio/collectibles` card deck view
2. Card tile component with ROI badges
3. Detail modal with price history
4. OP budget progress bar (Rp 26.5M / Rp 200M)

### Phase 4: Price Scrapers — ~3-4 hours
1. Build Yuyu-tei scraper (search by card code)
2. Build eBay sold listings scraper
3. Build SNKRDUNK scraper
4. Price updater orchestrator
5. Cron integration via heartbeat

### Phase 5: Analytics + Polish — ~2-3 hours
1. 2030 projection calculator
2. Income allocation Sankey
3. Masterplan compliance checker
4. Pixel art styling consistency

### Phase 6: Telegram Sync — ~1-2 hours
1. Intent detection in THRONE for portfolio updates
2. Auto-update DB on chat triggers
3. Confirmation messages

**Total estimate: ~16-22 hours of agent work**

---

## Tech Stack Additions

| Package | Purpose |
|---------|---------|
| `recharts` | Charts (works well with Next.js, customizable) |
| `cheerio` | HTML parsing for scrapers |
| `node-cron` | Scraper scheduling (or use heartbeat) |
| `currency-converter-lt` | JPY/USD/IDR conversion (or use free API) |

---

## Design Notes

- **Pixel art RPG aesthetic** — consistent with rest of Dominion
- Cards section should feel like a **deck builder / inventory screen** from an RPG
- Net worth display like a **gold counter** in a game
- War chest = **treasure chest** visual metaphor
- Wedding fund = **heart/ring** progress bar
- Use existing `PixelBorder` and `PixelProgress` components

---

## Open Questions for Faisal

1. **Pokemon deck list** — Need full card inventory (name, grade, purchase price)
2. **Gold holdings** — Current gold amount? Physical or digital?
3. **Card images** — Want me to scrape card images too, or use placeholder pixel art?
4. **Price currency preference** — Show in USD, IDR, or both?
5. **Privacy** — This page should be auth-protected or public?
6. **Priority** — Which phase to build first?
