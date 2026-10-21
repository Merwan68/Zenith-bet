import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { audio } from '../../../services/audioService';
import { KenoDrawHistory } from '../../../types/casino';
import { CircleDot, Sparkles, Trash2, Shuffle, History, Trophy } from 'lucide-react';

// Keno paytable for 1 to 10 picks
const KENO_PAYTABLE: Record<number, Record<number, number>> = {
  1: { 1: 3.5 },
  2: { 1: 1, 2: 9 },
  3: { 2: 2, 3: 45 },
  4: { 2: 1, 3: 8, 4: 120 },
  5: { 3: 3, 4: 18, 5: 800 },
  6: { 3: 2, 4: 7, 5: 60, 6: 1600 },
  7: { 3: 1, 4: 4, 5: 20, 6: 300, 7: 4000 },
  8: { 4: 2, 5: 10, 6: 80, 7: 1200, 8: 10000 },
  9: { 4: 1, 5: 5, 6: 35, 7: 300, 8: 2500, 9: 25000 },
  10: { 5: 3, 6: 15, 7: 100, 8: 1000, 9: 10000, 10: 100000 },
};

export const KenoGame: React.FC = () => {
  const {
    currency,
    balanceUSD,
    balanceETB,
    depositFunds,
    showToast,
  } = useApp();

  const currentBalance = currency === 'USD' ? balanceUSD : balanceETB;

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([7, 18, 23, 42, 77]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stake, setStake] = useState<number>(20);
  const [lastWin, setLastWin] = useState<number>(0);
  const [hitsCount, setHitsCount] = useState<number>(0);
  const [history, setHistory] = useState<KenoDrawHistory[]>([]);

  const toggleNumber = (num: number) => {
    if (isDrawing) return;
    audio.playClick();
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== num));
    } else {
      if (selectedNumbers.length >= 10) {
        showToast('Maximum 10 numbers can be selected.', 'warning');
        return;
      }
      setSelectedNumbers((prev) => [...prev, num].sort((a, b) => a - b));
    }
  };

  const handleQuickPick = (count: number) => {
    if (isDrawing) return;
    audio.playClick();
    const numbers: number[] = [];
    while (numbers.length < count) {
      const rand = Math.floor(Math.random() * 80) + 1;
      if (!numbers.includes(rand)) {
        numbers.push(rand);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const handleClear = () => {
    if (isDrawing) return;
    audio.playClick();
    setSelectedNumbers([]);
    setDrawnNumbers([]);
    setLastWin(0);
    setHitsCount(0);
  };

  const handleDraw = () => {
    if (isDrawing) return;
    if (selectedNumbers.length === 0) {
      showToast('Please select at least 1 number before drawing.', 'warning');
      return;
    }
    if (stake > currentBalance) {
      showToast('Insufficient demo credits.', 'error');
      return;
    }

    setIsDrawing(true);
    setDrawnNumbers([]);
    setLastWin(0);
    setHitsCount(0);
    audio.playClick();

    // Deduct stake
    depositFunds(-stake, 'Internal Ledger', `KENO-BET-${Date.now()}`);

    // Generate 20 distinct random numbers out of 80
    const targetDrawn: number[] = [];
    while (targetDrawn.length < 20) {
      const rand = Math.floor(Math.random() * 80) + 1;
      if (!targetDrawn.includes(rand)) {
        targetDrawn.push(rand);
      }
    }

    // Step-by-step reveal animation (20 balls)
    let idx = 0;
    const interval = setInterval(() => {
      audio.playTick();
      idx++;
      const currentBallList = targetDrawn.slice(0, idx);
      setDrawnNumbers(currentBallList);

      if (idx >= 20) {
        clearInterval(interval);
        finalizeDraw(targetDrawn);
      }
    }, 100);
  };

  const finalizeDraw = (finalBalls: number[]) => {
    setIsDrawing(false);
    // Count hits
    const hits = selectedNumbers.filter((n) => finalBalls.includes(n));
    setHitsCount(hits.length);

    const pickCount = selectedNumbers.length;
    const multTable = KENO_PAYTABLE[pickCount] || {};
    const multiplier = multTable[hits.length] || 0;
    const winAmount = multiplier * stake;

    if (winAmount > 0) {
      setLastWin(winAmount);
      depositFunds(winAmount, 'Internal Ledger', `KENO-WIN-${Date.now()}`);
      audio.playWinChime();
      showToast(`Keno Victory! ${hits.length} Hits! Won ${winAmount.toLocaleString()} ${currency}!`, 'success');
    }

    const roundLog: KenoDrawHistory = {
      id: `KN-${Date.now()}`,
      pickedNumbers: [...selectedNumbers],
      drawnNumbers: finalBalls,
      hits: hits.length,
      bet: stake,
      win: winAmount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory((prev) => [roundLog, ...prev.slice(0, 5)]);
  };

  const currentPaytable = KENO_PAYTABLE[selectedNumbers.length] || {};

  return (
    <div className="bg-[#0B0E15] border border-[#1B2335] rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="px-5 py-3 bg-[#0E131E] border-b border-[#1A2233] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="font-extrabold text-white tracking-wide">ZENITH ROYAL KENO 80</span>
          <span className="text-slate-500">·</span>
          <span className="text-cyan-400 font-mono text-[11px]">80-Ball Lottery System</span>
        </div>

        <div className="text-slate-400 font-mono text-xs">
          Selected: <span className="font-bold text-cyan-400">{selectedNumbers.length}</span>/10
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: 80 Number Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Quick Action Toolbar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                disabled={isDrawing}
                onClick={() => handleQuickPick(5)}
                className="px-3 py-1.5 rounded-lg bg-[#141B28] hover:bg-[#1A2335] border border-[#222E42] text-xs font-semibold text-slate-300 flex items-center gap-1.5 disabled:opacity-40"
              >
                <Shuffle className="w-3.5 h-3.5 text-cyan-400" /> Quick Pick 5
              </button>
              <button
                disabled={isDrawing}
                onClick={() => handleQuickPick(10)}
                className="px-3 py-1.5 rounded-lg bg-[#141B28] hover:bg-[#1A2335] border border-[#222E42] text-xs font-semibold text-slate-300 flex items-center gap-1.5 disabled:opacity-40"
              >
                <Shuffle className="w-3.5 h-3.5 text-cyan-400" /> Quick Pick 10
              </button>
              <button
                disabled={isDrawing}
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-[#141B28] hover:bg-[#1A2335] border border-[#222E42] text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1.5 disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

            {lastWin > 0 && (
              <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                {hitsCount} Hits! +{lastWin.toLocaleString()} {currency}
              </div>
            )}
          </div>

          {/* 80-Number Board Grid (10 columns, 8 rows) */}
          <div className="grid grid-cols-10 gap-1.5 sm:gap-2 bg-[#080B11] p-3 sm:p-4 rounded-xl border border-[#192233]">
            {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedNumbers.includes(num);
              const isDrawn = drawnNumbers.includes(num);
              const isHit = isSelected && isDrawn;

              let btnClass = 'bg-[#121824] border-[#1D273A] text-slate-300 hover:border-slate-500';

              if (isHit) {
                btnClass =
                  'bg-emerald-500 border-emerald-400 text-black font-extrabold shadow-md shadow-emerald-500/30 scale-105';
              } else if (isDrawn) {
                btnClass = 'bg-amber-500/30 border-amber-500/60 text-amber-300 font-bold animate-pulse';
              } else if (isSelected) {
                btnClass = 'bg-cyan-600 border-cyan-400 text-white font-extrabold shadow-md shadow-cyan-500/20';
              }

              return (
                <button
                  key={num}
                  disabled={isDrawing}
                  onClick={() => toggleNumber(num)}
                  className={`h-9 sm:h-10 rounded-lg text-xs font-mono font-semibold border transition-all duration-150 flex items-center justify-center ${btnClass} disabled:cursor-not-allowed`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Paytable & Draw Controls */}
        <div className="space-y-4">
          {/* Dynamic Paytable */}
          <div className="p-4 bg-[#0E131E] rounded-xl border border-[#1C2537] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wide">
              <Trophy className="w-4 h-4" />
              <span>Paytable ({selectedNumbers.length} Picks)</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {Object.keys(currentPaytable).length === 0 ? (
                <div className="text-slate-500 text-[11px] py-4 text-center">
                  Select numbers to preview match payouts.
                </div>
              ) : (
                Object.entries(currentPaytable).map(([hit, mult]) => (
                  <div
                    key={hit}
                    className={`flex justify-between py-1 px-2 rounded ${
                      hitsCount === parseInt(hit) && !isDrawing
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                        : 'text-slate-400 hover:bg-[#141B28]'
                    }`}
                  >
                    <span>{hit} Hits</span>
                    <span className="text-white font-bold">{mult}×</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stake & Play */}
          <div className="p-4 bg-[#0E131E] rounded-xl border border-[#1C2537] space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Stake ({currency})</span>
                <span>Bal: {currentBalance.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-4 gap-1 mb-2">
                {[10, 20, 50, 100].map((val) => (
                  <button
                    key={val}
                    disabled={isDrawing}
                    onClick={() => setStake(val)}
                    className={`py-1 rounded text-xs font-mono border ${
                      stake === val
                        ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                        : 'bg-[#141B28] text-slate-300 border-[#222E42]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={isDrawing || selectedNumbers.length === 0}
              onClick={handleDraw}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {isDrawing ? 'Drawing 20 Balls...' : 'START DRAW'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
