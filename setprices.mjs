// Giá bán lẻ tẻ 250k–300k theo giá nhập, giá gốc = bán × 3 (làm tròn 10k)
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const file = join(process.cwd(), "data/products.json");
const data = JSON.parse(readFileSync(file, "utf8"));

// offerId -> giá bán
const PRICE = {
  "1049972189982": 299000, // ¥13
  "1038654325409": 295000, // ¥13
  "901158039349": 289000,  // ¥12
  "944825473040": 285000,  // ¥12
  "1048061900102": 279000, // ¥11
  "1074345975022": 269000, // ¥10
  "659042043496": 265000,  // ¥8.3
  "917243532066": 259000,  // ¥7
  "750220507665": 255000,  // ¥6
  "738680473446": 250000   // ¥3.2
};

for (const p of data.products) {
  const price = PRICE[p.offerId];
  if (!price) continue;
  p.price = price;
  p.oldPrice = Math.round((price * 3) / 10000) * 10000;
  const off = Math.round((1 - p.price / p.oldPrice) * 100);
  console.log(`${p.name.padEnd(34)} ${p.price.toLocaleString("vi-VN").padStart(10)}đ   gốc ${p.oldPrice.toLocaleString("vi-VN").padStart(10)}đ   -${off}%`);
}

writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
console.log("✓ Xong");
