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

Static files are written to `out/`.

### GitHub project pages

`next.config.ts` applies `basePath` and `assetPrefix` (`/medifi-base-hub`) automatically when `NODE_ENV=production`. Local `npm run dev` serves from the site root without the prefix.

```bash
# macOS / Linux
NODE_ENV=production npm run build

# Windows (PowerShell)
$env:NODE_ENV='production'; npm run build
```

## Deploy to GitHub Pages

1. In the repository **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` runs `npm run build` (production) and publishes `out/`.

## Project structure

```
app/          App Router pages and layout
components/   UI components
data/         Static site content
lib/          Shared utilities
styles/       Global styles
```
