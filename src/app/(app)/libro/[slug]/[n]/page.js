import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { getUser } from "@/lib/auth";
import { getBook, getChapter } from "@/lib/content";
import { loadProgress, bookStates } from "@/lib/progress";
import ReadButton from "@/components/ReadButton";
import Chat from "@/components/Chat";

export default async function Capitulo({ params }) {
  const u = await getUser();
  const book = getBook(params.slug);
  const n = parseInt(params.n, 10);
  if (!book || !(n >= 1 && n <= book.chapters)) notFound();

  const rows = await loadProgress(u.couple_id);
  const st = bookStates(rows).find((b) => b.slug === book.slug);
  if (!st.unlocked) redirect("/inicio");

  const doneSet = new Set(rows.filter((r) => r.book === book.slug).map((r) => r.chapter));
  const ch = getChapter(book.slug, n);
  const isDone = doneSet.has(n);
  const lastRead = [...doneSet]
    .filter((c) => c < n)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reverse()
    .map((c) => getChapter(book.slug, c).title);

  return (
    <div className="space-y-5">
      <div>
        <Link href={`/libro/${book.slug}`} className="text-sm text-muted">← {book.name}</Link>
        <p className="eyebrow mt-3">{book.name} · capítulo {n} de {book.chapters}</p>
        <h1 className="heading text-3xl font-semibold">{ch.title}</h1>
      </div>

      {ch.image && <img src={ch.image} alt={ch.title} className="w-full rounded-xl2 border border-line" />}

      <div className="card p-5">
        <p className="leading-relaxed">{ch.intro}</p>
      </div>

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
          Llevan <span className="font-semibold text-ink">{st.done}</span> de {book.chapters} capítulos de {book.name}.
        </p>
        {lastRead.length > 0 && <p className="mt-1">Lo último que leyeron: {lastRead.join(" · ")}.</p>}
      </div>

      <p className="text-sm text-muted">Lean {book.name} {n} en su Reina Valera 1960 y vuelvan aquí para marcarlo.</p>
      <ReadButton book={book.slug} chapter={n} done={isDone} />

      <section>
        <h2 className="heading mb-3 text-xl font-semibold">Chat del capítulo</h2>
        <Chat book={book.slug} chapter={n} />
      </section>

      <div className="flex justify-between text-sm">
        {n > 1 ? (
          <Link href={`/libro/${book.slug}/${n - 1}`} className="btn-ghost"><ChevronLeft size={16} /> Anterior</Link>
        ) : <span />}
        {n < book.chapters ? (
          <Link href={`/libro/${book.slug}/${n + 1}`} className="btn-ghost">Siguiente <ChevronRight size={16} /></Link>
        ) : <span />}
      </div>
    </div>
  );
}