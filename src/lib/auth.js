import crypto from "crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "./db";

const secret = () => process.env.SESSION_SECRET || "cambia-esta-clave-en-easypanel";
const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("hex");

export function hashPin(pin) {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt + ":" + crypto.scryptSync(pin, salt, 32).toString("hex");
}

export function checkPin(pin, stored) {
  const [salt, h] = stored.split(":");
  const t = crypto.scryptSync(pin, salt, 32);
  return crypto.timingSafeEqual(t, Buffer.from(h, "hex"));
}

export function makeCode() {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += A[crypto.randomInt(A.length)];
  return s;
}

export function setSession(userId) {
  cookies().set("session", `${userId}.${sign(String(userId))}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}

export function clearSession() {
  cookies().delete("session");
}

export const getUser = cache(async () => {
  const c = cookies().get("session")?.value;
  if (!c) return null;
  const [id, sig] = c.split(".");
  if (!id || !sig) return null;
  const exp = sign(id);
  if (sig.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return null;
  const p = await db();
  const r = await p.query(
    "select u.id, u.name, u.couple_id, c.code from users u join couples c on c.id = u.couple_id where u.id = $1",
    [id]
  );
  return r.rows[0] || null;
});