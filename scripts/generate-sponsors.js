const fs = require('fs');
const path = require('path');

const sponsorsDir = path.join(__dirname, '..', 'media', 'sponsors');
const indexPath = path.join(__dirname, '..', 'index.html');

const SUPPORTED = /\.(png|jpg|jpeg|webp|gif|svg)$/i;
const START_MARKER = '<!-- SPONSORS:START -->';
const END_MARKER = '<!-- SPONSORS:END -->';

const files = fs.readdirSync(sponsorsDir)
  .filter(f => SUPPORTED.test(f))
  .sort();

const indent = '          ';
const slots = files
  .map((f, i) => `${indent}<div class="sponsor-slot"><img src="./media/sponsors/${f}" alt="Sponsor ${i + 1}" /></div>`)
  .join('\n');

const html = fs.readFileSync(indexPath, 'utf8');

if (!html.includes(START_MARKER) || !html.includes(END_MARKER)) {
  console.error('Błąd: nie znaleziono markerów SPONSORS:START / SPONSORS:END w index.html');
  process.exit(1);
}

const updated = html.replace(
  new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`),
  `${START_MARKER}\n${slots}\n${indent}${END_MARKER}`
);

fs.writeFileSync(indexPath, updated, 'utf8');
console.log(`✓ Wygenerowano ${files.length} slotów sponsorów.`);
