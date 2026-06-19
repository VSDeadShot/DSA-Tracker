import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const problems = await prisma.problem.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' },
    take: 10,
    include: {
      reviews: {
        orderBy: { reviewed_at: 'desc' },
        take: 1,
      }
    }
  })

  const now = new Date()

  // Calculate stats
  const totalProblems = problems.length
  const totalReviews = problems.reduce((acc, p) => acc + p.reviews.length, 0)
  const dueTodayCount = problems.filter((p) => {
    if (p.reviews.length === 0) return true
    const nextReview = p.reviews[0].next_review_date
    return nextReview <= now
  }).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <form action="/auth/signout" method="post">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Sign out ({user.email})
            </button>
          </form>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Problems</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalProblems}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reviews Completed</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalReviews}</p>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border ${dueTodayCount > 0 ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
            <h3 className={`text-sm font-medium ${dueTodayCount > 0 ? 'text-blue-700 dark:text-blue-400' : 'text-green-700 dark:text-green-400'}`}>Due for Review Today</h3>
            <p className={`mt-2 text-3xl font-bold ${dueTodayCount > 0 ? 'text-blue-900 dark:text-blue-100' : 'text-green-900 dark:text-green-100'}`}>
              {dueTodayCount}
            </p>
            {dueTodayCount > 0 && (
              <Link href="/review" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Start Review Session &rarr;
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Problems</h2>
          <div className="flex gap-4">
            <Link
              href="/review"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-700"
            >
              View Queue
            </Link>
            <Link
              href="/problems/new"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              + Log New Problem
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {problems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No problems logged yet. Time to start grinding!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {problems.slice(0, 5).map((problem) => {
                const nextReview = problem.reviews[0]?.next_review_date
                const isDue = nextReview ? new Date(nextReview) <= now : true
                
                return (
                  <li key={problem.id}>
                    <Link href={`/problems/${problem.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 p-6 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{problem.title}</p>
                          <div className="mt-1 flex gap-2 text-xs">
                            <span className="text-gray-500 dark:text-gray-400">{problem.platform}</span>
                            <span className="text-gray-300 dark:text-gray-600">&bull;</span>
                            <span className="text-gray-500 dark:text-gray-400">{problem.difficulty}</span>
                            <span className="text-gray-300 dark:text-gray-600">&bull;</span>
                            <span className="text-gray-500 dark:text-gray-400">{problem.topic}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {isDue ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              Due for review
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Next: {nextReview?.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
