# Quick Start Guide - Dual Language System

## 🚀 Test the Implementation

### Option 1: Test Page (Recommended)
1. Open browser: `http://127.0.0.1:8787/test-i18n.html`
2. Click **عربي** button in header
3. Watch the magic happen! ✨

### Option 2: Main Site
1. Open browser: `http://127.0.0.1:8787`
2. Language switcher is in the top-right corner
3. Click EN or عربي to switch

---

## 🎯 What to Look For

### When Switching to Arabic:
✅ All text changes to Arabic  
✅ Layout flips to RTL (right-to-left)  
✅ Text aligns to the right  
✅ Navigation dropdowns open from right  
✅ Language button shows active state  
✅ Page title changes to Arabic  

### When Switching to English:
✅ All text changes back to English  
✅ Layout flips to LTR (left-to-right)  
✅ Text aligns to the left  
✅ Everything returns to normal  

---

## 📝 Quick Code Reference

### Add Translation to HTML
```html
<!-- Text content -->
<h1 data-i18n="section.title">Your Text</h1>

<!-- Input placeholder -->
<input placeholder="Enter email" data-i18n-placeholder="form.email">

<!-- Button tooltip -->
<button title="Send" data-i18n-title="common.send">Submit</button>
```

### Add Translation to JSON
In `/frontend/assets/translations.json`:

```json
{
  "en": {
    "section": {
      "title": "Your English Text"
    }
  },
  "ar": {
    "section": {
      "title": "نصك بالعربية"
    }
  }
}
```

### JavaScript Usage
```javascript
// Switch language
i18n.switchLanguage('ar');

// Get current language
const lang = i18n.getCurrentLang();

// Get translation
const text = i18n.t('header.location');

// Check if RTL
if (i18n.isRTL()) {
    // Do something
}

// Listen for changes
window.addEventListener('languageChanged', (e) => {
    console.log('New language:', e.detail.language);
});
```

---

## 🔧 Files You Need

| File | Purpose |
|------|---------|
| `assets/js/i18n.js` | Core translation system |
| `assets/translations.json` | All translations |
| `assets/css/rtl-support.css` | RTL layout styles |
| `test-i18n.html` | Test page |
| `I18N_IMPLEMENTATION_GUIDE.md` | Full documentation |

---

## ⚠️ Common Issues

### Text not translating?
- Check `data-i18n` attribute spelling
- Verify key exists in `translations.json`
- Ensure `i18n.js` is loaded

### RTL layout broken?
- Confirm `rtl-support.css` is included
- Check browser console for errors
- Verify HTML `dir` attribute is set

### Language not saving?
- Check localStorage is enabled
- Look for console errors
- Ensure `i18n.init()` is called

---

## 📱 Mobile Testing

The system is fully responsive:
- Language switcher adapts to mobile
- RTL works on all screen sizes
- Touch interactions preserved
- No performance issues

---

## 🎨 Customization

### Change Language Button Style
Edit in `assets/css/rtl-support.css`:
```css
.lang-btn {
    /* Your custom styles */
}
```

### Add More Languages
1. Add to `translations.json`
2. Add button in header
3. Update i18n.js if RTL needed

### Change Default Language
In `assets/js/i18n.js`:
```javascript
this.currentLang = localStorage.getItem('preferred_language') || 'ar'; // Default to Arabic
```

---

## 📊 Current Status

✅ Core system: Complete  
✅ Header/Footer: Translated  
✅ Navigation: Translated  
✅ Test page: Ready  
✅ Documentation: Complete  
⏳ Other pages: Need data-i18n attributes  

---

## 🆘 Need Help?

1. Check `I18N_IMPLEMENTATION_GUIDE.md` for detailed docs
2. Review `test-i18n.html` for working example
3. Inspect browser console for errors
4. Verify all files are properly included

---

**Happy Translating! 🌍**
