const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const dir = 'frontend';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let problematic = 0;

for (const file of files) {
  const html = fs.readFileSync(path.join(dir, file), 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  $('[data-i18n]').each((i, el) => {
    const element = $(el);
    const children = element.children();
    if (children.length > 0) {
      const tag = el.tagName;
      const key = element.attr('data-i18n');
      const childTags = children.map((j, c) => c.tagName).get().join(', ');
      console.log(file + ': <' + tag + ' data-i18n="' + key + '"> has children: ' + childTags);
      problematic++;
    }
  });
}

console.log('\nTotal elements with children: ' + problematic);
