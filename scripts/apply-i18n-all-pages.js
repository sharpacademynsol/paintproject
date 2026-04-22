const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const TRANSLATIONS_PATH = path.join(FRONTEND_DIR, 'assets', 'translations.json');

// Load existing translations
let translations = { en: {}, ar: {} };
try {
  translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));
} catch (e) {
  console.log('No existing translations found, starting fresh');
}

// Ensure base structure exists
if (!translations.en) translations.en = {};
if (!translations.ar) translations.ar = {};

// Files to skip from full auto-processing (test page, or keep as-is)
const SKIP_FILES = [];

// Known shared keys mapping for header/nav/footer elements
const SHARED_KEY_MAP = {
  // Header
  'header.location': { selector: 'span:contains("Location:")', text: 'Location:' },
  'header.email': { selector: 'span:contains("Email:")', text: 'Email:' },
  'header.about': { selector: 'a[href*="about"]:not(.nav-link):not(.dropdown-item)', text: 'About' },
  'header.faq': { selector: 'a[href*="faq"]:not(.nav-link):not(.dropdown-item)', text: 'FAQ' },
  'header.testimonials': { selector: 'a[href*="testimonial"]:not(.nav-link):not(.dropdown-item)', text: 'Testimonials' },
};

// Nav items mapping
const NAV_KEY_MAP = {
  'Home': 'nav.home',
  'Pages': 'nav.pages',
  'Team': 'nav.team',
  'Request A Quote': null, // skip or add later
  'My Account': 'nav.my_account',
  'Shop': null,
  'Products': 'nav.products',
  'Product Single': 'nav.product_single',
  'Cart': 'nav.cart',
  'Checkout': 'nav.checkout',
  'Privacy Policy': 'nav.privacy',
  'Terms & Conditions': 'nav.terms',
  'Error 404': 'nav.error_404',
  'Services': 'nav.services',
  'Service Single': 'nav.service_single',
  'Pricing': 'nav.pricing',
  'Projects': null,
  'Project Single': null,
  'Blog': 'nav.blog',
  'Blog Single': 'nav.blog_single',
  'Author': 'nav.author',
  'Categories': 'nav.categories',
  'Tags': 'nav.tags',
  'Contact Us': 'nav.contact',
};

// Common footer/subscribe keys to look for
const COMMON_TEXT_KEYS = {
  'Sign up for our newsletter to get latest weekly updates & news': 'footer.newsletter_text',
  'Enter Your Email': 'footer.email_placeholder',
  'Get In Touch': 'footer.get_in_touch',
  'Our Services': 'footer.our_services',
  'Follow Us': 'footer.follow_us',
  'Privacy Policy': 'footer.privacy_policy',
  'Terms & Conditions': 'footer.terms_conditions',
  '© Qatar Paint. All Rights Reserved': 'footer.copyright',
  'All Rights Reserved': null,
  'Back to Top': 'common.back_to_top',
  'Read More': 'common.read_more',
  'Learn More': 'common.learn_more',
  'View All': 'common.view_all',
  'Submit': 'common.submit',
  'Send': 'common.send',
  'Search': 'common.search',
  'Close': 'common.close',
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 30);
}

function getPageName(filename) {
  return path.basename(filename, '.html').replace(/-/g, '_');
}

function addInfrastructure($, pageName) {
  // Add rtl-support.css if missing
  const hasRtl = $('link[href*="rtl-support"]').length > 0;
  if (!hasRtl) {
    $('link[href="assets/css/style.css"]').after('\n\t\t<link rel="stylesheet" href="assets/css/rtl-support.css">');
  }

  // Add Google Fonts if missing
  const hasFonts = $('link[href*="fonts.googleapis"]').length > 0;
  if (!hasFonts) {
    $('link[rel="icon"]').after(`
\t\t<!-- Google Fonts for Arabic -->
\t\t<link rel="preconnect" href="https://fonts.googleapis.com">
\t\t<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
\t\t<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">`);
  }

  // Add data-i18n to title
  const $title = $('title');
  if ($title.length && !$title.attr('data-i18n')) {
    const titleText = $title.text().trim();
    const key = `page.${pageName}.title`;
    $title.attr('data-i18n', key);
    if (!translations.en[key]) {
      translations.en[key] = titleText;
    }
    if (!translations.ar[key]) {
      translations.ar[key] = titleText; // placeholder
    }
  }

  // Add i18n.js script if missing
  const hasI18n = $('script[src*="i18n.js"]').length > 0;
  if (!hasI18n) {
    const $custom = $('script[src="assets/js/custom.js"]');
    if ($custom.length) {
      $custom.before('\n\t\t<script src="assets/js/i18n.js"></script>');
    } else {
      $('body').append('\n\t\t<script src="assets/js/i18n.js"></script>');
    }
  }
}

