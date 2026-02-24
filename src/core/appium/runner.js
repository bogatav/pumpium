const system = require('../system');
const { buildArgs } = require('../appiumArgs');

function pipeStreamToLog(stream, isStderr, sendLog) {
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    String(chunk).split('\n').filter(Boolean).forEach((line) => sendLog(line, isStderr));
  });
}

function attachProcessHandlers(proc, callbacks) {
  proc.on('error', (err) => callbacks.onError(err));
  proc.on('exit', (code) => callbacks.onExit(code));
}

function stopProcess(proc, notifyStopped) {
  if (!proc) return;
  system.killProcess(proc.pid, 'SIGTERM', notifyStopped);
}

function start(config, sendLog, callbacks) {
  const args = buildArgs(config);
  sendLog('Running with params: npx appium ' + args.join(' '), false);
  try {
    const proc = system.spawnProcess('npx', ['appium', ...args], { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    pipeStreamToLog(proc.stdout, false, sendLog);
    pipeStreamToLog(proc.stderr, true, sendLog);
    attachProcessHandlers(proc, callbacks);
    return { ok: true, process: proc };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { start, stopProcess };
