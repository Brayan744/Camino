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

const day = (d) => new Date(d).toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

export function streak(rows) {
  const days = new Set(rows.map((r) => day(r.done_at)));
  let cur = new Date();
  if (!days.has(day(cur))) cur = new Date(cur.getTime() - 864e5);
  let n = 0;
  while (days.has(day(cur))) {
    n++;
    cur = new Date(cur.getTime() - 864e5);
  }
  return n;
}