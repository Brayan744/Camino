export default function ProgressBar({ value, total }) {
  const pct = total ? Math.round((Math.min(value, total) / total) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
      <div className="h-full rounded-full" style={{ width: pct + "%", background: "var(--accent)", transition: "width .6s ease" }} />
    </div>
  );
}