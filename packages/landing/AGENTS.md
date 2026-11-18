# AGENTS.md — packages/landing

Next.js 16 (App Router) static-export landing page + docs site, deployed to
GitHub Pages at `https://hieudoanm.github.io/fr55/` (project site —
`basePath: "/fr55"`, `assetPrefix` likewise in production). Content is
watchface-focused: the four `apps/` faces, the 16-design gallery, and docs.

## Commands

```bash
pnpm install
pnpm run dev      # dev server (basePath applies)
pnpm run build    # static export → out/ (uploaded to Pages by CI)
pnpm run lint
pnpm run typecheck
```

## Structure

- `src/app/layout.tsx` — metadata, fonts, and the global `Navbar`/`Footer` (all
  content passed as props).
- `src/app/page.tsx` — home page content as data passed to shared components.
- `src/app/gallery/page.tsx` — watchface gallery (component + metadata + route
  in one file).
- `src/app/docs/` — docs routes generated from `docs/**/*.md` via
  `src/lib/docs.ts` (`getDocPages()`).
- `src/components/molecules/` — shared components (`Navbar`, `Hero`, `Features`,
  `CTA`, `Footer`, `SectionHead`, `Terminal`, `DocsSearch`). These files are
  shared across `hieudoanm/*/packages/landing` repos — pass content via props
  instead of forking them where possible.
- `src/app/globals.css` — Tailwind v4 imports + the custom DaisyUI `fr55` light
  theme.
- `public/` — `favicon.ico`, `favicon.svg`, `logo.*`, `og.png`, `robots.txt`,
  `sitemap.xml`, `humans.txt`, `llms.txt`, served under `/fr55/` in production.
- `public/watchfaces/*.svg` — vendored copies of `assets/design/svg/*.svg` from
  the repo root, used by the gallery. Re-copy them if the watchface designs
  change (and update `public/sitemap.xml` when docs pages are added/removed).
- `docs/` — Markdown documentation rendered by `src/app/docs/`.

## Conventions

- Keep `output: "export"` in `next.config.ts` — the site must build to static
  HTML in `out/`; no server features or API routes.
- `basePath`/`assetPrefix` are `/fr55` in production builds; `next/link` and
  metadata get it automatically, raw `<img src>` paths must include it (see the
  `LOGO`/`WATCHFACE_BASE` constants).
- Theme is light-only via `data-theme="fr55"` on `<html>`.
- Fonts: Inter via `next/font`; mono stack for terminal/code only.
- Design follows the "AI unslop" rules: no filler badges, monospace only for
  code/commands, real CLI output in demos.
- `public/assets/*.png` are vendored copies of `assets/design/png/*.png` from
  the repo root — re-copy them if the watchface designs change.
- Monkey C tooling content belongs in `hieudoanm/monkey`, not here — this site
  documents watchfaces only.
