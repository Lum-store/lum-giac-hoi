// Lá»¥m Store â€” static site builder
// Cháº¡y: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { makeReviews } from "./reviews.mjs";

export function buildSite() {
const ROOT = process.cwd();
// Äá»•i hash khi app.js/style.css thay Ä‘á»•i â†’ buá»™c browser táº£i báº£n má»›i, khÃ´ng dÃ­nh cache cÅ©
const ASSET_VER = createHash("sha1")
  .update(readFileSync(join(ROOT, "assets/app.js")))
  .update(readFileSync(join(ROOT, "assets/style.css")))
  .digest("hex").slice(0, 8);
// BUILD_ID Ä‘á»•i má»—i láº§n build â†’ bust cache cho áº£nh/video khi user thay file cÃ¹ng tÃªn
const BUILD_ID = Date.now().toString(36);
const data = JSON.parse(readFileSync(join(ROOT, "data/products.json"), "utf8"));
const B = data.brand;
const FACTORY = data.videos && data.videos.factory;
const PRODUCTS = data.products.filter((p) => p.active !== false);
const RV = new Map(PRODUCTS.map((p) => [p.slug, makeReviews(p)]));

/* ---------- review helpers ---------- */
const initials = (name) =>
  String(name || "KH").trim().split(/\s+/).slice(-2).map((x) => x[0] || "").join("").toUpperCase();
const starStr = (n) => "â˜…â˜…â˜…â˜…â˜…".slice(0, n);
const rvItem = (r, extra = "") => `<div class="rv-item">
        <div class="avatar">${esc(initials(r.name))}</div>
        <div class="rv-body">
          <div class="rv-head"><b>${esc(r.name)}</b>${extra}</div>
          <div class="rv-meta"><span class="rv-stars">${starStr(r.stars)}</span> Â· ${esc(r.date)}${r.place ? ` Â· ${esc(r.place)}` : ""}</div>
          <p>${esc(r.text)}</p>
        </div>
      </div>`;

/* ---------- helpers ---------- */
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const money = (n) => Number(n || 0).toLocaleString("vi-VN") + "Ä‘";
const pct = (p) => Math.max(0, Math.round((1 - p.price / (p.oldPrice || p.price)) * 100));
const slugify = (s) =>
  String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/Ä‘/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, "utf8");
}

