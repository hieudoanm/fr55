#!/usr/bin/env node
/**
 * Connect IQ runtime preview: find the SDK, build the nearest buildable
 * package, start the simulator, and launch the PRG with `monkeydo`.
 *
 * Ported from `packages/extensions/vscode/src/runtime-preview.ts`. Zed cannot expose
 * VS Code-style commands, so this runs as a task instead.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';

const DEFAULT_DEVICE = 'fr55';

const USAGE = `Usage: monkey-c-preview [options] [file]

Options:
  --file <path>       Monkey C/Jungle file in a buildable package (default: $ZED_FILE or cwd)
  --sdk <path>        Connect IQ SDK root containing bin/monkeyc
  --key <path>        Developer key (.der or PEM)
  --device <id>       Connect IQ device id (default: ${DEFAULT_DEVICE})
  --build-only        Build the PRG without starting the simulator
  --no-simulator      Do not start the simulator (use an already running one)
  --wait <ms>         Simulator startup delay in milliseconds (default: 2500)
  -h, --help          Show this help

Environment:
  MONKEYC_SDK_PATH        SDK root (overridden by --sdk)
  MONKEYC_DEVELOPER_KEY   Developer key path (overridden by --key)
  MONKEYC_DEVICE          Device id (overridden by --device)
`;

/**
 * @param {string} value
 * @returns {string}
 */
function expandHome(value) {
  if (value === '~') return homedir();
  if (value.startsWith('~/')) return join(homedir(), value.slice(2));
  return value;
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function exists(value) {
  try {
    return existsSync(value);
  } catch {
    return false;
  }
}

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const options = {
    file: process.env.ZED_FILE || process.cwd(),
    sdk: process.env.MONKEYC_SDK_PATH || undefined,
    key: process.env.MONKEYC_DEVELOPER_KEY || undefined,
    device: process.env.MONKEYC_DEVICE || process.env.MONKEYC_PREVIEW_DEVICE || DEFAULT_DEVICE,
    buildOnly: false,
    startSimulator: true,
    waitMs: 2500,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const [name, inlineValue] = arg.startsWith('--') && arg.includes('=')
      ? [arg.slice(0, arg.indexOf('=')), arg.slice(arg.indexOf('=') + 1)]
      : [arg, undefined];
    const value = () => {
      if (inlineValue != null) return inlineValue;
      i += 1;
      if (i >= argv.length) throw new Error(`${name} requires a value`);
      return argv[i];
    };

    switch (name) {
      case '--file':
        options.file = value();
        break;
      case '--sdk':
        options.sdk = value();
        break;
      case '--key':
        options.key = value();
        break;
      case '--device':
        options.device = value();
        break;
      case '--build-only':
        options.buildOnly = true;
        options.startSimulator = false;
        break;
      case '--no-simulator':
        options.startSimulator = false;
        break;
      case '--wait': {
        const waitMs = Number.parseInt(value(), 10);
        if (!Number.isFinite(waitMs) || waitMs < 0) throw new Error('--wait must be a non-negative integer');
        options.waitMs = waitMs;
        break;
      }
      case '-h':
      case '--help':
        process.stdout.write(USAGE);
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
        options.file = arg;
        break;
    }
  }

  return options;
}

/**
 * @param {string} sdk
 * @returns {string | null}
 */
function executable(sdk, name) {
  const candidates = process.platform === 'win32' ? [`${name}.bat`, `${name}.exe`, name] : [name];
  for (const candidate of candidates) {
    const file = join(sdk, 'bin', candidate);
    if (exists(file)) return file;
  }
  return null;
}

/**
 * @param {string} sdk
 * @returns {boolean}
 */
function isSdkRoot(sdk) {
  return executable(sdk, 'monkeyc') != null;
}

/**
 * @returns {string[]}
 */
function connectIqDirs() {
  const home = homedir();
  const dirs = [
    join(home, 'Library', 'Application Support', 'Garmin', 'ConnectIQ'),
    join(home, '.Garmin', 'ConnectIQ'),
  ];
  if (process.env.LOCALAPPDATA) dirs.push(join(process.env.LOCALAPPDATA, 'Garmin', 'ConnectIQ'));
  if (process.env.APPDATA) dirs.push(join(process.env.APPDATA, 'Garmin', 'ConnectIQ'));
  return [...new Set(dirs)];
}

/**
 * @param {string | undefined} configured
 * @returns {string | null}
 */
function findSdk(configured) {
  if (configured) {
    const sdk = resolve(expandHome(configured));
    if (isSdkRoot(sdk)) return sdk;
    throw new Error(`Connect IQ SDK not found at ${sdk} (expected bin/monkeyc).`);
  }

  for (const root of connectIqDirs()) {
    const currentCfg = join(root, 'current-sdk.cfg');
    if (exists(currentCfg)) {
      const sdk = readFileSync(currentCfg, 'utf8').trim();
      if (sdk && isSdkRoot(sdk)) return sdk;
    }
  }

  for (const root of connectIqDirs()) {
    const sdksDir = join(root, 'Sdks');
    if (!exists(sdksDir)) continue;
    const entries = readdirSync(sdksDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(sdksDir, entry.name))
      .filter(isSdkRoot)
      .sort()
      .reverse();
    if (entries[0]) return entries[0];
  }

  return null;
}

