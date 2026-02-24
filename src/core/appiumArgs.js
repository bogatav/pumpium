const FLAGS = [
  ['allowCors', '--allow-cors'],
  ['relaxedSecurity', '--relaxed-security'],
  ['sessionOverride', '--session-override'],
  ['allowInsecure', '--allow-insecure'],
];

function buildArgs(config) {
  const args = [];
  if (config.address != null && config.address !== '') args.push('--address', config.address);
  if (config.port != null && config.port !== '') args.push('--port', String(config.port));
  FLAGS.forEach(([key, flag]) => { if (config[key]) args.push(flag); });
  return args;
}

module.exports = { buildArgs, FLAGS };
