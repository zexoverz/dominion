import { Router, Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

const IDR_PER_USD = 16400;
const JPY_TO_USD = 0.0067; // ~150 JPY per USD

// ── Auth Middleware ──
function authMiddleware(req: Request, res: Response, next: Function) {
  const password = process.env.PORTFOLIO_PASSWORD;
  if (!password) return next(); // No password set = open
  
  const provided = req.headers['x-portfolio-password'] || req.query.password;
  if (provided === password) return next();
  
  return res.status(401).json({ error: 'Unauthorized' });
}

router.use(authMiddleware);

// ── Migration endpoint (one-time) ──
router.post('/migrate', async (_req: Request, res: Response) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_holdings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        asset_type TEXT NOT NULL CHECK (asset_type IN ('crypto', 'fiat', 'fund', 'commodity', 'token')),
        asset_name TEXT NOT NULL UNIQUE,
        symbol TEXT NOT NULL,
        quantity DECIMAL(20,8) NOT NULL DEFAULT 0,
        cost_basis_usd DECIMAL(14,2) NOT NULL DEFAULT 0,
        current_price_usd DECIMAL(14,2),
        notes TEXT,
        metadata JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS portfolio_cards (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        franchise TEXT NOT NULL CHECK (franchise IN ('one_piece', 'pokemon')),
        card_name TEXT NOT NULL,
        card_code TEXT NOT NULL,
        set_name TEXT,
        rarity TEXT,
        grade TEXT,
        grading_company TEXT,
        language TEXT NOT NULL DEFAULT 'JP',
        cost_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
        cost_idr DECIMAL(14,0) NOT NULL DEFAULT 0,
        current_price_usd DECIMAL(10,2),
        current_price_idr DECIMAL(14,0),
        image_url TEXT,
        price_source TEXT,
        date_added DATE,
        notes TEXT,
        metadata JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS portfolio_card_prices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        card_id UUID NOT NULL REFERENCES portfolio_cards(id) ON DELETE CASCADE,
        price_usd DECIMAL(10,2) NOT NULL,
        price_idr DECIMAL(14,0),
        source TEXT NOT NULL,
        recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS portfolio_dca_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        month DATE NOT NULL,
        amount_idr DECIMAL(14,0) NOT NULL,
        amount_usd DECIMAL(10,2) NOT NULL,
        btc_price_usd DECIMAL(14,2) NOT NULL,
        btc_acquired DECIMAL(12,8) NOT NULL,
        exchange TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS portfolio_fund_tracker (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        fund_type TEXT NOT NULL UNIQUE CHECK (fund_type IN ('wedding', 'war_chest', 'gold', 'emergency')),
        current_amount_idr DECIMAL(14,0) NOT NULL DEFAULT 0,
        target_amount_idr DECIMAL(14,0),
        target_date DATE,
        notes TEXT,
        metadata JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_asset_type ON portfolio_holdings(asset_type);
      CREATE INDEX IF NOT EXISTS idx_portfolio_cards_franchise ON portfolio_cards(franchise);
      CREATE INDEX IF NOT EXISTS idx_portfolio_cards_card_code ON portfolio_cards(card_code);
      CREATE INDEX IF NOT EXISTS idx_portfolio_card_prices_card_recorded ON portfolio_card_prices(card_id, recorded_at DESC);
      CREATE INDEX IF NOT EXISTS idx_portfolio_dca_log_month ON portfolio_dca_log(month DESC);
    `);

    res.json({ success: true, message: 'Portfolio tables created' });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ error: 'Migration failed', details: String(err) });
  }
});

// ── Seed endpoint (one-time) ──
router.post('/seed', async (_req: Request, res: Response) => {
  try {
    // Holdings
    const holdings = [
      { type: 'crypto', name: 'Bitcoin', symbol: 'BTC', qty: 0.1677, cost: 11200, price: null },
      { type: 'fund', name: 'War Chest', symbol: 'USDT', qty: 1890, cost: 1890, price: null },
      { type: 'fund', name: 'Wedding Fund', symbol: 'IDR', qty: 150000000, cost: 9146.34, price: null },
      { type: 'commodity', name: 'Gold Fund', symbol: 'IDR', qty: 15000000, cost: 914.63, price: null },
      { type: 'token', name: 'XPL', symbol: 'XPL', qty: 3278, cost: 0, price: 0 },
    ];

    for (const h of holdings) {
      await pool.query(`
        INSERT INTO portfolio_holdings (asset_type, asset_name, symbol, quantity, cost_basis_usd, current_price_usd)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (asset_name) DO UPDATE SET
          quantity = EXCLUDED.quantity,
          cost_basis_usd = EXCLUDED.cost_basis_usd,
          updated_at = NOW()
      `, [h.type, h.name, h.symbol, h.qty, h.cost, h.price]);
    }

    // Fund tracker
    const funds = [
      { type: 'wedding', amount: 150000000, target: 350000000, date: '2026-10-01', notes: 'Wedding Nov 2026' },
      { type: 'war_chest', amount: 31000000, target: null, date: null, notes: 'Rp 31M (~$1,890 USDT) for BTC dip buying' },
      { type: 'gold', amount: 15000000, target: null, date: null, notes: 'Cash held by Keiko, not yet bought' },
    ];

    for (const f of funds) {
      await pool.query(`
        INSERT INTO portfolio_fund_tracker (fund_type, current_amount_idr, target_amount_idr, target_date, notes)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (fund_type) DO UPDATE SET
          current_amount_idr = EXCLUDED.current_amount_idr,
          target_amount_idr = EXCLUDED.target_amount_idr,
          target_date = EXCLUDED.target_date,
          notes = EXCLUDED.notes,
          updated_at = NOW()
      `, [f.type, f.amount, f.target, f.date, f.notes]);
    }

    // One Piece cards from CSV (12 cards)
    const opCards = [
      { name: 'Roronoa Zoro (Treasure Cup)', code: 'OP01-025', set: 'Promo', rarity: 'SR', grade: 'PSA 10', grader: 'PSA', costUsd: 780, costIdr: 0, priceUsd: 5000, date: '2025-11-03' },
      { name: 'Luffy-Tarou', code: 'ST18-005', set: 'A Fist of Divine Speed', rarity: 'SP', grade: 'PSA 10', grader: 'PSA', costUsd: 60, costIdr: 0, priceUsd: 202.50, date: '2025-10-06' },
      { name: 'Shanks', code: 'ST16-004', set: 'A Fist of Divine Speed', rarity: 'SP', grade: 'PSA 10', grader: 'PSA', costUsd: 65, costIdr: 0, priceUsd: 132.50, date: '2026-03-10' },
      { name: 'Monkey.D.Luffy', code: 'OP07-109', set: 'Promo', rarity: 'Promo', grade: 'PSA 10', grader: 'PSA', costUsd: 60, costIdr: 0, priceUsd: 148.27, date: '2026-03-12' },
      { name: 'Sanji (Parallel)', code: 'PRB01-001', set: 'PRB01 The Best', rarity: 'L', grade: 'PSA 10', grader: 'PSA', costUsd: 36, costIdr: 0, priceUsd: 91, date: '2025-10-06' },
      { name: 'Sanji (Alt Art)', code: 'OP06-119', set: 'Wings of the Captain', rarity: 'SEC', grade: 'PSA 10', grader: 'PSA', costUsd: 39, costIdr: 0, priceUsd: 58.99, date: '2026-03-12' },
      { name: 'St. Ethanbaron V. Nusjuro (Red Parallel)', code: 'OP13-080', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, costUsd: 65, costIdr: 0, priceUsd: 200, date: '2025-10-06' },
      { name: 'St. Jaygarcia Saturn (Red Parallel)', code: 'OP13-083', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, costUsd: 65, costIdr: 0, priceUsd: 200, date: '2025-10-06' },
      { name: 'St. Marcus Mars (Red Parallel)', code: 'OP13-091', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, costUsd: 65, costIdr: 0, priceUsd: 200, date: '2025-10-06' },
      { name: 'St. Shepherd Ju Peter (Red Parallel)', code: 'OP13-084', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, costUsd: 65, costIdr: 0, priceUsd: 200, date: '2025-10-06' },
      { name: 'St. Topman Warcury (Red Parallel)', code: 'OP13-089', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, costUsd: 65, costIdr: 0, priceUsd: 200, date: '2025-10-06' },
      { name: 'Imu (Parallel)', code: 'OP13-079', set: 'Carrying on His Will', rarity: 'L', grade: 'Raw', grader: null, costUsd: 20, costIdr: 0, priceUsd: 26.80, date: '2025-10-06' },
    ];

    // One Piece March 8 Buy — Deal 1 (2nd Anniversary Set, 9 cards, Rp 3M total)
    const opMarch8Deal1 = [
      { name: 'Ace (2nd Anniversary)', code: 'promo-op10/10101', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333333, priceUsd: 42.56, date: '2026-03-08' },
      { name: 'Luffy (2nd Anniversary)', code: 'promo-st10/10082', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333333, priceUsd: 36.46, date: '2026-03-08' },
      { name: 'Zoro (2nd Anniversary)', code: 'promo-op10/10105', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333333, priceUsd: 24.27, date: '2026-03-08' },
      { name: 'Shabondy Event', code: 'promo-op10/10100', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333333, priceUsd: 15.12, date: '2026-03-08' },
      { name: 'Sabo (2nd Anniversary)', code: 'promo-op10/10103', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333333, priceUsd: 15.12, date: '2026-03-08' },
      { name: 'Kaya (2nd Anniversary)', code: 'promo-op10/10102', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333333, priceUsd: 12.07, date: '2026-03-08' },
      { name: 'Rosinante (2nd Anniversary)', code: 'promo-op10/10104', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333333, priceUsd: 12.07, date: '2026-03-08' },
      { name: 'Sanji (2nd Anniversary)', code: 'promo-op10/10106', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333333, priceUsd: 12.07, date: '2026-03-08' },
      { name: 'Big Mom (2nd Anniversary)', code: 'promo-op10/10107', set: '2nd Anniversary Promo', rarity: 'Promo', grade: 'Raw', grader: null, costUsd: 0, costIdr: 333334, priceUsd: 5.97, date: '2026-03-08' },
    ];

    // One Piece March 8 Buy — Deal 2 (4 cards, Rp 3.5M = ~875K each)
    const opMarch8Deal2 = [
      { name: 'Sabo Wanted (SP)', code: 'OP13-120', set: 'Carrying on His Will', rarity: 'SP', grade: 'Raw', grader: null, costUsd: 0, costIdr: 875000, priceUsd: null, date: '2026-03-08' },
      { name: 'Buggy Wanted (SP)', code: 'OP09-051', set: 'OP09', rarity: 'SP', grade: 'Raw', grader: null, costUsd: 0, costIdr: 875000, priceUsd: null, date: '2026-03-08' },
      { name: 'Cross Guild (Parallel)', code: 'OP09-057', set: 'OP09', rarity: 'Parallel', grade: 'Raw', grader: null, costUsd: 0, costIdr: 875000, priceUsd: null, date: '2026-03-08' },
      { name: 'Luffy Nika (SEC)', code: 'EB04-061', set: 'EB04', rarity: 'SEC', grade: 'Raw', grader: null, costUsd: 0, costIdr: 875000, priceUsd: null, date: '2026-03-08' },
    ];

    // Pokemon cards
    const pokemonCards = [
      { name: 'Lugia V', code: '110/098', set: 'Paradigm Trigger', rarity: 'Secret Rare', grade: 'PSA 10', grader: 'PSA', costUsd: 690, costIdr: 0, priceUsd: 1015.22, date: '2025-10-01' },
      { name: 'Zekrom ex', code: '174/086', set: 'Black Bolt', rarity: 'Secret Rare', grade: 'PSA 10', grader: 'PSA', costUsd: 450, costIdr: 0, priceUsd: 510.79, date: '2025-10-01' },
      { name: 'Charizard ex', code: '349/190', set: 'Shiny Treasure ex', rarity: 'Super Rare', grade: 'PSA 10', grader: 'PSA', costUsd: 348, costIdr: 0, priceUsd: 371.55, date: '2025-10-01' },
      { name: "N's Reshiram", code: '109/100', set: 'Battle Partners', rarity: 'Art Rare', grade: 'PSA 10', grader: 'PSA', costUsd: 39, costIdr: 0, priceUsd: 51.23, date: '2025-10-01' },
      { name: 'Black Kyurem ex', code: '077/064', set: 'Paradise Dragona', rarity: 'Super Rare', grade: 'PSA 10', grader: 'PSA', costUsd: 10, costIdr: 0, priceUsd: 30, date: '2025-10-01' },
      { name: 'Mew ex SAR', code: '347/190', set: 'Shiny Treasure ex (SV4a) ID', rarity: 'SAR', grade: 'EGS 9', grader: 'EGS', costUsd: 0, costIdr: 3500000, priceUsd: null, lang: 'ID', date: '2025-10-01' },
      { name: 'Gardevoir ex SAR', code: '348/190', set: 'Shiny Treasure ex (SV4a) ID', rarity: 'SAR', grade: 'EGS 9.5', grader: 'EGS', costUsd: 0, costIdr: 1500000, priceUsd: null, lang: 'ID', date: '2025-10-01' },
    ];

    const allCards = [
      ...opCards.map(c => ({ ...c, franchise: 'one_piece' as const })),
      ...opMarch8Deal1.map(c => ({ ...c, franchise: 'one_piece' as const })),
      ...opMarch8Deal2.map(c => ({ ...c, franchise: 'one_piece' as const })),
      ...pokemonCards.map(c => ({ ...c, franchise: 'pokemon' as const })),
    ];

    let inserted = 0;
    for (const c of allCards) {
      const lang = (c as any).lang || 'JP';
      await pool.query(`
        INSERT INTO portfolio_cards (franchise, card_name, card_code, set_name, rarity, grade, grading_company, language, cost_usd, cost_idr, current_price_usd, date_added)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT DO NOTHING
      `, [c.franchise, c.name, c.code, c.set, c.rarity, c.grade, c.grader, lang, c.costUsd, c.costIdr, c.priceUsd, c.date]);
      inserted++;
    }

    res.json({ success: true, message: `Seeded ${holdings.length} holdings, ${inserted} cards, ${funds.length} funds` });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: 'Seed failed', details: String(err) });
  }
});

// ═══ GET /api/portfolio/summary ═══
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const holdings = await pool.query('SELECT * FROM portfolio_holdings');
    const cards = await pool.query('SELECT * FROM portfolio_cards');
    const funds = await pool.query('SELECT * FROM portfolio_fund_tracker');

    // Calculate totals
    let totalCostUsd = 0;
    let totalCurrentUsd = 0;
    const allocations: Record<string, number> = {};

    for (const h of holdings.rows) {
      const cost = parseFloat(h.cost_basis_usd) || 0;
      totalCostUsd += cost;
      
      let currentVal = 0;
      if (h.symbol === 'BTC' && h.current_price_usd) {
        currentVal = parseFloat(h.quantity) * parseFloat(h.current_price_usd);
      } else if (h.symbol === 'IDR') {
        currentVal = parseFloat(h.quantity) / IDR_PER_USD;
      } else {
        currentVal = parseFloat(h.quantity) * (parseFloat(h.current_price_usd) || 0);
        if (currentVal === 0) currentVal = cost; // fallback to cost
      }
      totalCurrentUsd += currentVal;
      allocations[h.asset_name] = currentVal;
    }

    let cardsTotalCost = 0;
    let cardsTotalCurrent = 0;
    for (const c of cards.rows) {
      const costUsd = parseFloat(c.cost_usd) || (parseFloat(c.cost_idr) / IDR_PER_USD);
      cardsTotalCost += costUsd;
      const currentUsd = parseFloat(c.current_price_usd) || (parseFloat(c.current_price_idr) / IDR_PER_USD) || costUsd;
      cardsTotalCurrent += currentUsd;
    }
    totalCostUsd += cardsTotalCost;
    totalCurrentUsd += cardsTotalCurrent;
    allocations['Cards'] = cardsTotalCurrent;

    res.json({
      net_worth_usd: totalCurrentUsd,
      net_worth_idr: totalCurrentUsd * IDR_PER_USD,
      total_cost_usd: totalCostUsd,
      total_cost_idr: totalCostUsd * IDR_PER_USD,
      unrealized_pnl_usd: totalCurrentUsd - totalCostUsd,
      allocations,
      holdings_count: holdings.rowCount,
      cards_count: cards.rowCount,
      cards_cost_usd: cardsTotalCost,
      cards_current_usd: cardsTotalCurrent,
      funds: funds.rows,
    });
  } catch (err) {
    console.error('GET /api/portfolio/summary error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ GET /api/portfolio/holdings ═══
router.get('/holdings', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM portfolio_holdings ORDER BY cost_basis_usd DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/portfolio/holdings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ POST /api/portfolio/holdings ═══
router.post('/holdings', async (req: Request, res: Response) => {
  try {
    const { asset_type, asset_name, symbol, quantity, cost_basis_usd, current_price_usd, notes } = req.body;
    const result = await pool.query(`
      INSERT INTO portfolio_holdings (asset_type, asset_name, symbol, quantity, cost_basis_usd, current_price_usd, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (asset_name) DO UPDATE SET
        quantity = EXCLUDED.quantity,
        cost_basis_usd = EXCLUDED.cost_basis_usd,
        current_price_usd = EXCLUDED.current_price_usd,
        notes = EXCLUDED.notes,
        updated_at = NOW()
      RETURNING *
    `, [asset_type, asset_name, symbol, quantity, cost_basis_usd, current_price_usd, notes]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/portfolio/holdings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ GET /api/portfolio/cards ═══
router.get('/cards', async (req: Request, res: Response) => {
  try {
    const { franchise } = req.query;
    let query = 'SELECT * FROM portfolio_cards WHERE 1=1';
    const params: any[] = [];
    if (franchise) {
      params.push(franchise);
      query += ` AND franchise = $${params.length}`;
    }
    query += ' ORDER BY date_added DESC, card_name';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/portfolio/cards error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ GET /api/portfolio/cards/:id ═══
router.get('/cards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await pool.query('SELECT * FROM portfolio_cards WHERE id = $1', [id]);
    if (card.rows.length === 0) return res.status(404).json({ error: 'Card not found' });
    
    const prices = await pool.query(
      'SELECT * FROM portfolio_card_prices WHERE card_id = $1 ORDER BY recorded_at DESC LIMIT 50',
      [id]
    );
    res.json({ ...card.rows[0], price_history: prices.rows });
  } catch (err) {
    console.error('GET /api/portfolio/cards/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ GET /api/portfolio/cards/:id/prices — Price history (last 90 days) ═══
router.get('/cards/:id/prices', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 90;
    const result = await pool.query(
      `SELECT id, price_usd, price_idr, source, recorded_at
       FROM portfolio_card_prices
       WHERE card_id = $1 AND recorded_at >= NOW() - INTERVAL '1 day' * $2
       ORDER BY recorded_at ASC`,
      [id, days]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/portfolio/cards/:id/prices error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ POST /api/portfolio/smart-add — Auto-detect, scrape, and add card ═══
// Input: { card_code, card_name, franchise, grade?, rarity?, cost_idr, set_name?, yuyu_tei_url?, language? }
// Rules:
//   Pokemon (any grade) → SNKR Dunk
//   One Piece PSA 10 → SNKR Dunk
//   One Piece raw singles → Yuyu-tei
router.post('/smart-add', async (req: Request, res: Response) => {
  try {
    const { card_code, card_name, franchise, grade, rarity, cost_idr, cost_usd, set_name, yuyu_tei_url, yuyu_tei_jpy: inputYuyuJpy, language, notes } = req.body;
    if (!card_code || !card_name || !franchise || !cost_idr) {
      return res.status(400).json({ error: 'Required: card_code, card_name, franchise, cost_idr' });
    }

    const JPY_TO_USD = 0.0067;
    const IDR_PER_USD = 16400;
    const isOnePiece = franchise === 'one_piece';
    const isPSA10 = grade === 'PSA 10';
    const isSlab = isPSA10 || (grade && grade !== 'Raw');
    const cardLanguage = language || 'JP';

    let currentPriceUsd = 0;
    let currentPriceIdr = 0;
    let priceSource = '';
    let imageUrl = '';
    let snkrApparelId = '';
    let snkrUrl = '';
    let snkrDunkJpy = 0;
    let yuyuTeiJpy = 0;
    const costUsd = cost_usd || Math.round(cost_idr / IDR_PER_USD * 100) / 100;

    // ═══ IQR helper ═══
    function iqrAvg(prices: number[]): number {
      prices.sort((a, b) => a - b);
      if (prices.length < 4) return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
      const q1 = prices[Math.floor(prices.length / 4)];
      const q3 = prices[Math.floor(3 * prices.length / 4)];
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;
      const filtered = prices.filter(p => p >= lower && p <= upper);
      return Math.round((filtered.length > 0 ? filtered : prices).reduce((a, b) => a + b, 0) / (filtered.length || prices.length));
    }

    // ═══ STEP 1: Yuyu-tei price (for OP singles) ═══
    let yuyuTeiUrl = yuyu_tei_url || '';
    if (isOnePiece && !isSlab) {
      // Option A: Manual JPY price provided
      if (inputYuyuJpy) {
        yuyuTeiJpy = inputYuyuJpy;
        currentPriceUsd = Math.round(yuyuTeiJpy * JPY_TO_USD * 100) / 100;
        currentPriceIdr = yuyuTeiJpy * 100;
        priceSource = 'yuyu-tei';
      }
      // Option B: Scrape from provided Yuyu-tei URL
      else if (yuyu_tei_url) {
        try {
          const yuyuRes = await fetch(yuyu_tei_url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
          });
          if (yuyuRes.ok) {
            const html = await yuyuRes.text();
            const priceMatch = html.match(/(\d{1,3}(?:,\d{3})*)\s*円/);
            if (priceMatch) {
              yuyuTeiJpy = parseInt(priceMatch[1].replace(/,/g, ''));
              currentPriceUsd = Math.round(yuyuTeiJpy * JPY_TO_USD * 100) / 100;
              currentPriceIdr = yuyuTeiJpy * 100;
              priceSource = 'yuyu-tei';
            }
          }
        } catch (e) { /* Yuyu-tei scrape failed */ }
      }
      // Option C: AUTO-DISCOVER — search Yuyu-tei set page by card_code
      else if (card_code) {
        try {
          // Extract set from card_code (e.g. "OP13-076" → "op13", "ST10-004" → "st10", "EB04-061" → "eb04")
          const setMatch = card_code.match(/^([A-Za-z]+\d+)/);
          if (setMatch) {
            const setCode = setMatch[1].toLowerCase();
            const setUrl = `https://yuyu-tei.jp/sell/opc/s/${setCode}`;
            const setRes = await fetch(setUrl, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });
            if (setRes.ok) {
              const html = await setRes.text();
              // Find all entries matching the card code
              const regex = new RegExp(
                `href="(https://yuyu-tei\\.jp/sell/opc/card/[^"]+)"[^>]*>.*?` +
                `<img[^>]*alt="${card_code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+([^"]*)"[^>]*>.*?` +
                `(\\d{1,3}(?:,\\d{3})*)\\s*円`,
                'gs'
              );
              
              // Rarity matching keywords
              const rarityKw: Record<string, string[]> = {
                'Parallel': ['パラレル', 'P-R', 'P-SR', 'P-SEC', 'P-L'],
                'SP': ['SP', 'スペシャル', 'SPC'],
                'SEC': ['SEC', 'P-SEC'],
                'L': ['P-L', 'リーダー'],
                'Alt Art': ['パラレル', 'P-'],
              };
              const targetKw = rarity ? (rarityKw[rarity] || []) : [];
              
              let bestMatch: { url: string; price: number; alt: string } | null = null;
              let fallbackMatch: { url: string; price: number; alt: string } | null = null;
              
              let m;
              while ((m = regex.exec(html)) !== null) {
                const [, cardUrl, alt, priceStr] = m;
                const price = parseInt(priceStr.replace(/,/g, ''));
                
                if (targetKw.length > 0 && targetKw.some(kw => alt.includes(kw))) {
                  bestMatch = { url: cardUrl, price, alt };
                } else if (!fallbackMatch) {
                  fallbackMatch = { url: cardUrl, price, alt };
                }
              }
              
              const found = bestMatch || (targetKw.length === 0 ? fallbackMatch : null);
              if (found) {
                yuyuTeiJpy = found.price;
                yuyuTeiUrl = found.url;
                currentPriceUsd = Math.round(yuyuTeiJpy * JPY_TO_USD * 100) / 100;
                currentPriceIdr = yuyuTeiJpy * 100;
                priceSource = 'yuyu-tei';
              }
            }
          }
        } catch (e) { /* Yuyu-tei auto-discover failed */ }
      }
    }

    // ═══ STEP 2: Search SNKR Dunk ═══
    const useSnkrDunk = !isOnePiece || isSlab; // Pokemon always, OP only for slabs
    if (useSnkrDunk) {
      try {
        const keyword = encodeURIComponent(isPSA10 ? `${card_code} PSA` : card_code);
        const snkrRes = await fetch(`https://snkrdunk.com/v3/search?func=all&refId=search&sortKey=default&keyword=${keyword}`);
        if (snkrRes.ok) {
          const data = await snkrRes.json();
          const products = data?.search?.products || [];
          const ranked = data?.search?.rankingProducts || [];

          if (isPSA10) {
            // Find the most common apparel ID among PSA10 listings (= correct product)
            const apparelCounts: Record<string, number> = {};
            const psa10All = products.filter((p: any) => {
              if (p.condition !== 'PSA10' || !p.salePrice) return false;
              if (p.title?.includes('英語版')) return false;
              return true;
            });
            
            for (const p of psa10All) {
              const match = p.link?.match(/\/apparels\/(\d+)\//);
              if (match) {
                apparelCounts[match[1]] = (apparelCounts[match[1]] || 0) + 1;
              }
            }
            
            // Pick the apparel ID with the most PSA10 listings
            const bestApparel = Object.entries(apparelCounts).sort((a, b) => b[1] - a[1])[0];
            if (bestApparel) {
              snkrApparelId = bestApparel[0];
              snkrUrl = `https://snkrdunk.com/apparels/${snkrApparelId}`;
              
              // Filter PSA10 for this apparel and get IQR average
              const psa10Prices = psa10All
                .filter((p: any) => p.link?.includes(`/apparels/${snkrApparelId}/`))
                .map((p: any) => p.salePrice);
              
              if (psa10Prices.length > 0) {
                snkrDunkJpy = iqrAvg(psa10Prices);
                currentPriceUsd = Math.round(snkrDunkJpy * JPY_TO_USD * 100) / 100;
                currentPriceIdr = snkrDunkJpy * 100;
                priceSource = 'snkrdunk';
              }
            }
          } else {
            // Raw singles (Pokemon) — use ranked products average
            const matches = ranked.filter((p: any) =>
              p.title?.includes(card_code) &&
              p.salePrice && p.salePrice > 0 &&
              !p.title?.includes('英語版')
            );
            if (matches.length > 0) {
              const prices = matches.map((p: any) => p.salePrice);
              snkrDunkJpy = iqrAvg(prices);
              currentPriceUsd = Math.round(snkrDunkJpy * JPY_TO_USD * 100) / 100;
              currentPriceIdr = snkrDunkJpy * 100;
              priceSource = 'snkrdunk';
            }
            // Get apparel from first ranked match
            if (ranked.length > 0 && ranked[0].link) {
              const match = ranked[0].link.match(/\/apparels\/(\d+)/);
              if (match) {
                snkrApparelId = match[1];
                snkrUrl = `https://snkrdunk.com/apparels/${snkrApparelId}`;
              }
            }
          }

          // ═══ STEP 3: Get image from SNKR Dunk product page ═══
          if (snkrApparelId) {
            try {
              const pageRes = await fetch(`https://snkrdunk.com/apparels/${snkrApparelId}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
              });
              if (pageRes.ok) {
                const html = await pageRes.text();
                const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
                if (imgMatch) imageUrl = imgMatch[1];
              }
            } catch (e) { /* image fetch failed */ }
          }
        }
      } catch (e) { /* SNKR Dunk search failed */ }
    }

    // ═══ STEP 3b: Get image for OP singles (search SNKR Dunk for image only) ═══
    if (!imageUrl && isOnePiece && !isSlab && card_code) {
      try {
        const keyword = encodeURIComponent(card_code);
        const snkrRes = await fetch(`https://snkrdunk.com/v3/search?func=all&refId=search&sortKey=default&keyword=${keyword}`);
        if (snkrRes.ok) {
          const data = await snkrRes.json();
          const ranked = data?.search?.rankingProducts || [];
          // Find the matching card — prefer parallel/rarity match
          const rarityKw: Record<string, string[]> = {
            'Parallel': ['パラレル', 'P'], 'SP': ['SP', 'スペシャル'], 'SEC': ['SEC'], 'Alt Art': ['アルティメット', 'ALT'],
          };
          const kws = rarity ? (rarityKw[rarity] || []) : [];
          let match = kws.length > 0
            ? ranked.find((p: any) => p.title?.includes(card_code) && !p.title?.includes('英語版') && kws.some((k: string) => p.title?.includes(k)))
            : null;
          if (!match) match = ranked.find((p: any) => p.title?.includes(card_code) && !p.title?.includes('英語版'));
          
          if (match?.link) {
            const apparelMatch = match.link.match(/\/apparels\/(\d+)/);
            if (apparelMatch) {
              const aid = apparelMatch[1];
              try {
                const pageRes = await fetch(`https://snkrdunk.com/apparels/${aid}`, {
                  headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                if (pageRes.ok) {
                  const html = await pageRes.text();
                  const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
                  if (imgMatch) imageUrl = imgMatch[1];
                }
              } catch (e) { /* image fetch failed */ }
            }
          }
        }
      } catch (e) { /* SNKR Dunk image search failed */ }
    }

    // ═══ STEP 4: Fallback — use Yuyu-tei if no price yet ═══
    if (!currentPriceUsd && yuyuTeiJpy) {
      currentPriceUsd = Math.round(yuyuTeiJpy * JPY_TO_USD * 100) / 100;
      currentPriceIdr = yuyuTeiJpy * 100;
      priceSource = 'yuyu-tei';
    }

    // ═══ STEP 5: Build metadata ═══
    const metadata: any = {};
    if (snkrApparelId) metadata.snkr_apparel_id = snkrApparelId;
    if (snkrUrl) metadata.snkr_url = snkrUrl;
    if (snkrDunkJpy) metadata.snkr_dunk_jpy = snkrDunkJpy;
    if (yuyuTeiJpy) metadata.yuyu_tei_jpy = yuyuTeiJpy;
    if (yuyuTeiUrl) metadata.price_url = yuyuTeiUrl;
    if (cardLanguage !== 'JP') {
      metadata.language = cardLanguage;
      if (isSlab) metadata.skip_snkr_scraper = true;
    }

    // ═══ STEP 6: Insert card ═══
    const result = await pool.query(`
      INSERT INTO portfolio_cards (franchise, card_name, card_code, set_name, rarity, grade, grading_company, language, cost_usd, cost_idr, current_price_usd, current_price_idr, image_url, price_source, date_added, notes, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      franchise, card_name, card_code, set_name || null, rarity || null,
      grade || 'Raw', isPSA10 ? 'PSA' : null, cardLanguage,
      costUsd, cost_idr, currentPriceUsd, currentPriceIdr,
      imageUrl || null, priceSource || null, new Date().toISOString(),
      notes || null, JSON.stringify(metadata)
    ]);

    const card = result.rows[0];
    const roi = costUsd > 0 ? ((currentPriceUsd - costUsd) / costUsd * 100).toFixed(1) : '0';

    res.json({
      ...card,
      _summary: {
        cost: `Rp ${cost_idr.toLocaleString()} ($${costUsd})`,
        market_price: `$${currentPriceUsd} (¥${snkrDunkJpy || yuyuTeiJpy || 0})`,
        roi: `${roi}%`,
        price_source: priceSource,
        image_found: !!imageUrl,
        apparel_id: snkrApparelId || null,
      }
    });
  } catch (err: any) {
    console.error('POST /api/portfolio/smart-add error:', err);
    res.status(500).json({ error: 'Internal server error', detail: err?.message || String(err) });
  }
});

// ═══ POST /api/portfolio/cards ═══
router.post('/cards', async (req: Request, res: Response) => {
  try {
    const { franchise, card_name, card_code, set_name, rarity, grade, grading_company, language, cost_usd, cost_idr, current_price_usd, current_price_idr, image_url, price_source, date_added, notes, metadata } = req.body;
    const result = await pool.query(`
      INSERT INTO portfolio_cards (franchise, card_name, card_code, set_name, rarity, grade, grading_company, language, cost_usd, cost_idr, current_price_usd, current_price_idr, image_url, price_source, date_added, notes, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [franchise || 'onepiece', card_name, card_code, set_name, rarity, grade || 'Raw', grading_company || null, language || 'JP', cost_usd || 0, cost_idr || 0, current_price_usd || 0, current_price_idr || 0, image_url || null, price_source || null, date_added || new Date().toISOString(), notes || null, metadata || null]);
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('POST /api/portfolio/cards error:', err);
    res.status(500).json({ error: 'Internal server error', detail: err?.message || String(err) });
  }
});

// ═══ DELETE /api/portfolio/cards/:id ═══
router.delete('/cards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Also delete related price history
    await pool.query('DELETE FROM portfolio_card_prices WHERE card_id = $1', [id]);
    const result = await pool.query('DELETE FROM portfolio_cards WHERE id = $1 RETURNING id, card_name', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json({ deleted: true, card: result.rows[0] });
  } catch (err: any) {
    console.error('DELETE /api/portfolio/cards error:', err);
    res.status(500).json({ error: 'Internal server error', detail: err?.message });
  }
});

// ═══ PATCH /api/portfolio/cards/:id ═══
router.patch('/cards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const allowed = ['card_name', 'card_code', 'set_name', 'rarity', 'grade', 'grading_company', 'cost_usd', 'cost_idr', 'current_price_usd', 'current_price_idr', 'image_url', 'price_source', 'notes', 'metadata'];
    const updates: string[] = [];
    const values: any[] = [];
    
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        values.push(fields[key]);
        updates.push(`${key} = $${values.length}`);
      }
    }
    if (updates.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
    
    values.push(id);
    updates.push('updated_at = NOW()');
    
    const result = await pool.query(
      `UPDATE portfolio_cards SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Card not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /api/portfolio/cards/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ GET /api/portfolio/dca-log ═══
router.get('/dca-log', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM portfolio_dca_log ORDER BY month DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/portfolio/dca-log error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ POST /api/portfolio/dca-log ═══
router.post('/dca-log', async (req: Request, res: Response) => {
  try {
    const { month, amount_idr, amount_usd, btc_price_usd, btc_acquired, exchange, notes } = req.body;
    const result = await pool.query(`
      INSERT INTO portfolio_dca_log (month, amount_idr, amount_usd, btc_price_usd, btc_acquired, exchange, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [month, amount_idr, amount_usd, btc_price_usd, btc_acquired, exchange, notes]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/portfolio/dca-log error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ GET /api/portfolio/funds ═══
router.get('/funds', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM portfolio_fund_tracker ORDER BY fund_type');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/portfolio/funds error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ PATCH /api/portfolio/funds/:type ═══
router.patch('/funds/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { current_amount_idr, target_amount_idr, target_date, notes } = req.body;
    
    const updates: string[] = ['updated_at = NOW()'];
    const values: any[] = [];
    
    if (current_amount_idr !== undefined) { values.push(current_amount_idr); updates.push(`current_amount_idr = $${values.length}`); }
    if (target_amount_idr !== undefined) { values.push(target_amount_idr); updates.push(`target_amount_idr = $${values.length}`); }
    if (target_date !== undefined) { values.push(target_date); updates.push(`target_date = $${values.length}`); }
    if (notes !== undefined) { values.push(notes); updates.push(`notes = $${values.length}`); }
    
    values.push(type);
    const result = await pool.query(
      `UPDATE portfolio_fund_tracker SET ${updates.join(', ')} WHERE fund_type = $${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Fund not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /api/portfolio/funds/:type error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ POST /api/portfolio/reseed — Clean reseed with images, language, Yuyu-tei prices ═══
router.post('/reseed', async (_req: Request, res: Response) => {
  try {
    // Clear all cards (removes duplicates)
    await pool.query('DELETE FROM portfolio_card_prices');
    await pool.query('DELETE FROM portfolio_cards');

    // JPY to USD conversion (¥1 = ~$0.0067)


    const allCards = [
      // === ONE PIECE — Original Collection (12 cards, ALL JP) ===
      // === ONE PIECE — Original Collection (12 cards, ALL JP) ===
      // SLABS: slabPriceUsd from SNKR Dunk / eBay comps. Titles match PSA label format.
      { franchise: 'one_piece', name: 'Roronoa Zoro (Flagship Battle)', code: 'OP01-025', set: 'Flagship Battle Promo', rarity: 'SR', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 780, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10015.jpg', yuyuJpy: null, slabPriceUsd: 2200, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/106779', snkrJpy: 330000, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-11-03' },
      { franchise: 'one_piece', name: 'Luffy-Tarou (Special Alt Art)', code: 'ST18-005', set: 'A Fist of Divine Speed', rarity: 'SR-SPC', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 60, costIdr: 0, image: 'https://cdn.snkrdunk.com/upload_bg_removed/20250301020331-18.webp', yuyuJpy: null, slabPriceUsd: 187, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/520558', snkrJpy: 28000, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-06' },
      { franchise: 'one_piece', name: 'Shanks (Special Alt Art)', code: 'ST16-004', set: 'A Fist of Divine Speed', rarity: 'SR-SPC', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 65, costIdr: 0, image: 'https://cdn.snkrdunk.com/upload_bg_removed/20250227095736-0.webp', yuyuJpy: null, slabPriceUsd: 200, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/520557', snkrJpy: 30000, priceSrc: 'snkrdunk', ebayTitle: null, date: '2026-03-10' },
      { franchise: 'one_piece', name: 'Monkey D. Luffy (One Piece Day)', code: 'OP07-109', set: 'One Piece Day 24 Promo', rarity: 'SR', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 60, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/op07/10131.jpg', yuyuJpy: null, slabPriceUsd: 233, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/348126', snkrJpy: 35000, priceSrc: 'snkrdunk', ebayTitle: null, date: '2026-03-12' },
      { franchise: 'one_piece', name: 'Sanji (Parallel)', code: 'PRB01-001', set: 'PRB01 The Best', rarity: 'L-P', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 36, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/prb01/10002.jpg', yuyuJpy: null, slabPriceUsd: 113, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/328655', snkrJpy: 17000, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-06' },
      { franchise: 'one_piece', name: 'Sanji (Alternate Art)', code: 'OP06-119', set: 'Wings of the Captain', rarity: 'SEC-P', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 39, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/op06/10144.jpg', yuyuJpy: null, slabPriceUsd: 37, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/159665', snkrJpy: 5600, priceSrc: 'snkrdunk', ebayTitle: null, date: '2026-03-12' },
      { franchise: 'one_piece', name: 'St. Ethanbaron V. Nusjuro (Red Parallel)', code: 'OP13-080', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, lang: 'JP', costUsd: 65, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/op13/10099.jpg', yuyuJpy: 17800, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/op13/10099', date: '2025-10-06' },
      { franchise: 'one_piece', name: 'St. Jaygarcia Saturn (Red Parallel)', code: 'OP13-083', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, lang: 'JP', costUsd: 65, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/op13/10105.jpg', yuyuJpy: 17800, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/op13/10105', date: '2025-10-06' },
      { franchise: 'one_piece', name: 'St. Marcus Mars (Red Parallel)', code: 'OP13-091', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, lang: 'JP', costUsd: 65, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/op13/10119.jpg', yuyuJpy: 17800, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/op13/10119', date: '2025-10-06' },
      { franchise: 'one_piece', name: 'St. Shepherd Ju Peter (Red Parallel)', code: 'OP13-084', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, lang: 'JP', costUsd: 65, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/op13/10108.jpg', yuyuJpy: 17800, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/op13/10108', date: '2025-10-06' },
      { franchise: 'one_piece', name: 'St. Topman Warcury (Red Parallel)', code: 'OP13-089', set: 'Carrying on His Will', rarity: 'R', grade: 'Raw', grader: null, lang: 'JP', costUsd: 65, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/op13/10115.jpg', yuyuJpy: 17800, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/op13/10115', date: '2025-10-06' },
      { franchise: 'one_piece', name: 'Imu (Parallel)', code: 'OP13-079', set: 'Carrying on His Will', rarity: 'L', grade: 'Raw', grader: null, lang: 'JP', costUsd: 20, costIdr: 0, image: 'https://card.yuyu-tei.jp/opc/front/op13/10096.jpg', yuyuJpy: 1480, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/op13/10096', date: '2025-10-06' },

      // === ONE PIECE — March 8 Deal 1: 2nd Anniversary (9 cards, Rp 3M) ===
      { franchise: 'one_piece', name: 'Ace (2nd Anniversary)', code: 'OP02-013', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333333, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10101.jpg', yuyuJpy: 5980, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-op10/10101', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Luffy (2nd Anniversary)', code: 'ST10-Promo', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333333, image: 'https://card.yuyu-tei.jp/opc/front/promo-st10/10082.jpg', yuyuJpy: 5980, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-st10/10082', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Zoro (2nd Anniversary)', code: 'OP01-Promo', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333333, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10105.jpg', yuyuJpy: 4980, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-op10/10105', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Shabondy Event (2nd Anniversary)', code: 'Event-Promo', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333333, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10100.jpg', yuyuJpy: 2480, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-op10/10100', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Sabo (2nd Anniversary)', code: 'Sabo-Promo', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333333, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10103.jpg', yuyuJpy: 2480, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-op10/10103', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Kaya (2nd Anniversary)', code: 'Kaya-Promo', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333333, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10102.jpg', yuyuJpy: 1980, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-op10/10102', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Rosinante (2nd Anniversary)', code: 'Rosi-Promo', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333333, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10104.jpg', yuyuJpy: 1780, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-op10/10104', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Sanji (2nd Anniversary)', code: 'Sanji-Promo', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333333, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10106.jpg', yuyuJpy: 1980, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-op10/10106', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Big Mom (2nd Anniversary)', code: 'BigMom-Promo', set: '2nd Anniversary', rarity: 'Promo', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 333334, image: 'https://card.yuyu-tei.jp/opc/front/promo-op10/10107.jpg', yuyuJpy: 980, yuyuUrl: 'https://yuyu-tei.jp/sell/opc/card/promo-op10/10107', date: '2026-03-08' },

      // === ONE PIECE — March 8 Deal 2: Cherry-picked (4 cards, Rp 3.5M) ===
      // Wanted poster = 手配書 (SPC) variant, NOT manga art (SP/コミパラ)
      { franchise: 'one_piece', name: 'Sabo Wanted Poster (SPC)', code: 'OP13-120', set: 'Carrying on His Will', rarity: 'SEC-SPC', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 875000, image: 'https://cdn.snkrdunk.com/upload_bg_removed/OPC-TCG-2025-08-15-12-of.webp', yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/676011', snkrJpy: 7999, priceSrc: 'snkrdunk', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Buggy Wanted Poster (SPC)', code: 'OP09-051', set: 'The Four Emperors', rarity: 'R-SPC', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 875000, image: 'https://cdn.snkrdunk.com/upload_bg_removed/20240831045755-0.webp', yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/349442', snkrJpy: 7000, priceSrc: 'snkrdunk', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Cross Guild (Parallel)', code: 'OP09-057', set: 'PRB02 The Best vol.2', rarity: 'R-P', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 875000, image: 'https://cdn.snkrdunk.com/upload_bg_removed/20250728015949-0.webp', yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/656320', snkrJpy: 8000, priceSrc: 'snkrdunk', date: '2026-03-08' },
      { franchise: 'one_piece', name: 'Luffy Nika (SEC-P)', code: 'EB04-061', set: 'Egghead Crisis', rarity: 'SEC-P', grade: 'Raw', grader: null, lang: 'JP', costUsd: 0, costIdr: 875000, image: 'https://cdn.snkrdunk.com/upload_bg_removed/20260130070831-0.webp', yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/751308', snkrJpy: 4900, priceSrc: 'snkrdunk', date: '2026-03-08' },

      // === POKEMON — JP PSA 10 (5 cards) — all SNKR Dunk ===
      { franchise: 'pokemon', name: 'Lugia V', code: '110/098', set: 'Paradigm Trigger', rarity: 'Secret Rare', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 690, costIdr: 0, image: null, yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/100567', snkrJpy: null, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-01' },
      { franchise: 'pokemon', name: 'Zekrom ex', code: '174/086', set: 'Black Bolt', rarity: 'Secret Rare', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 450, costIdr: 0, image: null, yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/585213', snkrJpy: null, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-01' },
      { franchise: 'pokemon', name: 'Charizard ex', code: '349/190', set: 'Shiny Treasure ex', rarity: 'Super Rare', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 348, costIdr: 0, image: null, yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/162095', snkrJpy: null, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-01' },
      { franchise: 'pokemon', name: "N's Reshiram", code: '109/100', set: 'Battle Partners', rarity: 'Art Rare', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 39, costIdr: 0, image: null, yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/485654', snkrJpy: null, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-01' },
      { franchise: 'pokemon', name: 'Black Kyurem ex', code: '077/064', set: 'Paradise Dragona', rarity: 'Super Rare', grade: 'PSA 10', grader: 'PSA', lang: 'JP', costUsd: 10, costIdr: 0, image: null, yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/378062', snkrJpy: null, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-01' },

      // === POKEMON — Indonesian EGS Slabs (2 cards) — SNKR Dunk ===
      { franchise: 'pokemon', name: 'Mew ex SAR', code: '347/190', set: 'Shiny Treasure ex (SV4a)', rarity: 'SAR', grade: 'EGS 9', grader: 'EGS', lang: 'ID', costUsd: 0, costIdr: 3500000, image: null, yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/164250', snkrJpy: null, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-01' },
      { franchise: 'pokemon', name: 'Gardevoir ex SAR', code: '348/190', set: 'Shiny Treasure ex (SV4a)', rarity: 'SAR', grade: 'EGS 9.5', grader: 'EGS', lang: 'ID', costUsd: 0, costIdr: 1500000, image: null, yuyuJpy: null, slabPriceUsd: null, yuyuUrl: null, ebayUrl: null, snkrUrl: 'https://snkrdunk.com/apparels/162094', snkrJpy: null, priceSrc: 'snkrdunk', ebayTitle: null, date: '2025-10-01' },
    ];

    let inserted = 0;
    for (const c of allCards) {
      // Determine current price: Yuyu-tei JPY for raw singles, slabPriceUsd for slabs
      const isSlab = c.grade && c.grade !== 'Raw';
      let currentPriceUsd: number | null = null;
      let currentPriceIdr: number | null = null;

      if (isSlab && c.slabPriceUsd) {
        // Slab: use manual eBay/SNKRDUNK comp price
        currentPriceUsd = c.slabPriceUsd;
        currentPriceIdr = c.slabPriceUsd * IDR_PER_USD;
      } else if (!isSlab && c.snkrJpy) {
        // Raw with SNKR Dunk price
        currentPriceUsd = c.snkrJpy * JPY_TO_USD;
        currentPriceIdr = c.snkrJpy * 100;
      } else if (!isSlab && c.yuyuJpy) {
        // Raw: use Yuyu-tei JPY conversion
        currentPriceUsd = c.yuyuJpy * JPY_TO_USD;
        currentPriceIdr = c.yuyuJpy * 100; // x100 JPY→IDR
      }

      const priceSource = c.priceSrc || (c.yuyuJpy ? 'yuyu-tei' : null);
      const metadata = {
        price_url: c.yuyuUrl || null,
        ebay_url: c.ebayUrl || null,
        snkr_url: (c as any).snkrUrl || null,
        yuyu_tei_jpy: c.yuyuJpy || null,
        snkr_dunk_jpy: (c as any).snkrJpy || null,
        slab_price_usd: c.slabPriceUsd || null,
        ebay_title: (c as any).ebayTitle || null,
      };

      await pool.query(`
        INSERT INTO portfolio_cards (franchise, card_name, card_code, set_name, rarity, grade, grading_company, language, cost_usd, cost_idr, current_price_usd, current_price_idr, image_url, price_source, date_added, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [c.franchise, c.name, c.code, c.set, c.rarity, c.grade, c.grader, c.lang, c.costUsd, c.costIdr, currentPriceUsd, currentPriceIdr, c.image, priceSource, c.date, JSON.stringify(metadata)]);
      inserted++;
    }

    res.json({ success: true, message: `Reseeded ${inserted} cards (duplicates cleared)` });
  } catch (err) {
    console.error('Reseed error:', err);
    res.status(500).json({ error: 'Reseed failed', details: String(err) });
  }
});

// ═══ POST /api/portfolio/update-prices ═══
// Fetches latest prices from SNKR Dunk + Yuyu-tei for all cards
router.post('/update-prices', async (req: Request, res: Response) => {
  try {
    const cards = await pool.query('SELECT * FROM portfolio_cards');
    let updated = 0;
    const results: any[] = [];

    for (const card of cards.rows) {
      const meta = card.metadata || {};
      const isSlab = card.grade && card.grade !== 'Raw';
      let newPriceUsd: number | null = null;
      let newPriceIdr: number | null = null;
      let newSnkrJpy: number | null = null;
      let newYuyuJpy: number | null = null;
      let source = card.price_source;

      try {
        const isOnePiece = card.franchise === 'one_piece';

        // ═══ PRICING RULES ═══
        // One Piece raw singles → ALWAYS Yuyu-tei (SNKR Dunk matches wrong variants)
        // One Piece PSA 10 slabs → ALWAYS SNKR Dunk
        // Pokemon PSA 10 slabs → ALWAYS SNKR Dunk
        // Pokemon raw singles → SNKR Dunk (no Yuyu-tei for Pokemon)

        if (meta.skip_snkr_scraper) {
          // ═══ SKIP: Non-JP slabs (Indonesian EGS etc) — price set manually ═══
          // Keep existing price, don't overwrite with JP SNKR Dunk data
        } else if (isSlab && (meta.snkr_url || meta.snkr_apparel_id || card.card_code)) {
          // ═══ SLABS: SNKR Dunk PSA 10 IQR-filtered average ═══
          const keyword = encodeURIComponent(`${card.card_code} PSA`);
          const snkrRes = await fetch(`https://snkrdunk.com/v3/search?func=all&refId=search&sortKey=default&keyword=${keyword}`);
          if (snkrRes.ok) {
            const data = await snkrRes.json();
            const products = data?.search?.products || [];
            // Use apparel ID from metadata (most reliable) or from URL
            const targetId = meta.snkr_apparel_id || meta.snkr_url?.match(/apparels\/(\d+)/)?.[1];
            const psa10 = products.filter((p: any) => {
              if (p.condition !== 'PSA10' || !p.salePrice) return false;
              if (p.title?.includes('英語版')) return false;
              // Match by apparel ID (exact product) — this is the key filter
              if (targetId && p.link) return p.link.includes(`/apparels/${targetId}/`);
              // Fallback: match by card code in title
              if (!p.title?.includes(card.card_code)) return false;
              return true;
            });
            if (psa10.length > 0) {
              let prices = psa10.map((p: any) => p.salePrice).sort((a: number, b: number) => a - b);
              // Remove outliers using IQR method (prevents wrong variants from inflating average)
              if (prices.length >= 4) {
                const q1 = prices[Math.floor(prices.length / 4)];
                const q3 = prices[Math.floor(3 * prices.length / 4)];
                const iqr = q3 - q1;
                const lower = q1 - 1.5 * iqr;
                const upper = q3 + 1.5 * iqr;
                const filtered = prices.filter((p: number) => p >= lower && p <= upper);
                if (filtered.length > 0) prices = filtered;
              }
              const avg = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
              newSnkrJpy = avg;
              newPriceUsd = avg * JPY_TO_USD;
              newPriceIdr = avg * 100;
              source = 'snkrdunk';
            }
          }
        } else if (!isSlab && isOnePiece && meta.yuyu_tei_jpy) {
          // ═══ ONE PIECE RAW SINGLES: ALWAYS Yuyu-tei ═══
          newYuyuJpy = meta.yuyu_tei_jpy;
          newPriceUsd = meta.yuyu_tei_jpy * JPY_TO_USD;
          newPriceIdr = meta.yuyu_tei_jpy * 100;
          source = 'yuyu-tei';
        } else if (!isSlab && !isOnePiece && card.card_code) {
          // ═══ POKEMON RAW SINGLES: SNKR Dunk ranked products ═══
          const keyword = encodeURIComponent(card.card_code);
          const snkrRes = await fetch(`https://snkrdunk.com/v3/search?func=all&refId=search&sortKey=default&keyword=${keyword}`);
          if (snkrRes.ok) {
            const data = await snkrRes.json();
            const ranked = data?.search?.rankingProducts || [];
            const matches = ranked.filter((p: any) =>
              p.title?.includes(card.card_code) &&
              p.salePrice && p.salePrice > 0 &&
              !p.title?.includes('英語版')
            );
            if (matches.length > 0) {
              const prices = matches.map((p: any) => p.salePrice);
              const avg = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
              newSnkrJpy = avg;
              newPriceUsd = avg * JPY_TO_USD;
              newPriceIdr = avg * 100;
              source = 'snkrdunk';
            }
          }
        }

        // Fallback for any card without a price yet
        if (!newPriceUsd && meta.yuyu_tei_jpy) {
          newYuyuJpy = meta.yuyu_tei_jpy;
          newPriceUsd = meta.yuyu_tei_jpy * JPY_TO_USD;
          newPriceIdr = meta.yuyu_tei_jpy * 100;
          source = 'yuyu-tei';
        }

        if (newPriceUsd) {
          const updatedMeta = {
            ...meta,
            snkr_dunk_jpy: newSnkrJpy || meta.snkr_dunk_jpy,
            yuyu_tei_jpy: newYuyuJpy || meta.yuyu_tei_jpy,
            slab_price_usd: isSlab ? newPriceUsd : meta.slab_price_usd,
            last_price_update: new Date().toISOString(),
          };

          await pool.query(`
            UPDATE portfolio_cards
            SET current_price_usd = $1, current_price_idr = $2, price_source = $3, metadata = $4, updated_at = NOW()
            WHERE id = $5
          `, [newPriceUsd, newPriceIdr, source, JSON.stringify(updatedMeta), card.id]);

          // Insert price history record
          await pool.query(`
            INSERT INTO portfolio_card_prices (card_id, price_usd, price_idr, source)
            VALUES ($1, $2, $3, $4)
          `, [card.id, newPriceUsd, newPriceIdr || 0, source || 'unknown']);

          updated++;
          results.push({ card: card.card_name, code: card.card_code, price_usd: newPriceUsd.toFixed(2), source });
        }
      } catch (cardErr) {
        results.push({ card: card.card_name, code: card.card_code, error: String(cardErr) });
      }

      // Rate limit: 200ms between SNKR Dunk requests
      await new Promise(r => setTimeout(r, 200));
    }

    // Write portfolio-prices.json snapshot for local cron comparison
    try {
      const snapshot: Record<string, any> = {};
      const allCards = await pool.query('SELECT id, card_name, card_code, current_price_usd, current_price_idr, updated_at FROM portfolio_cards WHERE current_price_usd IS NOT NULL');
      for (const c of allCards.rows) {
        snapshot[c.id] = {
          name: c.card_name,
          code: c.card_code,
          price_usd: parseFloat(c.current_price_usd),
          price_idr: parseFloat(c.current_price_idr) || 0,
          updated: c.updated_at,
        };
      }
      const snapshotPath = path.resolve(__dirname, '../../../../memory/portfolio-prices.json');
      fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
      fs.writeFileSync(snapshotPath, JSON.stringify({ timestamp: new Date().toISOString(), prices: snapshot }, null, 2));
    } catch (snapErr) {
      console.error('Failed to write portfolio-prices.json snapshot:', snapErr);
    }

    res.json({ success: true, updated, total: cards.rows.length, results });
  } catch (err) {
    console.error('Update prices error:', err);
    res.status(500).json({ error: 'Update prices failed', details: String(err) });
  }
});

// ═══ GET /api/portfolio/analytics ═══
// Aggregated analytics: BTC, cards, funds, projections, DCA performance
router.get('/analytics', async (_req: Request, res: Response) => {
  try {
    const [holdingsRes, cardsRes, fundsRes, dcaRes] = await Promise.all([
      pool.query('SELECT * FROM portfolio_holdings'),
      pool.query('SELECT * FROM portfolio_cards'),
      pool.query('SELECT * FROM portfolio_fund_tracker'),
      pool.query('SELECT * FROM portfolio_dca_log ORDER BY month ASC'),
    ]);

    const holdings = holdingsRes.rows;
    const cards = cardsRes.rows;
    const funds = fundsRes.rows;
    const dcaLog = dcaRes.rows;

    // ── BTC Holdings ──
    const btcHolding = holdings.find((h: any) => h.symbol === 'BTC');
    const btcQty = btcHolding ? parseFloat(btcHolding.quantity) : 0;
    const btcCostBasis = btcHolding ? parseFloat(btcHolding.cost_basis_usd) : 0;
    const btcAvgPrice = btcQty > 0 ? btcCostBasis / btcQty : 0;

    // ── Card Portfolio ──
    const getCardCost = (c: any) => {
      const usd = parseFloat(c.cost_usd) || 0;
      if (usd > 0) return usd;
      return (parseFloat(c.cost_idr) || 0) / IDR_PER_USD;
    };
    const getCardCurrent = (c: any) => {
      const usd = parseFloat(c.current_price_usd || '0');
      if (usd > 0) return usd;
      const idr = parseFloat(c.current_price_idr || '0');
      if (idr > 0) return idr / IDR_PER_USD;
      return getCardCost(c);
    };

    const cardsTotalCost = cards.reduce((s: number, c: any) => s + getCardCost(c), 0);
    const cardsTotalCurrent = cards.reduce((s: number, c: any) => s + getCardCurrent(c), 0);
    const cardsROI = cardsTotalCost > 0 ? ((cardsTotalCurrent - cardsTotalCost) / cardsTotalCost) * 100 : 0;

    // ── Per-franchise breakdown ──
    const franchises: Record<string, { cost: number; current: number; count: number }> = {};
    for (const c of cards) {
      const f = c.franchise;
      if (!franchises[f]) franchises[f] = { cost: 0, current: 0, count: 0 };
      franchises[f].cost += getCardCost(c);
      franchises[f].current += getCardCurrent(c);
      franchises[f].count++;
    }
    const franchiseBreakdown = Object.entries(franchises).map(([name, data]) => ({
      franchise: name,
      cost_usd: Math.round(data.cost * 100) / 100,
      current_usd: Math.round(data.current * 100) / 100,
      roi_pct: data.cost > 0 ? Math.round(((data.current - data.cost) / data.cost) * 10000) / 100 : 0,
      count: data.count,
    }));

    // ── Top 5 by ROI % ──
    const cardsWithROI = cards.map((c: any) => {
      const cost = getCardCost(c);
      const current = getCardCurrent(c);
      const hasPriceData = parseFloat(c.current_price_usd || '0') > 0 || parseFloat(c.current_price_idr || '0') > 0;
      return {
        id: c.id,
        card_name: c.card_name,
        card_code: c.card_code,
        franchise: c.franchise,
        grade: c.grade,
        cost_usd: cost,
        current_usd: current,
        roi_pct: cost > 0 && hasPriceData ? ((current - cost) / cost) * 100 : 0,
        pnl_usd: current - cost,
        has_price: hasPriceData,
      };
    });

    const topByROI = [...cardsWithROI].filter(c => c.has_price).sort((a, b) => b.roi_pct - a.roi_pct).slice(0, 5);
    const topByValue = [...cardsWithROI].filter(c => c.has_price).sort((a, b) => b.current_usd - a.current_usd).slice(0, 5);
    const bottomByROI = [...cardsWithROI].filter(c => c.has_price).sort((a, b) => a.roi_pct - b.roi_pct).slice(0, 5);

    // ── War Chest & Wedding ──
    const warChest = funds.find((f: any) => f.fund_type === 'war_chest');
    const wedding = funds.find((f: any) => f.fund_type === 'wedding');
    const warChestIdr = warChest ? parseFloat(warChest.current_amount_idr) : 0;
    const warChestUsd = warChestIdr / IDR_PER_USD;
    const weddingCurrent = wedding ? parseFloat(wedding.current_amount_idr) : 0;
    const weddingTarget = wedding ? parseFloat(wedding.target_amount_idr) : 350000000;
    const weddingDate = wedding?.target_date || '2026-10-01';

    // ── DCA Performance ──
    const totalDcaUsd = dcaLog.reduce((s: number, d: any) => s + parseFloat(d.amount_usd), 0);
    const totalBtcAcquired = dcaLog.reduce((s: number, d: any) => s + parseFloat(d.btc_acquired), 0);
    const avgDcaPrice = totalBtcAcquired > 0 ? totalDcaUsd / totalBtcAcquired : 0;
    const monthlyDcaAvg = dcaLog.length > 0 ? totalDcaUsd / dcaLog.length : 0;

    // Monthly accumulation rate (last 3 months avg or overall)
    const recentDca = dcaLog.slice(-3);
    const recentMonthlyBtc = recentDca.length > 0
      ? recentDca.reduce((s: number, d: any) => s + parseFloat(d.btc_acquired), 0) / recentDca.length
      : 0;

    // ── 2030 Projections (synced with masterplan v2.2) ──
    const monthsTo2030 = Math.max(0, (2030 - new Date().getFullYear()) * 12 + (0 - new Date().getMonth()));
    // Use masterplan monthly DCA rate: ~$2,841/mo at current prices
    // BTC Blitz (Mar-Dec 2026): wedding Rp 30M redirected to BTC
    // Normal: $2,841 (ForuAI cash $2,310 + OKU surplus ~$531)
    // Blitz: +$1,829 (Rp 30M wedding redirect) = $4,670/mo
    const now2 = new Date();
    const isBlitzPhase = now2 < new Date('2027-01-01');
    const masterplanMonthlyDca = isBlitzPhase ? 4670 : 2841;
    const estimatedAvgBtcPrice = 70000; // conservative bear market avg
    const masterplanMonthlyBtc = masterplanMonthlyDca / estimatedAvgBtcPrice;
    const effectiveMonthlyBtc = recentMonthlyBtc > 0 ? recentMonthlyBtc : masterplanMonthlyBtc;
    const projectedBtcAt2030 = btcQty + (effectiveMonthlyBtc * monthsTo2030);
    
    // Masterplan scenarios: worst (4.1), personal (5.3), full (11.7)
    const priceTargets = [150000, 300000, 500000, 1000000];
    const btcScenarios = [
      { label: 'Worst (salary only)', btc: 4.4 },
      { label: 'Personal FORU', btc: 5.6 },
      { label: 'DCA projection', btc: Math.round(projectedBtcAt2030 * 10000) / 10000 },
      { label: 'Full allocation', btc: 12.0 },
    ];
    const projections = priceTargets.map(price => ({
      btc_price: price,
      scenarios: btcScenarios.map(s => ({
        label: s.label,
        btc: s.btc,
        net_worth_usd: Math.round(s.btc * price),
        net_worth_idr: Math.round(s.btc * price * IDR_PER_USD),
      })),
    }));

    // ── DCA Cumulative Timeline (for chart) ──
    let cumulativeBtc = 0;
    let cumulativeCost = 0;
    const dcaTimeline = dcaLog.map((d: any) => {
      cumulativeBtc += parseFloat(d.btc_acquired);
      cumulativeCost += parseFloat(d.amount_usd);
      return {
        month: d.month,
        btc_acquired: parseFloat(d.btc_acquired),
        amount_usd: parseFloat(d.amount_usd),
        btc_price: parseFloat(d.btc_price_usd),
        cumulative_btc: Math.round(cumulativeBtc * 100000000) / 100000000,
        cumulative_cost: Math.round(cumulativeCost * 100) / 100,
      };
    });

    // ── Projected Future Timeline (monthly to 2030) ──
    const futureTimeline: any[] = [];
    let futureBtc = btcQty;
    const now = new Date();
    for (let i = 1; i <= Math.min(monthsTo2030, 60); i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      futureBtc += effectiveMonthlyBtc;
      futureTimeline.push({
        month: futureDate.toISOString().slice(0, 10),
        cumulative_btc: Math.round(futureBtc * 100000000) / 100000000,
        projected: true,
      });
    }

    // ── Income Allocation (from masterplan v2.2) ──
    // Monthly income: OKU $6,750 + ForuAI $3,300 = $10,050 (Rp 165M)
    // ForuAI cash ($2,310) → 100% BTC. ForuAI tokens ($990) → sell → BTC.
    // OKU → expenses + wedding Rp 30M + war chest Rp 15M + surplus → BTC
    const monthlyIncomeUsd = 10050;
    // BTC Blitz phase (Mar-Dec 2026): wedding paused, redirected to BTC
    const blitzActive = new Date() < new Date('2027-01-01');
    const allocBtcDca = blitzActive ? 4670 : 2841; // Blitz: +$1,829 wedding redirect
    const allocWedding = blitzActive ? 0 : 1829; // PAUSED until Jan 2027
    const allocWarChest = 915;  // Rp 15M / 16,400
    const allocHealth = 244;    // Rp 4M / 16,400
    const allocKeiko = 244;     // Rp 4M / 16,400 (wedding gold via Keiko)
    const allocExpenses = monthlyIncomeUsd - allocBtcDca - allocWedding - allocWarChest - allocHealth - allocKeiko;
    const incomeAllocation = {
      monthly_income_usd: monthlyIncomeUsd,
      monthly_income_idr: monthlyIncomeUsd * IDR_PER_USD,
      income_sources: [
        { source: 'OKU Trade', usd: 6750, idr: 6750 * IDR_PER_USD, allocation: 'Expenses + Wedding + War Chest + Surplus → BTC' },
        { source: 'ForuAI Cash', usd: 2310, idr: 2310 * IDR_PER_USD, allocation: '100% → BTC DCA' },
        { source: 'ForuAI Tokens', usd: 990, idr: 990 * IDR_PER_USD, allocation: 'Sell immediately → BTC' },
      ],
      breakdown: [
        { category: 'BTC DCA', amount_usd: allocBtcDca, pct: Math.round((allocBtcDca / monthlyIncomeUsd) * 10000) / 100, color: '#fbbf24' },
        { category: 'Wedding Fund', amount_usd: allocWedding, pct: Math.round((allocWedding / monthlyIncomeUsd) * 10000) / 100, color: '#ec4899' },
        { category: 'War Chest', amount_usd: allocWarChest, pct: Math.round((allocWarChest / monthlyIncomeUsd) * 10000) / 100, color: '#f97316' },
        { category: 'Health & Fitness', amount_usd: allocHealth, pct: Math.round((allocHealth / monthlyIncomeUsd) * 10000) / 100, color: '#22c55e' },
        { category: 'Keiko (Gold)', amount_usd: allocKeiko, pct: Math.round((allocKeiko / monthlyIncomeUsd) * 10000) / 100, color: '#06b6d4' },
        { category: 'Living Expenses', amount_usd: allocExpenses, pct: Math.round((allocExpenses / monthlyIncomeUsd) * 10000) / 100, color: '#6b7280' },
      ],
    };
    const investmentUsd = allocBtcDca + allocWedding + allocWarChest;
    const savingsRate = Math.round((investmentUsd / monthlyIncomeUsd) * 10000) / 100;

    res.json({
      btc: {
        quantity: btcQty,
        cost_basis_usd: btcCostBasis,
        avg_price: Math.round(btcAvgPrice),
        monthly_accumulation_rate: Math.round(recentMonthlyBtc * 100000000) / 100000000,
      },
      cards: {
        total_cost_usd: Math.round(cardsTotalCost * 100) / 100,
        total_current_usd: Math.round(cardsTotalCurrent * 100) / 100,
        roi_pct: Math.round(cardsROI * 100) / 100,
        count: cards.length,
        franchise_breakdown: franchiseBreakdown,
        top_by_roi: topByROI,
        top_by_value: topByValue,
        bottom_by_roi: bottomByROI,
      },
      war_chest: {
        amount_idr: warChestIdr,
        amount_usd: Math.round(warChestUsd * 100) / 100,
        deployment_triggers: [
          { drawdown_pct: 30, deploy_pct: 25, deploy_usd: Math.round(warChestUsd * 0.25 * 100) / 100 },
          { drawdown_pct: 40, deploy_pct: 50, deploy_usd: Math.round(warChestUsd * 0.50 * 100) / 100 },
          { drawdown_pct: 50, deploy_pct: 100, deploy_usd: Math.round(warChestUsd * 100) / 100 },
        ],
      },
      wedding: {
        current_idr: weddingCurrent,
        target_idr: weddingTarget,
        progress_pct: Math.round((weddingCurrent / weddingTarget) * 10000) / 100,
        target_date: weddingDate,
      },
      dca: {
        total_invested_usd: Math.round(totalDcaUsd * 100) / 100,
        total_btc_acquired: Math.round(totalBtcAcquired * 100000000) / 100000000,
        avg_buy_price: Math.round(avgDcaPrice),
        monthly_avg_usd: Math.round(monthlyDcaAvg * 100) / 100,
        entries: dcaLog.length,
      },
      projections_2030: {
        current_btc: btcQty,
        monthly_accumulation: Math.round(effectiveMonthlyBtc * 100000000) / 100000000,
        months_to_2030: monthsTo2030,
        projected_btc: Math.round(projectedBtcAt2030 * 100000000) / 100000000,
        masterplan_scenarios: btcScenarios,
        price_scenarios: projections,
        btc_ath: 126000,
      },
      dca_timeline: dcaTimeline,
      future_timeline: futureTimeline,
      income_allocation: {
        ...incomeAllocation,
        savings_rate_pct: savingsRate,
      },
      masterplan: {
        btc_ath: 126000,
        war_chest_thresholds: [
          { drawdown_pct: 30, btc_price: Math.round(126000 * 0.70), deploy_pct: 25 },
          { drawdown_pct: 40, btc_price: Math.round(126000 * 0.60), deploy_pct: 50 },
          { drawdown_pct: 50, btc_price: Math.round(126000 * 0.50), deploy_pct: 100 },
        ],
        wedding_date: '2027-07-01',
        wedding_target_idr: 350000000,
        wedding_fund_paused: blitzActive,
        wedding_fund_resume: '2027-01-01',
        btc_blitz_active: blitzActive,
        btc_blitz_monthly_usd: 4670,
        btc_blitz_period: 'Mar-Dec 2026',
        fire_sale_theory: 'AI destroys Indonesian middle class by 2030. Be the buyer.',
        btc_2030_targets: { worst: 4.1, personal: 5.3, full: 11.7 },
        btc_price_cycle: [
          { period: 'Apr-Dec 2026', range: '$50K-70K', strategy: 'MAX ACCUMULATION' },
          { period: '2027', range: '$40K-60K', strategy: 'BEAR BOTTOM' },
          { period: 'Jan-Apr 2028', range: '$50K-70K', strategy: 'Pre-halving DCA' },
          { period: 'May-Dec 2028', range: '$70K-100K', strategy: 'Post-halving' },
          { period: '2029', range: '$150K-300K', strategy: 'Bull run' },
          { period: '2030', range: '$250K-500K', strategy: 'Cycle peak' },
        ],
      },
    });
  } catch (err) {
    console.error('GET /api/portfolio/analytics error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ GET /api/portfolio/masterplan ═══
// Serves the investment masterplan with live data injected
router.get('/masterplan', async (_req: Request, res: Response) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Read masterplan from reports directory (same path as reports.ts uses)
    const reportsDir = path.resolve(__dirname, '../../reports');
    const masterplanPath = path.join(reportsDir, 'investment-masterplan-v2.2.md');
    
    if (!fs.existsSync(masterplanPath)) {
      return res.status(404).json({ error: 'Masterplan file not found', tried: masterplanPath });
    }
    const content = fs.readFileSync(masterplanPath, 'utf-8');
    
    // Fetch live data for injection
    const btcResult = await pool.query(
      "SELECT quantity, cost_basis_usd FROM portfolio_holdings WHERE symbol = 'BTC' LIMIT 1"
    );
    const fundsResult = await pool.query('SELECT * FROM portfolio_fund_tracker');
    
    const btcHoldings = btcResult.rows[0]?.quantity || 0;
    const btcCost = btcResult.rows[0]?.cost_basis_usd || 0;
    
    const wedding = fundsResult.rows.find((f: any) => f.fund_type === 'wedding');
    const warChest = fundsResult.rows.find((f: any) => f.fund_type === 'war_chest');
    
    // Cards summary
    const cardsResult = await pool.query(
      "SELECT COUNT(*) as count, COALESCE(SUM(cost_usd), 0) + COALESCE(SUM(cost_idr::numeric / 16400), 0) as total_cost, COALESCE(SUM(current_price_usd), 0) as total_current FROM portfolio_cards"
    );
    
    res.json({
      content,
      live_data: {
        btc_holdings: parseFloat(btcHoldings),
        btc_cost_basis: parseFloat(btcCost),
        wedding_fund_idr: wedding ? parseFloat(wedding.current_amount_idr) : 0,
        wedding_target_idr: wedding ? parseFloat(wedding.target_amount_idr) : 0,
        war_chest_idr: warChest ? parseFloat(warChest.current_amount_idr) : 0,
        cards_count: parseInt(cardsResult.rows[0]?.count || '0'),
        cards_cost_usd: parseFloat(cardsResult.rows[0]?.total_cost || '0'),
        cards_current_usd: parseFloat(cardsResult.rows[0]?.total_current || '0'),
        last_updated: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('GET /api/portfolio/masterplan error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
