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
