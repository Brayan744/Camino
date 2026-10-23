import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getBook, getChapter } from "@/lib/content";
import { loadProgress, bookStates } from "@/lib/progress";
import BookRecap from "@/components/BookRecap";

const fmt = (d) => new Date(d).toLocaleDateString("es", { day: "numeric", month: "long", timeZone: "America/Bogota" });

export default async function Repaso({ params }) {
  const u = await getUser();
  const book = getBook(params.slug);
  if (!book) notFound();
  const rows = await loadProgress(u.couple_id);
  const states = bookStates(rows);
  const idx = states.findIndex((b) => b.slug === book.slug);
  if (!states[idx].complete) redirect(`/libro/${book.slug}`);
  const mine = rows.filter((r) => r.book === book.slug);
  const first = mine[0]?.done_at;
  const last = mine[mine.length - 1]?.done_at;
  const nextBook = states[idx + 1];

  return (
    <div className="stagger space-y-6">
      <div>
        <p className="eyebrow">Repaso</p>
        <h1 className="heading text-3xl font-semibold">{book.emoji} {book.name}</h1>
        <p className="mt-3 text-muted">
          Leyeron los {book.chapters} capítulos entre el {fmt(first)} y el {fmt(last)}. {book.intro}
        </p>
      </div>

      <BookRecap slug={book.slug} />

      <div className="space-y-3">
        {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => {
          const ch = getChapter(book.slug, n);
          return (
            <Link key={n} href={`/libro/${book.slug}/${n}`} className="card block p-4">
              <p className="text-xs text-muted">Capítulo {n}</p>
              <p className="heading font-semibold">{ch.title}</p>
              {ch.verse && <p className="mt-1 text-sm italic text-muted">«{ch.verse.text}» — {ch.verse.ref}</p>}
            </Link>
          );
        })}
      </div>

      {nextBook && (
        <div className="text-center">
          <Link href={`/libro/${nextBook.slug}`} className="btn-primary">Seguir con {nextBook.name}</Link>
        </div>
      )}
    </div>
  );
}