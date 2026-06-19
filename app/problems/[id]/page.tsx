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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {problem.title}
              </h1>
              <div className="mt-2 flex gap-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
                  {problem.platform}
                </span>
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-900/30 dark:text-purple-400">
                  {problem.topic}
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  problem.difficulty === 'easy' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400' :
                  problem.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
            </div>
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Solve Problem &nearr;
            </a>
          </div>

          {/* SM-2 Review Section */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review this problem</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              How confident are you with this problem right now? (1 = Completely forgot, 5 = Perfectly easy)
            </p>
            
            <div className="mt-6">
              <ReviewButtons problemId={problem.id} />
            </div>
          </div>

          {/* Review History */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Review History</h3>
            {problem.reviews.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet. Rate your confidence above to start spacing!</p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Next review scheduled for:</strong> {latestReview.next_review_date.toLocaleDateString()}
                  </p>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {problem.reviews.map((review) => (
                    <li key={review.id} className="py-3 flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {review.reviewed_at.toLocaleDateString()} at {review.reviewed_at.toLocaleTimeString()}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
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
    </div>
  )
}
