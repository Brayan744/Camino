import fs from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { UPLOAD_DIR, TYPES } from "@/lib/files";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const u = await getUser();
  if (!u) return new Response("No autorizado", { status: 401 });
  const name = params.name;
  if (!/^[a-f0-9]{32}\.[a-z0-9]{2,5}$/.test(name)) return new Response("No encontrado", { status: 404 });

  const p = await db();
  const ok = await p.query("select 1 from messages where file = $1 and couple_id = $2 limit 1", [name, u.couple_id]);
  if (!ok.rowCount) return new Response("No encontrado", { status: 404 });

  const file = path.join(UPLOAD_DIR, name);
  let s;
  try {
    s = await stat(file);
  } catch (e) {
    return new Response("No encontrado", { status: 404 });
  }

  const type = TYPES[name.split(".").pop()] || "application/octet-stream";
  const base = { "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "private, max-age=86400" };
  const range = req.headers.get("range");
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range);

  if (m && (m[1] || m[2])) {
    let start, end;
    if (m[1] === "") {
      start = Math.max(0, s.size - parseInt(m[2], 10));
      end = s.size - 1;
    } else {
      start = parseInt(m[1], 10);
      end = m[2] ? Math.min(parseInt(m[2], 10), s.size - 1) : s.size - 1;
    }
    if (start > end || start >= s.size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${s.size}` } });
    }
    const stream = fs.createReadStream(file, { start, end });
    return new Response(Readable.toWeb(stream), {
      status: 206,
      headers: { ...base, "Content-Length": String(end - start + 1), "Content-Range": `bytes ${start}-${end}/${s.size}` },
    });
  }

  return new Response(Readable.toWeb(fs.createReadStream(file)), {
    headers: { ...base, "Content-Length": String(s.size) },
  });
}