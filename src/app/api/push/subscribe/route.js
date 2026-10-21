import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const s = await req.json().catch(() => null);
  const endpoint = s?.endpoint;
  const k = s?.keys;
  if (!endpoint || !k?.p256dh || !k?.auth) return NextResponse.json({ error: "Suscripción inválida" }, { status: 400 });
  const p = await db();
  await p.query(
    `insert into push_subs(user_id, endpoint, p256dh, auth) values($1,$2,$3,$4)
     on conflict (endpoint) do update set user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth`,
    [u.id, endpoint, k.p256dh, k.auth]
  );
  return NextResponse.json({ ok: true });
}