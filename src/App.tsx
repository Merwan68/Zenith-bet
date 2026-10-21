import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { ToastContainer } from './components/common/Toast';
import { BetSlipDrawer } from './components/sportsbook/BetSlipDrawer';
import { SportsbookView } from './components/sportsbook/SportsbookView';
import { CasinoLobby } from './components/casino/CasinoLobby';
import { GameModal } from './components/casino/GameModal';
import { WalletView } from './components/wallet/WalletView';
import { WithdrawalView } from './components/wallet/WithdrawalView';
import { TransactionHistoryView } from './components/wallet/TransactionHistoryView';
import { PromotionsView } from './components/promotions/PromotionsView';
import { LeaderboardView } from './components/promotions/LeaderboardView';
import { AccountView } from './components/account/AccountView';
import { ResponsibleGamingView } from './components/account/ResponsibleGamingView';
import { HelpCenterView } from './components/help/HelpCenterView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WelcomeBonusModal } from './components/common/WelcomeBonusModal';
import { CrashGame } from './components/casino/games/CrashGame';
import { FruitSlots } from './components/casino/games/FruitSlots';
import { KenoGame } from './components/casino/games/KenoGame';
import { EuropeanRoulette } from './components/casino/games/EuropeanRoulette';
import { CardTable } from './components/casino/games/CardTable';
import {
  Flame,
  Dices,
  Sparkles,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  Trophy,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    activeGame,
    closeGame,
    openGame,
    casinoGames,
    sportsEvents,
  } = useApp();

  const liveMatches = sportsEvents.filter((e) => e.isLive);
  const featuredCrash = casinoGames.find((g) => g.id === 'crash-aviator');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans">
      <Header />

      {/* Main 3-Column Grid Layout */}
      <div className="flex-1 flex w-full">
        {/* Left Navigation Sidebar */}
        <Navigation />

        {/* Center Main Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1440px] mx-auto min-w-0">
          {/* 1. Home Portal */}
          {currentPage === 'home' && (
            <div className="space-y-8">
              {/* Home Quick Launch Hero */}
              <div className="relative rounded-2xl overflow-hidden border border-[#1E2638] shadow-2xl bg-gradient-to-r from-[#0C1420] via-[#0E1B2C] to-[#0A171F] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl z-10">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>PREMIUM INTERNATIONAL SPORTSBOOK & CASINO SUITE</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                    High-Velocity In-Play Odds & Real-Time Casino Games
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    Wager virtual credits across global football, NBA, and Grand Slam tournaments, or test our certified multiplier crash and fruit slot engines. Seamlessly integrated with Telebirr sandbox payments.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setCurrentPage('sports')}
                      className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Explore Sportsbook</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage('crash')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Play Aviator Crash</span>
                    </button>
                  </div>
                </div>

                {/* Telebirr Fast Entry Banner */}
                <div className="w-full md:w-72 bg-[#090D15] p-5 rounded-xl border border-[#1F2B3E] shadow-xl text-xs space-y-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white">Telebirr Sandbox</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Test Ethiopian Birr deposits with simulated USSD push alerts and automated transaction callbacks.
                  </p>
                  <button
                    onClick={() => setCurrentPage('wallet')}
                    className="w-full py-2 rounded-lg bg-[#141B28] hover:bg-[#1E2638] text-emerald-400 font-bold border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Open Telebirr Gateway</span>
                  </button>
                </div>
              </div>

              {/* Hot In-Play Live Sports Ticker */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live In-Play Matches</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage('live_sports')}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>View all live ({liveMatches.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <SportsbookView liveOnly={true} />
              </div>

              {/* Featured Originals Showcase */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                    <Dices className="w-4 h-4 text-amber-400" />
                    <span>Featured Playable Casino Originals</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage('casino')}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Full Casino Lobby</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <CasinoLobby initialCategory="popular" />
              </div>
            </div>
          )}

          {/* 2. Sportsbook */}
          {currentPage === 'sports' && <SportsbookView initialSport="all" />}

          {/* 3. Live Sports */}
          {currentPage === 'live_sports' && <SportsbookView liveOnly={true} />}

          {/* 4. Football */}
          {currentPage === 'football' && <SportsbookView initialSport="football" />}

          {/* 5. Basketball */}
          {currentPage === 'basketball' && <SportsbookView initialSport="basketball" />}

          {/* 6. Tennis */}
          {currentPage === 'tennis' && <SportsbookView initialSport="tennis" />}

          {/* 7. Volleyball */}
          {currentPage === 'volleyball' && <SportsbookView initialSport="volleyball" />}

          {/* 8. Esports */}
          {currentPage === 'esports' && <SportsbookView initialSport="esports" />}

          {/* 9. Casino Lobby */}
          {currentPage === 'casino' && <CasinoLobby initialCategory="all" />}

          {/* 10. Live Casino */}
          {currentPage === 'live_casino' && <CasinoLobby initialCategory="live_casino" />}

          {/* 11. Slots (Fruit Bonanza Playable) */}
          {currentPage === 'slots' && (
            <div className="space-y-6">
              <FruitSlots />
              <div className="pt-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3">More Slot Machines</h3>
                <CasinoLobby initialCategory="slots" />
              </div>
            </div>
          )}

          {/* 12. Keno (Royal Keno 80 Playable) */}
          {currentPage === 'keno' && (
            <div className="space-y-6">
              <KenoGame />
            </div>
          )}

          {/* 13. Crash Games (Aviator Playable) */}
          {currentPage === 'crash' && (
            <div className="space-y-6">
              <CrashGame />
            </div>
          )}

          {/* 14. Promotions */}
          {currentPage === 'promotions' && <PromotionsView />}

          {/* 15. Leaderboards */}
          {currentPage === 'leaderboards' && <LeaderboardView />}

          {/* 16. My Account */}
          {currentPage === 'account' && <AccountView />}

          {/* 17. Wallet */}
          {currentPage === 'wallet' && <WalletView />}

          {/* 18. Withdraw (Telebirr) */}
          {currentPage === 'withdraw' && <WithdrawalView />}

          {/* 19. Transaction History */}
          {currentPage === 'transactions' && <TransactionHistoryView />}

          {/* 20. Responsible Gaming */}
          {currentPage === 'responsible_gaming' && <ResponsibleGamingView />}

          {/* 21. Help Center */}
          {currentPage === 'help' && <HelpCenterView />}

          {/* 22. Administration Console */}
          {currentPage === 'admin' && <AdminDashboard />}
        </main>

        {/* Right Bet Slip Drawer (Visible across sports and main views) */}
        <BetSlipDrawer />
      </div>

      <Footer />
      <AuthModal />
      <WelcomeBonusModal />
      {activeGame && <GameModal game={activeGame} onClose={closeGame} />}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
