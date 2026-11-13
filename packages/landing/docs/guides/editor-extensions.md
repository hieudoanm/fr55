# Editor extensions

Monkey C/Jungle editor support lives in two packages:

## VS Code — `packages/extensions/vscode`

- Syntax highlighting and language configuration for `.mc`/`.jungle`
- Document formatting (`Format Document` / `Monkey C: Format Document`)
- Dark theme and file icons
- **Monkey C: Runtime Preview (Simulator)** — builds the nearest Connect IQ
  package, starts the simulator, and runs the PRG with `monkeydo`

Configure `monkeyC.sdkPath`, `monkeyC.developerKeyPath`, and
`monkeyC.previewDevice` as needed.

Package a VSIX:

```bash
cd packages/extensions/vscode
pnpm install --frozen-lockfile
pnpm exec vsce package --no-dependencies --out monkey-c.vsix
```

## Zed — `packages/extensions/zed`

- Tree-sitter highlighting, brackets, indentation, folds, outline, text objects
- External formatter (`monkey-c-format`) for both languages
- Dark theme and file icon theme
- **Monkey C: Runtime Preview** and **Monkey C: Build PRG** tasks

```bash
cd packages/extensions/zed
./scripts/install.sh   # put monkey-c-format / monkey-c-preview on PATH
make test              # formatter tests + Jungle grammar tests
```
