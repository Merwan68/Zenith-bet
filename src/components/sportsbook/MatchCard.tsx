import React, { useState } from 'react';
import { SportsEvent, MarketSelection } from '../../types/sports';
import { useApp } from '../../context/AppContext';
import { Star, ChevronDown, ChevronUp, Radio, Activity } from 'lucide-react';

interface MatchCardProps {
  event: SportsEvent;
  onOpenDetails?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ event, onOpenDetails }) => {
  const { betSlipSelections, addBetSelection, toggleFavoriteEvent, oddsFormat } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  // Format odds display
  const formatOdds = (odds: number) => {
    if (oddsFormat === 'decimal') return odds.toFixed(2);
    if (oddsFormat === 'fractional') {
      // Approximate fractional
      const num = Math.round((odds - 1) * 10);
      return `${num}/10`;
    }
    // American
    if (odds >= 2.0) {
      return `+${Math.round((odds - 1) * 100)}`;
    }
    return `-${Math.round(100 / (odds - 1))}`;
  };

  const mainMarket = event.markets.find((m) => m.category === 'main') || event.markets[0];

  const isSelectionActive = (selId: string) => {
    return betSlipSelections.some(
      (s) => s.eventId === event.id && s.selectionId === selId
    );
  };

  const handleSelectOdd = (e: React.MouseEvent, selection: MarketSelection) => {
    e.stopPropagation();
    addBetSelection({
      eventId: event.id,
      matchName: `${event.homeTeam} vs ${event.awayTeam}`,
      marketName: mainMarket.name,
      selectionId: selection.id,
      selectionName: selection.name,
      odds: selection.odds,
      sport: event.sport,
      isLive: event.isLive,
    });
  };

  return (
    <div className="bg-[#101520] hover:bg-[#121824] border border-[#1B2436] rounded-xl transition-all duration-150 overflow-hidden shadow-sm">
      {/* Top Match Header */}
      <div className="px-4 py-2.5 bg-[#0D121B] border-b border-[#1A2233] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavoriteEvent(event.id)}
            className="text-slate-500 hover:text-amber-400 transition-colors"
            title="Add to Favorites"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                event.isFavorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
          <span className="font-semibold text-slate-300">{event.league}</span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] text-slate-500">{event.country}</span>
        </div>

        <div className="flex items-center gap-3">
          {event.isLive ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE {event.matchTime}</span>
            </div>
          ) : (
            <span className="text-slate-500 text-[11px] font-mono">
              {new Date(event.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}

          <span className="text-[10px] text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">
            {event.provider}
          </span>
        </div>
      </div>

      {/* Teams and Scores */}
      <div
        onClick={onOpenDetails}
        className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex-1 space-y-2">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white hover:text-emerald-400 transition-colors">
              {event.homeTeam}
            </span>
            {event.isLive && (
              <span className="font-mono text-base font-extrabold text-emerald-400 px-2">
                {event.homeScore ?? 0}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white hover:text-emerald-400 transition-colors">
              {event.awayTeam}
            </span>
            {event.isLive && (
              <span className="font-mono text-base font-extrabold text-emerald-400 px-2">
                {event.awayScore ?? 0}
              </span>
            )}
          </div>

          {event.stats?.currentPeriodScore && (
            <div className="text-[10px] text-slate-500 font-mono">
              {event.stats.currentPeriodScore}
            </div>
          )}
        </div>

        {/* Odds Selections */}
        {mainMarket && (
          <div className="flex items-center gap-1.5 shrink-0">
            {mainMarket.selections.map((sel) => {
              const active = isSelectionActive(sel.id);
              const isUp = sel.oddsDirection === 'up';
              const isDown = sel.oddsDirection === 'down';

              return (
                <button
                  key={sel.id}
                  onClick={(e) => handleSelectOdd(e, sel)}
                  className={`min-w-[76px] py-2 px-2.5 rounded-lg border text-center transition-all ${
                    active
                      ? 'bg-emerald-500 border-emerald-400 text-black font-extrabold shadow-md shadow-emerald-500/20'
                      : isUp
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : isDown
                      ? 'bg-red-950/40 border-red-500/40 text-red-300'
                      : 'bg-[#151D2C] hover:bg-[#1A2335] border-[#222E44] text-slate-200'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 truncate mb-0.5">
                    {sel.name}
                  </div>
                  <div className="font-mono font-bold text-xs tabular-nums flex items-center justify-center gap-1">
                    {formatOdds(sel.odds)}
                    {isUp && <span className="text-[9px] text-emerald-400">▲</span>}
                    {isDown && <span className="text-[9px] text-red-400">▼</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Expand More Markets Accordion Toggle */}
      <div className="px-4 py-2 bg-[#0C1018] border-t border-[#171F2E] flex items-center justify-between text-[11px] text-slate-400">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors font-medium"
        >
          <span>+{event.markets.length} Markets Available</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {event.stats && (
          <button
            onClick={onOpenDetails}
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Match Statistics</span>
          </button>
        )}
      </div>

      {/* Expanded Markets */}
      {isExpanded && (
        <div className="p-4 bg-[#0A0E16] border-t border-[#171F2E] space-y-4">
          {event.markets.slice(1).map((mkt) => (
            <div key={mkt.id} className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {mkt.name}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {mkt.selections.map((sel) => {
                  const active = isSelectionActive(sel.id);
                  return (
                    <button
                      key={sel.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        addBetSelection({
                          eventId: event.id,
                          matchName: `${event.homeTeam} vs ${event.awayTeam}`,
                          marketName: mkt.name,
                          selectionId: sel.id,
                          selectionName: sel.name,
                          odds: sel.odds,
                          sport: event.sport,
                          isLive: event.isLive,
                        });
                      }}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between text-xs transition-colors ${
                        active
                          ? 'bg-emerald-500 border-emerald-400 text-black font-bold'
                          : 'bg-[#131A26] hover:bg-[#182233] border-[#222E42] text-slate-200'
                      }`}
                    >
                      <span className="truncate pr-2">{sel.name}</span>
                      <span className="font-mono font-bold tabular-nums">
                        {formatOdds(sel.odds)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
