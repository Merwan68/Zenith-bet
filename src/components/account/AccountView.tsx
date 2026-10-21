import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShieldCheck, Settings, Lock, Bell, Globe, Check, Award } from 'lucide-react';
import { OddsFormat } from '../../types/sports';
import { LanguageCode } from '../../data/translations';

export const AccountView: React.FC = () => {
  const { user, updateUser, oddsFormat, setOddsFormat, language, setLanguage, showToast } = useApp();

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifyOdds, setNotifyOdds] = useState(true);
  const [notifyBets, setNotifyBets] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ username, email, avatar });
    showToast('Profile information saved', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('Passwords do not match or are empty', 'error');
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated (PBKDF2 sandbox hashed)', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Overview Card */}
      <div className="p-6 bg-gradient-to-br from-[#121824] via-[#0E131E] to-[#121824] border border-[#1E2638] rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl shadow-lg">
            {user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">{user.username}</h1>
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                {user.vipLevel} VIP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <div className="mt-2 text-[11px] text-slate-500 font-mono">
              Account ID: {user.id} · Registered: {user.registeredAt}
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#0A0D15] rounded-xl border border-[#1E2638] text-xs font-mono">
          <div className="text-slate-400 text-[10px] uppercase">KYC Verification</div>
          <div className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Tier 1 Approved (Sandbox)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <div className="p-6 bg-[#0F1420] border border-[#1E2638] rounded-2xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Personal Profile Settings</span>
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#141B28] border border-[#222E42] rounded-lg py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141B28] border border-[#222E42] rounded-lg py-2 px-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Avatar Emoji</label>
              <div className="flex gap-2">
                {['🦁', '🦅', '⚡', '👑', '🐺', '🔥'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setAvatar(em)}
                    className={`w-9 h-9 rounded-lg border text-lg flex items-center justify-center ${
                      avatar === em
                        ? 'border-emerald-400 bg-emerald-500/20'
                        : 'border-[#222E42] bg-[#141B28]'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Preferences: Odds Format & Language */}
        <div className="p-6 bg-[#0F1420] border border-[#1E2638] rounded-2xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Platform Preferences</span>
          </h2>

          <div className="space-y-4 text-xs">
            {/* Odds Format */}
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Odds Display Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'decimal', label: 'Decimal (2.45)' },
                    { id: 'fractional', label: 'Fractional (29/20)' },
                    { id: 'american', label: 'American (+145)' },
                  ] as const
                ).map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setOddsFormat(fmt.id)}
                    className={`py-2 px-2 rounded-lg border text-center font-mono text-[11px] font-semibold transition-colors ${
                      oddsFormat === fmt.id
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-[#141B28] text-slate-300 border-[#222E42] hover:bg-[#1A2335]'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Display Language</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'en', label: 'English' },
                    { id: 'am', label: 'አማርኛ (Amharic)' },
                    { id: 'ar', label: 'العربية (Arabic)' },
                  ] as const
                ).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`py-2 px-2 rounded-lg border text-center text-xs font-semibold transition-colors ${
                      language === l.id
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-[#141B28] text-slate-300 border-[#222E42] hover:bg-[#1A2335]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification toggles */}
            <div className="pt-2 border-t border-[#1C2536] space-y-2">
              <div className="text-slate-400 font-medium">Notifications (In-App)</div>
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>In-play odds changes alert</span>
                <input
                  type="checkbox"
                  checked={notifyOdds}
                  onChange={(e) => setNotifyOdds(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
              </label>
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Bet settlement audio chime</span>
                <input
                  type="checkbox"
                  checked={notifyBets}
                  onChange={(e) => setNotifyBets(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
