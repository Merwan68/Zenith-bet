# Testing & Quality Assurance Guide

## Test Suite Execution

The repository includes automated unit tests powered by Node.js native test runner (`node --test`).

```bash
# Run all automated tests
npm test

# Run TypeScript compilation & linting checks
npm run lint

# Run production build test
npm run build
```

## Coverage Scope

1. **Betting Mathematics (`tests/unit/betting.test.js`)**:
   - Single wager payout computation.
   - Accumulator / parlay multiplied odds compounding.
   - Early cashout margin valuation.

2. **Casino Game Rules (`tests/unit/casino.test.js`)**:
   - Single Deck Blackjack Ace dual valuation (11 vs 1) and bust protection.
   - Baccarat modulo-10 scoring rules.
   - Crash game multiplier mathematical lower bounds.

3. **End-to-End Sandbox Testing**:
   - Telebirr deposit initiation, simulated USSD push alert, and balance crediting.
   - Live in-play odds shifts and color flash animations.
   - Language switching and RTL orientation for Arabic.
