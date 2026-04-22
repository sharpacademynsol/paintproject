/**
 * Helper script to update HTML files with i18n attributes
 * This script scans HTML files and suggests data-i18n attributes
 */

const fs = require('fs');
const path = require('path');

// Directory containing HTML files
const HTML_DIR = path.join(__dirname, '../frontend');
const TRANSLATIONS_FILE = path.join(__dirname, '../frontend/assets/translations.json');

// Load translations
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));

// Common text patterns to translate
const commonPatterns = [
    { selector: 'h1, h2, h3, h4, h5, h6', attribute: 'data-i18n' },
    { selector: 'p', attribute: 'data-i18n' },
    { selector: 'span:not([data-i18n])', attribute: 'data-i18n' },
    { selector: 'a:not([data-i18n]):not(.dropdown-toggle):not(.nav-link)', attribute: 'data-i18n' },
    { selector: 'button:not([data-i18n])', attribute: 'data-i18n' },
    { selector: 'label', attribute: 'data-i18n' },
    { selector: 'input[placeholder]', attribute: 'data-i18n-placeholder' },
    { selector: 'img[alt]', attribute: 'data-i18n-alt' },
];

console.log('=== i18n Implementation Helper ===\n');
console.log('This script helps identify text elements that need translation attributes.\n');

// List all HTML files
const htmlFiles = fs.readdirSync(HTML_DIR).filter(file => file.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files:\n`);
htmlFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
});

console.log('\n=== Next Steps ===');
console.log('1. Manually add data-i18n attributes to text elements in each HTML file');
console.log('2. Use the translation key format: section.element (e.g., "hero.title")');
console.log('3. Update translations.json with all translations');
console.log('4. Test the language switching functionality\n');

console.log('=== Example Usage ===');
console.log('Before: <h1>Welcome to Qatar Paint</h1>');
console.log('After:  <h1 data-i18n="hero.title">Welcome to Qatar Paint</h1>\n');

console.log('=== Translation Keys Format ===');
console.log('- header.location → Header location text');
console.log('- nav.home → Navigation home link');
console.log('- hero.title → Hero section title');
console.log('- footer.copyright → Footer copyright text\n');

console.log('The i18n system is now ready. Start adding data-i18n attributes to your HTML elements!');
