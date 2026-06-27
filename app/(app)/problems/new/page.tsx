import { addProblem } from './actions'
import Link from 'next/link'

export default function NewProblemPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Log a New Problem</h1>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-[#2a2a2a]">
        <form action={addProblem} className="space-y-6">
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#a0a0a0]">
              Problem Title
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="title"
                id="title"
                required
                placeholder="e.g. Two Sum"
                className="block w-full rounded-lg border border-[#555555] bg-[#111111] px-3 py-2 text-white placeholder-[#555555] focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-[#a0a0a0]">
              Problem URL
            </label>
            <div className="mt-2">
              <input
                type="url"
                name="url"
                id="url"
                required
                placeholder="https://leetcode.com/problems/..."
                className="block w-full rounded-lg border border-[#555555] bg-[#111111] px-3 py-2 text-white placeholder-[#555555] focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Platform & Difficulty Row */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-[#a0a0a0]">
                Platform
              </label>
              <div className="mt-2">
                <select
                  id="platform"
                  name="platform"
                  className="block w-full rounded-lg border border-[#555555] bg-[#111111] px-3 py-2.5 text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
                >
                  <option value="leetcode">LeetCode</option>
                  <option value="codechef">CodeChef</option>
                  <option value="hackerrank">HackerRank</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-[#a0a0a0]">
                Difficulty
              </label>
              <div className="mt-2">
                <select
                  id="difficulty"
                  name="difficulty"
                  className="block w-full rounded-lg border border-[#555555] bg-[#111111] px-3 py-2.5 text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-[#a0a0a0]">
              Primary Topic
            </label>
            <div className="mt-2">
              <select
                id="topic"
                name="topic"
                className="block w-full rounded-lg border border-[#555555] bg-[#111111] px-3 py-2.5 text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
              >
                <option value="array">Array</option>
                <option value="string">String</option>
                <option value="hash-table">Hash Table</option>
                <option value="dp">Dynamic Programming</option>
                <option value="math">Math</option>
                <option value="sorting">Sorting</option>
                <option value="greedy">Greedy</option>
                <option value="dfs">Depth-First Search</option>
                <option value="bfs">Breadth-First Search</option>
                <option value="tree">Tree</option>
                <option value="binary-search">Binary Search</option>
                <option value="graph">Graph</option>
                <option value="two-pointers">Two Pointers</option>
                <option value="sliding-window">Sliding Window</option>
                <option value="linked-list">Linked List</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Notes / Approach */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-[#a0a0a0]">
              Notes & Approach <span className="text-[#555555] font-normal">(Optional)</span>
            </label>
            <div className="mt-2">
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="What was the core trick? What edge cases did you miss?"
                className="block w-full rounded-lg border border-[#555555] bg-[#111111] px-3 py-2 text-white placeholder-[#555555] focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:-translate-y-0.5"
            >
              Save Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
