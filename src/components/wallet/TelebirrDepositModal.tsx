import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  X,
  Clock,
  CheckCircle2,
  Receipt,
  FileCheck,
} from 'lucide-react';

export const TelebirrDepositModal: React.FC = () => {
  const {
    isDepositModalOpen,
    setIsDepositModalOpen,
    cashierTelebirrPhone,
    cashierTelebirrName,
    submitDepositRequest,
    depositRequests,
    user,
    currency,
    showToast,
  } = useApp();

  const [amount, setAmount] = useState<string>('500');
  const [senderPhone, setSenderPhone] = useState<string>('0911234567');
  const [transactionCode, setTransactionCode] = useState<string>('');
  const [bonusApplied, setBonusApplied] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activeStep, setActiveStep] = useState<'instructions' | 'submit' | 'history'>('submit');

  if (!isDepositModalOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(cashierTelebirrPhone);
    setCopied(true);
    showToast(`Copied Telebirr Number: ${cashierTelebirrPhone}`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePresetAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numAmount = parseFloat(amount) || 0;
    if (numAmount < 10) {
      setErrorMsg('Minimum deposit amount is 10 ETB / Br.');
      return;
    }

    const cleanSender = senderPhone.replace(/[\s-]/g, '');
    if (!/^(09\d{8}|07\d{8}|\+2519\d{8}|\+2517\d{8})$/.test(cleanSender)) {
      setErrorMsg('Please enter a valid Ethiopian Telebirr phone number (e.g. 0911234567 or 0712345678).');
      return;
    }

    if (!transactionCode.trim() || transactionCode.trim().length < 5) {
      setErrorMsg('Please enter the Telebirr confirmation code from your transfer SMS (e.g. CIC928B10 or TB82910).');
      return;
    }

    setSubmitting(true);
    try {
      await submitDepositRequest(numAmount, cleanSender, transactionCode.trim(), bonusApplied);
      setTransactionCode('');
      setActiveStep('history');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit deposit.');
    } finally {
      setSubmitting(false);
    }
  };

  const userDeposits = depositRequests.filter(
    (d) => d.userId === user.id || d.userEmail === user.email
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-[#0B0F17] border border-[#1E2638] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-auto">
        {/* Top Header with Telebirr Brand Styling */}
        <div className="bg-gradient-to-r from-[#005BAC] via-[#0070BA] to-[#00A859] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#005BAC] flex items-center justify-center shadow-lg font-black text-sm">
              <Smartphone className="w-6 h-6 text-[#0070BA]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                <span>Direct Personal Deposit</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Deposit to Official Telebirr Account
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsDepositModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation inside modal */}
        <div className="flex border-b border-[#1E2638] bg-[#0E1422] p-1 text-xs">
          <button
            onClick={() => setActiveStep('submit')}
            className={`flex-1 py-2 font-bold rounded-lg transition-colors text-center ${
              activeStep === 'submit'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Send & Submit Code
          </button>
          <button
            onClick={() => setActiveStep('instructions')}
            className={`flex-1 py-2 font-bold rounded-lg transition-colors text-center ${
              activeStep === 'instructions'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. USSD & App Guide
          </button>
          <button
            onClick={() => setActiveStep('history')}
            className={`flex-1 py-2 font-bold rounded-lg transition-colors text-center relative ${
              activeStep === 'history'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Deposit Proofs ({userDeposits.length})
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Real-Money Casino Bonus Callout */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-500/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center shrink-0 font-black shadow-md shadow-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-tight">
                100% Real-Money Deposit Match Bonus
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                Deposit money into the cashier Telebirr account to receive an instant <strong className="text-white">100% Match Bonus</strong> up to <strong className="text-amber-400">1,000 Br</strong> credited into your Bonus Balance!
              </p>
            </div>
          </div>

          {activeStep === 'submit' && (
            <div className="space-y-4">
              {/* Cashier Account Details Card with 1-Click Copy */}
              <div className="p-4 rounded-xl bg-[#131A26] border border-[#222E42] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Receiver Telebirr Account:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    OFFICIAL CASHIER
                  </span>
                </div>

                {/* Big Phone Number with Copy Button */}
                <div className="flex items-center justify-between gap-2 p-2.5 bg-[#0B0F17] rounded-lg border border-[#1E2638]">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Send Money To</span>
                    <span className="text-lg sm:text-xl font-black font-mono text-emerald-400 tracking-wider">
                      {cashierTelebirrPhone}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPhone}
                    className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                      copied
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#1E2638] hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-300 pt-1">
                  <span className="text-slate-400">Account Holder:</span>
                  <span className="font-bold text-white uppercase">{cashierTelebirrName}</span>
                </div>
              </div>

              {/* Deposit Proof Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Amount presets */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Deposit Amount ({currency} / Birr)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2">
                    {[50, 100, 250, 500, 1000, 2000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetAmount(val)}
                        className={`py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                          amount === val.toString()
                            ? 'bg-emerald-500 text-black shadow-sm'
                            : 'bg-[#131A26] border border-[#222E42] text-slate-300 hover:text-white'
                        }`}
                      >
                        {val} Br
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="10"
                    placeholder="Enter deposit amount..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#131A26] border border-[#222E42] rounded-lg p-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Sender Phone Number */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Your Telebirr Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="0911234567"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full bg-[#131A26] border border-[#222E42] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    The mobile number you used to send money to the cashier.
                  </span>
                </div>

                {/* Transaction Code */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                    <span>Telebirr Transaction Confirmation Code (from SMS)</span>
                    <span className="text-emerald-400 text-[10px] font-mono">e.g. CIC982B10</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CIC928B10 or TB829104"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    className="w-full bg-[#131A26] border border-[#222E42] rounded-lg p-2.5 text-white font-mono uppercase tracking-wider focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Copy the transaction code from your Telebirr confirmation SMS.
                  </span>
                </div>

                {/* Bonus Toggle */}
                <label className="flex items-center gap-2 p-3 bg-[#131A26] rounded-xl border border-[#222E42] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bonusApplied}
                    onChange={(e) => setBonusApplied(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-[#0B0F17] border-slate-700"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Apply 100% First Deposit Match Bonus</span>
                    <span className="text-[11px] text-slate-400">
                      Eligible across all Sportsbook markets and Casino games (Aviator, Fruit Slots, Keno).
                    </span>
                  </div>
                </label>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Proof...</span>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      <span>Confirm Deposit & Notify Cashier</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Instructions Step */}
          {activeStep === 'instructions' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 bg-[#131A26] rounded-xl border border-[#222E42] space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Method 1: Telebirr USSD (*127#)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <li>Dial <strong className="text-white font-mono">*127#</strong> on your phone.</li>
                  <li>Select Option <strong className="text-white">1 (Send Money)</strong> or <strong className="text-white">ገንዘብ ላክ</strong>.</li>
                  <li>Enter the Cashier Phone Number: <strong className="text-emerald-400 font-mono">{cashierTelebirrPhone}</strong>.</li>
                  <li>Enter your deposit amount (e.g. 500 Br).</li>
                  <li>Confirm recipient name: <strong className="text-white uppercase">{cashierTelebirrName}</strong>.</li>
                  <li>Enter your 4-digit PIN to confirm payment.</li>
                  <li>Receive the SMS from Telebirr and copy the <strong className="text-amber-400">Transaction ID</strong>.</li>
                </ol>
              </div>

              <div className="p-4 bg-[#131A26] rounded-xl border border-[#222E42] space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Method 2: Telebirr SuperApp</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <li>Open the official Telebirr App on your phone.</li>
                  <li>Tap <strong className="text-white">Transfer</strong> or <strong className="text-white">Send Money</strong>.</li>
                  <li>Paste cashier number: <strong className="text-emerald-400 font-mono">{cashierTelebirrPhone}</strong>.</li>
                  <li>Enter the amount and complete fingerprint or PIN verification.</li>
                  <li>Copy the Transaction Reference from the receipt screen and paste it in tab 1.</li>
                </ol>
              </div>

              <button
                onClick={() => setActiveStep('submit')}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors text-center"
              >
                Go to Submit Code →
              </button>
            </div>
          )}

          {/* History Step */}
          {activeStep === 'history' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-white">Your Submitted Telebirr Deposits</span>
                <span className="text-[11px] font-mono">{userDeposits.length} record(s)</span>
              </div>

              {userDeposits.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-[#131A26] rounded-xl border border-[#1E2638]">
                  No deposits submitted yet. Complete a transfer to the cashier to credit your account!
                </div>
              ) : (
                <div className="space-y-2">
                  {userDeposits.map((dep) => (
                    <div
                      key={dep.id}
                      className="p-3 bg-[#131A26] border border-[#222E42] rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">
                            {dep.amount.toLocaleString()} Br
                          </span>
                          {dep.bonusApplied && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-300 font-bold">
                              +100% Bonus
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Tx Code: <strong className="text-slate-200">{dep.transactionCode}</strong> · From: {dep.senderPhone}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          {new Date(dep.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        {dep.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                            <Clock className="w-3 h-3" /> Verifying Code
                          </span>
                        )}
                        {dep.status === 'Approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Credited
                          </span>
                        )}
                        {dep.status === 'Rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            Verification Failed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setActiveStep('submit')}
                className="w-full mt-3 py-2 bg-[#1E2638] hover:bg-[#2A354C] text-slate-200 font-bold rounded-lg text-center"
              >
                + Submit Another Deposit Proof
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
