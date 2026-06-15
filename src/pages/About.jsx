import { motion } from 'framer-motion'
import { Logo, Wordmark } from '../components/layout/Logo'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { Target, Calendar, TrendingUp, Sparkles } from 'lucide-react'

const values = [
  { icon: Target, title: 'Intentional Design', desc: 'Every feature serves a purpose.' },
  { icon: Calendar, title: 'Daily Rhythm', desc: 'Build consistency one day at a time.' },
  { icon: TrendingUp, title: 'Visible Progress', desc: 'See how far you\'ve come, always.' },
  { icon: Sparkles, title: 'Delightful UX', desc: 'Productivity should feel premium.' },
]

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
      <ScrollReveal className="text-center mb-16">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-block mb-6"
        >
          <Logo className="h-20 w-20" />
        </motion.div>
        <Wordmark className="items-center text-center mb-4" />
        <p className="text-lg text-slate italic">Where Intent Becomes Action</p>
      </ScrollReveal>

      <ScrollReveal>
        <GlassCard className="p-8 sm:p-10 mb-12">
          <div className="space-y-5 text-slate leading-relaxed">
            <p className="text-lg text-white">
              À Faire helps you stay on track — one day at a time, one goal at a time.
            </p>
            <p>
              Whether you&apos;re planning today&apos;s tasks or chasing a 30-day dream,
              À Faire gives you the structure to show up consistently and the visibility
              to see how far you&apos;ve come.
            </p>
            <p className="text-sm pt-4 border-t border-white/[0.06]">
              Built with React, Tailwind CSS, and Supabase.
              <br />
              Designed with intention. Shipped with purpose.
            </p>
          </div>
        </GlassCard>
      </ScrollReveal>

      <ScrollReveal stagger className="grid sm:grid-cols-2 gap-4">
        {values.map(({ icon: Icon, title, desc }) => (
          <GlassCard key={title} hover className="p-5">
            <Icon className="w-5 h-5 text-royal-light mb-3" />
            <h3 className="font-display font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-slate">{desc}</p>
          </GlassCard>
        ))}
      </ScrollReveal>
    </div>
  )
}
