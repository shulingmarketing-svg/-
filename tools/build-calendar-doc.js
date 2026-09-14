/**
 * 由 .claude/projects/淨養好好生活-文案.md 產生 Word 交付檔。
 * 文案的唯一來源是那份 md，這支程式只負責排版，不得內嵌任何文案。
 *   node tools/build-calendar-doc.js [輸出路徑]
 */
const fs = require("fs");
const path = require("path");

// 每個新環境都是乾淨的 clone，node_modules 不進版控。缺套件就自己裝，不用人記。
try {
  require.resolve("docx");
} catch {
  console.log("首次執行，安裝相依套件中…");
  try {
    require("child_process").execFileSync(
      "npm", ["install", "--omit=dev", "--no-audit", "--no-fund", "--silent"],
      { cwd: __dirname, stdio: "inherit" },
    );
  } catch {
    console.error("安裝失敗。請確認網路可用，或手動在 tools/ 執行 npm install。");
    process.exit(1);
  }
}

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, PageBreak,
  Footer, PageNumber, convertInchesToTwip,
} = require("docx");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, ".claude/projects/淨養好好生活-文案.md");
const OUT = process.argv[2] || path.join(ROOT, "淨養好好生活_2027節氣月曆_十二個月文案.docx");

const FONT = "Microsoft JhengHei";
const INK = "2E3B34", SOFT = "6B7C72", LINE = "C8D3CC", BAND = "EEF3F0";
const ACCENT = "8FA89A", WARN = "9C3A2E", GIFT = "8A6A3B";

// ---------------------------------------------------------------- 解析 md

const md = fs.readFileSync(SRC, "utf8");

/** 依 `## ` 切段，回傳 [{title, body}] */
function splitSections(text) {
  const out = [];
  let cur = null;
  for (const line of text.split("\n")) {
    const h = line.match(/^##\s+(.*)$/);
    if (h) {
      if (cur) out.push(cur);
      cur = { title: h[1].trim(), lines: [] };
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  if (cur) out.push(cur);
  return out;
}

const sections = splitSections(md);
const findSection = (kw) => sections.find((s) => s.title.includes(kw));

/** 次節氣小標表：月份 -> {term, date, dow, line} */
const subTerms = {};
for (const l of (findSection("次節氣小標") || { lines: [] }).lines) {
  const m = l.match(/^\|\s*(\d+月)\s*\|\s*(\S+?)\s+(\d+\/\d+)（(週.)）\s*\|\s*(.+?)\s*\|$/);
  if (m) subTerms[m[1]] = { term: m[2], date: m[3], dow: m[4], line: m[5] };
}

/** 12 個月 */
const MONTH_RE = /^(\d+月)｜(\S+?)[\s　]+(\d+\/\d+)（(週.)）/;
const months = [];
for (const s of sections) {
  const h = s.title.match(MONTH_RE);
  if (!h) continue;
  const month = { m: h[1], term: h[2], date: h[3], dow: h[4], senses: [] };
  for (const raw of s.lines) {
    const l = raw.trim();
    let x;
    if ((x = l.match(/^🎁\s*\*\*搭配：(.+?)\*\*$/))) month.gift = x[1];
    else if (!month.feel && (x = l.match(/^>\s+(.+)$/))) month.feel = x[1].trim();
    else if ((x = l.match(/^\|\s*(視|聽|嗅|味|觸)\s*\|\s*(.+?)\s*\|$/))) month.senses.push([x[1], x[2]]);
    else if ((x = l.match(/^\*\*身心安頓\*\*：(.+)$/))) month.rest = x[1].trim();
  }
  const sub = subTerms[month.m];
  if (sub) Object.assign(month, { sub: sub.term, subDate: sub.date, subDow: sub.dow, subLine: sub.line });
  months.push(month);
}
months.sort((a, b) => parseInt(a.m) - parseInt(b.m));

const version = (md.match(/^>\s*版本：(.+?)｜/m) || [, "未標示"])[1].trim();
const slogan = "一起用心，讓好好生活，成為每一天的日常。";

// ---------------------------------------------------------------- 健檢

const problems = [];
if (months.length !== 12) problems.push(`解析到 ${months.length} 個月，應為 12`);
for (const x of months) {
  const got = x.senses.map((s) => s[0]);
  for (const need of ["視", "聽", "嗅", "味", "觸"]) {
    if (!got.includes(need)) problems.push(`${x.m}${x.term} 缺「${need}」`);
  }
  if (!x.feel) problems.push(`${x.m}${x.term} 缺節氣感受句`);
  if (!x.rest) problems.push(`${x.m}${x.term} 缺身心安頓`);
  if (!x.sub) problems.push(`${x.m} 在次節氣小標表中找不到對應列`);
}
if (problems.length) {
  console.error("md 內容不完整，未產生檔案：");
  for (const p of problems) console.error("  ‧ " + p);
  process.exit(1);
}

// ---------------------------------------------------------------- 排版工具

const R = (t, o = {}) => new TextRun({
  text: t, font: FONT, size: o.size || 22, bold: !!o.bold,
  color: o.color || INK, italics: !!o.italics,
});

/** `**粗體**` 轉成 runs */
function runs(text, o = {}) {
  return text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((seg) => {
    const b = seg.match(/^\*\*([^*]+)\*\*$/);
    return b ? R(b[1], { ...o, bold: true }) : R(seg, o);
  });
}

const P = (children, o = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  alignment: o.align,
  spacing: { before: o.before || 0, after: o.after === undefined ? 120 : o.after, line: 300 },
});

const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const cellBorders = { top: thin, bottom: thin, left: thin, right: thin };
const NO_BORDER = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
};

function cell(children, o = {}) {
  return new TableCell({
    children: [new Paragraph({ children, alignment: o.align, spacing: { before: 60, after: 60, line: 280 } })],
    width: { size: o.w, type: WidthType.PERCENTAGE },
    shading: o.shade ? { type: ShadingType.CLEAR, fill: o.shade } : undefined,
    borders: cellBorders,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: "center",
  });
}

/** md 表格（含表頭分隔列）轉 docx 表格 */
function mdTable(rows) {
  const cols = rows[0].length;
  const w = Math.floor(100 / cols);
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((cells, i) => new TableRow({
      tableHeader: i === 0,
      children: cells.map((c) => cell(runs(c, { size: 21 }), {
        w, shade: i === 0 ? "DCE6E0" : (i % 2 === 0 ? BAND : undefined),
        align: i === 0 ? AlignmentType.CENTER : undefined,
      })),
    })),
  });
}

