## FR55 Watchfaces — latest build

Compiled Connect IQ watchface apps (`.prg`) for the **Garmin Forerunner 55**
(`fr55`, 240×240 MIP), built from `master` with the Connect IQ SDK.

### Apps

| File                   | Watchface                                             |
| ---------------------- | ----------------------------------------------------- |
| `fr55-hands.prg`       | Analog hour/minute hands                              |
| `fr55-minimalism.prg`  | Hour/minute dots on a ring with heart rate/time       |
| `fr55-maximalism.prg`  | 12-hour dot ring, minute marker, battery + heart rate |
| `fr55-timezones.prg`   | Stacked London, local/Saigon, and Melbourne times     |
| `fr55-chronograph.prg` | 60-tick chapter ring, hour/minute/second hands        |
| `fr55-rings.prg`       | Concentric progress rings for hour/minute/second      |
| `fr55-binary.prg`      | Hour/minute as binary dot rows                        |
| `fr55-dotmatrix.prg`   | 3×5 dot-matrix digits spelling the time               |
| `fr55-roman.prg`       | Roman numerals at the cardinal points, analog hands   |
| `fr55-pie.prg`         | 12 pie sectors, current hour in red                   |
| `fr55-ecg.prg`         | Heartbeat trace, time, and live BPM                   |
| `fr55-barcode.prg`     | Hour/minute encoded as vertical bars                  |
| `fr55-spiral.prg`      | Golden-angle dot spiral                               |
| `fr55-split.prg`       | Mini analog dial on top, large digital readout        |
| `fr55-compass.prg`     | Cardinal markers with time-as-compass needles         |
| `fr55-moon.prg`        | Crescent moon over a starfield                        |

### Install

Copy the `.prg` to `GARMIN/APPS/` on the watch over USB mass storage, or push
it with Garmin Express / the Connect IQ simulator (`monkeydo <file>.prg fr55`).

### Build from source

Requires the [Connect IQ SDK](https://developer.garmin.com/connect-iq/sdk/)
and a developer key:

```bash
cd apps/hands
make build DEVICE=fr55 \
  SDK="/path/to/connectiq-sdk" \
  DEVELOPER_KEY="/path/to/developer_key.der"
```

### Documentation

- [Repo README](https://github.com/hieudoanm/fr55#readme)
- [Site & docs](https://hieudoanm.github.io/fr55/)
- [Watchface gallery](https://hieudoanm.github.io/fr55/gallery/)
