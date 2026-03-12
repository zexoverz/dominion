import { Router, Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const IDR_PER_USD = 16400;

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

// ═══ POST /api/portfolio/cards ═══
router.post('/cards', async (req: Request, res: Response) => {
  try {
    const { franchise, card_name, card_code, set_name, rarity, grade, grading_company, language, cost_usd, cost_idr, current_price_usd, current_price_idr, image_url, price_source, date_added, notes } = req.body;
    const result = await pool.query(`
      INSERT INTO portfolio_cards (franchise, card_name, card_code, set_name, rarity, grade, grading_company, language, cost_usd, cost_idr, current_price_usd, current_price_idr, image_url, price_source, date_added, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [franchise, card_name, card_code, set_name, rarity, grade, grading_company, language || 'JP', cost_usd || 0, cost_idr || 0, current_price_usd, current_price_idr, image_url, price_source, date_added, notes]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/portfolio/cards error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══ PATCH /api/portfolio/cards/:id ═══
router.patch('/cards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const allowed = ['card_name', 'card_code', 'set_name', 'rarity', 'grade', 'grading_company', 'cost_usd', 'cost_idr', 'current_price_usd', 'current_price_idr', 'image_url', 'price_source', 'notes'];
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

export default router;
