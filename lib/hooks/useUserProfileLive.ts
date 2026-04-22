'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/components/providers/AuthProvider';
import { getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase/client';
import type { UserProfileDocument } from '@/lib/firebase/userProfile';

type State = { profile: UserProfileDocument | null; loading: boolean };

export function useUserProfileLive(): State {
  const { user } = useAuth();
  const [state, setState] = useState<State>({ profile: null, loading: true });

  useEffect(() => {
    if (!user?.uid || !isFirebaseConfigured()) {
      setState({ profile: null, loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    const ref = doc(getFirebaseDb(), 'users', user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setState({ profile: snap.data() as UserProfileDocument, loading: false });
        } else {
          setState({ profile: null, loading: false });
        }
      },
      () => setState({ profile: null, loading: false })
    );
    return () => unsub();
  }, [user?.uid]);

  return state;
}
