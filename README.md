# Medifi Base Hub

Minimal Next.js 15 static site for [GitHub Pages](https://pages.github.com/) deployment.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Static export (`output: 'export'`)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Static files are written to `out/`. This is the **Vercel / root** build — no base path prefix.

### GitHub project pages

GitHub Pages serves the site at `https://<user>.github.io/medifi-base-hub/`, so production builds for Pages need a base path. Set `NEXT_PUBLIC_BASE_PATH` at build time (the deploy workflow does this automatically):

```bash
# macOS / Linux
NEXT_PUBLIC_BASE_PATH=/medifi-base-hub npm run build

# Windows (PowerShell)
$env:NEXT_PUBLIC_BASE_PATH='/medifi-base-hub'; npm run build
```

`next.config.ts` reads `NEXT_PUBLIC_BASE_PATH` for `basePath` and `assetPrefix`. Local `npm run dev` and Vercel deployments leave it unset (empty) so assets and routes work at the site root.

## Deploy

### GitHub Pages

1. In the repository **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` sets `NEXT_PUBLIC_BASE_PATH=/medifi-base-hub`, runs `npm run build`, and publishes `out/`.

### Vercel

1. Import the repository and deploy with the default build command (`npm run build`).
2. Do **not** set `NEXT_PUBLIC_BASE_PATH` in the Vercel project environment (or leave it empty). The site deploys at the Vercel root (`*.vercel.app`).

## Project structure

```
app/          App Router pages and layout
components/   UI components
data/         Static site content
lib/          Shared utilities
styles/       Global styles
```
