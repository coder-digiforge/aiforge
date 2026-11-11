# AIForge product specification

## Product
All-in-One AI Generator SaaS for creators, marketers, developers and small teams.

## Initial generator modules
1. AI Writer
2. Image Generator
3. Code Assistant
4. SEO Studio
5. Social Creator
6. Product Copy
7. AI Chat

## Account roles
- Guest: public landing page and demo preview
- User: personal workspace, generators, history, credits and billing
- Admin: user, plan, provider and usage management

## Core production requirements
- All AI calls run server-side.
- Provider credentials are never sent to the browser.
- Credit consumption is enforced atomically on the server.
- Stripe webhook signatures are verified.
- Users can only access their own records unless an explicit workspace role grants access.
- Generation requests are rate-limited and validated.
- User-facing UI distinguishes demo data from live provider output.
