import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './client';

export type InviterInfo = { name: string; handle: string } | null;

export type RegisterProfileInput = {
  email: string;
  password: string;
  phoneDial: string;
  phoneNumber: string;
  partnerCode: string;
  inviter: InviterInfo;
  firstName: string;
  surname: string;
  nickname: string;
  country: string;
  /** ISO `yyyy-mm-dd` from `<input type="date" />` */
  dateOfBirth: string;
};

export { getFirebaseAuthErrorMessage as getFirebaseRegisterErrorMessage } from './authErrors';

/**
 * Create Auth user, optional display name, and a single `users/{uid}` document in Firestore.
 */
export async function registerWithProfile(input: RegisterProfileInput): Promise<void> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const { user } = await createUserWithEmailAndPassword(
    auth,
    input.email.trim().toLowerCase(),
    input.password
  );

  const fullName = `${input.firstName} ${input.surname}`.trim();
  if (fullName) {
    await updateProfile(user, { displayName: fullName });
  }

  const phone = input.phoneNumber.trim();
  const dial = input.phoneDial.trim();
  const phoneDisplay = [dial, phone].filter(Boolean).join(' ');

  await setDoc(
    doc(db, 'users', user.uid),
    {
      email: user.email,
      phoneDial: dial,
      phoneNumber: phone,
      phoneDisplay,
      partnerCode: input.partnerCode.trim() || null,
      inviter: input.inviter,
      firstName: input.firstName.trim(),
      surname: input.surname.trim(),
      nickname: input.nickname.trim(),
      country: input.country,
      dateOfBirth: input.dateOfBirth,
      availableBalance: 0,
      profitBalance: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}
