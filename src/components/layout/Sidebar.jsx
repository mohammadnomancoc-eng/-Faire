import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { Logo, Wordmark } from './Logo'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Daily Planner', path: '/daily', icon: CalendarDays },
  { label: 'Month Planner', path: '/month', icon: CalendarRange },
  { label: 'Goals', path: '/month#goals', icon: Target, matchPath: '/month' },
  { label: 'Settings', path: '/settings', icon: Settings },
]

export function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()

  const isActive = (item) => {
    if (item.label === 'Goals') {
      return location.pathname === '/month' && location.hash === '#goals'
    }
    return location.pathname === item.path
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-all duration-500',
        'glass border-r border-base',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 p-5 border-b border-white/[0.06]',
          collapsed && 'justify-center'
        )}
      >
        <Logo className="h-8 w-8" animated={false} />
        {!collapsed && <Wordmark />}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item)
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group',
                active
                  ? 'text-white'
                  : 'text-slate hover:text-white hover:bg-white/[0.06]',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-royal/10 border border-royal/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 relative z-10 transition-colors',
                  active ? 'text-royal-light' : 'group-hover:text-royal-light'
                )}
              />
              {!collapsed && (
                <span className="relative z-10 text-sm font-medium">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className="m-3 p-2.5 rounded-xl text-secondary hover:text-primary hover:bg-page-accent transition-colors flex items-center justify-center"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}

export function MobileNav() {
  const location = useLocation()

  const mobileItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Daily', path: '/daily', icon: CalendarDays },
    { label: 'Month', path: '/month', icon: CalendarRange },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.08] px-2 pb-3 pt-1">
      <div className="flex items-center justify-around">
        {mobileItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300',
                isActive ? 'text-royal-light' : 'text-slate hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5',
                  isActive && 'drop-shadow-[0_0_8px_rgba(62,113,192,0.5)]'
                )}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
