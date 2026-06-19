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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back! You are logged in as <span className="font-semibold">{user.email}</span>.
            </p>
            <form action="/auth/signout" method="post">
              <button className="rounded-md bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Problems</h2>
          <Link
            href="/problems/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            + Log New Problem
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {problems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No problems logged yet. Time to start grinding!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {problems.map((problem) => {
                const nextReview = problem.reviews[0]?.next_review_date
                const isDue = nextReview ? new Date(nextReview) <= new Date() : true
                
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
