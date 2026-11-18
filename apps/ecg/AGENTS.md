# AGENTS.md

Guidance for coding agents working in `apps/ecg`.

## Purpose

**ECG** is a Connect IQ watchface for `fr55` (240×240 MIP) implementing the `ecg` design from `assets/design/svg/ecg.svg`.

## Key files

- `manifest.xml` — `type="watchface"`, entry `App`, `minApiLevel="1.2.0"`, products include `fr55`/`venu3`/`fenix7`/`epix2`/`fr965`/`vivoactive5`, `eng`, no permissions.
- `source/App.mc` — app entry.
- `source/View.mc` — drawing logic.
- `resources/strings/strings.xml` — `AppName` = `ECG`.
- `Makefile` — `build`, `simulator`, `run`, `clean` (outputs `bin/ecg.prg`).

## Build/run

Requires Connect IQ SDK and a developer key.

```bash
cd apps/ecg
make build
make run
# or override:
make build DEVICE=fr55 SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" DEVELOPER_KEY="$HOME/.config/garmin/developer_key"
```

## Notes for changes

- Primary target is `fr55`; keep geometry device-size aware (`dc.getWidth/Height`).
- After `.mc` changes, match the surrounding style; formatting/linting lives in the `hieudoanm/monkey` repo (`monkey check` / `monkey format`).
- Do not commit `bin/`, local SDK paths, or developer keys.
