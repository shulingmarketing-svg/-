# 產品需求文件 (PRD)：個人知識品牌與高轉換內容中樞

* **專案名稱**：Personal Brand Knowledge Hub (代稱：KnowledgeHub)
* **文件版本**：v2.0
* **更新日期**：2026-09-02
* **目標市場與定位**：針對 AI、數位行銷、專業證照或企管顧問領域，建立「高信任度專家形象 ➔ 自然搜尋長青流量 ➔ 知識付費／顧問變現」的內容資產平台。

---

## 一、 產品願景與商業目標

### 1. 核心定位

* **不只做部落格，做「判斷力中樞」**：有別於一般的資訊轉貼，強調「架構化方法論」、「實戰踩坑經驗」與「深度訪談」。
* **流量轉化閉環**：社群/直播流量 ➔ 沉澱於官網長文 ➔ SEO 關鍵詞長青被動流量 ➔ 導流線上課程、電子報、顧問與企業內訓。

### 2. 核心指標 (KPIs)

| 指標 | 目標值 | 基準線（上線前） | 驗收時間點 |
|---|---|---|---|
| SEO 精準長尾詞進入 Google 前 3 名數量 | ≥ 10 組 | 0（新站） | 上線後 6 個月 |
| 平均文章閱讀停留時間 (Engaged Time) | > 3.5 分鐘 | N/A | 上線後 3 個月 |
| 文章內嵌課程模組點擊率 (CTR) | > 3.5% | N/A | 累積 30 篇後 |
| 諮詢 / 聯繫表單提交率 | > 1.2% | N/A | 上線後 3 個月 |
| 電子報訂閱名單 30 天留存率 | > 85% | N/A | 累積 500 訂閱者後 |
| 電子報開信率 | > 40% | N/A | 發報滿 8 期後 |
| 月自然流量 (Organic Sessions) | > 5,000 | 0 | 上線後 6 個月 |

---

## 二、 使用者角色畫像 (User Persona)

1. **尋找解答的實踐者（搜尋流量進站）**：
   * 痛點：正在準備某項專業考試（如 iPAS）、遇到特定工具配置瓶頸（如 Agent/MCP），看官方文件太生硬。
   * 需求：結構化、可直接照做的白話教學、踩坑總結與思維框架。

2. **尋求企業解方的決策者（高客單潛在客戶）**：
   * 痛點：公司想導入新技術或數位轉型，但內部沒人懂、外部顧問滿嘴術語。
   * 需求：從訪談觀點、案例拆解中確認作者的專業高度與實戰判斷力，進而發出演講、內訓或顧問邀約。

3. **社群忠實追隨者（既有受眾回流）**：
   * 痛點：社群貼文或直播隨時間沉沒，不好複習檢索。
   * 需求：需要回看直播 QA 總整理、Podcast 綱要式筆記與延伸資源包。

---

## 三、 系統架構與頁面規劃 (IA & Sitemap)

```
[ 首頁 (/) ]
 ├── 核心分類索引 (Topic Clusters)
 │    ├── 知識科普 (/category/knowledge/)
 │    ├── 趨勢論點 (/category/trends/)
 │    ├── 科技/產業新聞 (/category/news/)
 │    └── Podcast / 專訪筆記 (/category/podcast/)
 ├── 核心轉化樞紐 (Conversion Hubs)
 │    ├── 品牌核心故事與閱讀指南 (/home/ 或 /guide/)
 │    ├── 線上課程 / 服務落地頁 (/courses/ 或外導 SAT)
 │    └── 關於作者 / 演講內訓合作 (/about/)
 ├── 站內搜尋 (/search/)
 ├── 法務頁面
 │    ├── 隱私權政策 (/privacy/)
 │    ├── Cookie 政策 (/cookie-policy/)
 │    └── 服務條款 (/terms/)
 └── 獨立文章頁 (/posts/[slug])
      ├── 痛點擊穿的內嵌式推廣模組 (In-article Course Hook)
      ├── AEO 友善摘要區塊 (Hey AI / Summary)
      └── Lead Magnet 表單模組（留 email 下載資源）
```

