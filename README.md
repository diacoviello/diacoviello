# diacoviello.com

Personal site of **David Iacoviello** — a dual portfolio under the *Diablo En
Música* brand. A single Vite + React app with three faces:

| Route | What it is |
| ----- | ---------- |
| `/` | Animated landing page — music notation + code swirl and converge on the yin/yang emblem; click a half to choose a side |
| `/lamusica` | **La Música** — professional musician & marching-arts drill designer (gold theme) |
| `/techne` | **Techné** — software developer portfolio (cyan theme) |

## Tech

- **Vite** + **React 19** + **react-router-dom 7**
- No UI framework — hand-rolled components and a shared, accent-variable design
  system in [`src/shared/ui.css`](src/shared/ui.css) (gold for La Música, cyan for
  Techné via the `.techne` scope)
- Canvas animation on the landing page; `IntersectionObserver` scroll reveals

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/ (also writes dist/404.html for SPA routing)
npm run preview    # preview the production build locally
```

## Deploy (GitHub Pages)

The build emits everything Pages needs:

- `dist/CNAME` → custom domain `diacoviello.com`
- `dist/404.html` → SPA fallback so deep links (`/lamusica/about`, `/techne/projects`) resolve
- `dist/.nojekyll` → disables Jekyll processing

```bash
npm run deploy     # builds and publishes dist/ to the gh-pages branch
```

DNS for `diacoviello.com` is managed in Cloudflare and points at GitHub Pages.

## Content

- **Techné** content lives in [`src/techne/data.js`](src/techne/data.js).
- **La Música** copy currently uses placeholders — edit the page files under
  [`src/musica/pages/`](src/musica/pages/).
