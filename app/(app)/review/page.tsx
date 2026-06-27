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
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Daily Review Queue</h1>
            <p className="mt-2 text-[#a0a0a0]">
              Problems due for spaced repetition today based on your past performance.
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#2a2a2a] overflow-hidden">
          <div className="border-b border-[#2a2a2a] bg-[#111111] p-4 px-6 flex justify-between items-center">
            <span className="font-semibold text-white">
              {dueProblems.length} Problems Due
            </span>
          </div>

          {dueProblems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#111111] border border-[#2a2a2a]">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">You're all caught up!</h3>
              <p className="mt-2 text-[#a0a0a0]">
                You have reviewed everything for today. Check back tomorrow or log some new problems to practice!
              </p>
              <div className="mt-6">
                <Link
                  href="/problems/new"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 transition-colors"
                >
                  Log New Problem
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-[#2a2a2a]">
              {dueProblems.map((problem) => (
                <li key={problem.id}>
                  <Link href={`/problems/${problem.id}`} className="block hover:bg-[#111111] p-4 md:p-6 transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                      <div>
                        <p className="text-lg font-medium text-white group-hover:underline break-words">{problem.title}</p>
                        <div className="mt-2 sm:mt-1 flex flex-wrap gap-2 text-xs">
                          <span className="text-[#a0a0a0]">{problem.platform}</span>
                          <span className="text-[#555555] hidden sm:inline">&bull;</span>
                          <span className="text-[#a0a0a0]">{problem.difficulty}</span>
                          <span className="text-[#555555] hidden sm:inline">&bull;</span>
                          <span className="text-[#a0a0a0]">{problem.topic}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <span className="inline-flex items-center rounded-md bg-white px-3 py-1 text-sm font-medium text-black transition-colors hover:bg-gray-200">
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
