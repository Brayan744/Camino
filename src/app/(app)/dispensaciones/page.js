import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getUser } from "@/lib/auth";
import { loadProgress, bookStates } from "@/lib/progress";
import { BOOKS } from "@/data/books";
import { DISPENSATIONS, dispensationAt, dispIndex, allRanges } from "@/data/dispensations";
import DispStepper from "@/components/DispStepper";

export const metadata = { title: "Las dispensaciones · Camino de la Palabra" };

const ROWS = [
  ["duty", "Lo que Dios pedía", "🎯"],
  ["fail", "Dónde fallamos", "💔"],
  ["judgment", "La consecuencia", "⚖️"],
  ["grace", "La gracia de Dios", "🤍"],
];

export default async function Dispensaciones() {
  const u = await getUser();
  const rows = await loadProgress(u.couple_id);
  const states = bookStates(rows);
  const current = states.find((b) => b.unlocked && !b.complete) || states[states.length - 1];
  const doneSet = new Set(rows.filter((r) => r.book === current.slug).map((r) => r.chapter));
  let next = 1;
  while (doneSet.has(next)) next++;
  const finished = next > current.chapters;
  const here = dispensationAt(current.slug, finished ? current.chapters : next);
  const hi = dispIndex(here);

  const unlocked = Object.fromEntries(states.map((s) => [s.slug, s.unlocked]));
  const names = Object.fromEntries(BOOKS.map((b) => [b.slug, b.name]));
  const ranges = allRanges();

  return (
    <div className="stagger space-y-6">
      <div>
        <p className="eyebrow">Cómo se ordena la historia</p>
        <h1 className="heading text-3xl font-semibold">Las dispensaciones</h1>
        <p className="mt-3 text-muted">
          Una dispensación es una etapa de la historia en la que Dios trata con la humanidad de una manera particular: da una
          responsabilidad, el ser humano la recibe y la vive (o falla), y Dios actúa. Verlas ayuda a entender <em>por qué</em> en
          Génesis se ofrece un sacrificio sin ley escrita, <em>por qué</em> Levítico exige tanto, y <em>por qué</em> el Nuevo Testamento
          habla de gracia.
        </p>
      </div>

      <div className="card p-5">
        <p className="eyebrow">Ustedes están aquí</p>
        <p className="heading mt-1 text-2xl font-semibold">
          {DISPENSATIONS[hi].emoji} {DISPENSATIONS[hi].name}
        </p>
        <p className="mt-1 text-sm text-muted">
          Según su lectura de {current.name}{finished ? "" : `, capítulo ${next}`}. Esto se actualiza solo conforme avanzan.
        </p>
        <div className="mt-4"><DispStepper current={here} /></div>
      </div>

      <div className="space-y-3">
        {DISPENSATIONS.map((d, i) => {
          const status = i < hi ? "Ya la recorrieron" : i === hi ? "Están aquí" : "Por delante";
          const statusCls =
            i < hi ? "bg-accent text-bg" : i === hi ? "bg-brand text-bg" : "border border-line text-muted";
          const where = ranges.filter((r) => r.id === d.id);
          return (
            <details key={d.id} id={d.id} open={i === hi} className="group card scroll-mt-4 overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-2xl">{d.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow">Dispensación {d.n} de {DISPENSATIONS.length}</p>
                  <p className="heading text-lg font-semibold leading-tight">{d.name}</p>
                  <p className="text-xs text-muted">{d.period} · {d.passage}</p>
                </div>
                <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline ${statusCls}`}>{status}</span>
                <ChevronDown size={18} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>

              <div className="space-y-4 border-t border-line p-4">
                <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium sm:hidden ${statusCls}`}>{status}</span>
                <p className="heading text-lg italic leading-snug">{d.idea}</p>
                <p className="text-sm leading-relaxed text-muted">{d.story}</p>

                <dl className="space-y-3">
                  {ROWS.map(([key, label, icon]) => (
                    <div key={key} className="rounded-xl border border-line p-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-accent">{icon} {label}</dt>
                      <dd className="mt-1 text-sm leading-relaxed">{d[key]}</dd>
                    </div>
                  ))}
                </dl>

                <div className="rounded-xl p-3 text-sm" style={{ background: "var(--bg)" }}>
                  <p className="font-semibold">💡 Qué buscar al leer</p>
                  <p className="mt-1 leading-relaxed text-muted">{d.tip}</p>
                </div>

                {where.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">En su lectura</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {where.map((r) => {
                        const label = `${names[r.slug]} ${r.from === r.to ? r.from : `${r.from}–${r.to}`}`;
                        return unlocked[r.slug] ? (
                          <Link key={label} href={`/libro/${r.slug}/${r.from}`} className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-bg">{label}</Link>
                        ) : (
                          <span key={label} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{label}</span>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted">Esta etapa aparecerá en su lectura cuando lleguen a los libros correspondientes.</p>
                )}
              </div>
            </details>
          );
        })}
      </div>

      <div className="card space-y-3 p-5 text-sm leading-relaxed">
        <h2 className="heading text-lg font-semibold">Dos cosas importantes</h2>
        <p className="text-muted">
          <span className="font-semibold text-ink">Siempre por gracia.</span> En todas las etapas la salvación es por gracia mediante la fe.
          Lo que cambia de una a otra es lo que Dios revela y la responsabilidad que pone al ser humano, no la manera de ser salvo.
        </p>
        <p className="text-muted">
          <span className="font-semibold text-ink">Es un mapa, no un dogma.</span> Esta manera de ordenar la historia viene de la tradición
          dispensacionalista (Scofield, Chafer y, hoy, autores como MacArthur). Otras tradiciones, como la teología del pacto, también leen la
          Biblia con seriedad pero la organizan de otro modo, por ejemplo en pactos. Úsenla como una ayuda para ubicarse y confronten siempre lo
          que lean con el texto bíblico.
        </p>
      </div>
    </div>
  );
}
