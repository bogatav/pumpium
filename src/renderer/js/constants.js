(function () {
  'use strict';
  const cfg = window.PUMPIUM_CONFIG || {};
  window.Pumpium = window.Pumpium || {};
  window.Pumpium.Constants = {
    TAB_LOCAL: 'local',
    TAB_REMOTE: 'remote',
    DEFAULT_ADDRESS: cfg.defaultAddress || '0.0.0.0',
    DEFAULT_PORT: cfg.defaultPort || '4723',
    RE_4XX: /\b4\d{2}\b/,
    RE_5XX: /\b5\d{2}\b/,
    LANG_CODES: { ru: 'RU', en: 'EN' },
    I18N_HEADING_LOCAL: 'toolbar.headingLocal',
    I18N_HEADING_REMOTE: 'toolbar.headingRemote',
    I18N_TAB_LABEL_REMOTE: 'toolbar.tabLabelRemote',
    I18N_TAB_LABEL_LOCAL: 'toolbar.tabLabelLocal',
    I18N_TAB_TITLE_REMOTE: 'toolbar.tabToggleTitleRemote',
    I18N_TAB_TITLE_LOCAL: 'toolbar.tabToggleTitleLocal',
    THEME_STORAGE_KEY: 'pumpium-theme',
    DEFAULT_THEME: 'darcula',
  };
})();
