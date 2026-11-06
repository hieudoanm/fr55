/**
 * Lightweight Monkey C/Jungle formatter.
 * Conservative and not Garmin's official formatter.
 *
 * Ported from `extensions/vscode/src/format-monkeyc.ts` so the VS Code and Zed
 * extensions share the same formatting behavior.
 */

/**
 * @typedef {object} FormatOptions
 * @property {boolean} [insertSpaces] Use spaces (default) or hard tabs.
 * @property {number} [tabSize] Number of spaces per indentation level.
 * @property {string} [eol] Output line ending (`\n` by default).
 */

/**
 * @param {string} text
 * @param {string} char
 * @returns {number}
 */
function countChar(text, char) {
  let count = 0;
  for (let i = 0; i < text.length; i += 1) if (text[i] === char) count += 1;
  return count;
}

/**
 * @param {string} line
 * @returns {string}
 */
function maskStringsAndComments(line) {
  let out = '';
  let i = 0;
  /** @type {'code' | 'block' | 'string' | 'char'} */
  let state = 'code';
  while (i < line.length) {
    const ch = line[i];
    const next = line[i + 1];
    if (state === 'code') {
      if (ch === '/' && next === '/') return out + ' '.repeat(line.length - i);
      if (ch === '/' && next === '*') {
        state = 'block';
        out += '  ';
        i += 2;
        continue;
      }
      if (ch === '"') {
        state = 'string';
        out += '"';
        i += 1;
        continue;
      }
      if (ch === "'") {
        state = 'char';
        out += "'";
        i += 1;
        continue;
      }
      out += ch;
      i += 1;
      continue;
    }
    if (state === 'block') {
      out += ' ';
      if (ch === '*' && next === '/') {
        out += ' ';
        i += 2;
        state = 'code';
        continue;
      }
      i += 1;
      continue;
    }
    if (state === 'string') {
      out += ' ';
      if (ch === '\\') {
        i += 2;
        out += ' ';
        continue;
      }
      if (ch === '"') {
        out = out.slice(0, -1) + '"';
        state = 'code';
      }
      i += 1;
      continue;
    }
    out += ' ';
    if (ch === '\\') {
      i += 2;
      out += ' ';
      continue;
    }
    if (ch === "'") {
      out = out.slice(0, -1) + "'";
      state = 'code';
    }
    i += 1;
  }
  return out;
}

/**
 * @param {string} out
 * @returns {string}
 */
function finalizeCodeSpacing(out) {
  return out
    .replace(/\s+\./g, '.')
    .replace(/\.\s+/g, '.')
    .replace(/([A-Za-z0-9_\])])\s*\(/g, (m, p1, offset, src) => {
      const before = src.slice(0, offset + p1.length).match(/(\b[A-Za-z_]\w*)$/);
      if (before && /^(if|for|while|switch|catch|function)$/.test(before[1])) return m;
      return `${p1}(`;
    })
    .replace(/\b(if|for|while|switch|catch)\s*\(/g, '$1 (')
    .replace(/\)\s*\{/g, ') {')
    .replace(/\b(class|enum|module)\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s*\{/g, '$1 $2 {')
    .replace(
      /\b(class|module)\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s+extends\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s*\{/g,
      '$1 $2 extends $3 {',
    )
    .replace(/\belse\s*\{/g, 'else {')
    .replace(/\btry\s*\{/g, 'try {')
    .replace(/\bfinally\s*\{/g, 'finally {')
    .replace(/\s+([,;])/g, '$1')
    .replace(/,([^\s)\]}])/g, ', $1')
    .replace(/;([^\s)\]};/])/g, '; $1')
    .replace(/\s+:/g, ':')
    .replace(/[ \t]+$/g, '');
}

/**
 * @param {string} line
 * @returns {string}
 */
function normalizeCodeSpacing(line) {
  let out = '';
  let i = 0;
  /** @type {'code' | 'block' | 'string' | 'char'} */
  let state = 'code';
  while (i < line.length) {
    const ch = line[i];
    const next = line[i + 1];
    if (state === 'code') {
      if (ch === '/' && next === '/') {
        out = finalizeCodeSpacing(out);
        const comment = line.slice(i).replace(/^\/\/[ \t]?/, '// ');
        return (out ? out + ' ' : '') + comment;
      }
      if (ch === '/' && next === '*') {
        out += '/*';
        state = 'block';
        i += 2;
        continue;
      }
      if (ch === '"') {
        state = 'string';
        out += ch;
        i += 1;
        continue;
      }
      if (ch === "'") {
        state = 'char';
        out += ch;
        i += 1;
        continue;
      }
      if (/\s/.test(ch)) {
        if (out.length && !/[\s([{,;:]$/.test(out) && next && !/[\s)\]}.,;:]/.test(next))
          out += ' ';
        i += 1;
        while (i < line.length && /\s/.test(line[i])) i += 1;
        continue;
      }
      out += ch;
      i += 1;
      continue;
    }
    if (state === 'block') {
      out += ch;
      if (ch === '*' && next === '/') {
        out += '/';
        i += 2;
        state = 'code';
        continue;
      }
      i += 1;
      continue;
    }
    if (state === 'string') {
      out += ch;
      if (ch === '\\') {
        if (next != null) out += next;
        i += 2;
        continue;
      }
      if (ch === '"') state = 'code';
      i += 1;
      continue;
    }
    out += ch;
    if (ch === '\\') {
      if (next != null) out += next;
      i += 2;
      continue;
    }
    if (ch === "'") state = 'code';
    i += 1;
  }
  return finalizeCodeSpacing(out);
}

