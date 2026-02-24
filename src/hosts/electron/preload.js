const { contextBridge, ipcRenderer } = require('electron');

function on(channel, callback) {
  const handler = (_, data) => callback(data);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

contextBridge.exposeInMainWorld('appiumApi', {
  start: (config, tabId) => ipcRenderer.invoke('appium:start', { config, tabId }),
  stop: (tabId) => ipcRenderer.invoke('appium:stop', tabId),
  onLog: (callback) => on('appium:log', callback),
  onStopped: (callback) => on('appium:stopped', callback),
  onInitialState: (callback) => on('appium:initialState', callback),
  onRequestState: (callback) => on('appium:requestState', callback),
  sendState: (state) => ipcRenderer.send('appium:state', state),
  checkRunning: () => ipcRenderer.invoke('appium:checkRunning'),
  killPids: (pids) => ipcRenderer.invoke('appium:killPids', { pids }),
});
