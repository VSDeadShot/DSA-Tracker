# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DSA Problem Tracker — a full-stack Next.js app for logging solved DSA problems and scheduling reviews via a custom SM-2 spaced-repetition algorithm. Live at https://trackingdsa.vercel.app.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- `npx vitest run` — run tests once; `npx vitest` for watch mode (no `test` script defined in package.json; there's no vitest config file, only `lib/sm2.test.ts` today)
- `npx prisma db push` — push `prisma/schema.prisma` to the database (no migrations folder is checked in — schema changes are pushed directly, not migrated)
- `npx prisma generate` — regenerate the Prisma client (also runs automatically via `postinstall`)

## Architecture

**Stack**: Next.js 16 (App Router) + TypeScript, Tailwind CSS 4, Prisma 7 (via `@prisma/adapter-pg` driver adapter over `pg`), PostgreSQL on Supabase, Supabase Auth, Recharts.

**Route groups** (`app/`):
- `(auth)/` — login, forgot-password, update-password (public)
- `(app)/` — dashboard, problems/new, problems/[id], review, analytics (protected; layout at `app/(app)/layout.tsx` redirects to `/login` if no Supabase user)
- `api/export` — CSV export; `api/now-brief` — external integration endpoint, secured separately (see below), explicitly excluded from the auth middleware matcher
- `auth/callback`, `auth/signout` — Supabase auth flow routes

**Auth model**: Supabase Auth is the source of truth for identity; Prisma/Postgres stores app data keyed by `user_id` (a plain string column, not a Prisma relation to a Supabase-managed users table). There is no DB-level row ownership enforcement (no RLS from the app's side) — **every server action and API route that reads/writes a `Problem` or `Review` must independently fetch the record and check `problem.user_id === user.id` before acting**. This was a real vulnerability (see `b237453`, `submitReview`); follow the pattern already in `app/(app)/problems/[id]/actions.ts` and `app/(app)/dashboard/actions.ts` (fetch by id, compare `user_id`, then mutate).

- `utils/supabase/server.ts` — server-side Supabase client for Server Components/Actions (cookie-based)
- `utils/supabase/middleware.ts` — session refresh + route protection logic used by `middleware.ts`; redirects unauthenticated users to `/login` and authenticated users away from auth routes. `middleware.ts`'s matcher is the single place that decides which paths get this treatment — new routes needing custom auth (like `now-brief`'s API-key check) must be added to the matcher's exclusion list.
- `app/api/now-brief/route.ts` — authenticated via a static `x-api-key` header checked against `NOW_BRIEF_SECRET`, not Supabase sessions; intentionally bypasses the cookie-based middleware.

**Spaced repetition core** (`lib/sm2.ts`): pure function `calculateSM2(confidence, previousIntervalDays, previousEaseFactor)` implementing SM-2. Confidence < 3 resets the interval to 1 day; confidence >= 3 grows the interval using the ease factor (min 1.3). Called from `submitReview` in `app/(app)/problems/[id]/actions.ts`, which looks up the most recent `Review` for a problem to seed the previous interval/ease factor, then persists a new `Review` row (reviews are append-only history, not updated in place) and revalidates the problem page, dashboard, and review queue.

**Data model** (`prisma/schema.prisma`): `Problem` (1) — (many) `Review`, plus a per-user `Streak` row. "Due for review" is derived at query time by comparing each problem's latest `Review.next_review_date` to now (see `app/api/now-brief/route.ts` and the review queue) — there's no scheduled job, it's computed on read.

**Streak logic** (`lib/streak.ts`): computed from distinct calendar dates (local time) across all of a user's `Review` rows, walking backwards from today/yesterday; not stored incrementally despite the `Streak` model existing in the schema.

**Prisma client** (`lib/prisma.ts`): singleton via `globalThis`, using `PrismaPg` adapter over a `pg.Pool`. Always import the default export from `@/lib/prisma`, don't instantiate `PrismaClient` directly.

## Conventions

- Server Actions (`'use server'` files named `actions.ts`) live alongside the route that uses them, not in a shared actions directory.
- UI is a strict monochrome theme (`#0a0a0a` background, `#1a1a1a` panels, white text) — avoid introducing other colors in components.
- Mobile-first responsive design is an active concern (several recent commits fix mobile-specific layout issues); check both desktop and narrow-viewport rendering for UI changes.

## Workflow rules

- Propose one change at a time and wait for local review before moving to the next.
- Only commit or push after I explicitly approve — never commit/push proactively.
- Never commit or push notes, handoff, or scratch files to the repo.