---

## 四、 功能需求細節 (Functional Specifications)

### 1. 內容管理與排版引擎 (CMS & Typography)

* **模組化區塊編輯**：
  * 支援長文結構化區塊：重點引言 (Callout)、金句卡片、比較表格 (Comparison Table)、步驟清單 (Steps)、程式碼區塊。
* **內嵌行銷模組 (Reusable Ad/Course Block)**：
  * 支援在文章段落中（如第 3 或第 5 個段落後）自動或手動插入特定的「課程推薦模組」。
  * 模組需包含：痛點共鳴文案、視覺封面圖、專屬折扣碼（附一鍵複製功能）、外導購買按鈕。
* **Podcast 音訊轉化元件**：
  * 支援嵌入 Spotify/Apple Podcast 播放器。
  * 提供章節時間軸（Timestamp）、訪談核心金句與文字精華版面。
* **內容狀態流程**：
  * 草稿 → 排程發布 → 已發布 → 需更新（長青文章 review 標記）→ 已封存
  * 若未來有外稿或助理協作，擴充為：草稿 → 編輯審核 → 排程 → 發布
* **Related Posts 推薦邏輯**：
  * 預設：同分類 + 同標籤交集，取最近 3 篇
  * 可手動指定「延伸閱讀」覆蓋自動推薦
* **RSS Feed 規格**：
  * 全站 Feed (`/feed/`)：輸出摘要（前 300 字）+ 縮圖
  * 各分類獨立 Feed（`/category/knowledge/feed/`）
  * 支援 JSON Feed 格式（供 Podcast 類閱讀器使用）

### 2. SEO & AEO (Generative Engine Optimization) 規範

* **結構化資料 (Schema.org JSON-LD)**：
  * 自動生成 `Article` / `BlogPosting`、`BreadcrumbList`、`Person`（作者 E-E-A-T 欄位完整注入社群與資歷）。
  * 針對問答與教程支援 `FAQPage` 與 `HowTo` Schema。
* **AI 搜尋引擎友善介面 (AEO)**：
  * 在文章開頭或頁底提供「核心結論摘要」或語意明確的 `Hey AI, learn about this page` 結構，利於 SearchGPT、Perplexity、Google AI Overview 抓取。
* **URL 與索引機制**：
  * 乾淨的 Slug 結構（例如 `/feynman-study-method-ipas/`），禁止亂數代碼。
  * 自動產生並同步 XML Sitemap 與 RSS Feed。
* **OG Meta / Social Cards**：
  * 每篇文章自動產生 `og:title`、`og:description`、`og:image`（取文章首圖或自動生成品牌樣式卡片圖）。
  * 支援 Twitter Card (`summary_large_image`)。
  * 分享至 FB / LINE / X 時，預覽圖卡需完整顯示標題與品牌 logo。
  * 提供「社群分享預覽」功能，發布前可檢視 OG 圖卡呈現。

### 3. 行銷轉換與追蹤機制 (CRO & Tracking)

* **多層級 CTA 配置**：
  * 頂部導覽列（Sticky Header）：常駐「推薦課程 / 核心服務」重點按鈕。
  * 內文結尾：作者名片卡 + 企業內訓/顧問諮詢入口 + 延伸閱讀推薦。
* **追蹤像素與事件 (Tracking Infrastructure)**：
  * 支援 GTM、GA4、Meta Pixel。
  * 預設埋設自訂事件：
    * `course_outbound_click`（追蹤點擊課程連結與來源文章）
    * `coupon_copy`（複製折扣碼事件）
    * `scroll_depth_75` / `scroll_depth_100`（衡量深度閱讀）
    * `contact_submit`（商務邀約提交）
    * `lead_magnet_download`（資源包下載事件）
    * `newsletter_signup`（電子報訂閱事件）

### 4. 電子報與名單經營 (Email / Newsletter) ⭐ 新增

