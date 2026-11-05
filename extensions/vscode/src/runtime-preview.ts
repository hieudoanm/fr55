import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import * as vscode from 'vscode';

interface Buildable {
  dir: string;
  jungle: string;
  manifest: string;
}

function exists(p: string): boolean {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export function findSdk(): string | null {
  const configured = vscode.workspace.getConfiguration('monkeyC').get<string>('sdkPath');
  if (configured && exists(path.join(configured, 'bin', 'monkeyc'))) return configured;

  const currentCfg = path.join(
    process.env.HOME || '',
    'Library/Application Support/Garmin/ConnectIQ/current-sdk.cfg',
  );
  if (exists(currentCfg)) {
    const sdk = fs.readFileSync(currentCfg, 'utf8').trim();
    if (sdk && exists(path.join(sdk, 'bin', 'monkeyc'))) return sdk;
  }

  const sdksDir = path.join(
    process.env.HOME || '',
    'Library/Application Support/Garmin/ConnectIQ/Sdks',
  );
  if (exists(sdksDir)) {
    const entries = fs
      .readdirSync(sdksDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => path.join(sdksDir, e.name))
      .filter((p) => exists(path.join(p, 'bin', 'monkeyc')))
      .sort()
      .reverse();
    if (entries[0]) return entries[0];
  }
  return null;
}

function findBuildable(startDir: string): Buildable | null {
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

function ensureKey(context: vscode.ExtensionContext): string {
  const configured = vscode.workspace.getConfiguration('monkeyC').get<string>('developerKeyPath');
  if (configured && exists(configured)) return configured;
  const key = path.join(context.globalStorageUri.fsPath, 'developer_key.der');
  if (exists(key)) return key;
  throw new Error(
    'No developer key found. Set monkeyC.developerKeyPath or generate one with the official Garmin Monkey C extension (Monkey C: Generate a Developer Key).',
  );
}

function run(
  cmd: string,
  args: string[],
  cwd: string,
  output: vscode.OutputChannel,
): Promise<void> {
  return new Promise((resolve, reject) => {
    output.appendLine(`$ ${cmd} ${args.map((a) => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`);
    const child = cp.spawn(cmd, args, { cwd, env: process.env });
    child.stdout.on('data', (d: Buffer | string) => output.append(d.toString()));
    child.stderr.on('data', (d: Buffer | string) => output.append(d.toString()));
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${path.basename(cmd)} exited with code ${code}`)),
    );
  });
}

export async function runtimePreview(context: vscode.ExtensionContext): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.uri.scheme !== 'file') {
    vscode.window.showErrorMessage(
      'Open a Monkey C or Jungle file in a buildable Connect IQ package to preview.',
    );
    return;
  }
  const sdk = findSdk();
  if (!sdk) {
    vscode.window.showErrorMessage(
      'Connect IQ SDK not found. Install the SDK or set monkeyC.sdkPath.',
    );
    return;
  }
  const buildable = findBuildable(path.dirname(editor.document.uri.fsPath));
  if (!buildable) {
    vscode.window.showErrorMessage(
      'No buildable Connect IQ package found (needs monkey.jungle and manifest.xml in the package directory).',
    );
    return;
  }
  const device =
    vscode.workspace.getConfiguration('monkeyC').get<string>('previewDevice') || 'fr55';
  let key: string;
  try {
    key = ensureKey(context);
  } catch (e) {
    vscode.window.showErrorMessage(e instanceof Error ? e.message : String(e));
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
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Monkey C: Runtime Preview',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Building PRG...' });
        await run(
          monkeyc,
          ['-f', buildable.jungle, '-d', device, '-o', prg, '-y', key, '-w'],
          buildable.dir,
          output,
        );
        progress.report({ message: 'Starting simulator...' });
        try {
          cp.spawn(connectiq, [], { cwd: buildable.dir, detached: true, stdio: 'ignore' }).unref();
        } catch {
          /* simulator may already be running */
        }
        await new Promise((r) => setTimeout(r, 2500));
        progress.report({ message: 'Launching app...' });
        await run(monkeydo, [prg, device], buildable.dir, output);
      },
    );
    vscode.window.showInformationMessage(
      `Monkey C preview launched: ${path.basename(buildable.dir)} (${device}).`,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    output.appendLine(e instanceof Error ? e.stack || e.message : String(e));
    vscode.window.showErrorMessage(`Monkey C preview failed: ${message}`);
  }
}
