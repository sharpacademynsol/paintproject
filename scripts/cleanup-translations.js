const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const TRANSLATIONS_PATH = path.join(FRONTEND_DIR, 'assets', 'translations.json');

const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));

// Collect all used keys from HTML files
const usedKeys = new Set();
const htmlFiles = fs.readdirSync(FRONTEND_DIR).filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(FRONTEND_DIR, file), 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });
  
  $('[data-i18n]').each((i, el) => usedKeys.add($(el).attr('data-i18n')));
  $('[data-i18n-html]').each((i, el) => usedKeys.add($(el).attr('data-i18n-html')));
  $('[data-i18n-placeholder]').each((i, el) => usedKeys.add($(el).attr('data-i18n-placeholder')));
  $('[data-i18n-title]').each((i, el) => usedKeys.add($(el).attr('data-i18n-title')));
}

// Also add hardcoded keys used by i18n.js
usedKeys.add('site.title');

// Remove unused keys
let removed = 0;
for (const lang of ['en', 'ar']) {
  const keys = Object.keys(translations[lang]);
  for (const key of keys) {
    if (!usedKeys.has(key)) {
      delete translations[lang][key];
      removed++;
    }
  }
}

function deepSort(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const sorted = {};
  for (const k of Object.keys(obj).sort()) sorted[k] = deepSort(obj[k]);
  return sorted;
}

translations.en = deepSort(translations.en);
translations.ar = deepSort(translations.ar);

fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify(translations, null, 2), 'utf8');
console.log(`Scanned ${htmlFiles.length} HTML files`);
console.log(`Found ${usedKeys.size} used translation keys`);
console.log(`Removed ${removed} unused keys`);
console.log(`Final EN keys: ${Object.keys(translations.en).length}`);
console.log(`Final AR keys: ${Object.keys(translations.ar).length}`);
