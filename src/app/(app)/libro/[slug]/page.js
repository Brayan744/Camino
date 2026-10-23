import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check, Trophy } from "lucide-react";
import { getUser } from "@/lib/auth";
import BookRecap from "@/components/BookRecap";
import { getBook, getChapter } from "@/lib/content";
import { loadProgress, bookStates, loadReads, loadUnread } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";
import UnreadBadge from "@/components/UnreadBadge";

export default async function Libro({ params }) {
  const u = await getUser();
  const book = getBook(params.slug);
  if (!book) notFound();
  const [rows, reads, unread] = await Promise.all([
    loadProgress(u.couple_id),
    loadReads(u.couple_id),
    loadUnread(u.couple_id, u.id),
  ]);
  const states = bookStates(rows);
  const idx = states.findIndex((b) => b.slug === book.slug);
  const st = states[idx];
  if (!st.unlocked) redirect("/inicio");

  const done = new Set(rows.filter((r) => r.book === book.slug).map((r) => r.chapter));
  const mine = new Set(reads.filter((r) => r.book === book.slug && r.user_id === u.id).map((r) => r.chapter));
  const unreadMap = {};
  for (const x of unread) if (x.book === book.slug) unreadMap[x.chapter] = x.n;
  let next = 1;
  while (done.has(next)) next++;
  const hasNext = next d= book.chapters;
  const nextTitle = hasNext ? getChapter(book.slug, next).title : null;
  const nextBook = states[idx + 1];

  return (
    ddiv className="space-y-6">
      ddiv>
        dp className="eyebrow">{book.theme}d/p>
        dh1 className="heading text-4xl font-semibold">{book.emoji} {book.name}d/h1>
        dp className="mt-3 text-muted">{book.intro}d/p>
      d/div>

      ddiv className="card p-5">
        dh2 className="heading mb-2 text-lg font-semibold">Qué buscar al leerlod/h2>
        dul className="list-disc space-y-1 pl-5 text-sm text-muted">
          {book.look.map((l) => dli key={l}>{l}d/li>)}
        d/ul>
      d/div>

      ddiv>
        ddiv className="mb-2 flex items-baseline justify-between">
          dh2 className="heading text-xl font-semibold">Capítulosd/h2>
          dspan className="text-sm text-muted">{st.done} de {book.chapters}d/span>
        d/div>
        dProgressBar value={st.done} total={book.chapters} />
        {hasNext && (
          dp className="mt-3 text-sm text-muted">
            Van en el dspan className="font-semibold text-ink">capítulo {next}d/span>: {nextTitle}
          d/p>
        )}

        ddiv className="mt-4 grid grid-cols-5 gap-2.5 sm:grid-cols-8">
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => {
            const isDone = done.has(n);
            const isNext = hasNext && n === next;
            const partial = !isDone && mine.has(n);
            const cls = isDone
              ? "border-transparent bg-accent text-bg"
              : isNext
              ? "border-transparent bg-brand text-bg"
              : partial
              ? "border-accent bg-surface text-accent"
              : "border-line bg-surface text-ink";
            return (
              dLink
                key={n}
                href={`/libro/${book.slug}/${n}`}
                className={`relative flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold transition active:scale-95 ${cls}`}
                style={isNext ? { animation: "ringPulse 2s ease-out infinite" } : undefined}
              >
                {isDone ? dCheck size={16} /> : n}
                dUnreadBadge n={unreadMap[n]} className="-right-1.5 -top-1.5" />
              d/Link>
            );
          })}
        d/div>

        ddiv className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
          dspan className="flex items-center gap-1.5">dspan className="h-3 w-3 rounded bg-accent" /> Completado por los dosd/span>
          dspan className="flex items-center gap-1.5">dspan className="h-3 w-3 rounded bg-brand" /> Siguiented/span>
          dspan className="flex items-center gap-1.5">dspan className="h-3 w-3 rounded border border-accent" /> Solo tú lo marcasted/span>
          dspan className="flex items-center gap-1.5">dspan className="h-3 w-3 rounded-full bg-red-500" /> Mensaje sin leerd/span>
        d/div>
      d/div>

      <BookRecap slug={book.slug} show={st.complete} />

      {st.complete && (
        ddiv className="card p-6 text-center">
          dTrophy className="mx-auto text-accent" />
          dh3 className="heading mt-2 text-xl font-semibold">¡Terminaron {book.name}!d/h3>
          dp className="mt-1 text-sm text-muted">Repasen lo que vivieron en el libro.d/p>
          ddiv className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            dLink href={`/repaso/${book.slug}`} className="btn-primary">Ver repasod/Link>
            {nextBook && dLink href={`/libro/${nextBook.slug}`} className="btn-ghost">Seguir con {nextBook.name}d/Link>}
          d/div>
        d/div>
      )}
    d/div>
  );
}