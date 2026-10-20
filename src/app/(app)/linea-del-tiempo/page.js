import Link from "next/link";
import { Lock } from "lucide-react";
import { getUser } from "@/lib/auth";
import { loadProgress, bookStates } from "@/lib/progress";
import { ERAS, EVENTS } from "@/data/timeline";

export const metadata = { title: "Línea del tiempo · Camino de la Palabra" };

export default async function Tiempo() {
  const u = await getUser();
  const rows = await loadProgress(u.couple_id);
  const states = bookStates(rows);
  const done = new Set(rows.map((r) => `${r.book}-${r.chapter}`));

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Línea del tiempo</p>
        <h1 className="heading text-3xl font-semibold">Las historias en orden</h1>
        <p className="mt-3 text-muted">Los momentos clave del Pentateuco. Los que ya leyeron aparecen marcados en dorado.</p>
      </div>

      {ERAS.map((era) => (
        <section key={era.id}>
          <h2 className="heading text-xl font-semibold">{era.title}</h2>
          <p className="mb-3 text-xs text-muted">{era.sub}</p>
          <ol className="ml-3 border-l border-line">
            {EVENTS.filter((e) => e.era === era.id).map((e) => {
              const unlocked = states.find((b) => b.slug === e.book).unlocked;
              const visited = done.has(`${e.book}-${e.ch}`);
              const body = (
                <div className={`card p-4 ${unlocked ? "" : "opacity-60"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="heading font-semibold">{e.title}</p>
                    {unlocked ? <span className="text-xs text-accent">{e.ref}</span> : <Lock size={14} className="text-muted" />}
                  </div>
                  <p className="mt-1 text-sm text-muted">{e.note}</p>
                </div>
              );
              return (
                <li key={e.title} className="relative mb-3 ml-5">
                  <span
                    className="absolute top-5 h-3 w-3 rounded-full"
                    style={{ left: "-26px", background: visited ? "var(--accent)" : "var(--line)" }}
                  />
                  {unlocked ? <Link href={`/libro/${e.book}/${e.ch}`}>{body}</Link> : body}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}