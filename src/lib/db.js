import pg from "pg";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS couples (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (couple_id, name)
);
CREATE TABLE IF NOT EXISTS progress (
  couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INT NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  done_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (couple_id, book, chapter)
);
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INT NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL DEFAULT 'text',
  body TEXT,
  file TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS dur INT;
CREATE INDEX IF NOT EXISTS messages_chapter_idx ON messages (couple_id, book, chapter, id);
CREATE TABLE IF NOT EXISTS push_subs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS freezes (
  couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (couple_id, day)
);
CREATE TABLE IF NOT EXISTS reminders_log (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  kind TEXT NOT NULL,
  PRIMARY KEY (user_id, day, kind)
);
CREATE TABLE IF NOT EXISTS reads (
  couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter INT NOT NULL,
  done_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, book, chapter)
);
CREATE TABLE IF NOT EXISTS streak_days (
  couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  PRIMARY KEY (couple_id, day)
);
INSERT INTO reads (couple_id, user_id, book, chapter, done_at)
SELECT p.couple_id, u.id, p.book, p.chapter, p.done_at
  FROM progress p JOIN users u ON u.couple_id = p.couple_id
 WHERE NOT EXISTS (SELECT 1 FROM reads)
ON CONFLICT DO NOTHING;
`;

const g = globalThis;

export async function db() {
  if (!g.__pgPool) {
    g.__pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 8 });
  }
  if (!g.__pgReady) {
    g.__pgReady = g.__pgPool.query(SCHEMA).catch((e) => {
      g.__pgReady = null;
      throw e;
    });
  }
  await g.__pgReady;
  return g.__pgPool;
}