# How to install a watchface on the Forerunner 55

The [downloads page](https://hieudoanm.github.io/fr55/downloads/) lists a
compiled `.prg` for every watchface design. Each `.prg` is signed with an
ephemeral CI key — fine for sideloading, but not for the Garmin Connect IQ
store.

## Sideload over USB (recommended)

1. Connect the Forerunner 55 to your computer with a USB cable and wake the
   watch so the drive mounts.
2. Download the `.prg` you want from the
   [downloads page](https://hieudoanm.github.io/fr55/downloads/) — for example
   `fr55-hands.prg`.
3. Copy it onto the watch. The watch exposes a USB mass-storage volume —
   typically `/Volumes/GARMIN` on macOS or a removable drive on Windows/Linux.
   Put the file in the watch's app directory, e.g.:

```sh
cp fr55-hands.prg /Volumes/GARMIN/APPS/
```

4. Eject/unmount the volume safely and disconnect.
5. On the watch, open the app list and launch the new watchface.

## Alternative: Garmin Express / Connect IQ manager

If your watch does not expose a writable volume, use Garmin Express (or the
Connect IQ SDK's `monkeydo` tool) to push the `.prg` to the device.

## Multiple watchfaces

Copy as many `.prg` files as you like — each appears as a separate app on the
watch. Switch between them from the watch's app list or widget settings.

## Troubleshooting

- Watch does not mount — use a data-capable USB cable and keep the watch awake
  during connection.
- App missing after copy — make sure the `.prg` landed in the watch's app
  directory (`APPS/` or `MONKEY.PRO/` depending on firmware), not the root of
  the volume.
- "Untrusted app" prompt — expected for sideloaded builds; confirm on the watch
  to run it.
