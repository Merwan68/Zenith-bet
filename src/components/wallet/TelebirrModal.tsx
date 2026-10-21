import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TelebirrSandboxAdapter } from '../../services/telebirrAdapter';
import { X, Smartphone, ShieldCheck, ArrowRight, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

interface TelebirrModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
}

export const TelebirrModal: React.FC<TelebirrModalProps> = ({
  isOpen,
  onClose,
  defaultAmount = 1000,
}) => {
  const { depositFunds, showToast } = useApp();

  const [step, setStep] = useState<'input' | 'ussd_pending' | 'success'>('input');
  const [phoneNumber, setPhoneNumber] = useState('0911234567');
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [txRef, setTxRef] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'payment' | 'docs'>('payment');

  if (!isOpen) return null;

  const docs = TelebirrSandboxAdapter.getPrerequisites();

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await TelebirrSandboxAdapter.initiateDeposit(phoneNumber, amount);
      setTxRef(res.transactionRef);
      setStep('ussd_pending');
      showToast(res.message, 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid transaction details';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateApprove = async () => {
    setLoading(true);
    try {
      await TelebirrSandboxAdapter.confirmSandboxPayment(txRef, amount, phoneNumber);
      depositFunds(amount, 'Telebirr Sandbox', txRef, phoneNumber);
      setStep('success');
    } catch {
      showToast('Payment approval simulation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0F1420] border border-[#1E2638] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0A0E17] border-b border-[#1A2335] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              TB
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Telebirr Payment Gateway</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  SANDBOX
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Ethio Telecom Telebirr Integration Module</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Payment vs Integration Documentation */}
        <div className="flex border-b border-[#1A2335] bg-[#0C1019] px-4 pt-2 text-xs">
          <button
            onClick={() => setActiveTab('payment')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'payment'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sandbox Payment Flow
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'docs'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ethio Telecom Specs</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'payment' ? (
            <div>
              {/* Sandbox notice */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4 text-[11px] text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>Sandbox Testing Mode:</strong> This flow generates an illustrative demonstration deposit using practice Ethiopian Birr (ETB). No real bank or mobile funds are transferred. Sensitive credentials (PIN, OTP) are never requested.
                </span>
              </div>

              {step === 'input' && (
                <form onSubmit={handleInitiate} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Telebirr Registered Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="09XXXXXXXX or 07XXXXXXXX"
                        className="w-full bg-[#141B28] border border-[#222E42] rounded-lg py-2.5 pl-9 pr-3 text-white font-mono focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Ethiopian format (+251 / 09... / 07...)
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Deposit Amount (ETB)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {[500, 1000, 2500, 5000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmount(val)}
                          className={`py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors ${
                            amount === val
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : 'bg-[#141B28] text-slate-300 border-[#222E42] hover:bg-[#1A2335]'
                          }`}
                        >
                          +{val}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min="10"
                      max="100000"
                      value={amount}
                      onChange={(e) => setAmount(Math.max(10, parseFloat(e.target.value) || 10))}
                      className="w-full bg-[#141B28] border border-[#222E42] rounded-lg py-2.5 px-3 text-white font-mono focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Initiating Gateway...' : 'Initiate Telebirr Deposit'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {step === 'ussd_pending' && (
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">USSD Push Notification Sent</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      A simulated USSD authorization prompt has been dispatched to{' '}
                      <strong className="text-emerald-400 font-mono">{phoneNumber}</strong> for{' '}
                      <strong className="text-white">{amount.toLocaleString()} ETB</strong>.
                    </p>
                    <div className="mt-2 text-[11px] font-mono text-slate-500">
                      Tx Reference: {txRef}
                    </div>
                  </div>

                  {/* Simulated Mobile Prompt Card */}
                  <div className="p-4 bg-[#0A0D14] rounded-xl border border-[#1E2638] text-left max-w-sm mx-auto space-y-2 text-xs">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">
                      Simulated USSD Prompt:
                    </div>
                    <div className="font-mono text-slate-200">
                      "Confirm Zenith Arena payment of ETB {amount.toFixed(2)} to Merchant Shortcode #8921?"
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('input')}
                      className="px-4 py-2 bg-[#141B28] text-slate-300 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleSimulateApprove}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs"
                    >
                      {loading ? 'Processing Callback...' : 'Approve Sandbox Payment'}
                    </button>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Deposit Successful</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      <strong className="text-emerald-400">{amount.toLocaleString()} ETB</strong>{' '}
                      demo credits have been credited to your sandbox wallet.
                    </p>
                    <div className="mt-2 text-xs font-mono text-slate-500 bg-[#0A0E17] p-2 rounded max-w-xs mx-auto">
                      Ref: {txRef}
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Documentation Tab */
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#131A26] rounded-xl border border-[#1E2638] space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Production Ethio Telecom Prerequisites</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  To transition from this Sandbox Adapter to official live Telebirr transactions, the operator must complete:
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  {docs.requiredPrerequisites.map((req, i) => (
                    <div key={i} className="p-1.5 bg-[#0B0F17] rounded border border-[#192233]">
                      {req}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#131A26] rounded-xl border border-[#1E2638] text-[11px] font-mono text-slate-400 space-y-1">
                <div>API Endpoint: {docs.apiUrl}</div>
                <div>Callback Notify: {docs.notifyUrl}</div>
                <div>Signature: SHA256withRSA (2048-bit Private Key)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
