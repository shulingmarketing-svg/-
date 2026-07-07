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
-- 種子資料（真實三品牌：十全 / iOiO / 一比呀呀）
-- =========================================================

INSERT INTO clients VALUES
('c-shihchuan','十全特好食品股份有限公司','十全','調味品・果醋',20000,'中案',85,'一般排程','["1954","古法釀造","Clean Label","果醋"]',CURRENT_TIMESTAMP),
('c-ioio','十全特好食品股份有限公司','iOiO 食在愛我','健康飲品',0,'中案',80,'一般排程','["蒟蒻","低卡","0脂肪","下午茶"]',CURRENT_TIMESTAMP),
('c-yibiyaya','十全特好食品股份有限公司','一比呀呀 YIBIYAYA','兒童天然果汁',0,'中案',78,'一般排程','["親子","0添加糖","0色素","校園"]',CURRENT_TIMESTAMP);

INSERT INTO brand_profiles VALUES
('c-shihchuan',
 '創立 1954 年、立基新竹的 70 年老字號。核心理念「十全十美」的品質堅持，通過 Clean Label 雙潔淨標章、FSSC 22000、ISO 22000、HACCP 認證，定位為食安守門員。融合古法釀造與現代自動化科技的高 CP 值國民品牌，主力味噌、味醂、釀造醋，並以果醋飲品引領「健康新食代」。',
 '家庭料理線｜家庭為主、有料理習慣的媽媽與愛料理的人
餐飲業務線｜餐飲業者、B2B 大宗採購
果醋送禮線｜25-55 歲上班族、一般企業客戶、節慶送禮需求',
 '百年工藝職人故事、食安認證與安心、料理提案食譜、果醋健康飲、節慶送禮。',
 '日系進口味噌味醂、台灣同業調味品牌、健康醋飲品牌、節慶禮盒電商。',
 '避免療效宣稱；強調天然釀造、Clean Label 認證、料理應用、送禮情境與購買 CTA。',
 '禁用（涉療效）：治療、治癒、改善疾病、預防疾病、抗癌、降血壓、降血糖、降膽固醇、增強免疫力、改善過敏、解毒、消炎。禁用（誇大）：減肥、瘦身、塑身、燃脂、美白、抗老、回春。警戒詞：幫助消化、開胃、促進新陳代謝、調整體質。安全替代：天然釀造、無添加、輕負擔、料理應用、營養補給、健康好氣色、全家安心。',
 'FB：品牌故事、食譜教育、節慶互動與導購。IG：Reels、產品近拍、生活情境與短句 CTA。SEO：料理知識與果醋喝法長文，導流官網。'),
('c-ioio',
 '十全副品牌，主打超口感蒟蒻飲，以「低卡、0 脂肪」為訴求，包裝活潑充滿元氣，鎖定年輕消費者與在意身材的女性族群。',
 '輕卡上班族線｜25-55 歲上班族、習慣下午茶、愛買飲品
控糖體態線｜控糖與體態管理族群（表述限用「低卡、輕負擔」）',
 '低卡輕負擔、蒟蒻口感趣味、辦公室下午茶情境、體態管理安全表述。',
 '機能飲料、蒟蒻果凍飲、便利商店手搖與包裝飲品。',
 '嚴禁「減肥／瘦身／燃脂」字眼，一律以「低卡、0 脂肪、輕負擔」替代；口吻活潑年輕。',
 '同食品法規禁用詞（療效、減肥美容誇大均禁）。益生菌產品不可宣稱改善腸道疾病。警戒詞：促進新陳代謝、調整體質。安全替代：低卡、0 脂肪、輕負擔、無負擔、飽足感。',
 'IG 主力：繽紛視覺、互動貼紙、下午茶情境。FB：團購導流。SEO：低卡飲品、蒟蒻相關關鍵字。'),
