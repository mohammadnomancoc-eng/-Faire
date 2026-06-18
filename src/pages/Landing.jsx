import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion'
import {
  Sparkles, Target, Calendar, TrendingUp, Zap, Shield,
  ArrowRight, CheckCircle2, Star, Users, Clock,
  ChevronDown,
} from 'lucide-react'

import { Logo } from '../components/layout/Logo'

/* ─── Animated orb background ─────────────────────────────────── */
function HeroBG() {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const o1x = useTransform(mx, [0, 1], [-30, 30])
  const o1y = useTransform(my, [0, 1], [-30, 30])
  const o2x = useTransform(mx, [0, 1], [20, -20])
  const o2y = useTransform(my, [0, 1], [20, -20])

  useEffect(() => {
    const move = (e) => {
      if (!ref.current) return
      const r = ref.current.getBoundingClientRect()
      mx.set((e.clientX - r.left) / r.width)
      my.set((e.clientY - r.top) / r.height)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mx, my])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050c1a] via-[#071120] to-[#050c1a]" />
      <motion.div style={{ x: o1x, y: o1y }}
        className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-royal/10 blur-[120px]" />
      <motion.div style={{ x: o2x, y: o2y }}
        className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[100px]" />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-[40%] left-[55%] w-[300px] h-[300px] rounded-full bg-royal/5 blur-[80px]"
      />
      <div className="absolute inset-0 noise-overlay" />
      {/* grid lines */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(62,113,192,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(62,113,192,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}

/* ─── Scroll reveal wrapper ────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Counting number ──────────────────────────────────────────── */
function CountUp({ end, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <span ref={ref}>
      {inView ? end : 0}{suffix}
    </span>
  )
}

/* ─── Data ─────────────────────────────────────────────────────── */
const features = [
  { icon: Target, title: 'Goal Tracking', desc: 'Set ambitious goals with milestone roadmaps and watch your progress unfold with beautiful analytics.' },
  { icon: Calendar, title: 'Daily Planning', desc: 'Seamlessly plan your days and months with timeline views, drag-and-drop tasks, and smart focus modes.' },
  { icon: TrendingUp, title: 'Progress Rings', desc: 'Apple Fitness-inspired rings and shimmer bars that make every completion feel genuinely rewarding.' },
  { icon: Zap, title: 'Focus Mode', desc: 'Stay in the zone with distraction-free workspaces designed for deep, meaningful work sessions.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data stays yours. Built on enterprise-grade Supabase infrastructure with full encryption.' },
  { icon: Sparkles, title: 'Micro-interactions', desc: 'Premium animations, confetti on completion, and a delightful experience that motivates you daily.' },
]

const stats = [
  { value: 12, suffix: 'k+', label: 'Tasks Completed', icon: CheckCircle2 },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
  { value: 3, suffix: 'k+', label: 'Active Users', icon: Users },
]


const testimonials = [
  { name: 'Sarah K.', role: 'Product Designer', text: 'À Faire completely changed how I approach my days. The goal tracking is unmatched.' },
  { name: 'James L.', role: 'Software Engineer', text: 'The drag-and-drop planner and progress rings keep me in a constant state of flow.' },
  { name: 'Aisha M.', role: 'Startup Founder', text: 'Finally a productivity app that feels premium. Worth every second of my time.' },
]



/* ─── Main Component ───────────────────────────────────────────── */
export function Landing({ onStartGuest }) {
  return (
    <div className="relative bg-[#050c1a] text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20">
        <HeroBG />
        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Logo + Title inline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-5 sm:gap-7"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Logo className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
            </motion.div>

            <h1
              className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
              style={{ fontFamily: 'var(--font-display, system-ui)' }}
            >
              <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, #c8dcf5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>À-</span>
              <span style={{ background: 'linear-gradient(135deg, #5A8FD4 0%, #3E71C0 50%, #7EB3FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Faire
              </span>
            </h1>
          </motion.div>

          {/* Tagline below title */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg font-semibold uppercase tracking-[0.2em] text-royal-light"
          >
            Where Intent Becomes Action
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-5 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your goals into consistent progress through intelligent planning,
            focus tracking, and a beautifully premium productivity experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(62,113,192,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #3E71C0, #2a5499)' }}
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onStartGuest}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-slate-300 text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Try without Login
            </motion.button>
            <a href="#features">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-slate-400 text-sm hover:text-slate-300 transition-colors"
              >
                See Features <ChevronDown className="w-4 h-4" />
              </motion.button>
            </a>
          </motion.div>

          {/* Mock UI preview */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 relative mx-auto max-w-3xl"
          >
            <div className="absolute inset-0 bg-royal/10 blur-3xl rounded-3xl" />
            <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              style={{ background: 'rgba(10,22,46,0.8)', backdropFilter: 'blur(20px)' }}>
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                {['#FF5F57','#FFBD2E','#28C840'].map(c => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
                <div className="flex-1 mx-3 h-5 rounded-md bg-white/[0.06] flex items-center px-3">
                  <span className="text-[10px] text-slate-500">faire.onrender.com/dashboard</span>
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="p-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Today's Tasks", val: '8/12', color: '#3E71C0' },
                  { label: 'Active Goals', val: '4', color: '#5A8FD4' },
                  { label: 'Streak', val: '14d 🔥', color: '#FFD45C' },
                ].map(item => (
                  <div key={item.label} className="rounded-xl p-4 text-center border border-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-2xl font-bold" style={{ color: item.color }}>{item.val}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{item.label}</p>
                  </div>
                ))}
                <div className="col-span-3 rounded-xl p-4 border border-white/[0.06]"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Today's Timeline</p>
                  <div className="space-y-2">
                    {['Design landing page ✓', 'Review pull requests ✓', 'Update roadmap', 'Team standup'].map((t, i) => (
                      <div key={t} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${i < 2 ? 'bg-royal' : 'border border-white/20'}`}>
                          {i < 2 && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className={`text-xs ${i < 2 ? 'line-through text-slate-600' : 'text-slate-300'}`}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 border-y border-white/[0.06]" style={{ background: 'rgba(62,113,192,0.04)' }}>
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {stats.map(({ value, suffix, label, icon: Icon }, i) => (
            <Reveal key={label} delay={i * 0.1} className="text-center">
              <Icon className="w-6 h-6 text-royal-light mx-auto mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-white">
                <CountUp end={value} suffix={suffix} />
              </p>
              <p className="text-sm text-slate-400 mt-1">{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-royal-light text-xs font-bold uppercase tracking-[0.25em] mb-4">Features</p>
            <h2 className="text-4xl sm:text-5xl font-bold">Built for people who<br />
              <span style={{ background: 'linear-gradient(135deg,#5A8FD4,#3E71C0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                get things done
              </span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Every feature is crafted with intention — designed to help you focus on what matters most.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(62,113,192,0.15)' }}
                  className="h-full p-6 rounded-2xl border border-white/[0.08] transition-all duration-300 group"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border border-royal/25 group-hover:border-royal/50 transition-colors"
                    style={{ background: 'rgba(62,113,192,0.12)' }}>
                    <Icon className="w-6 h-6 text-royal-light" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-royal-light text-xs font-bold uppercase tracking-[0.25em] mb-4">How It Works</p>
            <h2 className="text-4xl font-bold">Three steps to clarity</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Set Your Goals', desc: 'Define what success looks like for you — big or small — with deadlines and milestones.' },
              { num: '02', title: 'Plan Your Days', desc: 'Break goals into daily tasks on a timeline. Drag, reorder, and focus with one click.' },
              { num: '03', title: 'Track & Celebrate', desc: 'Watch progress rings fill up. Complete tasks and earn satisfying confetti moments.' },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 0.12}>
                <div className="relative text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-royal/30"
                    style={{ background: 'linear-gradient(135deg, rgba(62,113,192,0.2), rgba(62,113,192,0.05))' }}>
                    <span className="text-royal-light font-bold text-lg">{step.num}</span>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px border-t border-dashed border-white/10" />
                  )}
                  <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4" style={{ background: 'rgba(62,113,192,0.03)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-royal-light text-xs font-bold uppercase tracking-[0.25em] mb-4">Testimonials</p>
            <h2 className="text-4xl font-bold">Loved by focused people</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl border border-white/[0.08]"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#3E71C0,#2a5499)' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{t.name}</p>
                      <p className="text-slate-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA ── */}
      <section className="py-28 px-4 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 blur-3xl opacity-30"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(62,113,192,0.3) 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <Logo className="h-14 w-14 mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Ready to transform<br />your productivity?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
              Join thousands of focused individuals who turn intent into action every single day.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(62,113,192,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-10 py-4 rounded-2xl font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #3E71C0, #2a5499)' }}
                >
                  Start for free <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
            <p className="text-slate-600 text-sm mt-6 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" /> Takes less than 30 seconds to get started
            </p>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