* **訂閱收集機制**：
  * 文章底部常駐訂閱表單（姓名 + email）
  * 側邊欄 / 浮動 CTA（滾動至 50% 觸發，同一 session 僅顯示一次）
  * Lead Magnet 門控表單（見 4.5）
* **Email 服務選型**：

  | 維度 | 選項 A：ConvertKit (Kit) | 選項 B：Resend + 自建 |
  |---|---|---|
  | 適合對象 | 非技術背景、快速上線 | 開發者、需完全自訂 |
  | 自動化序列 | 內建視覺化 automation | 需自建邏輯 |
  | 月費 | 免費至 10,000 人 | 按量計費，初期極低 |
  | 推薦路線 | 路線 A (WordPress) | 路線 B (Next.js) |

* **自動化信件序列**：
  * 歡迎信（訂閱後即刻寄出）：自我介紹 + 精選 3 篇必讀 + Lead Magnet 附件
  * 培養序列（每 3 天一封，共 5 封）：依內容分類推薦深度文章
  * 週報 / 雙週報：最新文章 + 一句觀點 + 課程 CTA
* **分眾邏輯**：
  * 依訂閱來源（Lead Magnet 主題 / 文章分類）自動標籤
  * 依開信行為區分活躍 / 沉睡名單，沉睡名單 > 90 天不開信，觸發重啟或清理流程
* **退訂與合規**：
  * 每封信底部附退訂連結（法規要求）
  * 遵守台灣個資法及 CAN-SPAM 規範

### 5. Lead Magnet 與封閉式內容 ⭐ 新增

* **機制**：訪客留下 email 後，即可下載/解鎖特定資源
* **資源類型建議**：
  * 懶人包 PDF（如「AI 工具比較懶人包」）
  * 檢核清單 / Cheat Sheet（如「iPAS 備考 Checklist」）
  * 模板 / 框架（如「個人品牌定位畫布」）
  * 過往直播精華整理包
* **技術實作**：
  * 表單送出 → email 服務新增聯絡人 + 標籤 → 自動寄送含下載連結的信件
  * 下載連結使用一次性 token 或 7 天時效連結，避免被轉傳
* **追蹤事件**：
  * `lead_magnet_form_view`（表單曝光）
  * `lead_magnet_download`（完成下載）
  * 歸因至來源文章，衡量哪篇文章的 Lead Magnet 轉換率最高

### 6. 站內搜尋 ⭐ 新增

* **功能**：支援全站文章全文搜尋，搜尋結果頁含標題、摘要、分類標籤
* **路線 A (WordPress)**：使用 SearchWP 或 Relevanssi 外掛，支援中文斷詞
* **路線 B (Next.js)**：使用 Algolia / Meilisearch / Pagefind（靜態站推薦 Pagefind，零成本）
* **UX 規格**：
  * 導覽列搜尋 icon → 展開搜尋 overlay → 即時顯示建議
  * 搜尋結果標記匹配關鍵字（highlight）
  * 「找不到結果」提供延伸閱讀推薦

---

## 五、 行動裝置與響應式設計 (Mobile & Responsive) ⭐ 新增

### 設計原則
知識型網站 60-70% 流量來自手機，所有頁面以 Mobile-First 設計。

### 響應式斷點

| 斷點 | 寬度 | 版面調整 |
|---|---|---|
| Mobile | < 768px | 單欄、漢堡選單、TOC 摺疊為浮動按鈕 |
| Tablet | 768px – 1024px | 側邊欄收合、圖片雙欄 |
| Desktop | > 1024px | 完整側邊欄 + TOC 固定於左/右側 |

### Mobile 特殊考量
* 程式碼區塊：水平滾動 + 一鍵複製按鈕放大
* 比較表格：水平捲動 + 固定第一欄標題
* 內嵌課程模組：全寬卡片，CTA 按鈕不得小於 44×44px（觸控友善）
* 圖片：全部 lazy loading + `srcset` 提供多尺寸，WebP 優先
* Sticky Header：高度不超過 56px，避免壓縮內容可見區域

