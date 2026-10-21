import { SportsEvent } from '../types/sports';

export const initialSportsEvents: SportsEvent[] = [
  // Live Football
  {
    id: 'fb-live-1',
    sport: 'football',
    league: 'Premier League',
    country: 'England',
    homeTeam: 'Arsenal',
    awayTeam: 'Manchester City',
    homeScore: 2,
    awayScore: 1,
    isLive: true,
    matchTime: "73'",
    startTime: new Date(Date.now() - 73 * 60 * 1000).toISOString(),
    status: 'live',
    provider: 'Sportradar',
    isSimulated: true,
    stats: {
      possession: [54, 46],
      shotsOnTarget: [6, 4],
      shotsOffTarget: [5, 7],
      corners: [6, 5],
      yellowCards: [2, 3],
      redCards: [0, 0],
      currentPeriodScore: '2nd Half',
    },
    markets: [
      {
        id: 'm-1x2',
        name: 'Match Winner (1X2)',
        category: 'main',
        selections: [
          { id: 'sel-1', name: 'Arsenal', odds: 1.62, oddsDirection: 'up', status: 'active' },
          { id: 'sel-x', name: 'Draw', odds: 3.45, oddsDirection: 'same', status: 'active' },
          { id: 'sel-2', name: 'Man City', odds: 5.80, oddsDirection: 'down', status: 'active' },
        ],
      },
      {
        id: 'm-ou25',
        name: 'Total Goals (Over / Under 3.5)',
        category: 'goals',
        selections: [
          { id: 'sel-o35', name: 'Over 3.5 Goals', odds: 2.15, status: 'active' },
          { id: 'sel-u35', name: 'Under 3.5 Goals', odds: 1.68, status: 'active' },
        ],
      },
      {
        id: 'm-btts',
        name: 'Both Teams to Score',
        category: 'goals',
        selections: [
          { id: 'sel-btts-y', name: 'Yes', odds: 1.15, status: 'active' },
          { id: 'sel-btts-n', name: 'No', odds: 4.90, status: 'active' },
        ],
      },
      {
        id: 'm-hc',
        name: 'Asian Handicap (-0.5)',
        category: 'main',
        selections: [
          { id: 'sel-hc-1', name: 'Arsenal (-0.5)', odds: 1.64, status: 'active' },
          { id: 'sel-hc-2', name: 'Man City (+0.5)', odds: 2.24, status: 'active' },
        ],
      },
    ],
  },
  {
    id: 'fb-live-2',
    sport: 'football',
    league: 'Champions League',
    country: 'Europe',
    homeTeam: 'Real Madrid',
    awayTeam: 'Bayern Munich',
    homeScore: 1,
    awayScore: 1,
    isLive: true,
    matchTime: "61'",
    startTime: new Date(Date.now() - 61 * 60 * 1000).toISOString(),
    status: 'live',
    provider: 'Betradar',
    isSimulated: true,
    stats: {
      possession: [51, 49],
      shotsOnTarget: [5, 6],
      shotsOffTarget: [4, 4],
      corners: [4, 6],
      yellowCards: [1, 1],
      redCards: [0, 0],
      currentPeriodScore: '2nd Half',
    },
    markets: [
      {
        id: 'm-1x2',
        name: 'Match Winner (1X2)',
        category: 'main',
        selections: [
          { id: 'sel-rm-1', name: 'Real Madrid', odds: 2.35, oddsDirection: 'same', status: 'active' },
          { id: 'sel-rm-x', name: 'Draw', odds: 2.95, oddsDirection: 'up', status: 'active' },
          { id: 'sel-rm-2', name: 'Bayern Munich', odds: 3.10, oddsDirection: 'down', status: 'active' },
        ],
      },
      {
        id: 'm-ou25',
        name: 'Total Goals (Over / Under 2.5)',
        category: 'goals',
        selections: [
          { id: 'sel-o25', name: 'Over 2.5 Goals', odds: 1.82, status: 'active' },
          { id: 'sel-u25', name: 'Under 2.5 Goals', odds: 1.98, status: 'active' },
        ],
      },
      {
        id: 'm-next',
        name: 'Next Goal (Goal 3)',
        category: 'goals',
        selections: [
          { id: 'sel-ng-1', name: 'Real Madrid', odds: 2.10, status: 'active' },
          { id: 'sel-ng-none', name: 'No 3rd Goal', odds: 3.20, status: 'active' },
          { id: 'sel-ng-2', name: 'Bayern Munich', odds: 2.70, status: 'active' },
        ],
      },
    ],
  },
  {
    id: 'fb-eth-1',
    sport: 'football',
    league: 'Ethiopian Premier League',
    country: 'Ethiopia',
    homeTeam: 'Saint George SC',
    awayTeam: 'Fasil Kenema SC',
    homeScore: 1,
    awayScore: 0,
    isLive: true,
    matchTime: "52'",
    startTime: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
    status: 'live',
    provider: 'ZenithDemo',
    isSimulated: true,
    stats: {
      possession: [59, 41],
      shotsOnTarget: [4, 2],
      shotsOffTarget: [6, 3],
      corners: [5, 2],
      yellowCards: [1, 2],
      redCards: [0, 0],
    },
    markets: [
      {
        id: 'm-1x2',
        name: 'Match Winner (1X2)',
        category: 'main',
        selections: [
          { id: 'sel-sg-1', name: 'Saint George', odds: 1.48, oddsDirection: 'up', status: 'active' },
          { id: 'sel-sg-x', name: 'Draw', odds: 3.80, status: 'active' },
          { id: 'sel-sg-2', name: 'Fasil Kenema', odds: 7.20, oddsDirection: 'down', status: 'active' },
        ],
      },
      {
        id: 'm-ou15',
        name: 'Total Goals (Over / Under 1.5)',
        category: 'goals',
        selections: [
          { id: 'sel-o15', name: 'Over 1.5 Goals', odds: 1.75, status: 'active' },
          { id: 'sel-u15', name: 'Under 1.5 Goals', odds: 2.05, status: 'active' },
        ],
      },
    ],
  },

  // Live Basketball
  {
    id: 'bb-live-1',
    sport: 'basketball',
    league: 'NBA',
    country: 'USA',
    homeTeam: 'Boston Celtics',
    awayTeam: 'Golden State Warriors',
    homeScore: 89,
    awayScore: 84,
    isLive: true,
    matchTime: 'Q4 05:22',
    startTime: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    status: 'live',
    provider: 'Sportradar',
    isSimulated: true,
    stats: {
      shotsOnTarget: [34, 32],
      shotsOffTarget: [28, 30],
      currentPeriodScore: 'Q1: 28-26, Q2: 24-25, Q3: 25-22',
    },
    markets: [
      {
        id: 'm-bb-ml',
        name: 'Moneyline (Winner)',
        category: 'main',
        selections: [
          { id: 'sel-bos-1', name: 'Boston Celtics', odds: 1.42, oddsDirection: 'up', status: 'active' },
          { id: 'sel-gsw-2', name: 'GS Warriors', odds: 2.85, oddsDirection: 'down', status: 'active' },
        ],
      },
      {
        id: 'm-bb-spread',
        name: 'Point Spread (-4.5)',
        category: 'main',
        selections: [
          { id: 'sel-sp-1', name: 'Celtics (-4.5)', odds: 1.90, status: 'active' },
          { id: 'sel-sp-2', name: 'Warriors (+4.5)', odds: 1.90, status: 'active' },
        ],
      },
      {
        id: 'm-bb-tot',
        name: 'Total Points (Over / Under 205.5)',
        category: 'goals',
        selections: [
          { id: 'sel-tot-o', name: 'Over 205.5', odds: 1.88, status: 'active' },
          { id: 'sel-tot-u', name: 'Under 205.5', odds: 1.92, status: 'active' },
        ],
      },
    ],
  },

  // Live Tennis
  {
    id: 'tn-live-1',
    sport: 'tennis',
    league: 'Wimbledon Grand Slam',
    country: 'United Kingdom',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Jannik Sinner',
    homeScore: 2,
    awayScore: 1,
    isLive: true,
    matchTime: 'Set 4 (3-2)',
    startTime: new Date(Date.now() - 160 * 60 * 1000).toISOString(),
    status: 'live',
    provider: 'Betradar',
    isSimulated: true,
    stats: {
      currentPeriodScore: '6-4, 4-6, 7-6, 3-2',
      shotsOnTarget: [42, 38], // Aces/Winners
    },
    markets: [
      {
        id: 'm-tn-ml',
        name: 'Match Winner',
        category: 'main',
        selections: [
          { id: 'sel-alc', name: 'Carlos Alcaraz', odds: 1.55, oddsDirection: 'same', status: 'active' },
          { id: 'sel-sin', name: 'Jannik Sinner', odds: 2.45, oddsDirection: 'up', status: 'active' },
        ],
      },
      {
        id: 'm-tn-set4',
        name: 'Set 4 Winner',
        category: 'halves',
        selections: [
          { id: 'sel-s4-alc', name: 'Carlos Alcaraz', odds: 1.40, status: 'active' },
          { id: 'sel-s4-sin', name: 'Jannik Sinner', odds: 2.90, status: 'active' },
        ],
      },
    ],
  },

  // Live Volleyball
  {
    id: 'vb-live-1',
    sport: 'volleyball',
    league: 'FIVB Nations League',
    country: 'International',
    homeTeam: 'Poland',
    awayTeam: 'Brazil',
    homeScore: 2,
    awayScore: 2,
    isLive: true,
    matchTime: 'Set 5 (12-11)',
    startTime: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'live',
    provider: 'Sportradar',
    isSimulated: true,
    markets: [
      {
        id: 'm-vb-ml',
        name: 'Match Winner',
        category: 'main',
        selections: [
          { id: 'sel-pol', name: 'Poland', odds: 1.70, oddsDirection: 'up', status: 'active' },
          { id: 'sel-bra', name: 'Brazil', odds: 2.15, oddsDirection: 'down', status: 'active' },
        ],
      },
    ],
  },

  // Live Esports
  {
    id: 'es-live-1',
    sport: 'esports',
    league: 'CS2 Major Championship',
    country: 'Global',
    homeTeam: 'Natus Vincere',
    awayTeam: 'FaZe Clan',
    homeScore: 1,
    awayScore: 0,
    isLive: true,
    matchTime: 'Map 2 (R10-8)',
    startTime: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    status: 'live',
    provider: 'ZenithDemo',
    isSimulated: true,
    markets: [
      {
        id: 'm-es-ml',
        name: 'Match Winner (Best of 3)',
        category: 'main',
        selections: [
          { id: 'sel-navi', name: 'NaVi', odds: 1.38, status: 'active' },
          { id: 'sel-faze', name: 'FaZe', odds: 3.05, status: 'active' },
        ],
      },
      {
        id: 'm-es-m2',
        name: 'Map 2 Winner (Mirage)',
        category: 'main',
        selections: [
          { id: 'sel-m2-navi', name: 'NaVi', odds: 1.50, status: 'active' },
          { id: 'sel-m2-faze', name: 'FaZe', odds: 2.55, status: 'active' },
        ],
      },
    ],
  },

  // Upcoming Matches
  {
    id: 'fb-up-1',
    sport: 'football',
    league: 'Champions League',
    country: 'Europe',
    homeTeam: 'Liverpool FC',
    awayTeam: 'Paris Saint-Germain',
    isLive: false,
    startTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    status: 'scheduled',
    provider: 'Sportradar',
    isSimulated: true,
    markets: [
      {
        id: 'm-1x2',
        name: 'Match Winner (1X2)',
        category: 'main',
        selections: [
          { id: 'sel-liv-1', name: 'Liverpool', odds: 2.10, status: 'active' },
          { id: 'sel-liv-x', name: 'Draw', odds: 3.60, status: 'active' },
          { id: 'sel-liv-2', name: 'Paris SG', odds: 3.30, status: 'active' },
        ],
      },
      {
        id: 'm-ou25',
        name: 'Total Goals (Over / Under 2.5)',
        category: 'goals',
        selections: [
          { id: 'sel-liv-o25', name: 'Over 2.5', odds: 1.65, status: 'active' },
          { id: 'sel-liv-u25', name: 'Under 2.5', odds: 2.25, status: 'active' },
        ],
      },
    ],
  },
  {
    id: 'bb-up-1',
    sport: 'basketball',
    league: 'NBA',
    country: 'USA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Denver Nuggets',
    isLive: false,
    startTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    status: 'scheduled',
    provider: 'Sportradar',
    isSimulated: true,
    markets: [
      {
        id: 'm-bb-ml',
        name: 'Moneyline',
        category: 'main',
        selections: [
          { id: 'sel-lal', name: 'LA Lakers', odds: 2.20, status: 'active' },
          { id: 'sel-den', name: 'Denver Nuggets', odds: 1.70, status: 'active' },
        ],
      },
    ],
  },
  {
    id: 'es-up-1',
    sport: 'esports',
    league: 'Dota 2 The International',
    country: 'Global',
    homeTeam: 'Team Spirit',
    awayTeam: 'Gaimin Gladiators',
    isLive: false,
    startTime: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    status: 'scheduled',
    provider: 'ZenithDemo',
    isSimulated: true,
    markets: [
      {
        id: 'm-es-ml',
        name: 'Match Winner',
        category: 'main',
        selections: [
          { id: 'sel-ts', name: 'Team Spirit', odds: 1.85, status: 'active' },
          { id: 'sel-gg', name: 'Gaimin Gladiators', odds: 1.95, status: 'active' },
        ],
      },
    ],
  },
];
