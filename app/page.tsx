import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ffffff] selection:bg-white/20">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl pt-32 pb-24 sm:pt-40 sm:pb-32 mb-20 border-b border-transparent">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-br from-white to-[#a0a0a0] bg-clip-text text-transparent">
              Master DSA with Spaced Repetition
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#a0a0a0]">
              Stop forgetting the solutions you spent hours figuring out. Log your LeetCode, CodeChef, and HackerRank problems here, and let our SM-2 algorithm schedule your reviews perfectly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login"
                className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black shadow-lg shadow-white/10 transition-all hover:bg-gray-200 hover:shadow-white/20 hover:-translate-y-0.5"
              >
                Get started for free &rarr;
              </Link>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-[#a0a0a0]">Workflow</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How it works
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a] backdrop-blur-sm shadow-xl transition-all hover:-translate-y-1 hover:border-white/20">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2a2a2a] text-white border border-[#555555]">
                    1
                  </div>
                  Log a problem
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[#a0a0a0]">
                  <p className="flex-auto">
                    Just solved a tricky problem on LeetCode? Paste the link, tag the topics, and log it into your personalized database.
                  </p>
                </dd>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a] backdrop-blur-sm shadow-xl transition-all hover:-translate-y-1 hover:border-white/20">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2a2a2a] text-white border border-[#555555]">
                    2
                  </div>
                  Rate your confidence
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[#a0a0a0]">
                  <p className="flex-auto">
                    When you review a problem, simply rate how easy it was to remember the optimal approach on a scale of 1 to 5.
                  </p>
                </dd>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a] backdrop-blur-sm shadow-xl transition-all hover:-translate-y-1 hover:border-white/20">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2a2a2a] text-white border border-[#555555]">
                    3
                  </div>
                  SM-2 schedules your review
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[#a0a0a0]">
                  <p className="flex-auto">
                    Our algorithm automatically schedules the problem to reappear in your Daily Review Queue exactly when you're about to forget it.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>

      </div>
    </div>
  )
}
