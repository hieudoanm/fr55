# Landing page

Static landing page for the FR55 Monkey C tooling, deployed to GitHub Pages.

## Contents

- `index.html` — single-page markup (hero, features, editor cards, Zed install steps, download CTA).
- `styles.css` — all styles; design tokens live in `:root`.
- `favicon.ico` — generated from `packages/extensions/vscode/icons/png/monkey-c-on-dark.png`.
- `assets/` — watchface preview PNGs copied from `assets/design/png/` at the repo root. They are vendored here because the Pages artifact root is this directory; anything outside it is not deployed.

## Deployment

`.github/workflows/ci.yaml` uploads this directory via `actions/upload-pages-artifact` on pushes to `master`, so the **contents of this folder are the site root** (`https://hieudoanm.github.io/fr55/`).

## Local preview

Everything is referenced with relative URLs, so the page works both on GitHub Pages and over `file://`:

```bash
# serve this directory (site root)
python3 -m http.server 8000
# → http://localhost:8000/

# or open directly
open index.html
```

Do **not** add a `<base href="...">` tag or root-relative (`/...`) URLs — that breaks `file://` and any non-`/fr55/` mount path.

## Design notes

- Dark theme (`color-scheme: dark`) with a red accent (`--accent: #e53935`).
- Radius tokens: `--radius-chip` / `--radius-inner` / `--radius-card` / `--radius-cta`.
- Watch previews are circular via a `.watch-frame` wrapper (`overflow: hidden` + `border-radius: 50%`), not radius on the `<img>` itself.
- See `AGENTS.md` in this directory for agent-facing conventions.
