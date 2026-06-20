import prisma from './prisma'

export async function getCurrentStreak(userId: string): Promise<number> {
  // Fetch all review dates for the user, sorted descending
  const reviews = await prisma.review.findMany({
    where: { user_id: userId },
    select: { reviewed_at: true },
    orderBy: { reviewed_at: 'desc' }
  })

  if (reviews.length === 0) {
    return 0
  }

  // Extract unique calendar dates (ignoring time)
  // Using UTC or local depends on the user, but we'll use a simple YYYY-MM-DD string approach
  const uniqueDates = Array.from(new Set(reviews.map(r => {
    const d = r.reviewed_at
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })))

  if (uniqueDates.length === 0) return 0

  let streak = 0
  
  // Create Date objects at midnight for comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Parse the most recent review date
  const [year, month, day] = uniqueDates[0].split('-').map(Number)
  const mostRecentDate = new Date(year, month - 1, day)

  // If the most recent review wasn't today or yesterday, the streak is broken
  if (mostRecentDate.getTime() < yesterday.getTime()) {
    return 0
  }

  // Iterate backwards from the most recent date to count the streak
  let expectedDate = new Date(mostRecentDate)

  for (const dateStr of uniqueDates) {
    const [y, m, d] = dateStr.split('-').map(Number)
    const currentDate = new Date(y, m - 1, d)

    if (currentDate.getTime() === expectedDate.getTime()) {
      streak++
      // Move expected date back by one day
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
