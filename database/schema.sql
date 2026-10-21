-- ==============================================================================
-- ZENITH ARENA: RELATIONAL DATABASE SCHEMA (PostgreSQL 15+)
-- Production DDL for Sportsbook & Online Casino Platform
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users and Profiles
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(20) DEFAULT '🦁',
    vip_level VARCHAR(20) DEFAULT 'Bronze',
    vip_points INTEGER DEFAULT 0,
    is_email_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(30) DEFAULT 'Player',
    language VARCHAR(10) DEFAULT 'en',
    odds_format VARCHAR(20) DEFAULT 'decimal',
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Responsible Gaming Guardrails
CREATE TABLE responsible_gaming_limits (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    daily_deposit_limit NUMERIC(12, 2) DEFAULT 0,
    weekly_deposit_limit NUMERIC(12, 2) DEFAULT 0,
    session_timeout_minutes INTEGER DEFAULT 60,
    reality_check_minutes INTEGER DEFAULT 30,
    is_self_excluded BOOLEAN DEFAULT FALSE,
    self_exclusion_until TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Wallets and Ledger
CREATE TABLE wallets (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL, -- 'ETB', 'USD'
    balance NUMERIC(14, 2) DEFAULT 0.00 CHECK (balance >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, currency)
);

CREATE TABLE wallet_transactions (
    id VARCHAR(50) PRIMARY KEY,
    wallet_id VARCHAR(36) NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL, -- 'deposit', 'withdrawal', 'bet_placed', 'bet_payout', 'promotion_reward'
    amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed', -- 'completed', 'pending', 'failed', 'cancelled'
    method VARCHAR(50) NOT NULL, -- 'Telebirr Sandbox', 'Bank Card Demo', 'Internal Ledger'
    reference VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    telebirr_phone VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Sportsbook Events & Markets
CREATE TABLE sports_events (
    id VARCHAR(50) PRIMARY KEY,
    sport VARCHAR(30) NOT NULL,
    league VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    is_live BOOLEAN DEFAULT FALSE,
    match_time VARCHAR(20),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    provider VARCHAR(50) NOT NULL,
    is_simulated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sports_markets (
    id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL REFERENCES sports_events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE market_selections (
    id VARCHAR(50) PRIMARY KEY,
    market_id VARCHAR(50) NOT NULL REFERENCES sports_markets(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    odds NUMERIC(8, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);

-- 5. Placed Bets
CREATE TABLE placed_bets (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL, -- 'single', 'accumulator'
    total_stake NUMERIC(12, 2) NOT NULL,
    total_odds NUMERIC(10, 2) NOT NULL,
    potential_payout NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'won', 'lost', 'void', 'cashed_out'
    cashout_value NUMERIC(12, 2),
    placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settled_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE bet_selections_map (
    id SERIAL PRIMARY KEY,
    bet_id VARCHAR(50) NOT NULL REFERENCES placed_bets(id) ON DELETE CASCADE,
    event_id VARCHAR(50) NOT NULL,
    match_name VARCHAR(255) NOT NULL,
    market_name VARCHAR(100) NOT NULL,
    selection_id VARCHAR(50) NOT NULL,
    selection_name VARCHAR(100) NOT NULL,
    odds NUMERIC(8, 2) NOT NULL
);

-- 6. Casino Games & Rounds
CREATE TABLE casino_games (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(30) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    rtp NUMERIC(5, 2) NOT NULL,
    volatility VARCHAR(20) DEFAULT 'Medium',
    is_playable_demo BOOLEAN DEFAULT TRUE,
    integration_type VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE casino_game_rounds (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    game_id VARCHAR(50) NOT NULL REFERENCES casino_games(id),
    stake NUMERIC(12, 2) NOT NULL,
    payout NUMERIC(12, 2) DEFAULT 0,
    multiplier NUMERIC(10, 2) DEFAULT 0,
    round_hash VARCHAR(255),
    server_seed VARCHAR(255),
    client_seed VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Audit Logging
CREATE TABLE audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    operator_role VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sports_events_live ON sports_events(is_live, status);
CREATE INDEX idx_placed_bets_user ON placed_bets(user_id, status);
CREATE INDEX idx_wallet_tx_wallet ON wallet_transactions(wallet_id, created_at DESC);
