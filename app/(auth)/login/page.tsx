import { login, signup } from './actions'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; tab?: string }
}) {
  const { error, tab = 'signin' } = await searchParams
  const isSignIn = tab === 'signin'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 selection:bg-indigo-500/30">
      <div className="w-full max-w-[400px] space-y-6 rounded-2xl bg-slate-900/50 p-8 shadow-xl backdrop-blur-md border border-slate-800">
        <div className="text-center">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white mb-2 hover:opacity-80 transition-opacity">
            DSA Tracker
          </Link>
          <p className="text-sm text-slate-400">
            {isSignIn ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
          <Link
            href="/login?tab=signin"
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition-all ${
              isSignIn ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign in
          </Link>
          <Link
            href="/login?tab=signup"
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition-all ${
              !isSignIn ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign up
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center border border-red-500/20">
            {error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={isSignIn ? login : signup}
            className="w-full flex justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:-translate-y-0.5"
          >
            {isSignIn ? 'Sign in to account' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
