# Monkey C for Zed

Syntax highlighting, outline/bracket/indent support, document formatting, a
dark theme, file icons, and a Connect IQ runtime-preview task for
[Monkey C](https://developer.garmin.com/connect-iq/monkey-c/) and
`monkey.jungle` project files.

This is the Zed port of [`packages/extensions/vscode`](../vscode). Zed uses Tree-sitter
instead of TextMate grammars and has no extension command API, so formatting and
the runtime preview are exposed as an external formatter and tasks.

## Features

- **Monkey C (`.mc`, `.mb`, `.mcgen`)** — Tree-sitter highlighting, bracket
  matching, indentation, folding, outline, text objects, and comment support.
- **Jungle (`.jungle`)** — Tree-sitter highlighting for comments, dotted keys,
  `key = value` assignments, `$(...)` lookups, and `;`/`:` path separators.
- **Document formatting** — the same conservative formatter as the VS Code
  extension, wired through Zed's external formatter setting.
- **Monkey C theme** — dark theme using the VS Code Dark+ palette.
- **Monkey C Icons** — dark/light file icons for `.mc`, `.mb`, `.mcgen`, and
  `.jungle`.
- **Runtime Preview** — builds the nearest Connect IQ package with `monkeyc`,
  starts the simulator, and launches the PRG with `monkeydo`.

## Compared with the VS Code extension

| Feature | VS Code | Zed |
| --- | --- | --- |
| Monkey C / Jungle languages | TextMate grammar | Tree-sitter grammar |
| Syntax highlighting | ✅ | ✅ |
| Brackets, indentation, folding | Language configuration | ✅ Tree-sitter queries |
| Outline | — | ✅ |
| Format Document | Built-in provider | ✅ External formatter |
| Dark theme | ✅ | ✅ |
| File icons | ✅ | ✅ |
| Runtime Preview command | ✅ Command Palette | ✅ Task + CLI |
| Breakpoints | ✅ Contribution | ❌ Zed has no equivalent contribution |
| Language server / debugger | ❌ | ❌ |

The extension intentionally does not bundle Garmin's proprietary language
server, debugger, or project tooling. For full Connect IQ workflows use the
official Garmin tools and the Connect IQ SDK.

## Install

### Development / local checkout

1. Commit and push `packages/extensions/zed/grammars/tree-sitter-jungle` to `master` (or
   change the `[grammars.jungle]` revision in `extension.toml` to a commit that
   contains it). Zed downloads grammars by Git revision; it cannot read the
   uncommitted working tree. For local-only testing you can temporarily set the
   `[grammars.jungle]` `repository` to a `file://` URL pointing at the grammar
   directory instead.
2. In Zed, open the Extensions page and choose **Install Dev Extension**.
3. Select `packages/extensions/zed`.
4. Run `./scripts/install.sh` so `monkey-c-format` and `monkey-c-preview` are on
   `PATH` (by default in `~/.local/bin`).

```bash
cd packages/extensions/zed
./scripts/install.sh
```

### Theme and icons

After installation, select **Monkey C** from the theme picker and **Monkey C
Icons** from the icon-theme picker.

## Formatting

Install the CLI (see above), then add the external formatter to Zed's
`settings.json`:

```json
{
  "languages": {
    "Monkey C": {
      "formatter": {
        "external": {
          "command": "monkey-c-format",
          "arguments": ["--lang", "monkeyc"]
        }
      },
      "format_on_save": "on"
    },
    "Jungle": {
      "formatter": {
        "external": {
          "command": "monkey-c-format",
          "arguments": ["--lang", "jungle"]
        }
      },
      "format_on_save": "on"
    }
  }
}
```

If Zed was launched from the macOS Dock and cannot find `monkey-c-format`, use
the absolute path in `command` (for example
`"/Users/you/.local/bin/monkey-c-format"`), or launch Zed from a shell that has
`~/.local/bin` on `PATH`.

Options:

```text
--lang monkeyc|jungle   Explicit language (otherwise inferred from --path)
--path <file>           Buffer path, used only to infer the language
--tab-size <n>          Spaces per indent (default 2)
--tabs                  Indent with hard tabs
--eol lf|crlf           Output line endings
```

The formatter reads the buffer from stdin and writes the result to stdout, so
unsaved buffers format correctly. It preserves comments and string/character
literals. It is lightweight and conservative; it is not Garmin's official
formatter.

## Runtime preview

The extension ships two tasks for Monkey C and Jungle buffers:

- **Monkey C: Runtime Preview** — build, start the simulator, and launch the PRG.
- **Monkey C: Build PRG** — build only.

Run them from **task: spawn** (<kbd>cmd-shift-p</kbd> → `task: spawn`).

The task finds the nearest directory containing both `monkey.jungle` and
`manifest.xml`, walking up from the current file. It then runs:

```bash
monkeyc -f monkey.jungle -d fr55 -o bin/<package>.prg -y <developer_key> -w
connectiq
monkeydo bin/<package>.prg fr55
```

Configuration through environment variables (set them in your shell, or in the
task's `env` object):

| Variable | Purpose |
| --- | --- |
| `MONKEYC_SDK_PATH` | SDK root containing `bin/monkeyc` |
| `MONKEYC_DEVELOPER_KEY` | Developer key used for the build |
| `MONKEYC_DEVICE` | Device id (default `fr55`) |

Without `MONKEYC_SDK_PATH`, the CLI checks
`~/Library/Application Support/Garmin/ConnectIQ/current-sdk.cfg`,
`~/Library/Application Support/Garmin/ConnectIQ/Sdks`, and the Linux
`~/.Garmin/ConnectIQ` equivalents. Without `MONKEYC_DEVELOPER_KEY`, it checks
`~/.config/garmin/developer_key`, `~/.config/garmin/developer_key.der`, and the
VS Code/Cursor global-storage locations used by the VS Code extension.

You can also run the CLI directly:

```bash
monkey-c-preview --file apps/hands/source/handsApp.mc --device fr55
monkey-c-preview --file apps/hands/source/handsApp.mc --build-only
monkey-c-preview --help
```

## Layout

```text
packages/extensions/zed/
├── extension.toml
├── languages/
│   ├── monkeyc/
│   │   ├── config.toml
│   │   ├── highlights.scm
│   │   ├── brackets.scm
│   │   ├── indents.scm
│   │   ├── folds.scm
│   │   ├── outline.scm
│   │   ├── textobjects.scm
│   │   └── tasks.json
│   └── jungle/
│       ├── config.toml
│       ├── highlights.scm
│       ├── brackets.scm
│       ├── outline.scm
│       └── tasks.json
├── grammars/tree-sitter-jungle/   # vendored, generated parser is committed
├── themes/monkey-c.json
├── icon_themes/monkey-c.json
├── icons/
├── formatter/
│   ├── format-monkeyc.mjs
│   ├── cli.mjs
│   └── format-monkeyc.test.mjs
├── scripts/
│   ├── runtime-preview.mjs
│   └── install.sh
└── samples/
```

The Monkey C grammar is [`DuckSoft/tree-sitter-monkeyc`](https://github.com/DuckSoft/tree-sitter-monkeyc),
pinned in `extension.toml`. The Jungle grammar is vendored in this repository.

## Development checks

```bash
cd packages/extensions/zed
make test
```

This runs the formatter tests with `node --test` and the Jungle grammar corpus
tests with `tree-sitter test`. You can also run them individually:

```bash
node --test formatter/
cd grammars/tree-sitter-jungle && npx --yes tree-sitter-cli@0.27.1 test
```

Validate JSON/TOML files with any JSON parser and Python's `tomllib`:

```bash
python3 - <<'PY'
import pathlib, tomllib
for path in pathlib.Path('.').rglob('*.toml'):
    tomllib.loads(path.read_text())
print('toml ok')
PY
```

## Notes and limitations

- Zed only highlights documented Tree-sitter captures. Less common captures fall
  back to their parent style.
- External formatters cannot format selections, only whole buffers.
- Tasks cannot reference files inside the extension directory directly, so the
  preview task calls the `monkey-c-preview` command installed on `PATH`.
- The graphics simulator requires a local Connect IQ SDK, a developer key, and a
  running graphical session.
- Design previews for the watchfaces remain in [`assets/design`](../../../assets/design).
