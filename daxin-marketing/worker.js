/**
 * 大心整合行銷 — Cloudflare Worker
 * 角色：D1 資料庫 REST API + Anthropic Claude API 代理
 *
 * 部署需求：
 *   1. wrangler.toml 綁定 D1 資料庫，binding 名稱 = DB
 *   2. Secret：ANTHROPIC_API_KEY（npx wrangler secret put ANTHROPIC_API_KEY）
 *
 * API 一覽：
 *   GET    /api/clients            所有客戶
 *   POST   /api/clients            新增客戶（Onboarding）
 *   GET    /api/profiles/:clientId 品牌 DNA
 *   PUT    /api/profiles/:clientId 更新品牌 DNA
 *   GET    /api/content            內容項目（?client_id= 可過濾）
 *   POST   /api/content            新增內容
 *   PATCH  /api/content/:id        更新內容（狀態流轉）
 *   GET    /api/campaigns          季度戰役
 *   POST   /api/campaigns          新增戰役
 *   GET    /api/crm                CRM 名單
 *   POST   /api/crm                新增名單
 *   PATCH  /api/crm/:id            更新名單
 *   POST   /api/generate           AI 產出文章（組 prompt → 呼叫 Claude）
 */

const CORS = {
  "Access-Control-Allow-Origin": "*", // 上線後建議改成你的 Pages 網域
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });

