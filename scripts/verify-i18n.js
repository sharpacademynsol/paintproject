const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const dir = 'frontend';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const issues = [];

for (const file of files) {
  const html = fs.readFileSync(path.join(dir, file), 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  if ($('script[src*="i18n.js"]').length === 0) issues.push(file + ': missing i18n.js');
  if ($('link[href*="rtl-support"]').length === 0) issues.push(file + ': missing rtl-support.css');
  if ($('.language-switcher').length === 0) issues.push(file + ': missing language switcher');
}

if (issues.length === 0) {
  console.log('All ' + files.length + ' pages have i18n.js, rtl-support.css, and language switcher ✓');
} else {
  issues.forEach(i => console.log('ISSUE: ' + i));
}
