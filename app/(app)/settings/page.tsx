'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Bell, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { useUserNotificationsLive } from '@/lib/hooks/useUserNotificationsLive';
import AccountMessagesList from '@/components/messages/AccountMessagesList';
import { fetchUserProfileDoc, type UserProfileDocument } from '@/lib/firebase/userProfile';

type RowProps = { label: string; value: string; mono?: boolean };
function Row({ label, value, mono }: RowProps) {
  return (
    <div className="min-w-0 sm:col-span-1">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">{label}</p>
      <p
        className={`break-words text-sm text-white/90 ${mono ? 'font-mono text-xs' : ''}`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { items: accountMessages, loading: messagesLoading } = useUserNotificationsLive();
  const [profile, setProfile] = useState<UserProfileDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }
    if (!isFirebaseConfigured()) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancel = false;
    setLoading(true);
    (async () => {
      try {
        const p = await fetchUserProfileDoc(user.uid);
        if (!cancel) setProfile(p);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [user?.uid]);

  const email = profile?.email ?? user?.email ?? '—';
  const displayName = user?.displayName?.trim() || '—';
  const nickname = profile?.nickname?.trim() || '—';
  const phone = profile?.phoneDisplay?.trim() || '—';
  const country = profile?.country?.trim() || '—';

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile & credentials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <User size={15} className="text-[#00d4ff]" />
          <h3 className="font-bold text-white">Profile & credentials</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-white/50">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading profile…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5">
            {user?.uid && <Row label="User ID" value={user.uid} mono />}
            <Row label="Email" value={email} />
            <Row label="Display name" value={displayName} />
            <Row label="Nickname" value={nickname} />
            <Row label="Phone number" value={phone} />
            <Row label="Country" value={country} />
            <div className="min-w-0 sm:col-span-2">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">Password</p>
              <p className="text-sm text-white/50">
                Use a secure password you do not reuse elsewhere.{' '}
                <Link href="/forgot-password" className="text-[#00d4ff] hover:underline">
                  Reset via email
                </Link>
              </p>
            </div>
            {!isFirebaseConfigured() && (
              <p className="text-xs text-amber-400/90 sm:col-span-2">
                Firebase is not configured — only sign-in data from this session is shown. Add env keys to
                show your saved profile.
              </p>
            )}
            {isFirebaseConfigured() && user && !profile && !loading && (
              <p className="text-xs text-white/40 sm:col-span-2">
                No Firestore profile found for this account yet. Fields other than sign-in will show as empty
                until your profile is saved.
              </p>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass p-6"
      >
        <AccountMessagesList items={accountMessages} loading={messagesLoading} showHeader />
      </motion.div>

      {/* Notification preferences (local UI only) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <Bell size={15} className="text-[#f59e0b]" />
          <h3 className="font-bold text-white">Notification preferences</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Trade Signals', desc: 'Get notified on new AI signals', on: true },
            { label: 'Trade Executed', desc: 'When a bot opens or closes a trade', on: true },
            { label: 'Deposit Confirmed', desc: 'When your deposit is received', on: true },
            { label: 'Weekly Report', desc: 'Weekly performance summary email', on: false },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between border-b border-white/5 py-3 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-white/35">{item.desc}</p>
              </div>
              <button
                type="button"
                className="relative h-6 w-11 rounded-full transition-all"
                style={{
                  background: item.on ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)',
                  border: item.on ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full transition-all"
                  style={{
                    left: item.on ? '22px' : '2px',
                    background: item.on ? '#00d4ff' : 'rgba(255,255,255,0.3)',
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
