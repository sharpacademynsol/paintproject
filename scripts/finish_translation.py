import json
import time
import sys
import re
from deep_translator import GoogleTranslator

sys.stdout.reconfigure(encoding='utf-8')

TRANSLATIONS_PATH = 'frontend/assets/translations.json'

with open(TRANSLATIONS_PATH, 'r', encoding='utf-8') as f:
    translations = json.load(f)

shared_keys = ['site', 'header', 'nav', 'hero', 'services', 'about', 'footer', 'common']
unique_texts = {}

for key, en_val in translations['en'].items():
    ar_val = translations['ar'].get(key)
    is_shared = any(key == p or key.startswith(p + '.') for p in shared_keys)
    if is_shared and en_val != ar_val:
        continue
    if not ar_val or ar_val == en_val:
        if en_val not in unique_texts:
            unique_texts[en_val] = []
        unique_texts[en_val].append(key)

# Skip obvious junk
SKIP_EXACT = {
    '[email&#160;protected]',
    '© Pentu.',
    'Pentu - Painting, Building & Renovation HTML Template',
    'Sarah Brown',
    'Miriam Sherburn',
    '70 East 65th Street, New York City',
    'Brooklyn, USA',
    'Chicago, USA',
    'West 2nd lane Inner circular road Phoenix Arizona, USA',
}

texts_to_translate = []
for text in unique_texts:
    if text in SKIP_EXACT:
        continue
    texts_to_translate.append(text)

print(f'Found {len(texts_to_translate)} strings to finish translating', flush=True)

if len(texts_to_translate) == 0:
    print('Nothing left!', flush=True)
    sys.exit(0)

translator = GoogleTranslator(source='en', target='ar')
BATCH_SIZE = 40

def save():
    def deep_sort(obj):
        if not isinstance(obj, dict):
            return obj
        return {k: deep_sort(v) for k, v in sorted(obj.items())}
    t = {'en': deep_sort(translations['en']), 'ar': deep_sort(translations['ar'])}
    with open(TRANSLATIONS_PATH, 'w', encoding='utf-8') as f:
        json.dump(t, f, ensure_ascii=False, indent=2)

for i in range(0, len(texts_to_translate), BATCH_SIZE):
    batch = texts_to_translate[i:i+BATCH_SIZE]
    print(f'Batch {i//BATCH_SIZE + 1}: {len(batch)} strings', flush=True)
    
    try:
        results = translator.translate_batch(batch)
        for text, result in zip(batch, results):
            for key in unique_texts[text]:
                translations['ar'][key] = result
        print(f'  OK', flush=True)
    except Exception as e:
        print(f'  ERR: {str(e)[:80]}', flush=True)
        for text in batch:
            try:
                result = translator.translate(text)
                for key in unique_texts[text]:
                    translations['ar'][key] = result
            except Exception as e2:
                print(f'    ERR: {text[:40]}', flush=True)
    
    save()
    if i + BATCH_SIZE < len(texts_to_translate):
        time.sleep(1)

# Also fix the skipped junk - set them to English or empty
for text in SKIP_EXACT:
    if text in unique_texts:
        for key in unique_texts[text]:
            translations['ar'][key] = text

save()
print(f'\nDone! Saved to translations.json', flush=True)
