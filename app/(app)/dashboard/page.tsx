import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getCurrentStreak } from '@/lib/streak'

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
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 transition-all hover:-translate-y-1 hover:border-slate-700">
            <h3 className="text-sm font-medium text-slate-400">Current Streak</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-indigo-400">{currentStreak}</p>
              <p className="text-sm font-medium text-slate-500">days</p>
              {currentStreak > 0 && <span className="text-xl drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">🔥</span>}
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 transition-all hover:-translate-y-1 hover:border-slate-700">
            <h3 className="text-sm font-medium text-slate-400">Total Problems</h3>
            <p className="mt-2 text-3xl font-bold text-white">{totalProblems}</p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 transition-all hover:-translate-y-1 hover:border-slate-700">
            <h3 className="text-sm font-medium text-slate-400">Reviews Completed</h3>
            <p className="mt-2 text-3xl font-bold text-white">{totalReviews}</p>
          </div>

          <div className={`p-6 rounded-2xl shadow-xl border backdrop-blur-md transition-all hover:-translate-y-1 ${dueTodayCount > 0 ? 'bg-indigo-900/20 border-indigo-500/30 hover:border-indigo-500/50' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}>
            <h3 className={`text-sm font-medium ${dueTodayCount > 0 ? 'text-indigo-300' : 'text-slate-400'}`}>Due for Review</h3>
            <p className={`mt-2 text-3xl font-bold ${dueTodayCount > 0 ? 'text-indigo-100' : 'text-white'}`}>
              {dueTodayCount}
            </p>
            {dueTodayCount > 0 && (
              <Link href="/review" className="mt-4 inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300">
                Start Session &rarr;
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Problems</h2>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
          {problems.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p className="text-lg mb-4">No problems logged yet. Time to start grinding!</p>
              <Link href="/problems/new" className="inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                + Log your first problem
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-900/80 uppercase tracking-wider text-slate-400 text-xs border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">Problem</th>
                    <th scope="col" className="px-6 py-4 font-medium">Topic</th>
                    <th scope="col" className="px-6 py-4 font-medium">Difficulty</th>
                    <th scope="col" className="px-6 py-4 font-medium text-right">Status / Next Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {problems.map((problem) => {
                    const nextReview = problem.reviews[0]?.next_review_date
                    const isDue = nextReview ? new Date(nextReview) <= now : true
                    
                    return (
                      <tr key={problem.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/problems/${problem.id}`} className="block">
                            <span className="font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">{problem.title}</span>
                            <span className="block text-xs text-slate-500 mt-0.5">{problem.platform}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
                            {problem.topic}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            problem.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            problem.difficulty.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isDue ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400 border border-rose-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                              Due today
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">
                              {nextReview?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
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
