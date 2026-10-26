import { DISPENSATIONS, dispIndex } from "@/data/dispensations";

export default function DispStepper({ current }) {
  const ci = dispIndex(current);
  return (
    <div className="flex items-center" aria-label={`Dispensación ${ci + 1} de ${DISPENSATIONS.length}`}>
      {DISPENSATIONS.map((d, i) => (
        <div key={d.id} className={`flex items-center ${i < DISPENSATIONS.length - 1 ? "flex-1" : ""}`}>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
              i < ci ? "border-transparent bg-accent text-bg" : i === ci ? "border-transparent bg-brand text-bg" : "border-line bg-surface text-muted"
            }`}
            style={i === ci ? { animation: "ringPulse 2s ease-out infinite" } : undefined}
          >
            {i + 1}
          </span>
          {i < DISPENSATIONS.length - 1 && (
            <span className="mx-1 h-0.5 flex-1 rounded" style={{ background: i < ci ? "var(--accent)" : "var(--line)" }} />
          )}
        </div>
      ))}
    </div>
  );
}
