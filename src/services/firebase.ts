import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must pass firestoreDatabaseId according to Firebase skill specification
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Test connection on boot per Firebase skill guidelines
async function testConnection() {
  try {
    const { getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration or network status.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirestoreWalletData {
  userId: string;
  mainBalance: number;
  bonusBalance: number;
  currency: 'ETB' | 'USD';
  welcomeBonusClaimed: boolean;
  updatedAt: string;
}

export interface FirestoreWithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  balanceType: 'main' | 'bonus';
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

export interface FirestoreAuditLog {
  id: string;
  action: string;
  operatorId: string;
  operatorEmail: string;
  operatorRole: string;
  details: string;
  timestamp: string;
}

/**
 * Ensures user wallet exists in Firestore and atomically awards the 250 ETB welcome bonus
 * Exactly once per eligible account using a Firestore transaction.
 */
export async function initializeUserWalletAndBonus(user: FirebaseUser, displayName?: string): Promise<{
  wallet: FirestoreWalletData;
  justAwardedBonus: boolean;
}> {
  const walletRef = doc(db, 'wallets', user.uid);
  const userProfileRef = doc(db, 'users', user.uid);
  const WELCOME_BONUS_AMOUNT = 250;

  try {
    return await runTransaction(db, async (transaction) => {
      const walletSnap = await transaction.get(walletRef);
      const userProfileSnap = await transaction.get(userProfileRef);

      const now = new Date().toISOString();

      // Ensure user profile document exists
      if (!userProfileSnap.exists()) {
        const isAdmin = user.email === 'merwanabdusomed@gmail.com';
        transaction.set(userProfileRef, {
          id: user.uid,
          email: user.email || '',
          username: displayName || user.displayName || user.email?.split('@')[0] || 'ZenithPlayer',
          avatar: '🦁',
          vipLevel: 'Bronze',
          role: isAdmin ? 'super_admin' : 'player',
          createdAt: now,
        });
      }

      if (!walletSnap.exists()) {
        // Create initial wallet with 250 ETB welcome bonus
        const newWallet: FirestoreWalletData = {
          userId: user.uid,
          mainBalance: 0,
          bonusBalance: WELCOME_BONUS_AMOUNT,
          currency: 'ETB',
          welcomeBonusClaimed: true,
          updatedAt: now,
        };

        transaction.set(walletRef, newWallet);

        // Record bonus award in immutable transactions collection
        const txRef = doc(db, 'transactions', `TX-BONUS-${user.uid}`);
        transaction.set(txRef, {
          id: `TX-BONUS-${user.uid}`,
          userId: user.uid,
          type: 'bonus_award',
          balanceType: 'bonus',
          amount: WELCOME_BONUS_AMOUNT,
          currency: 'ETB',
          status: 'completed',
          reference: `WB-ETB-${user.uid.slice(0, 8).toUpperCase()}`,
          description: 'Official 250 ETB Welcome Bonus for New Account Registration',
          timestamp: now,
        });

        return { wallet: newWallet, justAwardedBonus: true };
      }

      const existingData = walletSnap.data() as FirestoreWalletData;

      // If wallet exists but bonus hasn't been claimed yet
      if (!existingData.welcomeBonusClaimed) {
        const updatedWallet: FirestoreWalletData = {
          ...existingData,
          bonusBalance: (existingData.bonusBalance || 0) + WELCOME_BONUS_AMOUNT,
          welcomeBonusClaimed: true,
          updatedAt: now,
        };

        transaction.update(walletRef, {
          bonusBalance: updatedWallet.bonusBalance,
          welcomeBonusClaimed: true,
          updatedAt: now,
        });

        const txRef = doc(db, 'transactions', `TX-BONUS-${user.uid}`);
        transaction.set(txRef, {
          id: `TX-BONUS-${user.uid}`,
          userId: user.uid,
          type: 'bonus_award',
          balanceType: 'bonus',
          amount: WELCOME_BONUS_AMOUNT,
          currency: 'ETB',
          status: 'completed',
          reference: `WB-ETB-${user.uid.slice(0, 8).toUpperCase()}`,
          description: 'Official 250 ETB Welcome Bonus for New Account Registration',
          timestamp: now,
        });

        return { wallet: updatedWallet, justAwardedBonus: true };
      }

      return { wallet: existingData, justAwardedBonus: false };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `wallets/${user.uid}`);
  }
}

/**
 * Creates a formal withdrawal request in Firestore and deducts the balance pending review.
 */
export async function createWithdrawalRequest(params: {
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  balanceType: 'main' | 'bonus';
  telebirrAccount: string;
  accountHolderName: string;
}): Promise<FirestoreWithdrawalRequest> {
  const requestId = `WR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const reference = `WD-TB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const reqDocRef = doc(db, 'withdrawalRequests', requestId);
  const walletRef = doc(db, 'wallets', params.userId);

  try {
    return await runTransaction(db, async (transaction) => {
      const walletSnap = await transaction.get(walletRef);
      if (!walletSnap.exists()) {
        throw new Error('Wallet not found');
      }

      const wallet = walletSnap.data() as FirestoreWalletData;

      // Validate balance
      if (params.balanceType === 'main') {
        if (wallet.mainBalance < params.amount) {
          throw new Error(`Insufficient main balance. Available: ${wallet.mainBalance} ETB`);
        }
        transaction.update(walletRef, {
          mainBalance: wallet.mainBalance - params.amount,
          updatedAt: now,
        });
      } else {
        // Bonus balance withdrawal requirements
        if (params.amount < 1000) {
          throw new Error('Minimum withdrawal threshold for bonus balance is 1,000 ETB subject to bonus wagering terms.');
        }
        if (wallet.bonusBalance < params.amount) {
          throw new Error(`Insufficient bonus balance. Available: ${wallet.bonusBalance} ETB`);
        }
        transaction.update(walletRef, {
          bonusBalance: wallet.bonusBalance - params.amount,
          updatedAt: now,
        });
      }

      const newRequest: FirestoreWithdrawalRequest = {
        id: requestId,
        userId: params.userId,
        userEmail: params.userEmail,
        userName: params.userName,
        amount: params.amount,
        balanceType: params.balanceType,
        telebirrAccount: params.telebirrAccount,
        accountHolderName: params.accountHolderName,
        reference,
        status: 'Pending',
        createdAt: now,
        updatedAt: now,
      };

      transaction.set(reqDocRef, newRequest);

      // Record in transactions ledger
      const txRef = doc(db, 'transactions', `TX-${requestId}`);
      transaction.set(txRef, {
        id: `TX-${requestId}`,
        userId: params.userId,
        type: 'withdrawal',
        balanceType: params.balanceType,
        amount: params.amount,
        currency: 'ETB',
        status: 'pending',
        reference,
        description: `Pending Withdrawal to Telebirr (${params.telebirrAccount})`,
        telebirrPhone: params.telebirrAccount,
        timestamp: now,
      });

      return newRequest;
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `withdrawalRequests/${requestId}`);
  }
}

/**
 * Admin action: updates withdrawal status and records an audit log
 */
export async function updateWithdrawalRequestStatus(
  requestId: string,
  newStatus: 'Approved' | 'Rejected' | 'Completed',
  operator: { id: string; email: string; role: string },
  notes?: string
): Promise<void> {
  const reqRef = doc(db, 'withdrawalRequests', requestId);
  const now = new Date().toISOString();

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(reqRef);
      if (!snap.exists()) {
        throw new Error('Withdrawal request not found.');
      }
      const data = snap.data() as FirestoreWithdrawalRequest;

      // If rejecting, refund user balance
      if (newStatus === 'Rejected' && data.status === 'Pending') {
        const walletRef = doc(db, 'wallets', data.userId);
        const walletSnap = await transaction.get(walletRef);
        if (walletSnap.exists()) {
          const w = walletSnap.data() as FirestoreWalletData;
          if (data.balanceType === 'main') {
            transaction.update(walletRef, {
              mainBalance: (w.mainBalance || 0) + data.amount,
              updatedAt: now,
            });
          } else {
            transaction.update(walletRef, {
              bonusBalance: (w.bonusBalance || 0) + data.amount,
              updatedAt: now,
            });
          }
        }
      }

      transaction.update(reqRef, {
        status: newStatus,
        reviewedBy: operator.email,
        reviewNotes: notes || '',
        updatedAt: now,
      });

      // Update corresponding transaction record if exists
      const txRef = doc(db, 'transactions', `TX-${requestId}`);
      transaction.set(
        txRef,
        {
          status: newStatus === 'Completed' ? 'completed' : newStatus === 'Rejected' ? 'cancelled' : 'pending',
        },
        { merge: true }
      );

      // Record Audit Log
      const logRef = doc(db, 'auditLogs', `AUDIT-${Date.now()}`);
      transaction.set(logRef, {
        id: `AUDIT-${Date.now()}`,
        action: `Withdrawal ${requestId} marked as ${newStatus}`,
        operatorId: operator.id,
        operatorEmail: operator.email,
        operatorRole: operator.role,
        details: `Reference: ${data.reference}, Amount: ${data.amount} ETB, Destination: ${data.telebirrAccount}. Notes: ${notes || 'N/A'}`,
        timestamp: now,
      });
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `withdrawalRequests/${requestId}`);
  }
}

export interface FirestoreDepositRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  senderPhone: string;
  receiverPhone: string;
  transactionCode: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  bonusApplied: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Creates a deposit request where player submits proof of transfer to official cashier Telebirr account
 */
export async function createDepositRequest(params: {
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  senderPhone: string;
  receiverPhone: string;
  transactionCode: string;
  bonusApplied?: boolean;
}): Promise<FirestoreDepositRequest> {
  const depositId = `DEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();
  const depDocRef = doc(db, 'depositRequests', depositId);

  try {
    const newDeposit: FirestoreDepositRequest = {
      id: depositId,
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName,
      amount: params.amount,
      senderPhone: params.senderPhone,
      receiverPhone: params.receiverPhone,
      transactionCode: params.transactionCode.toUpperCase().trim(),
      status: 'Pending',
      bonusApplied: params.bonusApplied ?? true,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(depDocRef, newDeposit);

    // Record pending transaction
    const txRef = doc(db, 'transactions', `TX-${depositId}`);
    await setDoc(txRef, {
      id: `TX-${depositId}`,
      userId: params.userId,
      type: 'deposit',
      balanceType: 'main',
      amount: params.amount,
      currency: 'ETB',
      status: 'pending',
      reference: params.transactionCode.toUpperCase().trim(),
      description: `Telebirr Deposit to ${params.receiverPhone} (Tx: ${params.transactionCode})`,
      telebirrPhone: params.senderPhone,
      timestamp: now,
    });

    return newDeposit;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `depositRequests/${depositId}`);
  }
}

/**
 * Admin action: approves or rejects player Telebirr deposit proof.
 * When approved, credits user's mainBalance and matching bonusBalance!
 */
export async function adminUpdateDepositRequest(
  depositId: string,
  newStatus: 'Approved' | 'Rejected',
  operator: { id: string; email: string; role: string },
  notes?: string
): Promise<void> {
  const depRef = doc(db, 'depositRequests', depositId);
  const now = new Date().toISOString();

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(depRef);
      if (!snap.exists()) {
        throw new Error('Deposit request not found.');
      }
      const data = snap.data() as FirestoreDepositRequest;

      if (data.status !== 'Pending') {
        throw new Error(`Deposit has already been settled as ${data.status}.`);
      }

      const walletRef = doc(db, 'wallets', data.userId);
      const walletSnap = await transaction.get(walletRef);

      if (newStatus === 'Approved') {
        if (walletSnap.exists()) {
          const walletData = walletSnap.data() as FirestoreWalletData;
          // Calculate 100% deposit match bonus (up to 1,000 ETB) if bonusApplied
          const matchBonus = data.bonusApplied ? Math.min(1000, data.amount) : 0;

          transaction.update(walletRef, {
            mainBalance: (walletData.mainBalance || 0) + data.amount,
            bonusBalance: (walletData.bonusBalance || 0) + matchBonus,
            updatedAt: now,
          });
        }
      }

      // Update deposit request
      transaction.update(depRef, {
        status: newStatus,
        notes: notes || (newStatus === 'Approved' ? 'Verified on Telebirr statement' : 'Verification failed'),
        updatedAt: now,
      });

      // Update transaction status
      const txRef = doc(db, 'transactions', `TX-${depositId}`);
      transaction.set(
        txRef,
        {
          status: newStatus === 'Approved' ? 'completed' : 'cancelled',
        },
        { merge: true }
      );

      // Record Audit Log
      const logRef = doc(db, 'auditLogs', `AUDIT-DEP-${Date.now()}`);
      transaction.set(logRef, {
        id: `AUDIT-DEP-${Date.now()}`,
        action: `Deposit ${depositId} marked as ${newStatus}`,
        operatorId: operator.id,
        operatorEmail: operator.email,
        operatorRole: operator.role,
        details: `Sender: ${data.senderPhone}, Amount: ${data.amount} ETB, Code: ${data.transactionCode}. Notes: ${notes || 'N/A'}`,
        timestamp: now,
      });
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `depositRequests/${depositId}`);
  }
}

