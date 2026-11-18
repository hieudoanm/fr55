# Contributing

Thanks for contributing to the Forerunner 55 Connect IQ watchface repo.

## Scope

This repo contains:

- `apps/*` — buildable Connect IQ watchface apps (Monkey C).
- `packages/landing` — static landing page + docs deployed to GitHub Pages.
- `assets/*` — design previews, logos, and OG assets.

Monkey C editor tooling (VS Code/Zed extensions, `monkey` CLI) lives in the
companion repo `hieudoanm/monkey`.

## Prerequisites

- [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) for the landing page.
- [Garmin Connect IQ SDK](https://developer.garmin.com/connect-iq/sdk/) and a developer key for building/running watchface apps.
- `monkeyc`/`monkeydo`/simulator access as needed for Connect IQ workflows.

## Setup

```bash
git clone https://github.com/hieudoanm/fr55.git
cd fr55
```

Landing page dependencies:

```bash
cd packages/landing
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

Monkey C formatting/linting is handled by the `monkey` CLI in the
`hieudoanm/monkey` repo — see its README for `monkey check` / `monkey format`.

## Landing page (`packages/landing`)

Next.js 16 static export (Tailwind v4 + DaisyUI). See `packages/landing/AGENTS.md` for conventions.

```bash
cd packages/landing
pnpm run typecheck
pnpm run lint
pnpm run build
```

## CI

`.github/workflows/ci.yaml` runs for changes under `apps/**`, `assets/**`, `packages/landing/**`, and workflow dispatch. It builds the landing page and deploys it to GitHub Pages on pushes to `master`/`main`.

## Pull requests

- Make small, focused changes.
- Update docs/assets when behavior or structure changes.
- Run relevant checks locally (landing `pnpm run typecheck && pnpm run lint && pnpm run build` for `packages/landing` changes).
- Do not commit secrets, developer keys, or local SDK credentials.

## License

By contributing, you agree that your contributions will be licensed under the repository license in [`LICENSE`](LICENSE).
