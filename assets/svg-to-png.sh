#!/usr/bin/env bash
set -euo pipefail

ASSETS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WIDTH="${WIDTH:-1280}"
HEIGHT="${HEIGHT:-}"
JOBS="${JOBS:-4}"

command -v rsvg-convert >/dev/null 2>&1 || {
  echo "rsvg-convert is required but not installed" >&2
  exit 1
}

# Find SVG files under any "svg" directory and create a parallel "png" file.
# Keeps original aspect ratio: scales to WIDTH; if HEIGHT is set, fits within
# WIDTH x HEIGHT while preserving ratio.
# Run conversions in parallel, limited to $JOBS.
pids=()
count=0
while IFS= read -r -d '' svg; do
  (
    png="${svg/\/svg\///png/}"
    png="${png%.svg}.png"

    if [ ! -s "$svg" ]; then
      echo "skip (empty): $svg" >&2
      exit 0
    fi

    mkdir -p "$(dirname "$png")"
    args=(-w "$WIDTH")
    if [ -n "$HEIGHT" ]; then
      args+=(-h "$HEIGHT" --keep-aspect-ratio)
    fi
    if rsvg-convert "${args[@]}" -o "$png" "$svg"; then
      echo "converted $svg -> $png"
    else
      echo "failed: $svg" >&2
      exit 1
    fi
  ) &
  pids+=("$!")
  count=$((count + 1))
  if [ "${#pids[@]}" -ge "$JOBS" ]; then
    wait "${pids[0]}" || true
    pids=("${pids[@]:1}")
  fi
done < <(find "$ASSETS_DIR" -type f -path '*/svg/*.svg' -print0)

status=0
for pid in "${pids[@]}"; do
  wait "$pid" || status=1
done

if [ "$count" -eq 0 ]; then
  echo "no svg files found under $ASSETS_DIR/*/svg" >&2
fi

exit "$status"
