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

export async function pushToUsers(userIds, payload) {
  if (!userIds.length || !init()) return;
  const p = await db();
  const r = await p.query(
    "select id, endpoint, p256dh, auth from push_subs where user_id = any($1::int[])",
    [userIds]
  );
  await Promise.allSettled(
    r.rows.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload),
          { TTL: 86400 }
        );
      } catch (e) {
        if (e.statusCode === 404 || e.statusCode === 410) {
          await p.query("delete from push_subs where id = $1", [s.id]);
        } else {
          console.error("push error:", e.statusCode || e.message);
        }
      }
    })
  );
}

export async function pushToPartners(coupleId, exceptUserId, payload) {
  const p = await db();
  const r = await p.query("select id from users where couple_id = $1 and id <> $2", [coupleId, exceptUserId]);
  return pushToUsers(r.rows.map((x) => x.id), payload);
}