/**
 * @param {string} trimmed
 * @returns {string[]}
 */
function splitStatements(trimmed) {
  /** @type {string[]} */
  const parts = [];
  let buf = '';
  let i = 0;
  /** @type {'code' | 'block' | 'string' | 'char'} */
  let state = 'code';
  let depthParen = 0;
  let depthBracket = 0;
  const flush = () => {
    const t = buf.trim();
    if (t) parts.push(t);
    buf = '';
  };
  while (i < trimmed.length) {
    const ch = trimmed[i];
    const next = trimmed[i + 1];
    if (state === 'code') {
      if (ch === '/' && next === '/') {
        buf += trimmed.slice(i);
        flush();
        return parts;
      }
      if (ch === '/' && next === '*') {
        state = 'block';
        buf += '/*';
        i += 2;
        continue;
      }
      if (ch === '"') {
        state = 'string';
        buf += ch;
        i += 1;
        continue;
      }
      if (ch === "'") {
        state = 'char';
        buf += ch;
        i += 1;
        continue;
      }
      if (ch === '(') depthParen += 1;
      if (ch === ')') depthParen = Math.max(0, depthParen - 1);
      if (ch === '[') depthBracket += 1;
      if (ch === ']') depthBracket = Math.max(0, depthBracket - 1);
      if (ch === '{') {
        buf += ch;
        flush();
        i += 1;
        continue;
      }
      if (ch === '}') {
        flush();
        buf = '}';
        flush();
        i += 1;
        continue;
      }
      buf += ch;
      i += 1;
      continue;
    }
    if (state === 'block') {
      buf += ch;
      if (ch === '*' && next === '/') {
        buf += '/';
        i += 2;
        state = 'code';
        continue;
      }
      i += 1;
      continue;
    }
    if (state === 'string') {
      buf += ch;
      if (ch === '\\') {
        if (next != null) buf += next;
        i += 2;
        continue;
      }
      if (ch === '"') state = 'code';
      i += 1;
      continue;
    }
    buf += ch;
    if (ch === '\\') {
      if (next != null) buf += next;
      i += 2;
      continue;
    }
    if (ch === "'") state = 'code';
    i += 1;
  }
  void depthParen;
  void depthBracket;
  flush();
  return parts;
}

/**
 * @param {string} text
 * @param {FormatOptions} [options]
 * @returns {string}
 */
export function formatMonkeyC(text, options = {}) {
  const indentUnit = options.insertSpaces === false ? '\t' : ' '.repeat(options.tabSize || 2);
  const newline = options.eol || '\n';
  const rawLines = text.replace(/\r\n?/g, '\n').split('\n');
  /** @type {string[]} */
  const lines = [];
  let indent = 0;
  let inBlockComment = false;

  for (const raw of rawLines) {
    const trimmed = raw.trim();
    if (inBlockComment) {
      lines.push((indentUnit.repeat(indent) + trimmed).replace(/[ \t]+$/g, ''));
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }
    if (!trimmed) {
      lines.push('');
      continue;
    }
    if (trimmed.startsWith('//')) {
      lines.push(indentUnit.repeat(indent) + trimmed);
      continue;
    }
    if (trimmed.startsWith('/*') && !trimmed.includes('*/')) {
      lines.push(indentUnit.repeat(indent) + trimmed);
      inBlockComment = true;
      continue;
    }

    for (const part of splitStatements(trimmed)) {
      const seg = part.trim();
      if (!seg) continue;
      if (seg === '}') indent = Math.max(0, indent - 1);
      else if (/^(case\b|default\b)/.test(seg)) indent = Math.max(0, indent - 1);

      const normalized = normalizeCodeSpacing(seg);
      const merged = lines.length ? lines[lines.length - 1] : '';
      if (/^(else\b|catch\b|finally\b)/.test(normalized) && /^\s*\}\s*$/.test(merged)) {
        lines[lines.length - 1] = merged.replace(/\s*$/, '') + ' ' + normalized;
      } else {
        lines.push(indentUnit.repeat(indent) + normalized);
      }

      const masked = maskStringsAndComments(normalized);
      indent += countChar(masked, '{') - (seg === '}' ? 0 : countChar(masked, '}'));
      if (/^(case\b|default\b)/.test(seg) && normalized.includes(':')) indent += 1;
      if (indent < 0) indent = 0;
    }
  }

  /** @type {string[]} */
  const compact = [];
  let blankRun = 0;
  for (const line of lines) {
    if (line === '') {
      blankRun += 1;
      if (blankRun <= 1) compact.push('');
    } else {
      blankRun = 0;
      compact.push(line);
    }
  }
  while (compact.length && compact[compact.length - 1] === '') compact.pop();
  return compact.join(newline) + newline;
}

/**
 * @param {string} text
 * @param {FormatOptions} [options]
 * @returns {string}
 */
export function formatJungle(text, options = {}) {
  const newline = options.eol || '\n';
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  /** @type {string[]} */
  const out = [];
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) {
      if (out.length && out[out.length - 1] !== '') out.push('');
      continue;
    }
    if (trimmed.startsWith('#')) {
      out.push(trimmed);
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      out.push(trimmed.replace(/[ \t]+/g, ' '));
      continue;
    }
    out.push(`${trimmed.slice(0, eq).trim()} = ${trimmed.slice(eq + 1).trim()}`);
  }
  while (out.length && out[out.length - 1] === '') out.pop();
  return out.join(newline) + newline;
}
