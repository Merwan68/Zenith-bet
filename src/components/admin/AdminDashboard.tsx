import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminRole } from '../../types/user';
import { SportsEvent } from '../../types/sports';
import { CasinoGame } from '../../types/casino';
import {
  Sliders,
  Users,
  Activity,
  Dices,
  Server,
  Receipt,
  ShieldAlert,
  Plus,
  Check,
  Ban,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Smartphone,
  Search,
  Filter,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminRole,
    setAdminRole,
    sportsEvents,
    updateSportsEvent,
    casinoGames,
    updateCasinoGame,
    transactions,
    currency,
    showToast,
    withdrawalRequests,
    adminUpdateWithdrawal,
    mainBalance,
    bonusBalance,
    user,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'analytics' | 'withdrawals' | 'sports_manager' | 'game_catalog' | 'providers' | 'audit_logs'
  >('withdrawals');

  const [withdrawalFilter, setWithdrawalFilter] = useState<'All' | 'Pending' | 'Approved' | 'Completed' | 'Rejected'>('All');
  const [withdrawalSearch, setWithdrawalSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // New Match State
  const [newHomeTeam, setNewHomeTeam] = useState('');
  const [newAwayTeam, setNewAwayTeam] = useState('');
  const [newLeague, setNewLeague] = useState('Premier League');

  // Simulated Audit Logs
  const [auditLogs, setAuditLogs] = useState<{ id: string; action: string; user: string; time: string }[]>([
    { id: 'LOG-441', action: 'Odds Feed Calibrated (Sportradar Staging)', user: 'Super Admin', time: '12:15:30' },
    { id: 'LOG-442', action: 'Telebirr Sandbox IPN Listener Healthy', user: 'System Worker', time: '12:12:10' },
    { id: 'LOG-443', action: 'Crash Multiplier Seed Rotated (SHA-256)', user: 'Game Manager', time: '12:08:45' },
    { id: 'LOG-444', action: 'Player KYC Auto-Verified in Sandbox', user: 'Support Agent', time: '12:00:15' },
  ]);

  // Roles List
  const roles: AdminRole[] = ['Super Admin', 'Content Manager', 'Game Manager', 'Support Agent'];

  // Add a new sports event via Admin
  const handleAddSportsEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomeTeam || !newAwayTeam) return;

    const newEv: SportsEvent = {
      id: `custom-${Date.now()}`,
      sport: 'football',
      league: newLeague,
      country: 'International',
      homeTeam: newHomeTeam,
      awayTeam: newAwayTeam,
      isLive: true,
      homeScore: 0,
      awayScore: 0,
      matchTime: "1'",
      startTime: new Date().toISOString(),
      status: 'live',
      provider: 'ZenithDemo',
      isSimulated: true,
      stats: { possession: [50, 50], shotsOnTarget: [0, 0], shotsOffTarget: [0, 0], corners: [0, 0] },
      markets: [
        {
          id: 'm-1x2',
          name: 'Match Winner (1X2)',
          category: 'main',
          selections: [
            { id: 'sel-1', name: newHomeTeam, odds: 2.10, status: 'active' },
            { id: 'sel-x', name: 'Draw', odds: 3.20, status: 'active' },
            { id: 'sel-2', name: newAwayTeam, odds: 3.40, status: 'active' },
          ],
        },
      ],
    };

    updateSportsEvent(newEv);
    setNewHomeTeam('');
    setNewAwayTeam('');
    showToast(`Added custom match: ${newHomeTeam} vs ${newAwayTeam}`, 'success');
  };

  // Quick Score Update for a Match
  const handleScoreUpdate = (event: SportsEvent, deltaHome: number, deltaAway: number) => {
    const updated: SportsEvent = {
      ...event,
      homeScore: Math.max(0, (event.homeScore ?? 0) + deltaHome),
      awayScore: Math.max(0, (event.awayScore ?? 0) + deltaAway),
    };
    updateSportsEvent(updated);
    showToast(`Updated score: ${updated.homeTeam} ${updated.homeScore} - ${updated.awayScore} ${updated.awayTeam}`, 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Admin Header with Role Switcher */}
      <div className="p-6 bg-gradient-to-r from-[#17140B] via-[#1A1A12] to-[#121824] border border-amber-500/30 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Zenith Gaming Operator Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Platform Administration & Monitoring</h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect real-time sports feeds, game catalog RTP rates, provider adapter health, and system audit logs.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 bg-[#0A0D15] p-1.5 rounded-xl border border-[#222E42]">
          <span className="text-xs text-slate-400 px-2 font-mono">Role:</span>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                setAdminRole(r);
                showToast(`Switched active role to ${r}`, 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                adminRole === r
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-[#1A2233] bg-[#0C1019] p-1 rounded-xl text-xs gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('withdrawals')}
          className={`px-4 py-2.5 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeAdminTab === 'withdrawals'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Telebirr Withdrawals</span>
          {withdrawalRequests.filter((r) => r.status === 'Pending').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-black font-mono font-bold">
              {withdrawalRequests.filter((r) => r.status === 'Pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-4 py-2.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeAdminTab === 'analytics'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveAdminTab('sports_manager')}
          className={`px-4 py-2.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeAdminTab === 'sports_manager'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sports Event & Odds Manager
        </button>
        <button
          onClick={() => setActiveAdminTab('game_catalog')}
          className={`px-4 py-2.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeAdminTab === 'game_catalog'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Casino Catalog & RTP
        </button>
        <button
          onClick={() => setActiveAdminTab('providers')}
          className={`px-4 py-2.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeAdminTab === 'providers'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Provider Adapters Health
        </button>
        <button
          onClick={() => setActiveAdminTab('audit_logs')}
          className={`px-4 py-2.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeAdminTab === 'audit_logs'
              ? 'bg-emerald-500 text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          System Audit Trail
        </button>
      </div>

      {/* Tab: Telebirr Withdrawals Management */}
      {activeAdminTab === 'withdrawals' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0F1420] border border-amber-500/30 rounded-xl relative overflow-hidden">
              <div className="text-[11px] text-amber-400 uppercase font-mono font-bold flex items-center justify-between">
                <span>Pending Approvals</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="font-mono text-2xl font-black text-white mt-1 tabular-nums">
                {withdrawalRequests.filter((r) => r.status === 'Pending').length}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Total:{' '}
                {withdrawalRequests
                  .filter((r) => r.status === 'Pending')
                  .reduce((acc, r) => acc + r.amount, 0)
                  .toLocaleString()}{' '}
                ETB
              </div>
            </div>

            <div className="p-4 bg-[#0F1420] border border-blue-500/30 rounded-xl">
              <div className="text-[11px] text-blue-400 uppercase font-mono font-bold flex items-center justify-between">
                <span>Approved (Queue)</span>
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="font-mono text-2xl font-black text-white mt-1 tabular-nums">
                {withdrawalRequests.filter((r) => r.status === 'Approved').length}
              </div>
              <div className="text-[10px] text-blue-400 mt-1 font-mono">Ready for Telebirr B2C</div>
            </div>

            <div className="p-4 bg-[#0F1420] border border-emerald-500/30 rounded-xl">
              <div className="text-[11px] text-emerald-400 uppercase font-mono font-bold flex items-center justify-between">
                <span>Completed Payouts</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="font-mono text-2xl font-black text-emerald-400 mt-1 tabular-nums">
                {withdrawalRequests
                  .filter((r) => r.status === 'Completed')
                  .reduce((acc, r) => acc + r.amount, 0)
                  .toLocaleString()}{' '}
                ETB
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                {withdrawalRequests.filter((r) => r.status === 'Completed').length} disbursed
              </div>
            </div>

            <div className="p-4 bg-[#0F1420] border border-[#1E2638] rounded-xl">
              <div className="text-[11px] text-slate-400 uppercase font-mono font-bold flex items-center justify-between">
                <span>Active User Balances</span>
                <Users className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="font-mono text-sm font-bold text-white mt-2">
                Main:{' '}
                <span className="text-emerald-400">{mainBalance.toLocaleString()} ETB</span>
              </div>
              <div className="font-mono text-xs text-slate-300 mt-0.5">
                Bonus:{' '}
                <span className="text-amber-400">{bonusBalance.toLocaleString()} ETB</span>
              </div>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="p-4 bg-[#0F1420] border border-[#1E2638] rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs text-slate-400 font-mono mr-1">Status:</span>
              {(['All', 'Pending', 'Approved', 'Completed', 'Rejected'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setWithdrawalFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    withdrawalFilter === s
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'bg-[#141B28] text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                  {s !== 'All' && (
                    <span className="ml-1.5 text-[10px] opacity-75">
                      ({withdrawalRequests.filter((r) => r.status === s).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search phone or name..."
                value={withdrawalSearch}
                onChange={(e) => setWithdrawalSearch(e.target.value)}
                className="w-full bg-[#141B28] border border-[#222E42] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Withdrawals Request Table */}
          <div className="bg-[#0F1420] border border-[#1E2638] rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#1A2233] bg-[#0A0D15] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Telebirr Payout Queue & Withdrawal Requests</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Review and authorize player disbursements. Main cash and promotional bonus deductions are verified server-side.
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE QUEUE</span>
              </div>
            </div>

            {withdrawalRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No withdrawal requests currently registered in the database.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B0F17] border-b border-[#1A2233] text-slate-400 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-4">Reference & Date</th>
                      <th className="py-3 px-4">Recipient & Telebirr #</th>
                      <th className="py-3 px-4">Balance Source</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171F2E]">
                    {withdrawalRequests
                      .filter((req) => {
                        if (withdrawalFilter !== 'All' && req.status !== withdrawalFilter) return false;
                        if (!withdrawalSearch.trim()) return true;
                        const query = withdrawalSearch.toLowerCase();
                        return (
                          req.accountHolderName.toLowerCase().includes(query) ||
                          req.telebirrAccount.toLowerCase().includes(query) ||
                          req.id.toLowerCase().includes(query)
                        );
                      })
                      .map((req) => {
                        const isPending = req.status === 'Pending';
                        const isApproved = req.status === 'Approved';
                        const isCompleted = req.status === 'Completed';
                        const isRejected = req.status === 'Rejected';

                        return (
                          <tr key={req.id} className="hover:bg-[#121824] transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-mono font-bold text-white text-[11px]">{req.id}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {new Date(req.createdAt).toLocaleString()}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-200">{req.accountHolderName}</div>
                              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                                <Smartphone className="w-3 h-3 text-slate-400" />
                                <span>{req.telebirrAccount}</span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              {req.balanceType === 'bonus' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                                  <Sparkles className="w-3 h-3 text-amber-400" /> Bonus (≥1k rule)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                                  Main Cash
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-mono font-black text-white text-sm">
                                {req.amount.toLocaleString()} ETB
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                                  <Clock className="w-3 h-3" /> Pending Review
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  <Check className="w-3 h-3" /> Approved
                                </span>
                              )}
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" /> Completed
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                  <XCircle className="w-3 h-3" /> Rejected
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending && (
                                  <>
                                    <button
                                      disabled={processingId === req.id}
                                      onClick={async () => {
                                        setProcessingId(req.id);
                                        await adminUpdateWithdrawal(req.id, 'Approved', 'Approved by operator in sandbox review.');
                                        setProcessingId(null);
                                      }}
                                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[11px] transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      disabled={processingId === req.id}
                                      onClick={async () => {
                                        const reason = window.prompt('Enter rejection reason (will refund balance):', 'Account verification mismatch');
                                        if (reason !== null) {
                                          setProcessingId(req.id);
                                          await adminUpdateWithdrawal(req.id, 'Rejected', reason || 'Rejected by operator');
                                          setProcessingId(null);
                                        }
                                      }}
                                      className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 font-bold rounded text-[11px] border border-red-500/30 transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {isApproved && (
                                  <>
                                    <button
                                      disabled={processingId === req.id}
                                      onClick={async () => {
                                        setProcessingId(req.id);
                                        await adminUpdateWithdrawal(
                                          req.id,
                                          'Completed',
                                          `Telebirr B2C API Payout confirmed ref: TB-PAY-${Date.now().toString().slice(-6)}`
                                        );
                                        setProcessingId(null);
                                      }}
                                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded text-[11px] transition-colors flex items-center gap-1"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Complete Payout</span>
                                    </button>
                                    <button
                                      disabled={processingId === req.id}
                                      onClick={async () => {
                                        setProcessingId(req.id);
                                        await adminUpdateWithdrawal(req.id, 'Rejected', 'Rejected before payment dispatch');
                                        setProcessingId(null);
                                      }}
                                      className="px-2.5 py-1 bg-red-600/20 text-red-300 font-bold rounded text-[11px] border border-red-500/20"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {(isCompleted || isRejected) && (
                                  <span className="text-[11px] font-mono text-slate-500">
                                    Audited {req.updatedAt ? new Date(req.updatedAt).toLocaleTimeString() : ''}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Analytics Overview */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#0F1420] border border-[#1E2638] rounded-xl">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Total Demo Turnover</div>
              <div className="font-mono text-2xl font-black text-white mt-1 tabular-nums">
                2,410,500 {currency}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1 font-mono">+18.4% today</div>
            </div>

            <div className="p-5 bg-[#0F1420] border border-[#1E2638] rounded-xl">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Gross Gaming Revenue (GGR)</div>
              <div className="font-mono text-2xl font-black text-emerald-400 mt-1 tabular-nums">
                184,200 {currency}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Hold rate: 7.64%</div>
            </div>

            <div className="p-5 bg-[#0F1420] border border-[#1E2638] rounded-xl">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Active Demo Players</div>
              <div className="font-mono text-2xl font-black text-cyan-400 mt-1 tabular-nums">
                1,428
              </div>
              <div className="text-[10px] text-cyan-400 mt-1 font-mono">Telebirr Sandbox users</div>
            </div>

            <div className="p-5 bg-[#0F1420] border border-[#1E2638] rounded-xl">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Bet Slips Placed Today</div>
              <div className="font-mono text-2xl font-black text-amber-400 mt-1 tabular-nums">
                5,920
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Avg odds: 3.42</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sports Event Manager */}
      {activeAdminTab === 'sports_manager' && (
        <div className="space-y-6">
          {/* Create Match Form */}
          <div className="p-5 bg-[#0F1420] border border-[#1E2638] rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Create / Inject In-Play Match</span>
            </h3>
            <form onSubmit={handleAddSportsEvent} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Home Team</label>
                <input
                  type="text"
                  placeholder="e.g. Ethiopia Bunna"
                  value={newHomeTeam}
                  onChange={(e) => setNewHomeTeam(e.target.value)}
                  className="w-full bg-[#141B28] border border-[#222E42] rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Away Team</label>
                <input
                  type="text"
                  placeholder="e.g. Saint George SC"
                  value={newAwayTeam}
                  onChange={(e) => setNewAwayTeam(e.target.value)}
                  className="w-full bg-[#141B28] border border-[#222E42] rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">League</label>
                <input
                  type="text"
                  value={newLeague}
                  onChange={(e) => setNewLeague(e.target.value)}
                  className="w-full bg-[#141B28] border border-[#222E42] rounded-lg p-2 text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs"
                >
                  Publish Match
                </button>
              </div>
            </form>
          </div>

          {/* Matches List with Quick Score Buttons */}
          <div className="bg-[#0F1420] border border-[#1E2638] rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A0D15] border-b border-[#1A2233] text-slate-400 uppercase text-[10px] font-mono">
                <tr>
                  <th className="py-3 px-4">Match</th>
                  <th className="py-3 px-4">Status / Score</th>
                  <th className="py-3 px-4">Feed Provider</th>
                  <th className="py-3 px-4">Live Score Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171F2E]">
                {sportsEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#121824]">
                    <td className="py-3 px-4 font-bold text-white">
                      {ev.homeTeam} vs {ev.awayTeam}
                      <div className="text-[10px] text-slate-500 font-mono">{ev.league}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {ev.isLive ? (
                        <span className="text-emerald-400 font-bold">
                          {ev.homeScore ?? 0} - {ev.awayScore ?? 0} ({ev.matchTime})
                        </span>
                      ) : (
                        <span className="text-slate-400">Scheduled</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{ev.provider}</td>
                    <td className="py-3 px-4">
                      {ev.isLive && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleScoreUpdate(ev, 1, 0)}
                            className="px-2 py-1 bg-[#141B28] hover:bg-[#1C2638] rounded text-emerald-400 font-bold"
                          >
                            +1 {ev.homeTeam.slice(0, 3)}
                          </button>
                          <button
                            onClick={() => handleScoreUpdate(ev, 0, 1)}
                            className="px-2 py-1 bg-[#141B28] hover:bg-[#1C2638] rounded text-emerald-400 font-bold"
                          >
                            +1 {ev.awayTeam.slice(0, 3)}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Casino Catalog & RTP */}
      {activeAdminTab === 'game_catalog' && (
        <div className="bg-[#0F1420] border border-[#1E2638] rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0D15] border-b border-[#1A2233] text-slate-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="py-3 px-4">Game</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">RTP (%)</th>
                <th className="py-3 px-4">Integration Type</th>
                <th className="py-3 px-4">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171F2E]">
              {casinoGames.map((game) => (
                <tr key={game.id} className="hover:bg-[#121824]">
                  <td className="py-3 px-4 font-bold text-white">
                    {game.name}
                    <div className="text-[10px] text-slate-500 font-mono">{game.provider}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 uppercase">{game.category}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{game.rtp}%</td>
                  <td className="py-3 px-4 font-mono text-slate-400 capitalize">
                    {game.integrationType.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        updateCasinoGame({ ...game, isPlayableDemo: !game.isPlayableDemo });
                        showToast(`Toggled ${game.name} playable state`, 'info');
                      }}
                      className={`px-3 py-1 rounded text-[11px] font-bold ${
                        game.isPlayableDemo
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {game.isPlayableDemo ? 'Active & Playable' : 'Disabled / Offline'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Provider Adapters Health */}
      {activeAdminTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Sportradar Unified Feed',
              type: 'Sportsbook Data',
              status: 'Connected (Sandbox Staging)',
              latency: '34ms',
              uptime: '99.98%',
              desc: 'Official Sportradar Odds Feed Adapter. Running in verified sandbox environment.',
            },
            {
              name: 'Betradar Live Odds',
              type: 'Sportsbook Data',
              status: 'Connected (Sandbox)',
              latency: '42ms',
              uptime: '99.95%',
              desc: 'In-play match timer and momentum ticker simulator.',
            },
            {
              name: 'Spribe Aviator Engine',
              type: 'Casino Crash',
              status: 'Adapter Ready (Sandbox)',
              latency: '18ms',
              uptime: '100%',
              desc: 'Seamless Wallet REST integration layer configured with SHA-256 seed rotation.',
            },
            {
              name: 'Ethio Telecom Telebirr Gateway',
              type: 'Payment Adapter',
              status: 'Sandbox Active',
              latency: '120ms',
              uptime: '99.92%',
              desc: 'Direct Pay H5 USSD callback listener with RSA-2048 signature verification simulator.',
            },
          ].map((prov, i) => (
            <div key={i} className="p-5 bg-[#0F1420] border border-[#1E2638] rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">{prov.name}</h4>
                  <div className="text-[10px] text-slate-500 font-mono">{prov.type}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  {prov.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{prov.desc}</p>
              <div className="pt-2 border-t border-[#1C2536] flex justify-between text-[11px] font-mono text-slate-400">
                <span>Latency: {prov.latency}</span>
                <span>Uptime: {prov.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: System Audit Trail */}
      {activeAdminTab === 'audit_logs' && (
        <div className="bg-[#0F1420] border border-[#1E2638] rounded-xl overflow-hidden shadow-lg p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white uppercase font-mono">Live Audit Events</span>
            <span className="text-emerald-400 text-[10px] font-mono">● STREAM ACTIVE</span>
          </div>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[#0A0D15] rounded-lg border border-[#1A2233] flex justify-between items-center text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{log.action}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Operator: {log.user}</div>
                </div>
                <div className="text-[11px] font-mono text-slate-500">{log.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
