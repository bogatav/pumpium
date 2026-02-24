const fs = require('fs');
const defaults = require('./defaults');

function loadSettings(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === 'object') {
      const def = defaults.getDefaultSettings();
      if (!Array.isArray(parsed.tabs)) parsed.tabs = def.tabs;
      if (typeof parsed.lang !== 'string') parsed.lang = def.lang;
      if (typeof parsed.theme !== 'string') parsed.theme = def.theme;
      return parsed;
    }
  } catch (e) {
    if (e.code !== 'ENOENT') console.warn('settings: load failed', e.message);
  }
  return defaults.getDefaultSettings();
}

function saveSettings(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn('settings: save failed', e.message);
  }
}

module.exports = { loadSettings, saveSettings };
