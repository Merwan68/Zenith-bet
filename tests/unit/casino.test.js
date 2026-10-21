import test from 'node:test';
import assert from 'node:assert';

test('Blackjack hand score calculation with Ace', () => {
  const hand = [
    { rank: 'A', value: 11 },
    { rank: '9', value: 9 },
  ];
  let score = hand.reduce((acc, c) => acc + c.value, 0);
  assert.strictEqual(score, 20);

  // Exceeds 21 with second card -> Ace softens from 11 to 1
  const handWithBust = [
    { rank: 'A', value: 11 },
    { rank: '9', value: 9 },
    { rank: '5', value: 5 },
  ];
  let bustScore = handWithBust.reduce((acc, c) => acc + c.value, 0);
  if (bustScore > 21) {
    bustScore -= 10;
  }
  assert.strictEqual(bustScore, 15);
});

test('Baccarat modulo-10 scoring', () => {
  const cards = [{ value: 8 }, { value: 7 }];
  const score = (cards[0].value + cards[1].value) % 10;
  assert.strictEqual(score, 5);
});

test('Crash game multiplier mathematical floor', () => {
  const rand = 0.5;
  const crash = Math.floor((100 / (100 - rand * 97)) * 100) / 100;
  assert.ok(crash >= 1.0);
  assert.ok(crash < 100.0);
});
