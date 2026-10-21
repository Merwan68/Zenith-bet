import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SportsEvent, BetSelection, PlacedBet, OddsFormat } from '../types/sports';
import { CasinoGame } from '../types/casino';
import { UserProfile, AdminRole } from '../types/user';
import { WalletTransaction, CurrencyType, WithdrawalRequest, DepositRequest, BalanceType } from '../types/wallet';
import { LanguageCode, translations, Translations } from '../data/translations';
import { initialSportsEvents } from '../data/mockSportsData';
import { initialCasinoGames } from '../data/mockCasinoData';
import { audio } from '../services/audioService';
import {
  auth,
  db,
  googleProvider,
  initializeUserWalletAndBonus,
  createWithdrawalRequest,
  updateWithdrawalRequestStatus,
  createDepositRequest,
  adminUpdateDepositRequest,
  FirestoreWalletData,
  FirestoreWithdrawalRequest,
  FirestoreDepositRequest,
} from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';

export type NavigationPage =
  | 'home'
  | 'sports'
  | 'live_sports'
  | 'football'
  | 'basketball'
  | 'tennis'
  | 'volleyball'
  | 'esports'
  | 'casino'
  | 'live_casino'
  | 'slots'
  | 'keno'
  | 'crash'
  | 'promotions'
  | 'leaderboards'
  | 'account'
  | 'wallet'
  | 'withdraw'
  | 'transactions'
  | 'responsible_gaming'
  | 'help'
  | 'admin'
  | 'auth';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface AppContextType {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;

  // Firebase Auth & User
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, username: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;

  // Welcome Bonus Notification
  showWelcomeBonusModal: boolean;
  setShowWelcomeBonusModal: (show: boolean) => void;

  // Dual Balances (Main & Bonus)
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  balanceUSD: number;
  balanceETB: number; // Combined or active
  mainBalance: number; // Withdrawable Main Cash ETB
  bonusBalance: number; // Promotional Bonus Balance ETB
  transactions: WalletTransaction[];
  depositFunds: (amount: number, method: WalletTransaction['method'], reference: string, phone?: string) => void;
  withdrawFunds: (amount: number, method: WalletTransaction['method']) => boolean;

  // Withdrawal Requests System
  withdrawalRequests: WithdrawalRequest[];
  submitWithdrawal: (
    amount: number,
    balanceType: BalanceType,
    telebirrAccount: string,
    accountHolderName: string
  ) => Promise<WithdrawalRequest>;
  adminUpdateWithdrawal: (
    requestId: string,
    newStatus: 'Approved' | 'Rejected' | 'Completed',
    notes?: string
  ) => Promise<void>;

  // Personal Telebirr Deposit System
  depositRequests: DepositRequest[];
  submitDepositRequest: (
    amount: number,
    senderPhone: string,
    transactionCode: string,
    bonusApplied?: boolean
  ) => Promise<DepositRequest>;
  adminUpdateDeposit: (
    depositId: string,
    newStatus: 'Approved' | 'Rejected',
    notes?: string
  ) => Promise<void>;
  cashierTelebirrPhone: string;
  setCashierTelebirrPhone: (phone: string) => void;
  cashierTelebirrName: string;
  setCashierTelebirrName: (name: string) => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;

  // Mobile Navigation & Bet Slip Drawer State
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  isBetSlipOpen: boolean;
  setIsBetSlipOpen: (open: boolean) => void;

  // Sports & Odds
  sportsEvents: SportsEvent[];
  updateSportsEvent: (event: SportsEvent) => void;
  selectedEvent: SportsEvent | null;
  setSelectedEvent: (event: SportsEvent | null) => void;
  oddsFormat: OddsFormat;
  setOddsFormat: (fmt: OddsFormat) => void;
  toggleFavoriteEvent: (eventId: string) => void;

  // Bet Slip
  betSlipSelections: BetSelection[];
  addBetSelection: (selection: BetSelection) => void;
  removeBetSelection: (selectionId: string) => void;
  clearBetSlip: () => void;
  betSlipType: 'single' | 'accumulator';
  setBetSlipType: (type: 'single' | 'accumulator') => void;
  placedBets: PlacedBet[];
  placeBetSlip: (stake: number, useBonus?: boolean) => boolean;
  cashOutBet: (betId: string) => void;

  // Casino
  casinoGames: CasinoGame[];
  activeGame: CasinoGame | null;
  openGame: (game: CasinoGame) => void;
  closeGame: () => void;
  updateCasinoGame: (game: CasinoGame) => void;

  // Audio & Toasts
  isMuted: boolean;
  toggleAudio: () => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Auth Modal State
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'reset';
  setAuthModalMode: (mode: 'login' | 'register' | 'reset') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  // Greet first-time visitors with registration / login to claim 250 Br bonus
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'reset'>('register');
  const [showWelcomeBonusModal, setShowWelcomeBonusModal] = useState(false);

  // Cashier Telebirr Destination & Mobile Navigation
  const [cashierTelebirrPhone, setCashierTelebirrPhone] = useState('0960000000');
  const [cashierTelebirrName, setCashierTelebirrName] = useState('MERWAN ABDUSOMED (ZENITH CASHIER)');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);

  // Deposit Requests State
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([
    {
      id: 'DEP-INIT-01',
      userId: 'ZEN-98241',
      userEmail: 'merwanabdusomed@gmail.com',
      userName: 'Abebe_Bikila',
      amount: 500,
      senderPhone: '0911234567',
      receiverPhone: '0960000000',
      transactionCode: 'CJC899201F',
      status: 'Approved',
      bonusApplied: true,
      createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    },
    {
      id: 'DEP-INIT-02',
      userId: 'ZEN-10022',
      userEmail: 'chala@example.com',
      userName: 'Chala_K',
      amount: 1000,
      senderPhone: '0922883311',
      receiverPhone: '0960000000',
      transactionCode: 'CKD772109P',
      status: 'Pending',
      bonusApplied: true,
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    },
  ]);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    id: 'GUEST-001',
    username: 'Guest_Punter',
    email: 'merwanabdusomed@gmail.com',
    avatar: '🦁',
    vipLevel: 'Gold',
    vipPoints: 6450,
    vipNextLevelPoints: 10000,
    isEmailVerified: true,
    role: 'Super Admin',
    language: 'en',
    oddsFormat: 'decimal',
    registeredAt: '2026-02-14',
    responsibleGaming: {
      dailyDepositLimit: 5000,
      weeklyDepositLimit: 25000,
      sessionTimeoutMinutes: 60,
      realityCheckMinutes: 30,
      isSelfExcluded: false,
    },
  });

  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');
  const [oddsFormat, setOddsFormat] = useState<OddsFormat>('decimal');

  // Dual Balances
  const [currency, setCurrency] = useState<CurrencyType>('ETB');
  const [mainBalance, setMainBalance] = useState<number>(1000.0);
  const [bonusBalance, setBonusBalance] = useState<number>(250.0);
  const [balanceUSD, setBalanceUSD] = useState<number>(2450.0);

  // Combined ETB balance helper
  const balanceETB = mainBalance + bonusBalance;

  // Transactions Ledger
  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: 'TX-BONUS-INIT',
      type: 'promotion_reward',
      balanceType: 'bonus',
      amount: 250,
      currency: 'ETB',
      status: 'completed',
      method: 'Internal Ledger',
      reference: 'WB-ETB-WELCOME-250',
      description: 'Official 250 ETB Welcome Bonus for New Account Registration',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'TX-88310',
      type: 'deposit',
      balanceType: 'main',
      amount: 1000,
      currency: 'ETB',
      status: 'completed',
      method: 'Telebirr Sandbox',
      reference: 'TB-ETB-2026-928174',
      description: 'Telebirr Verified Deposit (*5678)',
      timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      telebirrPhone: '0911235678',
    },
  ]);

  // Withdrawal Requests State
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: 'WR-SAMPLE-01',
      userId: 'ZEN-98241',
      userEmail: 'merwanabdusomed@gmail.com',
      userName: 'HighRoller_Abebe',
      amount: 1500,
      balanceType: 'main',
      telebirrAccount: '0911234567',
      accountHolderName: 'Abebe Bikila',
      reference: 'WD-TB-2026-881920',
      status: 'Pending',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    },
  ]);

  // Sports & Bet slip
  const [sportsEvents, setSportsEvents] = useState<SportsEvent[]>(initialSportsEvents);
  const [selectedEvent, setSelectedEvent] = useState<SportsEvent | null>(initialSportsEvents[0]);
  const [betSlipSelections, setBetSlipSelections] = useState<BetSelection[]>([]);
  const [betSlipType, setBetSlipType] = useState<'single' | 'accumulator'>('single');
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);

  // Casino
  const [casinoGames, setCasinoGames] = useState<CasinoGame[]>(initialCasinoGames);
  const [activeGame, setActiveGame] = useState<CasinoGame | null>(null);

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setAuthLoading(false);

      if (fbUser) {
        const isAdmin = fbUser.email === 'merwanabdusomed@gmail.com';
        setUser((prev) => ({
          ...prev,
          id: fbUser.uid,
          email: fbUser.email || '',
          username: fbUser.displayName || fbUser.email?.split('@')[0] || 'ZenithPlayer',
          isEmailVerified: fbUser.emailVerified,
          role: isAdmin ? 'Super Admin' : 'Support Agent',
        }));

        if (isAdmin) {
          setAdminRole('Super Admin');
        }

        // Initialize Firestore Wallet & Atomically Award 250 ETB Welcome Bonus
        try {
          const res = await initializeUserWalletAndBonus(fbUser);
          if (res) {
            setMainBalance(res.wallet.mainBalance || 0);
            setBonusBalance(res.wallet.bonusBalance || 250);

            if (res.justAwardedBonus) {
              setShowWelcomeBonusModal(true);
              audio.playWinChime();
            }
          }

          // Real-time listener on user's wallet document
          const walletRef = doc(db, 'wallets', fbUser.uid);
          onSnapshot(walletRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data() as FirestoreWalletData;
              setMainBalance(data.mainBalance ?? 0);
              setBonusBalance(data.bonusBalance ?? 0);
            }
          });

          // Fetch withdrawal requests for this user (or all if admin)
          const wrQuery = isAdmin
            ? collection(db, 'withdrawalRequests')
            : query(collection(db, 'withdrawalRequests'), where('userId', '==', fbUser.uid));

          onSnapshot(wrQuery, (snapshot) => {
            const list: WithdrawalRequest[] = [];
            snapshot.forEach((d) => list.push(d.data() as WithdrawalRequest));
            if (list.length > 0) {
              setWithdrawalRequests(list);
            }
          });

          // Fetch personal Telebirr deposit requests for this user (or all if admin)
          const depQuery = isAdmin
            ? collection(db, 'depositRequests')
            : query(collection(db, 'depositRequests'), where('userId', '==', fbUser.uid));

          onSnapshot(depQuery, (snapshot) => {
            const list: DepositRequest[] = [];
            snapshot.forEach((d) => list.push(d.data() as DepositRequest));
            if (list.length > 0) {
              setDepositRequests(list);
            }
          });
        } catch (err) {
          console.warn('Firebase Wallet Sync Notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [showToast]);

  // Auth Operations
  const loginWithEmail = async (email: string, pass: string) => {
    try {
      audio.playClick();
      await signInWithEmailAndPassword(auth, email, pass);
      setIsAuthModalOpen(false);
      showToast('Logged in successfully to Zenith Arena', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      showToast(msg, 'error');
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, username: string) => {
    try {
      audio.playClick();
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const res = await initializeUserWalletAndBonus(cred.user, username);
      if (res?.justAwardedBonus) {
        setShowWelcomeBonusModal(true);
      }
      setIsAuthModalOpen(false);
      showToast('Account created! 250 ETB Welcome Bonus awarded!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      showToast(msg, 'error');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      audio.playClick();
      const cred = await signInWithPopup(auth, googleProvider);
      const res = await initializeUserWalletAndBonus(cred.user);
      if (res?.justAwardedBonus) {
        setShowWelcomeBonusModal(true);
      }
      setIsAuthModalOpen(false);
      showToast('Signed in with Google', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in cancelled or failed';
      showToast(msg, 'error');
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToast('Password reset link sent to ' + email, 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send password reset email';
      showToast(msg, 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setFirebaseUser(null);
      setUser((prev) => ({
        ...prev,
        id: 'GUEST-001',
        username: 'Guest_Punter',
        email: '',
        role: undefined,
      }));
      showToast('Signed out of session', 'info');
    } catch {
      showToast('Error during sign out', 'error');
    }
  };

  // Language switcher
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const toggleAudio = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
    showToast(muted ? 'Sound muted' : 'Sound enabled', 'info');
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile preferences updated', 'success');
  };

  // Odds ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSportsEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (!event.isLive) return event;
          if (Math.random() < 0.25 && event.markets.length > 0) {
            const marketIndex = Math.floor(Math.random() * event.markets.length);
            const market = event.markets[marketIndex];
            const selIndex = Math.floor(Math.random() * market.selections.length);
            const sel = market.selections[selIndex];
            const delta = Math.random() * 0.14 - 0.07;
            const newOdds = Math.max(1.05, Number((sel.odds + delta).toFixed(2)));
            const direction = newOdds > sel.odds ? 'up' : newOdds < sel.odds ? 'down' : 'same';

            const updatedSelections = [...market.selections];
            updatedSelections[selIndex] = {
              ...sel,
              previousOdds: sel.odds,
              odds: newOdds,
              oddsDirection: direction,
            };

            const updatedMarkets = [...event.markets];
            updatedMarkets[marketIndex] = { ...market, selections: updatedSelections };
            return { ...event, markets: updatedMarkets };
          }
          return event;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateSportsEvent = (event: SportsEvent) => {
    setSportsEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    if (selectedEvent?.id === event.id) {
      setSelectedEvent(event);
    }
  };

  const toggleFavoriteEvent = (eventId: string) => {
    setSportsEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isFavorite: !e.isFavorite } : e))
    );
    audio.playClick();
  };

  // Bet slip handling with Bonus Balance support!
  const addBetSelection = (sel: BetSelection) => {
    audio.playClick();
    setBetSlipSelections((prev) => {
      const existingSame = prev.find(
        (s) => s.eventId === sel.eventId && s.selectionId === sel.selectionId
      );
      if (existingSame) {
        return prev.filter((s) => s.selectionId !== sel.selectionId);
      }
      const filtered = prev.filter(
        (s) => !(s.eventId === sel.eventId && s.marketName === sel.marketName)
      );
      const updated = [...filtered, sel];
      if (updated.length > 1) {
        setBetSlipType('accumulator');
      }
      return updated;
    });
    showToast(`Added ${sel.selectionName} (${sel.odds}) to Bet Slip`, 'info');
  };

  const removeBetSelection = (selectionId: string) => {
    audio.playClick();
    setBetSlipSelections((prev) => {
      const remaining = prev.filter((s) => s.selectionId !== selectionId);
      if (remaining.length <= 1) {
        setBetSlipType('single');
      }
      return remaining;
    });
  };

  const clearBetSlip = () => {
    audio.playClick();
    setBetSlipSelections([]);
  };

  const placeBetSlip = (stake: number, useBonus = false): boolean => {
    if (stake <= 0) {
      showToast('Please enter a valid stake amount', 'warning');
      return false;
    }

    if (currency === 'ETB') {
      const targetBal = useBonus ? bonusBalance : mainBalance;
      if (stake > targetBal) {
        showToast(
          `Insufficient ${useBonus ? 'bonus' : 'main'} balance. Available: ${targetBal.toLocaleString()} ETB`,
          'error'
        );
        return false;
      }

      if (useBonus) {
        setBonusBalance((prev) => Number((prev - stake).toFixed(2)));
      } else {
        setMainBalance((prev) => Number((prev - stake).toFixed(2)));
      }
    } else {
      if (stake > balanceUSD) {
        showToast('Insufficient USD demo balance.', 'error');
        return false;
      }
      setBalanceUSD((prev) => Number((prev - stake).toFixed(2)));
    }

    let totalOdds = 1;
    if (betSlipType === 'single') {
      totalOdds = betSlipSelections[0]?.odds || 1;
    } else {
      totalOdds = Number(betSlipSelections.reduce((acc, s) => acc * s.odds, 1).toFixed(2));
    }

    const potentialPayout = Number((stake * totalOdds).toFixed(2));

    const newBet: PlacedBet = {
      id: `BET-${Math.floor(10000 + Math.random() * 90000)}`,
      type: betSlipType,
      selections: [...betSlipSelections],
      totalStake: stake,
      totalOdds,
      potentialPayout,
      currency,
      status: 'pending',
      cashoutValue: Number((stake * 0.85).toFixed(2)),
      placedAt: new Date().toISOString(),
    };

    setPlacedBets((prev) => [newBet, ...prev]);

    const tx: WalletTransaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'bet_placed',
      balanceType: useBonus ? 'bonus' : 'main',
      amount: stake,
      currency,
      status: 'completed',
      method: 'Internal Ledger',
      reference: newBet.id,
      description: `Wager: ${newBet.type === 'accumulator' ? 'Accumulator (' + betSlipSelections.length + ' picks)' : betSlipSelections[0].matchName} (${useBonus ? 'Bonus Balance' : 'Main Cash'})`,
      timestamp: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    audio.playBetPlaced();
    setBetSlipSelections([]);
    showToast(`Bet placed! Est. return: ${potentialPayout} ${currency}`, 'success');
    return true;
  };

  const cashOutBet = (betId: string) => {
    const bet = placedBets.find((b) => b.id === betId);
    if (!bet || bet.status !== 'pending' || !bet.cashoutValue) return;

    const amount = bet.cashoutValue;
    if (bet.currency === 'USD') {
      setBalanceUSD((prev) => Number((prev + amount).toFixed(2)));
    } else {
      setMainBalance((prev) => Number((prev + amount).toFixed(2)));
    }

    setPlacedBets((prev) =>
      prev.map((b) =>
        b.id === betId ? { ...b, status: 'cashed_out', settledAt: new Date().toISOString() } : b
      )
    );

    const tx: WalletTransaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'bet_payout',
      balanceType: 'main',
      amount,
      currency: bet.currency,
      status: 'completed',
      method: 'Internal Ledger',
      reference: `CO-${bet.id}`,
      description: `Early Cash Out for Bet #${bet.id}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    audio.playWinChime();
    showToast(`Cashed out early for ${amount} ${bet.currency}!`, 'success');
  };

  // Wallet handling
  const depositFunds = (
    amount: number,
    method: WalletTransaction['method'],
    reference: string,
    phone?: string
  ) => {
    if (currency === 'USD') {
      setBalanceUSD((prev) => Number((prev + amount).toFixed(2)));
    } else {
      setMainBalance((prev) => Number((prev + amount).toFixed(2)));
    }

    const tx: WalletTransaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'deposit',
      balanceType: 'main',
      amount,
      currency,
      status: 'completed',
      method,
      reference,
      description: `${method} Deposit`,
      timestamp: new Date().toISOString(),
      telebirrPhone: phone,
    };
    setTransactions((prev) => [tx, ...prev]);
    audio.playWinChime();
    showToast(`Successfully deposited ${amount.toLocaleString()} ${currency}`, 'success');
  };

  const withdrawFunds = (amount: number, method: WalletTransaction['method']): boolean => {
    if (amount <= 0 || amount > mainBalance) {
      showToast('Invalid withdrawal amount or insufficient available main balance', 'error');
      return false;
    }

    setMainBalance((prev) => Number((prev - amount).toFixed(2)));

    const tx: WalletTransaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'withdrawal',
      balanceType: 'main',
      amount,
      currency,
      status: 'completed',
      method,
      reference: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
      description: `${method} Withdrawal`,
      timestamp: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);
    showToast(`Withdrawal of ${amount.toLocaleString()} ${currency} processed`, 'success');
    return true;
  };

  // Submits a formal Withdrawal Request
  const submitWithdrawal = async (
    amount: number,
    balanceType: BalanceType,
    telebirrAccount: string,
    accountHolderName: string
  ): Promise<WithdrawalRequest> => {
    const curBal = balanceType === 'main' ? mainBalance : bonusBalance;
    if (amount <= 0 || amount > curBal) {
      throw new Error(`Insufficient ${balanceType} balance for withdrawal.`);
    }

    if (balanceType === 'bonus' && amount < 1000) {
      throw new Error('Minimum withdrawal threshold for promotional bonus balance is 1,000 ETB.');
    }

    const newReq: WithdrawalRequest = {
      id: `WR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
      amount,
      balanceType,
      telebirrAccount,
      accountHolderName,
      reference: `WD-TB-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct balance
    if (balanceType === 'main') {
      setMainBalance((prev) => Number((prev - amount).toFixed(2)));
    } else {
      setBonusBalance((prev) => Number((prev - amount).toFixed(2)));
    }

    setWithdrawalRequests((prev) => [newReq, ...prev]);

    // Record in local transactions ledger as pending
    const tx: WalletTransaction = {
      id: `TX-${newReq.id}`,
      type: 'withdrawal',
      balanceType,
      amount,
      currency: 'ETB',
      status: 'pending',
      method: 'Telebirr Official Payout',
      reference: newReq.reference,
      description: `Pending Withdrawal to Telebirr (${telebirrAccount})`,
      timestamp: newReq.createdAt,
      telebirrPhone: telebirrAccount,
    };
    setTransactions((prev) => [tx, ...prev]);

    // Also persist to Firestore if user is authenticated with Firebase
    if (firebaseUser) {
      try {
        await createWithdrawalRequest({
          userId: firebaseUser.uid,
          userEmail: firebaseUser.email || user.email,
          userName: user.username,
          amount,
          balanceType,
          telebirrAccount,
          accountHolderName,
        });
      } catch (e) {
        console.warn('Persisting to Firestore handled locally:', e);
      }
    }

    audio.playClick();
    showToast('Your withdrawal request is pending review.', 'info');
    return newReq;
  };

  // Administrator Status Update on a Withdrawal Request
  const adminUpdateWithdrawal = async (
    requestId: string,
    newStatus: 'Approved' | 'Rejected' | 'Completed',
    notes?: string
  ): Promise<void> => {
    const target = withdrawalRequests.find((w) => w.id === requestId);
    if (!target) return;

    // If rejected, refund the balance
    if (newStatus === 'Rejected' && target.status === 'Pending') {
      if (target.balanceType === 'main') {
        setMainBalance((prev) => Number((prev + target.amount).toFixed(2)));
      } else {
        setBonusBalance((prev) => Number((prev + target.amount).toFixed(2)));
      }
    }

    setWithdrawalRequests((prev) =>
      prev.map((w) =>
        w.id === requestId
          ? {
              ...w,
              status: newStatus,
              reviewedBy: user.email,
              reviewNotes: notes || '',
              updatedAt: new Date().toISOString(),
            }
          : w
      )
    );

    // Update transactions ledger status
    setTransactions((prev) =>
      prev.map((t) =>
        t.reference === target.reference
          ? {
              ...t,
              status:
                newStatus === 'Completed'
                  ? 'completed'
                  : newStatus === 'Rejected'
                  ? 'cancelled'
                  : 'pending',
            }
          : t
      )
    );

    // If Firebase authenticated, update Firestore
    if (firebaseUser) {
      try {
        await updateWithdrawalRequestStatus(
          requestId,
          newStatus,
          { id: firebaseUser.uid, email: user.email, role: adminRole },
          notes
        );
      } catch (err) {
        console.warn('Firestore update warning:', err);
      }
    }

    showToast(`Withdrawal #${target.reference} marked as ${newStatus}`, 'success');
  };

  // Submit proof of deposit to personal Telebirr account
  const submitDepositRequest = async (
    amount: number,
    senderPhone: string,
    transactionCode: string,
    bonusApplied: boolean = true
  ): Promise<DepositRequest> => {
    if (amount < 10) {
      throw new Error('Minimum deposit amount is 10 ETB / Br.');
    }
    if (!transactionCode || transactionCode.trim().length < 5) {
      throw new Error('Please enter a valid Telebirr transaction confirmation code from your SMS.');
    }

    const newDep: DepositRequest = {
      id: `DEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
      amount,
      senderPhone,
      receiverPhone: cashierTelebirrPhone,
      transactionCode: transactionCode.toUpperCase().trim(),
      status: 'Pending',
      bonusApplied,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDepositRequests((prev) => [newDep, ...prev]);

    const tx: WalletTransaction = {
      id: `TX-${newDep.id}`,
      type: 'deposit',
      balanceType: 'main',
      amount,
      currency: 'ETB',
      status: 'pending',
      method: 'Telebirr Sandbox',
      reference: newDep.transactionCode,
      description: `Telebirr Deposit to ${cashierTelebirrPhone} (Pending verification)`,
      telebirrPhone: senderPhone,
      timestamp: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);

    if (firebaseUser) {
      try {
        await createDepositRequest({
          userId: firebaseUser.uid,
          userEmail: firebaseUser.email || '',
          userName: user.username,
          amount,
          senderPhone,
          receiverPhone: cashierTelebirrPhone,
          transactionCode,
          bonusApplied,
        });
      } catch (e) {
        console.warn('Firestore deposit sync notice:', e);
      }
    }

    showToast(`Deposit proof of ${amount} Br submitted! Operator is verifying transaction code.`, 'success');
    return newDep;
  };

  // Administrator Action: Approves or Rejects player Telebirr deposit proof
  const adminUpdateDeposit = async (
    depositId: string,
    newStatus: 'Approved' | 'Rejected',
    notes?: string
  ): Promise<void> => {
    const target = depositRequests.find((d) => d.id === depositId);
    if (!target) return;

    if (newStatus === 'Approved') {
      const matchBonus = target.bonusApplied ? Math.min(1000, target.amount) : 0;
      setMainBalance((prev) => Number((prev + target.amount).toFixed(2)));
      if (matchBonus > 0) {
        setBonusBalance((prev) => Number((prev + matchBonus).toFixed(2)));
      }
      showToast(`Deposit #${target.transactionCode} approved! Credited ${target.amount} Br to ${target.userName}`, 'success');
      audio.playWinChime();
    } else {
      showToast(`Deposit #${target.transactionCode} rejected: ${notes || 'Verification failed'}`, 'warning');
    }

    setDepositRequests((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? { ...d, status: newStatus, notes, updatedAt: new Date().toISOString() }
          : d
      )
    );

    setTransactions((prev) =>
      prev.map((t) =>
        t.reference === target.transactionCode
          ? { ...t, status: newStatus === 'Approved' ? 'completed' : 'cancelled' }
          : t
      )
    );

    if (firebaseUser) {
      try {
        await adminUpdateDepositRequest(
          depositId,
          newStatus,
          { id: firebaseUser.uid, email: user.email, role: adminRole },
          notes
        );
      } catch (e) {
        console.warn('Firestore update deposit notice:', e);
      }
    }
  };

  // Casino modal
  const openGame = (game: CasinoGame) => {
    audio.playClick();
    setActiveGame(game);
  };

  const closeGame = () => {
    audio.playClick();
    setActiveGame(null);
  };

  const updateCasinoGame = (game: CasinoGame) => {
    setCasinoGames((prev) => prev.map((g) => (g.id === game.id ? game : g)));
    showToast(`Game "${game.name}" settings updated`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        language,
        setLanguage,
        t: translations[language],

        firebaseUser,
        authLoading,
        user,
        updateUser,
        adminRole,
        setAdminRole,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        sendPasswordReset,
        logout,

        showWelcomeBonusModal,
        setShowWelcomeBonusModal,

        currency,
        setCurrency,
        balanceUSD,
        balanceETB,
        mainBalance,
        bonusBalance,
        transactions,
        depositFunds,
        withdrawFunds,

        withdrawalRequests,
        submitWithdrawal,
        adminUpdateWithdrawal,

        depositRequests,
        submitDepositRequest,
        adminUpdateDeposit,
        cashierTelebirrPhone,
        setCashierTelebirrPhone,
        cashierTelebirrName,
        setCashierTelebirrName,
        isDepositModalOpen,
        setIsDepositModalOpen,

        isMobileNavOpen,
        setIsMobileNavOpen,
        isBetSlipOpen,
        setIsBetSlipOpen,

        sportsEvents,
        updateSportsEvent,
        selectedEvent,
        setSelectedEvent,
        oddsFormat,
        setOddsFormat,
        toggleFavoriteEvent,

        betSlipSelections,
        addBetSelection,
        removeBetSelection,
        clearBetSlip,
        betSlipType,
        setBetSlipType,
        placedBets,
        placeBetSlip,
        cashOutBet,

        casinoGames,
        activeGame,
        openGame,
        closeGame,
        updateCasinoGame,

        isMuted,
        toggleAudio,
        toasts,
        showToast,
        removeToast,

        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
