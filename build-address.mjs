// Tải dữ liệu địa chỉ 3 cấp cũ (tỉnh / huyện / xã) và tách thành file nhỏ theo tỉnh
// Chạy: node build-address.mjs   (cần mạng lần đầu, sau đó dùng cache data/address-raw.json)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RAW = join(ROOT, "data/address-raw.json");
const API = "https://provinces.open-api.vn/api/?depth=3";

let raw;
if (existsSync(RAW)) {
  raw = JSON.parse(readFileSync(RAW, "utf8"));
  console.log("• Dùng cache data/address-raw.json");
} else {
  console.log("• Đang tải dữ liệu địa chỉ…");
  const r = await fetch(API, { headers: { "User-Agent": "Mozilla/5.0 lumstore" } });
  if (!r.ok) throw new Error("Không tải được dữ liệu địa chỉ: HTTP " + r.status);
  raw = await r.json();
  mkdirSync(join(ROOT, "data"), { recursive: true });
  writeFileSync(RAW, JSON.stringify(raw), "utf8");
}

const shorten = (name) =>
  String(name)
    .replace(/^(Thành phố|Tỉnh)\s+/i, "")
    .replace(/^(Thành phố|Tỉnh)\s+/i, "")
    .trim();

const DIR = join(ROOT, "assets/addr");
mkdirSync(DIR, { recursive: true });

const provinces = [];
let totalDistricts = 0;
let totalWards = 0;

for (const p of raw) {
  const districts = (p.districts || []).map((d) => ({
    n: d.name,
    w: (d.wards || []).map((w) => w.name)
  }));
  totalDistricts += districts.length;
  for (const d of districts) totalWards += d.w.length;

  provinces.push({ code: p.code, name: p.name, short: shorten(p.name) });
  writeFileSync(join(DIR, `${p.code}.json`), JSON.stringify(districts), "utf8");
}

provinces.sort((a, b) => a.short.localeCompare(b.short, "vi"));
writeFileSync(join(ROOT, "data/provinces.json"), JSON.stringify(provinces, null, 2), "utf8");

console.log(`✓ ${provinces.length} tỉnh · ${totalDistricts} huyện · ${totalWards} xã → assets/addr/`);
