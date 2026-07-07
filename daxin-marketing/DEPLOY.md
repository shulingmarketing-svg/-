# 大心整合行銷系統 — 部署教學

三個檔案的角色：

| 檔案 | 角色 | 部署位置 |
|---|---|---|
| `daxin-marketing.html`（repo 根目錄） | 前端（9 大模組介面） | Cloudflare Pages |
| `daxin-marketing/worker.js` | 後端 API + Claude API 代理 | Cloudflare Workers |
| `daxin-marketing/schema.sql` | 資料庫結構 + 種子資料 | Cloudflare D1 |

架構：Pages 放前端、Worker 當代理、API Key 存 Secret，多了一個 D1 資料庫。

---

## 第 0 步：先在本機預覽（不用部署）

直接雙擊打開 `daxin-marketing.html` 就能看到完整系統，此時是 **Demo 模式**——內建兩個示範品牌（十全特好、iOiO），所有功能都能點，資料存在瀏覽器記憶體，重新整理會還原。先確認介面符合需求，再往下部署。

---

## 第 1 步：建立 D1 資料庫

**Dashboard 方式（推薦，免安裝）：**
1. 登入 dash.cloudflare.com → 左側「Storage & Databases」→「D1 SQL Database」
2. 點「Create Database」，名稱填 `daxin-marketing`
3. 建立後進入資料庫 →「Console」分頁
4. 把 `daxin-marketing/schema.sql` 的內容全部貼進去執行
5. 執行完到「Tables」分頁確認出現 5 張表：clients、brand_profiles、content_items、campaigns、crm_pipeline

---

## 第 2 步：部署 Worker

1. Dashboard → 「Workers & Pages」→「Create」→「Create Worker」
2. 名稱建議：`daxin-api`（網址會是 `daxin-api.你的帳號.workers.dev`）
3. 點「Deploy」先建立，再點「Edit Code」
4. 把 `daxin-marketing/worker.js` 內容全部貼上，覆蓋原本的程式碼 → Deploy

### 綁定 D1 資料庫
1. Worker 頁面 →「Settings」→「Bindings」→「Add」→「D1 Database」
2. Variable name 填 `DB`（一定要是 DB，程式碼裡用這個名字）
3. 選擇剛建立的 `daxin-marketing` → Save

### 設定 API Key（Secret）
1. 同樣在「Settings」→「Variables and Secrets」→「Add」
2. Type 選 **Secret**，名稱填 `ANTHROPIC_API_KEY`
3. 值貼上你的 Anthropic API Key（console.anthropic.com 取得）
4. Save and Deploy

> 提醒：你的 Anthropic 帳戶需要有 API credit。

### 驗證 Worker
瀏覽器打開 `https://daxin-api.你的帳號.workers.dev/api/clients`，看到兩筆客戶 JSON 就成功了。

---

## 第 3 步：部署前端到 Pages

1. 打開 `daxin-marketing.html`，找到最上方 script 裡這一行：
   ```js
   const API_BASE = "";
   ```
   改成你的 Worker 網址：
   ```js
   const API_BASE = "https://daxin-api.你的帳號.workers.dev";
   ```
2. Dashboard →「Workers & Pages」→「Create」→「Pages」→「Upload assets」
3. 專案名稱例如 `daxin-marketing` → 把改好的 `daxin-marketing.html`（可重新命名為 `index.html`）拖進去上傳 → Deploy
4. 打開 `daxin-marketing.pages.dev`，左下角側欄應顯示「**連線模式**」，資料就是 D1 裡的真實資料了

---

## 第 4 步：驗收清單

- [ ] 模組 3「建立新客戶」新增一筆 → 模組 2 出現新品牌卡
- [ ] 模組 4「訓練資料」填寫並儲存 → 重新整理後資料還在（代表 D1 寫入成功）
- [ ] 模組 5「產出文章」按生成 → 右側出現 Claude 產出的初稿（代表 API Key 與餘額正常）
- [ ] 產出後到模組 7「內容排程」→ 該篇以「草稿中」出現
- [ ] 模組 6 看板用「狀態流轉」下拉把某篇改成「已發布」→ 模組 8 收益流水帳同步更新（驗證三模組共用同一張表）

---

## 常見問題

**Q：模組 5 生成失敗，顯示 API 錯誤？**
多半是 Anthropic API credit 不足，到 console.anthropic.com → Billing 加值（最低 $5 USD）。

**Q：前端顯示「無法連線 Worker API」？**
檢查 `API_BASE` 是否填對（要含 `https://`、結尾不要有斜線），以及 Worker 是否已 Deploy。

**Q：想限制只有自己公司能用？**
目前 Worker 的 CORS 是 `*`（任何網域都能呼叫）。上線後建議把 `worker.js` 裡 `Access-Control-Allow-Origin` 改成你的 Pages 網域，再進一步可以加上簡單的密碼驗證。

---

## 之後的擴充方向（規格書已排除、日後再做）

- 廣告後台 API 串接（GA4 / Meta Ads）
- 社群自動發文
- 使用者登入與權限（老闆 / 員工看到不同畫面）
- AI 資料完整度自動計算（目前是手動欄位）
