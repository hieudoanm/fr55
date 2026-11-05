# Minimalism

Minimal-dots watchface with heart rate for Garmin Connect IQ.

- `source/MinimalismView.mc` — `WatchUi.WatchFace` with hour/minute dots
- `resources/layouts/layout.xml` — `MinimalismLayout` resource used by the view

Shared library package: no `manifest.xml` or entry point. Include it from an
app's `monkey.jungle`:

```jungle
base.sourcePath = source;../minimalism/source
base.resourcePath = resources;../minimalism/resources
```
