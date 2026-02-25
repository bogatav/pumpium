/**
 * electron-builder config for Pumpium.
 *
 * macOS code signing and notarization (set before building):
 *   CSC_LINK — path to .p12 certificate (or base64 in CSC_LINK_BASE64)
 *   CSC_KEY_PASSWORD — certificate password
 *   APPLE_ID — Apple ID (email)
 *   APPLE_APP_SPECIFIC_PASSWORD — app-specific password for notarization
 *   APPLE_TEAM_ID — Team ID in Apple Developer
 *
 * Windows (optional): CSC_LINK, CSC_KEY_PASSWORD for signing .exe
 */

module.exports = {
  appId: 'com.pumpium.app',
  productName: 'Pumpium',
  directories: {
    output: 'dist',
  },

  // macOS: single universal build (Apple Silicon + Intel). Remove --universal in build:mac for separate DMGs.
  mac: {
    category: 'public.app-category.developer-tools',
    target: 'dmg',
    icon: 'src/assets/icon.png',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    // Signing: uses CSC_* env vars
    // Notarization: when APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID are set
    notarize: process.env.APPLE_TEAM_ID
      ? { teamId: process.env.APPLE_TEAM_ID }
      : false,
  },

  dmg: {
    title: 'Pumpium',
    contents: [
      { x: 130, y: 220 },
      { x: 410, y: 220, type: 'link', path: '/Applications' },
    ],
  },

  // nsis = installer; portable = single .exe, no install (standalone)
  win: {
    target: [
      { target: 'nsis', arch: ['x64'] },
      { target: 'portable', arch: ['x64'] },
    ],
    icon: 'src/assets/icon.png',
  },

  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    installerLanguages: ['ru_RU', 'en_US'],
  },

  linux: {
    target: [
      { target: 'AppImage', arch: ['x64', 'arm64'] },
      { target: 'deb', arch: ['x64', 'arm64'] },
    ],
    icon: 'src/assets/icon.png',
    category: 'Development',
  },
};
