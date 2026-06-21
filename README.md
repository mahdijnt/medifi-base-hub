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

For a repository deployed at `https://<user>.github.io/<repo>/`, set the base path before building:

```bash
# macOS / Linux
NEXT_PUBLIC_BASE_PATH=/medifi-base-hub npm run build

# Windows (PowerShell)
$env:NEXT_PUBLIC_BASE_PATH="/medifi-base-hub"; npm run build
```

Or copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BASE_PATH`.

## Deploy to GitHub Pages

1. In the repository **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds with `NEXT_PUBLIC_BASE_PATH=/medifi-base-hub` and publishes `out/`.

For a user/org site (`username.github.io`), leave `NEXT_PUBLIC_BASE_PATH` unset in the workflow.

## Project structure

```
app/          App Router pages and layout
components/   UI components
data/         Static site content
lib/          Shared utilities
styles/       Global styles
```
