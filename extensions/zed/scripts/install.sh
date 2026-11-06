#!/usr/bin/env bash
# Symlink the formatter and runtime-preview CLIs into a directory on PATH so
# Zed's external formatter and language tasks can call them by name.
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
extension_dir="$(cd "$script_dir/.." && pwd)"
bin_dir="${MONKEYC_BIN_DIR:-$HOME/.local/bin}"

mkdir -p "$bin_dir"

chmod +x "$extension_dir/formatter/cli.mjs" "$extension_dir/scripts/runtime-preview.mjs"

ln -sf "$extension_dir/formatter/cli.mjs" "$bin_dir/monkey-c-format"
ln -sf "$extension_dir/scripts/runtime-preview.mjs" "$bin_dir/monkey-c-preview"

printf 'Installed:\n  %s -> %s\n  %s -> %s\n' \
  "$bin_dir/monkey-c-format" "$extension_dir/formatter/cli.mjs" \
  "$bin_dir/monkey-c-preview" "$extension_dir/scripts/runtime-preview.mjs"

case ":$PATH:" in
  *":$bin_dir:"*) ;;
  *)
    printf '\nAdd %s to PATH to use these commands from Zed:\n  export PATH="%s:$PATH"\n' "$bin_dir" "$bin_dir"
    ;;
esac
