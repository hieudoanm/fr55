# AGENTS.md

Guidance for coding agents working in `apps/maximalism`.

## Purpose

**Maximalism** is a Connect IQ watchface for `fr55` (240×240 MIP): black background, 12-dot hour ring with current hour highlighted, a minute marker, and centered battery/heart-rate text.

## Key files

- `manifest.xml` — app id `95dc2276-339d-4750-b1fa-e3d7e83d03fe`, `type="watchface"`, entry `MaximalismApp`, `minApiLevel="1.2.0"`, products include `fr55`/`venu3`/`fenix7`/`epix2`/`fr965`/`vivoactive5`, `eng`, no permissions.
- `source/MaximalismApp.mc` — app entry.
- `source/MaximalismView.mc` — drawing logic:
  - Ring radius `((centerX + centerY) / 2.0) / 1.25`.
  - Hour ring: 12 dots every 30°. Non-current hours white radius `5`; current hour (`clockHour % 12`) red radius `10`.
  - Minute marker: angle `(clockMinute + 45) * 6` degrees (radians), red filled circle radius `5`.
  - Center text (`FONT_SYSTEM_SMALL`): battery from `System.getSystemStats().battery` (`N/A` on error) and heart rate from `Activity.getActivityInfo().currentHeartRate` (fallback to `HH:mm`).
  - Note: class field `heartRate = "--"` is currently unused; the displayed text is computed in `onUpdate`.
- `resources/strings/strings.xml` — `AppName` = `Maximalism`.
- `Makefile` — `build`, `simulator`, `run`, `clean` (outputs `bin/maximalism.prg`).

## Build/run

Requires Connect IQ SDK and a developer key.

```bash
cd apps/maximalism
make build
make run
# or override:
make build DEVICE=fr55 SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" DEVELOPER_KEY="$HOME/.config/garmin/developer_key"
```

## Notes for changes

- Primary target is `fr55`; keep geometry device-size aware.
- Battery/HR access can fail or return `null`; preserve safe fallbacks.
- After `.mc` changes, run repo-root `./scripts/format.sh` and `./scripts/lint.sh`.
- Do not commit `bin/`, local SDK paths, or developer keys.
