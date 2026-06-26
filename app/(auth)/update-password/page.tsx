import { updatePassword } from './actions'
import Link from 'next/link'

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 selection:bg-white/20">
      <div className="w-full max-w-[400px] space-y-6 rounded-2xl bg-[#1a1a1a] p-8 shadow-xl border border-[#2a2a2a] backdrop-blur-md">
        <div className="text-center">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white mb-2 hover:opacity-80 transition-opacity">
            DSA Tracker
          </Link>
          <h2 className="text-xl font-semibold text-white mt-4">Update Password</h2>
          <p className="text-sm text-[#a0a0a0] mt-2">
            Please enter your new password below.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center border border-red-500/20 break-all">
            {error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#a0a0a0]">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-[#555555] bg-[#111111] px-3 py-2 text-white placeholder-[#555555] focus:border-white focus:outline-none focus:ring-1 focus:ring-white sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={updatePassword}
            className="w-full flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:-translate-y-0.5"
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  )
}
