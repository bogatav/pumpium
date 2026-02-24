const { spawn } = require('child_process');
const treeKill = require('tree-kill');
const { platform } = require('os');

const PLATFORM = platform();

function spawnProcess(command, args, options = {}) {
  return spawn(command, args, options);
}

function killProcess(pid, signal, callback) {
  if (!pid || pid <= 0) {
    if (typeof callback === 'function') callback();
    return;
  }
  treeKill(pid, signal, (err) => {
    if (err) treeKill(pid, 'SIGKILL', callback);
    else if (typeof callback === 'function') callback();
  });
}

function getProcessList() {
  if (PLATFORM === 'win32') return getProcessListWindows();
  if (PLATFORM === 'darwin' || PLATFORM === 'linux') return getProcessListUnix();
  return Promise.resolve([]);
}

function getProcessListUnix() {
  return new Promise((resolve) => {
    const proc = spawnProcess('ps', ['-eo', 'pid,args'], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', (chunk) => { out += chunk; });
    proc.on('error', () => resolve([]));
    proc.on('close', (code) => {
      if (code !== 0) { resolve([]); return; }
      const list = [];
      const re = /^\s*(\d+)\s+(.+)$/;
      out.split('\n').filter(Boolean).forEach((line) => {
        const m = line.match(re);
        if (m) {
          const pid = parseInt(m[1], 10);
          if (!isNaN(pid) && pid > 0) list.push({ pid, commandLine: m[2].trim() });
        }
      });
      resolve(list);
    });
  });
}

function getProcessListWindows() {
  return new Promise((resolve) => {
    const cmd = 'Get-CimInstance Win32_Process | ForEach-Object { $_.ProcessId.ToString() + "|||" + ($_.CommandLine ?? "") }';
    const proc = spawnProcess('powershell', ['-NoProfile', '-NonInteractive', '-Command', cmd], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let out = '';
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', (chunk) => { out += chunk; });
    proc.on('error', () => resolve([]));
    proc.on('close', (code) => {
      if (code !== 0) { resolve([]); return; }
      const list = [];
      out.split(/\r?\n/).filter(Boolean).forEach((line) => {
        const idx = line.indexOf('|||');
        if (idx === -1) return;
        const pid = parseInt(line.slice(0, idx).trim(), 10);
        const commandLine = line.slice(idx + 3).trim();
        if (!isNaN(pid) && pid > 0) list.push({ pid, commandLine });
      });
      resolve(list);
    });
  });
}

module.exports = { spawnProcess, killProcess, getProcessList };
