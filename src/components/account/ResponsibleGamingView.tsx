import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeartHandshake, ShieldAlert, Clock, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';

export const ResponsibleGamingView: React.FC = () => {
  const { user, updateUser, currency, showToast } = useApp();

  const [dailyLimit, setDailyLimit] = useState(user.responsibleGaming.dailyDepositLimit);
  const [weeklyLimit, setWeeklyLimit] = useState(user.responsibleGaming.weeklyDepositLimit);
  const [sessionTimeout, setSessionTimeout] = useState(user.responsibleGaming.sessionTimeoutMinutes);
  const [realityCheck, setRealityCheck] = useState(user.responsibleGaming.realityCheckMinutes);
  const [selfExcluded, setSelfExcluded] = useState(user.responsibleGaming.isSelfExcluded);

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      responsibleGaming: {
        dailyDepositLimit: dailyLimit,
        weeklyDepositLimit: weeklyLimit,
        sessionTimeoutMinutes: sessionTimeout,
        realityCheckMinutes: realityCheck,
        isSelfExcluded: selfExcluded,
      },
    });
    showToast('Responsible gaming limits successfully updated and enforced.', 'success');
  };

  const handleSelfExclude = (days: number) => {
    const until = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();
    setSelfExcluded(true);
    updateUser({
      responsibleGaming: {
        ...user.responsibleGaming,
        isSelfExcluded: true,
        selfExclusionUntil: until,
      },
    });
    showToast(`Account self-excluded for ${days} days (Sandbox).`, 'warning');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-[#170E12] via-[#1A1218] to-[#121824] border border-red-500/30 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <HeartHandshake className="w-6 h-6 text-red-400" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Responsible Gaming & Player Protection
          </h1>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          At Zenith Arena, player safety is our highest priority. We provide comprehensive self-service player limits, session reminders, and exclusion protocols to maintain full control over your leisure testing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Limits Form */}
        <div className="p-6 bg-[#0F1420] border border-[#1E2638] rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Deposit & Wagering Caps</span>
          </div>

          <form onSubmit={handleSaveLimits} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">
                Daily Stake Limit ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141B28] border border-[#222E42] rounded-lg py-2 px-3 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Set to 0 for unlimited sandbox testing.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Weekly Deposit Cap ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={weeklyLimit}
                onChange={(e) => setWeeklyLimit(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141B28] border border-[#222E42] rounded-lg py-2 px-3 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Reality Check Frequency (Minutes)
              </label>
              <select
                value={realityCheck}
                onChange={(e) => setRealityCheck(parseInt(e.target.value))}
                className="w-full bg-[#141B28] border border-[#222E42] rounded-lg py-2 px-3 text-white"
              >
                <option value={15}>Every 15 Minutes</option>
                <option value={30}>Every 30 Minutes (Recommended)</option>
                <option value={60}>Every 60 Minutes</option>
                <option value={120}>Every 2 Hours</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Save Protection Limits
            </button>
          </form>
        </div>

        {/* Self-Exclusion & Timeout */}
        <div className="p-6 bg-[#0F1420] border border-[#1E2638] rounded-2xl shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              <span>Take a Break / Self-Exclusion</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              If you feel you need a cooldown period, you can temporarily suspend all sandbox betting and deposits. This action cannot be revoked until the timer elapses.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSelfExclude(1)}
                className="w-full py-2.5 bg-[#141B28] hover:bg-[#1E273A] border border-[#243147] text-slate-200 rounded-lg text-xs font-semibold text-left px-4 flex justify-between items-center transition-colors"
              >
                <span>Cool-off Period (24 Hours)</span>
                <span className="text-slate-500">1 Day</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelfExclude(7)}
                className="w-full py-2.5 bg-[#141B28] hover:bg-[#1E273A] border border-[#243147] text-slate-200 rounded-lg text-xs font-semibold text-left px-4 flex justify-between items-center transition-colors"
              >
                <span>Weekly Time-Out (7 Days)</span>
                <span className="text-slate-500">7 Days</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelfExclude(30)}
                className="w-full py-2.5 bg-[#141B28] hover:bg-[#1E273A] border border-red-500/40 text-red-300 rounded-lg text-xs font-semibold text-left px-4 flex justify-between items-center transition-colors"
              >
                <span>Full Self-Exclusion (30 Days)</span>
                <span className="text-red-400">1 Month</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1C2536] text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Independent Support Resources:</div>
            <div>· Gamblers Anonymous International: <span className="text-emerald-400">gamblersanonymous.org</span></div>
            <div>· Gambling Therapy 24/7 Helpline: <span className="text-emerald-400">gamblingtherapy.org</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
