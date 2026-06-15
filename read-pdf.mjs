import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node read-pdf.mjs <path-to-pdf>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);
const data = await pdfParse(buffer);

console.log(`=== PDF Info ===`);
console.log(`Pages: ${data.numpages}`);
console.log(`Title: ${data.info?.Title || 'N/A'}`);
console.log(`\n=== Content ===\n`);
console.log(data.text);
