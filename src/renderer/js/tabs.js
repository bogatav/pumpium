(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};
  const C = window.Pumpium.Constants;
  const U = window.Pumpium.Utils;

  function createTabs(dom) {
    let nextId = 1;
    const tabs = [];
    let activeTabId = null;

    function getTabById(id) {
      return tabs.find(function (t) { return t.id === id; });
    }

    function getDisplayLabel(t) {
      if (t.customTitle != null && String(t.customTitle).trim() !== '') return String(t.customTitle).trim();
      const sameType = tabs.filter(function (x) { return x.type === t.type; });
      const num = sameType.indexOf(t) + 1;
      const key = t.type === C.TAB_LOCAL ? C.I18N_TAB_LABEL_LOCAL : C.I18N_TAB_LABEL_REMOTE;
      return U.t(key) + ' ' + num;
    }

    function applyI18nToPanel(panelEl) {
      if (window.i18n && window.i18n.applyToRoot && panelEl) window.i18n.applyToRoot(panelEl);
    }

    function switchToTab(id) {
      const tab = getTabById(id);
      if (!tab) return;
      activeTabId = id;
      tabs.forEach(function (t) {
        t.panelEl.classList.toggle('tab-panel-active', t.id === id);
        t.pillEl.classList.toggle('tab-pill-active', t.id === id);
      });
      if (dom.panelHeading) {
        dom.panelHeading.textContent = tab.type === C.TAB_LOCAL
          ? U.t(C.I18N_HEADING_LOCAL)
          : U.t(C.I18N_HEADING_REMOTE);
      }
    }

    function addTab(type) {
      const id = 'tab-' + (nextId++);
      const creator = type === C.TAB_LOCAL ? window.Pumpium.TabsLocal : window.Pumpium.TabsRemote;
      const result = creator && creator.createTab ? creator.createTab(dom, id, applyI18nToPanel) : null;
      if (!result) return null;

      const pillEl = document.createElement('button');
      pillEl.type = 'button';
      pillEl.className = 'tab-pill';
      pillEl.id = 'pill-' + id;
      pillEl.setAttribute('role', 'tab');
      pillEl.setAttribute('aria-selected', 'false');
      pillEl.setAttribute('aria-controls', 'panel-' + id);
      const pillLabel = document.createElement('span');
      pillLabel.className = 'tab-pill-label';
      const pillClose = document.createElement('button');
      pillClose.type = 'button';
      pillClose.className = 'tab-pill-close';
      pillClose.setAttribute('aria-label', U.t('tabs.closeAria'));
      pillClose.textContent = '×';
      pillEl.appendChild(pillLabel);
      pillEl.appendChild(pillClose);

      const tab = {
        id: id,
        type: type,
        panelEl: result.panelEl,
        pillEl: pillEl,
        log: result.log,
        form: result.form,
        customTitle: null,
      };
      tabs.push(tab);
      pillLabel.textContent = getDisplayLabel(tab);

      pillEl.addEventListener('click', function (e) {
        if (e.target === pillClose) return;
        if (pillEl.querySelector('.tab-pill-rename-input')) return;
        switchToTab(id);
      });
      pillEl.addEventListener('dblclick', function (e) {
        if (e.target === pillClose) return;
        e.preventDefault();
        startRename(tab);
      });
      pillClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeTab(id);
      });

      if (dom.tabStrip) dom.tabStrip.appendChild(pillEl);

      switchToTab(id);
      return tab;
    }

    function startRename(tab) {
      const pillLabel = tab.pillEl.querySelector('.tab-pill-label');
      const pillClose = tab.pillEl.querySelector('.tab-pill-close');
      if (!pillLabel || !pillClose || tab.pillEl.querySelector('.tab-pill-rename-input')) return;
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'tab-pill-rename-input';
      input.value = getDisplayLabel(tab);
      input.setAttribute('aria-label', U.t('tabs.renameAria'));
      pillLabel.style.display = 'none';
      tab.pillEl.insertBefore(input, pillClose);
      input.focus();
      input.select();

      function commit() {
        if (!input.parentNode) return;
        tab.customTitle = (input.value && input.value.trim()) ? input.value.trim() : null;
        tab.pillEl.removeChild(input);
        pillLabel.style.display = '';
        pillLabel.textContent = getDisplayLabel(tab);
      }

      function cancel() {
        if (!input.parentNode) return;
        tab.pillEl.removeChild(input);
        pillLabel.style.display = '';
        pillLabel.textContent = getDisplayLabel(tab);
      }

      input.addEventListener('blur', function () { commit(); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.blur();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancel();
        }
      });
    }

    function closeTab(id) {
      const idx = tabs.findIndex(function (t) { return t.id === id; });
      if (idx === -1) return;
      const tab = tabs[idx];
      if (tab.type === C.TAB_LOCAL && tab.form && tab.form.isRunning && window.appiumApi) {
        window.appiumApi.stop(id);
      }
      tabs.splice(idx, 1);
      if (tab.panelEl && tab.panelEl.parentNode) tab.panelEl.parentNode.removeChild(tab.panelEl);
      if (tab.pillEl && tab.pillEl.parentNode) tab.pillEl.parentNode.removeChild(tab.pillEl);
      if (activeTabId === id) {
        activeTabId = tabs.length > 0 ? tabs[Math.min(idx, tabs.length - 1)].id : null;
        if (activeTabId) switchToTab(activeTabId);
        else if (dom.panelHeading) dom.panelHeading.textContent = '';
      }
    }

    function applyTabState(tab, state) {
      if (!state) return;
      tab.customTitle = (state.customTitle && String(state.customTitle).trim()) ? String(state.customTitle).trim() : null;
      const refs = window.Pumpium.getDomRefsForPanel(tab.panelEl);
      if (!refs) return;
      if (tab.type === C.TAB_LOCAL) {
        if (refs.addressInput) refs.addressInput.value = state.address != null ? state.address : C.DEFAULT_ADDRESS;
        if (refs.portInput) refs.portInput.value = state.port != null ? state.port : C.DEFAULT_PORT;
        if (refs.allowCors) refs.allowCors.checked = !!state.allowCors;
        if (refs.relaxedSecurity) refs.relaxedSecurity.checked = !!state.relaxedSecurity;
        if (refs.sessionOverride) refs.sessionOverride.checked = !!state.sessionOverride;
        if (refs.allowInsecure) refs.allowInsecure.checked = !!state.allowInsecure;
      } else {
        if (refs.remoteUrlInput) refs.remoteUrlInput.value = state.url != null ? state.url : '';
      }
      const pillLabel = tab.pillEl.querySelector('.tab-pill-label');
      if (pillLabel) pillLabel.textContent = getDisplayLabel(tab);
    }

    function addTabFromState(state) {
      const type = (state && state.type === C.TAB_REMOTE) ? C.TAB_REMOTE : C.TAB_LOCAL;
      const tab = addTab(type);
      if (tab && state) applyTabState(tab, state);
      return tab;
    }

    function loadInitialState(tabsArray) {
      if (!tabsArray || tabsArray.length === 0) {
        addTab(C.TAB_LOCAL);
        return;
      }
      tabsArray.forEach(function (state) { addTabFromState(state); });
    }

    function getAllTabsState() {
      return tabs.map(function (tab) {
        const refs = window.Pumpium.getDomRefsForPanel(tab.panelEl);
        if (!refs) return { type: tab.type, customTitle: tab.customTitle };
        if (tab.type === C.TAB_LOCAL) {
          return {
            type: C.TAB_LOCAL,
            customTitle: tab.customTitle,
            address: refs.addressInput ? refs.addressInput.value : '',
            port: refs.portInput ? refs.portInput.value : '',
            allowCors: refs.allowCors ? refs.allowCors.checked : false,
            relaxedSecurity: refs.relaxedSecurity ? refs.relaxedSecurity.checked : false,
            sessionOverride: refs.sessionOverride ? refs.sessionOverride.checked : false,
            allowInsecure: refs.allowInsecure ? refs.allowInsecure.checked : false,
          };
        }
        return {
          type: C.TAB_REMOTE,
          customTitle: tab.customTitle,
          url: refs.remoteUrlInput ? refs.remoteUrlInput.value : '',
        };
      });
    }

    if (dom.btnTabLocal) {
      dom.btnTabLocal.addEventListener('click', function () { addTab(C.TAB_LOCAL); });
    }
    if (dom.btnTabRemote) {
      dom.btnTabRemote.addEventListener('click', function () { addTab(C.TAB_REMOTE); });
    }

    function updatePanelHeadings() {
      const tab = getTabById(activeTabId);
      if (dom.panelHeading) {
        dom.panelHeading.textContent = tab
          ? (tab.type === C.TAB_LOCAL ? U.t(C.I18N_HEADING_LOCAL) : U.t(C.I18N_HEADING_REMOTE))
          : '';
      }
      tabs.forEach(function (t) {
        const pillLabel = t.pillEl.querySelector('.tab-pill-label');
        if (!pillLabel) return;
        pillLabel.textContent = getDisplayLabel(t);
      });
    }

    return {
      getTabById: getTabById,
      getActiveTabId: function () { return activeTabId; },
      getCurrentTab: function () { return getTabById(activeTabId); },
      getAllTabs: function () { return tabs.slice(); },
      switchToTab: switchToTab,
      updatePanelHeadings: updatePanelHeadings,
      loadInitialState: loadInitialState,
      getAllTabsState: getAllTabsState,
    };
  }

  window.Pumpium.Tabs = { create: createTabs };
})();
