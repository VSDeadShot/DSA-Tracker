import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  // 1. Check for the secret key in the request headers
  const apiKey = request.headers.get('x-api-key')
  const secret = process.env.NOW_BRIEF_SECRET

  // If the secret isn't set on the server, or the client provided the wrong key, block access
  if (!apiKey || !secret || apiKey !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Determine the user ID to query. 
  // You can set NOW_BRIEF_USER_ID in your Vercel env variables to hardcode your specific account.
  let userId = process.env.NOW_BRIEF_USER_ID

  if (!userId) {
    // Fallback: If no env var is set, automatically find the account with the most problems logged.
    // Since this is your personal app, your main account will undoubtedly be the top user.
    const activeUsers = await prisma.problem.groupBy({
      by: ['user_id'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 1,
    })
    
    if (activeUsers.length === 0) {
      // If the database is completely empty
      return NextResponse.json({ dueToday: 0 })
    }
    userId = activeUsers[0].user_id
  }

  // 3. Query all problems for this user to calculate how many are due today
  const allProblems = await prisma.problem.findMany({
    where: { user_id: userId },
    include: {
      reviews: {
        orderBy: { reviewed_at: 'desc' },
        take: 1,
      },
    },
  })

  const now = new Date()

  // A problem is due if it has never been reviewed, or if its next_review_date is in the past
  const dueProblemsCount = allProblems.filter((problem) => {
    if (problem.reviews.length === 0) return true
    const nextReview = problem.reviews[0].next_review_date
    return nextReview <= now
  }).length

  // 4. Return the brief
  return NextResponse.json({ dueToday: dueProblemsCount })
}