/* ---------- placeholder images ---------- */
function ensurePlaceholder(p) {
  if (!Array.isArray(p.images) || !p.images.length) p.images = [`assets/img/${p.slug}/1.svg`];
  const dir = join(ROOT, "assets/img", p.slug);
  mkdirSync(dir, { recursive: true });
  p.images.forEach((rel, i) => {
    const abs = join(ROOT, rel);
    if (existsSync(abs)) return;
    mkdirSync(dirname(abs), { recursive: true });
    const label = esc(p.name).slice(0, 40);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1ea"/><stop offset="1" stop-color="#ffe0d1"/></linearGradient></defs>
<rect width="800" height="800" fill="url(#g)"/>
<circle cx="400" cy="330" r="120" fill="#ffd9c7"/>
<text x="400" y="520" font-family="Segoe UI, sans-serif" font-size="34" font-weight="700" fill="#c4451c" text-anchor="middle">${label}</text>
<text x="400" y="570" font-family="Segoe UI, sans-serif" font-size="22" fill="#e08a68" text-anchor="middle">áº¢nh ${i + 1} Â· thay báº±ng áº£nh tháº­t</text>
</svg>`;
    writeFileSync(abs, svg, "utf8");
  });
}
PRODUCTS.forEach(ensurePlaceholder);

/* ---------- shared partials ---------- */
function head({ title, desc, image, base, extra = "" }) {
  return `<!doctype html>
<html lang="vi" data-base="${base}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#ff4d1c">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(B.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${image ? `<meta property="og:image" content="${esc(image)}">` : ""}
<meta name="format-detection" content="telephone=no">
<meta name="x-build" content="${ASSET_VER}">
<meta http-equiv="Cache-Control" content="no-store">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}/assets/style.css?v=${ASSET_VER}">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="26" fill="#ff4d1c"/><text x="50" y="70" font-size="58" font-family="Arial" font-weight="bold" fill="#fff" text-anchor="middle">L</text></svg>'
  )}">
<script>
window.LUM_CONFIG = ${JSON.stringify({ brand: B.name, phone: B.phone, sheetEndpoint: B.sheetEndpoint || "", shop: B.shop || "" })};
${B.fbPixel ? `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${esc(B.fbPixel)}');fbq('track','PageView');` : ""}
</script>
${extra}
</head>`;
}

function header(base) {
  return `<div class="topbar">Freeship toÃ n quá»‘c Ä‘Æ¡n tá»« <b>179K</b> Â· Kiá»ƒm hÃ ng trÆ°á»›c khi thanh toÃ¡n Â· Äá»•i tráº£ 7 ngÃ y</div>
<header class="header">
  <div class="container header-in">
    <a class="logo" href="${base}/index.html">
      <span class="logo-mark">L</span>
      <span>${esc(B.name)}<small>${esc(B.tagline)}</small></span>
    </a>
    <nav class="header-nav">
      <a href="${base}/index.html">Trang chá»§</a>
      <a href="${base}/index.html#san-pham">Sáº£n pháº©m</a>
      <a href="${base}/chinh-sach.html">ChÃ­nh sÃ¡ch</a>
      <a href="${base}/index.html#faq">Há»i Ä‘Ã¡p</a>
    </nav>
    <div class="header-actions">
      <a class="call-btn" href="tel:${B.phone}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
        ${esc(B.phoneDisplay)}
      </a>
    </div>
  </div>
</header>`;
}

function footer(base) {
  return `<footer class="footer">
  <div class="container footer-grid">
    <div>
      <div class="logo" style="margin-bottom:10px">
        <span class="logo-mark">L</span>
        <span>${esc(B.name)}<small>${esc(B.tagline)}</small></span>
      </div>
      <p>ChuyÃªn hÃ ng tiÃªu dÃ¹ng chá»n lá»c, giÃ¡ táº­n gá»‘c. Giao toÃ n quá»‘c, thanh toÃ¡n khi nháº­n hÃ ng.</p>
      <p>Hotline / Zalo: <a href="tel:${B.phone}"><b style="color:#fff">${esc(B.phoneDisplay)}</b></a></p>
      <p>${esc(B.address)}</p>
    </div>
    <div>
      <h4>ChÃ­nh sÃ¡ch</h4>
      <div class="footer-links">
        <a href="${base}/chinh-sach.html#doi-tra">Äá»•i tráº£ 7 ngÃ y</a>
        <a href="${base}/chinh-sach.html#van-chuyen">Váº­n chuyá»ƒn</a>
        <a href="${base}/chinh-sach.html#bao-mat">Báº£o máº­t thÃ´ng tin</a>
        <a href="${base}/chinh-sach.html#thanh-toan">Thanh toÃ¡n</a>
      </div>
    </div>
    <div>
      <h4>LiÃªn há»‡</h4>
      <div class="footer-links">
        <a href="${B.zalo}" target="_blank" rel="noopener">Zalo: ${esc(B.phoneDisplay)}</a>
        <a href="${B.messenger}" target="_blank" rel="noopener">Messenger</a>
        <a href="mailto:${B.email}">${esc(B.email)}</a>
      </div>
      <p style="margin-top:10px">Thá»i gian há»— trá»£: 8:00 â€“ 21:00 háº±ng ngÃ y</p>
    </div>
  </div>
  <div class="container footer-bottom">
    Â© ${new Date().getFullYear()} ${esc(B.name)}. GiÃ¡ Ä‘Ã£ bao gá»“m VAT. HÃ¬nh áº£nh mang tÃ­nh minh hoáº¡.
  </div>
</footer>`;
}

const stars = (n = 5) => "â˜…â˜…â˜…â˜…â˜…".slice(0, n);

/* 63 tá»‰nh / thÃ nh phá»‘ (Ä‘á»‹a chá»‰ 3 cáº¥p cÅ©: xÃ£ â€“ huyá»‡n â€“ tá»‰nh) */
const PROVINCES = JSON.parse(readFileSync(join(ROOT, "data/provinces.json"), "utf8"));

/* ---------- home ---------- */
function card(p) {
  const img = p.images[0];
  return `<a class="card" href="p/${p.slug}.html">
    <div class="card-media">
      <img src="${img}?v=${BUILD_ID}" alt="${esc(p.name)}" loading="lazy" width="400" height="400">
      ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : pct(p) > 0 ? `<span class="badge">-${pct(p)}%</span>` : ""}
    </div>
    <div class="card-body">
      <h3 class="card-title">${esc(p.name)}</h3>
      <div class="card-price">
        <span class="price">${money(p.price)}</span>
        ${p.oldPrice > p.price ? `<span class="price-old">${money(p.oldPrice)}</span>` : ""}
      </div>
      <div class="card-meta">
        <span>${stars(5)}</span><span class="dot"></span><span>ÄÃ£ bÃ¡n ${Number(p.sold || 0).toLocaleString("vi-VN")}</span>
      </div>
      <span class="card-cta">Xem &amp; Ä‘áº·t hÃ ng</span>
    </div>
  </a>`;
}

function homePage() {
  const base = ".";
  const list = PRODUCTS.map(card).join("\n");
  const homeRv = PRODUCTS.slice(0, 3).map((p) => {
    const r = (RV.get(p.slug).reviews.find((x) => x.stars === 5)) || RV.get(p.slug).reviews[0];
    return `<div class="review">
        <div class="review-top"><div class="avatar">${esc(initials(r.name))}</div><div><b>${esc(r.name)}</b><div class="stars">${starStr(r.stars)}</div></div></div>
        <p>â€œ${esc(r.text)}â€</p>
        <div class="review-sp"><a href="p/${p.slug}.html">${esc(p.name)}</a> Â· ${esc(r.date)}</div>
      </div>`;
  }).join("\n      ");
  return `${head({
    title: `${B.name} â€“ ${B.tagline}`,
    desc: B.desc || "Sáº£n pháº©m chá»n lá»c giÃ¡ táº­n gá»‘c. Giao toÃ n quá»‘c, kiá»ƒm hÃ ng trÆ°á»›c khi thanh toÃ¡n, Ä‘á»•i tráº£ 7 ngÃ y.",
    image: PRODUCTS[0] ? PRODUCTS[0].images[0] : "",
    base
  })}
