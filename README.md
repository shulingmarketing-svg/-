# -
抽獎使用的工具

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
