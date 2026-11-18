# monkey-cli

`monkey` — command-line interface for the Monkey C toolchain. Thin wrapper
over `monkey-syntax`, `monkey-formatter`, and `monkey-linter`.

## Build

```bash
cd crates
cargo build --release        # binary: crates/target/release/monkey
```

## Commands

```bash
monkey format [--check|--write] [--stdin] [--indent-spaces N|--indent-tabs] [paths...]
monkey lint   [paths...]
monkey check  [paths...]
monkey tokens <file>
```

- `format` — default prints formatted source to stdout; `--check` reports
  files that would change (exit 1), `--write` rewrites in place, `--stdin`
  reads stdin → stdout (for editor integrations).
- `lint` — text + token lint rules; diagnostics as
  `path:line:col: severity: message [rule]`; exit 1 on findings.
- `check` — `lint` plus a format-drift check (superset of the old
  `scripts/lint.sh`).
- `tokens` — dumps the lexer token stream for debugging.

Paths may be files or directories; directories are searched recursively for
`*.mc` and `*.jungle` (skipping `node_modules`, `target`, `.git`).

## Repo usage

```bash
cd crates && cargo build --release
./target/release/monkey check ..    # lint + format-check the whole repo
./target/release/monkey format --write apps/hands/source/HandsView.mc
```
