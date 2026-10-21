import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { audio } from '../../services/audioService';
import { Gift, RotateCw, Award, Sparkles, Check, ArrowRight, Star } from 'lucide-react';

export const PromotionsView: React.FC = () => {
  const { user, currency, depositFunds, showToast } = useApp();
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<number | null>(null);
  const [claimedDaily, setClaimedDaily] = useState(false);

  const wheelPrizes = [500, 1000, 2500, 5000, 10000, 250];

  const spinDailyWheel = () => {
    if (wheelSpinning || claimedDaily) return;
    setWheelSpinning(true);
    audio.playClick();

    let count = 0;
    const interval = setInterval(() => {
      audio.playTick();
      count++;
      setWheelResult(wheelPrizes[Math.floor(Math.random() * wheelPrizes.length)]);
      if (count >= 15) {
        clearInterval(interval);
        const wonAmount = wheelPrizes[Math.floor(Math.random() * wheelPrizes.length)];
        setWheelResult(wonAmount);
        setWheelSpinning(false);
        setClaimedDaily(true);
        depositFunds(wonAmount, 'Internal Ledger', `DAILY-WHEEL-${Date.now()}`);
        audio.playWinChime();
        showToast(`Congratulations! You won ${wonAmount.toLocaleString()} ${currency} Demo Credits!`, 'success');
      }
    }, 120);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#17142A] via-[#101E2E] to-[#0D241E] border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> 200% SANDBOX WELCOME BONUS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
            Boost Your Testing Experience with Zenith VIP Rewards
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            All registered sandbox accounts qualify for daily practice rewards, tiered VIP cashback, and multi-bet parlay boosts. Practice credits are non-monetary.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                depositFunds(10000, 'Internal Ledger', `WELCOME-BONUS-${Date.now()}`);
                showToast('200% Welcome Demo Bonus Credited (+10,000 ETB)!', 'success');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              Claim +10,000 Demo Bonus
            </button>
          </div>
        </div>
      </div>

      {/* Daily Lucky Spin Wheel Section */}
      <div className="p-6 bg-[#0F1420] border border-[#1E2638] rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Gift className="w-4 h-4" />
            <span>Daily Wheel of Fortune</span>
          </div>
          <h2 className="text-lg font-bold text-white">Spin for Free Daily Sandbox Credits</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Return every 24 hours to spin the Zenith wheel and unlock up to 10,000 in virtual credits to test high-roller sportsbook markets and casino originals.
          </p>
          <div className="text-[11px] text-slate-500 font-mono">
            {claimedDaily ? '✓ Claimed for today. Resets at midnight UTC.' : 'Available to spin now!'}
          </div>
        </div>

        {/* Wheel Display & Button */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-36 h-36 rounded-full border-4 border-amber-500/40 bg-gradient-to-br from-[#121A28] to-[#0A0E17] flex items-center justify-center relative shadow-2xl">
            <div
              className={`absolute inset-1 rounded-full border-2 border-dashed border-amber-400/40 ${
                wheelSpinning ? 'animate-spin' : ''
              }`}
            />
            <div className="text-center z-10">
              <span className="text-[10px] text-slate-400 block font-mono">PRIZE</span>
              <span className="font-mono text-xl font-black text-amber-300 tabular-nums">
                {wheelResult ? `${wheelResult.toLocaleString()}` : '5,000'}
              </span>
              <span className="text-[9px] text-slate-400 block">{currency}</span>
            </div>
          </div>

          <button
            disabled={wheelSpinning || claimedDaily}
            onClick={spinDailyWheel}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow disabled:opacity-40 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${wheelSpinning ? 'animate-spin' : ''}`} />
            <span>{wheelSpinning ? 'Spinning...' : claimedDaily ? 'Claimed' : 'Spin Wheel'}</span>
          </button>
        </div>
      </div>

      {/* VIP Loyalty Tiers Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>VIP Loyalty Program & Benefits</span>
          </h2>
          <p className="text-xs text-slate-400">
            Current Tier: <strong className="text-amber-400">{user.vipLevel}</strong> · Experience:{' '}
            <span className="font-mono">{user.vipPoints.toLocaleString()} / {user.vipNextLevelPoints.toLocaleString()} XP</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Bronze', xp: '0 - 1,000 XP', perk: '5% Weekly Cashback', active: false },
            { name: 'Silver', xp: '1,000 - 5,000 XP', perk: '8% Weekly Cashback + Daily Wheel', active: false },
            { name: 'Gold', xp: '5,000 - 10,000 XP', perk: '12% Cashback + Dedicated Host', active: true },
            { name: 'Platinum', xp: '10,000+ XP', perk: '15% Cashback + Instant Cashouts', active: false },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                tier.active
                  ? 'bg-[#151F30] border-amber-400/60 shadow-lg shadow-amber-500/10'
                  : 'bg-[#0F1420] border-[#1E2638]'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-white text-sm">{tier.name} Tier</h3>
                  {tier.active && (
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                      CURRENT
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mb-3">{tier.xp}</div>
                <p className="text-xs text-slate-300">{tier.perk}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1C2536] text-[10px] text-slate-500 font-mono">
                Level Multiplier: 1.0x - 2.5x
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
