/** Shared class strings for auth screens (matches main app dark theme). */
export const auth = {
  pageTitle: 'text-2xl font-bold text-white sm:text-[26px]',
  pageSubtitle: 'text-sm text-white/50',
  link: 'font-semibold text-[#00d4ff] hover:underline',
  label: 'text-[13px] font-medium text-white/45',
  input:
    'w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-[15px] text-white shadow-inner placeholder:text-white/30 focus:border-[#00d4ff]/50 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/20 [color-scheme:dark]',
  inputSelect: 'h-[46px] appearance-none pr-8',
  iconBtn: 'text-white/40 hover:text-white/70',
  btnPrimary:
    'rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] py-3 text-[15px] font-bold text-white shadow-[0_0_24px_rgba(0,212,255,0.15)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
  primaryBtn:
    'w-full rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6] py-3 text-[15px] font-bold text-white shadow-[0_0_24px_rgba(0,212,255,0.15)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
  secondaryBtn:
    'rounded-xl border border-white/10 bg-white/5 py-3 text-[15px] font-semibold text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50',
  error: 'rounded-xl border border-[#ff4d6d]/30 bg-[#ff4d6d]/10 px-3.5 py-2.5 text-sm text-red-200',
  card: 'rounded-2xl border border-white/5 bg-[#080f20]/60 backdrop-blur-sm',
} as const;
