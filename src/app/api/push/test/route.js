import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { pushToUsers, publicKey } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST() {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!publicKey()) return NextResponse.json({ error: "Faltan las claves VAPID en el servidor." }, { status: 500 });
  await pushToUsers([u.id], {
    kind: "test",
    title: "🔔 ¡Funciona!",
    body: "Así te llegarán los avisos de Camino de la Palabra.",
    url: "/inicio",
    tag: "test",
  });
  return NextResponse.json({ ok: true });
}