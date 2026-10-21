import { db } from "./db";

export const MAX_SAVERS = 2;
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

export async function loadStreak(coupleId, meId) {
  const p = await db();
  const [pr, fr, us] = await Promise.all([
    p.query("select user_id, done_at from progress where couple_id = $1", [coupleId]),
    p.query("select user_id, day, month from freezes where couple_id = $1", [coupleId]),
    p.query("select id, name from users where couple_id = $1 order by id", [coupleId]),
  ]);
  const names = Object.fromEntries(us.rows.map((x) => [x.id, x.name]));

  const readSet = new Set();
  const who = {};
  for (const r of pr.rows) {
    const d = dayKey(r.done_at);
    readSet.add(d);
    if (!who[d]) who[d] = new Set();
    who[d].add(names[r.user_id] || "Alguien");
  }
  const freezeSet = new Set();
  const savedBy = {};
  for (const f of fr.rows) {
    freezeSet.add(f.day);
    savedBy[f.day] = names[f.user_id] || "Alguien";
  }

  const s = computeStreak(readSet, freezeSet);
  const month = monthKey();
  const savers = us.rows.map((x) => ({
    id: x.id,
    name: x.name,
    mine: x.id === meId,
    left: Math.max(0, MAX_SAVERS - fr.rows.filter((f) => f.user_id === x.id && f.month === month).length),
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
      who: [...(who[k] || [])],
      savedBy: savedBy[k] || null,
    });
  }

  return { count: s.count, best: s.best, todayDone: s.todayDone, rescue: s.rescue, week, savers };
}