---

## 六、 效能目標 — Core Web Vitals ⭐ 新增

| 指標 | 目標值 | 說明 |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5 秒 | 首屏主要內容載入完成 |
| **INP** (Interaction to Next Paint) | < 200 毫秒 | 使用者互動後的回應速度 |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 避免版面跳動 |
| **TTFB** (Time to First Byte) | < 800 毫秒 | 伺服器回應速度 |

### 效能策略

* **路線 A (WordPress)**：
  * 必裝：LiteSpeed Cache / WP Rocket + CDN (Cloudflare)
  * 圖片：ShortPixel / Imagify 自動壓縮 + WebP 轉換
  * 字型：Google Fonts 本地化載入，減少外部請求
* **路線 B (Next.js)**：
  * Vercel Edge Network 自帶 CDN
  * Next/Image 自動最佳化 + `loading="lazy"`
  * 字型：`next/font` 自動最佳化

### 驗收方式
* 上線前：Google PageSpeed Insights 行動版 ≥ 90 分
* 上線後：每月透過 Google Search Console Core Web Vitals 報告追蹤

---

## 七、 法務頁面 (Legal Pages) ⭐ 新增

### 必備頁面

| 頁面 | 內容重點 | 法規依據 |
|---|---|---|
| **隱私權政策** (`/privacy/`) | 個資蒐集目的、範圍、利用方式、保存期限、當事人權利行使方式 | 台灣個人資料保護法 |
| **Cookie 政策** (`/cookie-policy/`) | Cookie 類型（必要/分析/行銷）、第三方 Cookie 說明（GA4、Meta Pixel）、管理方式 | ePrivacy / GDPR（若有海外流量） |
| **服務條款** (`/terms/`) | 智慧財產權聲明、免責條款、使用限制 | 一般商業慣例 |

### Cookie 同意機制
* 首次造訪顯示 Cookie Banner
* 提供「接受全部 / 僅必要 / 自訂設定」三個選項
* GTM 依使用者同意狀態啟動或停止對應 tag（Consent Mode v2）
* 路線 A：使用 CookieYes 或 Complianz 外掛
* 路線 B：自建或使用 Osano / CookieConsent.js

---

## 八、 技術選型建議 (Tech Stack Recommendation)

| 維度 | 路線 A：WordPress 現代輕量化 | 路線 B：Next.js + Headless CMS |
|---|---|---|
| **底層技術** | WordPress (自託管) + PHP | Next.js (App Router) + TypeScript |
| **佈景/前端** | GeneratePress Premium 或 Kadence + Gutenberg | Tailwind CSS + Shadcn UI |
| **內容託管** | Cloudways / VPS (搭配 LiteSpeed 快取) | Vercel 託管 + Strapi / Sanity / Notion API |
| **CDN** | Cloudflare（免費方案即可） | Vercel Edge Network + Cloudflare（靜態資源） |
| **圖片最佳化** | ShortPixel / Imagify + WebP 自動轉換 | Next/Image 自帶，設定 remote patterns |
| **Email 服務** | ConvertKit (Kit) — 視覺化自動序列 | Resend + React Email 自建，或同用 ConvertKit |
| **表單處理** | WPForms 或 Gravity Forms | 自建 API route 或 Formspree |
| **站內搜尋** | SearchWP / Relevanssi | Pagefind（靜態）或 Algolia |
| **監控 / Uptime** | UptimeRobot（免費）+ Better Stack | 同左，另加 Vercel Analytics |
| **優點** | 開發極快（3-5 天可上線）、外掛生態成熟、SEO 工具完整 | 首屏渲染極速、全自定義動線、零外掛臃腫負擔 |
| **適合對象** | 個人顧問、行銷人、希望迅速上線產出內容者 | 熟悉前端開發、想完全掌控 UI/UX 與自動化工作流者 |

---

## 九、 內容生產 SOP 與關鍵字策略 ⭐ 新增

### 1. 發文節奏

