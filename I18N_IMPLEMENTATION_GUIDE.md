# Dual Language Implementation Guide (English & Arabic)

## Overview
This guide explains the dual language (i18n) system implemented for the Qatar Paint website, supporting English (EN) and Arabic (AR) with automatic RTL/LTR layout switching.

## What's Been Implemented

### 1. Core Files Created

#### `/frontend/assets/translations.json`
- Contains all translation keys and values for both English and Arabic
- Organized by sections: header, nav, hero, services, about, footer, common
- Easy to extend with new translations

#### `/frontend/assets/js/i18n.js`
- JavaScript i18n management system
- Handles language switching
- Automatically applies RTL/LTR direction
- Updates page content dynamically
- Stores language preference in localStorage

#### `/frontend/assets/css/rtl-support.css`
- Complete RTL layout support
- Flips margins, padding, text alignment for Arabic
- Language switcher styling
- Form controls RTL support
- Navigation and footer RTL adjustments

### 2. Components Updated

#### `/frontend/components/header.html`
- Added language switcher with EN/عربي buttons
- Added data-i18n attributes to header text

#### `/frontend/components/footer.html`
- Added data-i18n attributes to all footer text
- Added data-i18n-placeholder for form inputs

#### `/frontend/index.html`
- Added RTL support CSS link
- Added Google Fonts for Arabic (Cairo, Tajawal)
- Added i18n.js script
- Added data-i18n attributes to header and navigation

## How It Works

### Language Switching Flow
1. User clicks language button (EN or عربي)
2. `i18n.switchLanguage('ar')` or `i18n.switchLanguage('en')` is called
3. System updates:
   - HTML `lang` attribute
   - HTML `dir` attribute (rtl/ltr)
   - Body class (rtl/ltr)
   - All elements with `data-i18n` attributes
   - Language switcher UI
4. Preference saved to localStorage
5. Custom event `languageChanged` dispatched

### Translation Attributes

#### `data-i18n`
For text content:
```html
<h1 data-i18n="hero.title">Transform Your Space</h1>
<p data-i18n="header.location">Location:</p>
```

#### `data-i18n-placeholder`
For input placeholders:
```html
<input type="email" data-i18n-placeholder="footer.email_placeholder" placeholder="Enter Your Email">
```

#### `data-i18n-title`
For title attributes:
```html
<button data-i18n-title="common.send" title="Send">Submit</button>
```

#### `data-i18n-html`
For HTML content (use carefully):
```html
<div data-i18n-html="section.content"></div>
```

## How to Add Translations to Other Pages

### Step 1: Add data-i18n Attributes
For each text element in your HTML, add the appropriate data-i18n attribute:

```html
<!-- Before -->
<h2>Our Services</h2>
<p>We offer professional painting services</p>

<!-- After -->
<h2 data-i18n="services.section_title">Our Services</h2>
<p data-i18n="services.description">We offer professional painting services</p>
```

### Step 2: Update translations.json
Add the translation keys to both English and Arabic sections:

```json
{
  "en": {
    "services": {
      "section_title": "Our Services",
      "description": "We offer professional painting services"
    }
  },
  "ar": {
    "services": {
      "section_title": "خدماتنا",
      "description": "نحن نقدم خدمات دهان احترافية"
    }
  }
}
```

### Step 3: Include Required Files
Make sure each HTML page includes:

```html
<head>
    <!-- CSS Files -->
    <link rel="stylesheet" href="assets/css/rtl-support.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Your content with data-i18n attributes -->
    
    <!-- JS Files -->
    <script src="assets/js/i18n.js"></script>
</body>
```

## Translation Key Naming Convention

Use dot notation with section prefixes:
- `header.*` - Header area text
- `nav.*` - Navigation menu items
- `hero.*` - Hero section content
- `services.*` - Services section
- `about.*` - About section
- `footer.*` - Footer area
- `common.*` - Common/reusable text
- `forms.*` - Form labels and messages
- `buttons.*` - Button text
- `messages.*` - System messages