<body data-product-id="home">
${header(base)}
<section class="hero">
  <div class="container hero-in">
    <span class="eyebrow">${esc(B.heroEyebrow || "ðŸ”¥ Má»›i vá» má»—i tuáº§n")}</span>
    <h1>${B.heroTitle || "Sáº£n pháº©m cháº¥t lÆ°á»£ng,<br><em>giÃ¡ táº­n gá»‘c</em>"}</h1>
    <p>${esc(B.heroDesc || "Tuyá»ƒn chá»n nhá»¯ng sáº£n pháº©m Ä‘ang Ä‘Æ°á»£c sÄƒn nhiá»u nháº¥t. GiÃ¡ Ä‘Ã£ gá»“m ship, Ä‘Æ°á»£c kiá»ƒm hÃ ng trÆ°á»›c khi tráº£ tiá»n.")}</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="#san-pham">${esc(B.heroCta || "Xem sáº£n pháº©m â†“")}</a>
      <a class="btn btn-ghost" href="tel:${B.phone}">Gá»i tÆ° váº¥n</a>
    </div>
    <div class="hero-trust">
      <span class="chip"><i>âœ“</i> Thanh toÃ¡n khi nháº­n hÃ ng</span>
      <span class="chip"><i>âœ“</i> Äá»•i tráº£ trong 7 ngÃ y</span>
      <span class="chip"><i>âœ“</i> Giao 2â€“4 ngÃ y</span>
      <span class="chip"><i>âœ“</i> Hotline 8hâ€“21h</span>
    </div>
  </div>
</section>

<section class="section" id="san-pham">
  <div class="container">
    <div class="section-head">
      <div>
        <h2>${esc(B.sectionTitle || "Sáº£n pháº©m Ä‘ang bÃ¡n")}</h2>
        <p>${esc(B.sectionDesc || "Báº¥m vÃ o sáº£n pháº©m Ä‘á»ƒ xem chi tiáº¿t vÃ  Ä‘áº·t hÃ ng")}</p>
      </div>
    </div>
    <div class="grid">
${list}
    </div>
  </div>
</section>

<section class="section benefits">
  <div class="container">
    <div class="section-head"><div><h2>Mua á»Ÿ ${esc(B.name)} cÃ³ gÃ¬ khÃ¡c?</h2></div></div>
    <div class="benefit-grid">
      <div class="benefit"><div class="benefit-ico">ðŸšš</div><div><b>Ship toÃ n quá»‘c</b><span>Ná»™i thÃ nh 1â€“2 ngÃ y, tá»‰nh 2â€“4 ngÃ y</span></div></div>
      <div class="benefit"><div class="benefit-ico">ðŸ’µ</div><div><b>COD 100%</b><span>Nháº­n hÃ ng, kiá»ƒm tra rá»“i má»›i tráº£ tiá»n</span></div></div>
      <div class="benefit"><div class="benefit-ico">ðŸ”„</div><div><b>Äá»•i tráº£ 7 ngÃ y</b><span>Lá»—i do shop, Ä‘á»•i má»›i miá»…n phÃ­</span></div></div>
      <div class="benefit"><div class="benefit-ico">â˜Žï¸</div><div><b>Há»— trá»£ tháº­t</b><span>Gá»i/Zalo ${esc(B.phoneDisplay)} lÃ  cÃ³ ngÆ°á»i nghe</span></div></div>
    </div>
  </div>
</section>

