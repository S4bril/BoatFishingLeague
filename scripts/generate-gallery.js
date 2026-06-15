const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, '..', 'media', 'gallery');
const indexPath = path.join(__dirname, '..', 'index.html');

const SUPPORTED = /\.(png|jpg|jpeg|webp|gif)$/i;
const START_MARKER = '<!-- GALLERY:START -->';
const END_MARKER = '<!-- GALLERY:END -->';

function altFromFilename(filename) {
  return path.basename(filename, path.extname(filename))
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const files = fs.readdirSync(galleryDir)
  .filter(f => SUPPORTED.test(f))
  .sort();

const indent = '          ';
const slots = files
  .map(f => `${indent}<img src="./media/gallery/${f}" alt="${altFromFilename(f)}" class="gallery-img" />`)
  .join('\n');

const html = fs.readFileSync(indexPath, 'utf8');

if (!html.includes(START_MARKER) || !html.includes(END_MARKER)) {
  console.error('Błąd: nie znaleziono markerów GALLERY:START / GALLERY:END w index.html');
  process.exit(1);
}

const updated = html.replace(
  new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`),
  `${START_MARKER}\n${slots}\n${indent}${END_MARKER}`
);

fs.writeFileSync(indexPath, updated, 'utf8');
console.log(`✓ Wygenerowano ${files.length} zdjęć w galerii.`);
