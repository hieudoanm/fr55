# AGENTS.md — monkey-formatter

Token-based formatter for Monkey C (`.mc`) and Jungle (`.jungle`).

## Conventions

- Behaviour must stay in parity with
  `packages/extensions/vscode/src/format-monkeyc.ts` — when changing either
  formatter, check the other and keep observable output aligned.
- Operates on `monkey-syntax` tokens, not raw text — strings and comments are
  structural, never re-lexed.
- Line-preserving: only emit newlines where the source had them (collapsed to
  one blank max) or where braces/`case` require them. Do not reflow code.
- Keep `format_monkeyc`, `format_jungle`, `format_source`, and
  `FormatOptions` signatures stable — `monkey-cli` consumes them.

## Validation

```bash
cd crates
cargo test -p monkey-formatter
cargo build --release -p monkey-cli
../crates/target/release/monkey format --check ../apps   # must be clean
```
