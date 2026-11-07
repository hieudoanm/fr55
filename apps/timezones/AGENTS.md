# AGENTS.md

Guidance for coding agents working in `apps/timezones`.

## Purpose

**TimeZones** is a Connect IQ watchface for `fr55` (240×240 MIP): black background with three stacked red time rows for quick comparison (London, local/Saigon, Melbourne).

## Key files

- `manifest.xml` — app id `63856268-fda6-4cb8-bdd6-1c3c7922a948`, `type="watchface"`, entry `TimeZonesApp`, `minApiLevel="1.2.0"`, products include `fr55`/`venu3`/`fenix7`/`epix2`/`fr965`/`vivoactive5`, `eng`, no permissions.
- `source/TimeZonesApp.mc` — app entry.
- `source/TimeZonesView.mc` — drawing logic:
  - `getTimeForTimezone(offsetHours)`: computes minutes since device-local midnight, subtracts `timeZoneOffset` (minutes), adds the target UTC offset, normalizes to `0..1439`, and returns `HH:mm`. Minute-accurate, so half-hour device offsets and day rollover are handled.
  - Rows: **London** = UTC+0, **Saigon** = device local time, **Melbourne** = UTC+10; each row gets its own computed `HH:mm`.
  - Renders centered red text with `FONT_SYSTEM_NUMBER_MILD`.
- `resources/strings/strings.xml` — `AppName` = `TimeZones`.
- `Makefile` — `build`, `simulator`, `run`, `clean` (outputs `bin/timezones.prg`).

## Build/run

Requires Connect IQ SDK and a developer key.

```bash
cd apps/timezones
make build
make run
# or override:
make build DEVICE=fr55 SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" DEVELOPER_KEY="$HOME/.config/garmin/developer_key"
```

## Notes for changes

- London/Melbourne use **fixed** UTC offsets (no DST rules). Saigon is represented by the watch’s local time. Preserve/clearly document these limitations if changing behavior.
- Keep hour normalization correct for negative/overflow values.
- After `.mc` changes, run repo-root `./scripts/format.sh` and `./scripts/lint.sh`.
- Do not commit `bin/`, local SDK paths, or developer keys.
