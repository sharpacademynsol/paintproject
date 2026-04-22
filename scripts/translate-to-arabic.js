const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TRANSLATIONS_PATH = path.join(__dirname, '..', 'frontend', 'assets', 'translations.json');
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));

// Strings to skip from auto-translation (proper names, template artifacts, code)
const SKIP_PATTERNS = [
  /^[\d\s\-\+\$\.\,\(\)\%]+$/, // pure numbers/money
  /^\[email&#160;protected\]$/, // email protection artifact
  /^©?\s*Pentu\.?\s*$/, // old template brand
  /^Pentu\s*-/, // old template title
  /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/, // dates
  /^\d+\s+(Comment|Comments)$/, // comment counts
  /^\$[\d\.,]+$/, // prices
  /^[A-Z][a-z]+\s+[A-Z][a-z]+$/, // proper names (John Smith)
  /^[A-Z][a-z]+\s+[A-Z][a-z]+\s+&\s+[A-Z][a-z]+$/, // names with &
  /^info@[a-z\.]+$/, // emails
];

function shouldSkip(text) {
  if (!text || text.length < 2) return true;
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(text)) return true;
  }
  return false;
}

// Collect unique English strings that need translation
const uniqueTexts = new Map(); // text -> [keys]
const sharedKeys = ['site', 'header', 'nav', 'hero', 'services', 'about', 'footer', 'common'];

for (const [key, enVal] of Object.entries(translations.en)) {
  const arVal = translations.ar[key];
  // Skip already-translated shared keys
  const isShared = sharedKeys.some(p => key === p || key.startsWith(p + '.'));
  if (isShared && enVal !== arVal) continue;
  
  if (enVal === arVal && !shouldSkip(enVal)) {
    if (!uniqueTexts.has(enVal)) uniqueTexts.set(enVal, []);
    uniqueTexts.get(enVal).push(key);
  }
}

const textsToTranslate = Array.from(uniqueTexts.keys());
console.log(`Found ${textsToTranslate.length} unique strings to translate`);

if (textsToTranslate.length === 0) {
  console.log('Nothing to translate!');
  process.exit(0);
}

// Use Python googletrans for translation
function translateBatch(texts) {
  const pythonScript = `
from googletrans import Translator
import json
import sys

translator = Translator()
texts = json.loads(sys.argv[1])
results = {}
for text in texts:
    try:
        result = translator.translate(text, src='en', dest='ar')
        results[text] = result.text
    except Exception as e:
        results[text] = text  # fallback
        print(f"ERROR: {text} -> {e}", file=sys.stderr)
print(json.dumps(results, ensure_ascii=False))
`;
  const inputJson = JSON.stringify(texts);
  try {
    const result = execSync(`python -c "${pythonScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}" "${inputJson.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8',
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024
    });
    return JSON.parse(result);
  } catch (e) {
    console.error('Translation batch failed:', e.stderr || e.message);
    const fallback = {};
    for (const t of texts) fallback[t] = t;
    return fallback;
  }
}

// Translate in batches of 30
const BATCH_SIZE = 30;
const translated = {};

for (let i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
  const batch = textsToTranslate.slice(i, i + BATCH_SIZE);
  console.log(`Translating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(textsToTranslate.length / BATCH_SIZE)} (${batch.length} strings)...`);
  
  const batchResults = translateBatch(batch);
  Object.assign(translated, batchResults);
  
  // Small delay between batches
  if (i + BATCH_SIZE < textsToTranslate.length) {
    console.log('  Waiting 2 seconds...');
    execSync('node -e "setTimeout(() => process.exit(0), 2000)"');
  }
}

// Apply translations
let updatedCount = 0;
for (const [text, keys] of uniqueTexts) {
  const arText = translated[text] || text;
  for (const key of keys) {
    translations.ar[key] = arText;
    updatedCount++;
  }
}

// Sort and save
function deepSort(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(deepSort);
  const sorted = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = deepSort(obj[key]);
  }
  return sorted;
}

translations.en = deepSort(translations.en);
translations.ar = deepSort(translations.ar);

fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify(translations, null, 2), 'utf8');
console.log(`\n✓ Updated ${updatedCount} translation keys with Arabic text`);
console.log(`✓ Saved to translations.json`);
