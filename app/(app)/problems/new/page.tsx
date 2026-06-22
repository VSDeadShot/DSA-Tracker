import { addProblem } from './actions'
import Link from 'next/link'

export default function NewProblemPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Log a New Problem</h1>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <form action={addProblem} className="space-y-6">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Problem Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="e.g. Two Sum"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 px-3"
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Problem URL
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  name="url"
                  id="url"
                  required
                  placeholder="https://leetcode.com/problems/..."
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 px-3"
                />
              </div>
            </div>

            {/* Platform & Difficulty Row */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                  Platform
                </label>
                <div className="mt-2">
                  <select
                    id="platform"
                    name="platform"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 px-3"
                  >
                    <option value="leetcode">LeetCode</option>
                    <option value="codechef">CodeChef</option>
                    <option value="hackerrank">HackerRank</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                  Difficulty
                </label>
                <div className="mt-2">
                  <select
                    id="difficulty"
                    name="difficulty"
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 px-3"
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
              <label htmlFor="topic" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                Primary Topic
              </label>
              <div className="mt-2">
                <select
                  id="topic"
                  name="topic"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 px-3"
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Save Problem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
