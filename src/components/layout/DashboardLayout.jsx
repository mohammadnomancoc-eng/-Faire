import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Sidebar, MobileNav } from './Sidebar'
import { cn } from '../../lib/cn'

export function DashboardLayout({ children, session }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-base relative text-primary">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="fixed inset-0 noise-overlay pointer-events-none" />

      <Sidebar session={session} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main
        className={cn(
          'relative min-h-screen transition-all duration-500 pb-20 lg:pb-8',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        {session?.isGuest && (
          <div className="relative z-30 w-full bg-red-500/10 border-b border-red-500/20 px-4 py-3 text-center text-xs sm:text-sm text-red-700 dark:text-red-200/95 flex flex-col sm:flex-row items-center justify-center gap-2 shadow-[0_4px_20px_rgba(239,68,68,0.05)]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 animate-pulse" />
              <span>You are using <strong>À Faire</strong> as a guest. Your data will be lost when you close this page.</span>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-white underline transition-colors focus:outline-none"
            >
              Login to keep track of your progress <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {children}
        </div>
      </main>

      <MobileNav session={session} />
    </div>
  )
}
