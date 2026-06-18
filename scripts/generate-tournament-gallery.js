const fs = require('fs');
const path = require('path');

// Usage: node scripts/generate-tournament-gallery.js <html-file> <image-dir>
// Example: node scripts/generate-tournament-gallery.js vansjo_30.html media/vansjo/gallery/web

const [,, htmlFile, imageDir] = process.argv;

if (!htmlFile || !imageDir) {
  console.error('Usage: node scripts/generate-tournament-gallery.js <html-file> <image-dir>');
  console.error('Example: node scripts/generate-tournament-gallery.js vansjo_30.html media/vansjo/gallery/web');
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
const htmlPath = path.join(rootDir, 'tournaments', htmlFile);
const imgDir = path.join(rootDir, imageDir);

const SUPPORTED = /\.(png|jpg|jpeg|webp|gif)$/i;
const START_MARKER = '<!-- TOURNAMENT-GALLERY:START -->';
const END_MARKER = '<!-- TOURNAMENT-GALLERY:END -->';

if (!fs.existsSync(htmlPath)) {
  console.error(`Błąd: nie znaleziono pliku ${htmlPath}`);
  process.exit(1);
}
if (!fs.existsSync(imgDir)) {
  console.error(`Błąd: nie znaleziono folderu ${imgDir}`);
  process.exit(1);
}

// Reads width/height from WebP file header without external dependencies.
// Supports VP8 (lossy), VP8L (lossless), VP8X (extended with alpha/animation).
function readWebpDimensions(filePath) {
  try {
    const buf = Buffer.alloc(30);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buf, 0, 30, 0);
    fs.closeSync(fd);

    if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') {
      return null;
    }

    const chunk = buf.toString('ascii', 12, 16);

    if (chunk === 'VP8 ') {
      return {
        w: buf.readUInt16LE(26) & 0x3fff,
        h: buf.readUInt16LE(28) & 0x3fff,
      };
    }
    if (chunk === 'VP8L') {
      const n = buf.readUInt32LE(21);
      return {
        w: (n & 0x3fff) + 1,
        h: ((n >> 14) & 0x3fff) + 1,
      };
    }
    if (chunk === 'VP8X') {
      return {
        w: (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1,
        h: (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1,
      };
    }
  } catch (_) {}
  return null;
}

const files = fs.readdirSync(imgDir)
  .filter(f => SUPPORTED.test(f))
  .sort();

if (files.length === 0) {
  console.error(`Błąd: brak obsługiwanych plików graficznych w ${imgDir}`);
  process.exit(1);
}

const relDir = path.relative(path.join(rootDir, 'tournaments'), imgDir).replace(/\\/g, '/');
const indent = '        ';

const slots = files.map(f => {
  const alt = path.basename(f, path.extname(f)).replace(/[-_]/g, ' ');
  const dims = /\.webp$/i.test(f) ? readWebpDimensions(path.join(imgDir, f)) : null;
  const sizeAttrs = dims ? ` width="${dims.w}" height="${dims.h}"` : '';
  return `${indent}<button class="t-gallery-item" type="button" aria-label="${alt}">\n${indent}  <img src="${relDir}/${f}" alt="${alt}"${sizeAttrs} loading="lazy" />\n${indent}</button>`;
}).join('\n');

const html = fs.readFileSync(htmlPath, 'utf8');

if (!html.includes(START_MARKER) || !html.includes(END_MARKER)) {
  console.error(`Błąd: nie znaleziono markerów TOURNAMENT-GALLERY:START / TOURNAMENT-GALLERY:END w ${htmlFile}`);
  process.exit(1);
}

const updated = html.replace(
  new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`),
  `${START_MARKER}\n${slots}\n${indent}${END_MARKER}`
);

fs.writeFileSync(htmlPath, updated, 'utf8');
console.log(`✓ Wygenerowano ${files.length} zdjęć w galerii turnieju ${htmlFile}.`);
