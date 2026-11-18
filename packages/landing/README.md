# Landing page

Static landing page + documentation site for the FR55 watchfaces, deployed to
GitHub Pages at `https://hieudoanm.github.io/fr55/`.

## Contents

- `src/app/` — Next.js App Router pages (`page.tsx` home, `gallery/` watchface
  gallery, `docs/` generated from `docs/**/*.md`).
- `src/components/molecules/` — shared components (`Navbar`, `Hero`, `Features`,
  `CTA`, `Footer`, `SectionHead`, `Terminal`, `DocsSearch`).
- `public/` — `favicon.*`, `logo.*`, `og.png`, `robots.txt`, `sitemap.xml`,
  `humans.txt`, `llms.txt`, served under `/fr55/` in production.
- `public/watchfaces/*.svg` — vendored copies of `assets/design/svg/*.svg` from
  the repo root, used by the gallery. Re-copy them if the watchface designs
  change.
- `docs/` — Markdown documentation rendered by `src/app/docs/`.

## Commands

```bash
pnpm install
pnpm run dev      # dev server (basePath applies)
pnpm run build    # static export → out/ (uploaded to Pages by CI)
pnpm run lint
pnpm run typecheck
```

## Deployment

`.github/workflows/ci.yaml` uploads `out/` via `actions/upload-pages-artifact`
on pushes to `master` (`basePath`/`assetPrefix` are `/fr55` in production).

## Conventions

- `output: "export"` must stay — no server features or API routes.
- Raw `<img src>` paths must include the `/fr55` prefix in production (see the
  `LOGO` constant in `layout.tsx`).
- See `AGENTS.md` in this directory for agent-facing conventions.
