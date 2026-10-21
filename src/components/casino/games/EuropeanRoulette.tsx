import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { audio } from '../../../services/audioService';
import { RotateCw, Trash2, Award, History } from 'lucide-react';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const EuropeanRoulette: React.FC = () => {
  const {
    currency,
    balanceUSD,
    balanceETB,
    depositFunds,
    showToast,
  } = useApp();

  const currentBalance = currency === 'USD' ? balanceUSD : balanceETB;

  const [selectedChip, setSelectedChip] = useState<number>(25);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(17);
  const [lastWin, setLastWin] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([17, 32, 0, 7, 11, 29, 4]);

  const totalBetAmount = Object.values(bets).reduce((a, b) => a + b, 0);

  const placeBet = (key: string) => {
    if (isSpinning) return;
    if (totalBetAmount + selectedChip > currentBalance) {
      showToast('Insufficient demo credits.', 'error');
      return;
    }
    audio.playClick();
    setBets((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + selectedChip,
    }));
  };

  const clearBets = () => {
    if (isSpinning) return;
    audio.playClick();
    setBets({});
    setLastWin(0);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    if (totalBetAmount === 0) {
      showToast('Place at least one bet on the table.', 'warning');
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    audio.playClick();

    // Deduct total bet
    depositFunds(-totalBetAmount, 'Internal Ledger', `ROULETTE-BET-${Date.now()}`);

    // Spin duration 2.5 seconds
    const outcome = Math.floor(Math.random() * 37); // 0 to 36

    let tickCount = 0;
    const interval = setInterval(() => {
      audio.playTick();
      tickCount++;
      setWinningNumber(Math.floor(Math.random() * 37));
      if (tickCount >= 20) {
        clearInterval(interval);
        finalizeRoulette(outcome);
      }
    }, 110);
  };

  const finalizeRoulette = (resultNum: number) => {
    setWinningNumber(resultNum);
    setIsSpinning(false);
    setHistory((prev) => [resultNum, ...prev.slice(0, 9)]);

    const isRed = RED_NUMBERS.includes(resultNum);
    const isBlack = resultNum !== 0 && !isRed;
    const isEven = resultNum !== 0 && resultNum % 2 === 0;
    const isOdd = resultNum !== 0 && resultNum % 2 !== 0;
    const isLow = resultNum >= 1 && resultNum <= 18;
    const isHigh = resultNum >= 19 && resultNum <= 36;

    let payout = 0;

    // Straight up number (35:1 + stake = 36x)
    if (bets[`num-${resultNum}`]) {
      payout += bets[`num-${resultNum}`] * 36;
    }
    // Red/Black (1:1 + stake = 2x)
    if (isRed && bets['color-red']) payout += bets['color-red'] * 2;
    if (isBlack && bets['color-black']) payout += bets['color-black'] * 2;

    // Even/Odd
    if (isEven && bets['even']) payout += bets['even'] * 2;
    if (isOdd && bets['odd']) payout += bets['odd'] * 2;

    // High/Low
    if (isLow && bets['low']) payout += bets['low'] * 2;
    if (isHigh && bets['high']) payout += bets['high'] * 2;

    // Dozens (2:1 + stake = 3x)
    if (resultNum >= 1 && resultNum <= 12 && bets['doz-1']) payout += bets['doz-1'] * 3;
    if (resultNum >= 13 && resultNum <= 24 && bets['doz-2']) payout += bets['doz-2'] * 3;
    if (resultNum >= 25 && resultNum <= 36 && bets['doz-3']) payout += bets['doz-3'] * 3;

    if (payout > 0) {
      setLastWin(payout);
      depositFunds(payout, 'Internal Ledger', `ROULETTE-WIN-${Date.now()}`);
      audio.playWinChime();
      showToast(`Roulette Win: +${payout.toLocaleString()} ${currency} on Number ${resultNum}!`, 'success');
    }
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-emerald-600 text-white';
    return RED_NUMBERS.includes(num) ? 'bg-red-600 text-white' : 'bg-slate-900 text-white';
  };

  return (
    <div className="bg-[#0B0E15] border border-[#1B2335] rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="px-5 py-3 bg-[#0E131E] border-b border-[#1A2233] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="font-extrabold text-white tracking-wide">EUROPEAN ROULETTE VIP</span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-400 font-mono text-[11px]">Single Zero (RTP: 97.3%)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 uppercase font-mono mr-1">Last:</span>
          {history.map((num, i) => (
            <span
              key={i}
              className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${getNumberColor(
                num
              )}`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Center Wheel Stage */}
      <div className="p-6 bg-gradient-to-b from-[#090D15] via-[#0D1422] to-[#090D15] flex flex-col items-center justify-center">
        {/* Animated Simulated Wheel Hub */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-amber-500/40 bg-[#0B0F19] shadow-2xl flex items-center justify-center mb-6">
          <div
            className={`absolute inset-2 rounded-full border-2 border-dashed border-amber-400/30 ${
              isSpinning ? 'animate-spin' : ''
            }`}
          />
          {/* Inner Winning Pocket Display */}
          <div className="text-center z-10">
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono mb-0.5">
              {isSpinning ? 'SPINNING...' : 'WINNING NUMBER'}
            </div>
            <div
              className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl font-black font-mono shadow-xl ${
                winningNumber !== null ? getNumberColor(winningNumber) : 'bg-slate-800'
              }`}
            >
              {winningNumber !== null ? winningNumber : '-'}
            </div>
          </div>
        </div>

        {/* Roulette Betting Felt Grid */}
        <div className="w-full max-w-4xl bg-[#0F3826] p-4 rounded-xl border-2 border-[#1E5C40] shadow-2xl space-y-2 select-none overflow-x-auto">
          {/* Numbers 1-36 and Zero */}
          <div className="flex gap-1.5 min-w-[600px]">
            {/* Zero 0 */}
            <button
              onClick={() => placeBet('num-0')}
              className="w-14 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-white font-mono font-bold text-sm flex flex-col items-center justify-center relative shadow"
            >
              <span>0</span>
              {bets['num-0'] && (
                <span className="text-[10px] font-bold text-amber-300 bg-black/60 px-1 rounded mt-1">
                  ${bets['num-0']}
                </span>
              )}
            </button>

            {/* Grid 3 rows x 12 columns */}
            <div className="flex-1 grid grid-cols-12 gap-1">
              {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => {
                const isRed = RED_NUMBERS.includes(num);
                const betVal = bets[`num-${num}`];
                return (
                  <button
                    key={num}
                    onClick={() => placeBet(`num-${num}`)}
                    className={`h-11 rounded font-mono font-bold text-xs flex flex-col items-center justify-center relative transition-all ${
                      isRed ? 'bg-red-700 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-800'
                    } text-white shadow`}
                  >
                    <span>{num}</span>
                    {betVal && (
                      <span className="text-[9px] font-bold text-amber-300 bg-black/70 px-1 rounded">
                        ${betVal}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dozens */}
          <div className="grid grid-cols-3 gap-1.5 min-w-[600px]">
            <button
              onClick={() => placeBet('doz-1')}
              className="py-2 rounded bg-[#0A261A] hover:bg-[#113827] text-white font-bold text-xs border border-emerald-700/50"
            >
              1st 12 {bets['doz-1'] && `($${bets['doz-1']})`}
            </button>
            <button
              onClick={() => placeBet('doz-2')}
              className="py-2 rounded bg-[#0A261A] hover:bg-[#113827] text-white font-bold text-xs border border-emerald-700/50"
            >
              2nd 12 {bets['doz-2'] && `($${bets['doz-2']})`}
            </button>
            <button
              onClick={() => placeBet('doz-3')}
              className="py-2 rounded bg-[#0A261A] hover:bg-[#113827] text-white font-bold text-xs border border-emerald-700/50"
            >
              3rd 12 {bets['doz-3'] && `($${bets['doz-3']})`}
            </button>
          </div>

          {/* Outside Bets (Red/Black, Even/Odd, 1-18/19-36) */}
          <div className="grid grid-cols-6 gap-1.5 min-w-[600px]">
            <button
              onClick={() => placeBet('low')}
              className="py-2 rounded bg-[#0A261A] hover:bg-[#113827] text-white font-bold text-xs border border-emerald-700/50"
            >
              1 - 18 {bets['low'] && `($${bets['low']})`}
            </button>
            <button
              onClick={() => placeBet('even')}
              className="py-2 rounded bg-[#0A261A] hover:bg-[#113827] text-white font-bold text-xs border border-emerald-700/50"
            >
              EVEN {bets['even'] && `($${bets['even']})`}
            </button>
            <button
              onClick={() => placeBet('color-red')}
              className="py-2 rounded bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow"
            >
              RED {bets['color-red'] && `($${bets['color-red']})`}
            </button>
            <button
              onClick={() => placeBet('color-black')}
              className="py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow"
            >
              BLACK {bets['color-black'] && `($${bets['color-black']})`}
            </button>
            <button
              onClick={() => placeBet('odd')}
              className="py-2 rounded bg-[#0A261A] hover:bg-[#113827] text-white font-bold text-xs border border-emerald-700/50"
            >
              ODD {bets['odd'] && `($${bets['odd']})`}
            </button>
            <button
              onClick={() => placeBet('high')}
              className="py-2 rounded bg-[#0A261A] hover:bg-[#113827] text-white font-bold text-xs border border-emerald-700/50"
            >
              19 - 36 {bets['high'] && `($${bets['high']})`}
            </button>
          </div>
        </div>
      </div>

      {/* Chip Denominations and Controls */}
      <div className="p-5 bg-[#0D121B] border-t border-[#1A2233] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">Chip:</span>
          {[5, 25, 100, 500].map((val) => (
            <button
              key={val}
              disabled={isSpinning}
              onClick={() => setSelectedChip(val)}
              className={`w-10 h-10 rounded-full font-mono font-bold text-xs border-2 transition-transform shadow ${
                selectedChip === val
                  ? 'border-amber-400 bg-amber-500 text-black scale-110'
                  : 'border-[#2D394E] bg-[#141B28] text-slate-200 hover:scale-105'
              }`}
            >
              {val}
            </button>
          ))}
          <div className="ml-3 text-xs font-mono text-slate-300">
            Total Bet: <span className="font-bold text-emerald-400">{totalBetAmount} {currency}</span>
          </div>
        </div>

        {/* Clear & Spin Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            disabled={isSpinning || totalBetAmount === 0}
            onClick={clearBets}
            className="px-4 py-3 rounded-xl bg-[#141B28] hover:bg-[#1A2233] border border-[#222E42] text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
          <button
            disabled={isSpinning || totalBetAmount === 0}
            onClick={spinWheel}
            className="flex-1 sm:flex-initial px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning Wheel...' : 'SPIN WHEEL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
