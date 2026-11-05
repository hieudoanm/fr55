# Apps

Buildable Connect IQ watchface apps for FR55 / Garmin Connect IQ devices (focused on Forerunner 55, `fr55`, 240×240 MIP). Each app is a buildable Connect IQ watchface with its own `manifest.xml`, `monkey.jungle`, `resources/`, `*View.mc`, and `*App.mc`. This matches the buildable-app shape used in `hieudoanm.github.io/packages/watch/garmin` (manifest + app entry + view), while keeping each face in its own app for independent build/preview.

Design previews live in [`../assets/design/svg/`](../assets/design/svg/).

## Hands (`hands/`)

**Preview:** [`../assets/design/svg/hands.svg`](../assets/design/svg/hands.svg)
**App:** `HandsApp` (`hands/source/HandsApp.mc`) → `HandsView` (`hands/source/HandsView.mc`)

- **Look:** pure black background with two red analog hands and a small red center pivot — no numerals, ticks, or text.
- **Drawing:** computes `centerX/Y` from device size. Reads `System.getClockTime()` (`hours % 12`, `minutes`).
  - Hour angle: `(hours * 30) + (minutes / 60.0 * 30)` degrees (hour advances with minutes).
  - Minute angle: `minutes * 6` degrees.
  - Hour hand: length `screenWidth * 0.35`, stroke width `6`, red (`Graphics.COLOR_RED`).
  - Minute hand: length `screenWidth * 0.45`, stroke width `4`, red.
  - `drawHand` converts degrees to radians and draws a line from center using `sin`/`cos`.
- **Behavior note:** `onUpdate()` calls `WatchUi.requestUpdate()` every update, which can create a redraw loop and extra battery drain; a minute timer / low-power watchface cycle is the intended fix.

## Minimalism (`minimalism/`)

**Preview:** [`../assets/design/svg/minimalism.svg`](../assets/design/svg/minimalism.svg)
**App:** `MinimalismApp` → `MinimalismView`

- **Look:** black background, two red dots on an invisible ring, and a centered value — minimal analog indicator plus a single metric.
- **Drawing:** ring radius `((centerX + centerY) / 2.0) / 1.25` from device center.
  - Hour dot: continuous hour value (`clockHour + clockMinute/60`), angle `(hour - 3) * 30` degrees, red filled circle radius `10`.
  - Minute dot: angle `(clockMinute + 45) * 6` degrees, red filled circle radius `5`.
  - Center text (`FONT_SYSTEM_SMALL`, centered): shows current heart rate (`Activity.getActivityInfo().currentHeartRate`) when available; otherwise falls back to local time formatted as `HH:mm`.
- **Readability:** no labels or ticks; relies on dot position and high-contrast red on black for the MIP display.

## Maximalism (`maximalism/`)

**Preview:** [`../assets/design/svg/maximalism.svg`](../assets/design/svg/maximalism.svg)
**App:** `MaximalismApp` → `MaximalismView`

- **Look:** black background, a 12-dot hour ring, a minute marker, and centered status text.
- **Drawing:** same ring radius formula as Minimalism.
  - Hour ring: 12 dots placed every 30 degrees. Non-current hours are white, radius `5`. The current hour (`clockHour % 12`) is highlighted red, radius `10`.
  - Minute marker: angle `(clockMinute + 45) * 6` degrees, red filled circle radius `5`.
  - Center text (`FONT_SYSTEM_SMALL`, centered): battery percentage from `System.getSystemStats().battery` (or `N/A` on error) and heart rate from `Activity.getActivityInfo().currentHeartRate` (falls back to `HH:mm` if unavailable).
- **State:** class has an unused `heartRate = "--"` field; actual text is computed in `onUpdate`.

## TimeZones (`timezones/`)

**Preview:** [`../assets/design/svg/timezones.svg`](../assets/design/svg/timezones.svg)
**App:** `TimeZonesApp` → `TimeZonesView`

- **Look:** black background with three stacked red time rows for quick comparison.
- **Drawing:** centered red text block using `FONT_SYSTEM_NUMBER_MILD`.
  - `getHourForTimezone(offsetHours)`: derives GMT hour from device time and `timeZoneOffset`, adds the target UTC offset, normalizes to `0..23`.
  - Rows (all share device minute, zero-padded): **London** = UTC+0, **Saigon** = device local hour, **Melbourne** = UTC+10.
- **Limitations:** London/Melbourne use fixed offsets (no daylight saving rules). Saigon is represented by the watch’s local time.

## Build / runtime preview

Each app can be built independently with the Connect IQ SDK:

```bash
monkeyc -f apps/hands/monkey.jungle -d fr55 -o apps/hands/bin/hands.prg -y /path/to/developer_key.der -w
monkeydo apps/hands/bin/hands.prg fr55
```

From VS Code, use the custom extension command **Monkey C: Runtime Preview (Simulator)** (requires `monkeyC.sdkPath` or installed Connect IQ SDK and `monkeyC.developerKeyPath`), or use the official Garmin Monkey C extension workflow.
