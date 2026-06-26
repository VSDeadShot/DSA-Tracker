import { resetPassword } from './actions'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  const { error, message } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 selection:bg-white/20">
      <div className="w-full max-w-[400px] space-y-6 rounded-2xl bg-[#1a1a1a] p-8 shadow-xl border border-[#2a2a2a] backdrop-blur-md">
        <div className="text-center">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white mb-2 hover:opacity-80 transition-opacity">
            DSA Tracker
          </Link>
          <h2 className="text-xl font-semibold text-white mt-4">Reset Password</h2>
          <p className="text-sm text-[#a0a0a0] mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center border border-red-500/20 break-all">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded-lg text-sm text-center border border-green-500/20">
            {message}
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

          <button
            formAction={resetPassword}
            className="w-full flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:-translate-y-0.5"
          >
            Send reset link
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/login" className="text-sm text-[#a0a0a0] hover:text-white transition-colors underline underline-offset-4">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
