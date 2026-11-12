#!/usr/bin/env bash
#
# install.sh — Install the monkey-c VS Code extension from the latest GitHub
# release .vsix package.
#
# Usage:
#   ./scripts/install.sh
set -euo pipefail

REPO="hieudoanm/fr55"
VSIX_URL="https://github.com/${REPO}/releases/latest/download/monkey-c.vsix"

if ! command -v code >/dev/null 2>&1; then
    echo "VS Code CLI ('code') not found on PATH."
    echo "Install it from VS Code (Shell Command: Install 'code' command in PATH)"
    echo "or download the .vsix manually: ${VSIX_URL}"
    exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Downloading monkey-c.vsix from the latest release..."
if ! curl -fsSL "$VSIX_URL" -o "$TMP_DIR/monkey-c.vsix"; then
    echo "error: could not download ${VSIX_URL}" >&2
    echo "hint: no prebuilt release yet — build locally with ./scripts/install-local.sh" >&2
    exit 1
fi

code --install-extension "$TMP_DIR/monkey-c.vsix" --force
echo "monkey-c installed into VS Code"