| 內容類型 | 頻率 | 字數 | 說明 |
|---|---|---|---|
| 深度長文（SEO 主力） | 每週 1 篇 | 3,000-5,000 字 | Topic Cluster 核心，衝排名 |
| 短文 / 快評 | 每週 1-2 篇 | 800-1,500 字 | 時事、工具快評、社群引流 |
| Podcast 筆記 | 配合節目更新 | 1,500-2,500 字 | 訪談精華 + 延伸資源 |

### 2. 內容生產流程

```
選題（關鍵字研究 + 社群熱度）
  → 大綱撰寫（H2/H3 結構 + 目標關鍵字配置）
  → 初稿撰寫
  → SEO 優化（標題/Meta/內鏈/Schema）
  → 視覺素材製作（封面圖 + 文內插圖 + OG 圖卡）
  → 上稿 + 排程發布
  → 社群分發（FB/IG/Threads/LINE OA 摘要 + 導流連結）
  → 成效追蹤（7 天後檢視 GA4 數據）
```

### 3. 關鍵字策略 (Keyword Map)

以 Topic Cluster 模型規劃：

| Cluster（支柱頁） | 子主題範例（衛星文章） |
|---|---|
| AI 工具實戰 | Claude Code 教學、MCP 設定、Cursor 比較、Prompt Engineering |
| 數位行銷策略 | SEO 入門、GA4 報表、社群經營、EDM 行銷 |
| 專業證照攻略 | iPAS 準備、GAIQ 考試、數位行銷證照比較 |
| Podcast / 專訪 | 來賓觀點整理、產業趨勢、創業故事 |

每篇文章須指定：主要關鍵字 1 組 + 次要關鍵字 2-3 組 + 內鏈至少 2 條。

### 4. 長青內容更新機制

* 每季 review 排名前 20 篇文章，更新過時資訊
* 標注「最後更新日期」於文章頂部（SEO 加分 + 讀者信任）
* 過時且無流量的文章：301 重導至更新版或合併至同主題文章

---

## 十、 變現路徑與定價架構 ⭐ 新增

### 1. 轉換梯度（免費 → 付費）

```
免費深度文章（建立信任）
  → Lead Magnet（留 email，取得名單）
  → 電子報培養序列（持續提供價值）
  → 低價數位產品（電子書 / 模板包 / 迷你課程，$299-$999）
  → 中價線上課程（$2,000-$8,000，自建或 Hahow / Teachable）
  → 高價顧問 / 企業內訓（$15,000+ / 場次）
```

### 2. 課程平台選型

| 平台 | 抽成 | 自有流量 | 適合階段 |
|---|---|---|---|
| **Hahow** | 50% 營收 | 平台自帶流量 | 冷啟動期，借力打力 |
| **Teachable / Thinkific** | 月費制，0 抽成 | 需自導流量 | 已有名單 > 1,000 人 |
| **自建（LMS on WordPress / 自建系統）** | 無抽成 | 完全自主 | 技術能力足夠時 |

建議起步：先在 Hahow 出第一門課建立口碑，同步用自有網站導流。名單 > 2,000 人後考慮遷至自建。

### 3. 顧問定價建議

| 類型 | 定價參考 | 說明 |
|---|---|---|
| 1-on-1 諮詢 | $3,000-5,000 / 小時 | 線上，60 分鐘 |
| 企業內訓 | $30,000-80,000 / 場 | 3-6 小時，含簡報與教材 |
| 顧問專案 | 依 scope 報價 | 月費制或專案制 |

### 4. 聯繫表單規格
* 非通用「聯繫我」，而是結構化表單：
  * 姓名、Email、公司名稱（選填）、需求類型（下拉：演講邀約 / 企業內訓 / 顧問諮詢 / 合作提案 / 其他）、預算範圍（下拉）、需求描述（文字區塊）
  * 送出後自動回覆確認信 + 48 小時內人工回覆承諾

---

## 十一、 競品分析 ⭐ 新增

### 標竿：科技翰林院 (TechHanlin)

