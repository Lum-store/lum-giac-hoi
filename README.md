# Lụm Store — web bán hàng 1 trang + 10 trang sản phẩm

Web tĩnh (HTML/CSS/JS), không cần database, không cần thuê host xịn. Sửa giá/ảnh/mô tả bằng trang quản trị, bấm Lưu là web tự cập nhật.

## Chạy web

```bash
cd D:\1688-shop
node server.mjs
```

- Web: http://localhost:5173
- Quản trị: http://localhost:5173/admin.html ← **sửa mọi thứ ở đây**

(Đóng cửa sổ terminal là web tắt. Mở lại bằng lệnh trên.)

## Sửa giá / ảnh / mô tả

1. Mở http://localhost:5173/admin.html
2. Chọn sản phẩm bên trái
3. Sửa giá bán, giá gốc, tên, nhãn, mô tả…
4. **Ảnh:** kéo ảnh vào khung, hoặc bấm *Chọn ảnh từ máy*, hoặc **Ctrl+V** khi vừa copy ảnh.
   - Ảnh đầu tiên là ảnh chính. Dùng ← → ★ ✕ để sắp xếp.
5. **Video:** mục *Video sản phẩm* → **Tải video lên** (MP4, dưới 40MB). Video nằm ở ô đầu
   tiên của dải ảnh, khách bấm ▶ mới tải (không làm web chậm). Bấm **Xoá video** để bỏ.
6. Bấm **Lưu & cập nhật web** (hoặc Ctrl+S)

Ẩn 1 sản phẩm: bỏ tick **Hiện trên web** → nó biến khỏi trang chủ.

## Cài đặt chung

Tab **Cài đặt chung**: tên shop, hotline, Zalo, Messenger, địa chỉ, **link Google Sheet**, **Facebook Pixel ID**.

Nối Google Sheet nhận đơn: xem `HUONG-DAN-GOOGLE-SHEET.md`.
Bắn thông báo đơn mới về Telegram (điện thoại kêu ngay): xem `HUONG-DAN-TELEGRAM.md`.

## Thêm sản phẩm mới

Admin → **+ Thêm sản phẩm** → sửa tên, giá, ảnh, mô tả → Lưu.

## Cấu trúc

```
D:\1688-shop
├─ admin.html            trang quản trị (không đưa file này lên host)
├─ index.html            trang chủ (tự sinh)
├─ p\*.html              10 trang sản phẩm (tự sinh)
├─ chinh-sach.html       chính sách (tự sinh)
├─ data\products.json    dữ liệu gốc — đừng sửa tay, sửa qua admin
├─ data\provinces.json   63 tỉnh (địa chỉ 3 cấp cũ) — tự sinh
├─ assets\addr\*.json    huyện/xã từng tỉnh — tải khi khách chọn tỉnh
├─ assets\img\...        ảnh sản phẩm
├─ assets\videos\...     video sản phẩm + video xưởng (mp4 + ảnh poster)
├─ assets\style.css      giao diện web bán hàng
├─ assets\app.js         form đặt hàng, popup, tracking, đánh giá, video
├─ build.mjs             sinh HTML từ products.json
├─ build-address.mjs     tải dữ liệu xã/huyện/tỉnh (1 lần)
├─ make-videos.mjs       sinh video từ ảnh sản phẩm (chạy 1 lần)
├─ reviews.mjs           sinh đánh giá + số sao từng sản phẩm
├─ server.mjs            server local + API cho admin
└─ apps-script\Code.gs   code Google Sheet
```

Sửa trực tiếp `products.json` xong thì chạy `node build.mjs` để sinh lại HTML.

### Địa chỉ nhận hàng

Form đặt hàng dùng **địa chỉ 3 cấp cũ**: Số nhà → Tỉnh → Quận/Huyện → Xã/Phường.
Danh sách xã/huyện nằm trong `assets/addr/<mã tỉnh>.json` (63 file, ~3KB/file) — khi
upload lên host **phải copy cả thư mục `assets/addr`**, nếu thiếu thì ô Huyện/Xã trống.

