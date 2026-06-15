---
inclusion: always
---

# CLI Tools: readfile, readpdf, exif

May nay bi Group Policy BLOCK .cmd/.bat files. KHONG BAO GIO dung .cmd wrapper.

## Cach chay DUNG (truc tiep bang node):

readfile:
& "D:\Decree 53\node-portable\node.exe" "D:\Decree 53\readfile.cjs" "<path>"

readpdf:
& "D:\Decree 53\node-portable\node.exe" "D:\Decree 53\read-pdf.mjs" "<path>"

exif:
& "D:\Decree 53\node-portable\node.exe" "D:\exif-tool\index.js" "<path>" [--json] [--gps] [--all]

## Luu y

- PHAN BIET: readfile (CLI tool, chay bang node) KHAC voi readFile (built-in Kiro tool)
- Khi user go readfile (thuong het) = CLI tool -> chay node
- Khi code dung readFile (camelCase) = Kiro built-in tool doc file
- KHONG BAO GIO nham lan 2 cai nay
- LUON dung absolute path cho file target
- Node portable: D:\Decree 53\node-portable\node.exe
- KHONG dung .cmd, .bat (bi group policy block)
- Chay bang executePwsh voi & operator

