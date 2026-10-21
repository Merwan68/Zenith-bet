import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionType } from '../../types/wallet';
import { Download, Filter, Receipt, ArrowDownLeft, ArrowUpRight, Trophy, Gift, CheckCircle2 } from 'lucide-react';

export const TransactionHistoryView: React.FC = () => {
  const { transactions, currency, showToast } = useApp();
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [searchRef, setSearchRef] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchRef.trim()) {
      const q = searchRef.toLowerCase();
      const match =
        tx.reference.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const exportCSV = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'warning');
      return;
    }

    const headers = 'ID,Type,Amount,Currency,Status,Method,Reference,Description,Timestamp\n';
    const rows = transactions
      .map(
        (tx) =>
          `"${tx.id}","${tx.type}",${tx.amount},"${tx.currency}","${tx.status}","${tx.method}","${tx.reference}","${tx.description}","${tx.timestamp}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `zenith_statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transaction statement downloaded (CSV)', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Download Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>Sandbox Transaction Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of all demo deposits, withdrawals, sports bets, and casino payouts.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-[#141B28] hover:bg-[#1A2335] border border-[#222E42] text-xs font-bold text-slate-200 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Download Statement (.CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#0F1420] border border-[#1E2638] rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'deposit', label: 'Deposits' },
              { id: 'withdrawal', label: 'Withdrawals' },
              { id: 'bet_placed', label: 'Bets' },
              { id: 'bet_payout', label: 'Wins' },
              { id: 'promotion_reward', label: 'Rewards' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterType === item.id
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-[#141B28] text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Reference Search */}
        <input
          type="text"
          placeholder="Filter by Ref (e.g. TB-ETB-2026...)"
          value={searchRef}
          onChange={(e) => setSearchRef(e.target.value)}
          className="bg-[#141B28] border border-[#222E42] rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-full md:w-64"
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-[#0F1420] border border-[#1E2638] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A0D15] border-b border-[#1A2233] text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Transaction / Ref</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171F2E]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isPositive =
                    tx.type === 'deposit' || tx.type === 'bet_payout' || tx.type === 'promotion_reward';

                  return (
                    <tr key={tx.id} className="hover:bg-[#121824] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{tx.description}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{tx.reference}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="capitalize font-mono text-slate-300">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold tabular-nums">
                        <span className={isPositive ? 'text-emerald-400' : 'text-slate-300'}>
                          {isPositive ? '+' : '-'}{tx.amount.toLocaleString()} {tx.currency}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400">{tx.method}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : tx.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(tx.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
