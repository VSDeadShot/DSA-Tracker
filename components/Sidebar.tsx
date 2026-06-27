'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Sidebar({ userEmail }: { userEmail: string | undefined }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Review Queue', href: '/review', icon: '⚡' },
    { name: 'Log Problem', href: '/problems/new', icon: '📝' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ]

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111111] border-b border-[#2a2a2a] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white tracking-tight">DSA Tracker</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -mr-2 text-[#a0a0a0] hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 md:static flex h-full flex-col bg-[#111111] border-r border-[#2a2a2a] transition-all duration-300 transform 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64 py-4 shrink-0`}
      >
        <div className={`mb-8 flex items-center ${isCollapsed ? 'md:flex-col md:justify-center md:gap-4 md:px-0' : 'justify-between px-6'}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'md:hidden' : ''}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white truncate whitespace-nowrap">DSA Tracker</h1>
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:block p-1.5 rounded-lg text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white transition-colors`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white transition-colors ml-auto"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.name === 'Dashboard' && pathname.startsWith('/problems') && pathname !== '/problems/new')

            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1f1f1f] text-white border-l-2 border-white'
                    : 'text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white border-l-2 border-transparent'
                } ${isCollapsed ? 'md:justify-center' : ''}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-[#2a2a2a] pt-4 px-3">
          <div className={`px-3 py-2 mb-2 ${isCollapsed ? 'md:hidden' : ''}`}>
            <p className="truncate text-xs font-medium text-[#a0a0a0] whitespace-nowrap">{userEmail}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button 
              title={isCollapsed ? "Sign out" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#a0a0a0] transition-colors hover:bg-[#1a1a1a] hover:text-white ${isCollapsed ? 'md:justify-center' : ''}`}
            >
              <span className="text-lg">🚪</span>
              <span className={`whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
