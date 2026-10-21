import React from 'react';
import { useApp, NavigationPage } from '../../context/AppContext';
import {
  Home,
  Flame,
  Activity,
  Dices,
  CircleDot,
  Sparkles,
  Trophy,
  Gift,
  Award,
  User,
  Wallet,
  Receipt,
  ShieldAlert,
  HelpCircle,
  Gamepad2,
  Tv,
  ArrowUpRight,
} from 'lucide-react';

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.FC<{ className?: string }>;
  tag?: string;
  badgeColor?: string;
}

export const Navigation: React.FC = () => {
  const { currentPage, setCurrentPage, t } = useApp();

  const navCategories: { title: string; items: NavItem[] }[] = [
    {
      title: 'Main Lobby',
      items: [
        { id: 'home', label: t.home, icon: Home },
        { id: 'promotions', label: t.promotions, icon: Gift, tag: '200% Bonus' },
        { id: 'leaderboards', label: t.leaderboards, icon: Award },
      ],
    },
    {
      title: 'Sportsbook',
      items: [
        { id: 'sports', label: t.sports, icon: Flame },
        { id: 'live_sports', label: t.liveSports, icon: Activity, tag: 'IN-PLAY' },
        { id: 'football', label: t.football, icon: CircleDot },
        { id: 'basketball', label: t.basketball, icon: CircleDot },
        { id: 'tennis', label: t.tennis, icon: CircleDot },
        { id: 'volleyball', label: t.volleyball, icon: CircleDot },
        { id: 'esports', label: t.esports, icon: Gamepad2, tag: 'CS2/Dota' },
      ],
    },
    {
      title: 'Casino & Originals',
      items: [
        { id: 'casino', label: t.casino, icon: Dices },
        { id: 'crash', label: t.crashGames, icon: Sparkles, tag: 'HOT' },
        { id: 'slots', label: t.slots, icon: Trophy },
        { id: 'keno', label: t.keno, icon: CircleDot, tag: '80 Balls' },
        { id: 'live_casino', label: t.liveCasino, icon: Tv },
      ],
    },
    {
      title: 'Account & Banking',
      items: [
        { id: 'account', label: t.myAccount, icon: User },
        { id: 'wallet', label: t.wallet, icon: Wallet, tag: 'Deposit' },
        { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight, tag: 'Telebirr' },
        { id: 'transactions', label: t.transactionHistory, icon: Receipt },
        { id: 'responsible_gaming', label: t.responsibleGaming, icon: ShieldAlert },
        { id: 'help', label: t.helpCenter, icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0E131C] border-r border-[#192131] flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      {/* Category Accordion / List */}
      <div className="p-3 space-y-6">
        {navCategories.map((cat, idx) => (
          <div key={idx}>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {cat.title}
            </div>
            <div className="space-y-0.5">
              {cat.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#141B28]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.tag && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-tight shrink-0 ${
                          isActive
                            ? 'bg-emerald-400/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* VIP Status Card in Sidebar */}
      <div className="mt-auto p-3 border-t border-[#192131] bg-[#0A0E16]">
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#161F2E] to-[#111722] border border-[#222E42]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> VIP Level: Gold
            </span>
            <span className="text-[10px] text-slate-400 font-mono">6,450 / 10k XP</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full w-[64%]" />
          </div>
          <button
            onClick={() => setCurrentPage('promotions')}
            className="mt-2 w-full text-center text-[10px] text-slate-400 hover:text-amber-300 transition-colors"
          >
            Claim Daily Rewards →
          </button>
        </div>
      </div>
    </aside>
  );
};
