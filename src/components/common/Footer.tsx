import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="mt-16 bg-[#080B10] border-t border-[#161E2D] text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center font-bold text-black text-xs">
                Z
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight">
                ZENITH ARENA
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] mb-4">
              Premium international sports-betting and online casino platform. Built with a verified provider-adapter architecture for global sportsbook feeds and studio casino integrations.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="border border-slate-700 px-1.5 py-0.5 rounded font-mono font-bold text-slate-300">
                18+
              </span>
              <span>Play Responsibly</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-3">Sportsbook Markets</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setCurrentPage('football')} className="hover:text-white transition-colors">
                  Football (Premier League, Champions League)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('basketball')} className="hover:text-white transition-colors">
                  Basketball (NBA, EuroLeague)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tennis')} className="hover:text-white transition-colors">
                  Tennis (Grand Slams, ATP Tour)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('esports')} className="hover:text-white transition-colors">
                  Esports (CS2, Dota 2, League)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('live_sports')} className="hover:text-white transition-colors text-emerald-400">
                  Live In-Play Betting Tracker
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-3">Casino & Originals</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setCurrentPage('crash')} className="hover:text-white transition-colors">
                  Zenith Aviator Crash
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('slots')} className="hover:text-white transition-colors">
                  Fruit Bonanza 5-Reel Slot
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('keno')} className="hover:text-white transition-colors">
                  Royal Keno 80-Ball
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('casino')} className="hover:text-white transition-colors">
                  European Roulette & Blackjack
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('promotions')} className="hover:text-white transition-colors text-amber-400">
                  VIP Club & Daily Rewards
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-3">Compliance & Sandbox</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setCurrentPage('responsible_gaming')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HeartHandshake className="w-3 h-3 text-red-400" /> Responsible Gaming Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('wallet')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" /> Telebirr Sandbox Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('help')} className="hover:text-white transition-colors">
                  Help Center & Game Rules
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="hover:text-white transition-colors text-slate-400">
                  System Administration Console
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Sandbox Notice Banner */}
        <div className="pt-6 border-t border-[#161E2D] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Demonstration & Sandbox Environment. All currencies, odds, payouts, and balances are virtual test credits without real monetary value.
            </span>
          </div>
          <div>
            <span>© 2026 Zenith Gaming Systems. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
