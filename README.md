# -
工具箱。可用瀏覽器直接開啟 `index.html`，或透過 GitHub Pages 部署後使用。

## 英文學習工具

- `english-quiz-tool.html` — 英文測驗練習（TOEIC & PTE），依選擇的考試類型、題型、難度、題數，由 Claude AI 即時出題並批改
- `toeic700-learning-plan.html` — TOEIC 700 六個月衝刺計畫，含分階段學習主題、每週節奏、AI 出題測驗、考試技巧整理

這兩個工具在瀏覽器端直接呼叫 Anthropic API 出題，**需要使用者自備 Anthropic API Key**：

1. 打開工具，點右上角齒輪圖示 ⚙ 開啟設定
2. 貼上你的 API Key（可於 [console.anthropic.com](https://console.anthropic.com/settings/keys) 申請）
3. Key 只會存在瀏覽器的 `localStorage`，直接從瀏覽器送往 Anthropic API，不會經過任何第三方伺服器

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
