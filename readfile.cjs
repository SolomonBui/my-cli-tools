const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const workspace = __dirname;

// Common attachment/copy directories to search
const searchDirs = [
  workspace,
  path.join(require('os').homedir(), 'Downloads'),
  path.join(require('os').homedir(), 'Documents'),
  path.join(require('os').homedir(), 'Desktop'),
];

let filePath = process.argv.slice(2).join(' '); // support filenames with spaces

if (!filePath) {
  console.error('Usage: readfile <path-to-file>');
  process.exit(1);
}

// Absolute path — use directly (no workspace restriction)
if (path.isAbsolute(filePath)) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
} else if (fs.existsSync(filePath)) {
  // Relative path exists from cwd
  filePath = path.resolve(filePath);
} else {
  // Search: workspace first, then common directories
  const basename = path.basename(filePath);
  let found = null;

  // Try resolving relative to workspace
  const resolved = path.resolve(workspace, filePath);
  if (fs.existsSync(resolved)) {
    found = resolved;
  }

  // Search recursively in workspace and common dirs
  if (!found) {
    for (const dir of searchDirs) {
      if (!fs.existsSync(dir)) continue;
      found = findFile(dir, basename);
      if (found) break;
    }
  }

  if (found) {
    filePath = found;
  } else {
    console.error(`File not found: ${filePath}`);
    console.error(`Searched: ${searchDirs.join(', ')}`);
    process.exit(1);
  }
}

function findFile(dir, name) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const full = path.join(dir, entry.name);
      if (entry.isFile() && entry.name === name) return full;
      if (entry.isDirectory()) {
        const result = findFile(full, name);
        if (result) return result;
      }
    }
  } catch (e) { /* skip unreadable dirs */ }
  return null;
}

const ext = path.extname(filePath).toLowerCase();
const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.heic', '.heif', '.avif', '.svg', '.ico'];
const textExts = ['.md', '.txt', '.js', '.cjs', '.mjs', '.ts', '.json', '.yaml', '.yml', '.xml', '.html', '.css', '.csv', '.log', '.sh', '.bat', '.ps1', '.py', '.java', '.kt', '.gradle', '.properties', '.cfg', '.ini', '.toml', '.env', '.sql', '.graphql', '.vue', '.jsx', '.tsx', '.scss', '.less', '.vbs', '.drawio'];
const node = process.execPath;

try {
  if (imageExts.includes(ext)) {
    execFileSync(node, ['D:\\exif-tool\\index.js', filePath], { stdio: 'inherit' });
  } else if (textExts.includes(ext)) {
    // Read text files directly
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(content);
  } else {
    // Binary files (PDF, DOCX, XLSX, etc.) → read-pdf.cjs
    execFileSync(node, ['D:\\Decree 53\\read-pdf.cjs', filePath], { stdio: 'inherit' });
  }
} catch (e) {
  process.exit(e.status || 1);
}
