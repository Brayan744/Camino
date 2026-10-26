import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { getUser } from "@/lib/auth";
import { getBook, getChapter } from "@/lib/content";
import { loadProgress, bookStates, chapterReaders } from "@/lib/progress";
import { loadStreak } from "@/lib/streak";
import { dispensationAt, markerAt } from "@/data/dispensations";
import ReadButton from "@/components/ReadButton";
import ChapterTabs from "@/components/ChapterTabs";
import Extra from "@/components/Extra";
import { DispNote, DispMarker } from "@/components/DispCard";

export default async function Capitulo({ params, searchParams }) {
  const u = await getUser();
  const book = getBook(params.slug);
  const n = parseInt(params.n, 10);
  if (!book || !(n >= 1 && n <= book.chapters)) notFound();

  const [rows, st2, readers] = await Promise.all([
    loadProgress(u.couple_id),
    loadStreak(u.couple_id, u.id),
    chapterReaders(u.couple_id, book.slug, n),
  ]);
  const st = bookStates(rows).find((b) => b.slug === book.slug);
  if (!st.unlocked) redirect("/inicio");

  const doneSet = new Set(rows.filter((r) => r.book === book.slug).map((r) => r.chapter));
  const ch = getChapter(book.slug, n);
  const meToday = st2.today.find((x) => x.mine) || { marked: false, wrote: false };
  const partnerToday = st2.today.find((x) => !x.mine) || null;
  const lastRead = [...doneSet]
    .filter((c) => c < n)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reverse()
    .map((c) => getChapter(book.slug, c).title);
  const marker = markerAt(book.slug, n);
  const dispId = dispensationAt(book.slug, n);

  return (
    <ChapterTabs
      key={`${book.slug}-${n}`}
      book={book.slug}
      chapter={n}
      backHref={`/libro/${book.slug}`}
      backLabel={book.name}
      eyebrow={`${book.name} · capítulo ${n} de ${book.chapters}`}
      title={ch.title}
      initial={searchParams?.tab === "chat" ? "chat" : "read"}
    >
      {marker && <DispMarker marker={marker} />}

      {ch.image && <img src={ch.image} alt={ch.title} className="w-full rounded-xl2 border border-line" />}

      <div className="card p-5">
        <p className="leading-relaxed">{ch.intro}</p>
      </div>

      {ch.summary.length > 0 && (
        <div className="card p-5">
          <h2 className="heading mb-3 text-lg font-semibold">✨ En resumen</h2>
          <ul className="space-y-2.5">
            {ch.summary.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{ animation: `riseIn .5s ease ${0.15 * i}s both` }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-bg" style={{ background: "var(--accent)" }}>{i + 1}</span>
                <span className="leading-relaxed text-muted">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!marker && <DispNote id={dispId} />}

      {ch.extra && <Extra kind={ch.extra} />}

      {ch.terms.length > 0 && (
        <div className="card p-5">
          <h2 className="heading mb-3 flex items-center gap-2 text-lg font-semibold">
            <Lightbulb size={18} className="text-accent" /> Para entender este capítulo
          </h2>
          <dl className="space-y-3">
            {ch.terms.map(([term, def]) => (
              <div key={term}>
                <dt className="text-sm font-semibold text-accent">{term}</dt>
                <dd className="text-sm leading-relaxed text-muted">{def}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {ch.verse && (
        <blockquote className="rounded-xl2 border-l-4 p-5" style={{ borderColor: "var(--accent)", background: "var(--surface)" }}>
          <p className="heading text-lg italic leading-relaxed">«{ch.verse.text}»</p>
          <footer className="mt-2 text-sm text-muted">{ch.verse.ref} · RVR1960</footer>
        </blockquote>
      )}

      <div className="card p-5 text-sm text-muted">
        <p>
          Han completado juntos <span className="font-semibold text-ink">{st.done}</span> de {book.chapters} capítulos de {book.name}.
        </p>
        {lastRead.length > 0 && <p className="mt-1">Lo último que terminaron: {lastRead.join(" · ")}.</p>}
      </div>

      <p className="text-sm text-muted">Lean {book.name} {n} en su Reina Valera 1960 y vuelvan aquí para marcarlo.</p>
      <ReadButton
        book={book.slug}
        chapter={n}
        done={readers.has(u.id)}
        meToday={meToday}
        partnerToday={partnerToday}
        partnerDone={partnerToday ? readers.has(partnerToday.id) : false}
        lit={st2.todayDone}
      />

      <div className="flex justify-between pb-14 text-sm">
        {n > 1 ? (
          <Link href={`/libro/${book.slug}/${n - 1}`} className="btn-ghost"><ChevronLeft size={16} /> Anterior</Link>
        ) : <span />}
        {n < book.chapters ? (
          <Link href={`/libro/${book.slug}/${n + 1}`} className="btn-ghost">Siguiente <ChevronRight size={16} /></Link>
        ) : <span />}
      </div>
    </ChapterTabs>
  );
}
