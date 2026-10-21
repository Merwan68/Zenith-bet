import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TelebirrModal } from './TelebirrModal';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Receipt,
  Sparkles,
  Info,
  Gift,
  HelpCircle,
  Coins,
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const {
    currency,
    setCurrency,
    mainBalance,
    bonusBalance,
    balanceUSD,
    depositFunds,
    setCurrentPage,
    transactions,
    showToast,
  } = useApp();

  const [activeDepositTab, setActiveDepositTab] = useState<'telebirr' | 'card' | 'crypto'>('telebirr');
  const [isTelebirrOpen, setIsTelebirrOpen] = useState(false);
  const [cardDepositAmount, setCardDepositAmount] = useState<string>('500');

  // Segregated transactions
  const mainTransactions = transactions.filter((t) => t.balanceType !== 'bonus');
  const bonusTransactions = transactions.filter((t) => t.balanceType === 'bonus');

  const handleCardDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(cardDepositAmount);
    if (val > 0) {
      depositFunds(val, 'Bank Card Demo', `CARD-${Date.now()}`);
      showToast(`Mock Card Deposit of ${val} ${currency} completed`, 'success');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Wallet Header & Currency Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span>Dual-Account Wallet & Financial Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Main Cash and Promotional Bonus funds are maintained in separate, secure ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct CTA to Withdrawal */}
          <button
            onClick={() => setCurrentPage('withdraw')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw to Telebirr</span>
          </button>
        </div>
      </div>

      {/* 2 Separate Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Main Balance */}
        <div className="p-6 bg-gradient-to-br from-[#121B2B] via-[#0E1522] to-[#121B2B] border-2 border-[#1E2E48] rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ETB
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">Main Balance (Cash)</h2>
                  <span className="text-[10px] text-emerald-400 font-mono">Unrestricted · Immediately Withdrawable</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                CASH
              </span>
            </div>

            <div className="font-mono text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight my-2">
              {mainBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-emerald-400 text-xl">ETB</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 mt-4 pt-4 border-t border-[#1C2536]">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Balance:</span>
                <span className="font-mono font-bold text-white">{mainBalance.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Available to Withdraw:</span>
                <span className="font-mono font-bold text-emerald-400">{mainBalance.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deposit Methods:</span>
                <span>Telebirr, Card, Crypto</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1C2536] flex gap-2">
            <button
              onClick={() => setIsTelebirrOpen(true)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" /> Deposit ETB
            </button>
            <button
              onClick={() => setCurrentPage('withdraw')}
              className="flex-1 py-2.5 rounded-xl bg-[#172233] hover:bg-[#1E2B40] text-emerald-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-4 h-4" /> Withdraw
            </button>
          </div>
        </div>

        {/* Card 2: Bonus Balance */}
        <div className="p-6 bg-gradient-to-br from-[#1C160E] via-[#15120B] to-[#1C160E] border-2 border-amber-500/40 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">Bonus Balance</h2>
                  <span className="text-[10px] text-amber-400 font-mono">Promotional · 250 ETB Welcome Bonus</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                BONUS
              </span>
            </div>

            <div className="font-mono text-3xl sm:text-4xl font-black text-amber-300 tabular-nums tracking-tight my-2">
              {bonusBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-amber-400 text-xl">ETB</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 mt-4 pt-4 border-t border-[#292215]">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Bonus:</span>
                <span className="font-mono font-bold text-amber-300">{bonusBalance.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min. Withdrawal Threshold:</span>
                <span className="font-mono font-bold text-white">1,000.00 ETB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Wagering Eligibility:</span>
                <span className="text-emerald-400 font-medium">All Sportsbook & Casino</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#292215]">
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Bonus balance is used to place real-odds wagers across Aviator Crash, slots, and football accumulators. Payouts from bonus bets qualify towards the 1,000 ETB minimum withdrawal threshold.
            </p>
            <button
              onClick={() => setCurrentPage('sports')}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-colors text-center"
            >
              Wager Bonus Credits
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Options Strip */}
      <div className="p-6 bg-[#0F1420] border border-[#1E2638] rounded-2xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Instant Deposit Gateway</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setIsTelebirrOpen(true)}
            className="p-4 rounded-xl bg-[#141B28] hover:bg-[#1A2335] border border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white text-xs">Telebirr Mobile Money</div>
              <div className="text-[11px] text-slate-400">Direct Pay · Instant USSD Push</div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              Deposit →
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#141B28] border border-[#1E2638] flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-xs">Visa / Mastercard</div>
              <div className="text-[11px] text-slate-400">Bank Debit / Credit Card</div>
            </div>
            <button
              onClick={() => {
                depositFunds(500, 'Bank Card Demo', `CARD-${Date.now()}`);
                showToast('Card Demo Deposit of 500 ETB complete', 'success');
              }}
              className="px-2 py-1 rounded bg-[#1C2538] text-slate-300 hover:text-white text-xs font-bold"
            >
              +500 ETB
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#141B28] border border-[#1E2638] flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-xs">Crypto (USDT)</div>
              <div className="text-[11px] text-slate-400">TRC-20 Sandbox Payment</div>
            </div>
            <button
              onClick={() => {
                depositFunds(1000, 'Crypto Sandbox', `CRYPTO-${Date.now()}`);
                showToast('Crypto Sandbox Deposit of 1,000 ETB complete', 'success');
              }}
              className="px-2 py-1 rounded bg-[#1C2538] text-amber-300 hover:text-white text-xs font-bold"
            >
              +1,000 ETB
            </button>
          </div>
        </div>
      </div>

      {/* Segregated Recent Transactions Ledger */}
      <div className="bg-[#0F1420] border border-[#1E2638] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#0A0D15] border-b border-[#1A2233] flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Recent Wallet Transactions</span>
          </h3>
          <button
            onClick={() => setCurrentPage('transactions')}
            className="text-xs text-emerald-400 hover:underline"
          >
            View Full Statement & CSV Export →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070A10] border-b border-[#171F2E] text-slate-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Balance Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171F2E]">
              {transactions.slice(0, 6).map((tx) => (
                <tr key={tx.id} className="hover:bg-[#121824] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{tx.description}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tx.reference}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        tx.balanceType === 'bonus'
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {tx.balanceType || 'main'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold tabular-nums">
                    <span
                      className={
                        tx.type === 'deposit' || tx.type === 'promotion_reward' || tx.type === 'bet_payout'
                          ? 'text-emerald-400'
                          : 'text-slate-300'
                      }
                    >
                      {tx.type === 'deposit' || tx.type === 'promotion_reward' || tx.type === 'bet_payout'
                        ? '+'
                        : '-'}
                      {tx.amount.toLocaleString()} {tx.currency}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        tx.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(tx.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TelebirrModal
        isOpen={isTelebirrOpen}
        onClose={() => setIsTelebirrOpen(false)}
        defaultAmount={1000}
      />
    </div>
  );
};
