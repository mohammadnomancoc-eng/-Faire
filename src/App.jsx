import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabaseClient'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Landing } from './pages/Landing'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { DailyPlanner } from './pages/DailyPlanner'
import { MonthPlanner } from './pages/MonthPlanner'
import { AuthPage } from './pages/AuthPage'
import { Settings } from './pages/Settings'
import { useNotifications } from './hooks/useNotifications'
import { Logo } from './components/layout/Logo'
import { ThemeProvider } from './context/ThemeContext'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base text-primary">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Logo className="h-12 w-12" animated={false} />
      </motion.div>
      <p className="text-secondary mt-4 text-sm">Loading…</p>
    </div>
  )
}

function PageWrapper({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Scrolls to the hash element after route/page transitions settle
function ScrollToHash() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const el = document.getElementById(id)
    if (el) {
      // Small delay lets page-transition animation finish first
      const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
      return () => clearTimeout(t)
    }
  }, [location.hash, location.pathname])
  return null
}

function PublicShell({ session, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base text-primary">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="fixed inset-0 noise-overlay pointer-events-none" />
      <Navbar session={session} />
      <main className="flex-1 relative pt-20">
        <PageWrapper>{children}</PageWrapper>
      </main>
      <Footer />
    </div>
  )
}

function AppRoutes({ session }) {
  return (
    <>
      <ScrollToHash />
      <Routes>
      <Route
        path="/"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PublicShell session={session}>
              <Landing />
            </PublicShell>
          )
        }
      />
      <Route
        path="/about"
        element={
          <PublicShell session={session}>
            <About />
          </PublicShell>
        }
      />
      <Route
        path="/login"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-base relative overflow-hidden text-primary">
              <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
              <PageWrapper>
                <AuthPage />
              </PageWrapper>
            </div>
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          session ? (
            <PageWrapper>
              <DashboardLayout>
                <Home session={session} />
              </DashboardLayout>
            </PageWrapper>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/daily"
        element={
          session ? (
            <PageWrapper>
              <DashboardLayout>
                <DailyPlanner session={session} />
              </DashboardLayout>
            </PageWrapper>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/month"
        element={
          session ? (
            <PageWrapper>
              <DashboardLayout>
                <MonthPlanner session={session} />
              </DashboardLayout>
            </PageWrapper>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/settings"
        element={
          session ? (
            <PageWrapper>
              <DashboardLayout>
                <Settings session={session} />
              </DashboardLayout>
            </PageWrapper>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  useNotifications(session?.user?.id)

  if (loading) return <LoadingScreen />

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes session={session} />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
