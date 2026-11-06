# Extensions

## VS Code

`extensions/vscode` provides editor support for Connect IQ files in the FR55 project without requiring Garmin's SDK runtime:

- Monkey C (`.mc`, `.mb`, `.mcgen`) syntax highlighting, language config, icons, and breakpoints.
- Jungle (`.jungle`) syntax highlighting and language config (comments, `key = value`, `$(...)` lookups, common properties).
- Built-in document formatting for Monkey C and Jungle (`Format Document` / `Monkey C: Format Document`).
- Monkey C dark theme and file icon theme.

It adapts editor-facing Jungle grammar/language patterns from the official `garmin.monkey-c` extension and adds formatting, but it does not implement Garmin SDK build/run/test/debug, manifest tooling, or the proprietary language server. For full Connect IQ workflows, use the official [Monkey C extension](https://marketplace.visualstudio.com/items?itemName=garmin.monkey-c) with the Connect IQ SDK.

**Work With**: `Cursor`, `Google Antigravity`, `VSCodium`, `Windsurf`

See [`vscode/README.md`](vscode/README.md) for details and packaging instructions.

## Zed

`extensions/zed` provides the same editor-facing surface as the VS Code extension using Zed's Tree-sitter and task systems:

- Monkey C (`.mc`, `.mb`, `.mcgen`) and Jungle (`.jungle`) tree-sitter languages with highlighting, brackets, indentation, folds, outline, and text objects.
- External formatter (`monkey-c-format`) for Monkey C and Jungle.
- Monkey C dark theme and file icon theme.
- `Monkey C: Runtime Preview` / `Monkey C: Build PRG` tasks backed by `monkey-c-preview`.

Zed has no TextMate grammar support and no extension command API, so formatting is configured as an external formatter and the runtime preview is a CLI/task. Breakpoint contributions and the proprietary Garmin language server/debugger are not available.

See [`zed/README.md`](zed/README.md) for installation, formatter settings, task usage, and the vendored Jungle grammar requirement.
