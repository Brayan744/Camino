import { db } from "./db";
import { pushToUsers } from "./push";
import { loadStreak, dayKey } from "./streak";

const dias = (n) => (n === 1 ? "día" : "días");

export function startReminders() {
  if (globalThis.__remindersOn) return;
  globalThis.__remindersOn = true;
  const run = () => tick().catch((e) => console.error("reminders:", e.message));
  setTimeout(run, 45000);
  setInterval(run, 10 * 60 * 1000);
}

async function tick() {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
  const hour =
    parseInt(new Date().toLocaleString("en-US", { timeZone: "America/Bogota", hour: "numeric", hour12: false }), 10) % 24;
  if (hour < 9) return;

  const p = await db();
  const today = dayKey();
  const couples = await p.query("select id from couples");

  for (const c of couples.rows) {
    const s = await loadStreak(c.id, 0);
    if (!s.savers.length) continue;

    if (s.rescue) {
      const payload = {
        kind: "streak",
        title: "🛡️ ¡Su racha está en peligro!",
        body: `Ayer no cumplieron. Usen un salvarracha y conserven sus ${s.rescue.lost} ${dias(s.rescue.lost)}.`,
        url: "/inicio",
        tag: "streak",
      };
      for (const t of s.savers.filter((x) => x.left > 0)) await send(p, t.id, today, "rescue", payload);
      continue;
    }

    if (s.todayDone || s.count === 0 || hour < 19) continue;
    const late = hour >= 21;
    const kind = late ? "late" : "eve";

    for (const t of s.today) {
      if (t.marked && t.wrote) continue;
      const need = !t.marked
        ? "Aún no marcas tu capítulo de hoy."
        : "Ya leíste, pero falta escribir en el chat del capítulo.";
      await send(p, t.id, today, kind, {
        kind: "streak",
        title: late
          ? `🔥 ¡Últimas horas! Racha de ${s.count} ${dias(s.count)}`
          : `🔥 Su racha de ${s.count} ${dias(s.count)} los espera`,
        body: need,
        url: "/inicio",
        tag: "streak",
      });
    }
  }
}

async function send(p, userId, day, kind, payload) {
  const ins = await p.query(
    "insert into reminders_log(user_id, day, kind) values($1,$2,$3) on conflict do nothing returning 1",
    [userId, day, kind]
  );
  if (ins.rowCount) await pushToUsers([userId], payload);
}