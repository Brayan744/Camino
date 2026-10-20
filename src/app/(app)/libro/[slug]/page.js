import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check, Trophy } from "lucide-react";
import { getUser } from "@/lib/auth";
import { getBook } from "@/lib/content";
import { loadProgress, bookStates } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";

export default async function Libro({ params }) {
  const u = await getUser();
  const book = getBook(params.slug);
  if (!book) notFound();
  const rows = await loadProgress(u.couple_id);
  const states = bookStates(rows);
  const idx = states.findIndex((b) => b.slug === book.slug);
  const st = states[idx];
  if (!st.unlocked) redirect("/inicio");
  const done = new Set(rows.filter((r) => r.book === book.slug).map((r) => r.chapter));
  const nextBook = states[idx + 1];

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">{book.theme}</p>
        <h1 className="heading text-4xl font-semibold">{book.emoji} {book.name}</h1>
        <p className="mt-3 text-muted">{book.intro}</p>
      </div>

      <div className="card p-5">
        <h2 className="heading mb-2 text-lg font-semibold">Qué buscar al leerlo</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          {book.look.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="heading text-xl font-semibold">Capítulos</h2>
          <span className="text-sm text-muted">{st.done} de {book.chapters}</span>
        </div>
        <ProgressBar value={st.done} total={book.chapters} />
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8">
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/libro/${book.slug}/${n}`}
              className={`flex aspect-square items-center justify-center rounded-xl border text-sm font-medium transition active:scale-95 ${
                done.has(n) ? "border-transparent bg-accent text-bg" : "border-line bg-surface text-ink"
              }`}
            >
              {done.has(n) ? <Check size={16} /> : n}
            </Link>
          ))}
        </div>
      </div>

      {st.complete && (
        <div className="card p-6 text-center">
          <Trophy className="mx-auto text-accent" />
          <h3 className="heading mt-2 text-xl font-semibold">¡Terminaron {book.name}!</h3>
          <p className="mt-1 text-sm text-muted">Repasen lo que vivieron en el libro.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href={`/repaso/${book.slug}`} className="btn-primary">Ver repaso</Link>
            {nextBook && <Link href={`/libro/${nextBook.slug}`} className="btn-ghost">Seguir con {nextBook.name}</Link>}
          </div>
        </div>
      )}
    </div>
  );
}