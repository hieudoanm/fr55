#!/usr/bin/env bash
#
# install-local.sh — Build the monkey-c VS Code extension from this checkout
# and install it into VS Code.
#
# Unlike install.sh (which downloads the latest release .vsix), this script
# always packages and installs the working tree, making it suitable for
# development and testing local changes.
#
# Usage:
#   ./scripts/install-local.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXT_DIR="$REPO_ROOT/packages/extensions/vscode"
VSIX="$EXT_DIR/monkey-c.vsix"

if ! command -v code >/dev/null 2>&1; then
    echo "VS Code CLI ('code') not found on PATH." >&2
    exit 1
fi
if ! command -v pnpm >/dev/null 2>&1; then
    echo "pnpm not found; install it from https://pnpm.io" >&2
    exit 1
fi

echo "Building extension..."
cd "$EXT_DIR"
pnpm install --frozen-lockfile
pnpm run build
pnpm exec vsce package --no-dependencies --out monkey-c.vsix

code --install-extension "$VSIX" --force
echo "monkey-c (local build) installed into VS Code"
