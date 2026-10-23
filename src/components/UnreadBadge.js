export default function UnreadBadge({ n, className = "" }) {
  if (!n) return null;
  return (
    <span
      className={`absolute z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white shadow ${className}`}
      style={{ border: "2px solid var(--surface)" }}
      aria-label={`${n} mensajes sin leer`}
    >
      {n > 9 ? "9+" : n}
    </span>
  );
}