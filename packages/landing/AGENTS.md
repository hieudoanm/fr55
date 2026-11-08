# AGENTS.md

Guidance for coding agents working in `packages/landing`.

## Purpose

Static marketing/download page for the FR55 Monkey C tooling (VS Code + Zed extensions and the bundled watchfaces). Deployed to GitHub Pages by `.github/workflows/ci.yaml` (`deploy-pages` job).

## Key constraints

- **This directory is the site root.** `actions/upload-pages-artifact` packages the *contents* of `packages/landing/`, so the site is served at `https://hieudoanm.github.io/fr55/`. Only files inside this directory are deployed.
- **All local URLs must be relative** (`./styles.css`, `assets/*.png`, `#anchors`). No `<base>` tag, no root-relative paths — the page must also work over `file://`.
- **Vendored assets:** `assets/*.png` are copies of `assets/design/png/*.png` from the repo root. If the watchface designs change, re-copy them here (or update both).
- Keep the dark theme and red accent; design tokens are in `styles.css` `:root`.

## Files

- `index.html` — markup only; no inline styles or scripts.
- `styles.css` — tokens + component styles; responsive breakpoints at 860px/720px; honors `prefers-reduced-motion`.
- `favicon.ico` — regenerate from `packages/extensions/vscode/icons/png/monkey-c-on-dark.png` if the icon changes.
- `README.md` — deploy/preview details.

## Validation

No build step. Before finishing:

```bash
# serve the directory and check it renders
python3 -m http.server 8000
# or simply open index.html in a browser (file:// must work too)
```

Check that `index.html` is well-formed (every tag closed — `<img>` included) and that all `src`/`href` targets exist relative to this directory.
