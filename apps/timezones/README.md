# TimeZones

Three-timezone text watchface for Garmin Connect IQ.

- `source/TimeZonesView.mc` — `WatchUi.WatchFace` showing London, Saigon, Melbourne
- `resources/layouts/layout.xml` — `TimeZonesLayout` resource used by the view

Shared library package: no `manifest.xml` or entry point. Include it from an
app's `monkey.jungle`:

```jungle
base.sourcePath = source;../timezones/source
base.resourcePath = resources;../timezones/resources
```
