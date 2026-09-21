/**
 * 行銷知識智庫 — Cloudflare Worker
 *
 * 部署需求：
 *   1. D1 綁定，binding 名稱 = DB（結構見 marketing-kb/schema.sql）
 *   2. Secret（可選）：ANTHROPIC_API_KEY — 設定後手機／其他裝置不必自備 API Key
 *   3. Secret（建議）：REGISTER_CODE — 設定後註冊需輸入邀請碼，避免陌生人註冊
 *
 * 認證規則：
 *   - /api/health、/api/auth/register、/api/auth/login 免登入
 *   - 其餘 /api/* 都需要 Header: Authorization: Bearer <token>
 *
 * 同步策略：本機優先（local-first），以 updated_at 較新者為準（last-write-wins）。
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });

const uid = (p) => p + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const nowISO = () => new Date().toISOString();

const MAX_SYNC_ENTRIES = 5000;   // 單次同步上限，避免超大請求
const MAX_Q = 2000;              // 單題長度上限
const MAX_A = 20000;

/* ---------- 密碼雜湊（PBKDF2-SHA256，10 萬次迭代） ---------- */
const bufToHex = (buf) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
const hexToBuf = (hex) => new Uint8Array(hex.match(/.{2}/g).map(h => parseInt(h, 16)));
const randomHex = (bytes) => bufToHex(crypto.getRandomValues(new Uint8Array(bytes)));

async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: hexToBuf(saltHex), iterations: 100000 }, key, 256);
  return bufToHex(bits);
}

/* 比對時間長度固定，避免以回應時間推測雜湊值 */
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function getUser(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;
  const row = await env.DB.prepare(
    `SELECT u.id, u.username, s.expires_at
       FROM kb_sessions s JOIN kb_users u ON u.id = s.user_id
      WHERE s.token = ?`).bind(token).first();
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    await env.DB.prepare("DELETE FROM kb_sessions WHERE token=?").bind(token).run();
    return null;
  }
  return { id: row.id, username: row.username, token };
}

/* ---------- 條目正規化：前端物件 <-> 資料庫列 ---------- */
function cleanEntry(e) {
  if (!e || typeof e !== "object") return null;
  const id = String(e.id || "").slice(0, 64);
  const q = String(e.q || "").trim().slice(0, MAX_Q);
  const a = String(e.a || "").trim().slice(0, MAX_A);
  if (!id || !q || !a) return null;
  const tags = Array.isArray(e.tags) ? e.tags.map(t => String(t).slice(0, 40)).slice(0, 12) : [];
  const review = (e.review && typeof e.review === "object") ? e.review : {};
  return {
    id, q, a,
    cat: String(e.cat || "其他").slice(0, 40),
    tags: JSON.stringify(tags),
    source: String(e.source || "").slice(0, 120),
    star: e.star ? 1 : 0,
    review: JSON.stringify(review).slice(0, 500),
    created_at: String(e.createdAt || nowISO()).slice(0, 40),
    updated_at: String(e.updatedAt || e.createdAt || nowISO()).slice(0, 40),
  };
}

