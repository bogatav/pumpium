(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};
  const C = window.Pumpium.Constants;

  const INIT_STATE_DELAY_MS = 300;

  const dom = window.Pumpium.getDomRefs();
  const toolbar = window.Pumpium.Toolbar.create(dom);
  const tabs = window.Pumpium.Tabs.create(dom);
  window.Pumpium.AppiumStatus.create(dom);

  function setupAppiumIpc() {
    if (!window.appiumApi) return;
    window.appiumApi.onLog(function (data) {
      const tab = tabs.getTabById(data.tabId);
      if (tab && tab.log) tab.log.addLogLine(data.text, data.isStderr);
    });
    window.appiumApi.onStopped(function (data) {
      const tab = tabs.getTabById(data.tabId);
      if (tab && tab.form) tab.form.setStopped();
    });
    window.appiumApi.onInitialState(async function (state) {
      if (!state || typeof state !== 'object') {
        tabs.loadInitialState([]);
        return;
      }
      await window.i18n.load(state.lang || 'en');
      if (dom.btnLang) dom.btnLang.textContent = C.LANG_CODES[window.i18n.locale] || 'RU';
      toolbar.applyTheme(state.theme || C.DEFAULT_THEME);
      tabs.loadInitialState(state.tabs);
      if (typeof window.__onI18nApply === 'function') window.__onI18nApply();
    });
    window.appiumApi.onRequestState(function () {
      window.appiumApi.sendState({
        lang: window.i18n ? window.i18n.locale : 'en',
        theme: (typeof localStorage !== 'undefined' && localStorage.getItem(C.THEME_STORAGE_KEY)) || C.DEFAULT_THEME,
        tabs: tabs.getAllTabsState(),
      });
    });
  }

  function setupGlobalShortcuts() {
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const tab = tabs.getCurrentTab();
        if (!tab || tab.type !== C.TAB_LOCAL || !tab.log) return;
        if (tab.log.logSearchBar && tab.log.logSearchBar.classList.contains('hidden')) {
          tab.log.openSearch();
        } else if (tab.log.logSearchInput) {
          tab.log.logSearchInput.focus();
        }
      }
    });
  }

  window.__onI18nApply = function () { tabs.updatePanelHeadings(); };

  setupAppiumIpc();
  setupGlobalShortcuts();

  setTimeout(function () {
    if (tabs.getAllTabs().length === 0) tabs.loadInitialState([]);
  }, INIT_STATE_DELAY_MS);
})();
