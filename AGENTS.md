# AGENTS.md

Guidance for coding agents working in this repository.

## Repository purpose

Connect IQ watchfaces and tooling for **Garmin Forerunner 55** (`fr55`, 240×240 MIP).

## Layout

- `apps/` — buildable Connect IQ watchface apps. Each app is self-contained: `manifest.xml`, `monkey.jungle`, `resources/`, `source/*App.mc`, `source/*View.mc`, and a `Makefile`.
  - Current apps: `hands`, `minimalism`, `maximalism`, `timezones`.
- `extensions/vscode/` — VS Code extension for Monkey C/Jungle (TypeScript). Has its own `AGENTS.md` and README.
- `extensions/zed/` — Zed extension for Monkey C/Jungle (Tree-sitter, theme, icons, formatter CLI, runtime-preview task). Has its own `AGENTS.md` and README.
- `assets/` — design previews, logos, OG assets, and `svg-to-png.sh`.
- `scripts/` — repo-level Monkey C helpers:
  - `format.sh` — format all `*.mc` files.
  - `lint.sh` — check trailing whitespace, tabs, and formatter drift.
  - `monkeyc-tools.js` — uses `extensions/vscode/out/format-monkeyc.js` (builds the extension formatter if missing).
- `.github/workflows/ci.yaml` — extension CI/release: VS Code lint/typecheck/Vitest/build/VSIX packaging, Zed formatter/grammar validation, and the rolling `latest` VSIX release on `master`/`main`.

## Working conventions

- Keep changes focused and match existing project structure.
- Prefer editing existing files; do not create new watchface packages/apps unless requested.
- Preserve `fr55` as the primary target unless intentionally changing device support. Check each app `manifest.xml` before changing products, permissions, languages, or API level.
- Do not commit secrets, developer keys, SDK credentials, or local machine paths as required defaults beyond existing local-dev conventions.
- `apps/*/bin/`, `extensions/vscode/out/`, `extensions/vscode/dist/`, `node_modules/`, and generated artifacts should not be committed unless explicitly intended.

## Monkey C (`apps/`, `*.mc`)

- Run from repo root after Monkey C changes:

```bash
./scripts/format.sh
./scripts/lint.sh
```

- `lint.sh` must pass before considering Monkey C edits complete.
- The formatter is conservative (indentation/brace/common spacing). Review diffs after formatting.
- App builds require the Connect IQ SDK and a developer key:

```bash
cd apps/hands
make build DEVICE=fr55 SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" DEVELOPER_KEY="$HOME/.config/garmin/developer_key"
```

Do not claim an app build/run succeeded unless you actually ran it in an environment with the required SDK/key.

## VS Code extension (`extensions/vscode`)

Use pnpm in `extensions/vscode`:

```bash
cd extensions/vscode
pnpm install
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

CI runs these checks for extension changes. See `extensions/vscode/AGENTS.md` for TypeScript/tooling details.

## Zed extension (`extensions/zed`)

No package install is required; the formatter uses Node built-ins and the grammar uses the Tree-sitter CLI via `npx`:

```bash
cd extensions/zed
make test                 # node --test formatter/ + Jungle grammar corpus
./scripts/install.sh      # symlink monkey-c-format / monkey-c-preview into ~/.local/bin
```

- Zed uses Tree-sitter queries under `languages/*/` and a vendored Jungle grammar under `grammars/tree-sitter-jungle/`. Commit generated parser files after editing `grammar.js`.
- The Jungle grammar is fetched from this repository at `rev = "master"`. It must be committed and pushed before a Zed dev install or release can resolve it; pin `rev` to a commit for releases.
- `scripts/runtime-preview.mjs` mirrors `extensions/vscode/src/runtime-preview.ts` and discovers the SDK/key via flags, env vars, and standard Garmin paths.
- See `extensions/zed/AGENTS.md` for details.

## CI/release

- CI is triggered by changes under `apps/**`, `scripts/**`, `extensions/vscode/**`, `extensions/zed/**`, `extensions/landing/**`, and workflow dispatch.
- On pushes to `master`/`main`, CI updates GitHub release tag `latest` with `monkey-c.vsix`; release notes come from `extensions/vscode/README.md`.
- Be careful changing `.github/workflows/ci.yaml`: pnpm must be available before `actions/setup-node` when using `cache: pnpm`.

## Docs/assets

- Update `README.md`, `apps/README.md`, or extension docs when behavior/commands/structure change.
- Design previews live in `assets/design/svg|png`; OG assets in `assets/og/svg|png`.
- `assets/svg-to-png.sh` converts SVGs under `assets/*/svg/` to parallel `png/` outputs while preserving aspect ratio by default.
