# DSA Problem Tracker — Full Project Document

## The Idea

Every CS student preparing for internships grinds LeetCode, CodeChef, and HackerRank — but almost nobody has a system for *retention*. You solve a problem today, feel good about it, and forget it completely in two weeks. Then you see the same problem pattern in an interview and go blank. The issue isn't that you didn't practice — it's that you practiced without a memory system.

DSA Problem Tracker solves this using **spaced repetition**, the same algorithm behind Anki flashcards. Every time you solve a problem, you rate your confidence. The app then calculates the exact future date when you should revisit that problem — soon if it was hard, later if it was easy. Over time, the problems you're weak on get drilled more, and the ones you've mastered fade into the background. You build genuine long-term retention, not just a solved-problems count.

---

## What We Are Building

A full-stack web application with three core systems working together:

**1. Problem Logging System**
Log any problem from LeetCode, CodeChef, or HackerRank. Each log entry captures the problem name, URL, platform, topic tag (arrays, trees, graphs, DP, etc.), difficulty, your solution approach in plain text, and your confidence rating on a 1–5 scale.

**2. Spaced Repetition Engine**
The SM-2 algorithm runs on the backend. Based on your confidence rating, it calculates the next review date for every problem. A confidence of 5 pushes the next review far out. A confidence of 1 or 2 means you'll see it again within 1–3 days. This runs automatically every time you log or review a problem — you never manually schedule anything.

**3. Dashboard & Analytics**
A clean dashboard showing your daily review queue (problems due today), a topic heatmap showing which areas are weak, your current streak, total problems solved, and a breakdown by platform. The goal is to open the app every morning, see exactly what needs reviewing, do those reviews, then go solve new problems.

---

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router) — you already know this from your portfolio
- TypeScript — keep it consistent with your existing work
- Tailwind CSS v4 — already in your stack
- Recharts — for the topic heatmap and streak charts, already used in FluxBudget
- Framer Motion — subtle animations, already in your stack

**Backend**
- Next.js API Routes — keeps everything in one repo, no separate Express server needed
- Prisma ORM — clean, TypeScript-first database access
- PostgreSQL via Supabase — free tier, hosted, handles auth too

**Authentication**
- Supabase Auth — email + Google OAuth, dead simple to set up, handles sessions securely

**Deployment**
- Vercel — one click, free tier, connects directly to your GitHub repo

**Algorithm**
- SM-2 spaced repetition — implemented as a pure TypeScript utility function on the backend, fully custom, not a library

---

## Database Schema

Four tables:

**users** — managed by Supabase Auth automatically

**problems**
- id, user_id, title, url, platform (leetcode / codechef / hackerrank), difficulty (easy / medium / hard), topic (array / string / tree / graph / dp / etc.), created_at

**reviews**
- id, problem_id, user_id, confidence (1–5), reviewed_at, next_review_date, interval_days, ease_factor
- This is where SM-2 state lives — interval and ease_factor update every review

**streaks**
- id, user_id, current_streak, longest_streak, last_active_date

---

## Core Features — Phase 1 (Ship First)

- User signup and login via Supabase Auth
- Add a new problem (form with title, URL, platform, topic, difficulty)
- Log a review with confidence rating (1–5)
- SM-2 algorithm calculates next review date automatically
- Daily review queue — shows all problems due today or overdue
- Basic dashboard — total solved, current streak, problems due today

## Core Features — Phase 2 (After Phase 1 is Live)

- Topic heatmap — visual grid showing which topics have the most weak problems
- Platform breakdown — LeetCode vs CodeChef vs HackerRank split
- Search and filter problems by topic, difficulty, or platform
- Export your problem list to CSV
- Notes field per problem for storing your solution approach

---

## SM-2 Algorithm — How It Works

When you rate a problem with confidence score `q` (1 to 5):

- If `q < 3`: reset the interval to 1 day, keep ease factor unchanged. You need to see this again tomorrow.
- If `q >= 3`: calculate the new interval using the ease factor, then update the ease factor.

The ease factor starts at 2.5 for every new problem and adjusts based on how well you're doing. Problems you keep rating highly get pushed further and further out. Problems you keep struggling with stay close.

This logic lives in a single file — `lib/sm2.ts` — and is called from your API route every time a review is submitted.

---

## Folder Structure

```
dsa-tracker/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── problems/
│   │   ├── page.tsx           — all problems list
│   │   ├── new/page.tsx       — add problem form
│   │   └── [id]/page.tsx      — individual problem + review history
│   └── review/page.tsx        — daily review queue
├── api/
│   ├── problems/route.ts
│   ├── reviews/route.ts
│   └── streak/route.ts
├── lib/
│   ├── sm2.ts                 — SM-2 algorithm, pure function
│   ├── supabase.ts            — Supabase client
│   └── prisma.ts              — Prisma client
├── components/
│   ├── ProblemCard.tsx
│   ├── ReviewModal.tsx
│   ├── TopicHeatmap.tsx
│   └── StreakCounter.tsx
└── prisma/
    └── schema.prisma
```

---

## First Sprint Plan (Wednesday architecture session)

1. Set up Next.js repo, connect Supabase, configure Prisma schema
2. Write and test `sm2.ts` in isolation with unit tests
3. Build the Add Problem form and POST API route
4. Build the Review submission flow and SM-2 integration
5. Build the daily review queue page
6. Deploy to Vercel with Supabase connected

Phase 1 should be live within 2–3 weekend deep build sessions.
