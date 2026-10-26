import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DISPENSATIONS, getDisp, dispIndex } from "@/data/dispensations";
import DispStepper from "@/components/DispStepper";

// Tarjeta grande para Inicio: en qué dispensación van.
export function DispCard({ id }) {
  const d = getDisp(id);
  return (
    <Link href="/dispensaciones" className="card block p-5 transition hover:opacity-90">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">Dispensación actual · {dispIndex(id) + 1} de {DISPENSATIONS.length}</p>
          <p className="heading mt-1 text-xl font-semibold">{d.emoji} {d.name}</p>
          <p className="mt-1 text-sm text-muted">{d.idea}</p>
        </div>
        <ChevronRight className="mt-1 shrink-0 text-muted" />
      </div>
      <div className="mt-4"><DispStepper current={id} /></div>
    </Link>
  );
}

// Nota breve en medio de la lectura (capítulos y libros).
export function DispNote({ id }) {
  const d = getDisp(id);
  return (
    <Link href={`/dispensaciones#${d.id}`} className="card block p-4 transition hover:opacity-90">
      <p className="eyebrow">📍 Dónde están en la historia</p>
      <p className="mt-1 text-sm">
        Dispensación <span className="font-semibold">{d.n} de {DISPENSATIONS.length}: {d.name}</span>. <span className="text-muted">{d.idea}</span>
      </p>
      <p className="mt-2 text-xs text-muted">
        <span className="font-semibold text-ink">Lo que Dios pedía:</span> {d.duty}
      </p>
      <p className="mt-2 text-xs font-semibold text-brand">Conocer esta dispensación →</p>
    </Link>
  );
}

// Banner cuando el capítulo marca un cambio de etapa.
export function DispMarker({ marker }) {
  const d = marker.d;
  return (
    <Link
      href={`/dispensaciones#${d.id}`}
      className="card block border-l-4 p-5 transition hover:opacity-90"
      style={{ borderLeftColor: "var(--brand)", animation: "riseIn .5s ease both" }}
    >
      <p className="eyebrow">Nueva etapa · dispensación {d.n} de {DISPENSATIONS.length}</p>
      <p className="heading mt-1 text-xl font-semibold">{d.emoji} {d.name}</p>
      <p className="mt-1 text-sm leading-relaxed">{d.idea}</p>
      <p className="mt-2 text-xs text-muted">{marker.note}</p>
      <div className="mt-3"><DispStepper current={d.id} /></div>
      <p className="mt-3 text-xs font-semibold text-brand">Ver la explicación completa →</p>
    </Link>
  );
}
