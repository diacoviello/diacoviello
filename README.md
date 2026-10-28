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

## Deploy (Cloudflare Workers)

The app is deployed as a Cloudflare Worker with static assets
([`wrangler.jsonc`](wrangler.jsonc)). Static files are served directly, with
SPA fallback so deep links (`/lamusica/about`, `/techne/projects`) resolve;
only `/api/*` requests run the Worker code in [`worker/index.js`](worker/index.js).

```bash
npm run deploy     # builds and runs `wrangler deploy`
```

## Contact form

Both halves have a Contact page (`/lamusica/contact`, `/techne/contact`) built
on one shared component, [`src/shared/contact/ContactForm.jsx`](src/shared/contact/ContactForm.jsx).
It posts to `/api/contact`; the Worker checks the honeypot, verifies
[Turnstile](https://developers.cloudflare.com/turnstile/) and sends the message
with [Resend](https://resend.com), with Reply-To set to the visitor.

One-time setup:

1. **Resend:** create an account, add and verify the `diacoviello.com` domain
   (DNS records in Cloudflare), then create an API key. The sender is
   `CONTACT_FROM` in `wrangler.jsonc`.
2. **Turnstile:** in the Cloudflare dashboard, add a widget for
   `diacoviello.com` (and `localhost` if you want the real widget locally).
3. **Production secrets:**
   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put TURNSTILE_SECRET_KEY
   npx wrangler secret put CONTACT_TO          # inbox that receives messages
   ```
4. **Site key:** copy `.env.example` to `.env.production.local` and set
   `VITE_TURNSTILE_SITE_KEY` before running `npm run deploy`.

Local dev: copy `.dev.vars.example` to `.dev.vars`. `npm run dev` runs the
Worker locally, and uses Cloudflare's always-pass Turnstile test keys unless
you set real ones.

## Content

- **Techné** content lives in [`src/techne/data.js`](src/techne/data.js).
- **La Música** copy currently uses placeholders — edit the page files under
  [`src/musica/pages/`](src/musica/pages/).
