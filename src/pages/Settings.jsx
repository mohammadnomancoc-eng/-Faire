import { motion } from 'framer-motion'
import { Bell, Moon, User, Shield } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabaseClient'

export function Settings({ session }) {
  const email = session?.user?.email || ''
  const name = session?.user?.user_metadata?.full_name || 'User'

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Settings</h1>
        <p className="text-slate mt-2">Manage your account and preferences.</p>
      </motion.div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-royal/20 flex items-center justify-center border border-royal/30">
            <User className="w-7 h-7 text-royal-light" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-white">{name}</h2>
            <p className="text-sm text-slate">{email}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </GlassCard>

      <GlassCard className="p-6 space-y-5">
        <h2 className="card-title text-lg">Preferences</h2>
        {[
          { icon: Bell, label: 'Notifications', desc: 'Task reminders and daily summaries' },
          { icon: Moon, label: 'Appearance', desc: 'Dark luxury theme (active)' },
          { icon: Shield, label: 'Privacy', desc: 'Your data is encrypted and secure' },
        ].map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-royal-light" />
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate">{desc}</p>
              </div>
            </div>
            <div className="w-10 h-6 rounded-full bg-royal/30 relative">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-royal shadow-glow" />
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  )
}
