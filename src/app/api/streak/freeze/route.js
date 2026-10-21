import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { loadStreak, monthKey } from "@/lib/streak";
import { pushToPartners } from "@/lib/push";

export const dynamic = "force-dynamic";
const bad = (m, s = 400) => NextResponse.json({ error: m }, { status: s });

export async function POST() {
  const u = await getUser();
  if (!u) return bad("No autorizado", 401);
  const s = await loadStreak(u.couple_id, u.id);
  if (!s.rescue) return bad("Ahora mismo no hay una racha que salvar.");
  const me = s.savers.find((x) => x.mine);
  if (!me || me.left <= 0) return bad("Ya usaste tus salvarrachas de este mes.");

  const p = await db();
  await p.query(
    "insert into freezes(couple_id, user_id, day, month) values($1,$2,$3,$4) on conflict do nothing",
    [u.couple_id, u.id, s.rescue.day, monthKey()]
  );
  pushToPartners(u.couple_id, u.id, {
    kind: "streak",
    title: "🛡️ Racha salvada",
    body: `${u.name} usó un salvarracha y conservó sus ${s.rescue.lost} días.`,
    url: "/inicio",
    tag: "streak",
  }).catch(() => {});
  return NextResponse.json({ ok: true });
}