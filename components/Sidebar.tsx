'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ userEmail }: { userEmail: string | undefined }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Review Queue', href: '/review', icon: '⚡' },
    { name: 'Log Problem', href: '/problems/new', icon: '📝' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800 p-4">
      <div className="mb-8 px-4 py-2">
        <h1 className="text-xl font-bold tracking-tight text-white">DSA Tracker</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Dashboard' && pathname.startsWith('/problems') && item.href !== '/problems/new')

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">
        <div className="px-4 py-2">
          <p className="truncate text-xs font-medium text-slate-400">{userEmail}</p>
        </div>
        <form action="/auth/signout" method="post" className="mt-2">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400">
            <span>🚪</span>
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
