import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { Logo, Wordmark } from './Logo'
import { Button } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'
import { cn } from '../../lib/cn'

const publicLinks = [
  { label: 'Features', path: '/#features' },
  { label: 'About', path: '/about' },
]

const authLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Daily', path: '/daily' },
  { label: 'Month', path: '/month' },
]

export function Navbar({ session, variant = 'floating' }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = session ? authLinks : publicLinks

  const handleLinkClick = (e, path) => {
    if (!path.includes('#')) return
    const [pathname, hash] = path.split('#')
    const targetPath = pathname || '/'
    if (location.pathname === targetPath) {
      e.preventDefault()
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  if (variant === 'minimal') return null

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 px-4 md:px-6 transition-all duration-500',
          variant === 'floating' ? 'pt-4' : 'pt-0'
        )}
      >
        <nav
          className={cn(
            'mx-auto max-w-7xl flex items-center justify-between transition-all duration-500',
            variant === 'floating'
              ? cn(
                  'rounded-2xl px-5 py-3 glass border',
                  scrolled
                    ? 'py-2.5 bg-surface/80 border-base shadow-glass'
                    : 'bg-page-accent border-base'
                )
              : 'px-2 py-4 border-b border-base bg-surface/90 backdrop-blur-xl'
          )}
        >
          <Link to={session ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <motion.div
              animate={{ scale: scrolled ? 0.85 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Logo className="h-8 w-8" />
            </motion.div>
            <Wordmark />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={cn(
                  'nav-link',
                  location.pathname === link.path && 'nav-link-active'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {session ? (
              <Button
                variant="ghost"
                onClick={() => supabase.auth.signOut()}
                className="text-sm"
              >
                Sign out
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/login">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-20 z-40 md:hidden glass rounded-2xl p-4 shadow-lift"
          >
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-3 rounded-xl text-slate hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/[0.08] pt-3 mt-2">
                {session ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => supabase.auth.signOut()}
                  >
                    Sign out
                  </Button>
                ) : (
                  <Link to="/login" className="block">
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
