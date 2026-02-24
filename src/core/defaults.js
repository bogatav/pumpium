const DEFAULT_PORT = '4723';
const DEFAULT_ADDRESS = '0.0.0.0';
const DEFAULT_LANG = 'en';
const DEFAULT_THEME = 'darcula';
const TAB_LOCAL = 'local';
const TAB_REMOTE = 'remote';

function getDefaultSettings() {
  return {
    lang: DEFAULT_LANG,
    theme: DEFAULT_THEME,
    tabs: [
      {
        type: TAB_LOCAL,
        customTitle: null,
        address: DEFAULT_ADDRESS,
        port: DEFAULT_PORT,
        allowCors: false,
        relaxedSecurity: false,
        sessionOverride: false,
        allowInsecure: false,
      },
    ],
  };
}

module.exports = {
  DEFAULT_PORT,
  DEFAULT_ADDRESS,
  DEFAULT_LANG,
  DEFAULT_THEME,
  TAB_LOCAL,
  TAB_REMOTE,
  getDefaultSettings,
};
