(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};

  function createTab(dom, id, applyI18nToPanel) {
    const tpl = document.getElementById('panel-local-tpl');
    if (!tpl || !dom.tabContent) return null;
    const panelEl = tpl.content.cloneNode(true).querySelector('.tab-panel');
    if (!panelEl) return null;
    panelEl.id = 'panel-' + id;
    panelEl.setAttribute('aria-labelledby', 'pill-' + id);
    dom.tabContent.appendChild(panelEl);

    const panelRefs = window.Pumpium.getDomRefsForPanel(panelEl);
    if (!panelRefs) return null;
    const log = window.Pumpium.Log.create(panelRefs);
    const form = window.Pumpium.Form.create(panelRefs, log, id);

    if (panelRefs.logSearchBtn) {
      panelRefs.logSearchBtn.addEventListener('click', function () {
        if (log.logSearchBar && log.logSearchBar.classList.contains('hidden')) {
          log.openSearch();
          if (log.searchQuery) log.renderLog();
        } else {
          log.closeSearch();
        }
      });
      if (panelRefs.logSearchInput) {
        panelRefs.logSearchInput.addEventListener('input', function () {
          log.setSearchQuery(panelRefs.logSearchInput.value);
          log.renderLog();
        });
        panelRefs.logSearchInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            log.goToMatch(e.shiftKey ? -1 : 1);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            log.closeSearch();
          }
        });
      }
      if (panelRefs.logSearchPrev) panelRefs.logSearchPrev.addEventListener('click', function () { log.goToMatch(-1); });
      if (panelRefs.logSearchNext) panelRefs.logSearchNext.addEventListener('click', function () { log.goToMatch(1); });
      if (panelRefs.logSearchClose) panelRefs.logSearchClose.addEventListener('click', function () { log.closeSearch(); });
    }

    if (typeof applyI18nToPanel === 'function') applyI18nToPanel(panelEl);

    return { panelEl: panelEl, log: log, form: form };
  }

  window.Pumpium.TabsLocal = { createTab: createTab };
})();
