# Nối web → Google Sheet (làm 1 lần, ~5 phút)

Mục tiêu: khách bấm **Đặt hàng** → hiện popup "Đặt hàng thành công" → đơn tự động ghi vào 1 file Google Sheet của bạn.

---

## 1. Tạo Google Sheet

1. Vào https://sheets.new → đặt tên, ví dụ **Don Hang Lum Store**.
2. Không cần tạo cột — script tự tạo sheet `DonHang` + tiêu đề.

### Muốn xem trước bảng trông thế nào

Trong thư mục dự án có sẵn `data/DonHang-mau.csv` — bảng 16 cột + 2 dòng mẫu.
Cách nhập (30 giây):

1. Mở file Sheet vừa tạo → **File → Import → Upload** → chọn `data/DonHang-mau.csv`
2. **Import location: Replace spreadsheet** → **Import data**
3. Đổi tên tab dưới cùng thành **`DonHang`** (đúng chữ, không dấu)
4. Xoá 2 dòng mẫu (giữ lại dòng tiêu đề)

Nếu bỏ qua bước này cũng không sao — đơn đầu tiên gửi tới, script tự tạo tab `DonHang` với đúng 16 cột.
Cột cuối **Link sản phẩm** là link bấm được, mở đúng trang mẫu túi khách đặt → tránh giao nhầm hàng.
Nếu Sheet đã có sẵn 15 cột từ trước, script tự thêm tiêu đề cột thứ 16 khi có đơn mới.

## 2. Dán code vào Apps Script

1. Trong Sheet: menu **Tiện ích mở rộng → Apps Script**.
2. Xoá hết code mẫu, dán toàn bộ nội dung file `apps-script/Code.gs` ở thư mục dự án.
3. Bấm **Ctrl + S** để lưu. (Tuỳ chọn: chọn hàm `setup` → **Run** để tạo sheet `DonHang` trước.)

## 3. Deploy thành Web App

1. Góc phải: **Deploy → New deployment**.
2. Bấm bánh răng chọn **Web app**.
3. Cấu hình:
   - Description: `don hang`
   - **Execute as: Me (email của bạn)**
   - **Who has access: Anyone** ← bắt buộc, nếu không form sẽ không gửi được
4. Bấm **Deploy** → **Authorize access** → chọn tài khoản → *Advanced* → *Go to ... (unsafe)* → **Allow**.
5. Copy **Web app URL**, dạng:
   `https://script.google.com/macros/s/AKfycb..../exec`

> Đổi code sau này thì phải **Deploy → Manage deployments → Edit → Version: New version → Deploy** thì link mới cập nhật.

## 4. Dán link vào web

Mở **http://localhost:5173/admin.html** → tab **Cài đặt chung** → dán vào ô
**Google Apps Script URL** → bấm **Lưu & cập nhật web**.

## 5. Kiểm tra

- Mở 1 trang sản phẩm, đặt thử 1 đơn.
- Popup hiện mã đơn → mở Sheet, đơn sẽ xuất hiện trong sheet `DonHang` (làm mới trang nếu chưa thấy).---

## Nếu đơn không vào Sheet

| Hiện tượng | nguyên nhân | cách sửa |
|---|---|---|
| Sheet trống, web vẫn báo thành công | Chưa dán link / link sai | Dán lại URL kết thúc bằng `/exec` |
| Bấm Deploy báo lỗi quyền | Chưa cấp quyền | Deploy lại, bấm **Authorize access** |
| Đơn vào chậm 5–10 giây | Apps Script khởi động nguội | Bình thường, chờ chút rồi tải lại Sheet |
| Cột SĐT bị mất số 0 | Định dạng cột | Code đã thêm dấu `'`, nếu vẫn lỗi thì đổi định dạng cột SĐT sang *Plain text* |

**Lưu ý:** web gửi đơn kiểu "gửi và quên" (không đọc được phản hồi vì Google chặn CORS), nên popup luôn hiện ngay. Đơn còn được lưu tạm trong trình duyệt khách và tự gửi lại nếu mạng lỗi — nhưng hãy test thật 1 đơn trước khi chạy ads.
