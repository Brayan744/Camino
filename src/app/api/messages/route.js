import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { getBook } from "@/lib/content";
import { UPLOAD_DIR, EXT, MAX_BYTES } from "@/lib/files";

export const dynamic = "force-dynamic";
const bad = (m, s = 400) => NextResponse.json({ error: m }, { status: s });

function validChapter(book, chapter) {
  const b = getBook(book);
  const n = parseInt(chapter, 10);
  return b && n >= 1 && n <= b.chapters ? n : null;
}

export async function GET(req) {
  const u = await getUser();
  if (!u) return bad("No autorizado", 401);
  const sp = new URL(req.url).searchParams;
  const book = sp.get("book");
  const n = validChapter(book, sp.get("chapter"));
  if (!n) return bad("Capítulo inválido");
  const after = parseInt(sp.get("after") || "0", 10) || 0;
  const p = await db();
  const r = await p.query(
    `select m.id, m.kind, m.body, m.file, m.created_at, m.user_id, u.name
       from messages m left join users u on u.id = m.user_id
      where m.couple_id = $1 and m.book = $2 and m.chapter = $3 and m.id > $4
      order by m.id limit 300`,
    [u.couple_id, book, n, after]
  );
  return NextResponse.json({ messages: r.rows.map((m) => ({ ...m, mine: m.user_id === u.id })) });
}

export async function POST(req) {
  const u = await getUser();
  if (!u) return bad("No autorizado", 401);
  let fd;
  try {
    fd = await req.formData();
  } catch (e) {
    return bad("Datos inválidos");
  }
  const book = String(fd.get("book") || "");
  const n = validChapter(book, fd.get("chapter"));
  if (!n) return bad("Capítulo inválido");

  const text = String(fd.get("text") || "").trim().slice(0, 4000);
  const file = fd.get("file");
  let kind = "text";
  let name = null;

  if (file && typeof file === "object" && file.size > 0) {
    if (file.size > MAX_BYTES) return bad("El archivo pesa más de 20 MB.");
    const type = String(file.type || "").split(";")[0].toLowerCase();
    const ext = EXT[type];
    if (!ext) return bad("Tipo de archivo no permitido.");
    kind = type.startsWith("image/") ? "image" : "audio";
    name = crypto.randomBytes(16).toString("hex") + "." + ext;
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  }

  if (!text && !name) return bad("Mensaje vacío.");

  const p = await db();
  await p.query(
    "insert into messages(couple_id, book, chapter, user_id, kind, body, file) values($1,$2,$3,$4,$5,$6,$7)",
    [u.couple_id, book, n, u.id, kind, text || null, name]
  );
  return NextResponse.json({ ok: true });
}