export type LanguageCode = 'en' | 'am' | 'ar';

export interface Translations {
  home: string;
  sports: string;
  liveSports: string;
  football: string;
  basketball: string;
  tennis: string;
  volleyball: string;
  esports: string;
  casino: string;
  liveCasino: string;
  slots: string;
  keno: string;
  crashGames: string;
  promotions: string;
  leaderboards: string;
  myAccount: string;
  wallet: string;
  transactionHistory: string;
  responsibleGaming: string;
  helpCenter: string;
  adminConsole: string;

  // Sports terms
  matchWinner: string;
  totalGoals: string;
  handicap: string;
  bothTeamsScore: string;
  betSlip: string;
  single: string;
  multi: string;
  odds: string;
  stake: string;
  potentialPayout: string;
  placeBet: string;
  cashOut: string;
  openBets: string;
  settledBets: string;

  // Casino terms
  playDemo: string;
  spin: string;
  clear: string;
  quickPick: string;
  betAmount: string;
  balance: string;
  win: string;
  totalWon: string;
  multiplier: string;
  crashed: string;
  deposit: string;
  withdraw: string;
  practiceCreditsNotice: string;
  telebirrNotice: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    home: 'Home',
    sports: 'Sports',
    liveSports: 'Live Sports',
    football: 'Football',
    basketball: 'Basketball',
    tennis: 'Tennis',
    volleyball: 'Volleyball',
    esports: 'Esports',
    casino: 'Casino',
    liveCasino: 'Live Casino',
    slots: 'Slots',
    keno: 'Keno',
    crashGames: 'Crash Games',
    promotions: 'Promotions',
    leaderboards: 'Leaderboards',
    myAccount: 'My Account',
    wallet: 'Wallet',
    transactionHistory: 'Transactions',
    responsibleGaming: 'Responsible Gaming',
    helpCenter: 'Help Center',
    adminConsole: 'Admin Console',

    matchWinner: 'Match Winner (1X2)',
    totalGoals: 'Total Goals',
    handicap: 'Handicap',
    bothTeamsScore: 'Both Teams to Score',
    betSlip: 'Bet Slip',
    single: 'Single',
    multi: 'Accumulator',
    odds: 'Odds',
    stake: 'Stake',
    potentialPayout: 'Est. Payout',
    placeBet: 'Place Bet',
    cashOut: 'Cash Out',
    openBets: 'Open Bets',
    settledBets: 'Settled',

