'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown, Eye, EyeOff, Info } from 'lucide-react';
import AuthField from './AuthField';
import { auth as t } from './authTheme';
import { countryOptions, dialCodes } from '@/lib/countries';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { getFirebaseRegisterErrorMessage, registerWithProfile } from '@/lib/firebase/registerUser';

type Step = 1 | 2;

const defaultInviter = {
  name: 'Nia Scafidi',
  handle: 'Aurum1245',
  initial: 'N',
};

const selectClass = `${t.input} ${t.inputSelect} w-full pl-2.5 text-[15px] bg-[#0a1628]`;
const selectClassFull = `${t.input} ${t.inputSelect} w-full pl-3 pr-9 bg-[#0a1628]`;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [dial, setDial] = useState('+44');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [partnerCode, setPartnerCode] = useState(
    () => searchParams.get('ref') ?? searchParams.get('partner') ?? 'KWUY1H'
  );

  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [dob, setDob] = useState('2002-09-03');

  const showInviter = useMemo(
    () => partnerCode.trim().length > 0,
    [partnerCode]
  );

  function onStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Add your keys to .env.local and restart the dev server.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setStep(2);
  }

  async function onStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Add your keys to .env.local and restart the dev server.');
      return;
    }
    setLoading(true);
    try {
      await registerWithProfile({
        email,
        password,
        phoneDial: dial,
        phoneNumber: phone,
        partnerCode,
        inviter: showInviter
          ? { name: defaultInviter.name, handle: defaultInviter.handle }
          : null,
        firstName,
        surname,
        nickname,
        country,
        dateOfBirth: dob,
      });
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(getFirebaseRegisterErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <h1 className={t.pageTitle}>Create an account</h1>
        <p className={`${t.pageSubtitle} mt-2`}>
          Already have an account?{' '}
          <Link href="/login" className={t.link}>
            Log in
          </Link>
        </p>
      </div>

      {error && (
        <div role="alert" className={`mb-4 ${t.error}`}>
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={onStep1Submit} className="space-y-4">
          <AuthField
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <p className={`mb-1.5 ${t.label}`}>Phone number</p>
            <div className="flex gap-2">
              <div className="relative w-[min(46%,9.5rem)] shrink-0">
                <select
                  name="dial"
                  value={dial}
                  onChange={(e) => setDial(e.target.value)}
                  className={selectClass}
                >
                  {dialCodes.map((d) => (
                    <option key={d.code} value={d.code} className="bg-[#0a1628]">
                      {d.flag} {d.code}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                />
              </div>
              <input
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="7700900123"
                className={`min-w-0 flex-1 ${t.input} px-3.5 py-2.5 text-[15px]`}
                required
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor="reg-password" className={t.label}>
                Password
              </label>
              <Info className="h-3.5 w-3.5 text-[#f59e0b]/90" aria-hidden />
            </div>
            <div className="relative">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={`${t.input} py-2.5 pl-3.5 pr-11 text-[15px]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 ${t.iconBtn}`}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="partner" className={`mb-1.5 block ${t.label}`}>
              Partner Code
            </label>
            <input
              id="partner"
              name="partnerCode"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
              className={`${t.input} px-3.5 py-2.5 text-[15px] uppercase`}
            />
          </div>

          {showInviter && (
            <div>
              <p className={`mb-2 ${t.label}`}>Inviter</p>
              <div className="glass-sm flex items-center gap-3 rounded-xl border border-white/5 px-3.5 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00d4ff] to-[#8b5cf6] text-sm font-bold text-white">
                  {defaultInviter.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white">{defaultInviter.name}</p>
                  <p className="text-sm text-white/40">{defaultInviter.handle}</p>
                </div>
                <span className="shrink-0 rounded-full border border-[#00d4ff]/30 bg-[rgba(0,212,255,0.1)] px-2.5 py-1 text-[11px] font-semibold text-[#00d4ff]">
                  Invited you
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${t.primaryBtn} disabled:opacity-50`}
          >
            Next
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onStep2Submit} className="space-y-4">
          <AuthField
            label="Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <AuthField
            label="Surname"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            autoComplete="family-name"
          />
          <AuthField
            label="Nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            autoComplete="username"
          />

          <div>
            <p className={`mb-1.5 ${t.label}`}>Country</p>
            <div className="relative">
              <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={selectClassFull}
              >
                {countryOptions.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#0a1628]">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            </div>
          </div>

          <div>
            <p className={`mb-1.5 ${t.label}`}>Date of birth</p>
            <div className="relative">
              <input
                name="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`h-[46px] w-full pl-3.5 pr-10 ${t.input} text-[15px]`}
                required
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className={`flex-1 ${t.secondaryBtn}`}
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 min-w-0 ${t.btnPrimary}`}
            >
              {loading ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] transition-all duration-300"
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>
    </div>
  );
}
