/**
 * Sinh video sản phẩm từ chính ảnh thật của từng mẫu.
 * - 640x640, 25fps, không tiếng, ~18-22s, H.264 Baseline (tương thích tối đa)
 * - Ảnh chạy pan nhẹ + chuyển cảnh mềm (xfade)
 * Chạy: node make-videos.mjs [slug]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "data", "products.json");
const OUT = path.join(__dirname, "assets", "videos");
const IMG = (p) => path.join(__dirname, p);

const SHOT = 1.8;      // giây mỗi ảnh (nhanh hơn để motion rõ)
const XFADE = 0.4;     // giây chuyển cảnh
const W = 640, H = 640;
const FPS = 25;
const MAX_IMGS = 6;
const PAN = 360;      // vùng crop thừa để pan rõ hơn (px)

const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
const only = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

const targets = data.products.filter((p) => (only ? p.slug === only : true));

for (const p of targets) {
  const imgs = (p.images || []).filter((s) => fs.existsSync(IMG(s))).slice(0, MAX_IMGS);
  if (imgs.length < 2) {
    console.log("bỏ qua (thiếu ảnh):", p.slug);
    continue;
  }

  const args = ["-y", "-v", "error"];
  for (const s of imgs) args.push("-loop", "1", "-t", String(SHOT), "-i", IMG(s));

  const parts = [];
  imgs.forEach((_, i) => {
    const zoomIn = i % 2 === 0;
    const pan = zoomIn
      ? `x='(in_w-out_w)*(t/${SHOT})':y='(in_h-out_h)/2'`
      : `x='(in_w-out_w)*(1-t/${SHOT})':y='(in_h-out_h)/2'`;
    parts.push(
      `[${i}:v]scale=${W + PAN}:${H + PAN}:force_original_aspect_ratio=increase,` +
      `crop=${W + PAN}:${H + PAN},crop=${W}:${H}:${pan},` +
      `setsar=1,fps=${FPS},format=yuv420p[v${i}]`
    );
  });

  let last = "v0";
  for (let i = 1; i < imgs.length; i++) {
    const off = SHOT * i - XFADE * i;
    parts.push(`[${last}][v${i}]xfade=transition=fade:duration=${XFADE}:offset=${off.toFixed(2)}[x${i}]`);
    last = `x${i}`;
  }

  const mp4 = path.join(OUT, p.slug + ".mp4");
  const jpg = path.join(OUT, p.slug + ".jpg");
  args.push(
    "-filter_complex", parts.join(";"),
    "-map", `[${last}]`,
    "-an",
    "-c:v", "libx264", "-preset", "medium", "-crf", "34",
    "-profile:v", "baseline", "-level", "3.0", "-bf", "0",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    mp4
  );

  const t0 = Date.now();
  execFileSync("ffmpeg", args, { stdio: "inherit" });
  execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "0.6", "-i", mp4, "-frames:v", "1", "-q:v", "5", jpg], { stdio: "inherit" });

  const kb = Math.round(fs.statSync(mp4).size / 1024);
  const dur = (SHOT * imgs.length - XFADE * (imgs.length - 1)).toFixed(1);
  console.log(`✓ ${p.slug} · ${imgs.length} ảnh · ${dur}s · ${kb} KB · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
