# AGENTS.md

Guidance for coding agents working in this repository.

## Repository purpose

Connect IQ watchfaces for the **Garmin Forerunner 55** (`fr55`, 240×240 MIP).
Monkey C editor tooling (VS Code/Zed extensions, `monkey` CLI) lives in the
companion repo `hieudoanm/monkey` — do not re-add it here.

## Layout

- `apps/` — 16 buildable Connect IQ watchface apps. Each app is self-contained: `manifest.xml`, `monkey.jungle`, `resources/`, `source/App.mc`, `source/View.mc`, and a `Makefile` — one app per design in `assets/design/svg/`.
- `packages/landing/` — Next.js static-export landing page + docs, deployed to GitHub Pages. Has its own `AGENTS.md`.
- `assets/` — design previews (`design/svg|png`), branding, `svg-to-png.sh`, `sync-assets.sh`.
- `.github/workflows/ci.yaml` — apps PRG build (throwaway openssl signing key generated in CI), rolling `latest` GitHub release with `.prg` files, and landing build + GitHub Pages deploy on `master`/`main`.
- `ci/devices/fr55.zip` — vendored Connect IQ `fr55` device files used by CI (the devices API requires Garmin login; only `fr55` is needed since all Makefiles build `DEVICE=fr55`).

## Working conventions

- Keep changes focused and match existing project structure.
- Prefer editing existing files; do not create new watchface apps unless requested.
- Preserve `fr55` as the primary target unless intentionally changing device support. Check each app `manifest.xml` before changing products, permissions, languages, or API level.
- Do not commit secrets, developer keys, SDK credentials, or local machine paths as required defaults beyond existing local-dev conventions.
- `apps/*/bin/`, `node_modules/`, `packages/landing/out/`, and generated artifacts should not be committed unless explicitly intended.

## Monkey C (`apps/`, `*.mc`)

- Formatting/linting for `*.mc`/`*.jungle` uses the `monkey` CLI (installed
  from `hieudoanm/monkey`, on PATH as `monkey`):

```bash
monkey check apps/            # lint + format-check
monkey format --write apps/   # apply formatting
```

- `monkey check apps/` must pass before considering `.mc` edits complete.
- App builds require the Connect IQ SDK and a developer key:

```bash
cd apps/hands
make build DEVICE=fr55 SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" DEVELOPER_KEY="$HOME/.config/garmin/developer_key"
```

Do not claim an app build/run succeeded unless you actually ran it in an environment with the required SDK/key.

## Landing page (`packages/landing`)

```bash
cd packages/landing
pnpm install
pnpm run dev
pnpm run build   # static export → out/
```

- `output: "export"` must stay — the site must build to static HTML in `out/`; no server features or API routes.
- `basePath`/`assetPrefix` are `/fr55` in production; raw `<img src>` paths must include it.
- See `packages/landing/AGENTS.md` for details.

## CI/pages

- CI is triggered by changes under `apps/**`, `assets/**`, `packages/landing/**`, `ci/**`, and workflow dispatch.
- On pushes to `master`/`main`, CI builds all `apps/*` into signed `.prg` files (Connect IQ SDK downloaded publicly; `fr55` device files from `ci/devices/fr55.zip`; a throwaway PKCS#8 key generated with openssl signs each build), publishes them to the rolling `latest` GitHub release (notes from `RELEASE.md`), and deploys `packages/landing/out` to GitHub Pages.
- The CI signing key is ephemeral — fine for sideloaded PRGs. If the apps are ever submitted to the Garmin store, sign with the real developer key instead.
- Be careful changing `.github/workflows/ci.yaml`: pnpm must be available before `actions/setup-node` when using `cache: pnpm`.

## Docs/assets

- Update `README.md`, `apps/README.md`, or landing docs when behavior/commands/structure change.
- Design previews live in `assets/design/svg|png`; OG/branding assets in `assets/branding/` and `assets/og/`.
- `assets/svg-to-png.sh` converts SVGs under `assets/*/svg/` to parallel `png/` outputs; `assets/sync-assets.sh` syncs branding into `packages/landing/public/`.
- `packages/landing/public/watchfaces/` vendors `assets/design/svg/*.svg` — re-copy when designs change.