<section class="section${FACTORY ? "" : " hidden"}" id="xuong-may"${FACTORY ? "" : " hidden"}>
  <div class="container">
    <div class="section-head"><div><h2>XÆ°á»Ÿng may tháº­t, quay táº¡i xÆ°á»Ÿng</h2><p>HÃ ng lÃ m táº¡i xÆ°á»Ÿng, khÃ´ng qua trung gian â€” nÃªn giÃ¡ má»›i ráº» Ä‘Æ°á»£c nhÆ° váº­y</p></div><a href="#san-pham">Xem sáº£n pháº©m</a></div>
    ${FACTORY ? `<div class="factory-video" id="factoryVideoWrap">
      <video id="factoryVideo" poster="${base}/${FACTORY.poster}?v=${BUILD_ID}" data-src="${base}/${FACTORY.src}?v=${BUILD_ID}" preload="none" playsinline webkit-playsinline x5-playsinline="true" x5-video-player-type="h5" muted></video>
      <button class="video-cover" id="factoryPlay" type="button" aria-label="Xem video xÆ°á»Ÿng may">
        <span class="video-cover-ico">â–¶</span>
        <span class="video-cover-tx">Xem video xÆ°á»Ÿng may</span>
        <span class="video-cover-sub">Video 24 giÃ¢y Â· quay táº¡i xÆ°á»Ÿng</span>
      </button>
    </div>` : ""}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><div><h2>KhÃ¡ch Ä‘Ã£ mua nÃ³i gÃ¬</h2><p>ÄÃ¡nh giÃ¡ tá»« khÃ¡ch Ä‘Ã£ nháº­n hÃ ng</p></div><a href="#san-pham">Xem sáº£n pháº©m</a></div>
    <div class="review-grid">
      ${homeRv}
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="container">
    <div class="section-head"><div><h2>CÃ¢u há»i thÆ°á»ng gáº·p</h2></div></div>
    <div class="faq">
      <details open><summary>TÃ´i cÃ³ Ä‘Æ°á»£c kiá»ƒm hÃ ng trÆ°á»›c khi thanh toÃ¡n khÃ´ng?</summary><p>CÃ³. Báº¡n Ä‘Æ°á»£c má»Ÿ kiá»ƒm tra sáº£n pháº©m cÃ¹ng nhÃ¢n viÃªn giao hÃ ng trÆ°á»›c khi tráº£ tiá»n.</p></details>
      <details><summary>Bao lÃ¢u thÃ¬ nháº­n Ä‘Æ°á»£c hÃ ng?</summary><p>Ná»™i thÃ nh HÃ  Ná»™i/TP.HCM: 1â€“2 ngÃ y. CÃ¡c tá»‰nh khÃ¡c: 2â€“4 ngÃ y lÃ m viá»‡c.</p></details>
      <details><summary>PhÃ­ ship bao nhiÃªu?</summary><p>Miá»…n phÃ­ ship cho Ä‘Æ¡n tá»« 299.000Ä‘. ÄÆ¡n nhá» hÆ¡n phÃ­ ship 25.000Ä‘ toÃ n quá»‘c.</p></details>
      <details><summary>HÃ ng lá»—i thÃ¬ sao?</summary><p>Báº¡n chá»¥p áº£nh gá»­i Zalo ${esc(B.phoneDisplay)} trong 7 ngÃ y, shop Ä‘á»•i má»›i hoáº·c hoÃ n tiá»n.</p></details>
      <details><summary>Äáº·t hÃ ng báº±ng cÃ¡ch nÃ o?</summary><p>Chá»n sáº£n pháº©m â†’ Ä‘iá»n tÃªn, sá»‘ Ä‘iá»‡n thoáº¡i, Ä‘á»‹a chá»‰ â†’ báº¥m â€œÄáº·t hÃ ngâ€. Shop gá»i xÃ¡c nháº­n trong 15 phÃºt.</p></details>
    </div>
  </div>
</section>
${footer(base)}
<script src="${base}/assets/app.js?v=${ASSET_VER}"></script>
</body>
</html>`;
}

/* ---------- product page ---------- */
function productPage(p, index) {
  const base = "..";
  const rv = RV.get(p.slug);
  const rvFirst = 8;
  const hasVideo = !!p.video;
  const vPoster = p.videoPoster || p.images[0];
  const thumbs = (hasVideo ? `
      <button class="thumb thumb-video is-active" data-video="${base}/${p.video}?v=${BUILD_ID}" data-poster="${base}/${vPoster}?v=${BUILD_ID}" aria-label="Video sáº£n pháº©m"><img src="${base}/${vPoster}?v=${BUILD_ID}" alt="${esc(p.name)} - video" loading="lazy"><span class="thumb-play">â–¶</span></button>` : "")
    + p.images.map((src, i) => `
      <button class="thumb${!hasVideo && i === 0 ? " is-active" : ""}" data-idx="${i}" data-src="${base}/${src}?v=${BUILD_ID}" aria-label="áº¢nh ${i + 1}"><img src="${base}/${src}?v=${BUILD_ID}" alt="${esc(p.name)} - áº£nh ${i + 1}" loading="lazy"></button>`).join("");
  const normOpt = (o) => {
    if (typeof o === "string") o = { value: o };
    const price = (o.price != null && o.price !== "") ? Number(o.price) : p.price;
    const oldPrice = (o.oldPrice != null && o.oldPrice !== "") ? Number(o.oldPrice) : (p.oldPrice || 0);
    const count = (o.count != null && o.count !== "") ? Number(o.count) : 1;
    const shipping = (o.shipping != null && o.shipping !== "") ? Number(o.shipping) : 0;
    return { value: String(o.value || o.name || o.label || "").trim(), price, oldPrice, count, shipping };
  };
  const normGroups = (p.variants || []).map((g) => ({
    name: g.name || "PhÃ¢n loáº¡i",
    options: (g.options || []).map(normOpt).filter((o) => o.value)
  })).filter((g) => g.options.length);
  const firstPrice = normGroups.length && normGroups[0].options.length ? normGroups[0].options[0].price : p.price;
  const firstOldPrice = normGroups.length && normGroups[0].options.length ? normGroups[0].options[0].oldPrice : (p.oldPrice || 0);
  const firstShipping = normGroups.length && normGroups[0].options.length ? normGroups[0].options[0].shipping : 0;
  const variantHtml = normGroups.map((g) => `
      <div class="opt-group">
        <label class="opt-label">${esc(g.name)}: <span data-selected="${esc(g.name)}">${esc(g.options[0].value)}</span></label>
        <div class="chips" data-group="${esc(g.name)}">
          ${g.options.map((o, i) => `<button type="button" class="opt${i === 0 ? " is-active" : ""}" data-value="${esc(o.value)}" data-price="${o.price}" data-oldprice="${o.oldPrice}" data-shipping="${o.shipping}" data-count="${o.count}">${esc(o.value)}${o.price !== firstPrice ? ` Â· ${money(o.price)}` : ""}</button>`).join("")}
        </div>
      </div>`).join("");

  const specs = (p.specs || []).length
    ? `<table class="spec-table">${p.specs.map((s) => `<tr><td>${esc(s.k)}</td><td>${esc(s.v)}</td></tr>`).join("")}</table>`
    : "";

  const related = PRODUCTS.filter((x) => x.slug !== p.slug).slice(0, 4).map((x) => `
      <a class="card" href="../${x.slug}/">
        <div class="card-media"><img src="${base}/${x.images[0]}?v=${BUILD_ID}" alt="${esc(x.name)}" loading="lazy"></div>
        <div class="card-body"><h3 class="card-title">${esc(x.name)}</h3>
        <div class="card-price"><span class="price">${money(x.price)}</span></div></div>
      </a>`).join("");

  return `${head({
    title: `${p.name} â€“ ${money(firstPrice + firstShipping)} | ${B.name}`,
    desc: (p.subtitle || p.name) + " Giao toÃ n quá»‘c, kiá»ƒm hÃ ng trÆ°á»›c khi thanh toÃ¡n, Ä‘á»•i tráº£ 7 ngÃ y.",
    image: p.images[0],
    base
  })}