    playDemo: 'Play Demo',
    spin: 'Spin',
    clear: 'Clear',
    quickPick: 'Quick Pick',
    betAmount: 'Bet Amount',
    balance: 'Demo Balance',
    win: 'Win',
    totalWon: 'Total Won',
    multiplier: 'Multiplier',
    crashed: 'CRASHED',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    practiceCreditsNotice: 'Sandbox Environment — All balances are virtual demo credits for testing.',
    telebirrNotice: 'Telebirr Sandbox — No real Ethiopian Birr are debited or transferred.',
  },
  am: {
    home: 'ዋና ገጽ',
    sports: 'ስፖርት',
    liveSports: 'የቀጥታ ስፖርት',
    football: 'እግር ኳስ',
    basketball: 'ቅርጫት ኳስ',
    tennis: 'ቴኒስ',
    volleyball: 'መረብ ኳስ',
    esports: 'ኢ-ስፖርት',
    casino: 'ካሲኖ',
    liveCasino: 'የቀጥታ ካሲኖ',
    slots: 'ስሎቶች',
    keno: 'ኬኖ',
    crashGames: 'ክራሽ ጨዋታዎች',
    promotions: 'ማስተዋወቂያዎች',
    leaderboards: 'የደረጃ ሰንጠረዥ',
    myAccount: 'የእኔ መለያ',
    wallet: 'ቦርሳ (ዋሌት)',
    transactionHistory: 'የግብይት ታሪክ',
    responsibleGaming: 'ኃላፊነት ያለው ቁማር',
    helpCenter: 'የእርዳታ ማዕከል',
    adminConsole: 'አስተዳዳሪ ዳሽቦርድ',

    matchWinner: 'የጨዋታው አሸናፊ',
    totalGoals: 'ጠቅላላ ግቦች',
    handicap: 'ሀንዲካፕ',
    bothTeamsScore: 'ሁለቱም ቡድኖች ግብ ያስቆጥራሉ',
    betSlip: 'የውርርድ ወረቀት',
    single: 'ነጠላ',
    multi: 'ድምር ውርርድ',
    odds: 'ዕድል (ኦድስ)',
    stake: 'መወራረጃ መጠን',
    potentialPayout: 'ሊገኝ የሚችል ትርፍ',
    placeBet: 'ውርርድ አስገባ',
    cashOut: 'ገንዘብ አውጣ (Cash Out)',
    openBets: 'ክፍት ውርርዶች',
    settledBets: 'የተጠናቀቁ',

    playDemo: 'ሙከራ ጀምር',
    spin: 'አሽከርክር',
    clear: 'አጽዳ',
    quickPick: 'ፈጣን ምርጫ',
    betAmount: 'የመወራረጃ መጠን',
    balance: 'የሙከራ ቀሪ ሂሳብ',
    win: 'ማሸነፍ',
    totalWon: 'ጠቅላላ ድል',
    multiplier: 'ማባዣ',
    crashed: 'ወድቋል',
    deposit: 'ተቀማጭ አድርግ',
    withdraw: 'አውጣ',
    practiceCreditsNotice: 'የሙከራ መድረክ — ሁሉም ቀሪ ሒሳቦች ለሙከራ የቀረቡ ምናባዊ ነጥቦች ናቸው።',
    telebirrNotice: 'ቴሌብር ሳንድቦክስ — ምንም አይነት እውነተኛ የኢትዮጵያ ብር አይቆረጥም።',
  },
  ar: {
    home: 'الرئيسية',
    sports: 'الرياضة',
    liveSports: 'مباشر',
    football: 'كرة القدم',
    basketball: 'كرة السلة',
    tennis: 'كرة المضرب',
    volleyball: 'الكرة الطائرة',
    esports: 'الرياضات الإلكترونية',
    casino: 'الكازينو',
    liveCasino: 'كازينو مباشر',
    slots: 'ماكينات القمار',
    keno: 'كينو',
    crashGames: 'ألعاب كراش',
    promotions: 'العروض الترويجية',
    leaderboards: 'قائمة المتصدرين',
    myAccount: 'حسابي',
    wallet: 'المحفظة',
    transactionHistory: 'سجل المعاملات',
    responsibleGaming: 'الألعاب المسؤولة',
    helpCenter: 'مركز المساعدة',
    adminConsole: 'لوحة الإدارة',

    matchWinner: 'الفائز بالمباراة (1X2)',
    totalGoals: 'مجموع الأهداف',
    handicap: 'فارق الأهداف',
    bothTeamsScore: 'كلا الفريقين يسجلان',
    betSlip: 'قسيمة الرهان',
    single: 'فردي',
    multi: 'تراكمي',
    odds: 'الاحتمالات',
    stake: 'مبلغ الرهان',
    potentialPayout: 'العائد المتوقع',
    placeBet: 'تأكيد الرهان',
    cashOut: 'سحب مبكر',
    openBets: 'رهانات جارية',
    settledBets: 'منتهية',

    playDemo: 'تجربة مجانية',
    spin: 'تدوير',
    clear: 'مسح',
    quickPick: 'اختيار سريع',
    betAmount: 'مبلغ الرهان',
    balance: 'الرصيد التجريبي',
    win: 'فوز',
    totalWon: 'إجمالي الأرباح',
    multiplier: 'المضاعف',
    crashed: 'تحطم',
    deposit: 'إيداع',
    withdraw: 'سحب',
    practiceCreditsNotice: 'بيئة تجريبية — جميع الأرصدة افتراضية للأغراض التجريبية فقط.',
    telebirrNotice: 'بيئة تيليبير التجريبية — لا يتم خصم أو تحويل أي أموال حقيقية.',
  },
};
