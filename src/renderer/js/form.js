(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};
  const C = window.Pumpium.Constants;
  const U = window.Pumpium.Utils;

  function createForm(dom, log, tabId) {
    let isRunning = false;

    function getStartConfig() {
      return {
        address: (dom.addressInput && dom.addressInput.value || C.DEFAULT_ADDRESS).trim(),
        port: (dom.portInput && dom.portInput.value || C.DEFAULT_PORT).trim(),
        allowCors: dom.allowCors ? dom.allowCors.checked : false,
        relaxedSecurity: dom.relaxedSecurity ? dom.relaxedSecurity.checked : false,
        sessionOverride: dom.sessionOverride ? dom.sessionOverride.checked : false,
        allowInsecure: dom.allowInsecure ? dom.allowInsecure.checked : false,
      };
    }

    if (dom.btnResetDefaults && dom.addressInput && dom.portInput) {
      dom.btnResetDefaults.addEventListener('click', () => {
        dom.addressInput.value = C.DEFAULT_ADDRESS;
        dom.portInput.value = C.DEFAULT_PORT;
      });
    }

    if (dom.filter4xx) dom.filter4xx.addEventListener('change', () => log.renderLog());
    if (dom.filter5xx) dom.filter5xx.addEventListener('change', () => log.renderLog());

    if (dom.btnStart) {
      dom.btnStart.addEventListener('click', async () => {
        if (!window.appiumApi || isRunning) return;
        log.clearLog();
        try {
          const result = await window.appiumApi.start(getStartConfig(), tabId);
          if (result && result.ok) {
            isRunning = true;
            dom.btnStart.disabled = true;
            if (dom.btnStop) dom.btnStop.disabled = false;
          } else {
            log.addLogLine(U.t('error.prefix') + (result && result.error || U.t('error.startFailed')), true);
          }
        } catch (err) {
          log.addLogLine(U.t('error.prefix') + (err && err.message || U.t('error.startFailed')), true);
        }
      });
    }

    if (dom.btnStop) {
      dom.btnStop.addEventListener('click', async () => {
        if (!window.appiumApi || !isRunning) return;
        try {
          await window.appiumApi.stop(tabId);
        } catch (err) {
          log.addLogLine(U.t('error.prefix') + (err && err.message || 'stop failed'), true);
        }
      });
    }

    if (dom.btnConnectRemote && dom.remoteUrlInput && dom.logOutputRemote) {
      dom.btnConnectRemote.addEventListener('click', () => {
        const url = dom.remoteUrlInput.value.trim();
        dom.logOutputRemote.textContent = U.t('remote.notImplemented') + (url || '—');
      });
    }

    return {
      get isRunning() { return isRunning; },
      setStopped() {
        isRunning = false;
        if (dom.btnStart) dom.btnStart.disabled = false;
        if (dom.btnStop) dom.btnStop.disabled = true;
      },
    };
  }

  window.Pumpium.Form = { create: createForm };
})();
