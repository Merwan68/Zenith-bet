import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  Globe,
  Sliders,
  Wallet,
  Sparkles,
  LogOut,
  Gift,
  LogIn,
  UserPlus,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';
import { LanguageCode } from '../../data/translations';

export const Header: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    language,
    setLanguage,
    currency,
    setCurrency,
    balanceUSD,
    balanceETB,
    mainBalance,
    bonusBalance,
    user,
    firebaseUser,
    logout,
    isMuted,
    toggleAudio,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const formattedBalance =
    currency === 'USD'
      ? `$${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `${balanceETB.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur border-b border-[#1A2233]">
      {/* Sandbox Regulatory Notice Strip */}
      <div className="bg-[#121824] px-4 py-1 text-center border-b border-[#1D273B] text-[11px] text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          Zenith Sandbox Environment · Virtual Demo Credits Only · Telebirr & Payment Gateway Testing Mode
        </span>
      </div>

      {/* Main Top Bar adhering to 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-black text-lg tracking-tighter">Z</span>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
                ZENITH<span className="text-emerald-400">ARENA</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Primary Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setCurrentPage('sports')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentPage === 'sports' || currentPage === 'football' || currentPage === 'basketball' || currentPage === 'tennis'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Sportsbook
          </button>
          <button
            onClick={() => setCurrentPage('live_sports')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentPage === 'live_sports'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Live In-Play
          </button>
          <button
            onClick={() => setCurrentPage('casino')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentPage === 'casino' || currentPage === 'slots' || currentPage === 'keno'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Casino Lobby
          </button>
          <button
            onClick={() => setCurrentPage('crash')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentPage === 'crash'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Crash Aviator
          </button>
          <button
            onClick={() => setCurrentPage('promotions')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentPage === 'promotions'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Promotions
          </button>
        </nav>

        {/* Zone 3: Wallet Balances, Language, User Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Toggle (USD vs ETB) */}
          <div className="hidden sm:flex items-center bg-[#131A26] rounded-md p-0.5 border border-[#1E2638]">
            <button
              onClick={() => setCurrency('ETB')}
              className={`px-2 py-1 text-xs font-semibold rounded ${
                currency === 'ETB' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ETB
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 text-xs font-semibold rounded ${
                currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD
            </button>
          </div>

          {/* Balance Pill Button -> opens Wallet */}
          <button
            onClick={() => setCurrentPage('wallet')}
            className="flex items-center gap-2 bg-[#131A26] hover:bg-[#1A2233] px-3 py-1.5 rounded-lg border border-[#1E2638] transition-colors group text-left"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white tabular-nums block leading-tight">
                {formattedBalance}
              </span>
              <span className="text-[10px] text-slate-400 block leading-none">Sandbox Balance</span>
            </div>
          </button>

          {/* Deposit Button */}
          <button
            onClick={() => setCurrentPage('wallet')}
            className="px-3.5 py-1.5 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            Deposit
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleAudio}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#131A26] transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative group">
            <button
              aria-label="Change Language"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#131A26] flex items-center gap-1 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-mono uppercase">{language}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-[#121824] border border-[#1E2638] rounded-lg shadow-xl py-1 w-32 z-50">
              <button
                onClick={() => setLanguage('en')}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1A2233] ${
                  language === 'en' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('am')}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1A2233] ${
                  language === 'am' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                አማርኛ (Amharic)
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1A2233] ${
                  language === 'ar' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                العربية (Arabic)
              </button>
            </div>
          </div>

          {/* Admin Dashboard Switch */}
          <button
            onClick={() => setCurrentPage(currentPage === 'admin' ? 'home' : 'admin')}
            title="Operator & Administrator Console"
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium ${
              currentPage === 'admin'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'text-slate-400 border-[#1E2638] hover:text-white hover:bg-[#131A26]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Admin</span>
          </button>

          {/* User Profile / Account or Sign In */}
          {firebaseUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[#131A26] border border-[#1E2638] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold font-mono">
                  {user.avatar || '🦁'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                    {user.username || firebaseUser.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono leading-none">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-64 bg-[#0F1420] border border-[#1E2638] rounded-xl shadow-2xl py-2 z-50 text-xs space-y-1"
                >
                  <div className="px-4 py-2 border-b border-[#1A2233]">
                    <div className="font-bold text-white truncate">{user.username}</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">{user.email}</div>
                    <div className="mt-2 pt-2 border-t border-[#171F2E] flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Main Cash:</span>
                      <span className="font-mono font-bold text-emerald-400">{mainBalance.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Bonus:</span>
                      <span className="font-mono font-bold text-amber-400">{bonusBalance.toLocaleString()} ETB</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage('account');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-[#141B28] flex items-center gap-2"
                  >
                    <span>My Account Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('wallet');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-[#141B28] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Wallet & Deposit</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('withdraw');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-[#141B28] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                      <span>Withdraw Telebirr</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-300 font-mono">
                      ETB
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('transactions');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-[#141B28] flex items-center gap-2"
                  >
                    <span>Transaction Ledger</span>
                  </button>

                  <div className="pt-1 border-t border-[#1A2233]">
                    <button
                      onClick={async () => {
                        await logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#222E42] text-xs font-bold text-slate-200 hover:text-white hover:bg-[#141B28] transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Register +250 ETB</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
