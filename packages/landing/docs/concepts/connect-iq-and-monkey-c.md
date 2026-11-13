# Connect IQ and Monkey C

Garmin's Connect IQ platform runs third-party apps on wearable devices. Apps are
written in **Monkey C**, a Java-like language compiled by `monkeyc` into `.prg`
binaries.

## Project layout

Every app directory contains:

- `manifest.xml` — app metadata (name, version, permissions, device support)
- `monkey.jungle` — the project file listing source files and resources
- `resources/` — images, strings, and other assets
- `*App.mc` / `*View.mc` — the application and view classes

## The fr55 target

The Forerunner 55 is a 240×240 MIP (memory-in-pixel) device — monochrome, no
backlight. Designs are built around high-contrast layouts that stay readable in
sunlight.