/** 通用 markdown 區塊 -> docx，供規範／自查等純文字段落使用 */
function renderProse(lines) {
  const out = [];
  let table = null;
  const flush = () => { if (table) { out.push(mdTable(table)); out.push(P([R("")], { after: 120 })); table = null; } };

  for (const raw of lines) {
    const l = raw.trim();
    if (!l || l === "---") { flush(); continue; }

    if (l.startsWith("|")) {
      if (/^\|[\s:|-]+\|$/.test(l)) continue;
      const cells = l.slice(1, -1).split("|").map((c) => c.trim());
      (table = table || []).push(cells);
      continue;
    }
    flush();

    let m;
    if ((m = l.match(/^###\s+(.*)$/))) out.push(P(runs(m[1], { size: 24, bold: true }), { before: 200, after: 100 }));
    else if ((m = l.match(/^>\s*(.*)$/))) out.push(P(runs(m[1], { size: 20, color: SOFT }), { before: 60, after: 140 }));
    else if ((m = l.match(/^(\s*)[-*]\s+(.*)$/))) out.push(P([R("　".repeat(m[1].length / 2 + 1) + "‧　"), ...runs(m[2])], { after: 60 }));
    else if ((m = l.match(/^(\d+)\.\s+(.*)$/))) out.push(P([R(`${m[1]}.　`), ...runs(m[2])], { after: 80 }));
    else out.push(P(runs(l), { after: 120 }));
  }
  flush();
  return out;
}

function heading(text) {
  return P(runs(text.replace(/^[⚠️✅📌🎁⚙️]+\s*/u, ""), { size: 32, bold: true }), { after: 200 });
}

function proseSection(kw, { pageBreakAfter = true } = {}) {
  const s = findSection(kw);
  if (!s) return [];
  const out = [heading(s.title), ...renderProse(s.lines)];
  if (pageBreakAfter) out.push(new Paragraph({ children: [new PageBreak()] }));
  return out;
}

// ---------------------------------------------------------------- 組檔

const children = [];

// 封面
children.push(
  P([R("")], { after: 2400 }),
  P(R("淨養—好好生活", { size: 56, bold: true }), { align: AlignmentType.CENTER, after: 160 }),
  P(R("2027 年度節氣月曆", { size: 32, color: SOFT }), { align: AlignmentType.CENTER, after: 800 }),
  P(R("十二個月文案", { size: 40, bold: true }), { align: AlignmentType.CENTER, after: 240 }),
  P(R("主節氣五感淨養 ‧ 次節氣小標 ‧ 搭售商品置入", { size: 24, color: SOFT }), { align: AlignmentType.CENTER, after: 1400 }),
  P(R(slogan, { size: 26, italics: true, color: SOFT }), { align: AlignmentType.CENTER, after: 2000 }),
  P(R(`撰稿：布蕾　｜　版本：${version}　｜　狀態：待校稿`, { size: 20, color: SOFT }), { align: AlignmentType.CENTER }),
  new Paragraph({ children: [new PageBreak()] }),
);

// 撰寫規範
children.push(...proseSection("撰寫規範"));

// 節氣總覽（由解析結果組出來）
children.push(heading("2027 節氣總覽"));
const ovHead = ["月份", "主節氣", "日期", "星期", "次節氣", "日期", "星期"];
const ovW = [10, 16, 13, 11, 16, 13, 11];
children.push(new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      tableHeader: true,
      children: ovHead.map((h, i) => cell([R(h, { bold: true, size: 21 })], { w: ovW[i], shade: "DCE6E0", align: AlignmentType.CENTER })),
    }),
    ...months.map((x, i) => {
      const shade = i % 2 === 1 ? BAND : undefined;
      const c = (t, w, color) => cell([R(t, { size: 21, color })], { w, shade, align: AlignmentType.CENTER });
      return new TableRow({
        children: [
          c(x.m, ovW[0]),
          cell([R(x.term, { size: 21, bold: true })], { w: ovW[1], shade, align: AlignmentType.CENTER }),
          c(x.date, ovW[2]), c(x.dow, ovW[3]),
          c(x.sub, ovW[4], SOFT), c(x.subDate, ovW[5], SOFT), c(x.subDow, ovW[6], SOFT),
        ],
      });
    }),
  ],
}));
children.push(
  P(R("2027 為平年（非閏年），2 月 28 天。24 個節氣星期已全數驗算通過；印刷前仍請一人對照中央氣象署公告做最後校對並簽字。", { size: 19, color: SOFT }), { before: 200 }),
  new Paragraph({ children: [new PageBreak()] }),
);

