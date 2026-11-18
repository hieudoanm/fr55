## FR55 Watchfaces — latest build

Compiled Connect IQ watchface apps (`.prg`) for the **Garmin Forerunner 55**
(`fr55`, 240×240 MIP), built from `master` with the Connect IQ SDK.

### Apps

| File                  | Watchface                                             |
| --------------------- | ----------------------------------------------------- |
| `hands-fr55.prg`      | Analog hour/minute hands                              |
| `minimalism-fr55.prg` | Hour/minute dots on a ring with heart rate/time       |
| `maximalism-fr55.prg` | 12-hour dot ring, minute marker, battery + heart rate |
| `timezones-fr55.prg`  | Stacked London, local/Saigon, and Melbourne times     |

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
