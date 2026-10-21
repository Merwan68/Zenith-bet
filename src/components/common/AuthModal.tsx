import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    firebaseUser,
    logout,
    user,
    updateUser,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await loginWithEmail(email, password);
      } else if (authModalMode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await registerWithEmail(email, password, username || email.split('@')[0]);
      } else if (authModalMode === 'reset') {
        await sendPasswordReset(email);
        setAuthModalMode('login');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication operation failed.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0F1420] border border-[#1E2638] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2638] bg-[#0A0D15]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              Z
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {firebaseUser
                  ? 'Account Overview'
                  : authModalMode === 'login'
                  ? 'Sign In to Zenith Arena'
                  : authModalMode === 'register'
                  ? 'Create New Account'
                  : 'Reset Password'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {firebaseUser
                  ? `Authenticated as ${firebaseUser.email}`
                  : 'Official Firebase Authentication & Cloud Firestore'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {firebaseUser ? (
            /* Logged in state */
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#131A26] rounded-xl border border-[#1E2638] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">UID:</span>
                  <span className="font-mono text-slate-200">{firebaseUser.uid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-white">{firebaseUser.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Role:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    {user.role || 'Player'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-4 py-2 bg-[#141B28] text-slate-300 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setIsAuthModalOpen(false);
                  }}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-bold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Auth Form (Login / Register / Reset) */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex border-b border-[#1E2638] bg-[#0A0D15] p-1 rounded-xl text-xs gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                    authModalMode === 'login'
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                    authModalMode === 'register'
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-[11px] text-red-300">
                  {errorMsg}
                </div>
              )}

              {/* Registration 250 ETB Bonus Announcement Tag */}
              {authModalMode === 'register' && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                  <span>🎁 New accounts qualify for a 250 ETB free welcome bonus!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {authModalMode === 'register' && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Username / Nickname</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Habesha_Player"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#131A26] border border-[#222E42] rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="player@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#131A26] border border-[#222E42] rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                {authModalMode !== 'reset' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-slate-300 font-medium">Password</label>
                      {authModalMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setAuthModalMode('reset')}
                          className="text-[11px] text-emerald-400 hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#131A26] border border-[#222E42] rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {authModalMode === 'register' && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#131A26] border border-[#222E42] rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? 'Authenticating...'
                      : authModalMode === 'login'
                      ? 'Sign In to Account'
                      : authModalMode === 'register'
                      ? 'Create Account & Claim 250 ETB'
                      : 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Google Sign-in */}
              {authModalMode !== 'reset' && (
                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-[#1C2536]" />
                    <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-mono">
                      or continue with
                    </span>
                    <div className="flex-grow border-t border-[#1C2536]" />
                  </div>

                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="w-full py-2.5 bg-[#141B28] hover:bg-[#1C2638] border border-[#222E42] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Google Authentication</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
