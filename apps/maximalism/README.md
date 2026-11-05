# Maximalism

Minimal-dots watchface with battery and heart rate for Garmin Connect IQ.

- `source/MaximalismView.mc` — `WatchUi.WatchFace` with hour dots and minute dot
- `resources/layouts/layout.xml` — `MaximalismLayout` resource used by the view

Shared library package: no `manifest.xml` or entry point. Include it from an
app's `monkey.jungle`:

```jungle
base.sourcePath = source;../maximalism/source
base.resourcePath = resources;../maximalism/resources
```
