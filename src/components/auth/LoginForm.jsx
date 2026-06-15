import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/Button'

export function LoginForm({ onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) alert(error.message)
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Welcome back</h2>
        <p className="text-sm text-slate mt-1">Sign in to continue your journey.</p>
      </div>
      <div>
        <label htmlFor="login-email" className="block text-sm text-slate mb-2">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
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
