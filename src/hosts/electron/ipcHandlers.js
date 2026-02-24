const appiumRunner = require('../../core/appium/runner');
const appiumDetector = require('../../core/appium/detector');

function registerIpcHandlers(ipcMain, ctx) {
  const { config, settings, appiumProcesses, tabIdToPort, sendLogToTab, notifyStoppedForTab } = ctx;

  ipcMain.handle('appium:start', (_, payload) => {
    try {
      const { config: userConfig, tabId } = payload || {};
      const port = String((userConfig && userConfig.port) || config.appium.defaultPort);
      if (appiumProcesses.has(port)) {
        return { ok: false, error: config.errors.portInUse };
      }
      const sendLog = (text, isStderr) => sendLogToTab(tabId, text, isStderr);
      const notifyStopped = () => {
        appiumProcesses.delete(port);
        tabIdToPort.delete(tabId);
        notifyStoppedForTab(tabId);
      };
      const result = appiumRunner.start(userConfig, sendLog, {
        onError: (err) => {
          sendLog(`Start error: ${err.message}`, true);
          notifyStopped();
        },
        onExit: (code) => {
          if (code != null && code !== 0) sendLog(`Process exited with code ${code}`, true);
          notifyStopped();
        },
      });
      if (result.ok) {
        appiumProcesses.set(port, { process: result.process, tabId });
        tabIdToPort.set(tabId, port);
      }
      return result.ok ? { ok: true } : { ok: false, error: result.error };
    } catch (err) {
      console.error('appium:start', err);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('appium:stop', (_, tabId) => {
    try {
      const port = tabIdToPort.get(tabId);
      if (port == null) return { ok: true };
      const entry = appiumProcesses.get(port);
      if (!entry) return { ok: true };
      appiumProcesses.delete(port);
      tabIdToPort.delete(tabId);
      appiumRunner.stopProcess(entry.process, () => notifyStoppedForTab(tabId));
      return { ok: true };
    } catch (err) {
      console.error('appium:stop', err);
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('appium:checkRunning', () => {
    try {
      return appiumDetector.getRunningAppiumProcesses();
    } catch (err) {
      console.error('appium:checkRunning', err);
      return { found: false, processes: [] };
    }
  });

  ipcMain.handle('appium:killPids', (_, { pids }) => {
    try {
      return appiumDetector.killPids(pids);
    } catch (err) {
      console.error('appium:killPids', err);
      return Promise.resolve({ ok: false });
    }
  });

  ipcMain.on('appium:state', (_, state) => {
    if (state && typeof state === 'object') settings.saveSettings(state);
    ctx.onStateReceived();
  });
}

module.exports = { registerIpcHandlers };