<body data-product-id="${esc(p.offerId || p.slug)}">
${header(base)}
<div class="container breadcrumb"><a href="${base}/index.html">Trang chá»§</a> / <a href="${base}/index.html#san-pham">Sáº£n pháº©m</a> / <span>${esc(p.name)}</span></div>

<div class="container pdp">
  <div class="pdp-gallery">
    <div class="gallery-main" id="galleryMain">
      <img id="galleryImg" src="${base}/${p.images[0]}?v=${BUILD_ID}" alt="${esc(p.name)}" width="800" height="800"${hasVideo ? " hidden" : ""}>
      ${hasVideo ? `<video id="galleryVideo" class="gallery-video" src="${base}/${p.video}?v=${BUILD_ID}" poster="${base}/${vPoster}?v=${BUILD_ID}" autoplay muted controls playsinline webkit-playsinline x5-playsinline="true" x5-video-player-type="h5"></video>
      <button class="gallery-play" id="galleryPlay" type="button" aria-label="Xem video sáº£n pháº©m" hidden><span class="gallery-play-ico">â–¶</span><span class="gallery-play-tx">Xem video sáº£n pháº©m</span></button>
      <span class="gallery-progress" id="galleryProgress" hidden><i></i></span>` : ""}
      ${p.images.length > 1 ? `<span class="gallery-count" id="galleryCount">${hasVideo ? "Video" : "1/" + p.images.length}</span>` : ""}
    </div>
    <div class="gallery-thumbs">${thumbs}</div>
  </div>

  <div class="pdp-info">
    ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
    <h1>${esc(p.name)}</h1>
    <p class="pdp-sub">${esc(p.subtitle || "")}</p>
    <div class="pdp-rating"><span class="stars">${starStr(Math.round(rv.rating))}</span> <b>${rv.rating.toFixed(1).replace(".", ",")}/5</b> <span>Â·</span> <a href="#danh-gia">${rv.total.toLocaleString("vi-VN")} lÆ°á»£t Ä‘Ã¡nh giÃ¡</a> <span>Â·</span> <span>${Number(p.sold || 0).toLocaleString("vi-VN")} Ä‘Ã£ bÃ¡n</span></div>

    <div class="price-box">
      <div class="row">
        <span class="price">${money(firstPrice)}</span>
        ${firstOldPrice > firstPrice ? `<span class="price-old">${money(firstOldPrice)}</span>` : ""}
        ${firstOldPrice > firstPrice ? `<span class="save">Tiáº¿t kiá»‡m ${Math.max(0, Math.round((1 - firstPrice / firstOldPrice) * 100))}%</span>` : ""}
      </div>
      <div class="note">${esc(p.shippingNote || "Gia da gom VAT . Mien phi ship don tu 179K")}</div>
    </div>

    ${variantHtml}

    <input id="qtyInput" type="hidden" value="1" min="1" max="99" data-unit="${firstPrice}" data-shipping="${firstShipping}" aria-label="Số lượng">

    <div class="form-total"><span>Táº¡m tÃ­nh (COD)</span><b id="formTotal">${money(firstPrice + firstShipping)}</b></div>

    <div class="pdp-buy">
      <a class="btn btn-primary" href="#orderForm">Äáº·t hÃ ng ngay</a>
    </div>
    <div class="micro"><span><i>âœ“</i> Thanh toÃ¡n khi nháº­n</span><span><i>âœ“</i> Äá»•i tráº£ 7 ngÃ y</span><span><i>âœ“</i> Giao 2â€“4 ngÃ y</span></div>

    <div class="order-card" id="orderFormWrap">
      <h3>Äáº·t hÃ ng nhanh</h3>
      <p class="hint">Äiá»n thÃ´ng tin, shop gá»i xÃ¡c nháº­n trong 15 phÃºt.</p>
      <form id="orderForm" data-product="${esc(p.name)}" novalidate>
        <div class="field">
          <label for="fName">Há» vÃ  tÃªn <span>*</span></label>
          <input id="fName" name="name" type="text" placeholder="VD: Nguyá»…n Thá»‹ Lan" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="fPhone">Sá»‘ Ä‘iá»‡n thoáº¡i <span>*</span></label>
          <input id="fPhone" name="phone" type="tel" inputmode="numeric" placeholder="VD: 0982467019" autocomplete="tel" required>
        </div>
        <div class="field">
          <label for="fStreet">Sá»‘ nhÃ , tÃªn Ä‘Æ°á»ng <span>*</span></label>
          <input id="fStreet" name="street" type="text" placeholder="VD: 12 Nguyá»…n VÄƒn Linh" autocomplete="address-line1" required>
        </div>
        <div class="field">
          <label for="fProvince">Tá»‰nh / ThÃ nh phá»‘ <span>*</span></label>
          <select id="fProvince" name="province" autocomplete="address-level1" required>
            <option value="">â€” Chá»n tá»‰nh / thÃ nh phá»‘ â€”</option>
            ${PROVINCES.map((x) => `<option value="${x.code}" data-name="${esc(x.short)}">${esc(x.short)}</option>`).join("")}
          </select>
        </div>
        <div class="field-2">
          <div class="field">
            <label for="fDistrict">Quáº­n / Huyá»‡n <span>*</span></label>
            <select id="fDistrict" name="district" autocomplete="address-level2" required disabled>
              <option value="">â€” Chá»n quáº­n / huyá»‡n â€”</option>
            </select>
          </div>
          <div class="field">
            <label for="fWard">XÃ£ / PhÆ°á»ng <span>*</span></label>
            <select id="fWard" name="ward" autocomplete="address-line2" required disabled>
              <option value="">â€” Chá»n xÃ£ / phÆ°á»ng â€”</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="fNote">Ghi chÃº (khÃ´ng báº¯t buá»™c)</label>
          <textarea id="fNote" name="note" placeholder="MÃ u sáº¯c / size / giá» giao hÃ ngâ€¦"></textarea>
        </div>
        <div class="form-total"><span>Táº¡m tÃ­nh (COD)</span><b id="formTotal">${money(p.price)}</b></div>
        <button class="btn btn-primary btn-block" type="submit" id="submitBtn">Äáº¶T HÃ€NG â€“ Thanh toÃ¡n khi nháº­n</button>
        <p class="form-err" id="formErr"></p>
        <p class="form-note">Báº±ng viá»‡c Ä‘áº·t hÃ ng, báº¡n Ä‘á»“ng Ã½ vá»›i chÃ­nh sÃ¡ch Ä‘á»•i tráº£ &amp; báº£o máº­t cá»§a shop.</p>
      </form>
    </div>
  </div>
