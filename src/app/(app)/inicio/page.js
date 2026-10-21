import Link from "next/link";
import { Lock, ChevronRight } from "lucide-react";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { loadProgress, bookStates } from "@/lib/progress";
import { loadStreak } from "@/lib/streak";
import ProgressRing from "@/components/ProgressRing";
import ProgressBar from "@/components/ProgressBar";
import StreakCard from "@/components/StreakCard";
import PushPrompt from "@/components/PushPrompt";

export default async function Inicio() {
  const u = await getUser();
  const rows = await loadProgress(u.couple_id);
  const states = bookStates(rows);
  const total = states.reduce((a, b) => a + b.chapters, 0);
  const pct = total ? Math.round((rows.length / total) * 100) : 0;
  const st = await loadStreak(u.couple_id, u.id);

  const current = states.find((b) => b.unlocked && !b.complete) || states[states.length - 1];
  const doneSet = new Set(rows.filter((r) => r.book === current.slug).map((r) => r.chapter));
  let next = 1;
  while (doneSet.has(next)) next++;
  const finished = next > current.chapters;

  const p = await db();
  const people = (await p.query("select name from users where couple_id = $1 order by id", [u.couple_id])).rows.map((x) => x.name);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Hola, {u.name}</p>
        <h1 className="heading text-3xl font-semibold">Su camino de lectura</h1>
      </div>

      <Link
        href={finished ? `/libro/${current.slug}` : `/libro/${current.slug}/${next}`}
        className="card flex items-center justify-between p-5 transition hover:opacity-90"
      >
        <div>
          <p className="eyebrow">{finished ? "Libro completado" : "Continuar"}</p>
          <p className="heading mt-1 text-xl font-semibold">
            {finished ? current.name : `${current.name} ${next}`}
          </p>
        </div>
        <ChevronRight className="text-muted" />
      </Link>

      <StreakCard
        count={st.count}
        best={st.best}
        todayDone={st.todayDone}
        rescue={st.rescue}
        week={st.week}
        savers={st.savers}
      />

      <div className="card flex items-center gap-5 p-5">
        <div className="shrink-0">
          <ProgressRing value={rows.length} total={total} size={128} stroke={12}>
            <div className="heading text-3xl font-semibold leading-none">
              {pct}
              <span className="text-base text-muted">%</span>
            </div>
          </ProgressRing>
        </div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Pentateuco</p>
          <p className="heading mt-1 text-2xl font-semibold">{rows.length} de {total}</p>
          <p className="text-sm text-muted">capítulos leídos</p>
        </div>
      </div>

      <PushPrompt />

      <section>
        <h2 className="heading mb-3 text-xl font-semibold">Libros</h2>
        <div className="space-y-3">
          {states.map((b, i) => {
            const inner = (
              <div className={`card p-4 ${b.unlocked ? "" : "opacity-60"}`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{b.emoji}</div>
                  <div className="flex-1">
                    <p className="heading text-lg font-semibold">{b.name}</p>
                    <p className="text-xs text-muted">
                      {b.unlocked ? `${b.theme} · ${b.done}/${b.chapters}` : `Termina ${states[i - 1].name} para desbloquear`}
                    </p>
                  </div>
                  {b.unlocked ? <ChevronRight size={18} className="text-muted" /> : <Lock size={18} className="text-muted" />}
                </div>
                {b.unlocked && <div className="mt-3"><ProgressBar value={b.done} total={b.chapters} /></div>}
              </div>
            );
            return b.unlocked ? <Link key={b.slug} href={`/libro/${b.slug}`}>{inner}</Link> : <div key={b.slug}>{inner}</div>;
          })}
        </div>
      </section>

      <div className="card p-5 text-sm">
        <p className="text-muted">Pareja: <span className="text-ink">{people.join(" y ")}</span></p>
        <p className="mt-1 text-muted">
          Código para unirse: <span className="font-semibold tracking-widest text-ink">{u.code}</span>
        </p>
      </div>
    </div>
  );
}