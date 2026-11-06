#!/usr/bin/env node
/**
 * stdin -> stdout formatter for Zed's external formatter integration.
 *
 * Zed sends the buffer on stdin. `--path` is accepted only to infer the
 * language; the file is never read from disk so unsaved buffers format too.
 */
import { readFileSync } from 'node:fs';
import { formatJungle, formatMonkeyC } from './format-monkeyc.mjs';

const USAGE = `Usage: monkey-c-format [options] < input > output

Options:
  --lang <monkeyc|jungle>  Language to format (default: infer from --path)
  --path <file>            Buffer path, used only to infer the language
  --tab-size <n>           Spaces per indent (default: 2)
  --tabs                   Indent with hard tabs instead of spaces
  --spaces                 Indent with spaces (default)
  --eol <lf|crlf>          Output line ending (default: lf)
  -h, --help               Show this help

Environment:
  MONKEYC_FORMAT_TAB_SIZE  Default tab size when --tab-size is omitted
  MONKEYC_FORMAT_TABS      Set to 1/true to indent with hard tabs
`;

/**
 * @param {string[]} argv
 * @returns {{ lang?: string, path?: string, tabSize: number, insertSpaces: boolean, eol?: string }}
 */
function parseArgs(argv) {
  /** @type {{ lang?: string, path?: string, tabSize: number, insertSpaces: boolean, eol?: string }} */
  const options = {
    tabSize: Number.parseInt(process.env.MONKEYC_FORMAT_TAB_SIZE || '2', 10) || 2,
    insertSpaces: !/^(1|true|yes)$/i.test(process.env.MONKEYC_FORMAT_TABS || ''),
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
      case '--lang':
        options.lang = value();
        break;
      case '--path':
        options.path = value();
        break;
      case '--tab-size': {
        const tabSize = Number.parseInt(value(), 10);
        if (!Number.isFinite(tabSize) || tabSize < 1) throw new Error('--tab-size must be a positive integer');
        options.tabSize = tabSize;
        break;
      }
      case '--tabs':
        options.insertSpaces = false;
        break;
      case '--spaces':
        options.insertSpaces = true;
        break;
      case '--eol': {
        const eol = value().toLowerCase();
        if (eol !== 'lf' && eol !== 'crlf') throw new Error('--eol must be lf or crlf');
        options.eol = eol === 'crlf' ? '\r\n' : '\n';
        break;
      }
      case '-h':
      case '--help':
        process.stdout.write(USAGE);
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

/**
 * @param {{ lang?: string, path?: string }} options
 * @returns {'monkeyc' | 'jungle'}
 */
function detectLanguage(options) {
  const requested = options.lang?.toLowerCase();
  if (requested) {
    if (['monkeyc', 'monkey-c', 'mc', 'mb', 'mcgen'].includes(requested)) return 'monkeyc';
    if (['jungle', 'jungle-file'].includes(requested)) return 'jungle';
    throw new Error(`Unsupported language: ${options.lang}`);
  }

  if (options.path?.toLowerCase().endsWith('.jungle')) return 'jungle';
  return 'monkeyc';
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const language = detectLanguage(options);
  const input = readFileSync(0, 'utf8');
  const formatOptions = {
    insertSpaces: options.insertSpaces,
    tabSize: options.tabSize,
    eol: options.eol,
  };
  const output = language === 'jungle'
    ? formatJungle(input, formatOptions)
    : formatMonkeyC(input, formatOptions);
  process.stdout.write(output);
}

try {
  main();
} catch (error) {
  process.stderr.write(`monkey-c-format: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
