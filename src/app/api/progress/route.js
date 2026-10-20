import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { getBook } from "@/lib/content";
import { loadProgress, bookStates } from "@/lib/progress";

export const dynamic = "force-dynamic";
const bad = (m, s = 400) => NextResponse.json({ error: m }, { status: s });

export async function POST(req) {
  const u = await getUser();
  if (!u) return bad("No autorizado", 401);
  const { book, chapter, done } = await req.json().catch(() => ({}));
  const b = getBook(book);
  const n = parseInt(chapter, 10);
  if (!b || !(n >= 1 && n <= b.chapters)) return bad("Capítulo inválido");

  const p = await db();
  const rows = await loadProgress(u.couple_id);
  const st = bookStates(rows).find((s) => s.slug === book);
  if (!st.unlocked) return bad("Este libro aún está bloqueado.", 403);

  if (done) {
    const r = await p.query(
      "insert into progress(couple_id, book, chapter, user_id) values($1,$2,$3,$4) on conflict do nothing returning 1",
      [u.couple_id, book, n, u.id]
    );
    if (r.rowCount) {
      await p.query(
        "insert into messages(couple_id, book, chapter, user_id, kind, body) values($1,$2,$3,$4,'system',$5)",
        [u.couple_id, book, n, u.id, `${u.name} marcó este capítulo como leído ✓`]
      );
    }
  } else {
    await p.query("delete from progress where couple_id=$1 and book=$2 and chapter=$3", [u.couple_id, book, n]);
  }
  return NextResponse.json({ ok: true });
}