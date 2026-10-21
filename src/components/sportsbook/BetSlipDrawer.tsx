import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, ArrowRight, ShieldCheck, CheckCircle2, History, SlidersHorizontal } from 'lucide-react';

export const BetSlipDrawer: React.FC = () => {
  const {
    betSlipSelections,
    removeBetSelection,
    clearBetSlip,
    betSlipType,
    setBetSlipType,
    placedBets,
    placeBetSlip,
    cashOutBet,
    currency,
    balanceUSD,
    balanceETB,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'slip' | 'open' | 'settled'>('slip');
  const [stakeInput, setStakeInput] = useState<string>('50');

  const stake = parseFloat(stakeInput) || 0;
  const currentBalance = currency === 'USD' ? balanceUSD : balanceETB;

  // Calculate odds
  const totalOdds =
    betSlipType === 'single'
      ? betSlipSelections[0]?.odds || 1
      : Number(betSlipSelections.reduce((acc, s) => acc * s.odds, 1).toFixed(2));

  const potentialPayout = Number((stake * totalOdds).toFixed(2));

  const handlePlaceBet = (e: React.FormEvent) => {
    e.preventDefault();
    if (placeBetSlip(stake)) {
      setStakeInput('50');
    }
  };

  const pendingBets = placedBets.filter((b) => b.status === 'pending');
  const settledBets = placedBets.filter((b) => b.status !== 'pending');

  return (
    <aside className="w-80 shrink-0 bg-[#0E131D] border-l border-[#1A2233] flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-2xl">
      {/* Top Tabs */}
      <div className="flex border-b border-[#1A2233] bg-[#0A0D15]">
        <button
          onClick={() => setActiveTab('slip')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors relative ${
            activeTab === 'slip'
              ? 'border-emerald-400 text-emerald-400 bg-[#121824]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Bet Slip</span>
          {betSlipSelections.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold">
              {betSlipSelections.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('open')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors relative ${
            activeTab === 'open'
              ? 'border-emerald-400 text-emerald-400 bg-[#121824]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Open ({pendingBets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settled')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${
            activeTab === 'settled'
              ? 'border-emerald-400 text-emerald-400 bg-[#121824]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <span>Settled</span>
        </button>
      </div>

      {/* Tab Content: Active Slip */}
      {activeTab === 'slip' && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          {betSlipSelections.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <div className="w-12 h-12 rounded-full bg-[#141B28] flex items-center justify-center mb-3">
                <SlidersHorizontal className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-xs font-semibold text-slate-300 mb-1">Your Bet Slip is Empty</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Click any match market odds to build a Single or high-multiplier Accumulator ticket.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Single / Accumulator Toggle */}
              <div className="p-3 border-b border-[#1A2233] bg-[#0C1019] flex items-center justify-between">
                <div className="flex items-center gap-1 bg-[#141B28] p-0.5 rounded-lg border border-[#222E42]">
                  <button
                    onClick={() => setBetSlipType('single')}
                    disabled={betSlipSelections.length > 1}
                    className={`px-3 py-1 text-[11px] font-semibold rounded ${
                      betSlipType === 'single'
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    } disabled:opacity-30`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setBetSlipType('accumulator')}
                    className={`px-3 py-1 text-[11px] font-semibold rounded ${
                      betSlipType === 'accumulator'
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Accumulator ({betSlipSelections.length})
                  </button>
                </div>

                <button
                  onClick={clearBetSlip}
                  className="text-slate-500 hover:text-red-400 p-1 text-xs flex items-center gap-1 transition-colors"
                  title="Clear All"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Clear</span>
                </button>
              </div>

              {/* Selections List */}
              <div className="p-3 space-y-2.5 flex-1 overflow-y-auto">
                {betSlipSelections.map((sel) => (
                  <div
                    key={sel.selectionId}
                    className="p-2.5 rounded-lg bg-[#131A26] border border-[#1E273A] relative group shadow-sm"
                  >
                    <button
                      onClick={() => removeBetSelection(sel.selectionId)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[10px] text-emerald-400 font-semibold mb-0.5 truncate pr-5">
                      {sel.marketName}
                    </div>
                    <div className="text-xs font-bold text-white mb-0.5">
                      {sel.selectionName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mb-1">
                      {sel.matchName}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1C2536]">
                      <span className="text-[10px] text-slate-500 uppercase">Odds</span>
                      <span className="font-mono font-bold text-emerald-400 tabular-nums">
                        {sel.odds.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stake & Payout Placement Drawer */}
              <div className="p-4 bg-[#0A0D15] border-t border-[#1A2233] space-y-3">
                {/* Total Odds display */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Odds:</span>
                  <span className="font-mono font-extrabold text-sm text-emerald-400 tabular-nums">
                    {totalOdds.toFixed(2)}
                  </span>
                </div>

                {/* Preset Stake Chips */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[25, 50, 100, 500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setStakeInput(val.toString())}
                      className="py-1 bg-[#141B28] hover:bg-[#1B2436] border border-[#222E42] rounded text-[11px] font-mono text-slate-300 text-center transition-colors"
                    >
                      +{val}
                    </button>
                  ))}
                </div>

                {/* Stake input */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Stake ({currency})</span>
                    <span>Bal: {currentBalance.toLocaleString()} {currency}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(e.target.value)}
                      className="w-full bg-[#131A26] border border-[#222E42] rounded-lg py-2 px-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setStakeInput(Math.min(currentBalance, 1000).toString())}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-400 hover:underline uppercase"
                    >
                      Max
                    </button>
                  </div>
                </div>

                {/* Potential payout */}
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex justify-between items-center text-xs">
                  <span className="text-emerald-300 font-medium">Est. Payout:</span>
                  <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
                    {potentialPayout.toLocaleString()} {currency}
                  </span>
                </div>

                {/* Place Bet Button */}
                <button
                  onClick={handlePlaceBet}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Place Bet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Open Pending Bets */}
      {activeTab === 'open' && (
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          {pendingBets.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No active open bets.
            </div>
          ) : (
            pendingBets.map((bet) => (
              <div
                key={bet.id}
                className="p-3 rounded-lg bg-[#131A26] border border-[#1E273A] space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-mono text-slate-400">#{bet.id}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                    IN PLAY
                  </span>
                </div>

                <div className="space-y-1">
                  {bet.selections.map((sel, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="text-white font-semibold">{sel.selectionName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{sel.matchName}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#1C2536] flex justify-between text-[11px]">
                  <span className="text-slate-400">Stake: {bet.totalStake} {bet.currency}</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    Win: {bet.potentialPayout} {bet.currency}
                  </span>
                </div>

                {/* Cash Out Button Simulation */}
                {bet.cashoutValue && (
                  <button
                    onClick={() => cashOutBet(bet.id)}
                    className="w-full py-1.5 rounded bg-[#1B2538] hover:bg-amber-500 hover:text-black text-amber-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Cash Out for {bet.cashoutValue} {bet.currency}</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Settled History */}
      {activeTab === 'settled' && (
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          {settledBets.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No settled bets yet.
            </div>
          ) : (
            settledBets.map((bet) => (
              <div
                key={bet.id}
                className="p-3 rounded-lg bg-[#111723] border border-[#1C2436] space-y-2 text-xs"
              >
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-mono text-slate-400">#{bet.id}</span>
                  <span
                    className={`font-mono text-[10px] uppercase font-bold ${
                      bet.status === 'won'
                        ? 'text-emerald-400'
                        : bet.status === 'cashed_out'
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {bet.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  {bet.selections.map((s) => s.selectionName).join(', ')}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Stake: {bet.totalStake} {bet.currency}</span>
                  <span className="font-mono font-semibold">
                    Return: {bet.status === 'won' ? bet.potentialPayout : bet.cashoutValue || 0} {bet.currency}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
};
