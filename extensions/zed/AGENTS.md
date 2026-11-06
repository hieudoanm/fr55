# AGENTS.md

Guidance for coding agents working in `extensions/zed`.

## Purpose

Zed extension providing Monkey C/Jungle editor support for the FR55 Connect IQ
repo:

- Tree-sitter language support for Monkey C (`.mc`, `.mb`, `.mcgen`) and Jungle
  (`.jungle`).
- A stdin/stdout formatter for both languages.
- Dark theme and file icon theme.
- `Monkey C: Runtime Preview` tasks using a local Connect IQ SDK
  (`monkeyc`/`connectiq`/`monkeydo`).

This is a declarative Zed extension: there is deliberately no `Cargo.toml` or
Rust/WASM code. Zed extensions can provide languages, themes, and icon themes
without custom Rust.

## Source layout

- `extension.toml` — extension metadata and grammar revisions.
- `languages/monkeyc/` — language config, Tree-sitter queries, and tasks.
- `languages/jungle/` — language config, queries, and tasks.
- `grammars/tree-sitter-jungle/` — vendored Jungle grammar. `src/parser.c` is
  generated and committed; do not hand-edit it.
- `formatter/format-monkeyc.mjs` — formatter logic ported from
  `extensions/vscode/src/format-monkeyc.ts`.
- `formatter/cli.mjs` — stdin/stdout formatter entry point.
- `formatter/format-monkeyc.test.mjs` — Node built-in test suite.
- `scripts/runtime-preview.mjs` — SDK/key/package discovery, build, simulator,
  and `monkeydo` launch.
- `scripts/install.sh` — symlinks the CLIs into `~/.local/bin` (or
  `MONKEYC_BIN_DIR`).
- `themes/monkey-c.json` — Zed theme; full style object based on Dark+ colors.
- `icon_themes/monkey-c.json` — dark/light file icon mapping.
- `icons/`, `samples/` — shared assets copied from the VS Code extension.

## Tooling

- Node.js 26+ (no npm dependencies).
- Tree-sitter CLI `0.25.3` via `npx`.
- Python 3.11+ (`tomllib`) for TOML validation in docs/CI.

## Commands

Run from `extensions/zed`:

```bash
make test                 # formatter tests + Jungle grammar tests
node --test formatter/    # formatter tests only
cd grammars/tree-sitter-jungle && npx --yes tree-sitter-cli@0.25.3 test
./scripts/install.sh      # symlink monkey-c-format / monkey-c-preview
```

Regenerate the Jungle parser after changing `grammar.js`:

```bash
cd grammars/tree-sitter-jungle
npx --yes tree-sitter-cli@0.25.3 generate
npx --yes tree-sitter-cli@0.25.3 test
```

Commit the generated `src/parser.c`, `src/grammar.json`, `src/node-types.json`,
and `src/tree_sitter/*.h` files.

## Implementation notes

- Zed uses Tree-sitter, not TextMate. Keep `highlights.scm` captures limited to
  documented Zed captures; dotted captures fall back to their parent style.
- The formatter must read stdin and write only the formatted buffer to stdout.
  Do not read the file from `--path`; Zed passes unsaved buffers on stdin.
- Keep formatter behavior aligned with the VS Code implementation. When changing
  formatting, update `formatter/format-monkeyc.test.mjs` and consider whether
  `extensions/vscode/src/format-monkeyc.ts` needs the same change.
- Runtime preview must not hardcode machine-specific paths. Use CLI flags/env
  vars and the SDK/key discovery in `scripts/runtime-preview.mjs`.
- Zed language tasks cannot execute files inside the extension directory, so
  `tasks.json` calls `monkey-c-preview` from `PATH`. `scripts/install.sh` is what
  makes that work.
- The Jungle grammar is referenced from this repository with
  `rev = "master"` and `path = "extensions/zed/grammars/tree-sitter-jungle"`.
  Zed fetches grammars by Git revision, so that directory must be committed and
  pushed before a dev install or release can resolve it. Pin `rev` to a commit
  for a published release.
- Keep the theme structurally complete (all style keys) rather than a partial
  theme so it works across Zed versions.

## Validation checklist

Before finishing extension changes:

```bash
cd extensions/zed
make test
python3 - <<'PY'
import json, pathlib, tomllib
for path in pathlib.Path('.').rglob('*.json'):
    json.loads(path.read_text())
for path in pathlib.Path('.').rglob('*.toml'):
    tomllib.loads(path.read_text())
print('json/toml ok')
PY
bash -n scripts/install.sh
```

If you changed runtime preview behavior, also run `monkey-c-preview --help` and,
when an SDK/key is available, a `--build-only` build against one of the
`apps/*` packages.
