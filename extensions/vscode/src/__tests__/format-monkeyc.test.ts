import { describe, expect, it } from 'vitest';
import { formatJungle, formatMonkeyC } from '../format-monkeyc';

describe('formatMonkeyC', () => {
  it('formats class/function braces and indentation', () => {
    const input = 'class A{function x(){return 1;}}\n';
    expect(formatMonkeyC(input)).toBe('class A {\n  function x() {\n    return 1;\n  }\n}\n');
  });

  it('normalizes control flow spacing and else chaining', () => {
    const input = 'function onUpdate(dc){if(dc!=null){dc.clear();}else{return;}}\n';
    expect(formatMonkeyC(input)).toBe(
      'function onUpdate(dc) {\n  if (dc!=null) {\n    dc.clear();\n  } else {\n    return;\n  }\n}\n',
    );
  });

  it('preserves spacing in Monkey C generic return types (idempotent)', () => {
    const input = '  function getInitialView() as [Views] or [Views, InputDelegates] {\n';
    const once = formatMonkeyC(input);
    expect(once).toBe('function getInitialView() as [Views] or [Views, InputDelegates] {\n');
    expect(formatMonkeyC(once)).toBe(once);
  });

  it('formats calls/args and preserves line comments', () => {
    const input = 'dc.drawText(x,y); // comment\n';
    expect(formatMonkeyC(input)).toBe('dc.drawText(x, y); // comment\n');
  });
});

describe('formatJungle', () => {
  it('normalizes key/value spacing and blank lines', () => {
    const input = 'a=b\n\n\nbase.sourcePath = source\n';
    expect(formatJungle(input)).toBe('a = b\n\nbase.sourcePath = source\n');
  });

  it('preserves comments', () => {
    const input = '# comment\nbase.resourcePath=resources\n';
    expect(formatJungle(input)).toBe('# comment\nbase.resourcePath = resources\n');
  });
});
