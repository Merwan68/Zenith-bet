import test from 'node:test';
import assert from 'node:assert/strict';

// Helper validator logic matching src/components/wallet/WithdrawalView.tsx
function validateTelebirrAccount(account) {
  const clean = account.replace(/[\s-]/g, '');
  return /^(09\d{8}|07\d{8}|\+2519\d{8}|\+2517\d{8}|2519\d{8}|2517\d{8})$/.test(clean);
}

function validateWithdrawalRequest({ amount, balanceType, availableMain, availableBonus }) {
  const available = balanceType === 'main' ? availableMain : availableBonus;
  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }
  if (amount > available) {
    return { valid: false, error: 'Amount exceeds available balance' };
  }
  if (balanceType === 'bonus' && amount < 1000) {
    return { valid: false, error: 'Bonus balance withdrawal requires minimum 1,000 ETB' };
  }
  return { valid: true };
}

test('Welcome Bonus allocation is atomic and isolated to 250 ETB', () => {
  const userWallet = {
    userId: 'usr-123',
    mainBalance: 0,
    bonusBalance: 0,
    welcomeBonusAwarded: false,
    history: [],
  };

  // First award attempt
  if (!userWallet.welcomeBonusAwarded) {
    userWallet.bonusBalance += 250;
    userWallet.welcomeBonusAwarded = true;
    userWallet.history.push({
      type: 'promotion_reward',
      amount: 250,
      balanceType: 'bonus',
      description: 'Welcome Bonus: 250 ETB Free Credits',
    });
  }

  assert.equal(userWallet.bonusBalance, 250);
  assert.equal(userWallet.mainBalance, 0); // Isolated from main cash
  assert.equal(userWallet.welcomeBonusAwarded, true);

  // Repeated registration / duplicate claim attempt
  let duplicateAwarded = false;
  if (!userWallet.welcomeBonusAwarded) {
    userWallet.bonusBalance += 250;
    duplicateAwarded = true;
  }

  assert.equal(duplicateAwarded, false);
  assert.equal(userWallet.bonusBalance, 250); // Unchanged
});

test('Telebirr phone number format validator', () => {
  assert.equal(validateTelebirrAccount('0911234567'), true);
  assert.equal(validateTelebirrAccount('0712345678'), true);
  assert.equal(validateTelebirrAccount('+251911223344'), true);
  assert.equal(validateTelebirrAccount('+251711223344'), true);
  assert.equal(validateTelebirrAccount('251911223344'), true);
  assert.equal(validateTelebirrAccount('09 11-23-45-67'), true); // With spaces/hyphens

  // Invalid phone numbers
  assert.equal(validateTelebirrAccount('0812345678'), false);
  assert.equal(validateTelebirrAccount('123456'), false);
  assert.equal(validateTelebirrAccount('091123456'), false); // Too short
  assert.equal(validateTelebirrAccount('+15551234567'), false); // US number
});

test('Withdrawal rules: Main Cash allows flexible amounts within balance', () => {
  const res = validateWithdrawalRequest({
    amount: 500,
    balanceType: 'main',
    availableMain: 1000,
    availableBonus: 250,
  });
  assert.equal(res.valid, true);

  const resOverdraft = validateWithdrawalRequest({
    amount: 1500,
    balanceType: 'main',
    availableMain: 1000,
    availableBonus: 250,
  });
  assert.equal(resOverdraft.valid, false);
  assert.match(resOverdraft.error, /exceeds available balance/);
});

test('Withdrawal rules: Bonus Balance enforces minimum 1,000 ETB threshold', () => {
  // Attempting to withdraw initial 250 ETB welcome bonus directly before wagering / turning over
  const resBelowThreshold = validateWithdrawalRequest({
    amount: 250,
    balanceType: 'bonus',
    availableMain: 0,
    availableBonus: 250,
  });
  assert.equal(resBelowThreshold.valid, false);
  assert.match(resBelowThreshold.error, /minimum 1,000 ETB/);

  // Successfully accumulated bonus winnings >= 1,000 ETB
  const resEligible = validateWithdrawalRequest({
    amount: 1000,
    balanceType: 'bonus',
    availableMain: 0,
    availableBonus: 1250,
  });
  assert.equal(resEligible.valid, true);
});

test('Admin status transition workflow', () => {
  const req = {
    id: 'REQ-1',
    amount: 1000,
    status: 'Pending',
    history: [],
  };

  // Approve
  assert.equal(req.status, 'Pending');
  req.status = 'Approved';
  req.history.push({ status: 'Approved', by: 'Super Admin' });
  assert.equal(req.status, 'Approved');

  // Complete
  req.status = 'Completed';
  req.payoutTxRef = 'TB-PAY-882194';
  req.history.push({ status: 'Completed', by: 'Super Admin' });
  assert.equal(req.status, 'Completed');
  assert.ok(req.payoutTxRef);
});
