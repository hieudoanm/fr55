# AGENTS.md

Guidance for coding agents working in `apps/hands`.

## Purpose

**Hands** is a minimal analog Connect IQ watchface for the Forerunner 55 (`fr55`, 240×240 MIP): black background, red hour/minute hands, and a small implied pivot (no numerals/ticks/text).

## Key files

- `manifest.xml` — app id `60b87680-1472-426d-b580-eceafdb82dc8`, `type="watchface"`, entry `App`, `minApiLevel="1.2.0"`, products include `fr55`/`venu3`/`fenix7`/`epix2`/`fr965`/`vivoactive5`, `eng`, no permissions.
- `source/App.mc` — app entry.
- `source/View.mc` — drawing logic:
  - Reads `System.getClockTime()` (`hour % 12`, `min`).
  - Hour angle `(hours * 30) + (minutes / 60.0 * 30)` degrees; minute angle `minutes * 6`.
  - Hour hand length `width * 0.35`, stroke 6; minute hand `width * 0.45`, stroke 4; both red.
  - `drawHand` converts degrees to radians and draws a center-to-tip line.
- `resources/strings/strings.xml` — `AppName` = `Hands`.
- `Makefile` — `build`, `simulator`, `run`, `clean` (outputs `bin/hands.prg`).

## Build/run

Requires Connect IQ SDK and a developer key.

```bash
cd apps/hands
make build
make run
# or override:
make build DEVICE=fr55 SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" DEVELOPER_KEY="$HOME/.config/garmin/developer_key"
```

## Notes for changes

- Primary target is `fr55`; keep layout/device-size calculations resolution-aware (`dc.getWidth/Height`).
- Watch faces get `onUpdate()` automatically (once per minute in low-power mode, once per second in high-power mode) — do not call `WatchUi.requestUpdate()` inside `onUpdate()`; that creates a redraw loop and battery drain.
- After `.mc` changes, match the surrounding style; formatting/linting lives in the `hieudoanm/monkey` repo (`monkey check` / `monkey format`).
- Do not commit `bin/`, local SDK paths, or developer keys.
