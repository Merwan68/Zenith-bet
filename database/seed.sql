-- ==============================================================================
-- ZENITH ARENA: DATABASE SEED SCRIPT
-- ==============================================================================

-- Seed Administrator & Demo Users
INSERT INTO users (id, username, email, password_hash, avatar, vip_level, vip_points, is_email_verified, role, language, odds_format)
VALUES
('ZEN-98241', 'HighRoller_Abebe', 'merwanabdusomed@gmail.com', '$2b$10$sandbox_hashed_pass_zenith_secure_auth', '🦁', 'Gold', 6450, TRUE, 'Super Admin', 'en', 'decimal'),
('ZEN-10002', 'Addis_Vip_99', 'vip@zenith.arena', '$2b$10$sandbox_hashed_pass_zenith_secure_auth', '🦅', 'Platinum', 12500, TRUE, 'Player', 'en', 'decimal');

-- Seed Wallets
INSERT INTO wallets (id, user_id, currency, balance)
VALUES
('W-ETB-01', 'ZEN-98241', 'ETB', 185000.00),
('W-USD-01', 'ZEN-98241', 'USD', 2450.00);

-- Seed Responsible Gaming Limits
INSERT INTO responsible_gaming_limits (user_id, daily_deposit_limit, weekly_deposit_limit, session_timeout_minutes, reality_check_minutes, is_self_excluded)
VALUES
('ZEN-98241', 5000.00, 25000.00, 60, 30, FALSE);

-- Seed Casino Games Catalog
INSERT INTO casino_games (id, name, category, provider, rtp, volatility, is_playable_demo, integration_type, is_active)
VALUES
('crash-aviator', 'Zenith Aviator Crash', 'crash', 'Zenith Originals (Spribe-Ready)', 97.00, 'High', TRUE, 'playable_demo', TRUE),
('fruit-bonanza-slot', 'Fruit Bonanza 5-Reel', 'slots', 'Zenith Originals (Pragmatic-Ready)', 96.50, 'Medium', TRUE, 'playable_demo', TRUE),
('royal-keno-80', 'Zenith Royal Keno 80', 'keno', 'Zenith Originals', 95.80, 'High', TRUE, 'playable_demo', TRUE),
('european-roulette-vip', 'European Roulette VIP', 'roulette', 'Zenith Table Studios', 97.30, 'Low', TRUE, 'playable_demo', TRUE),
('blackjack-classic', 'Single Deck Blackjack Pro', 'blackjack', 'Zenith Table Studios', 99.50, 'Low', TRUE, 'playable_demo', TRUE),
('baccarat-squeeze', 'Punto Banco Baccarat', 'baccarat', 'Evolution Gaming Adapter', 98.90, 'Low', TRUE, 'playable_demo', TRUE);
