import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPin, checkPin, setSession, makeCode } from "@/lib/auth";

const err = (m, s = 400) => NextResponse.json({ error: m }, { status: s });

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode;
    const name = String(body.name || "").trim().slice(0, 30);
    const pin = String(body.pin || "");
    const code = String(body.code || "").trim().toUpperCase();

    if (!name) return err("Escribe tu nombre.");
    if (!/^\d{4,8}$/.test(pin)) return err("El PIN debe tener de 4 a 8 números.");

    const p = await db();

    if (mode === "create") {
      let c = null;
      for (let i = 0; i < 5 && !c; i++) {
        try {
          c = (await p.query("insert into couples(code) values($1) returning id, code", [makeCode()])).rows[0];
        } catch (e) {}
      }
      if (!c) return err("No se pudo crear la pareja. Intenta de nuevo.", 500);
      const u = (
        await p.query("insert into users(couple_id, name, pin_hash) values($1,$2,$3) returning id", [c.id, name, hashPin(pin)])
      ).rows[0];
      setSession(u.id);
      return NextResponse.json({ ok: true, code: c.code });
    }

    const c = (await p.query("select id from couples where code = $1", [code])).rows[0];
    if (!c) return err("Ese código no existe.");

    if (mode === "join") {
      const n = (await p.query("select count(*)::int as n from users where couple_id = $1", [c.id])).rows[0].n;
      if (n >= 2) return err("Esta pareja ya está completa.");
      try {
        const u = (
          await p.query("insert into users(couple_id, name, pin_hash) values($1,$2,$3) returning id", [c.id, name, hashPin(pin)])
        ).rows[0];
        setSession(u.id);
        return NextResponse.json({ ok: true });
      } catch (e) {
        return err("Ese nombre ya está en uso en esta pareja.");
      }
    }

    if (mode === "login") {
      const u = (
        await p.query("select id, pin_hash from users where couple_id = $1 and lower(name) = lower($2)", [c.id, name])
      ).rows[0];
      if (!u || !checkPin(pin, u.pin_hash)) return err("Nombre o PIN incorrectos.");
      setSession(u.id);
      return NextResponse.json({ ok: true });
    }

    return err("Solicitud inválida.");
  } catch (e) {
    console.error(e);
    return err("No se pudo conectar con la base de datos.", 500);
  }
}