function addLanguageSwitcher($) {
  // Find the social-link div in header and add language switcher after it
  const $header = $('.header-area');
  if ($header.length) {
    const $socialLink = $header.find('.social-link').first();
    if ($socialLink.length) {
      const $parent = $socialLink.parent();
      if ($parent.find('.language-switcher').length === 0) {
        $socialLink.after(`

\t\t\t\t\t\t\t\t<!-- Language Switcher -->
\t\t\t\t\t\t\t\t<div class="language-switcher">
\t\t\t\t\t\t\t\t\t<button class="lang-btn active" data-lang="en" onclick="i18n.switchLanguage('en')">EN</button>
\t\t\t\t\t\t\t\t\t<button class="lang-btn" data-lang="ar" onclick="i18n.switchLanguage('ar')">عربي</button>
\t\t\t\t\t\t\t\t</div>`);
      }
    }
  }
}

function standardizeHeader($, pageName) {
  // Standardize location/email text with data-i18n
  const $header = $('.header-area');
  if ($header.length) {
    $header.find('span.fw-semibold').each((i, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      if (text === 'Location:' && !$el.attr('data-i18n')) {
        $el.attr('data-i18n', 'header.location');
      }
      if (text === 'Email:' && !$el.attr('data-i18n')) {
        $el.attr('data-i18n', 'header.email');
      }
    });

    // Standardize location value
    $header.find('li').each((i, li) => {
      const $li = $(li);
      const locationSpan = $li.find('span.fw-semibold:contains("Location:")');
      if (locationSpan.length) {
        const $valueSpan = $li.find('span').not('.fw-semibold').first();
        if ($valueSpan.length && !$valueSpan.attr('data-i18n')) {
          $valueSpan.attr('data-i18n', 'header.location_value');
        }
      }
    });

    // Standardize email value
    $header.find('a[href^="mailto:"]').each((i, el) => {
      const $el = $(el);
      if (!$el.attr('data-i18n') && !$el.find('span.__cf_email__').length) {
        $el.attr('data-i18n', 'header.email_value');
      }
    });

    // Standardize header links (About, FAQ, Testimonials)
    $header.find('.link a').each((i, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      if (!text) return;
      if ($el.attr('data-i18n')) return;
      
      const keyMap = {
        'About': 'header.about',
        'FAQ': 'header.faq',
        'Testimonials': 'header.testimonials',
      };
      if (keyMap[text]) {
        $el.attr('data-i18n', keyMap[text]);
      }
    });
  }
}

function standardizeNav($, pageName) {
  $('#navbar, #mobileNavbar').find('a.nav-link, a.dropdown-item').each((i, el) => {
    const $el = $(el);
    if ($el.attr('data-i18n')) return;
    
    // Skip elements that have sub-dropdown toggle (no text to translate directly)
    if ($el.hasClass('sub-dropdown')) return;
    
    const text = $el.text().trim();
    if (!text) return;
    
    if (NAV_KEY_MAP[text]) {
      $el.attr('data-i18n', NAV_KEY_MAP[text]);
    }
  });
}

function findSectionName($, el) {
  // Try to find a section identifier from parent elements
  let current = el;
  for (let i = 0; i < 10; i++) {
    current = current.parent;
    if (!current) break;
    const $current = $(current);
    const id = $current.attr('id');
    if (id && !['preloader', 'navbar', 'mobileNavbar'].includes(id)) {
      return id.replace(/-/g, '_');
    }
    const classes = ($current.attr('class') || '').split(' ').filter(c => 
      c && !c.startsWith('col-') && !c.startsWith('d-') && !c.startsWith('align-') && 
      !c.startsWith('justify-') && !c.startsWith('gap-') && !c.startsWith('m-') && 
      !c.startsWith('p-') && !c.startsWith('flex-') && !c.startsWith('row') && 
      !c.startsWith('container') && c.length > 2
    );
    if (classes.length > 0) {
      const meaningful = classes.find(c => 
        ['hero', 'banner', 'about', 'service', 'product', 'blog', 'contact', 'team', 'pricing', 'footer', 'subscribe', 'copyright', 'section', 'content', 'page', 'title', 'header'].some(k => c.toLowerCase().includes(k))
      );
      if (meaningful) return meaningful.replace(/-/g, '_');
    }
  }
  return null;
}

