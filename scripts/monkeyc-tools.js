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
const targets = process.argv.slice(3);

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'bin' || entry.name === 'out' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else if (entry.isFile() && full.endsWith('.mc')) list.push(full);
  }
  return list;
}

function lintFile(file, text) {
  const issues = [];
  const lines = text.split(/\r?\n/);
  let inBlock = false;
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/[ \t]+$/.test(line)) issues.push({ file, n, msg: 'trailing whitespace' });
    if (/\t/.test(line)) issues.push({ file, n, msg: 'tab indentation (use spaces)' });
    if (!inBlock && line.includes('/*')) inBlock = !line.includes('*/');
    else if (inBlock && line.includes('*/')) inBlock = false;
  });
  const formatted = formatMonkeyC(text, { insertSpaces: true, tabSize: 2, eol: '\n' });
  if (formatted !== text.replace(/\r\n?/g, '\n'))
    issues.push({ file, n: 1, msg: 'file is not formatted (run scripts/format.sh)' });
  return issues;
}

const files = targets.length ? targets.map((p) => path.resolve(root, p)) : walk(root);
let changed = 0;
let issues = [];
for (const file of files) {
  if (!fs.existsSync(file) || !file.endsWith('.mc')) continue;
  const text = fs.readFileSync(file, 'utf8');
  if (mode === 'format' || mode === 'fmt') {
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

if (mode === 'format' || mode === 'fmt') {
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