// 搭售商品置入對照
children.push(...proseSection("搭售商品置入對照表"));

// 12 個月
months.forEach((x, idx) => {
  children.push(P([
    R(`${x.m}　`, { size: 26, color: SOFT }),
    R(x.term, { size: 40, bold: true }),
    R(`　${x.date}（${x.dow}）`, { size: 24, color: SOFT }),
  ], { after: x.gift ? 80 : 140 }));

  if (x.gift) {
    children.push(P([R("搭配贈品　", { size: 20, bold: true, color: GIFT }), R(x.gift, { size: 20, color: GIFT })], { after: 140 }));
  }

  // 節氣感受（左側色條）
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDER,
    rows: [new TableRow({
      children: [new TableCell({
        children: [new Paragraph({ children: [R(x.feel, { size: 26, italics: true })], spacing: { before: 80, after: 80, line: 300 } })],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT },
        },
        shading: { type: ShadingType.CLEAR, fill: "F4F8F6" },
        margins: { top: 100, bottom: 100, left: 200, right: 160 },
      })],
    })],
  }));

  children.push(P(R("五感淨養", { size: 24, bold: true }), { before: 260, after: 120 }));
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell([R("感官", { bold: true, size: 21 })], { w: 14, shade: "DCE6E0", align: AlignmentType.CENTER }),
          cell([R("練習", { bold: true, size: 21 })], { w: 86, shade: "DCE6E0" }),
        ],
      }),
      ...x.senses.map(([k, v], i) => {
        const shade = i % 2 === 1 ? BAND : undefined;
        return new TableRow({
          children: [
            cell([R(k, { size: 22, bold: true })], { w: 14, shade, align: AlignmentType.CENTER }),
            cell([R(v, { size: 22 })], { w: 86, shade }),
          ],
        });
      }),
    ],
  }));

  children.push(P([R("身心安頓　", { size: 23, bold: true }), R(x.rest, { size: 23 })], { before: 260, after: 260 }));

  // 次節氣小字框
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDER,
    rows: [new TableRow({
      children: [new TableCell({
        children: [
          new Paragraph({ children: [R(`同月次節氣（小字）　${x.sub}　${x.subDate}（${x.subDow}）`, { size: 20, bold: true, color: SOFT })], spacing: { after: 60, line: 280 } }),
          new Paragraph({ children: [R(x.subLine, { size: 21, color: SOFT })], spacing: { after: 40, line: 280 } }),
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: cellBorders,
        margins: { top: 120, bottom: 120, left: 180, right: 160 },
      })],
    })],
  }));

  if (idx !== months.length - 1) children.push(new Paragraph({ children: [new PageBreak()] }));
});

// 收尾
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(...proseSection("合規自查"));
children.push(...proseSection("待布蕾確認", { pageBreakAfter: false }));

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 22, color: INK } } } },
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(0.9), bottom: convertInchesToTwip(0.9),
          left: convertInchesToTwip(0.95), right: convertInchesToTwip(0.95),
        },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({
            children: ["淨養—好好生活　｜　2027 節氣月曆文案　｜　", PageNumber.CURRENT],
            font: FONT, size: 18, color: SOFT,
          })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log(`✅ ${path.relative(ROOT, OUT)}　${months.length} 個月 ‧ ${months.reduce((n, x) => n + x.senses.length, 0)} 則五感 ‧ ${months.filter((x) => x.gift).length} 個月置入商品 ‧ 版本 ${version}`);
});
