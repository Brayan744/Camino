export default function Flame({ size = 84, a = "#f97316", b = "#fbbf24", lit = true, id = "fl", animate = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{
        animation: lit && animate ? "flame 1.7s ease-in-out infinite" : "none",
        transformOrigin: "50% 90%",
        filter: lit ? `drop-shadow(0 0 14px ${a}99)` : "grayscale(1) opacity(.45)",
        transition: "filter .6s ease",
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <path d="M32 3c2 10 13 16 13 31a13 13 0 0 1-26 0c0-6 3-10 5-13 1 4 3 6 5 6 0-8-2-14 3-24z" fill={`url(#${id})`} />
      <path d="M32 30c1 5 6 8 6 14a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3 0-4-1-7 0-10z" fill="#fff" opacity=".55" />
    </svg>
  );
}