## Testing the Implementation

### 1. Basic Functionality
```javascript
// Check current language
console.log(i18n.getCurrentLang());

// Switch language
i18n.switchLanguage('ar');

// Check if RTL
console.log(i18n.isRTL());

// Get translation
console.log(i18n.t('header.location'));
```

### 2. Listen for Language Changes
```javascript
window.addEventListener('languageChanged', (e) => {
    console.log('Language changed to:', e.detail.language);
    // Perform additional actions if needed
});
```

### 3. Manual Testing Checklist
- [ ] Click EN button → Page switches to English (LTR)
- [ ] Click عربي button → Page switches to Arabic (RTL)
- [ ] All text updates correctly
- [ ] Layout flips properly in RTL mode
- [ ] Language preference persists on page reload
- [ ] Forms and inputs work in both languages
- [ ] Navigation dropdowns work in both languages
- [ ] Swiper sliders work in both languages

## Arabic Font Support

The system uses Google Fonts optimized for Arabic:
- **Cairo** - Modern, clean Arabic font
- **Tajawal** - Professional Arabic typeface

These fonts are automatically applied when Arabic is selected.

## RTL Layout Adjustments

The RTL CSS handles:
- Text direction (right-to-left)
- Margin/padding flipping (ms-* ↔ me-*)
- Text alignment (left ↔ right)
- Border direction
- Dropdown menu positioning
- Form input direction
- Navigation layout
- Footer widget alignment

## Adding New Languages

To add a new language (e.g., French):

1. Add to translations.json:
```json
{
  "fr": {
    "header": {
      "location": "Emplacement:",
      // ... other translations
    }
  }
}
```

2. Add button to language switcher:
```html
<button class="lang-btn" data-lang="fr" onclick="i18n.switchLanguage('fr')">FR</button>
```

3. Update i18n.js if needed for LTR/RTL settings

## Common Issues & Solutions

### Issue: Text not translating
**Solution:** Check that:
- data-i18n attribute is correct
- Translation key exists in translations.json
- i18n.js is loaded before custom.js

### Issue: RTL layout broken
**Solution:** Check that:
- rtl-support.css is loaded
- HTML dir attribute is set correctly
- No conflicting CSS overrides

### Issue: Language not persisting
**Solution:** Check that:
- localStorage is enabled in browser
- i18n.init() is called on page load
- No errors in console

## Performance Considerations

- Translations are loaded once and cached
- Language preference stored in localStorage
- No page reload required for language switching
- Minimal JavaScript overhead
- CSS handles RTL layout (no JS needed)

## Next Steps

1. **Complete All Pages**: Add data-i18n attributes to all 22 HTML pages
2. **Expand Translations**: Add missing translation keys to translations.json
3. **Test Thoroughly**: Test all pages in both languages
4. **Optimize**: Consider lazy-loading translations for large sites
5. **SEO**: Implement hreflang tags for multi-language SEO

## Support Files

- `/scripts/update-i18n.js` - Helper script to identify translatable elements
- `/frontend/assets/translations.json` - All translations
- `/frontend/assets/js/i18n.js` - i18n system
- `/frontend/assets/css/rtl-support.css` - RTL styles

## Quick Reference

### Switch Language Programmatically
```javascript
i18n.switchLanguage('ar'); // Switch to Arabic
i18n.switchLanguage('en'); // Switch to English
```

### Get Current Language
```javascript
const lang = i18n.getCurrentLang(); // 'en' or 'ar'
```

### Check RTL Mode
```javascript
if (i18n.isRTL()) {
    // Do something for RTL
}
```

### Translate in JavaScript
```javascript
const text = i18n.t('header.location'); // Get translated text
```

---

**Implementation Status**: Core system complete, ready for page-by-page translation attribute addition.
