export type SportType = 'football' | 'basketball' | 'tennis' | 'volleyball' | 'esports';

export interface MarketSelection {
  id: string;
  name: string; // 'Home', 'Draw', 'Away', 'Over 2.5', 'Under 2.5', etc.
  odds: number;
  previousOdds?: number;
  oddsDirection?: 'up' | 'down' | 'same';
  status: 'active' | 'suspended';
}

export interface Market {
  id: string;
  name: string; // 'Match Winner', 'Total Goals', 'Handicap', 'Both Teams to Score'
  category: 'main' | 'goals' | 'halves' | 'corners' | 'player_props';
  selections: MarketSelection[];
}

export interface MatchStats {
  possession?: [number, number]; // e.g. [58, 42]
  shotsOnTarget?: [number, number];
  shotsOffTarget?: [number, number];
  corners?: [number, number];
  yellowCards?: [number, number];
  redCards?: [number, number];
  currentPeriodScore?: string; // e.g. '1st Half: 1-0'
}

export interface SportsEvent {
  id: string;
  sport: SportType;
  league: string;
  country: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  isLive: boolean;
  matchTime?: string; // e.g. "68'", "Q3 04:15", "Set 2 4-2"
  startTime: string; // ISO string
  status: 'scheduled' | 'live' | 'finished' | 'suspended';
  stats?: MatchStats;
  markets: Market[];
  isFavorite?: boolean;
  provider: 'Sportradar' | 'Betradar' | 'ZenithDemo';
  isSimulated: boolean;
}

export interface BetSelection {
  eventId: string;
  matchName: string;
  marketName: string;
  selectionId: string;
  selectionName: string;
  odds: number;
  sport: SportType;
  isLive: boolean;
}

export interface PlacedBet {
  id: string;
  type: 'single' | 'accumulator';
  selections: BetSelection[];
  totalStake: number;
  totalOdds: number;
  potentialPayout: number;
  currency: 'USD' | 'ETB';
  status: 'pending' | 'won' | 'lost' | 'void' | 'cashed_out';
  cashoutValue?: number;
  placedAt: string;
  settledAt?: string;
}

export type OddsFormat = 'decimal' | 'fractional' | 'american';

export interface SportsProviderStatus {
  id: string;
  name: string;
  status: 'connected' | 'sandbox' | 'disconnected' | 'awaiting_keys';
  latencyMs: number;
  activeFeeds: number;
  lastUpdate: string;
  apiVersion: string;
  endpoint: string;
}
