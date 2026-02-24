(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};

  function createTab(dom, id, applyI18nToPanel) {
    const tpl = document.getElementById('panel-remote-tpl');
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

    if (typeof applyI18nToPanel === 'function') applyI18nToPanel(panelEl);

    return { panelEl: panelEl, log: log, form: form };
  }

  window.Pumpium.TabsRemote = { createTab: createTab };
})();
