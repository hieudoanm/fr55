# Extensions

## VS Code (`vscode/`)

`extensions/vscode` provides editor support for Connect IQ files in the FR55 project without requiring Garmin's SDK runtime:

- Monkey C (`.mc`, `.mb`, `.mcgen`) syntax highlighting, language config, icons, and breakpoints.
- Jungle (`.jungle`) syntax highlighting and language config (comments, `key = value`, `$(...)` lookups, common properties).
- Built-in document formatting for Monkey C and Jungle (`Format Document` / `Monkey C: Format Document`).
- Monkey C dark theme and file icon theme.

It adapts editor-facing Jungle grammar/language patterns from the official `garmin.monkey-c` extension and adds formatting, but it does not implement Garmin SDK build/run/test/debug, manifest tooling, or the proprietary language server. For full Connect IQ workflows, use the official [Monkey C extension](https://marketplace.visualstudio.com/items?itemName=garmin.monkey-c) with the Connect IQ SDK.

See [`vscode/README.md`](vscode/README.md) for details and packaging instructions.
