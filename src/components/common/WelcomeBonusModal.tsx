import React from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, Sparkles, Check, ArrowRight, ShieldCheck, X } from 'lucide-react';

export const WelcomeBonusModal: React.FC = () => {
  const { showWelcomeBonusModal, setShowWelcomeBonusModal, setCurrentPage, bonusBalance } = useApp();

  if (!showWelcomeBonusModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0F1420] border-2 border-amber-500/50 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setShowWelcomeBonusModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1E2638] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 animate-bounce">
            <Gift className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Bonus Credited
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              250 ETB Free Welcome Bonus!
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              Your new Zenith Arena account has been verified. We have credited your separate{' '}
              <strong className="text-amber-400">Bonus Balance</strong> with{' '}
              <strong className="text-white">250.00 ETB</strong>.
            </p>
          </div>

          {/* Bonus details card */}
          <div className="p-4 bg-[#0B0E16] rounded-xl border border-[#1E2638] text-left text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span>Bonus Amount:</span>
              <span className="font-mono font-black text-amber-400 text-sm">250.00 ETB</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Account Credited:</span>
              <span className="font-mono text-emerald-400">Bonus Ledger (Isolated)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Min. Withdrawal Threshold:</span>
              <span className="font-mono text-white">1,000.00 ETB</span>
            </div>
            <div className="pt-2 border-t border-[#192233] text-[11px] text-slate-500 leading-snug">
              ✓ Eligible across all sportsbook markets and playable casino originals (Aviator Crash, Fruit Slots, Keno, Roulette).
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                setShowWelcomeBonusModal(false);
                setCurrentPage('wallet');
              }}
              className="flex-1 py-3 bg-[#172030] hover:bg-[#1E293B] border border-[#243147] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              View in Wallet
            </button>
            <button
              onClick={() => {
                setShowWelcomeBonusModal(false);
                setCurrentPage('sports');
              }}
              className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Start Wagering</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