</div>

<div class="container">
  <div class="panel">
    <h3>MÃ´ táº£ sáº£n pháº©m</h3>
    <div class="prose">${p.description || "<p>Äang cáº­p nháº­t.</p>"}</div>
    ${specs ? `<h3 style="margin-top:18px">ThÃ´ng sá»‘</h3>${specs}` : ""}
    ${p.images.length > 1 ? `<h3 style="margin-top:22px">Album áº£nh (${p.images.length})</h3>
    <div class="album">${p.images.map((src, i) => `<button class="album-item" type="button" data-idx="${i}"><img src="${base}/${src}?v=${BUILD_ID}" alt="${esc(p.name)} ${i + 1}" loading="lazy"></button>`).join("")}</div>` : ""}
  </div>

  <div class="panel" id="danh-gia">
    <h3>ÄÃ¡nh giÃ¡ tá»« khÃ¡ch hÃ ng</h3>
    <div class="rv-summary">
      <div class="rv-score">
        <b>${rv.rating.toFixed(1).replace(".", ",")}</b>
        <span class="rv-stars">${starStr(Math.round(rv.rating))}</span>
        <small>${rv.total.toLocaleString("vi-VN")} lÆ°á»£t Ä‘Ã¡nh giÃ¡</small>
      </div>
      <div class="rv-bars">
        ${[5, 4, 3, 2, 1].map((s, i) => `<button type="button" class="rv-bar" data-star="${s}" aria-label="Xem Ä‘Ã¡nh giÃ¡ ${s} sao"><span>${s}â˜…</span><div class="rv-track"><i style="width:${Math.round((rv.dist[i] / rv.total) * 100)}%"></i></div><b>${rv.dist[i].toLocaleString("vi-VN")}</b></button>`).join("")}
      </div>
    </div>

    <div class="rv-list" id="rvList" data-slug="${esc(p.slug)}" data-total="${rv.total}" data-count="${rv.reviews.length}" data-shown="${rvFirst}">
      ${rv.reviews.slice(0, rvFirst).map((r) => rvItem(r)).join("")}
    </div>
    <button type="button" class="rv-more" id="rvMore">Xem thÃªm Ä‘Ã¡nh giÃ¡</button>
    <p class="rv-note" id="rvNote">Äang hiá»ƒn thá»‹ ${rvFirst} bÃ¬nh luáº­n má»›i nháº¥t Â· tá»•ng ${rv.total.toLocaleString("vi-VN")} lÆ°á»£t Ä‘Ã¡nh giÃ¡</p>
    <p class="rv-reason" id="rvReason" hidden></p>
    <button type="button" class="rv-reset" id="rvReset" hidden>â† Xem táº¥t cáº£ Ä‘Ã¡nh giÃ¡</button>

    <h3 class="rv-form-title">Viáº¿t Ä‘Ã¡nh giÃ¡ cá»§a báº¡n</h3>
    <form class="rv-form" id="rvForm">
      <div class="rv-form-row">
        <input id="rvName" type="text" placeholder="TÃªn cá»§a báº¡n" autocomplete="name" required>
        <div class="rv-pick" id="rvPick" role="group" aria-label="Chá»n sá»‘ sao">
          ${[5, 4, 3, 2, 1].map((n) => `<button type="button" class="rv-star is-on" data-star="${n}" aria-label="${n} sao">â˜…</button>`).join("")}
        </div>
      </div>
      <textarea id="rvText" rows="3" placeholder="Chia sáº» cáº£m nháº­n vá» sáº£n pháº©mâ€¦" required></textarea>
      <button class="btn btn-primary btn-block" type="submit">Gá»­i Ä‘Ã¡nh giÃ¡</button>
    </form>
    <script type="application/json" id="rvData">${JSON.stringify(rv.reviews).replace(/</g, "\\u003c")}</script>
  </div>

  <div class="panel">
    <h3>ChÃ­nh sÃ¡ch mua hÃ ng</h3>
    <div class="prose">
      <ul>
        <li><b>Thanh toÃ¡n:</b> COD â€“ nháº­n hÃ ng, kiá»ƒm tra rá»“i má»›i tráº£ tiá»n.</li>
        <li><b>Váº­n chuyá»ƒn:</b> 1â€“2 ngÃ y ná»™i thÃ nh, 2â€“4 ngÃ y cÃ¡c tá»‰nh. Freeship Ä‘Æ¡n tá»« 299K.</li>
        <li><b>Äá»•i tráº£:</b> 7 ngÃ y náº¿u lá»—i nhÃ  sáº£n xuáº¥t hoáº·c khÃ´ng Ä‘Ãºng mÃ´ táº£.</li>
        <li><b>Há»— trá»£:</b> Gá»i/Zalo <a href="tel:${B.phone}">${esc(B.phoneDisplay)}</a> (8hâ€“21h).</li>
      </ul>
    </div>
  </div>

  <div class="section" style="padding-bottom:0">
    <div class="section-head"><div><h2>Sáº£n pháº©m khÃ¡c</h2></div><a href="${base}#san-pham">Xem táº¥t cáº£</a></div>
    <div class="grid">${related}</div>
  </div>
