import { login, signup } from './actions'
import Link from 'next/link'
import PasswordInput from '@/components/PasswordInput'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; tab?: string }
}) {
  const { error, tab = 'signin' } = await searchParams
  const isSignIn = tab === 'signin'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 selection:bg-white/20">
      <div className="w-full max-w-[400px] space-y-6 rounded-2xl bg-[#1a1a1a] p-8 shadow-xl border border-[#2a2a2a] backdrop-blur-md">
        <div className="text-center">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white mb-2 hover:opacity-80 transition-opacity">
            DSA Tracker
          </Link>
          <p className="text-sm text-[#a0a0a0]">
            {isSignIn ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-[#0a0a0a] p-1 border border-[#2a2a2a]">
          <Link
            href="/login?tab=signin"
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition-all ${
              isSignIn ? 'bg-[#1a1a1a] text-white shadow-sm border border-[#2a2a2a]' : 'text-[#a0a0a0] hover:text-white hover:bg-[#111111]'
            }`}
          >
            Sign in
          </Link>
          <Link
            href="/login?tab=signup"
            className={`flex-1 rounded-md py-2 text-center text-sm font-medium transition-all ${
              !isSignIn ? 'bg-[#1a1a1a] text-white shadow-sm border border-[#2a2a2a]' : 'text-[#a0a0a0] hover:text-white hover:bg-[#111111]'
            }`}
          >
            Sign up
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center border border-red-500/20 break-all">
            {error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a0]">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-lg border border-[#555555] bg-[#111111] px-3 py-2 text-white placeholder-[#555555] focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-[#a0a0a0]">
                Password
              </label>
              {isSignIn && (
                <Link href="/forgot-password" className="text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors">
                  Forgot password?
                </Link>
              )}
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className="!mt-0" // We already have mt-1 in the component wrapper, we can pass !mt-0 or just let it be handled by component
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={isSignIn ? login : signup}
            className="w-full flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:-translate-y-0.5"
          >
            {isSignIn ? 'Sign in to account' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
