# AGENTS.md

Guidance for coding agents working in `apps/minimalism`.

## Purpose

**Minimalism** is a Connect IQ watchface for `fr55` (240×240 MIP): black background, red hour/minute dots on an invisible ring, and centered heart rate (fallback to `HH:mm` when unavailable).

## Key files

- `manifest.xml` — app id `97632e2e-318b-41f7-a444-d911596b8bf9`, `type="watchface"`, entry `MinimalismApp`, `minApiLevel="1.2.0"`, products include `fr55`/`venu3`/`fenix7`/`epix2`/`fr965`/`vivoactive5`, `eng`, no permissions.
- `source/MinimalismApp.mc` — app entry.
- `source/MinimalismView.mc` — drawing logic:
  - Ring radius `((centerX + centerY) / 2.0) / 1.25`.
  - Hour dot: continuous hour (`clockHour + clockMinute/60`), angle `(hour - 3) * 30` degrees (radians), red filled circle radius `10`.
  - Minute dot: angle `(clockMinute + 45) * 6` degrees (radians), red filled circle radius `5`.
  - Center text (`FONT_SYSTEM_SMALL`): `Activity.getActivityInfo().currentHeartRate` when present, else formatted local time.
- `resources/strings/strings.xml` — `AppName` = `Minimalism`.
- `Makefile` — `build`, `simulator`, `run`, `clean` (outputs `bin/minimalism.prg`).

## Build/run

Requires Connect IQ SDK and a developer key.

```bash
cd apps/minimalism
make build
make run
# or override:
make build DEVICE=fr55 SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" DEVELOPER_KEY="$HOME/.config/garmin/developer_key"
```

## Notes for changes

- Primary target is `fr55`; keep geometry device-size aware.
- Heart rate may be `null`; preserve a safe fallback.
- After `.mc` changes, run repo-root `./scripts/format.sh` and `./scripts/lint.sh`.
- Do not commit `bin/`, local SDK paths, or developer keys.
