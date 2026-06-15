const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node read-pdf.cjs <path-to-pdf>');
  process.exit(1);
}

const resolved = path.resolve(filePath);
if (!fs.existsSync(resolved)) {
  console.error(`File not found: ${resolved}`);
  process.exit(1);
}

async function main() {
  const buffer = fs.readFileSync(resolved);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  
  console.log(`=== PDF Info ===`);
  console.log(`Pages: ${result.total}`);
  console.log(`\n=== Content ===\n`);
  console.log(result.text);
  
  await parser.destroy();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
