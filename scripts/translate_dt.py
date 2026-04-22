import json
import time
import sys
import os
from deep_translator import GoogleTranslator

# Fix console encoding on Windows
sys.stdout.reconfigure(encoding='utf-8')

TRANSLATIONS_PATH = 'frontend/assets/translations.json'

with open(TRANSLATIONS_PATH, 'r', encoding='utf-8') as f:
    translations = json.load(f)

SKIP_PATTERNS = [
    r'^[\d\s\-\+\$\.\,\(\)\%]+$',
    r'^\[email&#160;protected\]$',
    r'^©?\s*Pentu\.?\s*$',
    r'^Pentu\s*-',
    r'^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$',
    r'^\d+\s+(Comment|Comments)$',
    r'^\$[\d\.,]+$',
    r'^[A-Z][a-z]+\s+[A-Z][a-z]+$',
    r'^[A-Z][a-z]+\s+[A-Z][a-z]+\s+&\s+[A-Z][a-z]+$',
    r'^info@[a-z\.]+$',
]

import re

def should_skip(text):
    if not text or len(text) < 2:
        return True
    for pattern in SKIP_PATTERNS:
        if re.match(pattern, text):
            return True
    return False

shared_keys = ['site', 'header', 'nav', 'hero', 'services', 'about', 'footer', 'common']
unique_texts = {}

for key, en_val in translations['en'].items():
    ar_val = translations['ar'].get(key)
    is_shared = any(key == p or key.startswith(p + '.') for p in shared_keys)
    if is_shared and en_val != ar_val:
        continue
    if en_val == ar_val and not should_skip(en_val):
        if en_val not in unique_texts:
            unique_texts[en_val] = []
        unique_texts[en_val].append(key)

texts_to_translate = list(unique_texts.keys())
print(f'Found {len(texts_to_translate)} unique strings to translate', flush=True)

if len(texts_to_translate) == 0:
    print('Nothing to translate!', flush=True)
    sys.exit(0)

translator = GoogleTranslator(source='en', target='ar')
translated = {}
BATCH_SIZE = 30
errors = 0

for i in range(0, len(texts_to_translate), BATCH_SIZE):
    batch = texts_to_translate[i:i+BATCH_SIZE]
    print(f'Batch {i//BATCH_SIZE + 1}/{(len(texts_to_translate) + BATCH_SIZE - 1)//BATCH_SIZE}: {len(batch)} strings', flush=True)
    
    for text in batch:
        try:
            result = translator.translate(text)
            translated[text] = result
            print(f'  OK: {text[:40]}', flush=True)
        except Exception as e:
            print(f'  ERR: {text[:40]} -> {str(e)[:60]}', flush=True)
            translated[text] = text
            errors += 1
        time.sleep(0.3)
    
    if i + BATCH_SIZE < len(texts_to_translate):
        time.sleep(1)

updated_count = 0
for text, keys in unique_texts.items():
    ar_text = translated.get(text, text)
    for key in keys:
        translations['ar'][key] = ar_text
        updated_count += 1

def deep_sort(obj):
    if not isinstance(obj, dict):
        return obj
    return {k: deep_sort(v) for k, v in sorted(obj.items())}

translations['en'] = deep_sort(translations['en'])
translations['ar'] = deep_sort(translations['ar'])

with open(TRANSLATIONS_PATH, 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print(f'\nUpdated {updated_count} keys ({errors} errors)', flush=True)
print('Saved to translations.json', flush=True)
