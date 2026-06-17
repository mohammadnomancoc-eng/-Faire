import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginForm } from '../components/auth/LoginForm'
import { SignupForm } from '../components/auth/SignupForm'
import { Logo, Wordmark } from '../components/layout/Logo'

export function AuthPage({ onStartGuest }) {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-royal/10 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-royal/8 blur-[100px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative glass-strong rounded-3xl w-full max-w-md p-8 shadow-glow-lg border border-white/[0.1]"
      >
        <Link to="/" className="flex flex-col items-center mb-8 group cursor-pointer">
          <Logo className="h-14 w-14 mb-4 transition-transform duration-300 group-hover:scale-110" />
          <Wordmark className="items-center text-center" />
        </Link>
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {mode === 'login' ? (
              <LoginForm onSwitchToSignup={() => setMode('signup')} onStartGuest={onStartGuest} />
            ) : (
              <SignupForm onSwitchToLogin={() => setMode('login')} onStartGuest={onStartGuest} />
            )}
          </motion.div>
        </AnimatePresence>


      </motion.div>
    </div>
  )
}
