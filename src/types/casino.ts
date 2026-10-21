export type CasinoCategory =
  | 'popular'
  | 'new'
  | 'slots'
  | 'crash'
  | 'keno'
  | 'table'
  | 'roulette'
  | 'blackjack'
  | 'baccarat'
  | 'live_casino';

export interface CasinoGame {
  id: string;
  name: string;
  category: CasinoCategory;
  provider: string; // 'Zenith Originals', 'Pragmatic Play', 'Spribe', 'Evolution', 'NetEnt'
  thumbnail: string;
  rtp: number; // e.g. 97.5%
  volatility: 'Low' | 'Medium' | 'High' | 'Very High';
  isPlayableDemo: boolean;
  integrationType: 'playable_demo' | 'authorized_provider' | 'sandbox' | 'unavailable';
  minBet: number;
  maxBet: number;
  isPopular?: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
  description: string;
}

export interface CasinoProviderStatus {
  id: string;
  name: string;
  status: 'connected' | 'sandbox' | 'awaiting_agreement' | 'maintenance';
  activeGames: number;
  apiProtocol: 'REST / Seamless Wallet' | 'WebSocket Stream' | 'IFrame Web Launch';
  latencyMs: number;
  sandboxMode: boolean;
  documentationUrl: string;
}

export interface CrashRoundHistory {
  id: string;
  crashMultiplier: number;
  hash: string;
  seed: string;
  timestamp: string;
}

export interface KenoDrawHistory {
  id: string;
  pickedNumbers: number[];
  drawnNumbers: number[];
  hits: number;
  bet: number;
  win: number;
  timestamp: string;
}
