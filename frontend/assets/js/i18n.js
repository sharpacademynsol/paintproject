/**
 * Internationalization (i18n) System
 * Supports English (EN) and Arabic (AR) with RTL/LTR direction
 */

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferred_language') || 'en';
        this.translations = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the i18n system
     */
    async init() {
        if (this.isInitialized) return;

        try {
            // Load translations
            const response = await fetch('assets/translations.json');
            this.translations = await response.json();
            
            // Apply language
            this.applyLanguage(this.currentLang);
            
            this.isInitialized = true;
            console.log(`[i18n] Initialized with language: ${this.currentLang}`);
        } catch (error) {
            console.error('[i18n] Error loading translations:', error);
        }
    }

    /**
     * Get translation by key
     * @param {string} key - Dot notation key (e.g., 'header.location')
     * @param {string} lang - Language code (optional, defaults to current)
     * @returns {string} Translated text
     */
    t(key, lang = null) {
        const language = lang || this.currentLang;
        const keys = key.split('.');
        
        let value = this.translations[language];
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`[i18n] Translation not found: ${key} for language: ${language}`);
                return key;
            }
        }
        
        return value;
    }

    /**
     * Apply language to the entire page
     * @param {string} lang - Language code ('en' or 'ar')
     */
    applyLanguage(lang) {
        if (!this.translations || !this.translations[lang]) {
            console.error(`[i18n] Language not available: ${lang}`);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('preferred_language', lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update direction (RTL for Arabic, LTR for English)
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
            document.body.classList.remove('ltr');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.add('ltr');
            document.body.classList.remove('rtl');
        }

        // Update all elements with data-i18n attribute
        this.updatePageContent();

        // Update language switcher UI
        this.updateLanguageSwitcher();

        console.log(`[i18n] Language applied: ${lang}`);
    }

    /**
     * Update all translatable elements on the page
     */
    updatePageContent() {
        // Update elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // Check if it's an input placeholder
            if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translation);
            } else {
                element.textContent = translation;
            }
        });

        // Update elements with data-i18n-html attribute (for HTML content)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.t(key);
            element.innerHTML = translation;
        });

        // Update elements with data-i18n-placeholder attribute
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            element.setAttribute('placeholder', translation);
        });

        // Update elements with data-i18n-title attribute
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            element.setAttribute('title', translation);
        });

        // Update page title if exists
        const titleEl = document.querySelector('title[data-i18n]');
        const titleKey = titleEl ? titleEl.getAttribute('data-i18n') : 'site.title';
        const pageTitle = this.t(titleKey);
        if (pageTitle && pageTitle !== titleKey) {
            document.title = pageTitle;
        }
    }

    /**
     * Update language switcher UI
     */
    updateLanguageSwitcher() {
        const switchers = document.querySelectorAll('.language-switcher');
        switchers.forEach(switcher => {
            const buttons = switcher.querySelectorAll('.lang-btn');
            buttons.forEach(btn => {
                const lang = btn.getAttribute('data-lang');
                if (lang === this.currentLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }

    /**
     * Switch to a different language
     * @param {string} lang - Language code
     */
    switchLanguage(lang) {
        if (lang === this.currentLang) return;
        this.applyLanguage(lang);
        
        // Dispatch custom event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLang() {
        return this.currentLang;
    }

    /**
     * Check if current language is RTL
     * @returns {boolean}
     */
    isRTL() {
        return this.currentLang === 'ar';
    }
}

// Create global instance
const i18n = new I18nManager();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
}
