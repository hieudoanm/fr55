const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const vscode = require('vscode');

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function findSdk() {
  const configured = vscode.workspace.getConfiguration('monkeyC').get('sdkPath');
  if (configured && exists(path.join(configured, 'bin', 'monkeyc'))) return configured;
  const currentCfg = path.join(process.env.HOME || '', 'Library/Application Support/Garmin/ConnectIQ/current-sdk.cfg');
  if (exists(currentCfg)) {
    const sdk = fs.readFileSync(currentCfg, 'utf8').trim();
    if (sdk && exists(path.join(sdk, 'bin', 'monkeyc'))) return sdk;
  }
  const sdksDir = path.join(process.env.HOME || '', 'Library/Application Support/Garmin/ConnectIQ/Sdks');
  if (exists(sdksDir)) {
    const entries = fs.readdirSync(sdksDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => path.join(sdksDir, e.name))
      .filter((p) => exists(path.join(p, 'bin', 'monkeyc')))
      .sort()
      .reverse();
    if (entries[0]) return entries[0];
  }
  return null;
}

function findBuildable(startDir) {
  let dir = startDir;
  for (let i = 0; i < 8; i += 1) {
    const jungle = path.join(dir, 'monkey.jungle');
    const manifest = path.join(dir, 'manifest.xml');
    if (exists(jungle) && exists(manifest)) return { dir, jungle, manifest };
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function ensureKey(context) {
  const configured = vscode.workspace.getConfiguration('monkeyC').get('developerKeyPath');
  if (configured && exists(configured)) return configured;
  const key = path.join(context.globalStorageUri.fsPath, 'developer_key.der');
  if (exists(key)) return key;
  throw new Error('No developer key found. Set monkeyC.developerKeyPath or generate one with the official Garmin Monkey C extension (Monkey C: Generate a Developer Key).');
}

function run(cmd, args, cwd, output) {
  return new Promise((resolve, reject) => {
    output.appendLine(`$ ${cmd} ${args.map((a) => (a.includes(' ') ? `"${a}"` : a)).join('')}`.replace('""', '" "'));
    const child = cp.spawn(cmd, args, { cwd, env: process.env });
    child.stdout.on('data', (d) => output.append(d.toString()));
    child.stderr.on('data', (d) => output.append(d.toString()));
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${path.basename(cmd)} exited with code ${code}`))));
  });
}

async function runtimePreview(context) {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.uri.scheme !== 'file') {
    vscode.window.showErrorMessage('Open a Monkey C or Jungle file in a buildable Connect IQ package to preview.');
    return;
  }
  const sdk = findSdk();
  if (!sdk) {
    vscode.window.showErrorMessage('Connect IQ SDK not found. Install the SDK or set monkeyC.sdkPath.');
    return;
  }
  const buildable = findBuildable(path.dirname(editor.document.uri.fsPath));
  if (!buildable) {
    vscode.window.showErrorMessage('No buildable Connect IQ package found (needs monkey.jungle and manifest.xml in the package directory).');
    return;
  }
  const device = vscode.workspace.getConfiguration('monkeyC').get('previewDevice') || 'fr55';
  let key;
  try { key = ensureKey(context); } catch (e) {
    vscode.window.showErrorMessage(e.message);
    return;
  }

  const binDir = path.join(sdk, 'bin');
  const monkeyc = path.join(binDir, 'monkeyc');
  const monkeydo = path.join(binDir, 'monkeydo');
  const connectiq = path.join(binDir, 'connectiq');
  const outDir = path.join(buildable.dir, 'bin');
  const prg = path.join(outDir, `${path.basename(buildable.dir)}.prg`);
  fs.mkdirSync(outDir, { recursive: true });

  const output = vscode.window.createOutputChannel('Monkey C Preview');
  output.show(true);
  output.appendLine(`SDK: ${sdk}`);
  output.appendLine(`Package: ${buildable.dir}`);
  output.appendLine(`Device: ${device}`);
  try {
    await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Monkey C: Runtime Preview', cancellable: false }, async (progress) => {
      progress.report({ message: 'Building PRG...' });
      await run(monkeyc, ['-f', buildable.jungle, '-d', device, '-o', prg, '-y', key, '-w'], buildable.dir, output);
      progress.report({ message: 'Starting simulator...' });
      try { cp.spawn(connectiq, [], { cwd: buildable.dir, detached: true, stdio: 'ignore' }).unref(); } catch {}
      await new Promise((r) => setTimeout(r, 2500));
      progress.report({ message: 'Launching app...' });
      await run(monkeydo, [prg, device], buildable.dir, output);
    });
    vscode.window.showInformationMessage(`Monkey C preview launched: ${path.basename(buildable.dir)} (${device}).`);
  } catch (e) {
    output.appendLine(String(e.stack || e.message || e));
    vscode.window.showErrorMessage(`Monkey C preview failed: ${e.message}`);
  }
}

module.exports = { runtimePreview, findSdk };
