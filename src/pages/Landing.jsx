import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import {
  Sparkles,
  Target,
  Calendar,
  TrendingUp,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { Logo } from '../components/layout/Logo'
import { Button } from '../components/ui/Button'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal, StaggerItem } from '../components/ui/ScrollReveal'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'

function HeroBackground() {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const orb1X = useTransform(mouseX, [0, 1], [-20, 20])
  const orb1Y = useTransform(mouseY, [0, 1], [-20, 20])
  const orb2X = useTransform(mouseX, [0, 1], [15, -15])
  const orb2Y = useTransform(mouseY, [0, 1], [15, -15])

  useEffect(() => {
    const handleMove = (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-navy-dark" />
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(62,113,192,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, rgba(62,113,192,0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 80%, rgba(62,113,192,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(62,113,192,0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{ x: orb1X, y: orb1Y }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-royal/10 blur-[100px]"
      />
      <motion.div
        style={{ x: orb2X, y: orb2Y }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-royal/8 blur-[80px]"
      />
      <div className="absolute inset-0 noise-overlay" />
    </div>
  )
}

const stats = [
  { value: 10000, suffix: '+', label: 'Tasks completed' },
  { value: 98, suffix: '%', label: 'User satisfaction' },
  { value: 50, suffix: '+', label: 'Productivity features' },
  { value: 24, suffix: '/7', label: 'Always accessible' },
]

const features = [
  {
    icon: Target,
    title: 'Intelligent Goal Tracking',
    description:
      'Set ambitious goals with milestone roadmaps. Watch your progress unfold with beautiful visual analytics.',
  },
  {
    icon: Calendar,
    title: 'Daily & Monthly Planning',
    description:
      'Seamlessly plan your days and months with timeline views, drag-and-drop tasks, and focus widgets.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Visualization',
    description:
      'Apple Fitness-inspired rings and shimmer progress bars that make every completion feel rewarding.',
  },
  {
    icon: Zap,
    title: 'Focus Mode',
    description:
      'Stay in the zone with distraction-free workspaces designed for deep, meaningful work.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your data stays yours. Built on enterprise-grade infrastructure with end-to-end security.',
  },
  {
    icon: Sparkles,
    title: 'Delightful Experience',
    description:
      'Micro-interactions, smooth animations, and premium design that makes productivity a joy.',
  },
]

export function Landing() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <HeroBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-8 inline-block"
              >
                <Logo className="h-16 w-16" />
              </motion.div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                À Faire
              </h1>
              <p className="mt-3 font-display text-xl sm:text-2xl text-royal-light tracking-wide">
                Where Intent Becomes Action
              </p>
              <p className="mt-6 text-lg text-slate max-w-lg leading-relaxed">
                Transform your goals into consistent progress through intelligent planning,
                focus tracking, and beautiful productivity experiences.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/login">
                  <Button variant="primary" className="px-8 py-3 text-base">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="secondary" className="px-8 py-3 text-base">
                    Explore Features
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-strong rounded-3xl p-8 shadow-glow-lg border border-white/[0.1]">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="glass rounded-2xl p-5 text-center"
                    >
                      <p className="font-display text-3xl font-bold text-white">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="text-xs text-slate mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  {['Plan your day with clarity', 'Track goals effortlessly', 'Celebrate every win'].map(
                    (item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center gap-3 text-sm text-slate"
                      >
                        <CheckCircle2 className="w-4 h-4 text-royal shrink-0" />
                        {item}
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-royal/20 rounded-full blur-2xl animate-pulse-glow" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-royal/10 rounded-full blur-3xl animate-pulse-glow" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <p className="text-royal-light text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              Features
            </p>
            <h2 className="section-title">
              Built for people who{' '}
              <span className="gradient-text">get things done</span>
            </h2>
            <p className="text-body max-w-2xl mx-auto mt-4">
              Every feature is crafted with intention — designed to help you focus on what
              matters most.
            </p>
          </ScrollReveal>

          <ScrollReveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <StaggerItem key={feature.title}>
                  <GlassCard hover className="h-full p-6" delay={i * 0.05}>
                    <div className="w-12 h-12 rounded-2xl bg-royal/15 flex items-center justify-center mb-4 border border-royal/20">
                      <Icon className="w-6 h-6 text-royal-light" />
                    </div>
                    <h3 className="card-title mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate leading-relaxed">{feature.description}</p>
                  </GlassCard>
                </StaggerItem>
              )
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <GlassCard className="p-12 sm:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-royal/10 via-transparent to-royal/5" />
              <div className="relative">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to transform your productivity?
                </h2>
                <p className="text-slate mb-8 max-w-lg mx-auto">
                  Join thousands of focused individuals who turn intent into action every day.
                </p>
                <Link to="/login">
                  <Button variant="primary" className="px-10 py-3.5 text-base">
                    Start for free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
