# Bắn đơn hàng mới về Telegram (5 phút, miễn phí)

Khi khách đặt hàng, ngoài việc ghi vào Google Sheet, bot Telegram sẽ nhắn ngay vào
điện thoại bạn: tên khách, SĐT bấm gọi được, địa chỉ, mẫu túi, số tiền, nguồn quảng cáo.

> Không cần thuê server, không cần thẻ tín dụng. Bot chạy trong Google Apps Script.

---

## Bước 1 — Tạo bot

1. Mở Telegram, tìm **@BotFather** (có tick xanh).
2. Bấm **Start** → gõ `/newbot`
3. Nhập tên bot, ví dụ: `Lụm Store đơn hàng`
4. Nhập username (phải kết thúc bằng `bot`), ví dụ: `lumstore_donhang_bot`
5. BotFather trả về **token** dạng:

```
8123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

→ Copy token này.

## Bước 2 — Nhắn cho bot 1 tin

Mở bot vừa tạo (BotFather có gửi link `t.me/...`), bấm **Start** và nhắn bất kỳ, ví dụ `hi`.

> Bắt buộc phải nhắn trước, không thì bot không được phép nhắn cho bạn.

## Bước 3 — Lấy chat_id

Mở trên trình duyệt (thay token thật vào):

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

Kết quả có đoạn:

```json
"chat": { "id": 123456789, "first_name": "Nam", "type": "private" }
```

→ `123456789` là **chat_id**.

Nếu ra `{"ok":true,"result":[]}`: chưa nhắn cho bot (làm lại bước 2), hoặc đã nhắn mà
vẫn rỗng thì đợi 10 giây rồi tải lại trang.

## Bước 4 — Dán vào Code.gs

Mở Google Sheet → **Tiện ích mở rộng → Apps Script** → file `Code.gs` (dán toàn bộ file
`apps-script/Code.gs` trong thư mục web nếu chưa dán) → sửa 2 dòng đầu khối Telegram:

```js
const TELEGRAM_TOKEN = "8123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const TELEGRAM_CHAT_ID = "123456789";
```

Bấm 💾 **Save**.

## Bước 5 — Deploy lại

**Deploy → Manage deployments → bút chì (Edit) → Version: New version → Deploy**

> Nếu không tạo version mới, Web App vẫn chạy code cũ (không có Telegram).

Quyền: **Execute as: Me** · **Who has access: Anyone** (để web gửi đơn được).

## Bước 6 — Thử

Trong Apps Script, chọn hàm **testTelegram** → bấm **Run**.
Lần đầu Google sẽ hỏi quyền → **Review permissions → chọn tài khoản → Advanced →
Go to ... (unsafe) → Allow**.

Nếu điện thoại nhận được tin:

> ✅ **Lụm Store** đã kết nối Telegram!
> Đơn mới sẽ bắn về đây.

→ Xong. Đặt thử 1 đơn trên web là có tin nhắn.

Tin đơn hàng có dạng:

> 🛍️ **ĐƠN HÀNG MỚI** · `LS2610271646265`
> 👤 **Nguyễn Thu Hà** · 📞 0982467019
> 📍 12 Trần Hưng Đạo, Phường Bắc Sơn, Thành phố Tam Điệp, Ninh Bình
> 👜 Túi đeo chéo nữ mini vuông khoá móc
> 🎨 Đen · SL 1
> 💰 **299.000đ** (thanh toán khi nhận)
> 🔗 [Mở đúng mẫu túi khách đặt](http://localhost:5173/p/tui-deo-cheo-nu-mini-vuong.html)
> 📊 Nguồn: fb / test-link / fbclid

Dòng **🔗 Mở đúng mẫu túi khách đặt** là link bấm được → mở đúng trang sản phẩm,
đối chiếu với ảnh trước khi đóng gói. Google Sheet cũng có cột **Link sản phẩm** tương tự.

---

## Nhận thông báo vào nhóm (nhiều người cùng thấy)

1. Tạo nhóm Telegram, thêm bot vừa tạo vào nhóm.
2. Nhắn 1 tin trong nhóm (vd: `test`).
3. Mở `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Lấy `"chat":{"id":-1001234567890, ...}` — **id âm, bắt đầu bằng -100**.
5. Dán số âm đó vào `TELEGRAM_CHAT_ID`.

## Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| Không có tin nhắn, đơn vẫn vào Sheet | Chưa deploy **New version** | Làm lại bước 5 |
| `chat not found` | Chưa nhắn cho bot, hoặc chat_id sai | Làm lại bước 2–3 |
| `Unauthorized` / `404` | Token sai hoặc dư dấu cách | Copy lại token từ BotFather |
| `bot was blocked by the user` | Bạn đã bấm Block bot | Mở bot → Unblock |
| Tin nhắn không có tiếng Việt | — | Không sao, Telegram tự hiển thị đúng |

## Tắt thông báo

Xoá trắng 2 dòng `TELEGRAM_TOKEN` và `TELEGRAM_CHAT_ID` → Save → Deploy New version.
Đơn vẫn ghi vào Sheet bình thường.

> Telegram chỉ là **kênh báo**. Nơi lưu đơn chính vẫn là **Google Sheet** — đừng xoá
> dòng nào trong Sheet, đó là dữ liệu đối soát COD.
