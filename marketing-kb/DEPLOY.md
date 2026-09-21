# 行銷知識智庫 — 雲端同步部署教學

不部署也能用：直接開 `marketing-knowledge-base.html` 就是**本機模式**，資料存在這台瀏覽器。
部署之後變成**雲端同步模式**，手機、電腦、公司筆電看到的是同一份智庫。

| 檔案 | 角色 | 部署位置 |
|---|---|---|
| `marketing-knowledge-base.html`（repo 根目錄） | 前端 | 直接開啟，或放 GitHub Pages / Cloudflare Pages |
| `marketing-kb/worker.js` | 後端 API（帳號、同步、Claude 代理） | Cloudflare Workers |
| `marketing-kb/schema.sql` | 資料庫結構 | Cloudflare D1 |

全部用 Cloudflare 免費方案就夠（D1 免費額度每天 500 萬次讀取 / 10 萬次寫入，文字型知識庫用不完）。

---

## 第 1 步：建立 D1 資料庫

1. 登入 [dash.cloudflare.com](https://dash.cloudflare.com) →左側 **Storage & Databases** → **D1 SQL Database**
2. 點 **Create Database**，名稱填 `marketing-kb`
3. 建立後進入資料庫 → **Console** 分頁
4. 把 `marketing-kb/schema.sql` 的內容整份貼上執行
5. 到 **Tables** 分頁確認出現三張表：`kb_users`、`kb_sessions`、`kb_entries`

---

## 第 2 步：部署 Worker

1. **Workers & Pages** → **Create** → **Create Worker**
2. 名稱建議 `marketing-kb-api`（網址會是 `marketing-kb-api.你的帳號.workers.dev`）
3. 先 **Deploy** 建立，再點 **Edit Code**
4. 把 `marketing-kb/worker.js` 整份貼上覆蓋原本的程式碼 → **Deploy**

### 綁定 D1

1. Worker 頁面 → **Settings** → **Bindings** → **Add** → **D1 Database**
2. Variable name 填 **`DB`**（一定要是 DB，程式碼用這個名字）
3. Database 選剛剛建立的 `marketing-kb` → Save

### 設定 Secret（兩個都建議設）

在 **Settings** → **Variables and Secrets** → **Add**，Type 選 **Secret**：

| 名稱 | 值 | 作用 |
|---|---|---|
| `REGISTER_CODE` | 自訂，例如 `kb2026` | 註冊時要輸入的邀請碼，避免知道網址的人自己註冊。不設定則任何人都能註冊 |
| `ANTHROPIC_API_KEY` | 你的 Anthropic API Key | 設定後，手機等裝置不用自備 Key 也能用圖片辨識與問 AI。不設定則各裝置自己在工具的齒輪設定裡填 Key |

存完按 **Save and Deploy**。

### 驗證

瀏覽器打開 `https://marketing-kb-api.你的帳號.workers.dev/api/health`，應該看到：

```json
{"ok":true,"users":0,"ai":true,"inviteRequired":true,"serverTime":"..."}
```

`ai:true` 代表後端有 API Key，`inviteRequired:true` 代表有設邀請碼。

---

## 第 3 步：在工具裡連線

1. 開啟 `marketing-knowledge-base.html`
2. 點右上角的 **本機模式** 按鈕
3. 貼上 Worker 網址 → **連線測試**
4. 第一次使用點 **註冊新帳號**（帳號 3 字以上、密碼 8 字以上，有設邀請碼就一起填）
5. 註冊完成後，這台裝置原本的本機資料會自動上傳到雲端

右上角按鈕變成「雲端 · 你的帳號」就代表連上了。

### 其他裝置

在手機或另一台電腦開同一個頁面 → 點右上角 → 貼同一個 Worker 網址 → **登入**（不是註冊）→ 雲端資料會拉下來。

> 手機要開這個頁面，最方便的作法是把 `marketing-knowledge-base.html` 放上 GitHub Pages
> （本 repo 已設定，推上 main 後網址是 `https://你的帳號.github.io/-/marketing-knowledge-base.html`），
> 然後加到主畫面。

---

## 同步規則

- **本機優先**：所有操作先寫進瀏覽器，再自動同步到雲端（存檔後約 1.5 秒），不會因為網路慢卡住操作
- **同步時機**：新增／編輯／刪除／複習之後自動同步、開啟頁面時同步、切回分頁超過一分鐘同步，也可在雲端視窗手動按「立即同步」
- **衝突處理**：同一條在兩台裝置都改過，以**最後修改時間較新**的為準（last-write-wins）
- **刪除**：刪除會記錄下來並同步到其他裝置；若刪除之後另一台又編輯過同一條（編輯時間較新），那一條會復活
- **離線**：沒網路時照常使用，有網路時自動補同步

---

## API 一覽

| 方法 | 路徑 | 說明 |
|---|---|---|
| GET | `/api/health` | 健康檢查，免登入 |
| POST | `/api/auth/register` | 註冊 `{username, password, inviteCode}` |
| POST | `/api/auth/login` | 登入，回傳 90 天有效的 token |
| GET | `/api/auth/me` | 帳號資訊與雲端條目數 |
| POST | `/api/auth/logout` | 登出（作廢這個 token） |
| POST | `/api/auth/password` | 改密碼 `{oldPassword, newPassword}`，其他裝置需重新登入 |
| POST | `/api/sync` | 同步 `{entries, deleted}`，回傳合併後的全部條目 |
| GET | `/api/entries` | 只讀取雲端條目 |
| DELETE | `/api/entries` | 清空這個帳號的雲端條目，需 `{password}` |
| POST | `/api/ai` | Claude 代理 `{content, max_tokens}`，Key 存在 Worker Secret |

除 `/api/health` 與兩個 auth 端點外，都需要 `Authorization: Bearer <token>`。

---

## 安全性說明

- 密碼以 PBKDF2-SHA256、10 萬次迭代加鹽雜湊後儲存，資料庫裡看不到明文
- 登入 token 隨機 32 bytes，存在瀏覽器 localStorage，90 天到期
- 每個帳號只讀寫自己的條目（所有查詢都帶 `user_id`）
- `ANTHROPIC_API_KEY` 存在 Worker Secret，不會出現在前端原始碼裡
- CORS 開放 `*`，但所有資料端點都要 token 才能存取

---

## 常見問題

**Q：已經在本機累積很多條目，連線會不會被雲端洗掉？**
不會。第一次登入是「合併」：本機的條目會上傳，雲端已有的會拉下來，兩邊都保留。

**Q：想換回純本機使用？**
在雲端視窗按「登出（保留本機資料）」，資料仍在這台瀏覽器裡，只是不再同步。

**Q：忘記密碼？**
目前沒有自助重設流程（沒有綁 email）。到 D1 Console 執行 `DELETE FROM kb_users WHERE username='你的帳號';` 後重新註冊，或請熟悉 SQL 的人協助更新雜湊值。條目資料不會因此消失（存在 `kb_entries`），但會對不到新帳號，所以**平常仍建議定期用工具右上角的 💾 匯出 JSON 備份**。

**Q：多人共用？**
每個人各自註冊帳號，各自有獨立的智庫，彼此看不到對方的條目。若要共用一份，就共用同一組帳號密碼。
