# Monkey C for VS Code

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="icons/png/monkey-c-on-dark.png">
  <img src="icons/png/monkey-c-on-light.png" alt="Monkey C" width="96" height="96">
</picture>

Syntax highlighting, document formatting, a dark color theme, and file icons for
[Monkey C](https://developer.garmin.com/connect-iq/monkey-c/) and
`monkey.jungle` project files used by Garmin Connect IQ.

## Features

- **Monkey C (`.mc`, `.mb`, `.mcgen`)** language registration with TextMate syntax highlighting, comments/brackets, and language icons.
- **Jungle (`.jungle`)** language registration with syntax highlighting for comments, assignments, `$(...)` lookups, and common properties such as `sourcePath`, `resourcePath`, `manifest`, and `excludeAnnotations`.
- **Document formatting** for Monkey C and Jungle via the extension's built-in formatter (`Monkey C: Format Document` / editor Format Document). The formatter is lightweight and conservative; it is not Garmin's official compiler/formatter.
- **Monkey C** dark color theme (Dark+ palette style).
- **Monkey C Icons** file icon theme with light/dark variants for `.mc` and `.jungle`.
- **Breakpoints** contribution for Monkey C files.

## Compared with `garmin.monkey-c`

This extension copies/adapts the editor language surface that can be shipped without Garmin's proprietary runtime:

- Adapted Jungle grammar/language configuration patterns from the installed `garmin.monkey-c` extension (comments, `key = value`, `$(...)` lookups, common Jungle properties).
- Registers Monkey C and Jungle as VS Code languages/grammars.
- Adds Monkey C breakpoints contribution.

It intentionally does **not** bundle Garmin SDK integration features that require the official Connect IQ toolchain/extension runtime, including:

- Connect IQ build/run/test/export/debug commands
- SDK/device management, manifest editor, ERA/Monkey Graph/Monkey Motion launchers
- Java/DebugServer-backed language server features (autocomplete, definitions, references, rename, hover, type hierarchy, diagnostics from compiler)
- Task/debugger integrations that execute `monkeyc`, simulator, or SDK tools

For full Connect IQ project workflows, install the official
[Monkey C extension](https://marketplace.visualstudio.com/items?itemName=garmin.monkey-c)
and the Connect IQ SDK. If both extensions claim `monkeyc`/`source.monkeyc` or Jungle language IDs and behavior conflicts, disable one:

```bash
code --disable-extension garmin.monkey-c
```

## Formatting

Use **Format Document** in a `.mc` or `.jungle` file, or run:

- Command Palette → **Monkey C: Format Document**

Behavior:

- **Monkey C:** normalizes indentation, brace placement, and common spacing while preserving comments/strings. It is designed for readability and safe editor use, not full semantic reformatting.
- **Jungle:** normalizes blank-line runs and `key = value` spacing, preserves `#` comments.

## Install

### From source (development)

1. Open `packages/extensions/vscode` in VS Code.
2. Press `F5` to launch the Extension Development Host.
3. Open a `.mc` or `.jungle` file.
4. Run **Format Document** or select **Preferences: Color Theme → Monkey C**.

### Packaged VSIX

```bash
cd packages/extensions/vscode
npm install
npx @vscode/vsce package --out dist/monkey-c.vsix
code --install-extension dist/monkey-c.vsix --force
```

## Scopes

| Scope                                                         | Tokens                                            |
| ------------------------------------------------------------- | ------------------------------------------------- |
| `comment.line.double-slash.monkeyc` / `comment.block.monkeyc` | `// ...`, `/* ... */`                             |
| `string.quoted.double.monkeyc`                                | `"Hello Garmin"`                                  |
| `constant.numeric.*.monkeyc`                                  | `0xFF`, `3.14`, `240`                             |
| `constant.language.monkeyc`                                   | `true`, `false`, `null`                           |
| `keyword.other.monkeyc`                                       | `class`, `function`, `var`, `using`, control flow |
| `entity.name.function.monkeyc`                                | `initialize()`, `drawText()`                      |
| `storage.type.annotation.monkeyc`                             | `(:background)`                                   |
| `comment.line.number-sign.jungle`                             | `# comment`                                       |
| `storage.type.property.jungle`                                | `.sourcePath`, `.resourcePath`, `.manifest`       |
| `keyword.operator.assignment.jungle`                          | `=`                                               |
| `variable.other.lookup.jungle`                                | `$(base.sourcePath)`                              |

## Layout

```text
packages/extensions/vscode/
├── package.json
├── languages/
│   ├── monkeyc/language-configuration.json
│   └── jungle/language-configuration.json
├── src/
│   ├── extension.js               # format providers / command
│   └── format-monkeyc.js          # Monkey C + Jungle formatter
├── syntaxes/
│   ├── monkey-c.tmLanguage.json
│   └── jungle.tmLanguage.json
├── themes/monkey-c-color-theme.json
├── icons/
│   ├── monkey-c-icon-theme.json
│   ├── png/
│   └── svg/
├── samples/
│   ├── example.mc
│   └── example.jungle
└── README.md
```

## Development checks

```bash
cd packages/extensions/vscode
npm run test:format
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('ok')"
node -e "JSON.parse(require('fs').readFileSync('syntaxes/jungle.tmLanguage.json','utf8')); console.log('ok')"
```

## Runtime preview (SDK/simulator)

This extension can launch a true Connect IQ runtime preview when the Garmin SDK is installed locally:

- Command: **Monkey C: Runtime Preview (Simulator)**
- Builds the nearest buildable package (directory containing `monkey.jungle` and `manifest.xml`) with `monkeyc`, starts `connectiq` (simulator), waits briefly, then runs the generated PRG with `monkeydo`.

Settings:

- `monkeyC.sdkPath` — SDK root containing `bin/monkeyc`, `bin/monkeydo`, `bin/connectiq`. If empty, the extension checks `~/Library/Application Support/Garmin/ConnectIQ/current-sdk.cfg` and installed SDKs.
- `monkeyC.developerKeyPath` — developer signing key (`.der`). Required for `monkeyc` builds.
- `monkeyC.previewDevice` — device id for build/run (default `fr55`).

Static design previews remain available in `garmin/assets/design/svg/` and are useful when the SDK/simulator is unavailable.