Cập nhật lại dữ liệu địa chỉ: `node build-address.mjs` (xoá `data/address-raw.json` nếu muốn tải mới).

### Đánh giá sản phẩm

Mỗi sản phẩm có sẵn ~100–145 bình luận + số lượt đánh giá 1.000–1.900, điểm 4,4–4,9.
Sinh tự động trong `reviews.mjs` (theo slug nên build lại không đổi nội dung).
Khách bấm **Xem thêm đánh giá** để tải thêm, và có ô **Viết đánh giá** — bình luận khách
tự gửi lưu trên máy khách (localStorage), không gửi lên server.

### Video sản phẩm

Có 2 loại video:
1. **Video tự sinh từ ảnh** (`node make-videos.mjs`) — ghép các ảnh sản phẩm thành clip 8,8s pan + chuyển cảnh. Mặc định mọi sản phẩm đều có.
2. **Video bạn tải lên** (Admin → Tải video lên) — video quay tay / video gốc từ máy. Server tự chuẩn hoá sang MP4 H.264 Baseline, xoá tiếng (vì video tự phát muted), tạo ảnh poster. Hỗ trợ MP4/WebM, tối đa 40MB.

Video **tự phát khi mở trang** (muted, lặp lại). Nên dùng MP4 dọc/vuông, dưới 20MB.

- Thay video quay tay: Admin → chọn sản phẩm → **Tải video lên**.
- Video xưởng may ở trang chủ: `assets/videos/xuong-may.mp4` (24s). Thay bằng file khác cùng tên, hoặc sửa `videos.factory` trong `data/products.json` rồi `node build.mjs`.
- Sinh lại video từ ảnh: `node make-videos.mjs` (tất cả) hoặc `node make-videos.mjs <slug>`. Cần cài **ffmpeg**.
- Upload lên host: chạy `node deploy.mjs` (đóng gói + kiểm tra file), rồi kéo thư mục `dist` vào Netlify Drop. Host phải hỗ trợ Range request (206) — Netlify/Cloudflare/Vercel đều hỗ trợ sẵn.

## Đưa lên mạng để chạy ads

Cần domain + hosting tĩnh (Vercel / Netlify / Cloudflare Pages / Hostinger).

**Cách nhanh nhất – Netlify:**
1. Chạy `node deploy.mjs` → sinh thư mục `dist/` (đã build + kiểm tra mọi file).
2. https://app.netlify.com/drop
3. Kéo **thư mục `dist`** vào.
4. Đổi tên miền trong **Domain settings**.

> Trang quản trị chỉ chạy trên máy bạn (localhost). Sau khi sửa xong thì upload lại thư mục `dist`.

## Facebook Ads

- Dán **Pixel ID** ở tab Cài đặt chung. Web tự bắn: `PageView`, `ViewContent`, `Purchase`.
- Link ads nên thêm UTM, ví dụ:
  `https://tenmien.vn/p/san-pham-1.html?utm_source=fb&utm_campaign=test1&utm_content=videoA`
- Đơn hàng ghi kèm utm_source / utm_campaign / fbclid để biết đơn đến từ camp nào.
- Mỗi đơn (Sheet + tin Telegram) đều kèm **link sạch của trang sản phẩm** (bỏ utm) để shop
  mở đúng mẫu túi khách đặt, tránh đóng gói nhầm hàng. Sheet có cột **Link sản phẩm** bấm được;
  Telegram có dòng 🔗 *Mở đúng mẫu túi khách đặt*. Script cũng tự bỏ qua đơn trùng mã
  (khi web gửi lại đơn đã lưu trong máy khách).
- Nhớ tạo **trang Chính sách** (đã có sẵn) + thông tin shop ở footer để FB duyệt quảng cáo.
