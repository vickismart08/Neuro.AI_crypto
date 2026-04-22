export default function HexPattern({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 h-[45%] overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundColor: 'transparent',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0l10.3923 6v8L12 20 1.6077 14V6L12 0z' fill='none' stroke='%2300d4ff' stroke-width='0.45' opacity='0.4'/%3E%3Cpath d='M12 20l10.3923 6v8L12 40 1.6077 34V26L12 20z' fill='none' stroke='%2300d4ff' stroke-width='0.45' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '24px 40px',
        }}
      />
    </div>
  );
}
