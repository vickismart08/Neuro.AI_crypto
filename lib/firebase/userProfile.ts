import { doc, getDoc, type Timestamp } from 'firebase/firestore';
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