/**
 * @param {string} startPath
 * @returns {{ dir: string, jungle: string, manifest: string } | null}
 */
function findBuildable(startPath) {
  const start = resolve(expandHome(startPath));
  let dir = start;
  try {
    if (statSync(start).isFile()) dir = dirname(start);
  } catch {
    // The path may not exist yet (for example an unsaved buffer path); walk up
    // from its containing directory.
    dir = dirname(start);
  }

  for (let i = 0; i < 8; i += 1) {
    const jungle = join(dir, 'monkey.jungle');
    const manifest = join(dir, 'manifest.xml');
    if (exists(jungle) && exists(manifest)) return { dir, jungle, manifest };
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * @param {string | undefined} configured
 * @returns {string}
 */
function ensureKey(configured) {
  if (configured) {
    const key = resolve(expandHome(configured));
    if (exists(key)) return key;
    throw new Error(`Developer key not found at ${key}.`);
  }

  const home = homedir();
  const candidates = [
    join(home, '.config', 'garmin', 'developer_key'),
    join(home, '.config', 'garmin', 'developer_key.der'),
    join(home, 'Library', 'Application Support', 'Garmin', 'ConnectIQ', 'developer_key.der'),
    join(home, 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'hieudoanm.monkey-c', 'developer_key.der'),
    join(home, 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'hieudoanm.monkey-c', 'developer_key.der'),
  ];
  for (const candidate of candidates) if (exists(candidate)) return candidate;

  throw new Error(
    'No developer key found. Set MONKEYC_DEVELOPER_KEY (or pass --key), or place a key at ~/.config/garmin/developer_key. Generate one with the official Garmin Monkey C extension or the Connect IQ SDK.',
  );
}

/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {string} cwd
 * @returns {Promise<void>}
 */
function run(cmd, args, cwd) {
  const printable = [cmd, ...args].map((part) => (part.includes(' ') ? JSON.stringify(part) : part)).join(' ');
  console.log(`$ ${printable}`);
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { cwd, env: process.env, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${basename(cmd)} exited with code ${code}`));
    });
  });
}

/**
 * @param {string} cmd
 * @param {string} cwd
 */
function startSimulator(cmd, cwd) {
  try {
    const child = spawn(cmd, [], { cwd, detached: true, stdio: 'ignore' });
    child.on('error', () => {
      /* simulator may already be running */
    });
    child.unref();
  } catch {
    /* simulator may already be running */
  }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sdk = findSdk(options.sdk);
  if (!sdk) {
    throw new Error(
      'Connect IQ SDK not found. Install the SDK, set MONKEYC_SDK_PATH, or pass --sdk.',
    );
  }

  const buildable = findBuildable(options.file);
  if (!buildable) {
    throw new Error(
      'No buildable Connect IQ package found (needs monkey.jungle and manifest.xml in the package directory).',
    );
  }

  const key = ensureKey(options.key);
  const monkeyc = executable(sdk, 'monkeyc');
  const monkeydo = executable(sdk, 'monkeydo');
  const connectiq = executable(sdk, 'connectiq');
  if (!monkeyc || !monkeydo) {
    throw new Error(`SDK at ${sdk} is missing bin/monkeyc or bin/monkeydo.`);
  }

  const outDir = join(buildable.dir, 'bin');
  const prg = join(outDir, `${basename(buildable.dir)}.prg`);
  mkdirSync(outDir, { recursive: true });

  console.log(`SDK: ${sdk}`);
  console.log(`Package: ${buildable.dir}`);
  console.log(`Device: ${options.device}`);
  console.log(`Key: ${key}`);

  await run(
    monkeyc,
    ['-f', buildable.jungle, '-d', options.device, '-o', prg, '-y', key, '-w'],
    buildable.dir,
  );

  if (options.buildOnly) {
    console.log(`Built ${prg}`);
    return;
  }

  if (options.startSimulator) {
    if (connectiq) startSimulator(connectiq, buildable.dir);
    else console.warn('Warning: bin/connectiq not found; assuming the simulator is already running.');
    await sleep(options.waitMs);
  }

  await run(monkeydo, [prg, options.device], buildable.dir);
  console.log(`Monkey C preview launched: ${basename(buildable.dir)} (${options.device}).`);
}

main().catch((error) => {
  process.stderr.write(`monkey-c-preview: ${error instanceof Error ? error.message : String(error)}\n`);
  if (error instanceof Error && error.stack && process.env.MONKEYC_DEBUG) {
    process.stderr.write(`${error.stack}\n`);
  }
  process.exit(1);
});
