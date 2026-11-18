# Apps

Sixteen buildable Connect IQ watchface apps for the **Garmin Forerunner 55**
(`fr55`, 240×240 MIP). Each app is self-contained — `manifest.xml`,
`monkey.jungle`, `resources/`, `source/App.mc`, `source/View.mc`, and a
`Makefile` — and builds independently.

Every app implements one of the designs previewed in
[`../assets/design/svg/`](../assets/design/svg/) and showcased in the
[site gallery](https://hieudoanm.github.io/fr55/gallery/).

## Apps

| App           | Design                                                      |
| ------------- | ----------------------------------------------------------- |
| `hands`       | Pure analog — red hour/minute hands, no numerals or text    |
| `minimalism`  | Hour/minute dots on a ring with centered heart rate or time |
| `maximalism`  | 12-dot hour ring, minute marker, battery + heart rate       |
| `timezones`   | Stacked London, local/Saigon, and Melbourne times           |
| `chronograph` | 60-tick chapter ring, hour/minute/second hands              |
| `rings`       | Concentric progress rings for hour/minute/second            |
| `binary`      | Hour/minute as binary dot rows                              |
| `dotmatrix`   | 3×5 dot-matrix digits spelling the time                     |
| `roman`       | Roman numerals at the cardinal points, analog hands         |
| `pie`         | 12 pie sectors, current hour in red                         |
| `ecg`         | Heartbeat trace, time, and live BPM                         |
| `barcode`     | Hour/minute encoded as vertical bars                        |
| `spiral`      | Golden-angle dot spiral                                     |
| `split`       | Mini analog dial on top, large digital readout below        |
| `compass`     | Cardinal markers with time-as-compass needles               |
| `moon`        | Crescent moon over a starfield                              |

## Structure

Each app follows the same shape:

- `source/App.mc` — `App` entry point (`Application.AppBase`), returns the view.
- `source/View.mc` — `View` (`WatchUi.WatchFace`) with all drawing in `onUpdate`.
- `manifest.xml` — `type="watchface"`, `entry="App"`, `minApiLevel="1.2.0"`,
  products include `fr55`/`venu3`/`fenix7`/`epix2`/`fr965`/`vivoactive5`, `eng`,
  no permissions.
- `Makefile` — `build`, `simulator`, `run`, `clean` (outputs `bin/<app>.prg`).

## Conventions

- Geometry is device-size aware (`dc.getWidth()/getHeight()`), not hard-coded
  to 240×240.
- Watchfaces redraw automatically — Connect IQ calls `onUpdate()` once per
  minute in low-power mode and once per second in high-power mode. Do **not**
  call `WatchUi.requestUpdate()` inside `onUpdate()` (redraw loop).
- Heart rate (`Activity.getActivityInfo().currentHeartRate`) may be `null`;
  keep safe fallbacks.
- Formatting/linting: `monkey check apps/` and `monkey format --write apps/`
  (the `monkey` CLI from `hieudoanm/monkey`, on PATH).

## Build / runtime preview

```bash
cd apps/hands
make build DEVICE=fr55
make run    # builds, launches the simulator, and pushes the PRG
```

Or directly with the SDK:

```bash
monkeyc -f apps/hands/monkey.jungle -d fr55 -o apps/hands/bin/hands.prg -y /path/to/developer_key.der -w
monkeydo apps/hands/bin/hands.prg fr55
```
