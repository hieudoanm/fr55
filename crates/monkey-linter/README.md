# monkey-linter

Lint rules for Monkey C source, producing structured diagnostics.

Depends only on `monkey-syntax`.

## API

```rust
use monkey_linter::{lint_monkeyc, lint_text, Diagnostic, Severity};

// Full Monkey C rules (text + token-based)
let diags = lint_monkeyc(src, "path/to/file.mc");

// Text-level rules only — safe for .jungle and other text files
let mut diags = Vec::new();
lint_text(src, &mut diags);
```

Each `Diagnostic` has `rule` (stable id), `severity`, `message`, and 1-based
`line`/`column`.

## Rules

| Rule                            | Level | What it catches                                                                                                 |
| ------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------- |
| `no-trailing-whitespace`        | text  | Trailing spaces/tabs on any line                                                                                |
| `no-multiple-empty-lines`       | text  | More than one consecutive blank line                                                                            |
| `use-space-indent`              | text  | Tab-indented lines                                                                                              |
| `eof-newline`                   | text  | Missing final newline                                                                                           |
| `no-request-update-in-onupdate` | token | `WatchUi.requestUpdate()` inside `onUpdate` — a redraw loop that drains the battery; updates belong in `onShow` |

## Adding rules

- Text-level rules go in `lint_text` (line scans, no tokens).
- Token-level rules go in their own function called from `lint_monkeyc`,
  using `monkey_syntax::lex`. Track function context via a brace stack when
  needed (see `lint_request_update` for the pattern).
- Give every rule a stable kebab-case `rule` id — it appears in CLI output
  and may be referenced by editor integrations.

## Tests

```bash
cargo test -p monkey-linter
```