| 分析面向 | 觀察 | 要學 | 不學 |
|---|---|---|---|
| **內容策略** | 深度長文 + 結構化排版 + 每篇都有明確 CTA | 長文結構化、每篇必帶 CTA | — |
| **SEO** | Schema 完整、URL 乾淨、Topic Cluster 明確 | JSON-LD 全覆蓋、Cluster 規劃 | — |
| **視覺** | 高對比度、資訊密度高但排版不擁擠 | 資訊清晰的版面節奏 | 風格可依自身品牌調整 |
| **轉換動線** | 文章 → 課程推薦 → 外導平台購買 | 文內自然植入推薦模組 | 過度推銷感的彈窗 |
| **社群整合** | Podcast + 社群 + 官網三者串聯 | 流量閉環的思路 | 不需照搬相同平台 |

### 差異化方向
* 更強的 AEO（AI 搜尋引擎友善）佈局——科技翰林院尚未針對 AI 搜尋最佳化
* Lead Magnet + 電子報序列的自動培養機制——建立直接通訊管道
* 自有課程平台（長期目標）——不被第三方平台抽成綁架

---

## 十二、 備份與災難復原 ⭐ 新增

### 路線 A (WordPress / VPS)

| 項目 | 規格 |
|---|---|
| 每日自動備份 | UpdraftPlus / BlogVault → 異地儲存（Google Drive / S3） |
| 備份範圍 | 資料庫 + 檔案系統（wp-content） |
| 保留天數 | 30 天滾動 |
| 災難復原 RTO | < 4 小時（從備份還原） |
| 災難復原 RPO | < 24 小時（最多丟失 1 天資料） |
| 測試頻率 | 每季執行一次還原測試 |

### 路線 B (Next.js / Vercel)

| 項目 | 規格 |
|---|---|
| 程式碼 | Git 版控，Vercel 自動部署（每次 push = 一個版本快照） |
| 內容（CMS） | Strapi / Sanity 自帶版本歷史；額外每日匯出 JSON 備份至 S3 |
| 災難復原 | Vercel 支援 instant rollback 至任一部署版本 |

### 共通
* Email 訂閱者名單：每月匯出 CSV 存於加密雲端硬碟
* 網域 DNS 設定文件化：記錄所有 DNS record，存於 Git 或文件中

---

## 十三、 風險評估 ⭐ 新增

| # | 風險 | 可能性 | 影響 | 對策 |
|---|---|---|---|---|
| 1 | **內容產出跟不上**——一人寫深度長文，每週 > 2 篇難以持續 | 高 | 高 | 先設定每週 1 篇長文 + 1 篇短文的底線，AI 輔助大綱與初稿；季度檢視調整 |
| 2 | **SEO 見效慢**——新站 3-6 個月才有自然流量 | 高 | 中 | Phase 4 配合社群引流 + 電子報經營填補流量空窗期 |
| 3 | **原創內容被 AI 摘要取代**——點擊率下降 | 中 | 高 | 強化 AEO 佈局（被引用 = 品牌曝光）+ Lead Magnet 轉換至自有名單 |
| 4 | **平台依賴風險**——課程放 Hahow 被抽 50%、email 放 ConvertKit 漲價 | 中 | 中 | 自有網站為核心，第三方平台為分銷管道；名單定期匯出備份 |
| 5 | **技術債堆積**——WordPress 外掛衝突或 Next.js 升級 breaking change | 中 | 中 | 外掛控制在 15 個以內；Next.js 追蹤 LTS 版本，非必要不追最新 |
| 6 | **個資外洩**——表單收集的 email + 姓名若洩漏 | 低 | 高 | SSL 全站加密、表單 CAPTCHA、email 服務選用 SOC 2 認證供應商 |

---

## 十四、 無障礙合規 (Accessibility) ⭐ 新增

### 目標：WCAG 2.1 AA 基本合規

