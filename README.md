# -
工具箱。可用瀏覽器直接開啟 `index.html`，或透過 GitHub Pages 部署後使用。

## 英文學習工具

- `english-quiz-tool.html` — 英文測驗練習（TOEIC & PTE），依選擇的考試類型、題型、難度、題數，由 Claude AI 即時出題並批改
- `toeic700-learning-plan.html` — TOEIC 700 六個月衝刺計畫，含分階段學習主題、每週節奏、AI 出題測驗、考試技巧整理

這兩個工具在瀏覽器端直接呼叫 Anthropic API 出題，**需要使用者自備 Anthropic API Key**：

1. 打開工具，點右上角齒輪圖示 ⚙ 開啟設定
2. 貼上你的 API Key（可於 [console.anthropic.com](https://console.anthropic.com/settings/keys) 申請）
3. Key 只會存在瀏覽器的 `localStorage`，直接從瀏覽器送往 Anthropic API，不會經過任何第三方伺服器

**自建題庫（累積出過的題目）**：每次 AI 出題後，題目會自動存進瀏覽器 `localStorage` 的個人題庫。之後開始測驗時會優先從題庫抽符合條件的題目，題庫不夠才會呼叫 AI 補足並存入題庫——題庫夠大之後甚至不需要每次都呼叫 API。題庫完全存在本機瀏覽器，換裝置或清除瀏覽器資料就會重新開始累積；設定頁面可以「清空題庫」重新開始。

## ESG AI 智能成熟度診斷系統

- `esg-ai-diagnostic.html` — V1.0 基礎版（純前端，可直接用瀏覽器開啟）
- `esg-ai-diagnostic-v1.1.html` — V1.1 顧問級版本（題目權重模型、GRI/IFRS S1/S2 對應、利害關係人模組、雙重重大性矩陣、產業差異化權重，並串接後端儲存填答紀錄）

### 後端（儲存填答紀錄與報告）

V1.1 版本會將每次診斷的填答資料與報告摘要存入 SQLite 資料庫，並提供歷史紀錄查詢。

```bash
cd server
npm install
npm start
```

伺服器啟動後造訪 `http://localhost:3000/esg-ai-diagnostic-v1.1.html` 即可使用（靜態頁面與 API 同源，由 Express 託管）。若直接以檔案方式開啟 HTML（無後端），診斷功能仍可正常使用，僅「查看歷史紀錄」與資料儲存功能無法運作。

API：
- `POST /api/submissions` 儲存一筆診斷紀錄
- `GET /api/submissions` 取得歷史紀錄列表
- `GET /api/submissions/:id` 取得單筆紀錄詳情

## 大心整合行銷 — AI 行銷管理系統

- `daxin-marketing.html` — 前端（總覽、客戶資料庫、Onboarding、訓練資料、產出文章、季度戰役、內容排程、收益與交付、CRM、管理員共 10 大模組，含會員登入/註冊/忘記密碼）
- `daxin-marketing/worker.js` — Cloudflare Worker：D1 資料庫 REST API + 會員認證（PBKDF2 雜湊、Session Token）+ Claude API 代理
- `daxin-marketing/schema.sql` — Cloudflare D1 資料庫結構與種子資料（含會員、Session、忘記密碼申請表）
- `daxin-marketing/DEPLOY.md` — 完整部署教學（D1 → Worker → Pages → 會員系統初始化）

直接開啟 `daxin-marketing.html` 即為 **Demo 模式**（會先看到登入閘門，可點「以訪客瀏覽」直接體驗，示範資料存在瀏覽器記憶體，重新整理會還原）。要接上真實資料庫與 Claude API，依 `daxin-marketing/DEPLOY.md` 部署 D1 + Worker 後，將 `daxin-marketing.html` 內的 `API_BASE` 填上 Worker 網址即可切換為連線模式，並用內建總管理員帳號 `chelsea` 登入使用。

## 行銷知識智庫

- `marketing-knowledge-base.html` — 純前端知識庫，把每天測試／練習產生的問答累積成自己的行銷知識資產，資料存在瀏覽器 `localStorage`，不會上傳任何伺服器

四個分頁：

1. **智庫** — 關鍵字搜尋（問題、答案、標籤一起找）、分類與標籤篩選、排序（最新／最早／重點優先／最少複習）、展開答案、標記重點、編輯與刪除，上方顯示條目數、近 7 天新增、涵蓋分類等統計
2. **問 AI** — 提問時會先從智庫撈出最相關的條目當參考資料，一起送給 Claude，回答會標示參考了哪幾條既有知識，滿意就一鍵（或編輯後）存回智庫，越問越厚
3. **匯入補充** — 每天把新的測試問答補進智庫，見下方說明
4. **複習** — 把智庫變回測驗：抽題翻牌，自評「記得／還不熟」，「還不熟」的條目下次會優先出現，可依分類、重點、最近新增等條件出題

### 三種補充方式

1. **上傳測試問答圖片**（主要用法）— 截圖或拍照直接上傳，一次最多 20 張，可拖曳進畫面。AI 會讀出題目與答案，整理成能獨立看懂的知識條目並自動分類、下標籤；選擇題會寫出正確選項的內容與原因，而不是只記「答案是 B」。圖片送出前會自動縮圖（長邊 1568px）以節省 token，每 4 張一批送出，需要 Anthropic API Key
2. **貼上或上傳文字** — 支援 `Q: / A:`、`問：/ 答：`、`1. 題目＋內容`、Markdown 標題、JSON 陣列，以及 `.txt` / `.md` / `.json` / `.csv` 檔；格式太亂可按「用 AI 整理成知識條目」交給 Claude 整理
3. **內建行銷基礎題庫** — 內建 98 條行銷人該有的基礎知識，一鍵打底：品牌策略 8、市場與消費者研究 10、內容行銷 9、社群經營 9、廣告投放 13、SEO / SEM 9、EDM / CRM 7、數據與成效分析 11、電商與通路 7、公關與活動 6、行銷科技 / AI 9

三種方式都會先進「待確認條目」清單，可逐條取消勾選、統一套用分類與來源標記，確認後才入庫；入庫時自動比對重複問題，同一題不會重複累積。

### 備份與 API Key

- 右上角 💾 可匯出 JSON 備份、匯出 Markdown（依分類整理），或還原 JSON；智庫只存在這台瀏覽器，換裝置或清除瀏覽器資料就會消失，建議定期匯出
- 圖片辨識、問 AI、AI 整理、AI 補強答案需要 Anthropic API Key（右上角齒輪設定，與本 repo 其他 AI 工具共用同一組，只存在瀏覽器本機）。**沒有 Key 也能完整使用**內建題庫、手動新增、貼上匯入、搜尋與複習

## 會員抽獎工具

- `raffle-tool.html` — 純前端抽獎工具，直接用瀏覽器開啟即可使用，資料不會上傳到任何伺服器

功能：

1. 匯入 Excel（.xlsx / .xls）或 CSV 會員名單，系統自動嘗試辨識「姓名」「電話」「Email」欄位（可手動調整對應）
2. 每筆會員資料自動建立會員編號；姓名為必填，電話與 Email 至少需有一項有值才具抽獎資格，缺姓名或電話與 Email 都缺則標示不合格、不列入抽獎
3. 可新增多個獎項，各自設定：獎項名稱、名額數量、抽獎條件（依 Excel 中任意欄位設定等於／不等於／包含／大於等於／小於等於／空值／非空值等條件，需符合所有條件才可參加該獎項抽獎）
4. 可設定「同一位會員整場只能中獎一次」，依獎項設定順序依序抽出
5. 使用瀏覽器 `crypto.getRandomValues` 做隨機抽取，抽出的會員編號＋姓名會列在結果中，並可匯出中獎名單為 Excel
6. 提供「下載範例 Excel」按鈕，可下載欄位格式範例

## 一人公司 AI 團隊（One-Person Agency AI）

來源：[atm301/one-person-agency-ai](https://github.com/atm301/one-person-agency-ai)，14 個 AI 代理角色（策略、創意、成長、數據、技術、協調），模擬一整個行銷代理商團隊。

已安裝為本 repo 的 Claude Code 專案技能（`.claude/skills/`），在 Claude Code 開啟本 repo 時可直接使用斜線指令：

- `/kevin`、`/hunter`、`/winnie` 等 14 個角色個別指令（策略總監、廣告投手、內容主編…）
- `/team` — 自動判斷任務該交給誰
- `/meeting` — 召集多個角色針對同一議題討論並整合結論

其他 AI 平台（ChatGPT、Gemini、Claude Projects）的複製貼上 prompt 放在 `one-person-agency-ai/prompts/`，完整安裝與使用說明見 `one-person-agency-ai/INSTALL.md`。
