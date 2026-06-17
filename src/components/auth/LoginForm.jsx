import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/Button'

export function LoginForm({ onSwitchToSignup, onStartGuest }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) setError(loginError.message)
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setError(null)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (oauthError) setError(oauthError.message)
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Welcome back</h2>
        <p className="text-sm text-slate mt-1">Sign in to continue your journey.</p>
      </div>

      {/* Inline error — red, visible on both light & dark themes */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-red-500/60 bg-red-500/10 text-red-500"
          style={{ color: '#ef4444' }}
        >
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium leading-snug" style={{ color: '#ef4444' }}>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm text-slate mb-2">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null) }}
          className="input-field"
          placeholder="you@email.com"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm text-slate mb-2">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(null) }}
          className="input-field"
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <Button type="button" variant="secondary" className="w-full" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <span className="relative z-10 px-3 bg-[#0a162e] text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
          or
        </span>
      </div>

      <button
        type="button"
        onClick={onStartGuest}
        className="w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-royal-light/40 bg-white/[0.02] hover:bg-royal/5 text-sm font-semibold text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
      >
        Continue without sign up
      </button>

      <p className="text-sm text-center text-slate">
        No account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-royal-light font-medium hover:text-white transition-colors"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}