('c-yibiyaya',
 '定位「孩子的第一杯果汁」。嚴選天然果汁濃縮，0 添加糖、0 色素、0 防腐劑，解決家長對市售含糖飲料的食安疑慮，深受家庭與校園青睞。',
 '親子家庭線｜媽媽、爸爸、2-12 歲孩子的家庭、注重天然飲品
校園團體線｜幼稚園、托兒所、親子活動團購',
 '0 添加食安安心、親子日常場景、幼兒飲食知識、校園與團購。',
 '市售含糖兒童飲料、兒童果汁品牌、乳酸飲品。',
 '不可宣稱幫助發育、增強免疫；訴求 0 添加、天然、家長安心；口吻溫暖親切。',
 '同食品法規禁用詞。兒童食品不得宣稱促進發育、長高、增強抵抗力等療效。安全替代：天然果汁、0 添加糖、0 色素、0 防腐劑、安心、無負擔。',
 'FB：家長社群、團購揪團、食安溝通。IG：親子日常、繽紛視覺。SEO：育兒飲食、兒童飲品挑選文章。');

INSERT INTO campaigns VALUES
('cp-sc-q3','c-shihchuan','2026-Q3','夏日果醋檔期 → 中元/中秋禮盒預熱',0),
('cp-io-q3','c-ioio','2026-Q3','夏季下午茶輕卡檔期',0),
('cp-yb-q3','c-yibiyaya','2026-Q3','開學季校園安心果汁檔期',0);

INSERT INTO content_items (id,client_id,campaign_id,title,platform,status,content_body,business_goal,scheduled_date,published_date,value_ntd,next_step) VALUES
('ct-001','c-shihchuan','cp-sc-q3','70年味噌職人精神','FB+IG','已發布','老照片與現代釀造廠對比，導入品牌精神。','建立信任','2026-07-01','2026-07-01',1500,'可認列交付並追蹤成效'),
('ct-002','c-shihchuan','cp-sc-q3','味噌顏色秘密大解密','IG','待客戶審核','60天、4個月、6個月味噌差異短影音。','互動增長','2026-07-08',NULL,1800,'等待客戶回覆或催審'),
('ct-003','c-shihchuan','cp-sc-q3','夏日果醋喝法專題','SEO','草稿中','','導流名單','2026-07-15',NULL,2000,'完成初稿後送審'),
('ct-004','c-shihchuan','cp-sc-q3','果醋中元禮盒搶先看','FB+IG','待補資料','天然釀造、無添加，禮盒視覺待客戶提供。','轉換營收','2026-07-22',NULL,1500,'向客戶補禮盒素材後再產文'),
('ct-005','c-ioio','cp-io-q3','iOiO 辦公室下午茶輕卡提案','IG','已發布','蒟蒻口感 × 低卡 0 脂肪，下午茶新選擇。','建立信任','2026-07-03','2026-07-03',1200,'可認列交付並追蹤成效'),
('ct-006','c-ioio','cp-io-q3','iOiO 團購倒數','FB+IG','待客戶審核','辦公室團購方案，限時倒數。','轉換營收','2026-07-17',NULL,1500,'等待客戶回覆或催審'),
('ct-007','c-yibiyaya','cp-yb-q3','開學季安心果汁：孩子的第一杯果汁','Facebook','草稿中','0 添加糖、0 色素、0 防腐劑，家長安心的開學準備。','建立信任','2026-08-05',NULL,1500,'完成初稿後送審');

INSERT INTO crm_pipeline (id,company_name,contact_name,contact_title,contact_method,stage,follow_up_status,next_contact_date,deal_value,marketing_need,owner,priority,notes) VALUES
('crm-001','十全特好食品股份有限公司','（待補聯絡人）','行銷窗口','待確認','已成交','服務中','2026-07-20',60000,'FB/IG 經營 + SEO 文章（三品牌）','待指派','高','月費 2 萬、中案。三品牌（十全/iOiO/一比呀呀）內容經營中，月費如何分攤到副品牌待確認。');
