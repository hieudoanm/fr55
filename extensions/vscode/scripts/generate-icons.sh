#!/usr/bin/env bash
set -euo pipefail

EXT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$EXT_DIR/../.." && pwd)"
SVG_DIR="$REPO_ROOT/assets/svg"
ICON_DIR="$EXT_DIR/icons"
ICON_SVG_DIR="$ICON_DIR/svg"
ICON_PNG_DIR="$ICON_DIR/png"

command -v node >/dev/null 2>&1 || {
  echo "node is required to generate the icons" >&2
  exit 1
}

command -v rsvg-convert >/dev/null 2>&1 || {
  echo "rsvg-convert is required to generate the icons" >&2
  exit 1
}

for logo in logo-light.svg logo-dark.svg; do
  [ -f "$SVG_DIR/$logo" ] || {
    echo "missing logo: $SVG_DIR/$logo" >&2
    exit 1
  }
done

mkdir -p "$ICON_SVG_DIR" "$ICON_PNG_DIR"

node - "$SVG_DIR/logo-light.svg" "$SVG_DIR/logo-dark.svg" "$ICON_SVG_DIR" <<'NODE'
const fs = require('fs');
const [lightSrc, darkSrc, svgDir] = process.argv.slice(2);

const extractPath = (file) => {
  const svg = fs.readFileSync(file, 'utf8');
  const match = svg.match(/<path[\s\S]*?\/>/);
  if (!match) throw new Error(`no <path> found in ${file}`);
  return match[0];
};

const recolour = (path, fill) => path.replace(/class="cls-1"/, `fill="${fill}"`);

const white = recolour(extractPath(lightSrc), '#FFFFFF');
const black = recolour(extractPath(darkSrc), '#000000');

// Extension icon: black monkey on a white circle, transparent outside the circle.
fs.writeFileSync(
  `${svgDir}/monkey-c.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128" role="img" aria-label="Monkey C">\n  <circle cx="64" cy="64" r="64" fill="#FFFFFF"/>\n  <g transform="translate(16 16) scale(0.1875)">\n    ${black}\n  </g>\n</svg>\n`
);

// File icon used by dark color themes: white glyph on a transparent background.
fs.writeFileSync(
  `${svgDir}/monkey-c-on-dark.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Monkey C">\n  ${white}\n</svg>\n`
);

// File icon used by light color themes: black glyph on a transparent background.
fs.writeFileSync(
  `${svgDir}/monkey-c-on-light.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Monkey C">\n  ${black}\n</svg>\n`
);
NODE

rsvg-convert -w 512 -h 512 "$ICON_SVG_DIR/monkey-c.svg" -o "$ICON_PNG_DIR/monkey-c.png"
rsvg-convert -w 512 -h 512 "$ICON_SVG_DIR/monkey-c-on-dark.svg" -o "$ICON_PNG_DIR/monkey-c-on-dark.png"
rsvg-convert -w 512 -h 512 "$ICON_SVG_DIR/monkey-c-on-light.svg" -o "$ICON_PNG_DIR/monkey-c-on-light.png"

echo "wrote $ICON_SVG_DIR/monkey-c.svg"
echo "wrote $ICON_SVG_DIR/monkey-c-on-dark.svg"
echo "wrote $ICON_SVG_DIR/monkey-c-on-light.svg"
echo "wrote $ICON_PNG_DIR/monkey-c.png"
echo "wrote $ICON_PNG_DIR/monkey-c-on-dark.png"
echo "wrote $ICON_PNG_DIR/monkey-c-on-light.png"