const uid = (p) => p + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // ---------- 客戶 ----------
      if (path === "/api/clients" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM clients ORDER BY created_at").all();
        return json(results);
      }
      if (path === "/api/clients" && method === "POST") {
        const b = await request.json();
        const id = uid("c");
        await env.DB.prepare(
          `INSERT INTO clients (id,company_name,brand_name,industry,monthly_fee,case_scale,data_completeness,timeline_status,tags)
           VALUES (?,?,?,?,?,?,?,?,?)`
        ).bind(id, b.company_name, b.brand_name || "", b.industry || "", b.monthly_fee || 0,
               b.case_scale || "中案", b.data_completeness || 0, b.timeline_status || "一般排程",
               JSON.stringify(b.tags || [])).run();
        await env.DB.prepare("INSERT INTO brand_profiles (client_id) VALUES (?)").bind(id).run();
        return json({ id }, 201);
      }

      // ---------- 品牌 DNA ----------
      const profileMatch = path.match(/^\/api\/profiles\/([\w-]+)$/);
      if (profileMatch && method === "GET") {
        const row = await env.DB.prepare("SELECT * FROM brand_profiles WHERE client_id=?")
          .bind(profileMatch[1]).first();
        return row ? json(row) : json({ error: "找不到此客戶的品牌資料" }, 404);
      }
      if (profileMatch && method === "PUT") {
        const b = await request.json();
        await env.DB.prepare(
          `UPDATE brand_profiles SET positioning=?,target_audience=?,content_pillars=?,competitors=?,
           writing_restrictions=?,regulation_notes=?,platform_preferences=? WHERE client_id=?`
        ).bind(b.positioning || "", b.target_audience || "", b.content_pillars || "", b.competitors || "",
               b.writing_restrictions || "", b.regulation_notes || "", b.platform_preferences || "",
               profileMatch[1]).run();
        return json({ ok: true });
      }

      // ---------- 內容項目（模組 5/6/7/8 共用） ----------
      if (path === "/api/content" && method === "GET") {
        const cid = url.searchParams.get("client_id");
        const q = cid
          ? env.DB.prepare("SELECT * FROM content_items WHERE client_id=? ORDER BY scheduled_date").bind(cid)
          : env.DB.prepare("SELECT * FROM content_items ORDER BY scheduled_date");
        const { results } = await q.all();
        return json(results);
      }
      if (path === "/api/content" && method === "POST") {
        const b = await request.json();
        const id = uid("ct");
        await env.DB.prepare(
          `INSERT INTO content_items (id,client_id,campaign_id,title,platform,status,content_body,business_goal,scheduled_date,value_ntd,next_step)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)`
        ).bind(id, b.client_id, b.campaign_id || null, b.title, b.platform || "FB+IG",
               b.status || "草稿中", b.content_body || "", b.business_goal || "",
               b.scheduled_date || null, b.value_ntd || 0, b.next_step || "").run();
        return json({ id }, 201);
      }
      const contentMatch = path.match(/^\/api\/content\/([\w-]+)$/);
      if (contentMatch && method === "PATCH") {
        const b = await request.json();
        const allowed = ["title","platform","status","content_body","business_goal","scheduled_date","published_date","value_ntd","next_step"];
        const sets = [], vals = [];
        for (const k of allowed) if (k in b) { sets.push(`${k}=?`); vals.push(b[k]); }
        if (!sets.length) return json({ error: "沒有可更新的欄位" }, 400);
        vals.push(contentMatch[1]);
        await env.DB.prepare(`UPDATE content_items SET ${sets.join(",")} WHERE id=?`).bind(...vals).run();
        return json({ ok: true });
      }

      // ---------- 季度戰役 ----------
      if (path === "/api/campaigns" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM campaigns").all();
        return json(results);
      }
      if (path === "/api/campaigns" && method === "POST") {
        const b = await request.json();
        const id = uid("cp");
        await env.DB.prepare("INSERT INTO campaigns (id,client_id,quarter,theme,budget) VALUES (?,?,?,?,?)")
          .bind(id, b.client_id, b.quarter || "", b.theme || "", b.budget || 0).run();
        return json({ id }, 201);
      }

      // ---------- CRM ----------
      if (path === "/api/crm" && method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM crm_pipeline ORDER BY created_at").all();
        return json(results);
      }
      if (path === "/api/crm" && method === "POST") {
        const b = await request.json();
        const id = uid("crm");
        await env.DB.prepare(
          `INSERT INTO crm_pipeline (id,company_name,contact_name,contact_title,contact_method,stage,follow_up_status,next_contact_date,deal_value,marketing_need,owner,priority,notes)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
        ).bind(id, b.company_name, b.contact_name || "", b.contact_title || "", b.contact_method || "",
               b.stage || "新名單", b.follow_up_status || "待首次聯繫", b.next_contact_date || null,
               b.deal_value || 0, b.marketing_need || "", b.owner || "", b.priority || "一般",
               b.notes || "").run();
        return json({ id }, 201);
      }
      const crmMatch = path.match(/^\/api\/crm\/([\w-]+)$/);
      if (crmMatch && method === "PATCH") {
        const b = await request.json();
        const allowed = ["stage","follow_up_status","next_contact_date","deal_value","owner","priority","notes"];
        const sets = [], vals = [];
        for (const k of allowed) if (k in b) { sets.push(`${k}=?`); vals.push(b[k]); }
        if (!sets.length) return json({ error: "沒有可更新的欄位" }, 400);
        vals.push(crmMatch[1]);
        await env.DB.prepare(`UPDATE crm_pipeline SET ${sets.join(",")} WHERE id=?`).bind(...vals).run();
        return json({ ok: true });
      }

      // ---------- AI 產出文章（模組 5 核心） ----------
      if (path === "/api/generate" && method === "POST") {
        const b = await request.json();
        const profile = await env.DB.prepare("SELECT * FROM brand_profiles WHERE client_id=?")
          .bind(b.client_id).first();
        const client = await env.DB.prepare("SELECT * FROM clients WHERE id=?")
          .bind(b.client_id).first();
        if (!profile || !client) return json({ error: "找不到客戶或品牌資料" }, 404);

        // 依「深度資料開關」決定要餵給 AI 的品牌底層資料
        const use = b.use_data || { ta: true, competitors: true, regulation: true, social: true };
        let brandContext = `品牌定位：${profile.positioning}\n內容支柱：${profile.content_pillars}\n寫作限制：${profile.writing_restrictions}`;
        if (use.ta) brandContext += `\n目標客群：${profile.target_audience}`;
        if (use.competitors) brandContext += `\n競品環境：${profile.competitors}`;
        if (use.regulation) brandContext += `\n法規護欄：${profile.regulation_notes}`;
        if (use.social) brandContext += `\n平台偏好：${profile.platform_preferences}`;

        const systemPrompt =
`你是「大心整合行銷」的資深文案，負責品牌「${client.brand_name || client.company_name}」。
請嚴格依據以下品牌底層資料撰寫，絕不可摻入其他品牌的資訊：
${brandContext}

寫作鐵則：
1. 嚴格遵守法規護欄中的禁用詞，警戒詞需以安全替代寫法呈現。
2. 語感自然有溫度，像真人小編，不要有 AI 腔。
3. 依平台調整格式（${b.platform || "FB+IG"}）。
4. 商業目的：${b.business_goal || "建立信任"}；目標對象：${b.target_audience_line || "主要 TA"}。
5. 文章架構：${b.structure || "Hook → Problem → Agitate → Solution → CTA"}。`;

        const userPrompt =
`主題／產品：${b.topic || "（未指定，請依季度活動主軸發想）"}
季度活動：${b.campaign_theme || "本季主軸"}
補充限制：${b.extra_constraints || "無"}
輸出格式：${b.output_format === "outline" ? "先列文章骨架（各段落重點），再附上完整可執行的 AI Prompt" : "完整貼文文案，含 hashtag 與 CTA"}`;

        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          }),
        });
        const aiData = await aiRes.json();
        if (!aiRes.ok) return json({ error: "Claude API 錯誤", detail: aiData }, 502);

        const text = (aiData.content || []).filter(c => c.type === "text").map(c => c.text).join("\n");

        // 自動寫入內容表，狀態 = 草稿中
        const id = uid("ct");
        await env.DB.prepare(
          `INSERT INTO content_items (id,client_id,title,platform,status,content_body,business_goal,scheduled_date,value_ntd,next_step)
           VALUES (?,?,?,?,?,?,?,?,?,?)`
        ).bind(id, b.client_id, b.topic || "AI 產出草稿", b.platform || "FB+IG", "草稿中",
               text, b.business_goal || "", b.scheduled_date || null, b.value_ntd || 0,
               "完成初稿後送審").run();

        return json({ id, content: text });
      }

      return json({ error: "找不到此 API 路徑" }, 404);
    } catch (err) {
      return json({ error: "伺服器錯誤", detail: String(err) }, 500);
    }
  },
};
