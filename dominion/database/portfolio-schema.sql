-- Portfolio Dashboard Schema
-- Personal investment + collectibles tracker for Lord Zexo

-- Holdings: BTC, USDT, wedding fund, war chest, gold, etc.
CREATE TABLE portfolio_holdings (
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

CREATE INDEX idx_portfolio_holdings_asset_type ON portfolio_holdings(asset_type);

-- Card inventory
CREATE TABLE portfolio_cards (
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

CREATE INDEX idx_portfolio_cards_franchise ON portfolio_cards(franchise);
CREATE INDEX idx_portfolio_cards_card_code ON portfolio_cards(card_code);

-- Price history for cards
CREATE TABLE portfolio_card_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL REFERENCES portfolio_cards(id) ON DELETE CASCADE,
    price_usd DECIMAL(10,2) NOT NULL,
    price_idr DECIMAL(14,0),
    source TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolio_card_prices_card_id_recorded ON portfolio_card_prices(card_id, recorded_at DESC);

-- Monthly DCA records
CREATE TABLE portfolio_dca_log (
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

CREATE INDEX idx_portfolio_dca_log_month ON portfolio_dca_log(month DESC);

-- Fund tracker (wedding, war chest, gold)
CREATE TABLE portfolio_fund_tracker (
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
