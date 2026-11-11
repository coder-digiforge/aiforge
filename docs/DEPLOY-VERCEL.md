# Deploy AIForge demo to Vercel

## 1. Create a free Postgres database (Neon)

1. Open https://console.neon.tech and sign up / log in
2. Create a project named `aiforge-demo`
3. Copy the connection string (starts with `postgresql://…`)

Or with Neon CLI after `npx neonctl auth`:

```bash
npx neonctl projects create --name aiforge-demo
npx neonctl connection-string --project-id <PROJECT_ID>
```

## 2. Deploy

From the project folder (already logged into Vercel as needed):

```bash
npx vercel link
npx vercel env add DATABASE_URL production
npx vercel env add NEXT_PUBLIC_APP_URL production
npx vercel env add ADMIN_EMAIL production
npx vercel --prod
```

Suggested values:

- `DATABASE_URL` — Neon connection string
- `NEXT_PUBLIC_APP_URL` — final `https://YOUR_PROJECT.vercel.app` (update after first deploy if needed)
- `ADMIN_EMAIL` — your email (register with this to become admin)

Optional later: `OPENAI_API_KEY`, Stripe, Resend.

## 3. Smoke test

1. Open the deployment URL
2. Register with `ADMIN_EMAIL`
3. Open `/dashboard` and run a generator (demo mode is fine)
4. Open `/dashboard/admin`
5. Confirm Settings shows “History stored in Postgres”
