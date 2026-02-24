(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};
  const C = window.Pumpium.Constants;

  function createToolbar(dom) {
    function applyTheme(themeId) {
      const themes = window.THEMES;
      if (!themes || !themes[themeId]) return;
      const theme = themes[themeId];
      const root = document.documentElement;
      for (const key in theme) {
        if (Object.prototype.hasOwnProperty.call(theme, key)) {
          root.style.setProperty('--' + key, theme[key]);
        }
      }
      try { localStorage.setItem(C.THEME_STORAGE_KEY, themeId); } catch (e) {}
    }

    function bindLanguageDropdown() {
      dom.btnLang.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !dom.langDropdown.classList.contains('hidden');
        dom.langDropdown.classList.toggle('hidden', isOpen);
        dom.btnLang.setAttribute('aria-expanded', !isOpen);
      });
      dom.langDropdown.querySelectorAll('.toolbar-dropdown-item').forEach((item) => {
        item.addEventListener('click', () => {
          const lang = item.getAttribute('data-lang');
          if (lang && C.LANG_CODES[lang]) {
            window.i18n.load(lang).then(() => {
              dom.btnLang.textContent = C.LANG_CODES[lang];
              dom.langDropdown.classList.add('hidden');
              dom.btnLang.setAttribute('aria-expanded', 'false');
            });
          }
        });
      });
    }

    function bindThemeDropdown() {
      dom.btnTheme.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !dom.themeDropdown.classList.contains('hidden');
        dom.themeDropdown.classList.toggle('hidden', isOpen);
        dom.btnTheme.setAttribute('aria-expanded', !isOpen);
      });
      dom.themeDropdown.querySelectorAll('.toolbar-dropdown-item').forEach((item) => {
        item.addEventListener('click', () => {
          const themeId = item.getAttribute('data-theme');
          if (themeId && window.THEMES && window.THEMES[themeId]) {
            applyTheme(themeId);
            dom.themeDropdown.classList.add('hidden');
            dom.btnTheme.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }

    function closeDropdowns() {
      dom.langDropdown.classList.add('hidden');
      dom.btnLang.setAttribute('aria-expanded', 'false');
      dom.themeDropdown.classList.add('hidden');
      dom.btnTheme.setAttribute('aria-expanded', 'false');
    }

    bindLanguageDropdown();
    bindThemeDropdown();
    document.addEventListener('click', closeDropdowns);

    applyTheme(localStorage.getItem(C.THEME_STORAGE_KEY) || C.DEFAULT_THEME);

    return { applyTheme };
  }

  window.Pumpium.Toolbar = { create: createToolbar };
})();
