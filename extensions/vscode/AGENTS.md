# AGENTS.md

Guidance for coding agents working in `extensions/vscode`.

## Purpose

VS Code extension providing Monkey C/Jungle editor support for the FR55 Connect IQ repo:

- Syntax highlighting/language config for Monkey C (`.mc`, `.mb`, `.mcgen`) and Jungle (`.jungle`).
- Document formatting for Monkey C/Jungle.
- Dark theme and file icons.
- `Monkey C: Runtime Preview (Simulator)` command using a local Connect IQ SDK (`monkeyc`/`connectiq`/`monkeydo`).

The formatter and runtime preview are local extension features; this extension is not a replacement for Garmin's official Connect IQ SDK/toolchain workflows.

## Source layout

- `src/extension.ts` — activation, formatting providers, commands.
- `src/format-monkeyc.ts` — Monkey C/Jungle formatter logic.
- `src/format-monkeyc.test.ts` — Vitest tests for formatter.
- `src/runtime-preview.ts` — finds SDK/key/buildable package, builds PRG, launches simulator/app.
- `syntaxes/`, `languages/`, `themes/`, `icons/` — declarative VS Code contributions.
- `out/` — TypeScript build output (generated; not source of truth).

## Tooling

- Package manager: **pnpm** (`packageManager: pnpm@12.16.1`).
- Language: **TypeScript** (currently TS 6.x in this workspace).
- Build: `tsc` → CommonJS in `out/`.
- Lint: ESLint flat config (`eslint.config.mjs`) with `@eslint/js`, `typescript-eslint`, `eslint-config-prettier`.
- Format: Prettier (`prettier.config.mjs`).
- Test: Vitest (`vitest.config.ts`, `src/**/*.test.ts`).

## Commands

Run from `extensions/vscode`:

```bash
pnpm install
pnpm run format
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:watch
pnpm run build
pnpm run package -- --out monkey-c.vsix
```

`pnpm run build` is required before behavior that depends on compiled `out/*.js` (including repo-root `scripts/format.sh`/`lint.sh`, which load `out/format-monkeyc.js`).

## Implementation notes

- Keep the extension lightweight and safe; the Monkey C formatter is conservative, not a full parser and not Garmin's official formatter.
- When changing `format-monkeyc.ts`, add/update Vitest tests for representative Monkey C/Jungle cases (idempotency, comments, strings, braces/indentation, common control flow).
- After formatter behavior changes, run extension tests and then run repo-root `./scripts/format.sh` / `./scripts/lint.sh` if the change affects `*.mc` formatting.
- `tsconfig.json` currently uses CommonJS + `Node10` module resolution with `"ignoreDeprecations": "6.0"` for TS6 compatibility because the extension emits Node-consumed `out/*.js`. If migrating module settings, verify build output, VS Code runtime, Vitest, and root Monkey C scripts still work.
- Runtime preview depends on local Connect IQ SDK layout and a developer key; do not hardcode machine-specific SDK/key paths. Use settings/config discovery (`monkeyC.sdkPath`, `monkeyC.developerKeyPath`, `monkeyC.previewDevice`, SDK config paths).
- Preserve VS Code contribution IDs/commands/settings unless intentionally making a breaking change; update `package.json`, README, and tests/docs accordingly.

## Validation checklist

Before finishing extension changes:

```bash
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

For packaging changes, also verify `pnpm run package -- --out monkey-c.vsix`.
