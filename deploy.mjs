/**
 * Đóng gói web để đưa lên host tĩnh (Netlify / Cloudflare Pages / Vercel / Hostinger).
 *
 * Chạy: node deploy.mjs
 * Kết quả: thư mục dist/ — kéo NGUYÊN thư mục này lên host là xong.
 *
 * Chỉ copy file công khai. KHÔNG copy admin.html, server.mjs, build.mjs, data/, apps-script/.
 * Có kiểm tra: mọi video/ảnh mà web nhắc tới đều phải có trong dist, thiếu là báo lỗi ngay.
 */
import { readFileSync, mkdirSync, existsSync, rmSync, cpSync, statSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");

/* ---------- 1. Sinh HTML mới nhất từ products.json ---------- */
console.log("→ Đang sinh HTML…");
const nPages = buildSite();
console.log(`  ✓ ${nPages} trang sản phẩm`);

/* ---------- 2. Làm sạch dist ---------- */
if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

/* ---------- 3. Copy file công khai ---------- */
const FILES = ["index.html", "chinh-sach.html", "robots.txt", "sitemap.xml", ".nojekyll"];
const DIRS = ["p", "assets"];

let files = 0;
let bytes = 0;
function track(p) {
  try {
    const st = statSync(p);
    if (st.isFile()) { files++; bytes += st.size; }
  } catch {}
}
function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

for (const rel of FILES) {
  const src = join(ROOT, rel);
  if (!existsSync(src)) { console.log(`  ! thiếu ${rel} (bỏ qua)`); continue; }
  const out = join(DIST, rel);
  mkdirSync(dirname(out), { recursive: true });
  cpSync(src, out);
  track(out);
}

for (const rel of DIRS) {
  const src = join(ROOT, rel);
  if (!existsSync(src)) { console.log(`  ! thiếu thư mục ${rel}`); continue; }
  const out = join(DIST, rel);
  mkdirSync(out, { recursive: true });
  cpSync(src, out, { recursive: true });
  walk(out).forEach(track);
}

/* ---------- 4. Kiểm tra: mọi file web nhắc tới phải có trong dist ---------- */
console.log("→ Đang kiểm tra file tham chiếu…");
const data = JSON.parse(readFileSync(join(ROOT, "data/products.json"), "utf8"));
const ACTIVE = data.products.filter((p) => p.active !== false);
const missing = [];
const checked = new Set();

function need(rel, why) {
  if (!rel || checked.has(rel)) return;
  checked.add(rel);
  const clean = rel.replace(/^\.\.\//, "").replace(/^\//, "").split("?")[0];
  if (!existsSync(join(DIST, clean))) missing.push(`${clean}  ← ${why}`);
}

for (const p of ACTIVE) {
  if (p.video) {
    need(p.video, `video của "${p.slug}"`);
    need(p.videoPoster || p.images?.[0], `ảnh poster của "${p.slug}"`);
  }
  for (const im of p.images || []) need(im, `ảnh của "${p.slug}"`);
}
if (data.videos && data.videos.factory) {
  need(data.videos.factory.src, "video xưởng may");
  need(data.videos.factory.poster, "poster video xưởng may");
}

const videos = ACTIVE.filter((p) => p.video);
if (missing.length) {
  console.log("\n✗ THIẾU FILE — web sẽ không phát được:");
  missing.forEach((m) => console.log("   " + m));
} else {
  console.log(`  ✓ đủ ${checked.size} file (${videos.length}/${ACTIVE.length} sản phẩm có video)`);
}

/* ---------- 5. Báo cáo ---------- */
console.log(`\n✓ dist/ sẵn sàng · ${files} file · ${(bytes / 1024 / 1024).toFixed(1)} MB`);
console.log(`  ${DIST}`);
console.log(`\nĐưa lên host: mở https://app.netlify.com/drop rồi kéo NGUYÊN thư mục dist vào.`);
if (missing.length) process.exitCode = 1;
