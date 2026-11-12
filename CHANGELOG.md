# Changelog

## 1.0.1 — 2026-11-12

- Cleanup: remove unused deps (`uuid`, `ws`, `react-hot-toast`, `@neon/config`, `@neon/env`)
- Responsive polish: drawer sidebar from 900px, single-column generator grid on phones
- Favicon/apple icon use “AF” mark; landing stays public while signed in
- ESLint ignores `dist/`; `.gitignore` keeps `.env.example` trackable

## 1.0.0 — 2026-11-11

- Initial marketplace release
- 7 AI generators with demo + live OpenAI modes
- Auth: register, login, email verification, password reset
- Credits, history, Stripe Checkout + webhooks
- Admin panel: users, plans, stats, activity
- Dual storage: local JSON file or Postgres (`DATABASE_URL`) for Vercel
- Privacy / Terms pages, favicon, expanded documentation
- Release packaging script (`npm run package:release`)
