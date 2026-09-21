-- =========================================================
-- 行銷知識智庫 — Cloudflare D1 Schema
-- 執行方式：D1 Console 貼上執行，或
--   npx wrangler d1 execute marketing-kb --file=marketing-kb/schema.sql
-- =========================================================

-- 使用者（每個人有自己獨立的智庫）
CREATE TABLE IF NOT EXISTS kb_users (
  id            TEXT PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt          TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

-- 登入 Session（Token 90 天有效）
CREATE TABLE IF NOT EXISTS kb_sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 知識條目（deleted=1 為軟刪除，用來讓刪除動作同步到其他裝置）
CREATE TABLE IF NOT EXISTS kb_entries (
  id         TEXT NOT NULL,
  user_id    TEXT NOT NULL,
  q          TEXT NOT NULL,
  a          TEXT NOT NULL,
  cat        TEXT NOT NULL DEFAULT '其他',
  tags       TEXT NOT NULL DEFAULT '[]',   -- JSON 陣列
  source     TEXT NOT NULL DEFAULT '',
  star       INTEGER NOT NULL DEFAULT 0,
  review     TEXT NOT NULL DEFAULT '{}',   -- JSON 物件：複習次數與結果
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,                -- 同步衝突以這個時間較新者為準
  deleted    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, id)
);

CREATE INDEX IF NOT EXISTS idx_kb_entries_user_updated ON kb_entries(user_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_kb_sessions_user        ON kb_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_kb_sessions_expires     ON kb_sessions(expires_at);
