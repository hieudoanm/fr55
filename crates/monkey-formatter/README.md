# monkey-formatter

Monkey C and Jungle source formatter — the Rust counterpart of
`packages/extensions/vscode/src/format-monkeyc.ts`.

Zero dependencies beyond `monkey-syntax`.

## API

```rust
use monkey_formatter::{format_monkeyc, format_jungle, format_source, FormatOptions};

let out = format_monkeyc(src, &FormatOptions::default());
let jungle = format_jungle(src, &FormatOptions::default());
// format_source picks by file extension (.jungle vs everything else)
```

`FormatOptions`:

- `indent_width: Option<usize>` — `Some(n)` spaces (default `2`), `None` = tabs
- `line_ending: LineEnding` — `Lf` (default) or `Crlf`

## Behaviour (parity with the JS formatter)

- Conservative and line-preserving: statements sharing an input line stay
  together; the formatter never joins or splits non-brace lines.
- Brace-aware indentation; `} else {`, `} catch {`, `} finally {` merge onto
  one line.
- `if`/`for`/`while`/`switch`/`catch` keep a space before `(`; calls hug it
  (`foo(`).
- Forced space after `,` and `;`; no space before `,` `;` `)` `]` `.` `:`.
- `case`/`default` dedent one level; their `:` re-indents the body.
- Comments preserved; `//` normalized to `// `; trailing comments stay inline.
- Blank lines collapse to at most one; output ends with exactly one newline.
- Operator spacing is preserved from the source (`x=1` stays `x=1`).

## Tests

```bash
cargo test -p monkey-formatter
```

The formatter is idempotent and produces zero diffs on the repo's formatted
`apps/**/*.mc` files.
