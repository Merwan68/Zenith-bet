import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Activity,
  Dices,
  Sparkles,
  Ticket,
  User,
  Wallet,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    betSlipSelections,
    isBetSlipOpen,
    setIsBetSlipOpen,
    firebaseUser,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useApp();

  const handleBetSlipToggle = () => {
    setIsBetSlipOpen(!isBetSlipOpen);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-[#1C2536] px-2 py-1.5 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around">
        {/* 1. Sports */}
        <button
          onClick={() => {
            setCurrentPage('sports');
            setIsBetSlipOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            currentPage === 'sports' || currentPage === 'football' || currentPage === 'basketball'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Sports</span>
        </button>

        {/* 2. Live Sports */}
        <button
          onClick={() => {
            setCurrentPage('live_sports');
            setIsBetSlipOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors relative ${
            currentPage === 'live_sports'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Activity className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] tracking-tight">Live</span>
        </button>

        {/* 3. Floating Bet Slip Center Hub */}
        <button
          onClick={handleBetSlipToggle}
          className="flex flex-col items-center justify-center -mt-5 relative group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform border-2 border-[#0B0F17]">
            <Ticket className="w-6 h-6 stroke-[2.5]" />
            {betSlipSelections.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] rounded-full bg-amber-400 text-black text-[10px] font-black font-mono flex items-center justify-center border border-[#0B0F17] shadow-md">
                {betSlipSelections.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-emerald-400 mt-1">Bet Slip</span>
        </button>

        {/* 4. Aviator / Crash */}
        <button
          onClick={() => {
            setCurrentPage('crash');
            setIsBetSlipOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            currentPage === 'crash'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-cyan-400" />
          <span className="text-[10px] tracking-tight">Aviator</span>
        </button>

        {/* 5. Casino */}
        <button
          onClick={() => {
            setCurrentPage('casino');
            setIsBetSlipOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            currentPage === 'casino' || currentPage === 'slots' || currentPage === 'keno'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dices className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Casino</span>
        </button>

        {/* 6. Account or Sign In */}
        <button
          onClick={() => {
            if (firebaseUser) {
              setCurrentPage('account');
            } else {
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }
            setIsBetSlipOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            currentPage === 'account' || currentPage === 'wallet' || currentPage === 'withdraw'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">
            {firebaseUser ? 'Profile' : 'Sign Up'}
          </span>
        </button>
      </div>
    </nav>
  );
};
