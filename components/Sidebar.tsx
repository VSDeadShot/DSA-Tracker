'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Sidebar({ userEmail }: { userEmail: string | undefined }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Review Queue', href: '/review', icon: '⚡' },
    { name: 'Log Problem', href: '/problems/new', icon: '📝' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ]

  return (
    <div className={`flex h-full flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} py-4`}>
      <div className={`mb-8 flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
        {!isCollapsed && <h1 className="text-xl font-bold tracking-tight text-white truncate whitespace-nowrap">DSA Tracker</h1>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? '❯' : '❮'}
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Dashboard' && pathname.startsWith('/problems') && item.href !== '/problems/new')

          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4 px-3">
        {!isCollapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="truncate text-xs font-medium text-slate-400 whitespace-nowrap">{userEmail}</p>
          </div>
        )}
        <form action="/auth/signout" method="post">
          <button 
            title={isCollapsed ? "Sign out" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <span className="text-lg">🚪</span>
            {!isCollapsed && <span className="whitespace-nowrap">Sign out</span>}
          </button>
        </form>
      </div>
    </div>
  )
}
