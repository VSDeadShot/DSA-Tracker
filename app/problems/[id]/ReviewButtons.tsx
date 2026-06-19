'use client'

import { useTransition } from 'react'
import { submitReview } from './actions'

export default function ReviewButtons({ problemId }: { problemId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleReview = (confidence: number) => {
    startTransition(async () => {
      await submitReview(problemId, confidence)
    })
  }

  const buttons = [
    { value: 1, label: '1 - Hard / Forgot', color: 'bg-red-100 text-red-700 hover:bg-red-200 ring-red-600/20' },
    { value: 2, label: '2 - Struggled', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200 ring-orange-600/20' },
    { value: 3, label: '3 - Okay', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 ring-yellow-600/20' },
    { value: 4, label: '4 - Good', color: 'bg-green-100 text-green-700 hover:bg-green-200 ring-green-600/20' },
    { value: 5, label: '5 - Easy', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 ring-emerald-600/20' },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => handleReview(btn.value)}
          disabled={isPending}
          className={`px-4 py-2 rounded-md text-sm font-medium ring-1 ring-inset transition-colors ${btn.color} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}
