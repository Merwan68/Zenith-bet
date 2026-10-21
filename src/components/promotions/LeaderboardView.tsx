import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Award, Sparkles, TrendingUp, Medal } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  player: string;
  gameOrSport: string;
  wagerOrMultiplier: string;
  totalWon: string;
  badge?: string;
}

export const LeaderboardView: React.FC = () => {
  const { currency } = useApp();
  const [boardType, setBoardType] = useState<'crash_multipliers' | 'high_rollers' | 'acca_fame'>(
    'crash_multipliers'
  );

  const crashLeaderboard: LeaderboardEntry[] = [
    { rank: 1, player: 'Abebe_Addis', gameOrSport: 'Zenith Aviator Crash', wagerOrMultiplier: '84.50x', totalWon: '42,250 ETB', badge: '🥇' },
    { rank: 2, player: 'Hawassa_King', gameOrSport: 'Zenith Aviator Crash', wagerOrMultiplier: '62.10x', totalWon: '31,050 ETB', badge: '🥈' },
    { rank: 3, player: 'Gonder_Sniper', gameOrSport: 'Zenith Aviator Crash', wagerOrMultiplier: '48.20x', totalWon: '24,100 ETB', badge: '🥉' },
    { rank: 4, player: 'DireDawa_Eagle', gameOrSport: 'Zenith Aviator Crash', wagerOrMultiplier: '33.90x', totalWon: '16,950 ETB' },
    { rank: 5, player: 'Bole_Flyer', gameOrSport: 'Zenith Aviator Crash', wagerOrMultiplier: '27.40x', totalWon: '13,700 ETB' },
  ];

  const highRollers: LeaderboardEntry[] = [
    { rank: 1, player: 'Addis_Vip_99', gameOrSport: 'European Roulette VIP', wagerOrMultiplier: '50,000 ETB', totalWon: '180,000 ETB', badge: '🥇' },
    { rank: 2, player: 'RedSea_Titan', gameOrSport: 'Fruit Bonanza 5-Reel', wagerOrMultiplier: '25,000 ETB', totalWon: '125,000 ETB', badge: '🥈' },
    { rank: 3, player: 'Nile_Baron', gameOrSport: 'Blackjack Pro Table', wagerOrMultiplier: '20,000 ETB', totalWon: '80,000 ETB', badge: '🥉' },
    { rank: 4, player: 'HighRoller_Abebe', gameOrSport: 'Zenith Aviator Crash', wagerOrMultiplier: '15,000 ETB', totalWon: '64,500 ETB' },
    { rank: 5, player: 'Oromia_Ace', gameOrSport: 'Royal Keno 80', wagerOrMultiplier: '10,000 ETB', totalWon: '50,000 ETB' },
  ];

  const accaFame: LeaderboardEntry[] = [
    { rank: 1, player: 'Habesha_Punter', gameOrSport: '10-Fold Football Acca', wagerOrMultiplier: '142.80 Odds', totalWon: '71,400 ETB', badge: '🥇' },
    { rank: 2, player: 'Tana_Striker', gameOrSport: '8-Fold Champions League', wagerOrMultiplier: '95.40 Odds', totalWon: '47,700 ETB', badge: '🥈' },
    { rank: 3, player: 'Sheger_Predictor', gameOrSport: '6-Fold Premier League', wagerOrMultiplier: '52.10 Odds', totalWon: '26,050 ETB', badge: '🥉' },
    { rank: 4, player: 'Mekelle_Master', gameOrSport: '5-Fold NBA Moneylines', wagerOrMultiplier: '38.60 Odds', totalWon: '19,300 ETB' },
  ];

  let currentList = crashLeaderboard;
  if (boardType === 'high_rollers') currentList = highRollers;
  if (boardType === 'acca_fame') currentList = accaFame;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span>Zenith Arena Leaderboards & Hall of Fame</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Weekly top performers across crash multipliers, high-roller wagers, and sports accumulator bets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1A2233] bg-[#0C1019] p-1 rounded-xl text-xs gap-1">
        <button
          onClick={() => setBoardType('crash_multipliers')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-colors ${
            boardType === 'crash_multipliers'
              ? 'bg-cyan-500 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Highest Crash Multipliers
        </button>
        <button
          onClick={() => setBoardType('high_rollers')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-colors ${
            boardType === 'high_rollers'
              ? 'bg-amber-400 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Weekly High Rollers
        </button>
        <button
          onClick={() => setBoardType('acca_fame')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-colors ${
            boardType === 'acca_fame'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sports Acca Hall of Fame
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0F1420] border border-[#1E2638] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0D15] border-b border-[#1A2233] text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">Player Handle</th>
                <th className="py-3 px-4">Game / Event</th>
                <th className="py-3 px-4">Score / Multiplier</th>
                <th className="py-3 px-4">Total Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171F2E]">
              {currentList.map((entry) => (
                <tr key={entry.rank} className="hover:bg-[#121824] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      {entry.badge ? <span className="text-base">{entry.badge}</span> : `#${entry.rank}`}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                      👤
                    </div>
                    <span>{entry.player}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-300">{entry.gameOrSport}</td>

                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 tabular-nums">
                    {entry.wagerOrMultiplier}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                    {entry.totalWon}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
