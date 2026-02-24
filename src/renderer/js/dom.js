(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};

  window.Pumpium.getDomRefs = function getDomRefs() {
    return {
      panelHeading: document.getElementById('panel-heading'),
      tabStrip: document.getElementById('tab-strip'),
      tabContent: document.getElementById('tab-content'),
      btnTabLocal: document.getElementById('btn-tab-local'),
      btnTabRemote: document.getElementById('btn-tab-remote'),
      btnLang: document.getElementById('btn-lang'),
      langDropdown: document.getElementById('lang-dropdown'),
      btnTheme: document.getElementById('btn-theme'),
      themeDropdown: document.getElementById('theme-dropdown'),
      btnAppiumStatus: document.getElementById('btn-appium-status'),
      appiumModal: document.getElementById('appium-servers-modal'),
      appiumModalTitle: document.getElementById('appium-modal-title'),
      appiumModalList: document.getElementById('appium-modal-list'),
      appiumModalKillAll: document.getElementById('appium-modal-kill-all'),
    };
  };

  window.Pumpium.getDomRefsForPanel = function getDomRefsForPanel(panelEl) {
    if (!panelEl || !panelEl.querySelector) return null;
    function q(ref) { return panelEl.querySelector('[data-ref="' + ref + '"]'); }
    const refs = {
      addressInput: q('address'),
      portInput: q('port'),
      btnResetDefaults: q('btn-reset-defaults'),
      allowCors: q('allow-cors'),
      relaxedSecurity: q('relaxed-security'),
      sessionOverride: q('session-override'),
      allowInsecure: q('allow-insecure'),
      btnStart: q('btn-start'),
      btnStop: q('btn-stop'),
      logOutput: q('log-output'),
      filter4xx: q('filter-4xx'),
      filter5xx: q('filter-5xx'),
      logSearchBtn: q('log-search-btn'),
      logSearchBar: q('log-search-bar'),
      logSearchInput: q('log-search-input'),
      logSearchPrev: q('log-search-prev'),
      logSearchNext: q('log-search-next'),
      logSearchCount: q('log-search-count'),
      logSearchClose: q('log-search-close'),
      btnConnectRemote: q('btn-connect-remote'),
      remoteUrlInput: q('remote-url'),
      logOutputRemote: q('log-output-remote'),
    };
    return refs;
  };
})();
