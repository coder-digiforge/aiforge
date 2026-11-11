# AIForge Documentation

Complete setup, configuration, and customization guide for buyers.

## 1. What you get

AIForge is a Next.js 15 SaaS starter for an AI creation workspace:

- Marketing landing page + dark dashboard UI
- 7 generators (writer, image, code, SEO, social, product copy, chat)
- Auth (register, login, httpOnly sessions, email verification, password reset)
- Credit balance with server-side enforcement
- Stripe Checkout subscriptions + signed webhooks
- Admin panel (users, plans, stats, activity)
- Demo AI mode when `OPENAI_API_KEY` is empty
- Storage: local JSON file **or** Postgres via `DATABASE_URL` (required on Vercel)

## 2. Requirements

- Node.js **20.9+**
- npm (or yarn/pnpm)
- For Vercel / serverless: a Postgres database (Neon free tier recommended)
- Optional: OpenAI, Stripe, Resend accounts

## 3. Quick start (local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

Without API keys the app runs in **demo mode** (safe for evaluation).

Register the first account. If `ADMIN_EMAIL` matches that email, the account
becomes admin. Admin UI: `/dashboard/admin`.

## 4. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes (prod) | Public site URL (emails + Stripe redirects) |
| `DATABASE_URL` | Yes on Vercel | Postgres connection string (Neon/Supabase/etc.) |
| `ADMIN_EMAIL` | Recommended | Bootstrap admin account email |
| `OPENAI_API_KEY` | Optional | Live AI; omit for demo responses |
| `OPENAI_MODEL` | Optional | Default `gpt-4o-mini` |
| `OPENAI_IMAGE_MODEL` | Optional | Default `dall-e-3` |
| `RESEND_API_KEY` | Optional | Email verification + password reset |
| `EMAIL_FROM` | Optional | Verified sender address for Resend |
| `STRIPE_SECRET_KEY` | Optional | Paid subscriptions |
| `STRIPE_WEBHOOK_SECRET` | Optional | Webhook signature verification |
| `STRIPE_PRICE_PRO` | Optional | Stripe Price ID for Creator plan |
| `STRIPE_PRICE_BUSINESS` | Optional | Stripe Price ID for Business plan |

Never put secret keys in `NEXT_PUBLIC_*` variables.

### Storage modes

- **No `DATABASE_URL`**: data is stored in `.data/db.json` (local / single VPS with disk).
- **With `DATABASE_URL`**: data is stored in Postgres table `aiforge_store` (Vercel-ready).

The schema is created automatically on first request.

## 5. Deploy to Vercel (demo / production)

1. Create a free [Neon](https://neon.tech) project and copy the connection string.
2. Push or import this project into Vercel.
3. In Vercel → Settings → Environment Variables, set at least:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL` (your `https://….vercel.app` URL)
   - `ADMIN_EMAIL`
4. Deploy. Open the site, register with the admin email, explore the dashboard.
5. Optional: add OpenAI / Resend / Stripe keys and redeploy.

Stripe webhook endpoint:

```text
POST https://YOUR_DOMAIN/api/stripe/webhook
```

Events to enable: `checkout.session.completed`, `invoice.paid`,
`customer.subscription.deleted`.

## 6. Stripe setup

1. Create two recurring Prices in Stripe (Creator $19, Business $49 — or your amounts).
2. Put Price IDs into `STRIPE_PRICE_PRO` and `STRIPE_PRICE_BUSINESS`.
3. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
4. Plans can also be edited in the admin panel (names, credits, displayed price).

Free plan credits are granted at signup (default 120). Paid plan credits are
added on successful checkout and on subscription renewal invoices.

## 7. Email (Resend)

1. Create a Resend API key and verify a sending domain.
2. Set `RESEND_API_KEY` and `EMAIL_FROM`.
3. In development without a key, verification/reset tokens are printed in the
   server console.

Email verification is available for account hygiene; generation is not blocked
when an address is unverified (so demos keep working without SMTP).

## 8. Customization map

| Goal | Where to edit |
|---|---|
| Generators / prompts / credit cost | `src/config/generators.ts` |
| Default plans | `src/lib/stripe.ts` (`DEFAULT_PLANS`) |
| Landing copy / pricing cards | `src/app/page.tsx` |
| Theme colors / CSS | `src/app/globals.css` (`:root` variables) |
| Brand name in UI | search for `AIForge` in `src/app` and `src/components` |
| Privacy / Terms | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` |

## 9. Scripts

```bash
npm run dev          # development
npm run build        # production build
npm run start        # start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run package:release   # build Codester-ready zip in dist/
```

## 10. Project structure

```text
src/app                 Next.js App Router pages + API routes
src/components          Dashboard + admin UI
src/config/generators.ts Generator catalogue
src/lib/auth.ts         Auth, sessions, users
src/lib/store.ts        JSON file or Postgres storage
src/lib/ai.ts           OpenAI adapter + demo fallback
src/lib/stripe.ts       Plans + Checkout
docs/                   Documentation
LICENSE.txt             Marketplace license
```

## 11. Security notes

- Passwords are hashed with scrypt (salted).
- Sessions use httpOnly cookies.
- AI keys stay server-side.
- Stripe webhooks verify signatures.
- Generate + auth endpoints are rate-limited (in-memory; fine for single
  instance / low demo traffic — use Redis if you scale horizontally).

## 12. Known limitations (honest)

- JSON/Postgres document store is designed for small-to-medium SaaS starters,
  not massive multi-tenant scale out of the box.
- Image generation requires a live OpenAI key (demo mode returns placeholder text).
- “Priority generation” is a plan marketing feature — wire custom queues if needed.
- Replace Privacy/Terms pages before operating a real business.

## 13. Support checklist before asking for help

1. Node 20.9+ installed
2. `npm install` completed without errors
3. `.env.local` copied from `.env.example`
4. On Vercel: `DATABASE_URL` set and redeployed
5. `npm run build` succeeds locally
