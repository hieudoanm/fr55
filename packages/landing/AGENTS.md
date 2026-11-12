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

- `index.html` — markup only; no inline styles. The only script allowed is the tiny year-injection snippet in the footer.
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

## Conventions

- **Fonts:** Inter (sans) loaded via the Google Fonts `<link>` in `index.html`; mono stack `ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace`. Tokens: `--font-sans` / `--font-mono`. Do not add other typefaces.

## Footer

The footer follows the shared contract: `© {year} {repo-name}` (lowercase
repo name, dynamic year via `<span id="year">` + the year script), a
one-line tagline/license descriptor, and a right-aligned `<nav
aria-label="Footer">` with exactly two links — `GitHub` (repo root) and
`README` (`<repo>#readme`), both `target="_blank" rel="noreferrer"`.

## Features & CTA sections

`#features` and `#install` follow the shared template: centered
`.section-head` (h2 + one supporting paragraph), a `.grid-3` card grid
(`article.card` = `.card-icon` + h3 + p), and a closing CTA section on the
alt background (`.section-alt`, `.container-narrow`) ending in a
`.cta-row` with a primary `btn-lg` action plus at most one ghost button.
