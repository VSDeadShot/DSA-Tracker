import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getCurrentStreak } from '@/lib/streak'
import { deleteProblem } from './actions'
import TopicSelect from './TopicSelect'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const currentStreak = await getCurrentStreak(user.id)


  const problems = await prisma.problem.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' },
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
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 mb-10">
          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-2xl shadow-xl border border-[#2a2a2a] transition-all hover:-translate-y-1 hover:bg-[#222222] group flex flex-col justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-[#a0a0a0] group-hover:text-white transition-colors">Current Streak</h3>
            <div className="mt-2 flex items-baseline gap-1 sm:gap-2">
              <p className="text-2xl sm:text-3xl font-bold text-white">{currentStreak}</p>
              <p className="text-xs sm:text-sm font-medium text-[#555555]">days</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-2xl shadow-xl border border-[#2a2a2a] transition-all hover:-translate-y-1 hover:bg-[#222222] group flex flex-col justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-[#a0a0a0] group-hover:text-white transition-colors">Total Problems</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">{totalProblems}</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-2xl shadow-xl border border-[#2a2a2a] transition-all hover:-translate-y-1 hover:bg-[#222222] group flex flex-col justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-[#a0a0a0] group-hover:text-white transition-colors">Reviews Completed</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">{totalReviews}</p>
          </div>

          <div className={`p-4 sm:p-6 rounded-2xl shadow-xl border transition-all hover:-translate-y-1 group flex flex-col justify-between ${dueTodayCount > 0 ? 'bg-[#1a1a1a] border-white hover:bg-[#222222]' : 'bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#222222]'}`}>
            <div>
              <h3 className={`text-xs sm:text-sm font-medium transition-colors ${dueTodayCount > 0 ? 'text-white' : 'text-[#a0a0a0] group-hover:text-white'}`}>Due for Review</h3>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                {dueTodayCount}
              </p>
            </div>
            {dueTodayCount > 0 && (
              <Link href="/review" className="mt-4 inline-block text-xs sm:text-sm font-semibold text-white underline hover:text-[#a0a0a0]">
                Start Session &rarr;
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Problems</h2>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-[#2a2a2a] overflow-hidden">
          {problems.length === 0 ? (
            <div className="p-12 text-center text-[#a0a0a0]">
              <p className="text-lg mb-4">No problems logged yet. Time to start grinding!</p>
              <Link href="/problems/new" className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition-colors">
                + Log your first problem
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile List View */}
              <div className="md:hidden divide-y divide-[#2a2a2a]">
                {problems.map((problem) => {
                  const nextReview = problem.reviews[0]?.next_review_date
                  const isDue = nextReview ? new Date(nextReview) <= now : true

                  return (
                    <div key={problem.id} className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <Link href={`/problems/${problem.id}`} className="block overflow-hidden">
                          <span className="font-medium text-white underline-offset-2 hover:underline truncate block">{problem.title}</span>
                          <span className="block text-xs text-[#a0a0a0] mt-0.5">{problem.platform}</span>
                        </Link>
                        <div className="flex items-center gap-3 shrink-0 mt-0.5">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border bg-[#2a2a2a] text-white ${
                            problem.difficulty.toLowerCase() === 'easy' ? 'border-[#555555]' :
                            problem.difficulty.toLowerCase() === 'medium' ? 'border-[#a0a0a0]' :
                            'border-white'
                          }`}>
                            {problem.difficulty}
                          </span>
                          <form action={deleteProblem}>
                            <input type="hidden" name="id" value={problem.id} />
                            <button type="submit" className="text-[#555555] hover:text-white transition-colors" title="Delete problem">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="w-40">
                          <TopicSelect problemId={problem.id} initialTopic={problem.topic} />
                        </div>
                        <div className="text-right">
                          {isDue ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-2.5 py-0.5 text-xs font-medium text-white border border-white">
                              <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                              Due
                            </span>
                          ) : (
                            <span className="text-[#a0a0a0] text-xs">
                              {nextReview?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop Table View */}
              <table className="hidden md:table min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#111111] uppercase tracking-wider text-[#a0a0a0] text-xs border-b border-[#2a2a2a]">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">Problem</th>
                    <th scope="col" className="px-6 py-4 font-medium">Topic</th>
                    <th scope="col" className="px-6 py-4 font-medium">Difficulty</th>
                    <th scope="col" className="px-6 py-4 font-medium text-right">Status / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {problems.map((problem) => {
                    const nextReview = problem.reviews[0]?.next_review_date
                    const isDue = nextReview ? new Date(nextReview) <= now : true
                    
                    return (
                      <tr key={problem.id} className="hover:bg-[#111111] transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/problems/${problem.id}`} className="block">
                            <span className="font-medium text-white group-hover:underline transition-colors">{problem.title}</span>
                            <span className="block text-xs text-[#a0a0a0] mt-0.5">{problem.platform}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <TopicSelect problemId={problem.id} initialTopic={problem.topic} />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border bg-[#2a2a2a] text-white ${
                            problem.difficulty.toLowerCase() === 'easy' ? 'border-[#555555]' :
                            problem.difficulty.toLowerCase() === 'medium' ? 'border-[#a0a0a0]' :
                            'border-white'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-4">
                            {isDue ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-2.5 py-0.5 text-xs font-medium text-white border border-white">
                                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                                Due today
                              </span>
                            ) : (
                              <span className="text-[#a0a0a0] text-xs">
                                {nextReview?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                            
                            <form action={deleteProblem}>
                              <input type="hidden" name="id" value={problem.id} />
                              <button type="submit" className="text-[#555555] hover:text-white transition-colors" title="Delete problem">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
