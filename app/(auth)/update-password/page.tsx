'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // When the component mounts, the Supabase browser client automatically 
    // parses the #access_token from the URL (if present) and establishes the session.
    // We just wait a brief moment to ensure the session is ready.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('No active session found. Please request a new password reset link.')
      }
      setIsInitializing(false)
    }
    
    checkSession()
  }, [supabase.auth])

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

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

        {isInitializing ? (
          <div className="text-center text-[#a0a0a0] py-4">Verifying session...</div>
        ) : (
          <form className="space-y-4" onSubmit={handleUpdatePassword}>
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
              type="submit"
              disabled={loading || !!error}
              className="w-full flex justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
