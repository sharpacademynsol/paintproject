const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const dir = 'frontend';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let fixed = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  const html = fs.readFileSync(fp, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });
  let changed = false;

  $('span.__cf_email__').each((i, el) => {
    const self = $(el);
    if (self.attr('data-i18n')) {
      self.removeAttr('data-i18n');
      changed = true;
      fixed++;
    }
    const parent = self.parent();
    if (parent.attr('data-i18n')) {
      parent.removeAttr('data-i18n');
      changed = true;
      fixed++;
    }
  });

  if (changed) {
    fs.writeFileSync(fp, $.html({ decodeEntities: false }), 'utf8');
    console.log('Fixed ' + file);
  }
}

console.log('Total fixed elements: ' + fixed);
