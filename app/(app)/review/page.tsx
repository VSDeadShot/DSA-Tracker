import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ReviewQueuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // A problem is "due" if its latest review's next_review_date is <= right now
  // OR if it has NO reviews at all (meaning it's brand new and needs initial review)
  
  const allProblems = await prisma.problem.findMany({
    where: { user_id: user.id },
    include: {
      reviews: {
        orderBy: { reviewed_at: 'desc' },
        take: 1,
      }
    }
  })

  const now = new Date()

  const dueProblems = allProblems.filter((problem) => {
    if (problem.reviews.length === 0) return true
    const nextReview = problem.reviews[0].next_review_date
    return nextReview <= now
  })

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Daily Review Queue</h1>
            <p className="mt-2 text-slate-400">
              Problems due for spaced repetition today based on your past performance.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 px-6 flex justify-between items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {dueProblems.length} Problems Due
            </span>
          </div>

          {dueProblems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">You're all caught up!</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                You have reviewed everything for today. Check back tomorrow or log some new problems to practice!
              </p>
              <div className="mt-6">
                <Link
                  href="/problems/new"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                  Log New Problem
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {dueProblems.map((problem) => (
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
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
                          Review Now &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
