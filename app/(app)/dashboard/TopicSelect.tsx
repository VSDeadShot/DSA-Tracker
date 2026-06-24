'use client'

import { useTransition } from 'react'
import { updateTopic } from './actions'

const TOPICS = [
  'array', 'string', 'hash-table', 'dp', 'math', 'sorting', 'greedy',
  'dfs', 'bfs', 'tree', 'binary-search', 'graph', 'two-pointers',
  'sliding-window', 'linked-list', 'other'
]

export default function TopicSelect({ problemId, initialTopic }: { problemId: string, initialTopic: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="relative inline-block">
      <select
        defaultValue={initialTopic}
        disabled={isPending}
        onChange={(e) => {
          startTransition(async () => {
            await updateTopic(problemId, e.target.value)
          })
        }}
        className="appearance-none inline-flex items-center rounded-full bg-[#111111] py-0.5 pl-2.5 pr-6 text-xs font-medium text-white border border-[#555555] hover:border-white hover:bg-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-white transition-colors cursor-pointer disabled:opacity-50"
      >
        {TOPICS.map(topic => (
          <option key={topic} value={topic} className="bg-[#1a1a1a] text-white">{topic}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 text-[#a0a0a0]">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
