#!/usr/bin/env bash
set -euo pipefail

EXT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$EXT_DIR"

find_code() {
  local candidate

  if command -v code >/dev/null 2>&1; then
    command -v code
    return 0
  fi

  for candidate in \
    "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" \
    "/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/bin/code" \
    "$HOME/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"; do
    if [ -x "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

if ! CODE_BIN="$(find_code)"; then
  echo "error: the VS Code CLI ('code') was not found" >&2
  echo "install VS Code or add its bin directory to PATH" >&2
  exit 1
fi

VSCE="$EXT_DIR/node_modules/.bin/vsce"
if [ ! -x "$VSCE" ]; then
  echo "==> Installing build dependencies"
  npm install
fi

VERSION="$(node -p "require('./package.json').version")"
VSIX_DIR="$EXT_DIR/dist"
VSIX="$VSIX_DIR/monkey-c-$VERSION.vsix"

mkdir -p "$VSIX_DIR"

echo "==> Packaging monkey-c $VERSION"
"$VSCE" package --out "$VSIX"

echo "==> Installing $VSIX"
"$CODE_BIN" --install-extension "$VSIX" --force

echo "==> Installed hieudoanm.monkey-c $VERSION"

if "$CODE_BIN" --list-extensions 2>/dev/null | grep -qx 'garmin.monkey-c'; then
  echo
  echo "note: garmin.monkey-c is also installed and claims the same language id"
  echo "      (monkeyc) and scope (source.monkeyc). Disable it if this grammar"
  echo "      does not take effect: code --disable-extension garmin.monkey-c"
fi
