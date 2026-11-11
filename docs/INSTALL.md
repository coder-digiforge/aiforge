# AIForge — Installation Checklist

## Prerequisites

- Node.js 20.9+ (nodejs.org)
- npm
- Optional: Neon/Postgres for Vercel

## Local setup

1. `npm install`
2. `cp .env.example .env.local`
3. `npm run dev`
4. Open http://localhost:3000

The app works with **no API keys** (demo AI mode).

### Optional keys

- `ADMIN_EMAIL` — bootstrap admin
- `DATABASE_URL` — Postgres (skip locally to use `.data/db.json`)
- `OPENAI_API_KEY` — live AI
- `RESEND_API_KEY` + `EMAIL_FROM` — real email delivery
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`

## Vercel

1. Set `DATABASE_URL` (Neon), `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAIL`
2. Deploy
3. Register with the admin email → `/dashboard/admin`

## Scripts

- `npm run dev` / `build` / `start` / `lint` / `typecheck`
- `npm run package:release` — Codester zip

## More detail

See `docs/DOCUMENTATION.md`.
