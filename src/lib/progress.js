import { db } from "./db";
import { BOOKS } from "@/data/books";

export async function loadProgress(coupleId) {
  const p = await db();
  const r = await p.query(
    "select book, chapter, done_at, user_id from progress where couple_id = $1 order by done_at",
    [coupleId]
  );
  return r.rows;
}

export function bookStates(rows) {
  const counts = {};
  for (const r of rows) counts[r.book] = (counts[r.book] || 0) + 1;
  let prevComplete = true;
  return BOOKS.map((b) => {
    const done = counts[b.slug] || 0;
    const complete = done >= b.chapters;
    const unlocked = prevComplete;
    prevComplete = complete;
    return { ...b, done, complete, unlocked };
  });
}

export async function loadReads(coupleId) {
  const p = await db();
  const r = await p.query("select user_id, book, chapter from reads where couple_id = $1", [coupleId]);
  return r.rows;
}

export async function chapterReaders(coupleId, book, chapter) {
  const p = await db();
  const r = await p.query(
    "select user_id from reads where couple_id = $1 and book = $2 and chapter = $3",
    [coupleId, book, chapter]
  );
  return new Set(r.rows.map((x) => x.user_id));
}

export async function loadUnread(coupleId, userId) {
  const p = await db();
  const r = await p.query(
    `select book, chapter, count(*)::int as n from messages
      where couple_id = $1 and user_id <> $2 and kind in ('text','image','audio') and read_at is null
      group by book, chapter`,
    [coupleId, userId]
  );
  return r.rows;
}