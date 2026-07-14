# Hướng dẫn build JS (minify bằng Terser)

## Cấu trúc
- `js/app.js` — **file NGUỒN**. Bạn viết / sửa JS ở đây.
- `js/app.min.js` — **bản đã nén**, được `index.html` tải qua `<script src="js/app.min.js">`.
  File này do lệnh build sinh ra. **Đừng sửa tay** — sẽ bị ghi đè khi build.

> Hiện tại `app.min.js` đang là bản sao của `app.js` (chưa nén) để site chạy được
> trước khi bạn cài Node. Sau khi build lần đầu, nó sẽ thành bản nén thật.

## Cài đặt (chỉ làm 1 lần)
1. Cài Node.js (kèm npm): https://nodejs.org (bản LTS).
2. Trong thư mục dự án, chạy:
   ```
   npm install
   ```

## Mỗi khi sửa xong JS
```
npm run build
```
Lệnh này nén `js/app.js` → `js/app.min.js`. Sau đó commit & push cả hai file.

## Viết thêm JS sau này
- Cách đơn giản: viết thêm vào `js/app.js` rồi `npm run build`.
- Nếu muốn tách nhiều file, thêm chúng vào lệnh build trong `package.json`
  (Terser nối các file theo thứ tự liệt kê), ví dụ:
  ```
  "build": "terser js/app.js js/features.js -o js/app.min.js --compress --mangle --keep-fnames --comments false"
  ```

## Vì sao cấu hình có `--keep-fnames`?
HTML gọi hàm JS qua rất nhiều `onclick="tenHam()"`. `--keep-fnames` giữ nguyên
tên hàm nên các `onclick` không bị vỡ. Terser vẫn xoá comment/khoảng trắng và
rút gọn biến cục bộ để giảm dung lượng.

> Lưu ý: minify chỉ **giảm dung lượng + khó đọc hơn**, KHÔNG bảo mật code.
> Ai cũng xem được qua DevTools của trình duyệt.
