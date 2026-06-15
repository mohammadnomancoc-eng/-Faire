import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/Button'

export function SignupForm({ onSwitchToLogin }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email to confirm your account, then sign in.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Create account</h2>
        <p className="text-sm text-slate mt-1">Start turning intent into action.</p>
      </div>
      <div>
        <label htmlFor="signup-name" className="block text-sm text-slate mb-2">
          Full name
        </label>
        <input
          id="signup-name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="signup-email" className="block text-sm text-slate mb-2">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-sm text-slate mb-2">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
      </div>
      <Button type="submit" variant="primary" disabled={loading} className="w-full">
        {loading ? 'Creating account…' : 'Sign up'}
      </Button>
      <p className="text-sm text-center text-slate">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-royal-light font-medium hover:text-white transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
