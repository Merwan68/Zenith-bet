import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { audio } from '../../../services/audioService';
import { Play, RotateCw, Info, Trophy, Sparkles } from 'lucide-react';

interface SymbolDef {
  char: string;
  name: string;
  payout3: number;
  payout4: number;
  payout5: number;
  color: string;
}

const SYMBOLS: SymbolDef[] = [
  { char: '🍒', name: 'Cherry', payout3: 2, payout4: 5, payout5: 15, color: '#EF4444' },
  { char: '🍋', name: 'Lemon', payout3: 3, payout4: 8, payout5: 20, color: '#EAB308' },
  { char: '🍉', name: 'Melon', payout3: 4, payout4: 10, payout5: 35, color: '#10B981' },
  { char: '🔔', name: 'Golden Bell', payout3: 8, payout4: 25, payout5: 80, color: '#F59E0B' },
  { char: '💎', name: 'Diamond', payout3: 15, payout4: 50, payout5: 150, color: '#06B6D4' },
  { char: '7️⃣', name: 'Lucky 7', payout3: 25, payout4: 100, payout5: 500, color: '#10B981' },
  { char: '⭐', name: 'Wild Star', payout3: 50, payout4: 200, payout5: 1000, color: '#F59E0B' },
];

export const FruitSlots: React.FC = () => {
  const {
    currency,
    balanceUSD,
    balanceETB,
    depositFunds,
    showToast,
  } = useApp();

  const currentBalance = currency === 'USD' ? balanceUSD : balanceETB;

  // 5 reels, 3 rows
  const [reels, setReels] = useState<string[][]>([
    ['🍒', '7️⃣', '🔔'],
    ['🍉', '7️⃣', '💎'],
    ['🍋', '7️⃣', '🍒'],
    ['🔔', '🍉', '🍋'],
    ['💎', '🍒', '7️⃣'],
  ]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [betPerLine, setBetPerLine] = useState(5);
  const linesCount = 10;
  const totalBet = betPerLine * linesCount;

  const [lastWin, setLastWin] = useState<number>(0);
  const [winMessage, setWinMessage] = useState<string>('');
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [autoSpinsLeft, setAutoSpinsLeft] = useState<number>(0);
  const [showPaytable, setShowPaytable] = useState<boolean>(false);

  // Paylines coordinates [row on reel 0, row on reel 1, row on reel 2, row on reel 3, row on reel 4]
  const paylines = [
    [1, 1, 1, 1, 1], // Center line
    [0, 0, 0, 0, 0], // Top line
    [2, 2, 2, 2, 2], // Bottom line
    [0, 1, 2, 1, 0], // V-shape
    [2, 1, 0, 1, 2], // Inverted V
    [0, 0, 1, 2, 2],
    [2, 2, 1, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 2, 2, 2, 1],
    [0, 1, 0, 1, 0],
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    if (totalBet > currentBalance) {
      showToast('Insufficient demo credits for spin', 'error');
      setAutoSpinsLeft(0);
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    setWinMessage('');
    setWinningLines([]);
    audio.playClick();

    // Deduct bet
    depositFunds(-totalBet, 'Internal Ledger', `SLOT-SPIN-${Date.now()}`);

    // Generate new random symbols
    const getRandomSymbol = () => {
      const idx = Math.floor(Math.random() * SYMBOLS.length);
      return SYMBOLS[idx].char;
    };

    // Staggered reel spin animation
    let tickCount = 0;
    const interval = setInterval(() => {
      audio.playTick();
      tickCount++;
      setReels([
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      ]);

      if (tickCount >= 10) {
        clearInterval(interval);
        finalizeSpin();
      }
    }, 120);
  };

  const finalizeSpin = () => {
    const getRandomSymbol = () => {
      // Slight weight towards cherries and lemons
      const weights = [0.25, 0.22, 0.18, 0.15, 0.10, 0.07, 0.03];
      const rand = Math.random();
      let cumulative = 0;
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rand <= cumulative) return SYMBOLS[i].char;
      }
      return SYMBOLS[0].char;
    };

    const finalReels: string[][] = [
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    ];

    setReels(finalReels);
    setIsSpinning(false);

    // Evaluate 10 paylines
    let totalWin = 0;
    const activeWinLines: number[] = [];

    paylines.forEach((line, lineIdx) => {
      const s0 = finalReels[0][line[0]];
      const s1 = finalReels[1][line[1]];
      const s2 = finalReels[2][line[2]];
      const s3 = finalReels[3][line[3]];
      const s4 = finalReels[4][line[4]];

      const lineSymbols = [s0, s1, s2, s3, s4];
      const firstSymbol = lineSymbols[0];

      // Count consecutive matching or Wild ⭐ from left
      let matchCount = 1;
      for (let i = 1; i < 5; i++) {
        if (lineSymbols[i] === firstSymbol || lineSymbols[i] === '⭐' || firstSymbol === '⭐') {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        const symDef = SYMBOLS.find((s) => s.char === firstSymbol) || SYMBOLS[0];
        let mult = 0;
        if (matchCount === 3) mult = symDef.payout3;
        else if (matchCount === 4) mult = symDef.payout4;
        else if (matchCount === 5) mult = symDef.payout5;

        const lineWin = mult * betPerLine;
        totalWin += lineWin;
        activeWinLines.push(lineIdx + 1);
      }
    });

    if (totalWin > 0) {
      setLastWin(totalWin);
      setWinningLines(activeWinLines);
      setWinMessage(`BIG WIN! +${totalWin.toLocaleString()} ${currency} on ${activeWinLines.length} Payline(s)!`);
      depositFunds(totalWin, 'Internal Ledger', `SLOT-WIN-${Date.now()}`);
      audio.playWinChime();
      showToast(`Slot Win: +${totalWin.toLocaleString()} ${currency}!`, 'success');
    }

    // Autoplay continuation
    if (autoSpinsLeft > 1) {
      setAutoSpinsLeft((prev) => prev - 1);
      setTimeout(() => {
        handleSpin();
      }, 1000);
    } else {
      setAutoSpinsLeft(0);
    }
  };

  return (
    <div className="bg-[#0B0E15] border border-[#1B2335] rounded-2xl overflow-hidden shadow-2xl">
      {/* Slot Header */}
      <div className="px-5 py-3 bg-[#0E131E] border-b border-[#1A2233] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="font-extrabold text-white tracking-wide">
            FRUIT BONANZA 5-REEL VEGAS
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-400 font-mono text-[11px]">RTP: 96.5% · 10 Lines</span>
        </div>

        <button
          onClick={() => setShowPaytable(!showPaytable)}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-[#141B28] px-2.5 py-1 rounded-lg border border-[#222E42]"
        >
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Paytable & Rules</span>
        </button>
      </div>

      {/* Paytable Dropdown Modal */}
      {showPaytable && (
        <div className="p-4 bg-[#0A0D15] border-b border-[#1A2233] text-xs space-y-3 animate-in fade-in">
          <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
            Symbol Payout Multipliers (per line bet)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SYMBOLS.map((s) => (
              <div key={s.char} className="p-2 bg-[#121824] rounded-lg border border-[#1E2638] flex items-center justify-between">
                <span className="text-xl">{s.char}</span>
                <div className="text-right text-[11px] font-mono text-slate-300">
                  <div>3x: {s.payout3}×</div>
                  <div>4x: {s.payout4}×</div>
                  <div className="text-emerald-400 font-bold">5x: {s.payout5}×</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Reels Machine Frame */}
      <div className="p-6 bg-gradient-to-b from-[#090C12] via-[#0E1420] to-[#090C12] flex flex-col items-center">
        {/* Machine Casing with 5 reels */}
        <div className="w-full max-w-2xl bg-[#070A0F] p-4 rounded-2xl border-4 border-[#1F2B3E] shadow-2xl relative">
          {/* Win announcement banner */}
          {lastWin > 0 && (
            <div className="mb-3 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-black text-center font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/25 animate-bounce">
              {winMessage}
            </div>
          )}

          {/* 5-Reel Grid */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {reels.map((reelCol, colIdx) => (
              <div
                key={colIdx}
                className="bg-[#111724] border border-[#212E44] rounded-xl p-2 flex flex-col items-center justify-around h-64 sm:h-72 shadow-inner"
              >
                {reelCol.map((sym, rowIdx) => (
                  <div
                    key={rowIdx}
                    className={`w-full h-16 sm:h-20 rounded-lg flex items-center justify-center text-3xl sm:text-4xl transition-all duration-150 ${
                      isSpinning ? 'blur-xs scale-95' : 'hover:scale-105'
                    } ${
                      lastWin > 0 && (rowIdx === 1 || winningLines.length > 0)
                        ? 'bg-emerald-500/10 border border-emerald-400/30'
                        : 'bg-[#151D2C]'
                    }`}
                  >
                    {sym}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-5 bg-[#0D121B] border-t border-[#1A2233]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Line Bet and Total Bet controls */}
          <div className="flex items-center gap-4 text-xs">
            <div>
              <div className="text-slate-400 text-[11px] mb-1">Bet per Line</div>
              <div className="flex items-center gap-1">
                {[1, 5, 10, 25].map((val) => (
                  <button
                    key={val}
                    disabled={isSpinning}
                    onClick={() => setBetPerLine(val)}
                    className={`px-2.5 py-1.5 rounded-lg font-mono font-bold border transition-colors ${
                      betPerLine === val
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-[#141B28] text-slate-300 border-[#222E42] hover:bg-[#1A2335]'
                    } disabled:opacity-40`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2 bg-[#121824] rounded-lg border border-[#1E2638] text-center">
              <div className="text-[10px] text-slate-400">Total Bet (10 lines)</div>
              <div className="font-mono font-bold text-white text-sm">
                {totalBet} {currency}
              </div>
            </div>
          </div>

          {/* Action buttons: Spin & Autoplay */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Autoplay options */}
            <div className="flex items-center gap-1">
              {[10, 25].map((count) => (
                <button
                  key={count}
                  disabled={isSpinning}
                  onClick={() => {
                    setAutoSpinsLeft(count);
                    handleSpin();
                  }}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold ${
                    autoSpinsLeft > 0
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-[#141B28] text-slate-300 border-[#222E42] hover:bg-[#1A2335]'
                  } disabled:opacity-40`}
                >
                  Auto {count}
                </button>
              ))}
            </div>

            {/* Big Spin button */}
            <button
              disabled={isSpinning}
              onClick={handleSpin}
              className="flex-1 sm:flex-initial px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning...' : 'SPIN REELS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
