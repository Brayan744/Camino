import Link from "next/link";
import { Lock, ChevronRight } from "lucide-react";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { loadProgress, bookStates, loadUnread } from "@/lib/progress";
import { loadStreak } from "@/lib/streak";
import ProgressRing from "@/components/ProgressRing";
import ProgressBar from "@/components/ProgressBar";
import StreakCard from "@/components/StreakCard";
import PushPrompt from "@/components/PushPrompt";
import UnreadBadge from "@/components/UnreadBadge";

export default async function Inicio() {
  const u = await getUser();
  const [rows, st, unread] = await Promise.all([
    loadProgress(u.couple_id),
    loadStreak(u.couple_id, u.id),
    loadUnread(u.couple_id, u.id),
  ]);
  const states = bookStates(rows);
  const total = states.reduce((a, b) => a + b.chapters, 0);
  const pct = total ? Math.round((rows.length / total) * 100) : 0;

  const unreadByBook = {};
  for (const x of unread) unreadByBook[x.book] = (unreadByBook[x.book] || 0) + x.n;

  const current = states.find((b) => b.unlocked && !b.complete) || states[states.length - 1];
  const doneSet = new Set(rows.filter((r) => r.book === current.slug).map((r) => r.chapter));
  let next = 1;
  while (doneSet.has(next)) next++;
  const finished = next > current.chapters;

  const p = await db();
  const people = (await p.query("select name from users where couple_id = $1 order by id", [u.couple_id])).rows.map((x) => x.name);

  return (
    ddiv className="space-y-6">
      ddiv>
        dp className="eyebrow">Hola, {u.name}d/p>
        dh1 className="heading text-3xl font-semibold">Su camino de lecturad/h1>
      d/div>

      dLink href={`/libro/${current.slug}`} className="card relative flex items-center justify-between p-5 transition hover:opacity-90">
        dUnreadBadge n={unreadByBook[current.slug]} className="-right-1.5 -top-1.5" />
        ddiv className="flex items-center gap-4">
          dspan className="text-3xl">{current.emoji}d/span>
          ddiv>
            dp className="eyebrow">{finished ? "Libro completado" : "Continuar"}d/p>
            dp className="heading mt-0.5 text-xl font-semibold">{current.name}d/p>
            dp className="text-sm text-muted">{finished ? "Repasen lo que vivieron" : `Van en el capítulo ${next}`}d/p>
          d/div>
        d/div>
        dChevronRight className="text-muted" />
      d/Link>

      dStreakCard
        count={st.count}
        best={st.best}
        todayDone={st.todayDone}
        rescue={st.rescue}
        week={st.week}
        savers={st.savers}
        today={st.today}
      />

      ddiv className="card flex items-center gap-5 p-5">
        ddiv className="shrink-0">
          dProgressRing value={rows.length} total={total} size={128} stroke={12}>
            ddiv className="heading text-3xl font-semibold leading-none">
              {pct}
              dspan className="text-base text-muted">%d/span>
            d/div>
          d/ProgressRing>
        d/div>
        ddiv className="min-w-0 flex-1">
          dp className="eyebrow">Pentateucod/p>
          dp className="heading mt-1 text-2xl font-semibold">{rows.length} de {total}d/p>
          dp className="text-sm text-muted">capítulos completadosd/p>
        d/div>
      d/div>

      dPushPrompt />

      dsection>
        dh2 className="heading mb-3 text-xl font-semibold">Librosd/h2>
        ddiv className="space-y-3">
          {states.map((b, i) => {
            const inner = (
              ddiv className={`card relative p-4 ${b.unlocked ? "" : "opacity-60"}`}>
                {b.unlocked && dUnreadBadge n={unreadByBook[b.slug]} className="-right-1.5 -top-1.5" />}
                ddiv className="flex items-center gap-3">
                  ddiv className="text-2xl">{b.emoji}d/div>
                  ddiv className="flex-1">
                    dp className="heading text-lg font-semibold">{b.name}d/p>
                    dp className="text-xs text-muted">
                      {b.unlocked ? `${b.theme} · ${b.done}/${b.chapters}` : `Termina ${states[i - 1].name} para desbloquear`}
                    d/p>
                  d/div>
                  {b.unlocked ? dChevronRight size={18} className="text-muted" /> : dLock size={18} className="text-muted" />}
                d/div>
                {b.unlocked && ddiv className="mt-3">dProgressBar value={b.done} total={b.chapters} />d/div>}
              d/div>
            );
            return b.unlocked ? dLink key={b.slug} href={`/libro/${b.slug}`}>{inner}d/Link> : ddiv key={b.slug}>{inner}d/div>;
          })}
        d/div>
      d/section>

      ddiv className="card p-5 text-sm">
        dp className="text-muted">Pareja: dspan className="text-ink">{people.join(" y ")}d/span>d/p>
        dp className="mt-1 text-muted">
          Código para unirse: dspan className="font-semibold tracking-widest text-ink">{u.code}d/span>
        d/p>
      d/div>
    d/div>
  );
}