function rowToEntry(r) {
  let tags = [], review = { count: 0, last: null, right: 0, wrong: 0 };
  try { tags = JSON.parse(r.tags) || []; } catch (e) {}
  try { review = Object.assign(review, JSON.parse(r.review) || {}); } catch (e) {}
  return {
    id: r.id, q: r.q, a: r.a, cat: r.cat, tags,
    source: r.source, star: !!r.star, review,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = request.method;

    try {
      /* ==================== 健康檢查 ==================== */
      if (path === "/api/health" && method === "GET") {
        const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM kb_users").first();
        return json({
          ok: true,
          users: r ? r.n : 0,
          ai: !!env.ANTHROPIC_API_KEY,          // 後端是否已設定 API Key
          inviteRequired: !!env.REGISTER_CODE,
          serverTime: nowISO(),
        });
      }

      /* ==================== 註冊 ==================== */
      if (path === "/api/auth/register" && method === "POST") {
        const b = await request.json();
        const username = String(b.username || "").trim();
        const password = String(b.password || "");
        if (username.length < 3) return json({ error: "帳號至少 3 個字" }, 400);
        if (password.length < 8) return json({ error: "密碼至少 8 個字" }, 400);
        if (env.REGISTER_CODE && String(b.inviteCode || "") !== env.REGISTER_CODE) {
          return json({ error: "邀請碼不正確" }, 403);
        }
        const dup = await env.DB.prepare("SELECT id FROM kb_users WHERE username=?").bind(username).first();
        if (dup) return json({ error: "這個帳號已經有人使用了" }, 409);

        const id = uid("u");
        const salt = randomHex(16);
        const hash = await hashPassword(password, salt);
        await env.DB.prepare(
          "INSERT INTO kb_users (id, username, password_hash, salt, created_at) VALUES (?,?,?,?,?)"
        ).bind(id, username, hash, salt, nowISO()).run();

        const token = randomHex(32);
        const expires = new Date(Date.now() + 90 * 86400000).toISOString();
        await env.DB.prepare(
          "INSERT INTO kb_sessions (token, user_id, expires_at, created_at) VALUES (?,?,?,?)"
        ).bind(token, id, expires, nowISO()).run();
        return json({ token, username, expiresAt: expires });
      }

      /* ==================== 登入 ==================== */
      if (path === "/api/auth/login" && method === "POST") {
        const b = await request.json();
        const username = String(b.username || "").trim();
        const password = String(b.password || "");
        const user = await env.DB.prepare("SELECT * FROM kb_users WHERE username=?").bind(username).first();
        if (!user) return json({ error: "帳號或密碼不正確" }, 401);
        const hash = await hashPassword(password, user.salt);
        if (!safeEqual(hash, user.password_hash)) return json({ error: "帳號或密碼不正確" }, 401);

        const token = randomHex(32);
        const expires = new Date(Date.now() + 90 * 86400000).toISOString();
        await env.DB.prepare(
          "INSERT INTO kb_sessions (token, user_id, expires_at, created_at) VALUES (?,?,?,?)"
        ).bind(token, user.id, expires, nowISO()).run();
        await env.DB.prepare("DELETE FROM kb_sessions WHERE expires_at < ?").bind(nowISO()).run();
        return json({ token, username: user.username, expiresAt: expires });
      }

      /* ---------- 以下都需要登入 ---------- */
      const me = await getUser(request, env);
      if (path.startsWith("/api/")) {
        if (!me) return json({ error: "未登入或登入已過期" }, 401);
      } else {
        return json({ error: "Not found" }, 404);
      }

      if (path === "/api/auth/me" && method === "GET") {
        const r = await env.DB.prepare(
          "SELECT COUNT(*) AS n FROM kb_entries WHERE user_id=? AND deleted=0").bind(me.id).first();
        return json({ username: me.username, entries: r ? r.n : 0 });
      }

      if (path === "/api/auth/logout" && method === "POST") {
        await env.DB.prepare("DELETE FROM kb_sessions WHERE token=?").bind(me.token).run();
        return json({ ok: true });
      }

      if (path === "/api/auth/password" && method === "POST") {
        const b = await request.json();
        const oldPw = String(b.oldPassword || "");
        const newPw = String(b.newPassword || "");
        if (newPw.length < 8) return json({ error: "新密碼至少 8 個字" }, 400);
        const user = await env.DB.prepare("SELECT * FROM kb_users WHERE id=?").bind(me.id).first();
        const hash = await hashPassword(oldPw, user.salt);
        if (!safeEqual(hash, user.password_hash)) return json({ error: "原密碼不正確" }, 401);
        const salt = randomHex(16);
        const newHash = await hashPassword(newPw, salt);
        await env.DB.prepare("UPDATE kb_users SET password_hash=?, salt=? WHERE id=?")
          .bind(newHash, salt, me.id).run();
        await env.DB.prepare("DELETE FROM kb_sessions WHERE user_id=? AND token<>?")
          .bind(me.id, me.token).run();   // 其他裝置需重新登入
        return json({ ok: true });
      }

      /* ==================== 同步（核心） ====================
         body: { entries: [...本機全部條目...], deleted: [{id, at}] }
         回傳: { entries: [...合併後的全部條目...], serverTime, stats }
      */
      if (path === "/api/sync" && method === "POST") {
        const b = await request.json();
        const incoming = Array.isArray(b.entries) ? b.entries : [];
        const tombstones = Array.isArray(b.deleted) ? b.deleted : [];
        if (incoming.length > MAX_SYNC_ENTRIES) {
          return json({ error: `單次同步上限 ${MAX_SYNC_ENTRIES} 條，目前 ${incoming.length} 條` }, 413);
        }

        const existing = await env.DB.prepare(
          "SELECT id, updated_at, deleted FROM kb_entries WHERE user_id=?").bind(me.id).all();
        const have = new Map((existing.results || []).map(r => [r.id, r]));

        const stmts = [];
        let pushed = 0, skipped = 0;
        for (const raw of incoming) {
          const e = cleanEntry(raw);
          if (!e) { skipped++; continue; }
          const cur = have.get(e.id);
          // 本機版本較新（或雲端沒有）才寫入；雲端較新則保留雲端
          if (cur && new Date(cur.updated_at) >= new Date(e.updated_at)) { skipped++; continue; }
          stmts.push(env.DB.prepare(
            `INSERT INTO kb_entries (id,user_id,q,a,cat,tags,source,star,review,created_at,updated_at,deleted)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,0)
             ON CONFLICT(user_id,id) DO UPDATE SET
               q=excluded.q, a=excluded.a, cat=excluded.cat, tags=excluded.tags,
               source=excluded.source, star=excluded.star, review=excluded.review,
               updated_at=excluded.updated_at, deleted=0`
          ).bind(e.id, me.id, e.q, e.a, e.cat, e.tags, e.source, e.star, e.review, e.created_at, e.updated_at));
          pushed++;
        }

        let removed = 0;
        for (const t of tombstones) {
          const id = String((t && t.id) || "").slice(0, 64);
          const at = String((t && t.at) || nowISO()).slice(0, 40);
          if (!id) continue;
          // 刪除時間比雲端版本新，才真的刪（避免刪掉別台裝置之後的編輯）
          stmts.push(env.DB.prepare(
            "UPDATE kb_entries SET deleted=1, updated_at=? WHERE user_id=? AND id=? AND updated_at<=?"
          ).bind(at, me.id, id, at));
          removed++;
        }

        if (stmts.length) await env.DB.batch(stmts);

        const rows = await env.DB.prepare(
          `SELECT * FROM kb_entries WHERE user_id=? AND deleted=0 ORDER BY created_at ASC`
        ).bind(me.id).all();
        return json({
          entries: (rows.results || []).map(rowToEntry),
          serverTime: nowISO(),
          stats: { received: incoming.length, pushed, skipped, tombstones: removed },
        });
      }

      /* ==================== 單純讀取（備援 / 其他程式使用） ==================== */
      if (path === "/api/entries" && method === "GET") {
        const rows = await env.DB.prepare(
          "SELECT * FROM kb_entries WHERE user_id=? AND deleted=0 ORDER BY created_at ASC"
        ).bind(me.id).all();
        return json({ entries: (rows.results || []).map(rowToEntry) });
      }

      /* ==================== 清空雲端（需輸入密碼確認） ==================== */
      if (path === "/api/entries" && method === "DELETE") {
        const b = await request.json().catch(() => ({}));
        const user = await env.DB.prepare("SELECT * FROM kb_users WHERE id=?").bind(me.id).first();
        const hash = await hashPassword(String(b.password || ""), user.salt);
        if (!safeEqual(hash, user.password_hash)) return json({ error: "密碼不正確" }, 401);
        await env.DB.prepare("DELETE FROM kb_entries WHERE user_id=?").bind(me.id).run();
        return json({ ok: true });
      }

      /* ==================== Claude API 代理 ====================
         前端沒有自備 API Key 時走這裡，Key 只存在 Worker Secret。
      */
      if (path === "/api/ai" && method === "POST") {
        if (!env.ANTHROPIC_API_KEY) {
          return json({ error: "後端沒有設定 ANTHROPIC_API_KEY，請在工具設定裡自備 API Key" }, 503);
        }
        const b = await request.json();
        const content = b.content;
        if (!content || (typeof content !== "string" && !Array.isArray(content))) {
          return json({ error: "content 格式不正確" }, 400);
        }
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: b.model || "claude-sonnet-5",
            max_tokens: Math.min(Number(b.max_tokens) || 3000, 8000),
            messages: [{ role: "user", content }],
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return json({ error: (data && data.error && data.error.message) || `Anthropic API 錯誤（${res.status}）` }, res.status);
        }
        const text = (data.content || []).map(c => (c.type === "text" ? c.text : "")).join("");
        return json({ text });
      }

      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: "伺服器錯誤：" + (err && err.message ? err.message : String(err)) }, 500);
    }
  },
};
