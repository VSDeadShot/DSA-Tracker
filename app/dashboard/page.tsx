import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! You are logged in as <span className="font-semibold">{user.email}</span>.
          </p>
          <form action="/auth/signout" method="post" className="mt-4">
            <button className="text-sm text-red-600 hover:text-red-500 font-medium">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
