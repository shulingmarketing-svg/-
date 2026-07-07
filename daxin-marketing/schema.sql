-- =========================================================
-- 大心整合行銷 AI 行銷管理系統 — Cloudflare D1 Schema
-- 執行方式: npx wrangler d1 execute daxin-marketing --file=schema.sql
-- =========================================================

DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS brand_profiles;
DROP TABLE IF EXISTS content_items;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS crm_pipeline;

-- 客戶／品牌主表（模組 2、3）
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  brand_name TEXT,
  industry TEXT,
  monthly_fee INTEGER DEFAULT 0,
  case_scale TEXT DEFAULT '中案',
  data_completeness INTEGER DEFAULT 0,
  timeline_status TEXT DEFAULT '一般排程',
  tags TEXT DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 品牌 DNA / 訓練資料（模組 2、4）
CREATE TABLE brand_profiles (
  client_id TEXT PRIMARY KEY REFERENCES clients(id),
  positioning TEXT DEFAULT '',
  target_audience TEXT DEFAULT '',
  content_pillars TEXT DEFAULT '',
  competitors TEXT DEFAULT '',
  writing_restrictions TEXT DEFAULT '',
  regulation_notes TEXT DEFAULT '',
  platform_preferences TEXT DEFAULT ''
);

-- 內容項目主表（模組 5、6、7、8 共用同一張表）
CREATE TABLE content_items (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  campaign_id TEXT,
  title TEXT NOT NULL,
  platform TEXT DEFAULT 'FB+IG',
  status TEXT DEFAULT '草稿中',
  content_body TEXT DEFAULT '',
  business_goal TEXT DEFAULT '',
  scheduled_date TEXT,
  published_date TEXT,
  value_ntd INTEGER DEFAULT 0,
  next_step TEXT DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 季度戰役（模組 6）
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  quarter TEXT,
  theme TEXT,
  budget INTEGER DEFAULT 0
);

-- CRM 名單（模組 9）
CREATE TABLE crm_pipeline (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_title TEXT,
  contact_method TEXT,
  stage TEXT DEFAULT '新名單',
  follow_up_status TEXT DEFAULT '待首次聯繫',
  next_contact_date TEXT,
  deal_value INTEGER DEFAULT 0,
  marketing_need TEXT,
  owner TEXT,
  priority TEXT DEFAULT '一般',
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 種子資料（與截圖畫面一致，方便驗收）
-- =========================================================

INSERT INTO clients VALUES
('c-shihchuan','十全特好食品','十全特好','食品',45000,'中案',92,'一般排程','["1954","古法釀造","母親節","618"]',CURRENT_TIMESTAMP),
('c-ioio','iOiO 食在愛我','iOiO','健康飲品',38000,'中案',88,'一般排程','["親子","低卡","好喝好玩","暑假"]',CURRENT_TIMESTAMP);

INSERT INTO brand_profiles VALUES
('c-shihchuan',
 '創立1954年，古法釀造、非基改黃豆、台灣國產白米，訴求職人精神與安心食安。',
 '30-55歲料理愛好者、家庭採買者，重視健康與家常料理的人。三條線：家庭料理線（家庭餐桌守門員 35-49歲）、健康輕飲線（健康輕養生女孩 25-39歲）、餐飲業務線（餐飲補貨決策者 30-55歲）。',
 '百年工藝、天然安心、料理提案、家庭共餐溫度。',
 '醬料品牌、健康飲品禮盒、節慶送禮電商品牌。日本進口高階線、台灣同業、有機自然食品、B2B 大宗供應等競爭趨勢。',
 '避免醫療療效宣稱；強調天然釀造、料理應用、送禮情境與購買 CTA。',
 '食品廣告法規安全詞：幫助消化、開胃、促進新陳代謝可警戒使用；禁用：改善體質、增強免疫力、減肥/瘦身/塑身、美白、抗老、解毒、治療、預防疾病、降血壓、改善過敏。可用詞、禁用詞、替代寫法需上線前檢核。',
 'FB 適合品牌故事、食譜教育、節慶互動與導購；IG 適合 Reels、產品近拍、生活情境與短句 CTA。'),
('c-ioio',
 '蒟蒻飲、果汁、益生菌，主打親子健康零負擔的趣味飲品。',
 '25-40歲年輕媽媽與注重健康的上班族，親子場景、暑假檔期。',
 '低卡輕負擔、親子同樂、好喝好玩。',
 '機能飲料、兒童飲品、便利商店通路品牌。',
 '避免減肥瘦身宣稱；以「輕負擔」「無負擔」等安全表述替代。',
 '同食品廣告法規：禁止療效宣稱，益生菌不可宣稱改善腸道疾病。',
 'IG 為主力：親子日常、繽紛視覺、互動貼紙；FB 輔以團購導流。');

INSERT INTO campaigns VALUES
('cp-sc-q2','c-shihchuan','2026-Q2','品牌聲量期：職人故事 → 母親節果醋禮盒 → 夏日飲品',120000),
('cp-io-q2','c-ioio','2026-Q2','暑假親子檔期：品牌認知 → 健康禮盒 → 團購轉換',90000);

INSERT INTO content_items (id,client_id,campaign_id,title,platform,status,content_body,business_goal,scheduled_date,published_date,value_ntd,next_step) VALUES
('ct-001','c-shihchuan','cp-sc-q2','70年味噌職人精神','FB+IG','已發布','老照片與現代釀造廠對比，導入品牌精神。','建立信任','2026-04-01','2026-04-01',1500,'可認列交付並追蹤成效'),
('ct-002','c-shihchuan','cp-sc-q2','味噌顏色秘密大解密','IG','待客戶審核','60天、4個月、6個月味噌差異短影音。','互動增長','2026-04-02',NULL,1800,'等待客戶回覆或催審'),
('ct-003','c-shihchuan','cp-sc-q2','果醋禮盒搶先看','FB+IG','已發布','天然釀造、無添加、送媽媽健康好氣色。','轉換營收','2026-05-01','2026-05-01',1500,'可認列交付並追蹤成效'),
('ct-004','c-shihchuan','cp-sc-q2','果醋禮盒最後倒數','FB+IG','待補資料','媽媽照顧家人，這次換我們照顧她的健康。','轉換營收','2026-05-08',NULL,1500,'向客戶補資料後再產文'),
('ct-005','c-shihchuan','cp-sc-q2','夏日果醋喝法專題','SEO','草稿中','','導流名單','2026-06-12',NULL,2000,'完成初稿後送審'),
('ct-006','c-ioio','cp-io-q2','iOiO 是什麼？','FB+IG','已發布','品牌認知首發文。','建立信任','2026-04-01','2026-04-01',1200,'可認列交付並追蹤成效'),
('ct-007','c-ioio','cp-io-q2','健康禮盒最後 XX 組','FB+IG','已發布','限量倒數，親子健康禮盒。','轉換營收','2026-05-01','2026-05-01',1500,'可認列交付並追蹤成效');

INSERT INTO crm_pipeline (id,company_name,contact_name,contact_title,contact_method,stage,follow_up_status,next_contact_date,deal_value,marketing_need,owner,priority,notes) VALUES
('crm-001','十全特好食品','王經理','行銷經理','Email','已成交','續約追蹤','2026-07-20',225000,'FB/IG 經營 + SEO 文章','業務 A','高','Q2 交付順利，Q3 續約會議排程中。'),
('crm-002','iOiO 食在愛我','林小姐','品牌窗口','LINE','已成交','續約追蹤','2026-07-25',120000,'IG 經營 + 團購導流','PM B','一般','暑假檔期表現待覆盤後談續約。');
