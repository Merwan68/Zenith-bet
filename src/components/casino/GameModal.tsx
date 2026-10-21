import React from 'react';
import { useApp } from '../../context/AppContext';
import { CasinoGame } from '../../types/casino';
import { CrashGame } from './games/CrashGame';
import { FruitSlots } from './games/FruitSlots';
import { KenoGame } from './games/KenoGame';
import { EuropeanRoulette } from './games/EuropeanRoulette';
import { CardTable } from './games/CardTable';
import { X, ShieldCheck, AlertCircle, ExternalLink, Code } from 'lucide-react';

interface GameModalProps {
  game: CasinoGame;
  onClose: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  const isPlayable = game.isPlayableDemo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-[#0B0E15] border border-[#1E2638] rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#080B10] border-b border-[#1A2233] flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-extrabold text-white tracking-tight">{game.name}</h2>
            <span className="text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">{game.provider}</span>

            {/* Clear Integration Type Badge */}
            {game.integrationType === 'playable_demo' && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                ✓ ORIGINAL PLAYABLE DEMO
              </span>
            )}
            {game.integrationType === 'sandbox' && (
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
                SANDBOX PROTOCOL READY
              </span>
            )}
            {game.integrationType === 'authorized_provider' && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
                PROVIDER AGREEMENT PENDING
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* If it's one of the playable demos */}
          {game.id === 'crash-aviator' && <CrashGame />}
          {game.id === 'fruit-bonanza-slot' && <FruitSlots />}
          {game.id === 'royal-keno-80' && <KenoGame />}
          {game.id === 'european-roulette-vip' && <EuropeanRoulette />}
          {game.id === 'blackjack-classic' && <CardTable initialGame="blackjack" />}
          {game.id === 'baccarat-squeeze' && <CardTable initialGame="baccarat" />}

          {/* If it's a third-party game awaiting real provider credentials */}
          {!isPlayable && (
            <div className="p-8 text-center bg-[#0E131E] rounded-xl border border-[#1C263A] space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>

              <div className="max-w-xl mx-auto space-y-2">
                <h3 className="text-base font-bold text-white">
                  Third-Party Provider Agreement Required
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In compliance with international licensing regulations, genuine third-party games from <strong className="text-white">{game.provider}</strong> require an active operator agreement and authenticated server-to-server Seamless Wallet credentials.
                </p>
              </div>

              {/* Integration Adapter Architecture Specs */}
              <div className="p-4 bg-[#080B11] rounded-lg border border-[#192233] text-left max-w-xl mx-auto space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Code className="w-4 h-4" />
                  <span>Adapter Specification: ICasinoGameProvider</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>· Integration Model: RESTful Seamless Wallet API</div>
                  <div>· Callback Endpoints: /api/v1/casino/balance, /api/v1/casino/settle</div>
                  <div>· Hash Algorithm: HMAC-SHA256 with Provider Secret Key</div>
                  <div>· Status: Modular Adapter Created (Awaiting Operator Live Keys)</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg"
                >
                  Return to Casino Lobby
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
