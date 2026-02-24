const defaults = require('../../core/defaults');

module.exports = {
  window: {
    title: 'Pumpium - Appium Server GUI Manager',
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
  },
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
  },
  appium: {
    defaultPort: defaults.DEFAULT_PORT,
    defaultAddress: defaults.DEFAULT_ADDRESS,
  },
  settings: {
    defaultLang: defaults.DEFAULT_LANG,
    defaultTheme: defaults.DEFAULT_THEME,
  },
  errors: {
    portInUse: 'Port already in use',
  },
};
