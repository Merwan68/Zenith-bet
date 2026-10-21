export type CurrencyType = 'USD' | 'ETB';

export type TransactionType = 'deposit' | 'withdrawal' | 'bet_placed' | 'bet_payout' | 'promotion_reward';

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';

export type BalanceType = 'main' | 'bonus';

export interface WalletTransaction {
  id: string; // e.g. TX-98421
  type: TransactionType;
  balanceType?: BalanceType;
  amount: number;
  currency: CurrencyType;
  status: TransactionStatus;
  method: 'Telebirr Sandbox' | 'Bank Card Demo' | 'Crypto Sandbox' | 'Internal Ledger' | 'Telebirr Official Payout';
  reference: string; // e.g. TB-ETB-2026-449102
  description: string;
  timestamp: string;
  telebirrPhone?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  balanceType: BalanceType;
  telebirrAccount: string;
  accountHolderName: string;
  reference: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  reviewedBy?: string;
  reviewNotes?: string;
  payoutTxRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  senderPhone: string;
  receiverPhone: string;
  transactionCode: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  bonusApplied?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TelebirrSandboxState {
  step: 'idle' | 'phone_entry' | 'ussd_push_pending' | 'pin_prompt' | 'success' | 'failed';
  amount: number;
  phoneNumber: string;
  reference: string;
  error?: string;
}
