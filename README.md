# DSA Problem Tracker

A full-stack web application designed to help CS students build long-term retention of Data Structures and Algorithms (DSA) problems using **spaced repetition**. 

Every time you solve a problem on LeetCode, CodeChef, or HackerRank, you log it here and rate your confidence (1-5). An integrated SM-2 spaced repetition engine calculates exactly when you should review that problem again — drilling your weak spots and pushing your mastered problems further out.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Recharts, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (hosted on Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 🎯 Features

### Phase 1 (Core)
- [x] Next.js Boilerplate & Database Schema setup
- [ ] User authentication via Supabase (Email + Google OAuth)
- [ ] Problem logging system (capture platform, difficulty, topic, URL)
- [ ] Daily review queue (problems due today)
- [ ] Custom SM-2 algorithm to calculate next review dates based on confidence

### Phase 2 (Analytics)
- [ ] Topic heatmap showing weak areas
- [ ] Streak counter
- [ ] Platform breakdown
- [ ] CSV export

## 🧠 How the SM-2 Algorithm Works

When you rate a problem with a confidence score `q` (1 to 5):
- **If `q < 3`**: The interval is reset to 1 day. You need to review this again tomorrow.
- **If `q >= 3`**: A new interval is calculated using the current *ease factor*, and the ease factor is updated based on your rating.

New problems start with an ease factor of 2.5. Problems you rate highly will be pushed further into the future, saving you time. Problems you struggle with will stay in your daily queue until you master them.

## 📂 Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Duplicate `.env.example` to `.env` and add your Supabase connection strings.
4. Push the schema to your database: `npx prisma db push`
5. Run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
