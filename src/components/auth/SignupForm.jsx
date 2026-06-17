import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../ui/Button'

export function SignupForm({ onSwitchToLogin, onStartGuest }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (signUpError) {
      setError(signUpError.message)
    } else {
      setRegisteredEmail(email)
      setSuccess(true)
    }
    setLoading(false)
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center text-center space-y-5 py-4">
        {/* Animated checkmark circle */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e22 0%, #16a34a44 100%)',
            border: '2px solid #22c55e66',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}
        >
          ✅
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white">Check your inbox!</h2>
          <p className="text-sm text-slate mt-2 leading-relaxed">
            A confirmation link has been sent to{' '}
            <span className="text-royal-light font-medium">{registeredEmail}</span>.
          </p>
        </div>

        {/* Highlighted instruction box */}
        <div
          style={{
            width: '100%',
            background: 'rgba(99,102,241,0.10)',
            border: '1px solid rgba(99,102,241,0.30)',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          <p className="text-sm text-white font-medium">
            📧 Your email is verified — now login with the same email
          </p>
          <p className="text-xs text-slate mt-1">
            Click the link in the email, then come back and sign in.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          className="w-full"
          onClick={onSwitchToLogin}
        >
          Go to Login →
        </Button>
      </div>
    )
  }

  // ── Signup form ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSignup} className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Create account</h2>
        <p className="text-sm text-slate mt-1">Start turning intent into action.</p>
      </div>

      {/* Inline error message */}
      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: 10,
            padding: '10px 14px',
          }}
        >
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

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
