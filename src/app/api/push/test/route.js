import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { pushToUsers, publicKey } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST() {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!publicKey()) return NextResponse.json({ error: "Faltan las claves VAPID en el servidor." }, { status: 500 });

  const p = await db();
  const partner = (
    await p.query(
      `select u.name, (select count(*)::int from push_subs s where s.user_id = u.id) as subs
         from users u where u.couple_id = $1 and u.id <> $2`,
      [u.couple_id, u.id]
    )
  ).rows[0];

  const r = await pushToUsers([u.id], {
    kind: "test",
    title: "🔔 ¡Funciona!",
    body: "Así te llegarán los avisos de Camino de la Palabra.",
    url: "/inicio",
    tag: "test",
  });

  if (!r.subs) {
    return NextResponse.json(
      { error: "Este dispositivo no está suscrito. Cierra y abre la app, y toca Activar de nuevo.", partner },
      { status: 400 }
    );
  }
  if (!r.sent) {
    return NextResponse.json(
      { error: `El servidor no pudo enviar (${r.errors.join(", ")}). Cierra y abre la app para volver a suscribirte.`, partner },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, devices: r.sent, partner });
}
