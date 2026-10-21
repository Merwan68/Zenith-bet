import React from 'react';
import { SportsEvent } from '../../types/sports';
import { Activity, Shield, X, Radio } from 'lucide-react';

interface LiveTrackerProps {
  event: SportsEvent;
  onClose?: () => void;
}

export const LiveTracker: React.FC<LiveTrackerProps> = ({ event, onClose }) => {
  const possession = event.stats?.possession || [50, 50];
  const shotsOnTarget = event.stats?.shotsOnTarget || [0, 0];
  const shotsOffTarget = event.stats?.shotsOffTarget || [0, 0];
  const corners = event.stats?.corners || [0, 0];
  const yellowCards = event.stats?.yellowCards || [0, 0];

  return (
    <div className="bg-[#0F1420] border border-[#1E273A] rounded-xl overflow-hidden shadow-xl mb-6">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0B0E17] border-b border-[#1E273A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>In-Play Match Center</span>
            <span className="text-emerald-400 font-mono">({event.matchTime})</span>
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1E273A]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Scoreboard & Field Visualization */}
      <div className="p-4">
        {/* Scoreboard */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#141B29] via-[#0E131E] to-[#141B29] border border-[#212C3F] mb-4">
          <div className="text-center flex-1">
            <div className="text-sm font-extrabold text-white">{event.homeTeam}</div>
            <div className="text-[11px] text-slate-400">Home</div>
          </div>

          <div className="px-6 py-2 bg-[#0A0D15] rounded-xl border border-[#222E42] text-center">
            <div className="font-mono text-2xl font-black text-emerald-400 tracking-wider">
              {event.homeScore ?? 0} : {event.awayScore ?? 0}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
              {event.matchTime}
            </div>
          </div>

          <div className="text-center flex-1">
            <div className="text-sm font-extrabold text-white">{event.awayTeam}</div>
            <div className="text-[11px] text-slate-400">Away</div>
          </div>
        </div>

        {/* 2D Synthetic Pitch Simulation */}
        <div className="relative h-28 rounded-lg bg-emerald-950/40 border border-emerald-800/40 overflow-hidden flex items-center justify-center p-2 mb-4">
          {/* Pitch lines */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-emerald-600/30" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-emerald-600/30" />
          <div className="w-16 h-16 rounded-full border border-emerald-600/30" />

          {/* Dynamic simulated ball attack indicator */}
          <div className="absolute left-[58%] top-[42%] flex items-center gap-1.5 animate-pulse bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/40 text-[10px] text-emerald-300 font-mono">
            <span>Dangerous Attack · {event.homeTeam}</span>
          </div>
        </div>

        {/* Live Match Stats Bar */}
        <div className="space-y-3 text-xs">
          {/* Possession */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-mono font-bold text-white">{possession[0]}%</span>
              <span className="uppercase text-[10px] tracking-wider">Ball Possession</span>
              <span className="font-mono font-bold text-white">{possession[1]}%</span>
            </div>
            <div className="w-full bg-[#1A2233] h-1.5 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${possession[0]}%` }}
              />
              <div
                className="bg-cyan-500 h-full transition-all duration-500"
                style={{ width: `${possession[1]}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1C2536] text-center text-[11px]">
            <div className="p-2 rounded bg-[#131A26]">
              <div className="text-slate-400 text-[10px]">Shots on Target</div>
              <div className="font-mono font-bold text-white">
                {shotsOnTarget[0]} - {shotsOnTarget[1]}
              </div>
            </div>
            <div className="p-2 rounded bg-[#131A26]">
              <div className="text-slate-400 text-[10px]">Total Shots</div>
              <div className="font-mono font-bold text-white">
                {shotsOnTarget[0] + shotsOffTarget[0]} - {shotsOnTarget[1] + shotsOffTarget[1]}
              </div>
            </div>
            <div className="p-2 rounded bg-[#131A26]">
              <div className="text-slate-400 text-[10px]">Corners</div>
              <div className="font-mono font-bold text-white">
                {corners[0]} - {corners[1]}
              </div>
            </div>
            <div className="p-2 rounded bg-[#131A26]">
              <div className="text-slate-400 text-[10px]">Yellow Cards</div>
              <div className="font-mono font-bold text-amber-400">
                {yellowCards[0]} - {yellowCards[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