</div>

<div class="sticky-buy" id="stickyBuy">
  <div class="sb-price">Tạm tÃ­nh<b id="sbPrice">${money(firstPrice + firstShipping)}</b></div>
  <button class="btn btn-primary" id="sbBtn" type="button">Äáº·t hÃ ng</button>
</div>

<div class="modal" id="successModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-card">
    <div class="modal-ico">âœ“</div>
    <h3 id="modalTitle">Äáº·t hÃ ng thÃ nh cÃ´ng!</h3>
    <p>Cáº£m Æ¡n báº¡n. Shop sáº½ gá»i xÃ¡c nháº­n trong <b>15 phÃºt</b>.</p>
    <div class="modal-code" id="modalCode">MÃ£ Ä‘Æ¡n: â€”</div>
    <p id="modalTotal"></p>
    <a class="btn btn-primary btn-block" href="tel:${B.phone}">Gá»i ${esc(B.phoneDisplay)}</a>
    <button class="btn btn-ghost btn-block" type="button" data-close-modal>Tiáº¿p tá»¥c xem</button>
  </div>
</div>

${footer(base)}
<script src="${base}/assets/app.js?v=${ASSET_VER}"></script>
</body>
</html>`;
}

/* ---------- policy page ---------- */
function policyPage() {
  const base = ".";
  return `${head({
    title: `ChÃ­nh sÃ¡ch mua hÃ ng | ${B.name}`,
    desc: "ChÃ­nh sÃ¡ch Ä‘á»•i tráº£, váº­n chuyá»ƒn, thanh toÃ¡n vÃ  báº£o máº­t thÃ´ng tin táº¡i " + B.name,
    base
  })}
