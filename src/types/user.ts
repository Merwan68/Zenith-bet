export type AdminRole = 'Super Admin' | 'Content Manager' | 'Game Manager' | 'Support Agent';

export type VIPLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface ResponsibleGamingSettings {
  dailyDepositLimit: number; // 0 = unlimited
  weeklyDepositLimit: number;
  sessionTimeoutMinutes: number;
  realityCheckMinutes: number;
  isSelfExcluded: boolean;
  selfExclusionUntil?: string; // ISO date
}

export interface UserProfile {
  id: string; // e.g. ZEN-98241
  username: string;
  email: string;
  avatar: string;
  vipLevel: VIPLevel;
  vipPoints: number;
  vipNextLevelPoints: number;
  isEmailVerified: boolean;
  role?: AdminRole;
  language: 'en' | 'am' | 'ar';
  oddsFormat: 'decimal' | 'fractional' | 'american';
  registeredAt: string;
  responsibleGaming: ResponsibleGamingSettings;
}
