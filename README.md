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

## Tech

- **Electron** — Desktop shell
- **Node.js** — Processes (child_process, tree-kill), filesystem
- **UI** — Vanilla JS, no framework, single HTML entry
