import webpush from "web-push";
import { db } from "./db";

let ready = false;
function init() {
  if (ready) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@example.com", pub, priv);
  ready = true;
  return true;
}

export const publicKey = () => process.env.VAPID_PUBLIC_KEY || "";

// Devuelve un resumen: cuántas suscripciones había, cuántas se enviaron y cuántas fallaron.
export async function pushToUsers(userIds, payload) {
  const out = { subs: 0, sent: 0, failed: 0, errors: [] };
  if (!userIds.length) return out;
  if (!init()) {
    out.errors.push("Faltan las claves VAPID en el servidor");
    console.error("push: faltan VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY");
    return out;
  }
  const p = await db();
  const r = await p.query(
    "select id, user_id, endpoint, p256dh, auth from push_subs where user_id = any($1::int[])",
    [userIds]
  );
  out.subs = r.rows.length;
  if (!r.rows.length) console.warn("push: los usuarios", userIds.join(","), "no tienen suscripciones");

  await Promise.all(
    r.rows.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload),
          { TTL: 86400, urgency: "high" }
        );
        out.sent++;
      } catch (e) {
        out.failed++;
        const code = e.statusCode || e.message;
        out.errors.push(String(code));
        console.error("push error:", code, (e.body || "").toString().slice(0, 200));
        // Suscripción vencida o creada con otras claves: se borra para que el dispositivo se vuelva a suscribir.
        if ([400, 401, 403, 404, 410].includes(e.statusCode)) {
          await p.query("delete from push_subs where id = $1", [s.id]).catch(() => {});
        }
      }
    })
  );
  console.log(`push: usuarios [${userIds}] subs=${out.subs} enviadas=${out.sent} fallidas=${out.failed}`);
  return out;
}

export async function pushToPartners(coupleId, exceptUserId, payload) {
  const p = await db();
  const r = await p.query("select id from users where couple_id = $1 and id <> $2", [coupleId, exceptUserId]);
  return pushToUsers(r.rows.map((x) => x.id), payload);
}
