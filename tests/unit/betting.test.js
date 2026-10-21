import test from 'node:test';
import assert from 'node:assert';

test('Single bet payout calculation', () => {
  const stake = 100;
  const odds = 2.45;
  const potentialPayout = Number((stake * odds).toFixed(2));
  assert.strictEqual(potentialPayout, 245.0);
});

test('Accumulator parlay combined odds calculation', () => {
  const odds = [1.65, 2.10, 1.80];
  const combined = Number(odds.reduce((acc, o) => acc * o, 1).toFixed(2));
  // 1.65 * 2.10 * 1.80 = 6.237 -> 6.24
  assert.strictEqual(combined, 6.24);
  const stake = 50;
  const payout = Number((stake * combined).toFixed(2));
  assert.strictEqual(payout, 312.0);
});

test('Cashout valuation respects margin discount', () => {
  const initialStake = 200;
  const cashout = Number((initialStake * 0.85).toFixed(2));
  assert.strictEqual(cashout, 170.0);
});
