# Watchface designs

`assets/design/svg/` in the repository holds 16 watchface design previews in a
240×240 circular MIP style — black background, red (`#ff0000`) accents, and the
conventional 10:10 hand position for analog faces. The rendered PNGs live in
`assets/design/png/`, and the site gallery at `/gallery` showcases all of them.

| Design        | Concept                                                             |
| ------------- | ------------------------------------------------------------------- |
| `hands`       | Pure analog — red hour and minute hands, no numerals or text.       |
| `minimalism`  | Hour/minute dots on a ring with centered heart rate or time.        |
| `maximalism`  | 12-dot hour ring, minute marker, and battery/heart-rate status.     |
| `timezones`   | Three stacked world-clock rows — London, local, and Melbourne.      |
| `chronograph` | Full 60-tick minute track, bold hour markers, sweeping second hand. |
| `rings`       | Concentric progress arcs for hours, minutes, and seconds.           |
| `binary`      | Hour and minute as binary dot rows.                                 |
| `dotmatrix`   | Classic 3×5 dot-matrix digits spelling out the time.                |
| `roman`       | Roman numerals at the cardinal points with classic analog hands.    |
| `pie`         | Twelve pie sectors for the hours — the current hour filled red.     |
| `ecg`         | Heartbeat pulse trace with the time up top.                         |
| `barcode`     | Hour and minute encoded as vertical bar patterns.                   |
| `spiral`      | Golden-angle dot spiral with the latest dots marking the time.      |
| `split`       | Mini analog dial on top, big digital readout below.                 |
| `compass`     | Cardinal N/E/S/W markers with a red needle on the minute bearing.   |
| `moon`        | Waxing moon phase over a starfield with the time underneath.        |

The four apps under `apps/` (`hands`, `minimalism`, `maximalism`, `timezones`)
are buildable Connect IQ implementations; the remaining designs are visual
concepts that can be turned into apps the same way.
