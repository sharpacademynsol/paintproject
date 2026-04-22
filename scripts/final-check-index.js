const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('frontend/index.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

console.log('Title data-i18n:', $('title').attr('data-i18n'));
console.log('i18n.js present:', $('script[src*="i18n.js"]').length > 0);
console.log('rtl-support.css present:', $('link[href*="rtl-support"]').length > 0);
console.log('Language switcher present:', $('.language-switcher').length > 0);
console.log('data-i18n elements:', $('[data-i18n]').length);
console.log('data-i18n-placeholder elements:', $('[data-i18n-placeholder]').length);
