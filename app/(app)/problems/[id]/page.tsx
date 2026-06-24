import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import ReviewButtons from './ReviewButtons'

export default async function ProblemPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const problem = await prisma.problem.findUnique({
    where: {
      id: id,
      user_id: user.id,
    },
    include: {
      reviews: {
        orderBy: {
          reviewed_at: 'desc',
        },
      },
    },
  })

  if (!problem) {
    notFound()
  }

  const latestReview = problem.reviews[0]
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {problem.title}
            </h1>
            <div className="mt-3 flex gap-2">
              <span className="inline-flex items-center rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-700">
                {problem.platform}
              </span>
              <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/20">
                {problem.topic}
              </span>
              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${
                problem.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                problem.difficulty.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
          >
            Solve Problem ↗
          </a>
        </div>

        {problem.notes && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Notes & Approach</h3>
            <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-4">
              <p className="text-slate-400 whitespace-pre-wrap text-sm">{problem.notes}</p>
            </div>
          </div>
        )}

        {/* SM-2 Review Section */}
        <div className="mt-10 border-t border-slate-800 pt-8">
          <h2 className="text-xl font-semibold text-white">Review this problem</h2>
          <p className="mt-1 text-sm text-slate-400">
            How confident are you with this problem right now? (1 = Completely forgot, 5 = Perfectly easy)
          </p>
          
          <div className="mt-6">
            <ReviewButtons problemId={problem.id} />
          </div>
        </div>

        {/* Review History */}
        <div className="mt-10 border-t border-slate-800 pt-8">
          <h3 className="text-lg font-medium text-white mb-4">Review History</h3>
          {problem.reviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet. Rate your confidence above to start spacing!</p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-4">
                <p className="text-sm text-indigo-300">
                  <strong className="text-indigo-400">Next review scheduled for:</strong> {latestReview.next_review_date.toLocaleDateString()}
                </p>
              </div>
              <ul className="divide-y divide-slate-800/50">
                {problem.reviews.map((review) => (
                  <li key={review.id} className="py-3 flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      {review.reviewed_at.toLocaleDateString()} at {review.reviewed_at.toLocaleTimeString()}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-white border border-slate-700">
                      Confidence: {review.confidence} / 5
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