function autoTagBodyContent($, pageName) {
  const tagsToTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'button', 'label', 'span', 'li', 'th', 'td', 'strong', 'em', 'b', 'small'];
  const sectionCounters = {};
  const globalCounters = {};
  
  tagsToTag.forEach(tag => {
    $(tag).each((i, el) => {
      const $el = $(el);
      
      // Skip if already has data-i18n
      if ($el.attr('data-i18n') || $el.attr('data-i18n-html') || $el.attr('data-i18n-placeholder')) return;
      
      // Skip inside script/style/noscript/pre/code
      if ($el.closest('script, style, noscript, pre, code, .language-switcher').length) return;
      
      // Skip icon-only elements
      if ($el.children().length === 1 && $el.children().first().is('i, svg, img')) {
        const text = $el.text().trim();
        if (!text || text.length < 2) return;
      }
      
      // Get direct text content
      const directText = $el.contents().filter(function() {
        return this.type === 'text';
      }).text().trim();
      
      // If no direct text, but has single text node child, use that
      let textToTranslate = directText;
      if (!textToTranslate && $el.children().length === 0) {
        textToTranslate = $el.text().trim();
      }
      
      if (!textToTranslate || textToTranslate.length < 2) return;
      
      // Skip pure numbers, emails, URLs
      if (/^[\d\s\-\+\(\)\.%]+$/.test(textToTranslate)) return;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textToTranslate)) return;
      if (/^(https?:|www\.)/.test(textToTranslate)) return;
      
      // Skip if it's just CSS class names or code-like
      if (/^[a-z0-9_-]+$/i.test(textToTranslate) && textToTranslate.length < 20) return;
      
      // Skip very common template placeholder text that shouldn't be translated
      if (textToTranslate.includes('HTML Template')) return;
      
      // Check if this is a known common text
      let key = null;
      for (const [knownText, knownKey] of Object.entries(COMMON_TEXT_KEYS)) {
        if (textToTranslate === knownText && knownKey) {
          key = knownKey;
          break;
        }
      }
      
      if (!key) {
        // Generate auto key
        const section = findSectionName($, el) || 'content';
        const tagType = tag;
        const counterKey = `${section}_${tagType}`;
        if (!sectionCounters[counterKey]) sectionCounters[counterKey] = 0;
        const idx = sectionCounters[counterKey]++;
        key = `page.${pageName}.${section}.${tagType}_${idx}`;
      }
      
      // For elements that contain HTML children but also have text, use data-i18n-html
      if ($el.children().length > 0 && directText) {
        // If it has children, we need to be careful. Only tag if the text is simple
        if ($el.find('br, b, strong, i, em, span').length === $el.children().length) {
          // Mostly inline children - safe to use data-i18n-html
          // Actually, let's just use data-i18n and set textContent
          $el.attr('data-i18n', key);
        } else {
          // Has block children - probably shouldn't tag the parent
          return;
        }
      } else {
        $el.attr('data-i18n', key);
      }
      
      // Add to translations
      if (!translations.en[key]) {
        translations.en[key] = textToTranslate;
      }
      if (!translations.ar[key]) {
        translations.ar[key] = textToTranslate; // placeholder
      }
    });
  });
  
  // Handle placeholder attributes
  $('input[placeholder], textarea[placeholder]').each((i, el) => {
    const $el = $(el);
    if ($el.attr('data-i18n-placeholder')) return;
    const placeholder = $el.attr('placeholder');
    if (!placeholder || placeholder.length < 2) return;
    
    let key = null;
    for (const [knownText, knownKey] of Object.entries(COMMON_TEXT_KEYS)) {
      if (placeholder === knownText && knownKey) {
        key = knownKey;
        break;
      }
    }
    if (!key) {
      const section = findSectionName($, el) || 'form';
      if (!sectionCounters[`${section}_placeholder`]) sectionCounters[`${section}_placeholder`] = 0;
      const idx = sectionCounters[`${section}_placeholder`]++;
      key = `page.${pageName}.${section}.placeholder_${idx}`;
    }
    
    $el.attr('data-i18n-placeholder', key);
    if (!translations.en[key]) {
      translations.en[key] = placeholder;
    }
    if (!translations.ar[key]) {
      translations.ar[key] = placeholder;
    }
  });
}

function processFile(filename) {
  if (SKIP_FILES.includes(filename)) {
    console.log(`Skipping ${filename}`);
    return;
  }
  
  const filePath = path.join(FRONTEND_DIR, filename);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false, _useHtmlParser2: true });
  const pageName = getPageName(filename);
  
  console.log(`Processing ${filename}...`);
  
  // Phase 1: Infrastructure
  addInfrastructure($, pageName);
  
  // Phase 2: Language switcher
  addLanguageSwitcher($);
  
  // Phase 3: Standardize header
  standardizeHeader($, pageName);
  
  // Phase 4: Standardize nav
  standardizeNav($, pageName);
  
  // Phase 5: Auto-tag body content
  autoTagBodyContent($, pageName);
  
  // Write back
  const output = $.html({ decodeEntities: false });
  fs.writeFileSync(filePath, output, 'utf8');
  console.log(`  ✓ Updated ${filename}`);
}

// Main execution
const htmlFiles = fs.readdirSync(FRONTEND_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

console.log(`Found ${htmlFiles.length} HTML files to process\n`);

for (const file of htmlFiles) {
  processFile(file);
}

// Sort translations keys for consistency
function sortObject(obj) {
  const sorted = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key];
  }
  return sorted;
}

// Deep sort
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
console.log(`\n✓ Updated translations.json`);
console.log(`\nDone! Processed ${htmlFiles.length} files.`);
