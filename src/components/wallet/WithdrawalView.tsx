import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BalanceType, WithdrawalRequest } from '../../types/wallet';
import {
  ArrowUpRight,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Receipt,
  HelpCircle,
  FileCheck,
  ArrowRight,
  X,
} from 'lucide-react';

export const WithdrawalView: React.FC = () => {
  const {
    mainBalance,
    bonusBalance,
    currency,
    submitWithdrawal,
    withdrawalRequests,
    setCurrentPage,
    showToast,
  } = useApp();

  const [balanceType, setBalanceType] = useState<BalanceType>('main');
  const [amount, setAmount] = useState<string>('500');
  const [telebirrAccount, setTelebirrAccount] = useState<string>('0911234567');
  const [accountHolderName, setAccountHolderName] = useState<string>('Abebe Bikila');

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [latestSubmitted, setLatestSubmitted] = useState<WithdrawalRequest | null>(null);

  const activeAvailableBalance = balanceType === 'main' ? mainBalance : bonusBalance;
  const numAmount = parseFloat(amount) || 0;

  // Validation function
  const validateForm = (): boolean => {
    setValidationError('');

    if (numAmount <= 0) {
      setValidationError('Please enter a valid withdrawal amount.');
      return false;
    }

    if (numAmount > activeAvailableBalance) {
      setValidationError(
        `Withdrawal amount (${numAmount.toLocaleString()} ETB) exceeds available ${
          balanceType === 'main' ? 'Main Cash' : 'Bonus'
        } balance (${activeAvailableBalance.toLocaleString()} ETB).`
      );
      return false;
    }

    // Bonus withdrawal rule: Minimum 1,000 ETB
    if (balanceType === 'bonus' && numAmount < 1000) {
      setValidationError(
        'Minimum withdrawal threshold for promotional Bonus Balance is 1,000.00 ETB according to bonus terms.'
      );
      return false;
    }

    // Validate Ethiopian phone format for Telebirr
    const cleanPhone = telebirrAccount.replace(/\s+/g, '');
    const ethPhoneRegex = /^(?:\+251|0)?[97]\d{8}$/;
    if (!ethPhoneRegex.test(cleanPhone)) {
      setValidationError(
        'Please enter a valid Ethiopian Telebirr account number (e.g. 0911234567 or 0712345678).'
      );
      return false;
    }

    if (!accountHolderName.trim() || accountHolderName.trim().length < 3) {
      setValidationError('Please provide the official Account Holder Name registered with Telebirr.');
      return false;
    }

    return true;
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const created = await submitWithdrawal(
        numAmount,
        balanceType,
        telebirrAccount,
        accountHolderName
      );
      setLatestSubmitted(created);
      setIsConfirmModalOpen(false);
      showToast('Your withdrawal request is pending review.', 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit withdrawal request.';
      setValidationError(msg);
      setIsConfirmModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-emerald-400" />
            <span>Telebirr Payout & Withdrawal Request</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Request an authorized settlement to your verified Telebirr mobile account in Ethiopian Birr.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('wallet')}
          className="px-3.5 py-1.5 rounded-lg bg-[#141B28] hover:bg-[#1A2335] border border-[#222E42] text-xs font-semibold text-slate-300"
        >
          ← Back to Wallet
        </button>
      </div>

      {/* Two Balance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Main Balance Card */}
        <div
          onClick={() => setBalanceType('main')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-lg ${
            balanceType === 'main'
              ? 'bg-[#121B2B] border-emerald-500 shadow-emerald-500/10'
              : 'bg-[#0F1420] border-[#1E2638] opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Main Cash Balance
            </span>
            {balanceType === 'main' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                SELECTED
              </span>
            )}
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-white tabular-nums">
            {mainBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Standard withdrawable funds with immediate processing.
          </p>
        </div>

        {/* Bonus Balance Card */}
        <div
          onClick={() => setBalanceType('bonus')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-lg ${
            balanceType === 'bonus'
              ? 'bg-[#1C1710] border-amber-500 shadow-amber-500/10'
              : 'bg-[#0F1420] border-[#1E2638] opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Promotional Bonus Balance
            </span>
            {balanceType === 'bonus' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">
                SELECTED
              </span>
            )}
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
            {bonusBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Includes 250 ETB Welcome Bonus. Min. withdrawal: 1,000 ETB.
          </p>
        </div>
      </div>

      {/* Success Notification Banner for latest request */}
      {latestSubmitted && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Your withdrawal request is pending review.</span>
          </div>
          <p className="text-slate-300">
            Request Reference: <strong className="font-mono text-white">{latestSubmitted.reference}</strong> for{' '}
            <strong className="text-emerald-400">{latestSubmitted.amount.toLocaleString()} ETB</strong> to Telebirr{' '}
            <strong className="font-mono text-white">{latestSubmitted.telebirrAccount}</strong>.
          </p>
          <div className="text-[11px] text-slate-500 font-mono">
            Status: Pending Review by Operator · Estimated Review Time: ~15 mins.
          </div>
        </div>
      )}

      {/* Main Withdrawal Form */}
      <div className="bg-[#0F1420] border border-[#1E2638] rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleOpenConfirm} className="space-y-5 text-xs">
          {/* Validation Error banner */}
          {validationError && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Source Balance Selector */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Source Balance Account
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBalanceType('main')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  balanceType === 'main'
                    ? 'bg-emerald-500/15 border-emerald-400 text-white font-bold'
                    : 'bg-[#141B28] border-[#222E42] text-slate-400 hover:text-white'
                }`}
              >
                <div>Main Balance</div>
                <div className="font-mono text-xs text-emerald-400">
                  {mainBalance.toLocaleString()} ETB Available
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBalanceType('bonus')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  balanceType === 'bonus'
                    ? 'bg-amber-500/15 border-amber-400 text-white font-bold'
                    : 'bg-[#141B28] border-[#222E42] text-slate-400 hover:text-white'
                }`}
              >
                <div>Bonus Balance</div>
                <div className="font-mono text-xs text-amber-400">
                  {bonusBalance.toLocaleString()} ETB Available (Min: 1,000 ETB)
                </div>
              </button>
            </div>
          </div>

          {/* Amount input with quick presets */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-slate-300 font-medium">Withdrawal Amount (ETB)</label>
              <span className="text-[11px] text-slate-400">
                Available: {activeAvailableBalance.toLocaleString()} ETB
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2">
              {[500, 1000, 2500, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className={`py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors ${
                    numAmount === val
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : 'bg-[#141B28] text-slate-300 border-[#222E42] hover:bg-[#1A2335]'
                  }`}
                >
                  {val} ETB
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="number"
                min="10"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#131A26] border border-[#222E42] rounded-xl py-3 px-3 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setAmount(activeAvailableBalance.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400 hover:underline uppercase"
              >
                Max
              </button>
            </div>
          </div>

          {/* Telebirr Mobile Account Number */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Telebirr Account Number (Mobile MSISDN)
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="09XXXXXXXX or 07XXXXXXXX"
                value={telebirrAccount}
                onChange={(e) => setTelebirrAccount(e.target.value)}
                className="w-full bg-[#131A26] border border-[#222E42] rounded-xl py-2.5 pl-9 pr-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Authorized Ethiopian mobile number format (e.g. 0911234567, 0712345678, or +251...).
            </span>
          </div>

          {/* Account Holder Full Name */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Account Holder Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Abebe Bikila"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className="w-full bg-[#131A26] border border-[#222E42] rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-emerald-500"
              required
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Must match the official identity name registered on your Telebirr account.
            </span>
          </div>

          {/* Regulatory Statement */}
          <div className="p-3 bg-[#0A0D15] rounded-xl border border-[#1A2233] text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consumer Protection Policy</span>
            </div>
            <p>
              Zenith Arena never requires transfers to personal telephone numbers or charges unannounced withdrawal fees. All payouts are processed directly through authorized payment provider channels.
            </p>
          </div>

          {/* Submit Button -> opens Confirmation Dialog */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Withdrawal Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Confirmation Screen Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1420] border-2 border-emerald-500/40 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-4 bg-[#0A0E16] border-b border-[#1A2233] flex justify-between items-center text-xs">
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Confirm Telebirr Withdrawal Request</span>
              </h3>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-300 text-xs">
                Please verify the payout destination details before submitting your request for review:
              </p>

              <div className="p-4 bg-[#0B0E16] rounded-xl border border-[#1E2638] space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Requested Amount:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {numAmount.toLocaleString()} ETB
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Source Balance:</span>
                  <span className="text-white capitalize font-semibold">{balanceType} Balance</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Destination:</span>
                  <span className="text-white font-bold">{telebirrAccount} (Telebirr)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Account Holder:</span>
                  <span className="text-white">{accountHolderName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Processing Fee:</span>
                  <span className="text-emerald-400">0.00 ETB (Free)</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                Initial Status will be set to <strong>Pending</strong>. You can monitor review status in your Transaction History.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#141B28] hover:bg-[#1A2335] text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleFinalSubmit}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Withdrawal Requests History Table */}
      <div className="bg-[#0F1420] border border-[#1E2638] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#0A0D15] border-b border-[#1A2233] flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Your Withdrawal Requests</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {withdrawalRequests.length} Total Requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A10] border-b border-[#171F2E] text-slate-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Balance Type</th>
                <th className="py-3 px-4">Telebirr Account</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171F2E]">
              {withdrawalRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No withdrawal requests submitted yet.
                  </td>
                </tr>
              ) : (
                withdrawalRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#121824] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">{req.reference}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                      {req.amount.toLocaleString()} ETB
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-300 font-mono">
                      {req.balanceType}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{req.telebirrAccount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          req.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'Approved'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : req.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(req.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
