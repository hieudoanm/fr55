import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import { formatJungle, formatMonkeyC } from './format-monkeyc.mjs';

const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));

describe('formatMonkeyC', () => {
  it('formats class/function braces and indentation', () => {
    const input = 'class A{function x(){return 1;}}\n';
    assert.equal(formatMonkeyC(input), 'class A {\n  function x() {\n    return 1;\n  }\n}\n');
  });

  it('normalizes control flow spacing and else chaining', () => {
    const input = 'function onUpdate(dc){if(dc!=null){dc.clear();}else{return;}}\n';
    assert.equal(
      formatMonkeyC(input),
      'function onUpdate(dc) {\n  if (dc!=null) {\n    dc.clear();\n  } else {\n    return;\n  }\n}\n',
    );
  });

  it('preserves spacing in Monkey C generic return types (idempotent)', () => {
    const input = '  function getInitialView() as [Views] or [Views, InputDelegates] {\n';
    const once = formatMonkeyC(input);
    assert.equal(once, 'function getInitialView() as [Views] or [Views, InputDelegates] {\n');
    assert.equal(formatMonkeyC(once), once);
  });

  it('formats calls/args and preserves line comments', () => {
    const input = 'dc.drawText(x,y); // comment\n';
    assert.equal(formatMonkeyC(input), 'dc.drawText(x, y); // comment\n');
  });

  it('honors hard tabs and custom line endings', () => {
    const input = 'class A{function x(){return 1;}}';
    assert.equal(
      formatMonkeyC(input, { insertSpaces: false, eol: '\r\n' }),
      'class A {\r\n\tfunction x() {\r\n\t\treturn 1;\r\n\t}\r\n}\r\n',
    );
  });
});

describe('formatJungle', () => {
  it('normalizes key/value spacing and blank lines', () => {
    const input = 'a=b\n\n\nbase.sourcePath = source\n';
    assert.equal(formatJungle(input), 'a = b\n\nbase.sourcePath = source\n');
  });

  it('preserves comments', () => {
    const input = '# comment\nbase.resourcePath=resources\n';
    assert.equal(formatJungle(input), '# comment\nbase.resourcePath = resources\n');
  });
});

describe('cli', () => {
  it('infers Jungle from --path and formats stdin', () => {
    const result = spawnSync(process.execPath, [cli, '--path', 'monkey.jungle'], {
      input: 'base.sourcePath=source\n',
      encoding: 'utf8',
    });
    assert.equal(result.status, 0);
    assert.equal(result.stdout, 'base.sourcePath = source\n');
    assert.equal(result.stderr, '');
  });

  it('formats Monkey C from stdin', () => {
    const result = spawnSync(process.execPath, [cli, '--lang', 'monkeyc'], {
      input: 'class A{function x(){return 1;}}\n',
      encoding: 'utf8',
    });
    assert.equal(result.status, 0);
    assert.equal(result.stdout, 'class A {\n  function x() {\n    return 1;\n  }\n}\n');
  });

  it('rejects unknown options', () => {
    const result = spawnSync(process.execPath, [cli, '--nope'], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unknown option: --nope/);
  });
});
