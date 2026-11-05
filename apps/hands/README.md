# Hands

Binary hands watchface for Garmin Connect IQ.

- `source/HandsView.mc` — `WatchUi.WatchFace` with hour/minute hands
- `resources/layouts/layout.xml` — `HandsLayout` resource used by the view

Shared library package: no `manifest.xml` or entry point. Include it from an
app's `monkey.jungle`:

```jungle
base.sourcePath = source;../hands/source
base.resourcePath = resources;../hands/resources
```
