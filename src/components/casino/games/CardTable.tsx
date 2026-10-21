import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { audio } from '../../../services/audioService';
import { ShieldCheck, RotateCcw, Award } from 'lucide-react';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string; // 'A', '2'-'10', 'J', 'Q', 'K'
  value: number;
}

export const CardTable: React.FC<{ initialGame?: 'blackjack' | 'baccarat' }> = ({
  initialGame = 'blackjack',
}) => {
  const {
    currency,
    balanceUSD,
    balanceETB,
    depositFunds,
    showToast,
  } = useApp();

  const currentBalance = currency === 'USD' ? balanceUSD : balanceETB;

  const [gameMode, setGameMode] = useState<'blackjack' | 'baccarat'>(initialGame);
  const [stake, setStake] = useState<number>(50);

  // Blackjack States
  const [bjPhase, setBjPhase] = useState<'betting' | 'playing' | 'dealer_turn' | 'settled'>('betting');
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [bjOutcome, setBjOutcome] = useState<string>('');

  // Baccarat States
  const [baccaratBetOn, setBaccaratBetOn] = useState<'player' | 'banker' | 'tie'>('player');
  const [bacPhase, setBacPhase] = useState<'betting' | 'settled'>('betting');
  const [bacPlayerCards, setBacPlayerCards] = useState<Card[]>([]);
  const [bacBankerCards, setBacBankerCards] = useState<Card[]>([]);
  const [bacWinner, setBacWinner] = useState<string>('');

  // Helper: Create a fresh deck
  const createDeck = (): Card[] => {
    const suits: Card['suit'][] = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        let val = parseInt(rank);
        if (['J', 'Q', 'K'].includes(rank)) val = 10;
        if (rank === 'A') val = 11;
        deck.push({ suit, rank, value: val });
      }
    }
    // Shuffle
    return deck.sort(() => Math.random() - 0.5);
  };

  // Calculate Blackjack hand total with soft Ace handling
  const calcBlackjackScore = (hand: Card[]): number => {
    let score = 0;
    let aces = 0;

    for (const c of hand) {
      score += c.value;
      if (c.rank === 'A') aces++;
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    return score;
  };

  // Deal initial Blackjack hand
  const dealBlackjack = () => {
    if (stake > currentBalance) {
      showToast('Insufficient demo credits.', 'error');
      return;
    }

    audio.playClick();
    depositFunds(-stake, 'Internal Ledger', `BJ-BET-${Date.now()}`);

    const deck = createDeck();
    const p1 = deck.pop()!;
    const d1 = deck.pop()!;
    const p2 = deck.pop()!;
    const d2 = deck.pop()!;

    const pHand = [p1, p2];
    const dHand = [d1, d2];

    setPlayerHand(pHand);
    setDealerHand(dHand);
    setBjOutcome('');

    const pScore = calcBlackjackScore(pHand);
    if (pScore === 21) {
      // Natural Blackjack
      finalizeBlackjack(pHand, dHand, 'natural_blackjack');
    } else {
      setBjPhase('playing');
    }
  };

  const handleHit = () => {
    if (bjPhase !== 'playing') return;
    audio.playClick();
    const deck = createDeck();
    const newCard = deck[0];
    const updatedHand = [...playerHand, newCard];
    setPlayerHand(updatedHand);

    const score = calcBlackjackScore(updatedHand);
    if (score > 21) {
      // Bust
      finalizeBlackjack(updatedHand, dealerHand, 'bust');
    } else if (score === 21) {
      // Stand automatically on 21
      handleStand(updatedHand);
    }
  };

  const handleStand = (currentPHand = playerHand) => {
    setBjPhase('dealer_turn');
    audio.playClick();

    // Dealer draws until 17 or higher
    let dHand = [...dealerHand];
    let dScore = calcBlackjackScore(dHand);
    const deck = createDeck();

    while (dScore < 17) {
      dHand.push(deck.pop()!);
      dScore = calcBlackjackScore(dHand);
    }

    setDealerHand(dHand);
    finalizeBlackjack(currentPHand, dHand, 'evaluate');
  };

  const finalizeBlackjack = (
    pHand: Card[],
    dHand: Card[],
    reason: 'natural_blackjack' | 'bust' | 'evaluate'
  ) => {
    setBjPhase('settled');
    const pScore = calcBlackjackScore(pHand);
    const dScore = calcBlackjackScore(dHand);

    if (reason === 'bust') {
      setBjOutcome(`Bust (${pScore}). Dealer wins.`);
      return;
    }

    if (reason === 'natural_blackjack') {
      const payout = stake * 2.5; // 3:2 payout
      depositFunds(payout, 'Internal Ledger', `BJ-WIN-${Date.now()}`);
      setBjOutcome(`NATURAL BLACKJACK (21)! Won ${payout} ${currency}!`);
      audio.playWinChime();
      return;
    }

    // Evaluate
    if (dScore > 21) {
      const payout = stake * 2;
      depositFunds(payout, 'Internal Ledger', `BJ-WIN-${Date.now()}`);
      setBjOutcome(`Dealer busts with ${dScore}! You win ${payout} ${currency}!`);
      audio.playWinChime();
    } else if (pScore > dScore) {
      const payout = stake * 2;
      depositFunds(payout, 'Internal Ledger', `BJ-WIN-${Date.now()}`);
      setBjOutcome(`You win (${pScore} vs ${dScore})! Payout: ${payout} ${currency}!`);
      audio.playWinChime();
    } else if (pScore < dScore) {
      setBjOutcome(`Dealer wins (${dScore} vs ${pScore}).`);
    } else {
      // Push
      depositFunds(stake, 'Internal Ledger', `BJ-PUSH-${Date.now()}`);
      setBjOutcome(`Push (${pScore} vs ${dScore}). Stake returned.`);
    }
  };

  // Baccarat 3rd card rules implementation
  const calcBaccaratScore = (hand: Card[]): number => {
    const total = hand.reduce((sum, c) => {
      const v = ['10', 'J', 'Q', 'K'].includes(c.rank) ? 0 : c.value;
      return sum + v;
    }, 0);
    return total % 10;
  };

  const playBaccaratRound = () => {
    if (stake > currentBalance) {
      showToast('Insufficient demo credits.', 'error');
      return;
    }

    audio.playClick();
    depositFunds(-stake, 'Internal Ledger', `BAC-BET-${Date.now()}`);

    const deck = createDeck();
    let pCards = [deck.pop()!, deck.pop()!];
    let bCards = [deck.pop()!, deck.pop()!];

    let pScore = calcBaccaratScore(pCards);
    let bScore = calcBaccaratScore(bCards);

    // Natural 8 or 9
    if (pScore < 8 && bScore < 8) {
      // Player draws 3rd card if 0-5
      let p3: Card | null = null;
      if (pScore <= 5) {
        p3 = deck.pop()!;
        pCards.push(p3);
        pScore = calcBaccaratScore(pCards);
      }

      // Banker draws based on tableau
      if (!p3) {
        if (bScore <= 5) {
          bCards.push(deck.pop()!);
          bScore = calcBaccaratScore(bCards);
        }
      } else {
        const p3Val = ['10', 'J', 'Q', 'K'].includes(p3.rank) ? 0 : p3.value;
        if (bScore <= 2) bCards.push(deck.pop()!);
        else if (bScore === 3 && p3Val !== 8) bCards.push(deck.pop()!);
        else if (bScore === 4 && [2, 3, 4, 5, 6, 7].includes(p3Val)) bCards.push(deck.pop()!);
        else if (bScore === 5 && [4, 5, 6, 7].includes(p3Val)) bCards.push(deck.pop()!);
        else if (bScore === 6 && [6, 7].includes(p3Val)) bCards.push(deck.pop()!);
        bScore = calcBaccaratScore(bCards);
      }
    }

    setBacPlayerCards(pCards);
    setBacBankerCards(bCards);
    setBacPhase('settled');

    let winner = 'tie';
    if (pScore > bScore) winner = 'player';
    else if (bScore > pScore) winner = 'banker';

    setBacWinner(winner);

    let payout = 0;
    if (baccaratBetOn === winner) {
      if (winner === 'player') payout = stake * 2;
      if (winner === 'banker') payout = stake * 1.95; // 5% house commission
      if (winner === 'tie') payout = stake * 9; // 8:1 payout

      depositFunds(payout, 'Internal Ledger', `BAC-WIN-${Date.now()}`);
      audio.playWinChime();
      showToast(`Baccarat Win: +${payout.toLocaleString()} ${currency} on ${winner.toUpperCase()}!`, 'success');
    }
  };

  return (
    <div className="bg-[#0B0E15] border border-[#1B2335] rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Banner & Mode Toggle */}
      <div className="px-5 py-3 bg-[#0E131E] border-b border-[#1A2233] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="font-extrabold text-white tracking-wide uppercase">
            {gameMode === 'blackjack' ? 'SINGLE DECK BLACKJACK PRO' : 'PUNTO BANCO BACCARAT'}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-400 font-mono text-[11px]">RTP: 99.5%</span>
        </div>

        {/* Game Mode Switch */}
        <div className="flex items-center gap-1 bg-[#131A26] p-0.5 rounded-lg border border-[#222E42]">
          <button
            onClick={() => setGameMode('blackjack')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              gameMode === 'blackjack'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Blackjack
          </button>
          <button
            onClick={() => setGameMode('baccarat')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              gameMode === 'baccarat'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Baccarat
          </button>
        </div>
      </div>

      {/* Felt Card Table */}
      <div className="p-6 bg-gradient-to-b from-[#0F3826] via-[#0B2C1E] to-[#0A261A] min-h-[380px] flex flex-col justify-between select-none">
        {gameMode === 'blackjack' ? (
          /* Blackjack Table */
          <div className="space-y-6">
            {/* Dealer Zone */}
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-2">
                Dealer {bjPhase === 'settled' && `(${calcBlackjackScore(dealerHand)})`}
              </div>
              <div className="flex justify-center gap-2">
                {dealerHand.length === 0 ? (
                  <div className="w-16 h-24 rounded-lg border-2 border-dashed border-emerald-600/40 flex items-center justify-center text-[10px] text-emerald-400">
                    DECK
                  </div>
                ) : (
                  dealerHand.map((card, idx) => {
                    // Hide 2nd card during player turn
                    const isHidden = bjPhase === 'playing' && idx === 1;
                    const isRed = ['♥', '♦'].includes(card.suit);
                    return (
                      <div
                        key={idx}
                        className={`w-16 h-24 rounded-lg bg-white border border-slate-300 shadow-xl flex flex-col justify-between p-1.5 transition-transform ${
                          isHidden ? 'bg-gradient-to-br from-blue-900 to-indigo-950 border-blue-700' : ''
                        }`}
                      >
                        {isHidden ? (
                          <div className="w-full h-full rounded border border-blue-400/30 flex items-center justify-center font-bold text-blue-300 text-xs">
                            ZENITH
                          </div>
                        ) : (
                          <>
                            <div className={`text-xs font-bold leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
                              {card.rank}
                            </div>
                            <div className={`text-xl text-center ${isRed ? 'text-red-600' : 'text-black'}`}>
                              {card.suit}
                            </div>
                            <div className={`text-xs font-bold leading-none text-right ${isRed ? 'text-red-600' : 'text-black'}`}>
                              {card.rank}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Outcome Announcement */}
            {bjOutcome && (
              <div className="py-2 px-4 rounded-xl bg-black/60 backdrop-blur border border-amber-500/40 text-center font-bold text-amber-300 text-sm max-w-md mx-auto animate-in zoom-in">
                {bjOutcome}
              </div>
            )}

            {/* Player Zone */}
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold mb-2">
                Your Hand {playerHand.length > 0 && `(${calcBlackjackScore(playerHand)})`}
              </div>
              <div className="flex justify-center gap-2">
                {playerHand.length === 0 ? (
                  <div className="w-16 h-24 rounded-lg border-2 border-dashed border-emerald-600/40 flex items-center justify-center text-[10px] text-emerald-400">
                    EMPTY
                  </div>
                ) : (
                  playerHand.map((card, idx) => {
                    const isRed = ['♥', '♦'].includes(card.suit);
                    return (
                      <div
                        key={idx}
                        className="w-16 h-24 rounded-lg bg-white border border-slate-300 shadow-xl flex flex-col justify-between p-1.5 transform hover:-translate-y-1 transition-transform"
                      >
                        <div className={`text-xs font-bold leading-none ${isRed ? 'text-red-600' : 'text-black'}`}>
                          {card.rank}
                        </div>
                        <div className={`text-xl text-center ${isRed ? 'text-red-600' : 'text-black'}`}>
                          {card.suit}
                        </div>
                        <div className={`text-xs font-bold leading-none text-right ${isRed ? 'text-red-600' : 'text-black'}`}>
                          {card.rank}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Baccarat Table */
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
              {/* Player Side */}
              <div className="text-center p-3 rounded-xl bg-[#082015] border border-emerald-700/40">
                <div className="text-xs font-bold text-cyan-400 uppercase mb-2">
                  Player Hand ({calcBaccaratScore(bacPlayerCards)})
                </div>
                <div className="flex justify-center gap-1.5 min-h-[96px] items-center">
                  {bacPlayerCards.map((c, i) => (
                    <div key={i} className="w-14 h-20 rounded bg-white p-1 text-black text-xs font-bold flex flex-col justify-between shadow">
                      <span>{c.rank}</span>
                      <span className="text-base text-center">{c.suit}</span>
                      <span className="text-right">{c.rank}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banker Side */}
              <div className="text-center p-3 rounded-xl bg-[#082015] border border-emerald-700/40">
                <div className="text-xs font-bold text-amber-400 uppercase mb-2">
                  Banker Hand ({calcBaccaratScore(bacBankerCards)})
                </div>
                <div className="flex justify-center gap-1.5 min-h-[96px] items-center">
                  {bacBankerCards.map((c, i) => (
                    <div key={i} className="w-14 h-20 rounded bg-white p-1 text-black text-xs font-bold flex flex-col justify-between shadow">
                      <span>{c.rank}</span>
                      <span className="text-base text-center">{c.suit}</span>
                      <span className="text-right">{c.rank}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Baccarat Bet Selection Strip */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setBaccaratBetOn('player')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                  baccaratBetOn === 'player'
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg'
                    : 'bg-[#082015] text-cyan-400 border-cyan-800'
                }`}
              >
                Bet on PLAYER (1:1)
              </button>
              <button
                onClick={() => setBaccaratBetOn('tie')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                  baccaratBetOn === 'tie'
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg'
                    : 'bg-[#082015] text-emerald-400 border-emerald-800'
                }`}
              >
                Bet on TIE (8:1)
              </button>
              <button
                onClick={() => setBaccaratBetOn('banker')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                  baccaratBetOn === 'banker'
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg'
                    : 'bg-[#082015] text-amber-400 border-amber-800'
                }`}
              >
                Bet on BANKER (0.95:1)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Actions Bar */}
      <div className="p-5 bg-[#0D121B] border-t border-[#1A2233] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Stake */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Stake:</span>
          {[25, 50, 100, 250].map((val) => (
            <button
              key={val}
              disabled={bjPhase === 'playing'}
              onClick={() => setStake(val)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs border ${
                stake === val
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                  : 'bg-[#141B28] text-slate-300 border-[#222E42]'
              } disabled:opacity-40`}
            >
              {val}
            </button>
          ))}
          <span className="text-xs text-slate-400 font-mono ml-2">{currency}</span>
        </div>

        {/* Action Buttons */}
        {gameMode === 'blackjack' ? (
          <div className="flex items-center gap-2">
            {bjPhase === 'betting' || bjPhase === 'settled' ? (
              <button
                onClick={dealBlackjack}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all"
              >
                DEAL CARDS
              </button>
            ) : bjPhase === 'playing' ? (
              <>
                <button
                  onClick={handleHit}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all"
                >
                  HIT
                </button>
                <button
                  onClick={() => handleStand()}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all"
                >
                  STAND
                </button>
              </>
            ) : null}
          </div>
        ) : (
          <button
            onClick={playBaccaratRound}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all"
          >
            DEAL BACCARAT SHOE
          </button>
        )}
      </div>
    </div>
  );
};
