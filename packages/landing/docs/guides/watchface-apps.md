# Watchface apps

Sixteen watchfaces ship under `apps/` — one per design in
[`assets/design/svg/`](../../../../../assets/design/svg/). Download the compiled
`.prg` for each from the
[`latest` release](https://github.com/hieudoanm/fr55/releases/latest).

| App           | Design                                                   | Download                                                                                           |
| ------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `hands`       | Analog hour/minute hands                                 | [hands.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-hands.prg)             |
| `minimalism`  | Hour/minute dots on a ring with centered heart rate/time | [minimalism.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-minimalism.prg)   |
| `maximalism`  | 12-hour dot ring, minute marker, battery + heart rate    | [maximalism.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-maximalism.prg)   |
| `timezones`   | Stacked London, local/Saigon, and Melbourne times        | [timezones.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-timezones.prg)     |
| `chronograph` | 60-tick chapter ring, hour/minute/second hands           | [chronograph.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-chronograph.prg) |
| `rings`       | Concentric progress rings for hour/minute/second         | [rings.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-rings.prg)             |
| `binary`      | Hour/minute as binary dot rows                           | [binary.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-binary.prg)           |
| `dotmatrix`   | 3×5 dot-matrix digits spelling the time                  | [dotmatrix.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-dotmatrix.prg)     |
| `roman`       | Roman numerals at the cardinal points, analog hands      | [roman.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-roman.prg)             |
| `pie`         | 12 pie sectors, current hour in red                      | [pie.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-pie.prg)                 |
| `ecg`         | Heartbeat trace, time, and live BPM                      | [ecg.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-ecg.prg)                 |
| `barcode`     | Hour/minute encoded as vertical bars                     | [barcode.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-barcode.prg)         |
| `spiral`      | Golden-angle dot spiral                                  | [spiral.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-spiral.prg)           |
| `split`       | Mini analog dial on top, large digital readout           | [split.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-split.prg)             |
| `compass`     | Cardinal markers with time-as-compass needles            | [compass.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-compass.prg)         |
| `moon`        | Crescent moon over a starfield                           | [moon.prg](https://github.com/hieudoanm/fr55/releases/download/latest/fr55-moon.prg)               |

Each app has its own `manifest.xml`, `monkey.jungle`, `resources/`,
`source/App.mc`, and `source/View.mc`, so it can be built and run independently
of the others.
