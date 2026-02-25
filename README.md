<div align="center">
  <img src="https://raw.githubusercontent.com/bogatav/pumpium/main/src/assets/icon.png" width="80" alt="Pumpium" />
  <h1>Pumpium</h1>
</div>

A GUI (Electron-based) tool for managing Appium servers: starting and stopping local instances, viewing logs, and handling remote instances.

Important: made it with AI, so the code might be kinda… sloppy-ish, but it covers some of my daily tasks related to keeping track of Appium instances. I don't enjoy messing around with CLI tools, so having a GUI just makes things way easier.

I originally built it for personal use and decided to share it. If you find it interesting, you're very welcome to join the project — let's make it more powerful.

## Roadmap

1. Fix remote connection.
  - it shod be able to to restart server;
  - make some control over remote instance;
2. Add more features for log filtering.
3. Implement install, update, remove drivers and other appium stuff via Pumpium.
4. Add builds for MacOS, Windows, Linux.

## Features

- **Local server** — Set address and port, toggle `--allow-cors`, `--relaxed-security`, `--session-override`, `--allow-insecure`, Start/Stop buttons, log with 4xx/5xx filters and search (Ctrl+F).
- **Remote mode** — Tab with server URL and Connect button (in development).
- **Tabs** — Multiple servers in one window (browser-style), rename tabs by double-clicking the title.
- **Settings** — Language (EN/RU), themes (Darcula, macOS Dark, Quite Light).
- **Appium status** — Button shows whether Appium is running on the system; modal lists processes and lets you kill them.

Supported on **Windows**, **macOS**, and **Linux**.

## Install & run via source

```bash
git clone https://github.com/bogatav/pumpium.git
cd pumpium
npm install
npm start
```

## Building installers

- **macOS** (single DMG for Apple Silicon and Intel):  
  `npm run build:mac`  
  Output: `dist/Pumpium-1.0.0.dmg` — open it and drag the app to Applications.

- **Windows 10/11**:  
  `npm run build:win` — installer + portable .exe in `dist/`. Portable only: `npm run build:win:portable`.

- **Linux** (Ubuntu, Debian, Arch, etc.):  
  `npm run build:linux`  
  Output: AppImage and .deb in `dist/`.

macOS code signing and notarization are configured via environment variables (see comments in `electron-builder.config.js`).

## Tech

- **Electron** — Desktop shell
- **Node.js** — Processes (child_process, tree-kill), filesystem
- **UI** — Vanilla JS, no framework, single HTML entry
