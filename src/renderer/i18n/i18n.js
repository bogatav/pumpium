(function () {
  'use strict';

  const STORAGE_KEY = 'pumpium-lang';
  const DEFAULT_LANG = 'en';

  window.i18n = {
    locale: DEFAULT_LANG,
    strings: {},

    t(key) {
      return this.strings[key] != null ? this.strings[key] : key;
    },

    async load(lang) {
      const l = lang || this.locale;
      try {
        const res = await fetch('../i18n/locales/' + l + '.json');
        if (!res.ok) return;
        this.strings = await res.json();
        this.locale = l;
        if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, l);
        document.documentElement.lang = l === 'en' ? 'en' : 'ru';
        this.apply();
        if (typeof window.__onI18nApply === 'function') window.__onI18nApply();
      } catch (e) {
        console.warn('i18n: failed to load locale', l, e);
      }
    },

    applyToRoot(rootEl) {
      const root = rootEl || document;
      root.querySelectorAll('[data-i18n]').forEach(function (el) {
        const key = el.getAttribute('data-i18n');
        if (key) el.textContent = window.i18n.t(key);
      });
      root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) el.placeholder = window.i18n.t(key);
      });
      root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
        const key = el.getAttribute('data-i18n-title');
        if (key) el.title = window.i18n.t(key);
      });
    },

    apply() {
      this.applyToRoot(document);
    },
  };
})();
