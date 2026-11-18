# AGENTS.md — monkey-linter

Diagnostic rules for Monkey C. Part of the `monkey-*` toolchain workspace.

## Conventions

- Zero dependencies beyond `monkey-syntax`.
- `lint_text` must stay language-agnostic (used for `.jungle` too); token-based
  rules live in `lint_monkeyc` only.
- Rule ids are stable public API (`no-trailing-whitespace`, etc.) — do not
  rename without checking `monkey-cli` output consumers.
- Diagnostics carry 1-based line/column; compute them from token offsets via
  `Token::line`/`Token::column`, never by re-scanning.
- When a rule needs function/block context, use a brace stack that inherits
  enclosing names for non-function blocks (see `lint_request_update`).

## Validation

```bash
cd crates
cargo test -p monkey-linter
cargo clippy -p monkey-linter
```