<body data-product-id="policy">
${header(base)}
<div class="container" style="padding-top:18px;max-width:820px">
  <h1 style="font-size:26px;letter-spacing:-.03em;margin:8px 0 4px">ChÃ­nh sÃ¡ch mua hÃ ng</h1>
  <p style="color:#6b7280;font-size:13.5px;margin:0 0 18px">Ãp dá»¥ng cho má»i Ä‘Æ¡n hÃ ng táº¡i ${esc(B.name)}</p>

  <div class="panel" id="doi-tra"><h3>1. Äá»•i tráº£ trong 7 ngÃ y</h3><div class="prose">
    <p>Sáº£n pháº©m Ä‘Æ°á»£c Ä‘á»•i má»›i hoáº·c hoÃ n tiá»n trong 7 ngÃ y ká»ƒ tá»« khi nháº­n hÃ ng náº¿u: lá»—i do nhÃ  sáº£n xuáº¥t, giao sai máº«u/size, sáº£n pháº©m khÃ´ng Ä‘Ãºng mÃ´ táº£.</p>
    <p>Sáº£n pháº©m cÃ²n nguyÃªn tem, chÆ°a qua sá»­ dá»¥ng. Vui lÃ²ng gá»­i áº£nh/video qua Zalo <a href="tel:${B.phone}">${esc(B.phoneDisplay)}</a> Ä‘á»ƒ Ä‘Æ°á»£c xá»­ lÃ½ nhanh.</p>
  </div></div>

  <div class="panel" id="van-chuyen"><h3>2. Váº­n chuyá»ƒn</h3><div class="prose">
    <p>Ná»™i thÃ nh HÃ  Ná»™i &amp; TP.HCM: 1â€“2 ngÃ y. CÃ¡c tá»‰nh khÃ¡c: 2â€“4 ngÃ y lÃ m viá»‡c.</p>
    <p>PhÃ­ ship 25.000Ä‘, miá»…n phÃ­ cho Ä‘Æ¡n tá»« 299.000Ä‘. ÄÆ¡n Ä‘Æ°á»£c kiá»ƒm tra trÆ°á»›c khi thanh toÃ¡n.</p>
  </div></div>

  <div class="panel" id="thanh-toan"><h3>3. Thanh toÃ¡n</h3><div class="prose">
    <p>HÃ¬nh thá»©c chÃ­nh: COD â€“ thanh toÃ¡n tiá»n máº·t cho nhÃ¢n viÃªn giao hÃ ng sau khi kiá»ƒm tra sáº£n pháº©m.</p>
    <p>Vá»›i Ä‘Æ¡n giÃ¡ trá»‹ lá»›n, shop cÃ³ thá»ƒ liÃªn há»‡ Ä‘á»ƒ thá»‘ng nháº¥t chuyá»ƒn khoáº£n trÆ°á»›c.</p>
  </div></div>

  <div class="panel" id="bao-mat"><h3>4. Báº£o máº­t thÃ´ng tin</h3><div class="prose">
    <p>ThÃ´ng tin báº¡n cung cáº¥p (tÃªn, sá»‘ Ä‘iá»‡n thoáº¡i, Ä‘á»‹a chá»‰) chá»‰ dÃ¹ng Ä‘á»ƒ xá»­ lÃ½ vÃ  giao Ä‘Æ¡n hÃ ng, khÃ´ng chia sáº» cho bÃªn thá»© ba ngoÃ i Ä‘Æ¡n vá»‹ váº­n chuyá»ƒn.</p>
    <p>Báº¡n cÃ³ thá»ƒ yÃªu cáº§u xoÃ¡ dá»¯ liá»‡u báº¥t ká»³ lÃºc nÃ o báº±ng cÃ¡ch gá»i hotline.</p>
  </div></div>

  <p style="font-size:13px;color:#6b7280;margin:18px 0 30px">Cáº§n há»— trá»£? Gá»i/Zalo <a href="tel:${B.phone}" style="color:#ff4d1c;font-weight:700">${esc(B.phoneDisplay)}</a> Â· ${esc(B.email)}</p>
</div>
${footer(base)}
<script src="${base}/assets/app.js?v=${ASSET_VER}"></script>
</body>
</html>`;
}

/* ---------- write ---------- */
write("index.html", homePage());
PRODUCTS.forEach((p, i) => write(`p/${p.slug}.html`, productPage(p, i)));
write("chinh-sach.html", policyPage());

const urls = ["index.html", "chinh-sach.html", ...PRODUCTS.map((p) => `p/${p.slug}.html`)];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`);
write("robots.txt", "User-agent: *\nAllow: /\n");
write(".nojekyll", "");

return PRODUCTS.length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const n = buildSite();
  console.log(`âœ“ Build xong: ${n} trang sáº£n pháº©m`);
}



