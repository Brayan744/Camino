import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { getBook } from "@/lib/content";
import { loadProgress, bookStates } from "@/lib/progress";
import { maybeLightStreak } from "@/lib/streak";
import { pushToPartners } from "@/lib/push";

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

  const members = (await p.query("select count(*)::int as n from users where couple_id = $1", [u.couple_id])).rows[0].n;
  let lit = false;
  let chapterDone = false;

  if (done) {
    const r = await p.query(
      "insert into reads(couple_id, user_id, book, chapter) values($1,$2,$3,$4) on conflict do nothing returning 1",
      [u.couple_id, u.id, book, n]
    );
    if (r.rowCount) {
      await p.query(
        "insert into messages(couple_id, book, chapter, user_id, kind, body) values($1,$2,$3,$4,'system',$5)",
        [u.couple_id, book, n, u.id, `${u.name} marcó este capítulo como leído ✓`]
      );
    }

    const c = (
      await p.query("select count(*)::int as n from reads where couple_id=$1 and book=$2 and chapter=$3", [u.couple_id, book, n])
    ).rows[0].n;
    if (c >= members) {
      const ins = await p.query(
        "insert into progress(couple_id, book, chapter, user_id) values($1,$2,$3,$4) on conflict do nothing returning 1",
        [u.couple_id, book, n, u.id]
      );
      chapterDone = true;
      if (ins.rowCount && members > 1) {
        await p.query(
          "insert into messages(couple_id, book, chapter, user_id, kind, body) values($1,$2,$3,null,'system',$4)",
          [u.couple_id, book, n, "🎉 ¡Los dos terminaron este capítulo!"]
        );
      }
    }

    // Siempre se avisa a la pareja cuando alguien marca un capítulo, se espera a que termine el envío
    try {
      await pushToPartners(u.couple_id, u.id, {
        kind: "progress",
        title: `${u.name} leyó ${b.name} ${n} ✓`,
        body: chapterDone ? "¡Los dos terminaron este capítulo! 🎉" : "Marca el tuyo cuando termines.",
        url: `/libro/${book}/${n}`,
        tag: `read-${book}-${n}-${Date.now()}`,
      });
    } catch (e) {
      console.error("push progress:", e.message);
    }

    lit = await maybeLightStreak(u.couple_id, book, n).catch(() => false);
  } else {
    await p.query("delete from reads where user_id=$1 and book=$2 and chapter=$3", [u.id, book, n]);
    await p.query("delete from progress where couple_id=$1 and book=$2 and chapter=$3", [u.couple_id, book, n]);
  }
  return NextResponse.json({ ok: true, lit, chapterDone });
}
