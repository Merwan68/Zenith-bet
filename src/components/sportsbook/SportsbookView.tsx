import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SportType, SportsEvent } from '../../types/sports';
import { MatchCard } from './MatchCard';
import { LiveTracker } from './LiveTracker';
import { sportsbookBannerImage } from '../../data/mockCasinoData';
import { Search, Flame, Radio, Calendar, Server, Star } from 'lucide-react';

interface SportsbookViewProps {
  initialSport?: SportType | 'all';
  liveOnly?: boolean;
}

export const SportsbookView: React.FC<SportsbookViewProps> = ({
  initialSport = 'all',
  liveOnly = false,
}) => {
  const { sportsEvents, selectedEvent, setSelectedEvent } = useApp();
  const [selectedSport, setSelectedSport] = useState<SportType | 'all'>(initialSport);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'live' | 'upcoming'>(
    liveOnly ? 'live' : 'all'
  );
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const sportsList: { id: SportType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Sports' },
    { id: 'football', label: 'Football' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'volleyball', label: 'Volleyball' },
    { id: 'esports', label: 'Esports' },
  ];

  // Filtering
  const filteredEvents = sportsEvents.filter((ev) => {
    if (selectedSport !== 'all' && ev.sport !== selectedSport) return false;
    if (viewMode === 'live' && !ev.isLive) return false;
    if (viewMode === 'upcoming' && ev.isLive) return false;
    if (favoritesOnly && !ev.isFavorite) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ev.homeTeam.toLowerCase().includes(q) ||
        ev.awayTeam.toLowerCase().includes(q) ||
        ev.league.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const liveCount = sportsEvents.filter((e) => e.isLive).length;

  return (
    <div className="space-y-6">
      {/* Hero Banner for Sportsbook */}
      <div className="relative rounded-2xl overflow-hidden border border-[#1C263A] shadow-2xl h-56 md:h-64 flex items-end">
        <img
          src={sportsbookBannerImage}
          alt="Zenith Arena Sportsbook"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/70 to-transparent" />

        <div className="relative z-10 p-6 md:p-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GLOBAL SPORTSBOOK ODDS FEED · SECURE ADAPTER LAYER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
            International Sports Betting & In-Play Markets
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Real-time odds feeds across Premier League, NBA, Wimbledon, and esports championships with comprehensive Asian handicaps and cashout.
          </p>
        </div>
      </div>

      {/* Provider Status Indicator Strip */}
      <div className="p-3 bg-[#0F1420] border border-[#1A2335] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Server className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">Sports Provider Adapter:</span>
          <span className="font-mono text-emerald-400">Sportradar Feed (Staging Sandbox)</span>
          <span className="text-slate-500">·</span>
          <span className="text-[11px] text-slate-400">Latency: 14ms · 100% Verified Sandbox</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Simulated live score updates active every 5s
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Category Pills & View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Sports categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {sportsList.map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSelectedSport(sp.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSport === sp.id
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'bg-[#121824] hover:bg-[#182233] text-slate-300 border border-[#1E2638]'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>

          {/* Live vs Upcoming vs Favorites */}
          <div className="flex items-center gap-1 bg-[#121824] p-1 rounded-lg border border-[#1E2638] shrink-0">
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                viewMode === 'all' && !favoritesOnly
                  ? 'bg-[#1C2538] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => {
                setViewMode('live');
                setFavoritesOnly(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 ${
                viewMode === 'live'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Live In-Play ({liveCount})</span>
            </button>
            <button
              onClick={() => {
                setViewMode('upcoming');
                setFavoritesOnly(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                viewMode === 'upcoming'
                  ? 'bg-[#1C2538] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`p-1.5 rounded ${
                favoritesOnly ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-white'
              }`}
              title="Filter Starred Favorites"
            >
              <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams, tournaments, leagues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101521] border border-[#1B2335] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Selected Live Match Tracker if open */}
      {selectedEvent && selectedEvent.isLive && (
        <LiveTracker
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Events Grid */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-[#0F1420] border border-[#1A2234] rounded-xl text-slate-400 text-xs">
            No matches found for the selected sport or search query.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <MatchCard
              key={event.id}
              event={event}
              onOpenDetails={() => setSelectedEvent(event)}
            />
          ))
        )}
      </div>
    </div>
  );
};
