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

    let kind = null;
    let payload = null;
    let targets = s.savers;

    if (s.rescue) {
      kind = "rescue";
      targets = s.savers.filter((x) => x.left > 0);
      payload = {
        kind: "streak",
        title: "🛡️ ¡Su racha está en peligro!",
        body: `Ayer no leyeron. Usen un salvarracha y conserven sus ${s.rescue.lost} ${dias(s.rescue.lost)}.`,
        url: "/inicio",
        tag: "streak",
      };
    } else if (!s.todayDone && s.count > 0 && hour >= 19) {
      if (hour >= 21) {
        kind = "late";
        payload = {
          kind: "streak",
          title: `🔥 ¡Últimas horas! Racha de ${s.count} ${dias(s.count)}`,
          body: "Lean un capítulo antes de que termine el día.",
          url: "/inicio",
          tag: "streak",
        };
      } else {
        kind = "eve";
        payload = {
          kind: "streak",
          title: `🔥 Su racha de ${s.count} ${dias(s.count)} los espera`,
          body: "Aún no han leído hoy. Con un capítulo la mantienen.",
          url: "/inicio",
          tag: "streak",
        };
      }
    }
    if (!kind) continue;

    for (const t of targets) {
      const ins = await p.query(
        "insert into reminders_log(user_id, day, kind) values($1,$2,$3) on conflict do nothing returning 1",
        [t.id, today, kind]
      );
      if (ins.rowCount) await pushToUsers([t.id], payload);
    }
  }
}