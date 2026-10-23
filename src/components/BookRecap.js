import { RECAPS } from "@/data/recaps";

export default function BookRecap({ slug, show = true }) {
  const r = RECAPS[slug];
  if (!r || !show) return null;
  return (
    <div className="card p-5">
      <h2 className="heading mb-3 text-lg font-semibold">📚 El libro en cinco ideas</h2>
      <ol className="space-y-3">
        {r.map(([range, text], i) => (
          <li key={i} className="flex gap-3" style={{ animation: `riseIn .5s ease ${0.1 * i}s both` }}>
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-bg"
              style={{ background: "linear-gradient(135deg, var(--brand), var(--accent))" }}
            >
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-accent">{range}</span>
              <span className="text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}