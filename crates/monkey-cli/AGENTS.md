# AGENTS.md — monkey-cli

`monkey` binary — CLI over the `monkey-*` crates. Single `main.rs`, zero
dependencies beyond the sibling crates; keep it that way (hand-rolled arg
parsing is intentional — no clap).

## Conventions

- Subcommands: `format`, `lint`, `check`, `tokens`. Keep names stable —
  editor integrations and CI invoke them.
- `format` default = stdout (rustfmt-style); `--check`/`--write`/`--stdin`
  are the only modes. Exit codes: 0 clean, 1 findings/diffs, 2 usage errors.
- `check` must remain a superset of `lint` (lint + format drift).
- File discovery recurses directories for `.mc`/`.jungle` and must keep
  skipping `node_modules`, `target`, `.git`.
- Diagnostics print as `path:line:col: severity: message [rule]`.

## Validation

```bash
cd crates
cargo build --release -p monkey-cli
cargo test --workspace
./target/release/monkey check ..   # repo root: must be clean
```
