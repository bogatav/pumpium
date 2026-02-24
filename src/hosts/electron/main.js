const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.setName('Pumpium');
process.title = 'Pumpium';

const config = require('./config');
const settings = require('./settings');
const { registerIpcHandlers } = require('./ipcHandlers');

let mainWindow = null;
let isQuitting = false;
const appiumProcesses = new Map();
const tabIdToPort = new Map();

const appiumRunner = require('../../core/appium/runner');

function getPreloadPath() {
  return path.join(__dirname, 'preload.js');
}

function getRendererPath(filename) {
  return path.join(__dirname, '..', '..', 'renderer', filename);
}

function getIconPath() {
  return path.join(__dirname, '..', '..', 'assets', 'icon.png');
}

function sendLogToTab(tabId, text, isStderr = false) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('appium:log', { tabId, text: String(text).trim(), isStderr });
  }
}

function notifyStoppedForTab(tabId) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('appium:stopped', { tabId });
  }
}

function stopAllAppium() {
  const entries = Array.from(appiumProcesses.entries());
  appiumProcesses.clear();
  tabIdToPort.clear();
  if (entries.length === 0) return Promise.resolve();
  return new Promise((resolve) => {
    let pending = entries.length;
    const done = () => {
      pending--;
      if (pending === 0) resolve();
    };
    entries.forEach(([, entry]) => {
      appiumRunner.stopProcess(entry.process, done);
    });
  });
}

function requestStateAndClose() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  stopAllAppium().then(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('appium:requestState');
    }
  });
}

registerIpcHandlers(ipcMain, {
  config,
  settings,
  appiumProcesses,
  tabIdToPort,
  sendLogToTab,
  notifyStoppedForTab,
  onStateReceived() {
    isQuitting = true;
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.destroy();
    else app.quit();
  },
});

function createWindow() {
  const iconPath = getIconPath();
  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(iconPath);
  }
  mainWindow = new BrowserWindow({
    title: config.window.title,
    width: config.window.width,
    height: config.window.height,
    minWidth: config.window.minWidth,
    minHeight: config.window.minHeight,
    icon: iconPath,
    webPreferences: {
      ...config.webPreferences,
      preload: getPreloadPath(),
    },
  });

  mainWindow.loadFile(getRendererPath('html/index.html'));
  mainWindow.webContents.on('did-finish-load', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('appium:initialState', settings.loadSettings());
    }
  });

  mainWindow.on('close', (e) => {
    if (isQuitting) return;
    e.preventDefault();
    requestStateAndClose();
  });

  mainWindow.on('closed', () => {
    stopAllAppium();
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  stopAllAppium();
  app.quit();
});
app.on('before-quit', (e) => {
  if (isQuitting) return;
  e.preventDefault();
  requestStateAndClose();
});
