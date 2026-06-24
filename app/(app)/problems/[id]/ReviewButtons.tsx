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
    { value: 1, label: '1 - Hard / Forgot', color: 'bg-[#2a2a2a] text-white hover:bg-white hover:text-black border border-[#555555]' },
    { value: 2, label: '2 - Struggled', color: 'bg-[#2a2a2a] text-white hover:bg-white hover:text-black border border-[#555555]' },
    { value: 3, label: '3 - Okay', color: 'bg-[#2a2a2a] text-white hover:bg-white hover:text-black border border-[#555555]' },
    { value: 4, label: '4 - Good', color: 'bg-[#2a2a2a] text-white hover:bg-white hover:text-black border border-[#555555]' },
    { value: 5, label: '5 - Easy', color: 'bg-[#2a2a2a] text-white hover:bg-white hover:text-black border border-[#555555]' },
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
