# Database Architecture & Management

## Relational Schema (PostgreSQL)

Zenith Arena's schema is located in `database/schema.sql` and includes the following primary relational tables:

1. `users`: Identity, authentication credentials, VIP tier status, preferred odds format, and language.
2. `responsible_gaming_limits`: Player safety constraints, deposit caps, session timeouts, and self-exclusion timestamps.
3. `wallets`: Dual-currency support (`ETB` and `USD`) with database-level non-negative balance checks (`CHECK (balance >= 0)`).
4. `wallet_transactions`: Ledger entries tracking deposits, withdrawals, bet placements, and payouts with unique transaction references.
5. `sports_events`: Sports fixtures, live match time, status, provider metadata, and scoreboards.
6. `sports_markets` & `market_selections`: Multi-market hierarchies (1X2, Asian Handicap, Over/Under, Both Teams to Score).
7. `placed_bets` & `bet_selections_map`: Stores user tickets, accumulator selections, potential payouts, and cashout values.
8. `casino_games` & `casino_game_rounds`: Tracks game metadata, RTP percentages, client/server seeds, and multiplier results.
9. `audit_logs`: Immutable audit trail of administrative modifications and security events.

## Migrations & Seeding

- Schema DDL: `database/schema.sql`
- Seed Script: `database/seed.sql`

To execute manually via psql:
```bash
psql -U zenith_admin -d zenith_db -f database/schema.sql
psql -U zenith_admin -d zenith_db -f database/seed.sql
```
