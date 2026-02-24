(function () {
  'use strict';
  window.Pumpium = window.Pumpium || {};
  const U = window.Pumpium.Utils;

  function createAppiumStatus(dom) {
    let detectedProcesses = [];

    function setState(state) {
      if (!dom.btnAppiumStatus) return;
      dom.btnAppiumStatus.setAttribute('data-state', state);
      dom.btnAppiumStatus.disabled = state === 'loading';
    }

    async function runCheck() {
      if (!window.appiumApi) return;
      setState('loading');
      try {
        const result = await window.appiumApi.checkRunning();
        detectedProcesses = result.processes || [];
        setState(result.found ? 'detected' : 'not-detected');
      } catch (e) {
        setState('not-detected');
        detectedProcesses = [];
      }
    }

    function openModal() {
      dom.appiumModalTitle.textContent = U.t('appiumStatus.modalTitle');
      dom.appiumModalKillAll.textContent = U.t('appiumStatus.killAll');
      dom.appiumModalList.innerHTML = '';
      detectedProcesses.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = p.pid + ' — ' + (p.name || '');
        dom.appiumModalList.appendChild(li);
      });
      dom.appiumModal.classList.remove('hidden');
      dom.appiumModal.setAttribute('aria-hidden', 'false');
      if (dom.appiumModalKillAll) dom.appiumModalKillAll.focus();
    }

    function closeModal() {
      dom.appiumModal.classList.add('hidden');
      dom.appiumModal.setAttribute('aria-hidden', 'true');
      if (dom.btnAppiumStatus) dom.btnAppiumStatus.focus();
    }

    if (dom.btnAppiumStatus) {
      runCheck();
      dom.btnAppiumStatus.addEventListener('click', () => {
        if (dom.btnAppiumStatus.getAttribute('data-state') === 'detected') openModal();
      });
    }
    if (dom.appiumModal) {
      dom.appiumModal.addEventListener('click', (e) => {
        if (e.target === dom.appiumModal) closeModal();
      });
      dom.appiumModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeModal(); e.preventDefault(); }
      });
      const modalBox = dom.appiumModal.querySelector('.modal-box');
      if (modalBox) modalBox.addEventListener('click', (e) => e.stopPropagation());
    }
    if (dom.appiumModalKillAll) {
      dom.appiumModalKillAll.addEventListener('click', async () => {
        if (!window.appiumApi || detectedProcesses.length === 0) return;
        const pids = detectedProcesses.map((p) => p.pid);
        await window.appiumApi.killPids(pids);
        closeModal();
        runCheck();
      });
    }

    return { runCheck };
  }

  window.Pumpium.AppiumStatus = { create: createAppiumStatus };
})();
