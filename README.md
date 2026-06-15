# My CLI Tools

Bộ công cụ CLI cá nhân viết bằng Node.js, dùng cho công việc hàng ngày.

## Yêu cầu

- Node.js (v18+ khuyến nghị)
- Không cần npm install cho readfile/exif (dependencies đã bundle sẵn ở máy local)
- read-pdf cần `pdf-parse` package

## Công cụ

### 1. readfile.cjs — Đọc nội dung file bất kỳ

Đọc file text, tự tìm file trong nhiều thư mục (Downloads, Documents, Desktop, workspace).

```bash
node readfile.cjs <path-to-file>
Ví dụ:
node readfile.cjs "D:\docs\report.txt"
node readfile.cjs report.txt    # tự tìm trong các thư mục mặc định
2. read-pdf.mjs — Đọc nội dung PDF
Trích xuất text từ file PDF, hiển thị info (số trang, metadata).
node read-pdf.mjs <path-to-pdf>
Ví dụ:
node read-pdf.mjs "D:\docs\BRD.pdf"
Dependencies: pdf-parse
3. read-pdf.cjs — Phiên bản CommonJS của read-pdf
Tương tự read-pdf.mjs nhưng dùng require() thay vì import.

node read-pdf.cjs <path-to-pdf>
4. exif-tool (index.js + package.json) — Đọc EXIF metadata ảnh
Đọc thông tin EXIF từ ảnh (GPS, thời gian chụp, thiết bị, camera settings).

node index.js <path-to-image> [options]
Options:

--json — Output dạng JSON
--gps — Chỉ hiển thị GPS info
--all — Hiển thị tất cả fields
Ví dụ:

node index.js photo.jpg
node index.js photo.jpg --json
node index.js photo.jpg --gps
Dependencies: exifr, file-type

5. check-worklog.mjs — Kiểm tra worklog Jira
Kiểm tra đã log work cho ngày hôm nay trên Jira chưa.

node check-worklog.mjs
6. check-worklog-daemon.mjs — Daemon tự động nhắc log work
Chạy nền, tự động nhắc nhở nếu chưa log work.

node check-worklog-daemon.mjs
7. proxy-wrapper.mjs — Proxy wrapper cho MCP servers
Wrapper để chạy MCP servers qua corporate proxy (HTTP/HTTPS proxy với authentication).

node proxy-wrapper.mjs

Cấu trúc file
├── readfile.cjs          # Đọc file text
├── read-pdf.mjs          # Đọc PDF (ESM)
├── read-pdf.cjs          # Đọc PDF (CJS)
├── check-worklog.mjs     # Check worklog Jira
├── check-worklog-daemon.mjs  # Daemon nhắc log work
├── proxy-wrapper.mjs     # Proxy wrapper cho MCP
└── exif-tool-package.json    # package.json cho exif tool (index.js riêng)
Ghi chú
Các tool này thiết kế chạy trên Windows với Node portable
Không dùng .cmd/.bat wrapper (bị Group Policy block)
Chạy trực tiếp: node <script> <args>
Corporate proxy: dùng proxy-wrapper.mjs cho các kết nối external
