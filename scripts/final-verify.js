const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const dir = 'frontend';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let issues = [];
let pentuCount = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  const html = fs.readFileSync(fp, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  // Check infrastructure
  if ($('script[src*="i18n.js"]').length === 0) issues.push(file + ': missing i18n.js');
  if ($('link[href*="rtl-support"]').length === 0) issues.push(file + ': missing rtl-support.css');
  if ($('.language-switcher').length === 0) issues.push(file + ': missing language switcher');
  if ($('title[data-i18n]').length === 0) issues.push(file + ': missing data-i18n on title');

  // Check DOCTYPE
  if (!html.trim().startsWith('<!DOCTYPE html>')) issues.push(file + ': invalid/missing DOCTYPE');

  // Check for Pentu in visible text
  const pentuMatches = html.match(/Pentu|pentu/g);
  if (pentuMatches) pentuCount += pentuMatches.length;

  // Check for self-closing tag issues
  const brokenVoid = html.match(/<(meta|link|img|br|hr|input|area|base|col|embed|param|source|track|wbr)\b[^>]*><\/\1>/gi);
  if (brokenVoid) issues.push(file + ': has ' + brokenVoid.length + ' broken self-closing tags');
}

console.log('=== Final Verification ===');
console.log('Pages checked: ' + files.length);

if (issues.length === 0) {
  console.log('No issues found ✓');
} else {
  issues.forEach(i => console.log('ISSUE: ' + i));
}

console.log('Pentu references remaining: ' + pentuCount);

// Check translations
const t = JSON.parse(fs.readFileSync(path.join(dir, 'assets', 'translations.json'), 'utf8'));
let missingAr = 0;
for (const [key, enVal] of Object.entries(t.en)) {
  const arVal = t.ar[key];
  if (!arVal || arVal === enVal) missingAr++;
}
console.log('Translation keys: ' + Object.keys(t.en).length);
console.log('Missing Arabic translations: ' + missingAr);
