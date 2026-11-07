.PHONY: build run simulator clean

DEVICE ?= fr55
SDK ?= $(HOME)/Library/Application Support/Garmin/ConnectIQ/Sdks/connectiq-sdk-mac-9.3.0-2026-10-20-95888f262
MONKEYC ?= $(SDK)/bin/monkeyc
MONKEYDO ?= $(SDK)/bin/monkeydo
CONNECTIQ ?= $(SDK)/bin/connectiq
DEVELOPER_KEY ?= $(HOME)/.config/garmin/developer_key
OUTPUT ?= bin/minimalism.prg

build:
	mkdir -p bin
	"$(MONKEYC)" -f monkey.jungle -d $(DEVICE) -o "$(OUTPUT)" -y "$(DEVELOPER_KEY)" -w

simulator:
	@if ! pgrep -f "$(CONNECTIQ)" >/dev/null 2>&1; then \
		"$(CONNECTIQ)" >/dev/null 2>&1 & \
	fi

run: build simulator
	sleep 2
	"$(MONKEYDO)" "$(OUTPUT)" $(DEVICE)

clean:
	rm -rf bin
