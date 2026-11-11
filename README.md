# AIForge — All-in-One AI Generator SaaS

AIForge is a modular SaaS starter for an AI creation workspace: 7 generators, credits, email auth, Stripe subscriptions, and an admin panel.

## Features

- Marketing landing page and responsive dark dashboard
- Auth: register, login, httpOnly sessions, email verification, password reset
- 7 generators (writer, image, code, SEO, social, product copy, chat)
- Live OpenAI mode **or** labeled demo mode (no API key required)
- Server-side credit checks and history
- Stripe Checkout + signed webhooks
- Admin: users, plans, stats, activity
- **Dual storage**: `.data/db.json` locally, **Postgres** via `DATABASE_URL` on Vercel

## Requirements

- Node.js 20.9+
- npm
- Postgres when deploying to Vercel (Neon free tier recommended)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — dashboard at `/dashboard`.

Full guide: [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md)

## Vercel demo

1. Create a Neon database and copy `DATABASE_URL`
2. Import this repo in Vercel
3. Set env vars: `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAIL`
4. Deploy and register with the admin email

## Environment

See `.env.example`. Never expose secrets through `NEXT_PUBLIC_*`.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres (required on Vercel) |
| `ADMIN_EMAIL` | Bootstrap admin account |
| `OPENAI_API_KEY` | Live AI (optional) |
| `RESEND_API_KEY` | Email flows (optional in dev) |
| `STRIPE_*` | Paid plans (optional) |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run package:release` | Build Codester `.zip` in `dist/` |

## License

See [`LICENSE.txt`](LICENSE.txt) for marketplace license terms.

## Docs

- `docs/DOCUMENTATION.md` — install, deploy, customize
- `docs/LISTING.md` — Codester listing draft
- `docs/INSTALL.md` — short install checklist
- `CHANGELOG.md` — release notes
