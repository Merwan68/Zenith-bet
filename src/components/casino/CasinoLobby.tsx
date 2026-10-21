import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CasinoCategory, CasinoGame } from '../../types/casino';
import { casinoBannerImage } from '../../data/mockCasinoData';
import { Search, Sparkles, Star, Play, Flame, Dices, Trophy, Layers, Filter } from 'lucide-react';

interface CasinoLobbyProps {
  initialCategory?: CasinoCategory | 'all';
}

export const CasinoLobby: React.FC<CasinoLobbyProps> = ({ initialCategory = 'all' }) => {
  const { casinoGames, openGame, toggleAudio } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<CasinoCategory | 'all'>(initialCategory);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(['crash-aviator', 'fruit-bonanza-slot']);

  const categories: { id: CasinoCategory | 'all'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Games', icon: Layers },
    { id: 'popular', label: 'Popular', icon: Flame },
    { id: 'crash', label: 'Crash Games', icon: Sparkles },
    { id: 'slots', label: 'Slots', icon: Trophy },
    { id: 'keno', label: 'Keno', icon: Dices },
    { id: 'roulette', label: 'Roulette', icon: Dices },
    { id: 'blackjack', label: 'Blackjack', icon: Dices },
    { id: 'baccarat', label: 'Baccarat', icon: Dices },
    { id: 'live_casino', label: 'Live Casino', icon: Dices },
  ];

  const providers = ['all', 'Zenith Originals', 'Spribe', 'Pragmatic Play', 'Evolution'];

  const toggleFav = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  const filteredGames = casinoGames.filter((game) => {
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'popular' && !game.isPopular) return false;
      if (selectedCategory !== 'popular' && game.category !== selectedCategory) return false;
    }
    if (selectedProvider !== 'all' && !game.provider.toLowerCase().includes(selectedProvider.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = game.name.toLowerCase().includes(q) || game.provider.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Casino Banner Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-[#1C263A] shadow-2xl h-56 md:h-64 flex items-end">
        <img
          src={casinoBannerImage}
          alt="Zenith VIP Casino Lobby"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/75 to-transparent" />

        <div className="relative z-10 p-6 md:p-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>PREMIUM CASINO & CERTIFIED PLAYABLE SANDBOX GAMES</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
            Interactive Casino & Multiplier Originals
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Play responsive crash rockets, retro Vegas fruit slots, 80-ball Keno, single-zero European Roulette, and card table classics.
          </p>
        </div>
      </div>

      {/* Category Tabs & Provider Switcher */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'bg-[#121824] hover:bg-[#182233] text-slate-300 border border-[#1E2638]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Provider Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 hidden sm:inline">Provider:</span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-[#121824] border border-[#1E2638] text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p === 'all' ? 'All Providers' : p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search games by name or studio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101521] border border-[#1B2335] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGames.map((game) => {
          const isFav = favorites.includes(game.id);
          return (
            <div
              key={game.id}
              onClick={() => openGame(game)}
              className="group bg-[#111622] hover:bg-[#141B28] border border-[#1B2436] hover:border-[#2A374F] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 shadow-sm flex flex-col"
            >
              {/* Artwork Box with Hover Overlay */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={game.thumbnail}
                  alt={game.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111622] via-transparent to-transparent opacity-80" />

                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFav(e, game.id)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-amber-400 transition-colors z-10"
                >
                  <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>

                {/* Play Button Hover Reveal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Integration Type Tag */}
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-slate-300 border border-slate-700">
                    {game.isPlayableDemo ? 'Playable Demo' : 'Provider Sandbox'}
                  </span>
                </div>
              </div>

              {/* Game Metadata Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors truncate">
                    {game.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {game.provider}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#1C2536] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>RTP: {game.rtp}%</span>
                  <span className="text-emerald-400 font-bold uppercase">{game.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
