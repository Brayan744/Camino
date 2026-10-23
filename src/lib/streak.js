import { db } from "./db";
import { pushToUsers } from "./push";

export const MAX_SAVERS = 2;
// Desde este día la racha exige que ambos lean y escriban. Antes, bastaba con que alguien leyera.
export const RULE_START = "2026-10-23";
const MS = 864e5;

export const dayKey = (d = new Date()) =>
  new Date(d).toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
export const monthKey = (d = new Date()) => dayKey(d).slice(0, 7);
const at = (k) => new Date(k + "T12:00:00-05:00");
export const shift = (k, n) => dayKey(new Date(at(k).getTime() + n * MS));

export function computeStreak(readSet, freezeSet, now = new Date()) {
  const all = new Set([...readSet, ...freezeSet]);
  const t = dayKey(now);
  const y = shift(t, -1);
  const yy = shift(t, -2);
  const chain = (from) => {
    let n = 0;
    let k = from;
    while (all.has(k)) {
      n++;
      k = shift(k, -1);
    }
    return n;
  };
  const todayDone = readSet.has(t);
  const count = chain(all.has(t) ? t : y);
  const lost = !all.has(y) ? chain(yy) : 0;
  const rescue = lost > 0 ? { day: y, lost } : null;

  const days = [...all].sort();
  let best = 0;
  let run = 0;
  let prev = null;
  for (const d of days) {
    run = prev && shift(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return { count, best, todayDone, rescue, t, first: days[0] || null };
}

async function loadDays(coupleId) {
  const p = await db();
  const [us, rd, ms] = await Promise.all([
    p.query("select id, name from users where couple_id = $1 order by id", [coupleId]),
    p.query("select user_id, book, chapter, done_at from reads where couple_id = $1", [coupleId]),
    p.query(
      "select user_id, book, chapter, created_at from messages where couple_id = $1 and kind in ('text','image','audio') and user_id is not null",
      [coupleId]
    ),
  ]);

  const days = {};
  const get = (d) => (days[d] = days[d] || { marked: new Set(), chapters: new Set(), msgs: [] });
  for (const r of rd.rows) {
    const g = get(dayKey(r.done_at));
    g.marked.add(r.user_id);
    g.chapters.add(`${r.book}-${r.chapter}`);
  }
  for (const m of ms.rows) get(dayKey(m.created_at)).msgs.push([m.user_id, `${m.book}-${m.chapter}`]);

  const ids = us.rows.map((x) => x.id);
  const info = {};
  for (const [d, g] of Object.entries(days)) {
    const wrote = new Set(g.msgs.filter(([, k]) => g.chapters.has(k)).map(([u]) => u));
    const legacy = d < RULE_START;
    const complete =
      ids.length > 0 &&
      (legacy ? g.marked.size > 0 : ids.every((id) => g.marked.has(id) && wrote.has(id)));
    info[d] = { marked: g.marked, wrote, complete };
  }
  return { members: us.rows, info };
}

export async function loadStreak(coupleId, meId) {
  const p = await db();
  const [{ members, info }, fr] = await Promise.all([
    loadDays(coupleId),
    p.query("select user_id, day, month from freezes where couple_id = $1", [coupleId]),
  ]);
  const names = Object.fromEntries(members.map((x) => [x.id, x.name]));

  const readSet = new Set();
  const who = {};
  for (const [d, g] of Object.entries(info)) {
    if (g.complete) {
      readSet.add(d);
      who[d] = [...g.marked].map((id) => names[id] || "Alguien");
    }
  }
  const freezeSet = new Set();
  const savedBy = {};
  for (const f of fr.rows) {
    freezeSet.add(f.day);
    savedBy[f.day] = names[f.user_id] || "Alguien";
  }

  const s = computeStreak(readSet, freezeSet);
  const month = monthKey();
  const savers = members.map((x) => ({
    id: x.id,
    name: x.name,
    mine: x.id === meId,
    left: Math.max(0, MAX_SAVERS - fr.rows.filter((f) => f.user_id === x.id && f.month === month).length),
  }));

  const ti = info[s.t];
  const today = members.map((x) => ({
    id: x.id,
    name: x.name,
    mine: x.id === meId,
    marked: !!(ti && ti.marked.has(x.id)),
    wrote: !!(ti && ti.wrote.has(x.id)),
  }));

  const week = [];
  for (let i = 6; i >= 0; i--) {
    const k = shift(s.t, -i);
    let state = "missed";
    if (readSet.has(k)) state = "read";
    else if (freezeSet.has(k)) state = "saved";
    else if (k === s.t) state = "today";
    else if (!s.first || k < s.first) state = "none";
    week.push({
      key: k,
      state,
      label: at(k).toLocaleDateString("es", { weekday: "narrow", timeZone: "America/Bogota" }),
      full: at(k).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Bogota" }),
      who: who[k] || [],
      savedBy: savedBy[k] || null,
    });
  }

  return { count: s.count, best: s.best, todayDone: s.todayDone, rescue: s.rescue, week, savers, today };
}

// Si hoy ya cumplieron los dos y aún no se había encendido, lo enciende y avisa en el chat.
export async function maybeLightStreak(coupleId, book, chapter) {
  const p = await db();
  const { members, info } = await loadDays(coupleId);
  const t = dayKey();
  if (!info[t] || !info[t].complete) return false;
  const ins = await p.query(
    "insert into streak_days(couple_id, day) values($1,$2) on conflict do nothing returning 1",
    [coupleId, t]
  );
  if (!ins.rowCount) return false;

  const s = await loadStreak(coupleId, 0);
  const text = `${s.count} ${s.count === 1 ? "día seguido" : "días seguidos"}`;
  await p.query(
    "insert into messages(couple_id, book, chapter, user_id, kind, body) values($1,$2,$3,null,'streak',$4)",
    [coupleId, book, chapter, `🔥 ¡Racha encendida! Llevan ${text}`]
  );
  pushToUsers(members.map((m) => m.id), {
    kind: "streak",
    title: "🔥 ¡Racha encendida!",
    body: `Los dos cumplieron hoy. Llevan ${text}.`,
    url: "/inicio",
    tag: "streak",
  }).catch(() => {});
  return true;
}