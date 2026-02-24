(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};
  window.Pumpium.Utils = {
    escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },
    escapeRegex(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    t(key) {
      return window.i18n && window.i18n.t ? window.i18n.t(key) : key;
    },
  };
})();
