# AGENTS.md — monkey-syntax

Lexer/token model for Monkey C. Part of the `monkey-*` toolchain workspace
(see `../AGENTS.md`-equivalent notes in the repo root `AGENTS.md`).

## Conventions

- Zero external dependencies — keep it that way.
- The lexer must stay permissive: never return `Err`, always emit an `Eof`
  token, and keep `newlines_before`/`space_before` trivia accurate — the
  formatter depends on them.
- `Punct` covers single- and multi-char operators; longest-match first
  (`>>>` before `>>` before `>`).
- Strings/chars consume escapes (`\"`, `\\`, `\n`, ...) so quotes inside them
  don't terminate the literal.
- Block comments keep their full text including newlines.

## Validation

```bash
cd crates
cargo test -p monkey-syntax
cargo clippy -p monkey-syntax
```
