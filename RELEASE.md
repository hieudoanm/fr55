## Monkey C — latest build

Language support and tooling for Garmin Connect IQ Monkey C and Jungle:

- `monkey` — standalone CLI (`format`, `lint`, `check`, `tokens`) for
  `*.mc`/`*.jungle` files. Prebuilt binaries for Linux (x86_64), macOS
  (Apple Silicon), and Windows (x86_64) are attached below.
- `monkey-c.vsix` — VS Code extension with syntax highlighting,
  formatting, snippets, and a runtime-preview command.
- `monkey-c-zed.zip` — Zed extension source (Tree-sitter languages,
  formatter, theme, icon theme). Install via `zed: install` from a local
  checkout or the extension registry.
- Companion Zed extension lives in the same repo.

### Install

**CLI:** download the `monkey-*` binary for your platform and put it on
your `PATH` (e.g. `~/.local/bin`).

**VS Code:** download `monkey-c.vsix` from the assets below and install via
**Extensions → Install from VSIX**.

**Zed:** the extension is declarative — clone the repo and run
`./scripts/install.sh` inside `packages/extensions/zed`, or use the
`monkey-c-zed.zip` asset as a source snapshot.

### Build from source

```bash
cd crates && cargo build --release   # binary: crates/target/release/monkey
```

### Documentation

- [Repo README](https://github.com/hieudoanm/fr55#readme)
- [Extension README](https://github.com/hieudoanm/fr55/tree/master/packages/extensions/vscode)
