# Contributing

Thanks for contributing to the Forerunner 55 Connect IQ repo.

## Scope

This repo contains:

- `apps/*` — buildable Connect IQ watchface apps (Monkey C).
- `packages/extensions/vscode` — VS Code extension for Monkey C/Jungle (TypeScript).
- `assets/*` — design, logo, and OG assets.
- `scripts/*` — repo-level Monkey C format/lint helpers.

## Prerequisites

- [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) for the VS Code extension.
- [Garmin Connect IQ SDK](https://developer.garmin.com/connect-iq/sdk/) and a developer key for building/running watchface apps or using runtime preview.
- `monkeyc`/`monkeydo`/simulator access as needed for Connect IQ workflows.

## Setup

```bash
git clone https://github.com/hieudoanm/fr55.git
cd fr55
```

VS Code extension dependencies:

```bash
cd packages/extensions/vscode
pnpm install
```

## Watchface apps (`apps/*`)

Each app is self-contained (`manifest.xml`, `monkey.jungle`, `resources/`, `source/*App.mc`, `source/*View.mc`).

Build/run from an app directory:

```bash
cd apps/hands
make build
make run
```

Override SDK/device/key as needed:

```bash
make build DEVICE=fr55 SDK="/path/to/ConnectIQ/Sdks/<sdk>" DEVELOPER_KEY="/path/to/developer_key"
```

Keep changes focused, preserve the Forerunner 55 (`fr55`) target unless intentionally expanding device support, and check manifests when adding products/permissions.

## Monkey C formatting/linting

Use the repo scripts from the repository root:

```bash
./scripts/format.sh
./scripts/lint.sh
```

`lint.sh` checks trailing whitespace, tabs, and formatter drift for `*.mc` files. Fix formatting issues with `format.sh` before opening a PR.

## VS Code extension (`packages/extensions/vscode`)

The extension is written in TypeScript and uses ESLint, Prettier, and Vitest.

```bash
cd packages/extensions/vscode
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run package -- --out monkey-c.vsix
```

Useful commands:

- `pnpm run watch` — TypeScript watch build.
- `pnpm run test:watch` — Vitest watch mode.
- `pnpm run format` — format extension files with Prettier.

## CI

`.github/workflows/ci.yaml` runs for changes under `packages/extensions/vscode/**` and workflow dispatch. It installs dependencies with pnpm, runs lint/format/typecheck/tests/build, packages `monkey-c.vsix`, and updates the rolling `latest` GitHub release on pushes to `master`/`main`.

## Pull requests

- Make small, focused changes.
- Update docs/assets when behavior or structure changes.
- Run relevant checks locally (`./scripts/lint.sh` for Monkey C changes; extension checks above for `packages/extensions/vscode` changes).
- Do not commit secrets, developer keys, or local SDK credentials.

## License

By contributing, you agree that your contributions will be licensed under the repository license in [`LICENSE`](LICENSE).
