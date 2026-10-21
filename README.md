# Zenith Arena — Premium Sportsbook & Online Casino Platform

[![CI](https://github.com/zenith-arena/platform/actions/workflows/ci.yml/badge.svg)](https://github.com/zenith-arena/platform)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)

**Zenith Arena** is an enterprise-grade, international sports betting and online casino web application designed with deep charcoal and emerald luxury aesthetics, high-velocity in-play odds feeds, interactive playable casino originals, sandbox payment adapters, and a comprehensive administration console.

> **SANDBOX NOTICE:** All odds, wagers, winnings, and balances within this environment represent virtual demo credits for evaluation, development, and integration testing. No real-money gambling or currency transfers are conducted.

---

## Key Features

### 1. International Sportsbook
- **Comprehensive Sports Coverage**: Football (Premier League, Champions League, Ethiopian Premier League), Basketball (NBA), Tennis (Wimbledon Grand Slams), Volleyball (FIVB), and Esports (CS2, Dota 2).
- **Markets Matrix**: 1X2 Match Winner, Asian Handicaps, Over/Under Totals, Both Teams to Score, and Period Winner.
- **Dynamic Odds Engine**: Real-time odds flash animations (▲ emerald / ▼ red) and in-play match tracker with 2D pitch animations.
- **Docked Bet Slip**: Supports Single and Multi/Accumulator (parlay) bets, dynamic multiplier calculations, preset stake chips, and simulated Early Cash Out.

### 2. Certified Playable Casino Originals
- **Zenith Aviator Crash**: Real-time HTML5 Canvas trajectory rocket flight with exponential multiplier curve, auto-cashout, and provably fair SHA-256 verification.
- **Fruit Bonanza 5-Reel Slot**: Retro Vegas fruit machine with 10 paylines, staggered reel stops, and Web Audio API sound synthesis.
- **Zenith Royal Keno 80**: 80-ball lottery system with 1-to-10 selection, quick-pick generator, and 20-ball draw animation.
- **European Roulette VIP**: Single-zero 37-pocket roulette table with animated wheel deceleration, inside/outside bets, and past number history.
- **Card Table Studios**: Single Deck Blackjack Pro (dealer stands on 17, 3:2 natural blackjack, split, double down) and Punto Banco Baccarat with automated third-card tableau rules.

### 3. Telebirr Sandbox Payment Gateway
- **Ethio Telecom Telebirr Integration**: Step-by-step sandbox flow simulating mobile number validation, USSD push notifications, and automated transaction reference callbacks (`TB-ETB-2026-XXXXX`).
- **Dedicated Telebirr Withdrawal System**: Payout interface with Ethiopian phone validation (`09...`, `07...`, `+251`), dual-source selection (Main Cash vs. Promotional Bonus), 1,000 ETB minimum bonus threshold rule, confirmation modal with summary review, and unique request reference generation (`REQ-TB-XXXXX`).
- **Dual-Balance Wallet Architecture**: Segregated Main Cash and Bonus Balance ledgers preventing balance manipulation, with CSV transaction ledger export.

### 4. Firebase Authentication & 250 ETB Welcome Bonus
- **Official Firebase SDK Integration**: Email/password authentication, registration, persistent session management, password reset dispatch, and Google OAuth.
- **Atomic 250 ETB Welcome Bonus**: Awarded once per eligible new account via Firestore transactions (`welcomeBonusAwarded: true`), isolated to the Bonus ledger with celebration modal.
- **Cloud Firestore Profiles & ABAC**: Structured user document storage with strict Firestore Security Rules protecting user balances and audit trails.

### 5. Enterprise Administration Console & Payout Management
- **Telebirr Withdrawals Management Queue**: Filter and review withdrawal requests by status (Pending, Approved, Completed, Rejected), authorize payouts, and refund rejected claims with audit notes.
- **Role-Based Access Control (RBAC)**: Switch between Super Admin, Content Manager, Game Manager, and Support Agent roles.
- **Event & Odds Manager**: Create custom in-play fixtures, adjust live scores, and settle markets.
- **Game Catalog & RTP Governance**: Inspect RTP percentages and toggle game availability or maintenance modes.
- **Provider Adapter Health Monitoring**: Real-time telemetry for Sportradar, Betradar, Spribe, Pragmatic Play, and Telebirr endpoints.
- **Audit Logging**: Stream of platform events for security and compliance audits.

### 6. Multi-Language & RTL Localization
- Full support for **English**, **Amharic (አማርኛ)** with authentic Ethiopic typography, and **Arabic (العربية)** with automatic right-to-left (`dir="rtl"`) layout orientation.

---

## Architecture Overview

```
zenith-arena/
├── database/                # PostgreSQL relational DDL schema & seed files
│   ├── schema.sql
│   └── seed.sql
├── docs/                    # Architectural & integration specifications
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── PROVIDERS.md
│   ├── SETUP.md
│   └── TESTING.md
├── src/
│   ├── assets/images/       # Photorealistic generated assets
│   ├── components/
│   │   ├── account/         # User profile, KYC, Responsible Gaming
│   │   ├── admin/           # Operator console & audit logs
│   │   ├── casino/          # Casino lobby, game modals & 5 playable engines
│   │   ├── common/          # 3-Zone Header, 20-route Navigation, Footer, Toast
│   │   ├── help/            # FAQs & simulated 24/7 support chat
│   │   ├── promotions/      # Welcome bonus, Daily Wheel, VIP tiers, Leaderboards
│   │   ├── sportsbook/      # MatchCard, LiveTracker, BetSlipDrawer, SportsbookView
│   │   └── wallet/          # WalletView, TelebirrModal, TransactionHistoryView
│   ├── context/             # AppContext centralized state management
│   ├── data/                # Mock sports, casino catalog & i18n translations
│   ├── services/            # Provider adapters, Web Audio API, Telebirr sandbox
│   ├── types/               # TypeScript domain interfaces
│   ├── App.tsx              # Main orchestrator
│   └── main.tsx
├── tests/unit/              # Node.js native unit tests
├── .github/workflows/ci.yml # GitHub Actions automated pipeline
├── docker-compose.yml       # Production/Staging container definition
├── Dockerfile               # Multi-stage optimized Node.js container
├── server.ts                # Express backend with Vite middleware & REST APIs
└── package.json
```

---

## Quick Start & Local Development

### Prerequisites
- Node.js 22.x or later
- npm 10.x or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/zenith-arena.git
cd zenith-arena

# 2. Install dependencies
npm install

# 3. Start local development server (Express + Vite)
npm run dev
```

Visit `http://localhost:3000` to interact with the platform.

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Docker Deployment

```bash
docker compose up -d --build
```

---

## Responsible Gaming

Zenith Arena provides full compliance tools:
- Self-Exclusion timers (24h, 7 days, 30 days)
- Daily and weekly stake limits
- Session reality check intervals (15 to 120 minutes)
- Direct links to international helplines (Gamblers Anonymous, Gambling Therapy)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
