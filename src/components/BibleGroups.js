import Link from "next/link";
import { Lock, ChevronRight, ChevronDown, Hourglass } from "lucide-react";
import { OUTLINE } from "@/data/outline";
import ProgressBar from "@/components/ProgressBar";
import UnreadBadge from "@/components/UnreadBadge";

// Los 66 libros agrupados, con un desplegable por grupo.
// states: arreglo de bookStates() (solo libros ya escritos). unread: { slug: n }.
export default function BibleGroups({ states, unread, currentSlug }) {
  const byName = Object.fromEntries(states.map((s, i) => [s.name, { ...s, prev: states[i - 1] }]));
  let counter = 0;

  return (
    <div className="space-y-6">
      {OUTLINE.map((t) => {
        const total = t.groups.reduce((a, g) => a + g.books.length, 0);
        return (
          <section key={t.testament} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="heading text-xl font-semibold">{t.testament}</h2>
              <span className="text-xs text-muted">{total} libros</span>
            </div>

            {t.groups.map((g) => {
              const items = g.books.map((name) => {
                counter += 1;
                return { name, num: counter, st: byName[name] || null };
              });
              const avail = items.filter((x) => x.st);
              const done = avail.reduce((a, x) => a + x.st.done, 0);
              const chapters = avail.reduce((a, x) => a + x.st.chapters, 0);
              const open = items.some((x) => x.st && x.st.slug === currentSlug);

              return (
                <details key={g.name} open={open} className="group card overflow-hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0 flex-1">
                      <p className="heading text-lg font-semibold">{g.name}</p>
                      <p className="text-xs text-muted">
                        {avail.length > 0
                          ? `${avail.length} de ${items.length} libros disponibles · ${done}/${chapters} capítulos`
                          : `${items.length} libros · próximamente`}
                      </p>
                    </div>
                    <ChevronDown size={18} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                  </summary>

                  <div className="border-t border-line">
                    {items.map(({ name, num, st }) => {
                      if (!st) {
                        return (
                          <div key={name} className="flex items-center gap-3 border-b border-line px-4 py-3 opacity-55 last:border-b-0">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-xs text-muted">{num}</span>
                            <p className="flex-1 text-sm">{name}</p>
                            <span className="flex items-center gap-1 text-[11px] text-muted"><Hourglass size={13} /> Próximamente</span>
                          </div>
                        );
                      }
                      const inner = (
                        <div className={`relative flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 ${st.unlocked ? "" : "opacity-60"}`}>
                          {st.unlocked && <UnreadBadge n={unread[st.slug]} className="right-10 top-2" />}
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-xl">{st.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className="heading text-base font-semibold">{st.name}</p>
                            <p className="text-xs text-muted">
                              {st.unlocked
                                ? `${st.theme} · ${st.done}/${st.chapters}`
                                : `Termina ${st.prev ? st.prev.name : "el libro anterior"} para desbloquear`}
                            </p>
                            {st.unlocked && <div className="mt-2"><ProgressBar value={st.done} total={st.chapters} /></div>}
                          </div>
                          {st.unlocked ? <ChevronRight size={18} className="shrink-0 text-muted" /> : <Lock size={18} className="shrink-0 text-muted" />}
                        </div>
                      );
                      return st.unlocked ? (
                        <Link key={name} href={`/libro/${st.slug}`} className="block">{inner}</Link>
                      ) : (
                        <div key={name}>{inner}</div>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
