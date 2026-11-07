#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = path.resolve(__dirname, '..');
const extRoot = path.resolve(root, 'extensions/vscode');
const out = path.resolve(extRoot, 'out/format-monkeyc.js');
if (!fs.existsSync(out)) {
  cp.execFileSync('pnpm', ['run', 'build'], { cwd: extRoot, stdio: 'inherit' });
}
const { formatMonkeyC } = require(out);

const mode = process.argv[2] || 'lint';
const isFormat = mode === 'format' || mode === 'fmt';
const isLint = mode === 'lint';
if (!isFormat && !isLint) {
  console.error(`usage: monkeyc-tools.js <format|lint> [files-or-dirs...]`);
  process.exit(2);
}
const targets = process.argv.slice(3);

const SKIP_DIRS = new Set(['node_modules', '.git', 'bin', 'out', 'dist']);

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else if (entry.isFile() && full.endsWith('.mc')) list.push(full);
  }
  return list;
}

function collectFiles(targets) {
  if (!targets.length) return walk(root);
  const files = [];
  for (const target of targets) {
    const full = path.resolve(root, target);
    if (!fs.existsSync(full)) {
      console.error(`not found: ${target}`);
      process.exit(2);
    }
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else if (full.endsWith('.mc')) files.push(full);
    else console.error(`skipping non-Monkey C file: ${target}`);
  }
  return files;
}

function lintFile(file, text) {
  const issues = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/[ \t]+$/.test(line)) issues.push({ file, n, msg: 'trailing whitespace' });
    if (/\t/.test(line)) issues.push({ file, n, msg: 'tab indentation (use spaces)' });
  });
  const formatted = formatMonkeyC(text, { insertSpaces: true, tabSize: 2, eol: '\n' });
  if (formatted !== text.replace(/\r\n?/g, '\n'))
    issues.push({ file, n: 1, msg: 'file is not formatted (run scripts/format.sh)' });
  return issues;
}

const files = collectFiles(targets);
let changed = 0;
let issues = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (isFormat) {
    const formatted = formatMonkeyC(text, { insertSpaces: true, tabSize: 2, eol: '\n' });
    if (formatted !== text) {
      fs.writeFileSync(file, formatted);
      console.log(`formatted ${path.relative(root, file)}`);
      changed += 1;
    }
  } else {
    issues = issues.concat(lintFile(file, text));
  }
}

if (isFormat) {
  console.log(`${changed} file(s) formatted, ${files.length} checked`);
  process.exit(0);
}

if (issues.length) {
  for (const issue of issues)
    console.error(`${path.relative(root, issue.file)}:${issue.n}: ${issue.msg}`);
  console.error(`${issues.length} issue(s) in ${files.length} file(s)`);
  process.exit(1);
}
console.log(`ok: ${files.length} Monkey C file(s)`);
