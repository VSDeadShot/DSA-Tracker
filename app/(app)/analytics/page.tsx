import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AnalyticsCharts from './AnalyticsCharts'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all problems and their latest review
  const problems = await prisma.problem.findMany({
    where: { user_id: user.id },
    include: {
      reviews: {
        orderBy: { reviewed_at: 'desc' },
        take: 1,
      }
    }
  })

  // 1. Calculate Platform Distribution
  const platformCounts: Record<string, number> = {}
  for (const p of problems) {
    platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1
  }
  const platformData = Object.entries(platformCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // 2. Calculate Topic Confidence (average of the latest review for each topic)
  const topicStats: Record<string, { totalConfidence: number; count: number }> = {}
  for (const p of problems) {
    if (p.reviews.length > 0) {
      const confidence = p.reviews[0].confidence
      if (!topicStats[p.topic]) {
        topicStats[p.topic] = { totalConfidence: 0, count: 0 }
      }
      topicStats[p.topic].totalConfidence += confidence
      topicStats[p.topic].count += 1
    }
  }

  const topicData = Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic: topic.charAt(0).toUpperCase() + topic.slice(1),
      avgConfidence: Number((stats.totalConfidence / stats.count).toFixed(2)),
    }))
    // Sort by lowest confidence first (weakest topics first)
    .sort((a, b) => a.avgConfidence - b.avgConfidence)

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <div className="flex items-center gap-4">
            <a
              href="/api/export"
              download
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 transition-colors"
            >
              Export to CSV
            </a>
          </div>
        </div>

        <AnalyticsCharts platformData={platformData} topicData={topicData} />
      </div>
    </div>
  )
}
