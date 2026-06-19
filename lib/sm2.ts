export interface SM2Result {
  intervalDays: number
  easeFactor: number
  nextReviewDate: Date
}

/**
 * Calculates the next review date using the SM-2 spaced repetition algorithm.
 * 
 * @param confidence - Confidence score from 1 to 5 (1 = hard, 5 = perfectly easy)
 * @param previousIntervalDays - The previous interval in days (0 if it's a new problem)
 * @param previousEaseFactor - The previous ease factor (2.5 if it's a new problem)
 * @returns SM2Result containing the new interval, new ease factor, and calculated next review date
 */
export function calculateSM2(
  confidence: number,
  previousIntervalDays: number = 0,
  previousEaseFactor: number = 2.5
): SM2Result {
  let intervalDays: number
  let easeFactor = previousEaseFactor

  // If confidence is less than 3 (1 or 2), the user struggled.
  if (confidence < 3) {
    intervalDays = 1 // Reset interval to 1 day so they see it tomorrow
    // Ease factor remains unchanged so one bad day doesn't ruin the problem's long-term schedule
  } else {
    // If the user did well (confidence >= 3), increase the interval
    if (previousIntervalDays === 0) {
      intervalDays = 1
    } else if (previousIntervalDays === 1) {
      intervalDays = 6
    } else {
      intervalDays = Math.round(previousIntervalDays * easeFactor)
    }

    // Adjust the ease factor based on performance
    // formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - confidence) * (0.08 + (5 - confidence) * 0.02))
    
    // Ease factor should never drop below 1.3
    if (easeFactor < 1.3) {
      easeFactor = 1.3
    }
  }

  // Calculate the actual next review Date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays)

  return {
    intervalDays,
    easeFactor,
    nextReviewDate,
  }
}
