// Nhập 10 sản phẩm túi nữ từ 1688: tải ảnh + ghi products.json
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const items = [
  {
    offerId: "1049972189982", slug: "tui-deo-cheo-nu-mini-vuong", price: 229000, oldPrice: 399000, sold: 1284,
    name: "Túi đeo chéo nữ mini vuông khoá móc",
    subtitle: "Da mềm · Đựng vừa điện thoại · 6 màu",
    badge: "Bán chạy",
    colors: ["Đen", "Trắng", "Hồng", "Be", "Xanh mint"],
    desc: `<p>Túi đeo chéo nữ dáng vuông nhỏ gọn, mặt túi in chữ nổi tinh tế — món phụ kiện "nhỏ mà có võ" cho mọi outfit.</p>
<ul>
<li>Chất liệu da PU mềm, chống thấm nhẹ, dễ lau sạch.</li>
<li>Đựng vừa điện thoại 6.7 inch, ví mini, son, chìa khoá.</li>
<li>Khoá móc kim loại chắc chắn, mở đóng 1 tay.</li>
<li>Có dây đeo điều chỉnh được: đeo chéo hoặc đeo vai.</li>
</ul>
<p>Phù hợp đi làm, đi chơi, đi tiệc — lên hình cực xinh.</p>`,
    specs: [["Chất liệu", "Da PU cao cấp"], ["Kiểu dáng", "Túi vuông mini đeo chéo"], ["Kích thước", "Khoảng 18 × 13 × 7 cm"], ["Phù hợp", "Đi làm, đi chơi, dự tiệc"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01jEnQ471YlOXxg55hx_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01RpYWKu1YlOXyIBWhc_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01qILhhf1YlOXxYlJvu_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01zpTb7O1YlOXy9Ar5r_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01YnJT321YlOXxg2oNA_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01f4Z71N1YlOXxk9c4O_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01pP7AVr1YlOXyIHhX6_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN015KrXb01YlOXt5qLFk_!!3953403099-0-cib.jpg_.webp"
    ]
  },
  {
    offerId: "901158039349", slug: "tui-xach-nu-van-da", price: 259000, oldPrice: 450000, sold: 963,
    name: "Túi xách nữ vân đá cao cấp",
    subtitle: "Da vân đá sang chảnh · Đeo chéo hoặc đeo vai",
    badge: "",
    colors: ["Đen", "Trắng", "Be", "Đỏ đô"],
    desc: `<p>Mẫu túi vân đá (stone pattern) đang được săn nhiều nhất — bề mặt da in vân nổi, nhìn sang hơn hẳn tầm giá.</p>
<ul>
<li>Da PU vân đá dày dặn, form đứng, không bị nhăn.</li>
<li>2 ngăn chính + ngăn khoá kéo phụ, có ngăn điện thoại.</li>
<li>Dây đeo tháo rời: xách tay, đeo vai hay đeo chéo đều được.</li>
<li>Hợp đi làm, đi tiệc, làm quà tặng.</li>
</ul>`,
    specs: [["Chất liệu", "Da PU vân đá"], ["Kiểu dáng", "Túi xách / đeo chéo"], ["Kích thước", "Khoảng 24 × 16 × 8 cm"], ["Phù hợp", "Đi làm, dự tiệc, quà tặng"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN012XSt6I1YlORyFAyHO_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01ww6a0X1YlORyNRwnR_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01lBj5VM1YlOS0WJMeX_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01dqzfLS1YlOS1q5NBy_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN012FqPBW1YlORyFEWhD_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN012epJIB1YlORtLP5G9_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN010Tx3GW1YlORzhrthf_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN017IpcTN1YlOS06BLJQ_!!3953403099-0-cib.jpg_.webp"
    ]
  },
  {
    offerId: "1048061900102", slug: "tui-deo-cheo-nu-da-mem", price: 239000, oldPrice: 420000, sold: 745,
    name: "Túi đeo chéo nữ da mềm khoá móc",
    subtitle: "Dáng yên ngựa · Đựng nhiều mà vẫn gọn",
    badge: "",
    colors: ["Đen", "Be", "Nâu", "Hồng"],
    desc: `<p>Túi dáng yên ngựa (saddle bag) với khoá móc kim loại — thiết kế tối giản nhưng cực dễ phối đồ.</p>
<ul>
<li>Da PU mềm, bề mặt mịn, chống xước nhẹ.</li>
<li>Lòng túi rộng hơn vẻ ngoài: đựng được ví, điện thoại, khăn giấy, mỹ phẩm.</li>
<li>Khoá móc chắc, dây đeo điều chỉnh 90–120 cm.</li>
<li>Phù hợp phong cách Hàn – tối giản, đi học hay đi làm.</li>
</ul>`,
    specs: [["Chất liệu", "Da PU mềm"], ["Kiểu dáng", "Túi yên ngựa đeo chéo"], ["Kích thước", "Khoảng 22 × 15 × 8 cm"], ["Phù hợp", "Đi học, đi làm, đi chơi"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01yKKDwh1YlOXo29Bax_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01cu8MDj1YlOXo1ft3S_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN0137evge1YlOXoOW1ys_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN010zBnsB1YlOXjLPSzM_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN015P5xZT1YlOXoGMAVB_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN017BJhzU1YlOXoTHGtB_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01oBrsYh1YlOXjLStGq_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01Ep79XF1YlOXoSw93O_!!3953403099-0-cib.jpg_.webp"
    ]
  },
  {
    offerId: "659042043496", slug: "tui-mini-kelly-nu", price: 189000, oldPrice: 350000, sold: 2103,
    name: "Túi mini Kelly nữ hot trend",
    subtitle: "Dáng Kelly cổ điển · Nhỏ xinh đựng vừa điện thoại",
    badge: "Hot",
    colors: ["Đen", "Trắng", "Be", "Hồng phấn"],
    desc: `<p>Phiên bản mini của mẫu túi Kelly huyền thoại — form cứng, nắp gài khoá, lên hình cực Tây.</p>
<ul>
<li>Form đứng, giữ dáng tốt, không bị bai.</li>
<li>Đeo chéo nhờ dây dài kèm theo, hoặc xách tay.</li>
<li>Kích thước nhỏ nhưng đựng được điện thoại, son, ví mini.</li>
<li>Món quà tặng được nhiều khách chọn nhất.</li>
</ul>`,
    specs: [["Chất liệu", "Da PU form cứng"], ["Kiểu dáng", "Túi mini Kelly"], ["Kích thước", "Khoảng 20 × 14 × 8 cm"], ["Phù hợp", "Dự tiệc, đi chơi, quà tặng"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/21716528103_1230272141.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/21716516561_1230272141.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/21630235471_1230272141.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/21630238429_1230272141.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/21716492699_1230272141.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/21716495805_1230272141.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/21630226560_1230272141.jpg_.webp"
    ]
  },
  {
    offerId: "738680473446", slug: "tui-kep-nach-nu-han-quoc", price: 159000, oldPrice: 290000, sold: 1560,
    name: "Túi kẹp nách nữ Hàn Quốc vân đá",
    subtitle: "Kẹp nách trendy · Nhẹ, mềm, đựng vừa điện thoại",
    badge: "Giá sốc",
    colors: ["Đen", "Trắng", "Be", "Xanh rêu"],
    desc: `<p>Túi kẹp nách (underarm bag) đang là item "must-have" của mùa này — nhỏ gọn, đeo sát người, tôn dáng cực xinh.</p>
<ul>
<li>Chất liệu da mềm, trọng lượng nhẹ, đeo cả ngày không mỏi vai.</li>
<li>Dây ngắn kẹp nách, có thể gắn dây dài để đeo chéo.</li>
<li>Màu trơn dễ phối, hợp cả đồ công sở lẫn đồ đi chơi.</li>
</ul>`,
    specs: [["Chất liệu", "Da PU mềm"], ["Kiểu dáng", "Túi kẹp nách"], ["Kích thước", "Khoảng 25 × 14 × 6 cm"], ["Phù hợp", "Đi chơi, cafe, dạo phố"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01JQs8mX1YlOK88OGK1_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01MXCc3d1YlOK5WEvVD_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN0194N6y51YlOK6MDWq4_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01vjxPCB1YlOMPKRHub_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01WxUz1X1YlOHiIml4X_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01m5mYyQ1YlOK21QraW_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01qfJ3CP1YlOKFPEHAH_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01uyr07O1YlOKDaNeZh_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01I0kmlB1YlOKCNYBvD_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01T5rH0s1YlOKA0IMdx_!!3953403099-0-cib.jpg_.webp"
    ]
  },
  {
    offerId: "750220507665", slug: "tui-jelly-mini-trong-suot", price: 179000, oldPrice: 320000, sold: 688,
    name: "Túi jelly mini trong suốt quai xích",
    subtitle: "Acrylic bóng · Đi biển, đi tiệc cực hợp",
    badge: "",
    colors: ["Trắng sữa", "Hồng", "Xanh biển", "Đen"],
    desc: `<p>Túi jelly mini chất liệu acrylic bóng, nhìn như thuỷ tinh — item lên hình "sương sương" mà ai cũng hỏi mua ở đâu.</p>
<ul>
<li>Chất liệu acrylic dày, không bị ố vàng, lau là sạch.</li>
<li>Quai xích kim loại tháo rời, đeo chéo hoặc xách tay.</li>
<li>Chống thấm nước — rất hợp đi biển, hồ bơi.</li>
<li>Đựng vừa điện thoại, son, ví mini.</li>
</ul>`,
    specs: [["Chất liệu", "Acrylic bóng"], ["Kiểu dáng", "Túi mini quai xích"], ["Kích thước", "Khoảng 18 × 12 × 6 cm"], ["Phù hợp", "Đi biển, dự tiệc, chụp ảnh"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01IjfwXZ1YlOJ9JWMUy_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01vDdaIQ1YlOJ8yv7yD_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN0164LTOz1YlOJCHNG93_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01w2T6Sn1YlOJ9JTwpf_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN010rXH4F1YlOIy8hCBN_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01wntL0x1YlOJ2ju7y7_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01PTc35v1YlOJ2jvXHt_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01CxrJCe1YlOJ6MIs6X_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01SkIj2X1YlOJ7MxkF3_!!3953403099-0-cib.jpg_.webp"
    ]
  },
  {
    offerId: "1038654325409", slug: "tui-vuong-nu-han-quoc", price: 249000, oldPrice: 430000, sold: 512,
    name: "Túi vuông nữ Hàn Quốc da vân nổi",
    subtitle: "Form vuông đứng · Đeo chéo thanh lịch",
    badge: "",
    colors: ["Đen", "Trắng", "Be", "Nâu bò"],
    desc: `<p>Túi vuông Hàn Quốc form cứng, bề mặt da vân nổi — kiểu túi "đi làm không bao giờ sai".</p>
<ul>
<li>Form vuông đứng, giữ dáng, chống nhăn.</li>
<li>Có ngăn khoá kéo trong và ngăn phụ đựng điện thoại.</li>
<li>Dây dài điều chỉnh, đeo chéo vừa vặn mọi chiều cao.</li>
<li>Phối được với sơ mi, blazer, váy liền.</li>
</ul>`,
    specs: [["Chất liệu", "Da PU vân nổi"], ["Kiểu dáng", "Túi vuông đeo chéo"], ["Kích thước", "Khoảng 23 × 16 × 8 cm"], ["Phù hợp", "Công sở, đi chơi"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01CUjcsw1YlOXTs1wO3_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01WEKkPa1YlOXTFj4d9_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01kHv78B1YlOXTFijpy_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01sioi1A1YlOXTCqFnD_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01MPoOw11YlOXT47Oox_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01KInCRG1YlOXTZQQbu_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01gi1dSp1YlOXTCrGOl_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN012fZlRQ1YlOXTMQGtR_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN0160Goan1YlOXTFm60G_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01tQZ5nH1YlOXTCv5Tx_!!3953403099-0-cib.jpg_.webp"
    ]
  },
  {
    offerId: "944825473040", slug: "tui-boston-ren-nu", price: 229000, oldPrice: 399000, sold: 402,
    name: "Túi Boston ren nữ cầm tay",
    subtitle: "Ren thêu tinh xảo · Có dây đeo chéo",
    badge: "Mới",
    colors: ["Trắng", "Hồng", "Đen"],
    desc: `<p>Túi Boston dáng tròn mềm với hoạ tiết ren thêu — nữ tính, nhẹ nhàng, hợp các buổi hẹn và tiệc cưới.</p>
<ul>
<li>Vải ren thêu tỉ mỉ, lót trong chắc chắn.</li>
<li>Có quai cầm tay + dây đeo chéo tháo rời.</li>
<li>Lòng túi rộng, đựng được nhiều đồ hơn vẻ ngoài.</li>
</ul>`,
    specs: [["Chất liệu", "Vải ren thêu"], ["Kiểu dáng", "Túi Boston cầm tay / đeo chéo"], ["Kích thước", "Khoảng 22 × 14 × 12 cm"], ["Phù hợp", "Tiệc cưới, hẹn hò, đi chơi"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01N8714X1YlOTWrjdoh_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01MB5njW1YlOTY3CbUl_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01QrKxVY1YlOTXpYfik_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01twuACW1YlOTY3AalD_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01easpfd1YlOTYoR0z8_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01FNMr6G1YlOTW1bqHR_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01jyV4tg1YlOTXAp1YV_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN017IHX2G1YlOTX9q3V9_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN018MJdzB1YlOTYW0md4_!!3953403099-0-cib.jpg_.webp"
    ]
  },
  {
    offerId: "917243532066", slug: "tui-deo-vai-quai-no", price: 169000, oldPrice: 310000, sold: 934,
    name: "Túi đeo vai quai nơ xếp ly",
    subtitle: "Quai nơ thắt · Nhẹ, mềm, đựng nhiều",
    badge: "",
    colors: ["Trắng", "Hồng", "Đen", "Xanh nhạt"],
    desc: `<p>Túi đeo vai quai nơ xếp ly — điểm nhấn nữ tính cho mọi set đồ mùa hè.</p>
<ul>
<li>Thân túi xếp ly mềm mại, có lót trong.</li>
<li>Quai nơ thắt sẵn, đeo vai hoặc cầm tay.</li>
<li>Trọng lượng nhẹ, gấp gọn bỏ balo khi không dùng.</li>
</ul>`,
    specs: [["Chất liệu", "Vải PU mềm xếp ly"], ["Kiểu dáng", "Túi đeo vai quai nơ"], ["Kích thước", "Khoảng 26 × 18 × 8 cm"], ["Phù hợp", "Đi chơi, đi biển, dạo phố"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01Ox4iFo1YlOSWNx318_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01thHJqI1YlOSWOcycx_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01x4E3m81YlOSWww1oW_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01GCPM3y1YlOSWdOVnY_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01p8GjZM1YlOSVUTfJn_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01HJQkhY1YlOSVs9xuA_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01BEqrvF1YlOSVkcu18_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01n2W1H11YlOSWOigIT_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01LovfD41YlOSXonEiw_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01QWhpff1YlOSUc8BDy_!!3953403099-0-cib.jpg_.webp"
    ]
  },
  {
    offerId: "1074345975022", slug: "tui-xep-ly-no-nu", price: 199000, oldPrice: 350000, sold: 577,
    name: "Túi xếp ly nơ nữ cá tính",
    subtitle: "Xếp ly mềm · Quai nơ · Đeo chéo được",
    badge: "",
    colors: ["Trắng", "Hồng", "Đen", "Be"],
    desc: `<p>Túi xếp ly quai nơ phiên bản cá tính hơn — mềm, nhẹ, đeo chéo cả ngày không mỏi.</p>
<ul>
<li>Bề mặt xếp ly đều, giữ form tốt.</li>
<li>Có dây đeo chéo tháo rời + quai nơ cầm tay.</li>
<li>Ngăn chính rộng, có túi nhỏ đựng điện thoại.</li>
<li>Hợp outfit hè: váy trắng, sơ mi, quần short.</li>
</ul>`,
    specs: [["Chất liệu", "Vải PU xếp ly"], ["Kiểu dáng", "Túi đeo chéo / đeo vai"], ["Kích thước", "Khoảng 24 × 16 × 8 cm"], ["Phù hợp", "Đi chơi, du lịch, dạo phố"]],
    imgs: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01ruySfjZi4tD1chua_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN014XHWiVx7TuD1chua_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01NH50W1f5aTK1chua_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01Sck9SmIOLvG1chua_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01jIHC3bvawTK1chua_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01gKgk8j5988E1chua_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN019du8cJmE6PC1chua_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01uoiRRUw1CAG1chua_!!3953403099-0-cib.jpg_.webp",
      "https://cbu01.alicdn.com/img/ibank/O1CN01dtve0NfbS1L1chua_!!3953403099-0-cib.jpg_.webp"
    ]
  }
];

const dataFile = join(ROOT, "data/products.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

async function dl(url, dest) {
  if (existsSync(dest)) return true;
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://detail.1688.com/" } });
    if (!r.ok) return false;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 2000) return false;
    writeFileSync(dest, buf);
    return true;
  } catch { return false; }
}

const products = [];
for (const it of items) {
  const dirRel = `assets/img/${it.slug}`;
  const dir = join(ROOT, dirRel);
  mkdirSync(dir, { recursive: true });
  const images = [];
  let n = 0;
  for (const u of it.imgs) {
    n++;
    const file = `${n}.webp`;
    const ok = await dl(u, join(dir, file));
    if (ok) images.push(`${dirRel}/${file}`);
  }
  console.log(`${it.slug}: ${images.length}/${it.imgs.length} ảnh`);
  products.push({
    slug: it.slug,
    offerId: it.offerId,
    name: it.name,
    subtitle: it.subtitle,
    price: it.price,
    oldPrice: it.oldPrice,
    sold: it.sold,
    badge: it.badge,
    active: true,
    images,
    variants: [{ name: "Màu sắc", options: it.colors }],
    specs: it.specs.map(([k, v]) => ({ k, v })),
    description: it.desc
  });
}

data.products = products;
writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf8");
console.log("✓ Đã ghi data/products.json —", products.length, "sản phẩm");