| 項目 | 規格 |
|---|---|
| 色彩對比 | 文字 vs 背景對比度 ≥ 4.5:1（一般文字）、≥ 3:1（大標題） |
| 鍵盤操作 | 所有互動元素可用 Tab 鍵導航，focus 狀態清楚可見 |
| 圖片替代文字 | 所有功能性圖片需有 alt text |
| 表單標籤 | 所有表單欄位須有 `<label>` 關聯 |
| 語意標記 | 使用正確的 HTML 語意標籤（`<nav>`、`<main>`、`<article>`、`<aside>`） |
| 字體大小 | 基礎字級 ≥ 16px，行高 ≥ 1.5 |

### 驗收工具
* axe DevTools / Lighthouse Accessibility Audit ≥ 90 分
* 手動鍵盤測試（Tab 順序合理、ESC 可關閉 modal）

---

## 十五、 產品開發與上線里程碑 (Milestones)

### 路線 A：WordPress（5 週）

| 階段 | 時間 | 內容 |
|---|---|---|
| **Phase 1** 基礎設施與品牌視覺定調 | 第 1 週 | 網域設定、SSL、DNS、CDN (Cloudflare)、品牌調性：高對比度字體排版、簡潔配色、「關於作者」頁。安裝 UptimeRobot 監控 |
| **Phase 2** 核心內容引擎與版面組件 | 第 2 週 | 搭建 4 大核心分類 + 站內搜尋。實作行銷元件：內嵌課程卡片、折扣碼一鍵複製、TOC、Lead Magnet 表單。Email 服務串接（ConvertKit） |
| **Phase 3** SEO 基礎與追蹤埋設 | 第 3 週 | GTM、GA4、Schema JSON-LD、Sitemap 提交 GSC。Cookie Banner + 隱私權政策頁。OG Meta / Social Cards 設定 |
| **Phase 4** 冷啟動內容發布與驗證 | 第 4 週 | 發布第 1 批 5-10 篇「高意圖關鍵詞集群」文章。將社群/音訊受眾引流進站，驗證轉換動線與停留時間 |
| **Phase 5** 效能調校與備份驗證 | 第 5 週 | Core Web Vitals 調校至目標值。備份還原測試。響應式 / 無障礙最終檢查。法務頁面上線 |

### 路線 B：Next.js（7 週）

| 階段 | 時間 | 內容 |
|---|---|---|
| **Phase 1** 基礎設施與品牌視覺定調 | 第 1 週 | Vercel 部署、Headless CMS 設定（Strapi / Sanity）、設計系統建立（Tailwind + Shadcn）、「關於作者」頁 |
| **Phase 2** 核心內容引擎 | 第 2-3 週 | CMS 串接、文章頁排版引擎、4 大分類頁、TOC、Related Posts、站內搜尋（Pagefind）、RSS Feed |
| **Phase 3** 行銷與轉換元件 | 第 4 週 | 內嵌課程模組、Lead Magnet 表單 + Email 串接（Resend / ConvertKit）、聯繫表單、Podcast 嵌入元件 |
| **Phase 4** SEO / 追蹤 / 法務 | 第 5 週 | Schema JSON-LD 自動生成、GTM + GA4、OG Meta 動態生成、Cookie Consent、法務頁面 |
| **Phase 5** 冷啟動內容與驗證 | 第 6 週 | 發布第 1 批 5-10 篇文章，引流驗證 |
| **Phase 6** 效能與合規收尾 | 第 7 週 | Core Web Vitals 調校、備份測試、響應式 / 無障礙驗收 |

---

## 附錄 A：v1.0 → v2.0 更新紀錄

| 版本 | 日期 | 變更摘要 |
|---|---|---|
| v1.0 | 初版 | 6 章：願景、Persona、IA、功能、技術選型、里程碑 |
| v2.0 | 2026-09-02 | 新增 9 個章節：電子報系統、Lead Magnet、站內搜尋、行動裝置/響應式、Core Web Vitals、法務頁面、內容生產 SOP、變現路徑、競品分析、備份與災難復原、風險評估、無障礙合規。補齊 KPI 基準線與時間軸。調整里程碑為路線 A (5 週) / 路線 B (7 週) |
