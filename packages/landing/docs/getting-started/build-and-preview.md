# Build and preview an app

Each app under `apps/` builds independently with the Connect IQ SDK.

## Build

```bash
cd apps/hands
make build                      # builds bin/hands.prg for fr55
```

## Run in the simulator

```bash
make run                        # builds, starts simulator, launches with monkeydo
```

## Variables

The app `Makefile`s accept configurable variables:

```bash
make build DEVICE=fr55 \
  SDK="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/<sdk>" \
  DEVELOPER_KEY="$HOME/.config/garmin/developer_key"
```

## Direct SDK commands

```bash
monkeyc -f apps/hands/monkey.jungle -d fr55 -o apps/hands/bin/hands.prg -y /path/to/developer_key -w
monkeydo apps/hands/bin/hands.prg fr55
```

`monkeyc` compiles the `.jungle` project file into a `.prg`; `monkeydo` runs it
in the simulator (or on a device in debug mode).
