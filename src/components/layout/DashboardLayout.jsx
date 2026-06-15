import { useState } from 'react'
import { Sidebar, MobileNav } from './Sidebar'
import { cn } from '../../lib/cn'

export function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-base relative text-primary">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="fixed inset-0 noise-overlay pointer-events-none" />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main
        className={cn(
          'relative min-h-screen transition-all duration-500 pb-20 lg:pb-8',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
