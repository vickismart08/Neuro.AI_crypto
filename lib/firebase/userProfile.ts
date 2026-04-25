import { doc, getDoc, updateDoc, type Timestamp } from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from './client';
import type { InviterInfo } from './registerUser';

/**
 * `users/{uid}` document written at registration (`registerWithProfile`).
 */
export type UserProfileDocument = {
  email: string | null;
  phoneDial: string;
  phoneNumber: string;
  phoneDisplay: string;
  partnerCode: string | null;
  inviter: InviterInfo;
  firstName: string;
  surname: string;
  nickname: string;
  country: string;
  dateOfBirth: string;
  /** USD-style balance (not cents). Admin-updatable; clients read-only. */
  availableBalance?: number;
  /** “Profit made” display. */
  profitBalance?: number;
  /**
   * Epoch milliseconds when automated profit cycle started for this account.
   * Used to keep profit progression consistent across logouts/inactive periods.
   */
  profitCycleStartedAtMs?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export async function fetchUserProfileDoc(uid: string): Promise<UserProfileDocument | null> {
  if (!isFirebaseConfigured()) return null;
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfileDocument;
}

/**
 * Marks start time for account profit cycle if not already set.
 * Caller should guard this to run only when `profitCycleStartedAtMs` is missing.
 */
export async function setProfitCycleStart(uid: string, startedAtMs: number): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'users', uid), {
    profitCycleStartedAtMs: startedAtMs,
  });
}
