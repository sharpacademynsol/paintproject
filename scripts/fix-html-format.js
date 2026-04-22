const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

const VOID_ELEMENTS = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
];

function fixHtml(html) {
  // Fix DOCTYPE
  html = html.replace(/<!DOCTYPE\s*>/i, '<!DOCTYPE html>');
  
  // Fix self-closing void elements that got expanded
  // Pattern: <tag ...></tag> where tag is a void element
  for (const tag of VOID_ELEMENTS) {
    const regex = new RegExp(`<(${tag}\\b[^>]*)></${tag}>`, 'gi');
    html = html.replace(regex, '<$1>');
  }
  
  return html;
}

const htmlFiles = fs.readdirSync(FRONTEND_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

for (const file of htmlFiles) {
  const filePath = path.join(FRONTEND_DIR, file);
  const html = fs.readFileSync(filePath, 'utf8');
  const fixed = fixHtml(html);
  if (fixed !== html) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`Fixed ${file}`);
  } else {
    console.log(`OK ${file}`);
  }
}

console.log('Done!');
