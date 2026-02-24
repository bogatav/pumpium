const system = require('../system');

const APPIUM_PATTERN = /appium/i;
const MAX_NAME_LEN = 80;

function getRunningAppiumProcesses() {
  return system.getProcessList().then((list) => {
    const processes = list
      .filter((p) => APPIUM_PATTERN.test(p.commandLine))
      .map((p) => ({ pid: p.pid, name: (p.commandLine || '').trim().slice(0, MAX_NAME_LEN) }));
    return { found: processes.length > 0, processes };
  });
}

function killPids(pids) {
  if (!Array.isArray(pids) || pids.length === 0) return Promise.resolve({ ok: true });
  const killOne = (pid) => new Promise((resolve) => system.killProcess(pid, 'SIGTERM', resolve));
  return Promise.all(pids.map(killOne)).then(() => ({ ok: true }));
}

module.exports = { getRunningAppiumProcesses, killPids };
