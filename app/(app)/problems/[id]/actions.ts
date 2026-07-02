'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { calculateSM2 } from '@/lib/sm2'
import { revalidatePath } from 'next/cache'

export async function submitReview(problemId: string, confidence: number) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // SECURITY: Verify the problem actually exists and belongs to the authenticated user
  const problem = await prisma.problem.findUnique({
    where: { id: problemId }
  })

  if (!problem || problem.user_id !== user.id) {
    throw new Error('Unauthorized: You do not own this problem')
  }

  // Get the most recent review for this problem to feed into SM-2
  const lastReview = await prisma.review.findFirst({
    where: {
      problem_id: problemId,
      user_id: user.id,
    },
    orderBy: {
      reviewed_at: 'desc',
    },
  })

  // Calculate new SM-2 values
  const previousIntervalDays = lastReview?.interval_days ?? 0
  const previousEaseFactor = lastReview?.ease_factor ?? 2.5

  const sm2Result = calculateSM2(confidence, previousIntervalDays, previousEaseFactor)

  // Save the new review
  await prisma.review.create({
    data: {
      problem_id: problemId,
      user_id: user.id,
      confidence,
      interval_days: sm2Result.intervalDays,
      ease_factor: sm2Result.easeFactor,
      next_review_date: sm2Result.nextReviewDate,
    },
  })

  // Revalidate the problem page and dashboard
  revalidatePath(`/problems/${problemId}`)
  revalidatePath('/dashboard')
  revalidatePath('/review')
}
