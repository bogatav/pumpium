const path = require('path');
const { app } = require('electron');
const settingsFile = require('../../core/settingsFile');

const FILENAME = 'pumpium-settings.json';

function getSettingsPath() {
  return path.join(app.getAppPath(), FILENAME);
}

function loadSettings() {
  return settingsFile.loadSettings(getSettingsPath());
}

function saveSettings(data) {
  settingsFile.saveSettings(getSettingsPath(), data);
}

module.exports = { loadSettings, saveSettings };
